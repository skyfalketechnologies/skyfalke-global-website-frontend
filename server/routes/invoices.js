const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { adminAuth } = require('../middleware/auth');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs').promises;
const path = require('path');

// Get all invoices with pagination and filtering
router.get('/', adminAuth, async (req, res) => {
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

// Get single invoice
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');

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
router.post('/', adminAuth, async (req, res) => {
  try {
    const invoiceData = req.body;
    
    // Generate invoice number
    invoiceData.invoiceNumber = await Invoice.generateInvoiceNumber();
    invoiceData.createdBy = req.user.id;

    const invoice = new Invoice(invoiceData);
    await invoice.save();

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedInvoice,
      message: 'Invoice created successfully'
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
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const invoiceData = req.body;
    invoiceData.lastModifiedBy = req.user.id;

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

    res.json({
      success: true,
      data: invoice,
      message: 'Invoice updated successfully'
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
router.delete('/:id', adminAuth, async (req, res) => {
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
router.get('/:id/pdf', adminAuth, async (req, res) => {
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
router.post('/:id/send', adminAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Create transporter (configure with your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
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
      const mailOptions = {
        from: `"Skyfalke Limited" <${process.env.EMAIL_USER}>`,
        to: invoice.client.email,
        subject: `Invoice INV-${invoice.invoiceNumber} from Skyfalke Limited`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #303661; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: #e0ae00;">SKYFALKE LIMITED</h1>
              <p style="margin: 5px 0 0 0; color: #e0ae00; font-size: 12px;">Email: info@skyfalke.com</p>
              <p style="margin: 5px 0 0 0; color: #e0ae00; font-size: 12px;">Phone: +254(071)797-238</p>
            </div>
            
            <div style="padding: 20px;">
              <h2 style="color: #303661;">Invoice Details</h2>
              <p>Dear ${invoice.client.name},</p>
              <p>Please find attached your invoice <strong>INV-${invoice.invoiceNumber}</strong> for the services provided.</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #e0ae00; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #303661;">Invoice Summary</h3>
                <p><strong>Invoice Number:</strong> INV-${invoice.invoiceNumber}</p>
                <p><strong>Issue Date:</strong> ${invoice.issueDate.toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> ${invoice.dueDate.toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ${currencySymbol}${formatAmount(invoice.total)}</p>
                <p><strong>Currency:</strong> ${invoice.currency}</p>
                <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
              </div>
              
              <p>Payment is due within the specified timeframe. If you have any questions about this invoice, please don't hesitate to contact us.</p>
              
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
                  <span style="color: #8f7622; font-size: 12px;">Email: info@skyfalke.com | Phone: +254(071)797-238</span>
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

// Mark invoice as paid
router.patch('/:id/paid', adminAuth, async (req, res) => {
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

    res.json({
      success: true,
      data: invoice,
      message: 'Invoice marked as paid'
    });
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice status'
    });
  }
});

// Get invoice statistics
router.get('/stats/overview', adminAuth, async (req, res) => {
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

// Helper function to generate PDF content
async function generateInvoicePDF(doc, invoice) {
  // Company header with logo
  try {
    // Use local PNG logo file with controlled width
    const logoPath = path.join(__dirname, '../public/images/logo.png');
    doc.image(logoPath, 50, 50, { width: 120, fit: [120, 80] });
  } catch (logoError) {
    console.log('Logo loading failed, continuing without logo:', logoError.message);
    // Continue without logo - don't throw error
  }
  
  doc.fontSize(10)
     .fillColor('#303661')
     .text('Email: info@skyfalke.com', 50, 80)
     .text('Phone: +254(071)797-238', 50, 95)
     .text('PIN: P052474944J', 50, 110);

  // Invoice details
  doc.fontSize(20)
     .fillColor('#303661')
     .text('INVOICE', 400, 50);

  doc.fontSize(12)
     .fillColor('#666')
     .text(`Invoice #: ${invoice.formattedNumber}`, 400, 80)
     .text(`Date: ${invoice.issueDate.toLocaleDateString()}`, 400, 95)
     .text(`Due: ${invoice.dueDate.toLocaleDateString()}`, 400, 110);

  // Client details
  doc.fontSize(14)
     .fillColor('#303661')
     .text('Bill To:', 50, 150);

  doc.fontSize(12)
     .fillColor('#333')
     .text(invoice.client.name, 50, 170)
     .text(invoice.client.email, 50, 185);

  if (invoice.client.address.street) {
    doc.text(invoice.client.address.street, 50, 200);
    doc.text(`${invoice.client.address.city}, ${invoice.client.address.state} ${invoice.client.address.zipCode}`, 50, 215);
  }

  // Items table
  let yPosition = 250;
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
  
  // Table header
  doc.rect(50, yPosition, 520, 30)
     .fill('#303661');
  
  doc.fillColor('white')
     .fontSize(12)
     .text('Description', 60, yPosition + 10)
     .text('Qty', 350, yPosition + 10)
     .text('Price', 400, yPosition + 10)
     .text('Total', 480, yPosition + 10);

  yPosition += 30;

  // Table rows
  invoice.items.forEach(item => {
    doc.rect(50, yPosition, 520, 30)
       .stroke();
    
    doc.fillColor('#333')
       .fontSize(10)
       .text(item.description, 60, yPosition + 10, { width: 280 })
       .text(item.quantity.toString(), 350, yPosition + 10, { width: 40 })
       .text(`${currencySymbol}${formatAmount(item.unitPrice)}`, 400, yPosition + 10, { width: 70 })
       .text(`${currencySymbol}${formatAmount(item.total)}`, 480, yPosition + 10, { width: 80 });
    
    yPosition += 30;
  });

  // Totals
  yPosition += 20;
  
  doc.fontSize(12)
     .fillColor('#333')
     .text(`Subtotal: ${currencySymbol}${formatAmount(invoice.subtotal)}`, 400, yPosition, { width: 170 });
  
  if (invoice.taxRate > 0) {
    yPosition += 20;
    doc.text(`Tax (${invoice.taxRate}%): ${currencySymbol}${formatAmount(invoice.taxAmount)}`, 400, yPosition, { width: 170 });
  }
  
  if (invoice.discount > 0) {
    yPosition += 20;
    doc.text(`Discount: -${currencySymbol}${formatAmount(invoice.discount)}`, 400, yPosition, { width: 170 });
  }
  
  yPosition += 20;
  doc.fontSize(14)
     .fillColor('#303661')
     .text(`Total: ${currencySymbol}${formatAmount(invoice.total)}`, 400, yPosition, { width: 170 });

  // Payment instructions
  if (invoice.paymentInstructions) {
    yPosition += 40;
    doc.fontSize(12)
       .fillColor('#303661')
       .text('Payment Instructions:', 50, yPosition);
    
    yPosition += 20;
    doc.fillColor('#333')
       .text(invoice.paymentInstructions, 50, yPosition);
  }

  // Notes
  if (invoice.notes) {
    yPosition += 40;
    doc.fontSize(12)
       .fillColor('#303661')
       .text('Notes:', 50, yPosition);
    
    yPosition += 20;
    doc.fillColor('#333')
       .text(invoice.notes, 50, yPosition);
  }

  // Footer
  const pageHeight = doc.page.height;
  doc.fontSize(8)
     .fillColor('#666')
     .text('Email: info@skyfalke.com | Phone: +254(071)797-238', 50, pageHeight - 80)
     .text('Authorized by Skyfalke Limited.', 50, pageHeight - 60)
     .text('Thank you for your business!', 50, pageHeight - 40);
}

module.exports = router;
