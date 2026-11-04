const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { accountingAuth } = require('../middleware/auth');
const { postInvoicePaymentJournal } = require('../utils/invoiceJournalPosting');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs').promises;
const path = require('path');
const { getBrand, paymentOptions } = require('../config/invoiceBrands');
const Customer = require('../models/Customer');
const Service = require('../models/Service');

// Save the invoice's client and line items for reuse on future invoices.
// Failures here should never block invoice creation.
async function saveCustomerAndServices(invoice) {
  try {
    if (invoice.client?.email) {
      await Customer.findOneAndUpdate(
        { email: invoice.client.email.toLowerCase() },
        {
          $set: {
            name: invoice.client.name,
            phone: invoice.client.phone,
            address: invoice.client.address,
            company: invoice.client.company,
            taxId: invoice.client.taxId,
            lastInvoicedAt: new Date()
          }
        },
        { upsert: true, runValidators: true }
      );
    }
    for (const item of invoice.items || []) {
      if (!item.description) continue;
      await Service.findOneAndUpdate(
        { description: item.description.trim() },
        { $set: { unitPrice: item.unitPrice, currency: invoice.currency, lastUsedAt: new Date() } },
        { upsert: true, runValidators: true }
      );
    }
  } catch (err) {
    console.error('Failed to save customer/services for reuse:', err.message);
  }
}

// Get all invoices with pagination and filtering
router.get('/', accountingAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.client) {
      filter['client.name'] = { $regex: req.query.client, $options: 'i' };
    }
    if (req.query.dateFrom || req.query.dateTo) {
      filter.issueDate = {};
      if (req.query.dateFrom) {
        filter.issueDate.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        filter.issueDate.$lte = new Date(req.query.dateTo);
      }
    }

    const invoices = await Invoice.find(filter)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Invoice.countDocuments(filter);

    res.json({
      success: true,
      data: {
        invoices,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices'
    });
  }
});

// Get invoice statistics (must be before /:id)
router.get('/stats/overview', accountingAuth, async (req, res) => {
  try {
    const stats = await Invoice.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' }
        }
      }
    ]);

    const totalInvoices = await Invoice.countDocuments();
    const totalRevenue = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      success: true,
      data: {
        stats,
        totalInvoices,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching invoice stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice statistics'
    });
  }
});

// Get single invoice
router.get('/:id', accountingAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .populate('paymentJournalEntry', 'entryNumber description status');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice'
    });
  }
});

// Create new invoice
router.post('/', accountingAuth, async (req, res) => {
  try {
    const invoiceData = req.body;
    
    // Generate invoice number
    invoiceData.invoiceNumber = await Invoice.generateInvoiceNumber();
    invoiceData.createdBy = req.user._id || req.user.id;

    const invoice = new Invoice(invoiceData);
    await invoice.save();

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('createdBy', 'name email');

    await saveCustomerAndServices(invoice);

    let journalWarning;
    if (populatedInvoice.status === 'paid') {
      try {
        await postInvoicePaymentJournal(populatedInvoice, req.user._id || req.user.id, req);
      } catch (je) {
        console.error('Invoice payment journal post failed:', je.message);
        journalWarning = je.message;
      }
    }

    res.status(201).json({
      success: true,
      data: populatedInvoice,
      message: 'Invoice created successfully',
      ...(journalWarning && { journalWarning })
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice'
    });
  }
});

// Update invoice
router.put('/:id', accountingAuth, async (req, res) => {
  try {
    const invoiceData = req.body;
    const prev = await Invoice.findById(req.params.id).lean();
    invoiceData.lastModifiedBy = req.user._id || req.user.id;

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      invoiceData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('lastModifiedBy', 'name email');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    await saveCustomerAndServices(invoice);

    let journalWarning;
    const becamePaid = invoice.status === 'paid' && prev?.status !== 'paid';
    if (becamePaid) {
      try {
        await postInvoicePaymentJournal(invoice, req.user._id || req.user.id, req);
      } catch (je) {
        console.error('Invoice payment journal post failed:', je.message);
        journalWarning = je.message;
      }
    }

    res.json({
      success: true,
      data: invoice,
      message: 'Invoice updated successfully',
      ...(journalWarning && { journalWarning })
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice'
    });
  }
});

// Delete invoice
router.delete('/:id', accountingAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete invoice'
    });
  }
});

// Generate PDF
router.get('/:id/pdf', accountingAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Create PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    await generateInvoicePDF(doc, invoice);
    
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF'
    });
  }
});

// Send invoice by email
router.post('/:id/send', accountingAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Finance emails are sent from the billing account (falls back to the main account)
    const billingUser = process.env.BILLING_EMAIL_USER || process.env.EMAIL_USER;
    const billingPass = process.env.BILLING_EMAIL_PASS || process.env.EMAIL_PASS;
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: billingUser,
        pass: billingPass
      }
    });
    
    // Generate PDF for attachment
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(chunks);
      
      // Currency formatting
      const currencySymbol = invoice.currency === 'KES' ? 'KSh' : '$';
      const formatAmount = (amount) => {
        if (invoice.currency === 'KES') {
          return new Intl.NumberFormat('en-KE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
        return amount.toFixed(2);
      };
      
      // Email content with proper currency formatting
      const brand = getBrand(invoice.invoiceType);
      const mailOptions = {
        from: `"Skyfalke Limited" <${billingUser}>`,
        to: invoice.client.email,
        subject: `Invoice INV-${invoice.invoiceNumber} from Skyfalke Limited`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: ${brand.primaryColor}; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff;">${brand.companyName}</h1>
              <p style="margin: 5px 0 0 0; color: #ffffff; opacity: 0.85; font-size: 12px;">${brand.tagline}</p>
              <p style="margin: 5px 0 0 0; color: #ffffff; opacity: 0.85; font-size: 12px;">Email: ${brand.email} | Phone: ${brand.phone}</p>
            </div>

            <div style="padding: 20px;">
              <h2 style="color: ${brand.primaryColor};">Invoice Details</h2>
              <p>Dear ${invoice.client.name},</p>
              <p>Please find attached your invoice <strong>INV-${invoice.invoiceNumber}</strong> for the services provided.</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid ${brand.accentColor}; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: ${brand.primaryColor};">Invoice Summary</h3>
                <p><strong>Invoice Number:</strong> INV-${invoice.invoiceNumber}</p>
                <p><strong>Issue Date:</strong> ${invoice.issueDate.toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> ${invoice.dueDate.toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ${currencySymbol}${formatAmount(invoice.total)}</p>
                <p><strong>Currency:</strong> ${invoice.currency}</p>
                <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
              </div>
              
              <p>Payment is due within the specified timeframe. If you have any questions about this invoice, please don't hesitate to contact us.</p>

              <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid ${brand.primaryColor}; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: ${brand.primaryColor};">Payment Options</h3>
                <p style="margin: 0 0 5px 0;"><strong>M-Pesa:</strong> Paybill ${paymentOptions.mpesa.paybill}, Account No. INV-${invoice.invoiceNumber}</p>
                <p style="margin: 0 0 5px 0;"><strong>Bank:</strong> ${paymentOptions.bank.name}, ${paymentOptions.bank.branch} — Account Name: ${paymentOptions.bank.accountName}, Account No. ${paymentOptions.bank.accountNumber}, Currency: ${paymentOptions.bank.currency}</p>
              </div>

              ${invoice.paymentInstructions ? `
                <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
                  <h4 style="margin: 0 0 10px 0; color: #856404;">Payment Instructions</h4>
                  <p style="margin: 0; color: #856404;">${invoice.paymentInstructions}</p>
                </div>
              ` : ''}
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px;">
                  Best regards,<br>
                  <strong>Skyfalke Limited Team</strong><br>
                  <span style="color: #8f7622; font-size: 12px;">Email: billing@skyfalke.com | Phone: +254(071)797-238</span>
                </p>
              </div>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `invoice-${invoice.invoiceNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      };
      
      try {
        // Send email
        await transporter.sendMail(mailOptions);

        // Also notify via WhatsApp invoice_ready template if client has a phone number
        if (invoice.client?.phone) {
          try {
            const { sendTemplateMessage } = require('../services/whatsappService');
            const amountFormatted = invoice.currency === 'KES'
              ? `KSh ${new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2 }).format(invoice.total)} KES`
              : `$${invoice.total.toFixed(2)} USD`;
            await sendTemplateMessage(invoice.client.phone, 'invoice_ready', [
              { name: 'customer_name', value: invoice.client.name },
              { name: 'invoice', value: invoice.formattedNumber },
              { name: 'amount', value: amountFormatted }
            ], { language: 'en' });
          } catch (waErr) {
            console.error('WhatsApp invoice_ready notification failed (non-fatal):', waErr.message);
          }
        }

        // Update invoice status
        invoice.status = 'sent';
        invoice.sentAt = new Date();
        await invoice.save();

        res.json({
          success: true,
          message: 'Invoice sent successfully'
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        res.status(500).json({
          success: false,
          message: 'Failed to send email'
        });
      }
    });
    
    // Generate PDF content using the existing helper function
    await generateInvoicePDF(doc, invoice);
    doc.end();

  } catch (error) {
    console.error('Error sending invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Send invoice via WhatsApp
router.post('/:id/send-whatsapp', accountingAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const phone = req.body.phone || invoice.client?.phone;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'No phone number provided' });
    }

    const template = req.body.template === 'google_workspace_payment_reminder'
      ? 'google_workspace_payment_reminder'
      : 'invoice_ready';

    const { sendTemplateMessage } = require('../services/whatsappService');

    const amountFormatted = invoice.currency === 'KES'
      ? `KSh ${new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2 }).format(invoice.total)} KES`
      : `$${invoice.total.toFixed(2)} USD`;

    const templateParams = template === 'google_workspace_payment_reminder'
      ? [
        { name: 'customer_name', value: invoice.client.name },
        { name: 'due_date', value: new Date(invoice.dueDate).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' }) },
        { name: 'service', value: invoice.items?.[0]?.description || 'Google Workspace' },
        { name: 'amount_due', value: amountFormatted },
        { name: 'invoice_number', value: invoice.formattedNumber }
      ]
      : [
        { name: 'customer_name', value: invoice.client.name },
        { name: 'invoice', value: invoice.formattedNumber },
        { name: 'amount', value: amountFormatted }
      ];

    await sendTemplateMessage(phone, template, templateParams, {
      language: 'en',
      sentBy: req.user._id
    });

    invoice.status = 'sent';
    invoice.sentAt = new Date();
    await invoice.save();

    res.json({ success: true, message: 'Invoice sent via WhatsApp successfully' });
  } catch (error) {
    console.error('Error sending invoice via WhatsApp:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message || 'Failed to send invoice via WhatsApp'
    });
  }
});

// Mark invoice as paid
router.patch('/:id/paid', accountingAuth, async (req, res) => {
  try {
    const { paymentMethod, paymentReference } = req.body;
    
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        status: 'paid',
        paidAt: new Date(),
        paymentMethod,
        paymentReference
      },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    let journalWarning;
    try {
      await postInvoicePaymentJournal(invoice, req.user._id || req.user.id, req);
    } catch (je) {
      console.error('Invoice payment journal post failed:', je.message);
      journalWarning = je.message;
    }

    res.json({
      success: true,
      data: invoice,
      message: 'Invoice marked as paid',
      ...(journalWarning && { journalWarning })
    });
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice status'
    });
  }
});

// Helper function to generate PDF content
async function generateInvoicePDF(doc, invoice) {
  const brand = getBrand(invoice.invoiceType);
  const pageWidth = doc.page.width;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  const currencySymbol = invoice.currency === 'KES' ? 'KSh ' : '$';
  const formatAmount = (amount) => {
    return new Intl.NumberFormat(invoice.currency === 'KES' ? 'en-KE' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };
  const money = (amount) => `${currencySymbol}${formatAmount(amount)}`;
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // ── Top accent bar ──
  doc.rect(0, 0, pageWidth, 8).fill(brand.primaryColor);

  // ── Header: logo left, INVOICE + meta right ──
  try {
    doc.image(brand.logoPath, margin, 40, { fit: [brand.logoWidth, 55] });
  } catch (logoError) {
    console.log('Logo loading failed, continuing without logo:', logoError.message);
    doc.font('Helvetica-Bold').fontSize(18).fillColor(brand.primaryColor)
       .text(brand.companyName, margin, 50);
  }

  doc.font('Helvetica-Bold').fontSize(11).fillColor(brand.primaryColor)
     .text(brand.companyName, margin, 105);
  doc.font('Helvetica').fontSize(9).fillColor('#555555')
     .text(brand.tagline, margin, 119)
     .text(brand.address, margin, 132)
     .text(`${brand.email}  |  ${brand.phone}`, margin, 145)
     .text(`PIN: ${brand.taxPin}`, margin, 158);

  doc.font('Helvetica-Bold').fontSize(26).fillColor(brand.primaryColor)
     .text('INVOICE', margin, 42, { width: contentWidth, align: 'right' });

  const metaLabelX = pageWidth - margin - 200;
  const metaValueX = pageWidth - margin - 110;
  const metaRows = [
    ['Invoice No.', invoice.formattedNumber],
    ['Issue Date', formatDate(invoice.issueDate)],
    ['Due Date', formatDate(invoice.dueDate)],
    ['Status', (invoice.status || 'draft').toUpperCase()]
  ];
  let metaY = 82;
  metaRows.forEach(([label, value]) => {
    doc.font('Helvetica').fontSize(9).fillColor('#777777')
       .text(label, metaLabelX, metaY, { width: 85 });
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#333333')
       .text(value, metaValueX, metaY, { width: 110, align: 'right' });
    metaY += 15;
  });

  // ── Bill To panel ──
  let y = 190;
  doc.roundedRect(margin, y, contentWidth, 78, 4).fill(brand.lightBg);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(brand.primaryColor)
     .text('BILL TO', margin + 15, y + 12);
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#222222')
     .text(invoice.client.name, margin + 15, y + 27);

  const clientLines = [];
  if (invoice.client.company) clientLines.push(invoice.client.company);
  clientLines.push(invoice.client.email);
  if (invoice.client.phone) clientLines.push(invoice.client.phone);
  doc.font('Helvetica').fontSize(9).fillColor('#555555');
  clientLines.slice(0, 2).forEach((line, i) => {
    doc.text(line, margin + 15, y + 43 + i * 13);
  });

  const addr = invoice.client.address || {};
  const addressLines = [
    addr.street,
    [addr.city, addr.state, addr.zipCode].filter(Boolean).join(', '),
    addr.country
  ].filter(Boolean);
  addressLines.slice(0, 4).forEach((line, i) => {
    doc.text(line, margin + contentWidth / 2, y + 27 + i * 13, { width: contentWidth / 2 - 30 });
  });

  // ── Items table ──
  y += 100;
  const col = {
    desc: { x: margin + 12, width: 250 },
    qty: { x: margin + 275, width: 45 },
    price: { x: margin + 325, width: 85 },
    total: { x: margin + 415, width: contentWidth - 427 }
  };
  const headerHeight = 26;

  const drawTableHeader = () => {
    doc.rect(margin, y, contentWidth, headerHeight).fill(brand.primaryColor);
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#ffffff')
       .text('DESCRIPTION', col.desc.x, y + 8, { width: col.desc.width })
       .text('QTY', col.qty.x, y + 8, { width: col.qty.width, align: 'right' })
       .text('UNIT PRICE', col.price.x, y + 8, { width: col.price.width, align: 'right' })
       .text('AMOUNT', col.total.x, y + 8, { width: col.total.width, align: 'right' });
    y += headerHeight;
  };
  drawTableHeader();

  doc.font('Helvetica').fontSize(9);
  invoice.items.forEach((item, index) => {
    const descHeight = doc.heightOfString(item.description || '', { width: col.desc.width });
    const rowHeight = Math.max(24, descHeight + 12);

    // New page if the row would overflow
    if (y + rowHeight > doc.page.height - 160) {
      doc.addPage();
      y = margin;
      drawTableHeader();
      doc.font('Helvetica').fontSize(9);
    }

    if (index % 2 === 1) {
      doc.rect(margin, y, contentWidth, rowHeight).fill('#f7f8fa');
    }
    doc.fillColor('#333333')
       .text(item.description, col.desc.x, y + 7, { width: col.desc.width })
       .text(String(item.quantity), col.qty.x, y + 7, { width: col.qty.width, align: 'right' })
       .text(money(item.unitPrice), col.price.x, y + 7, { width: col.price.width, align: 'right' })
       .text(money(item.total), col.total.x, y + 7, { width: col.total.width, align: 'right' });
    y += rowHeight;
  });
  doc.moveTo(margin, y).lineTo(pageWidth - margin, y)
     .lineWidth(0.5).strokeColor('#cccccc').stroke();

  // ── Totals box (right-aligned) ──
  y += 15;
  if (y > doc.page.height - 220) {
    doc.addPage();
    y = margin;
  }
  const totalsX = pageWidth - margin - 230;
  const totalsRow = (label, value, opts = {}) => {
    doc.font(opts.bold ? 'Helvetica-Bold' : 'Helvetica')
       .fontSize(opts.bold ? 11 : 9)
       .fillColor(opts.color || '#555555')
       .text(label, totalsX, y, { width: 120 });
    doc.fillColor(opts.color || '#333333')
       .text(value, totalsX + 120, y, { width: 110, align: 'right' });
    y += opts.bold ? 22 : 17;
  };

  totalsRow('Subtotal', money(invoice.subtotal));
  if (invoice.discount > 0) {
    totalsRow('Discount', `-${money(invoice.discount)}`);
  }
  if (invoice.taxRate > 0) {
    totalsRow(`Tax / VAT (${invoice.taxRate}%)`, money(invoice.taxAmount));
  }
  doc.roundedRect(totalsX - 10, y - 3, 240, 26, 3).fill(brand.primaryColor);
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#ffffff')
     .text('TOTAL DUE', totalsX, y + 4, { width: 120 })
     .text(money(invoice.total), totalsX + 120, y + 4, { width: 110, align: 'right' });
  y += 45;

  // ── Payment options panel (M-Pesa + Bank) ──
  const panelHeight = 108;
  if (y + panelHeight > doc.page.height - 130) {
    doc.addPage();
    y = margin;
  }
  doc.roundedRect(margin, y, contentWidth, panelHeight, 4).fill(brand.lightBg);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(brand.primaryColor)
     .text('PAYMENT OPTIONS', margin + 15, y + 12);

  const colLeftX = margin + 15;
  const colRightX = margin + contentWidth / 2 + 10;
  let payY = y + 32;

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#333333')
     .text('M-Pesa', colLeftX, payY);
  doc.font('Helvetica').fontSize(9).fillColor('#444444')
     .text(`Paybill: ${paymentOptions.mpesa.paybill}`, colLeftX, payY + 14)
     .text(`Account No.: ${invoice.formattedNumber}`, colLeftX, payY + 28)
     .text(`(${paymentOptions.mpesa.accountNote})`, colLeftX, payY + 42, { width: contentWidth / 2 - 30 });

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#333333')
     .text('Bank Transfer', colRightX, payY);
  doc.font('Helvetica').fontSize(9).fillColor('#444444')
     .text(`Bank: ${paymentOptions.bank.name}, ${paymentOptions.bank.branch}`, colRightX, payY + 14)
     .text(`Account Name: ${paymentOptions.bank.accountName}`, colRightX, payY + 28)
     .text(`Account No.: ${paymentOptions.bank.accountNumber}`, colRightX, payY + 42)
     .text(`Currency: ${paymentOptions.bank.currency}`, colRightX, payY + 56);

  y += panelHeight + 18;

  // ── Payment instructions / notes / terms ──
  const infoSection = (title, body) => {
    if (!body) return;
    const bodyHeight = doc.font('Helvetica').fontSize(9)
      .heightOfString(body, { width: contentWidth });
    if (y + bodyHeight > doc.page.height - 130) {
      doc.addPage();
      y = margin;
    }
    doc.font('Helvetica-Bold').fontSize(10).fillColor(brand.primaryColor)
       .text(title, margin, y);
    y += 15;
    doc.font('Helvetica').fontSize(9).fillColor('#444444')
       .text(body, margin, y, { width: contentWidth });
    y += bodyHeight + 18;
  };

  infoSection('Payment Instructions', invoice.paymentInstructions);
  infoSection('Notes', invoice.notes);
  infoSection('Terms & Conditions', invoice.terms);

  // ── Footer ──
  const pageHeight = doc.page.height;
  doc.moveTo(margin, pageHeight - 90).lineTo(pageWidth - margin, pageHeight - 90)
     .lineWidth(0.5).strokeColor(brand.accentColor).stroke();
  doc.font('Helvetica-Bold').fontSize(9).fillColor(brand.primaryColor)
     .text('Thank you for your business!', margin, pageHeight - 78, { width: contentWidth, align: 'center' });
  doc.font('Helvetica').fontSize(8).fillColor('#777777')
     .text(`${brand.email}  |  ${brand.phone}`, margin, pageHeight - 64, { width: contentWidth, align: 'center' });
  if (brand.footerNote) {
    doc.text(brand.footerNote, margin, pageHeight - 52, { width: contentWidth, align: 'center' });
  }
}

module.exports = router;
