const express = require('express');
const router = express.Router();
const Quotation = require('../models/Quotation');
const Invoice = require('../models/Invoice');
const { auth, adminAuth } = require('../middleware/auth');
const dbCheck = require('../middleware/dbCheck');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Get all quotations with pagination and filtering
router.get('/', adminAuth, dbCheck, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;
    
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { quotationNumber: { $regex: search, $options: 'i' } },
        { 'client.name': { $regex: search, $options: 'i' } },
        { 'client.email': { $regex: search, $options: 'i' } },
        { 'client.company': { $regex: search, $options: 'i' } }
      ];
    }
    
    const quotations = await Quotation.find(filter)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Quotation.countDocuments(filter);
    
    res.json({
      quotations,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single quotation
router.get('/:id', adminAuth, dbCheck, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .populate('convertedToInvoice');
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    
    res.json(quotation);
  } catch (error) {
    console.error('Error fetching quotation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new quotation
router.post('/', adminAuth, dbCheck, async (req, res) => {
  try {
    const quotationNumber = await Quotation.generateQuotationNumber();
    
    const quotationData = {
      ...req.body,
      quotationNumber,
      createdBy: req.user.id,
      lastModifiedBy: req.user.id
    };
    
    const quotation = new Quotation(quotationData);
    await quotation.save();
    
    const populatedQuotation = await Quotation.findById(quotation._id)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');
    
    res.status(201).json(populatedQuotation);
  } catch (error) {
    console.error('Error creating quotation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update quotation
router.put('/:id', adminAuth, dbCheck, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    
    // Don't allow editing if already accepted or rejected
    if (quotation.status === 'accepted' || quotation.status === 'rejected') {
      return res.status(400).json({ message: 'Cannot edit accepted or rejected quotations' });
    }
    
    Object.assign(quotation, req.body);
    quotation.lastModifiedBy = req.user.id;
    
    await quotation.save();
    
    const updatedQuotation = await Quotation.findById(quotation._id)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');
    
    res.json(updatedQuotation);
  } catch (error) {
    console.error('Error updating quotation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update quotation status
router.patch('/:id/status', adminAuth, dbCheck, async (req, res) => {
  try {
    const { status } = req.body;
    const quotation = await Quotation.findById(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    
    quotation.status = status;
    quotation.lastModifiedBy = req.user.id;
    
    // Set timestamps based on status
    switch (status) {
      case 'sent':
        quotation.sentAt = new Date();
        break;
      case 'accepted':
        quotation.acceptedAt = new Date();
        break;
      case 'rejected':
        quotation.rejectedAt = new Date();
        break;
    }
    
    await quotation.save();
    
    const updatedQuotation = await Quotation.findById(quotation._id)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');
    
    res.json(updatedQuotation);
  } catch (error) {
    console.error('Error updating quotation status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Convert quotation to invoice
router.post('/:id/convert-to-invoice', adminAuth, dbCheck, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    
    if (quotation.status !== 'accepted') {
      return res.status(400).json({ message: 'Only accepted quotations can be converted to invoices' });
    }
    
    if (quotation.convertedToInvoice) {
      return res.status(400).json({ message: 'Quotation has already been converted to invoice' });
    }
    
    const invoice = await quotation.convertToInvoice();
    
    res.json({
      message: 'Quotation converted to invoice successfully',
      invoice,
      quotation
    });
  } catch (error) {
    console.error('Error converting quotation to invoice:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate PDF for quotation
router.get('/:id/pdf', adminAuth, dbCheck, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    
    // Create PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="quotation-${quotation.quotationNumber}.pdf"`);
    res.setHeader('Cache-Control', 'no-cache');
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add Skyfalke logo and branding
    try {
      // Use local PNG logo file with controlled width
      const logoPath = path.join(__dirname, '../public/images/logo.png');
      
      // Check if file exists and is readable before trying to use it
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, 50, 50, { width: 120, fit: [120, 80] });
        } catch (imageError) {
          console.warn('Logo image loading failed (invalid image format):', imageError.message);
          // Continue without logo - don't throw error
        }
      } else {
        console.warn('Logo file not found at:', logoPath);
        // Continue without logo - don't throw error
      }
    } catch (logoError) {
      console.warn('Logo loading failed, continuing without logo:', logoError.message);
      // Continue without logo - don't throw error
    }
    
    // Company information
    doc.fontSize(10)
       .fillColor('#303661')
       .text('Email: info@skyfalke.com', 50, 80)
       .text('Phone: +254(071)797-238', 50, 95);
    
    // Quotation title and details
    doc.fontSize(20)
       .fillColor('#303661')
       .text('QUOTATION', 400, 50);
    
    doc.fontSize(10)
       .fillColor('#666')
       .text(`Quotation #: QT-${quotation.quotationNumber}`, 400, 80)
       .text(`Date: ${quotation.issueDate.toLocaleDateString()}`, 400, 95)
       .text(`Valid Until: ${quotation.expiryDate.toLocaleDateString()}`, 400, 110);
    
    // Client information
    doc.fontSize(14)
       .fillColor('#303661')
       .text('Bill To:', 50, 150);
    
    doc.fontSize(12)
       .fillColor('#000')
       .text(quotation.client.name, 50, 175);
    
    if (quotation.client.company) {
      doc.text(quotation.client.company, 50, 190);
    }
    
    doc.text(quotation.client.email, 50, 205);
    if (quotation.client.phone) {
      doc.text(quotation.client.phone, 50, 220);
    }
    
    // Items table
    let yPosition = 280;
    
    // Table header
    doc.fontSize(10)
       .fillColor('#303661')
       .text('Description', 50, yPosition)
       .text('Qty', 320, yPosition)
       .text('Unit Price', 370, yPosition)
       .text('Total', 450, yPosition);
    
    // Draw line under header
    doc.moveTo(50, yPosition + 15)
       .lineTo(550, yPosition + 15)
       .stroke('#303661');
    
    yPosition += 30;
    
    // Items
    const currencySymbol = quotation.currency === 'KES' ? 'KSh' : '$';
    const formatAmount = (amount) => {
      if (quotation.currency === 'KES') {
        return new Intl.NumberFormat('en-KE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      }
      return amount.toFixed(2);
    };
    
    quotation.items.forEach(item => {
      doc.fontSize(9)
         .fillColor('#000')
         .text(item.description, 50, yPosition, { width: 280 })
         .text(item.quantity.toString(), 320, yPosition, { width: 40 })
         .text(`${currencySymbol}${formatAmount(item.unitPrice)}`, 370, yPosition, { width: 70 })
         .text(`${currencySymbol}${formatAmount(item.total)}`, 450, yPosition, { width: 90 });
      
      yPosition += 25;
    });
    
    // Totals
    yPosition += 20;
    
    doc.moveTo(370, yPosition)
       .lineTo(550, yPosition)
       .stroke('#303661');
    
    yPosition += 15;
    
    doc.fontSize(10)
       .fillColor('#000')
       .text('Subtotal:', 370, yPosition)
       .text(`${currencySymbol}${formatAmount(quotation.subtotal)}`, 450, yPosition, { width: 90 });
    
    if (quotation.discount > 0) {
      yPosition += 20;
      doc.text('Discount:', 370, yPosition)
         .text(`-${currencySymbol}${formatAmount(quotation.discount)}`, 450, yPosition, { width: 90 });
    }
    
    if (quotation.taxRate > 0) {
      yPosition += 20;
      doc.text(`Tax (${quotation.taxRate}%):`, 370, yPosition)
         .text(`${currencySymbol}${formatAmount(quotation.taxAmount)}`, 450, yPosition, { width: 90 });
    }
    
    yPosition += 20;
    doc.moveTo(370, yPosition)
       .lineTo(550, yPosition)
       .stroke('#303661');
    
    yPosition += 15;
    
    doc.fontSize(12)
       .fillColor('#303661')
       .text('Total:', 370, yPosition)
       .text(`${currencySymbol}${formatAmount(quotation.total)}`, 450, yPosition, { width: 90 });
    
    // Notes
    if (quotation.notes) {
      yPosition += 40;
      doc.fontSize(10)
         .fillColor('#303661')
         .text('Notes:', 50, yPosition);
      
      doc.fontSize(9)
         .fillColor('#000')
         .text(quotation.notes, 50, yPosition + 15, { width: 500 });
    }
    
    // Terms
    if (quotation.terms) {
      yPosition += 60;
      doc.fontSize(10)
         .fillColor('#303661')
         .text('Terms & Conditions:', 50, yPosition);
      
      doc.fontSize(9)
         .fillColor('#000')
         .text(quotation.terms, 50, yPosition + 15, { width: 500 });
    }
    
    // Footer
    const pageHeight = doc.page.height;
    doc.fontSize(8)
       .fillColor('#666')
       .text('This quotation is valid for 30 days from the date of issue.', 50, pageHeight - 100)
       .text('Email: info@skyfalke.com | Phone: +254(071)797-238', 50, pageHeight - 80)
       .text('Authorized by Skyfalke Limited.', 50, pageHeight - 60)
       .text('Thank you for your business!', 50, pageHeight - 40);
    
    // Finalize PDF
    doc.end();
    
    // Handle PDF generation errors
    doc.on('error', (err) => {
      console.error('PDF generation error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error generating PDF' });
      }
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Send quotation by email
router.post('/:id/send', adminAuth, dbCheck, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    
    // Create transporter (configure with your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
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
      const currencySymbol = quotation.currency === 'KES' ? 'KSh' : '$';
      const formatAmount = (amount) => {
        if (quotation.currency === 'KES') {
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
        to: quotation.client.email,
        subject: `Quotation QT-${quotation.quotationNumber} from Skyfalke Limited`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #303661; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: #e0ae00;">SKYFALKE LIMITED</h1>
              <p style="margin: 5px 0 0 0; color: #e0ae00; font-size: 12px;">Email: info@skyfalke.com</p>
              <p style="margin: 5px 0 0 0; color: #e0ae00; font-size: 12px;">Phone: +254(071)797-238</p>
            </div>
            
            <div style="padding: 20px;">
              <h2 style="color: #303661;">Quotation Details</h2>
              <p>Dear ${quotation.client.name},</p>
              <p>Thank you for your interest in our services. Please find attached your quotation <strong>QT-${quotation.quotationNumber}</strong>.</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #e0ae00; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #303661;">Quotation Summary</h3>
                <p><strong>Quotation Number:</strong> QT-${quotation.quotationNumber}</p>
                <p><strong>Issue Date:</strong> ${quotation.issueDate.toLocaleDateString()}</p>
                <p><strong>Valid Until:</strong> ${quotation.expiryDate.toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ${currencySymbol}${formatAmount(quotation.total)}</p>
                <p><strong>Currency:</strong> ${quotation.currency}</p>
              </div>
              
              <p>This quotation is valid for 30 days from the date of issue. If you have any questions or would like to discuss the details, please don't hesitate to contact us.</p>
              
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
            filename: `quotation-${quotation.quotationNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      };
      
      try {
        // Send email
        await transporter.sendMail(mailOptions);
        
        // Update quotation status
        quotation.status = 'sent';
        quotation.sentAt = new Date();
        quotation.lastModifiedBy = req.user.id;
        await quotation.save();
        
        res.json({ message: 'Quotation sent successfully' });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        res.status(500).json({ message: 'Failed to send email' });
      }
    });
    
    // Generate PDF content (reuse the existing PDF generation logic)
    // Add Skyfalke logo and branding
    try {
      const logoPath = path.join(__dirname, '../public/images/logo.png');
      
      // Check if file exists and is readable before trying to use it
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, 50, 50, { width: 120, fit: [120, 80] });
        } catch (imageError) {
          console.warn('Logo image loading failed (invalid image format):', imageError.message);
          // Continue without logo - don't throw error
        }
      } else {
        console.warn('Logo file not found at:', logoPath);
        // Continue without logo - don't throw error
      }
    } catch (logoError) {
      console.warn('Logo loading failed, continuing without logo:', logoError.message);
      // Continue without logo - don't throw error
    }
    
    // Company information
    doc.fontSize(10)
       .fillColor('#303661')
       .text('Email: info@skyfalke.com', 50, 80)
       .text('Phone: +254(071)797-238', 50, 95);
    
    // Quotation title and details
    doc.fontSize(20)
       .fillColor('#303661')
       .text('QUOTATION', 400, 50);
    
    doc.fontSize(12)
       .fillColor('#000')
       .text(`Quotation #: QT-${quotation.quotationNumber}`, 400, 80)
       .text(`Date: ${quotation.issueDate.toLocaleDateString()}`, 400, 95)
       .text(`Valid Until: ${quotation.expiryDate.toLocaleDateString()}`, 400, 110);
    
    // Client information
    doc.fontSize(12)
       .fillColor('#303661')
       .text('Bill To:', 50, 150);
    
    doc.fontSize(12)
       .fillColor('#000')
       .text(quotation.client.name, 50, 175);
    
    if (quotation.client.company) {
      doc.text(quotation.client.company, 50, 190);
    }
    
    doc.text(quotation.client.email, 50, 205);
    if (quotation.client.phone) {
      doc.text(quotation.client.phone, 50, 220);
    }
    
    // Items table
    let yPosition = 280;
    
    // Table header
    doc.fontSize(10)
       .fillColor('#303661')
       .text('Description', 50, yPosition)
       .text('Qty', 320, yPosition)
       .text('Unit Price', 370, yPosition)
       .text('Total', 450, yPosition);
    
    // Draw line under header
    doc.moveTo(50, yPosition + 15)
       .lineTo(550, yPosition + 15)
       .stroke('#303661');
    
    yPosition += 30;
    
    // Items
    const currencySymbol = quotation.currency === 'KES' ? 'KSh' : '$';
    const formatAmount = (amount) => {
      if (quotation.currency === 'KES') {
        return new Intl.NumberFormat('en-KE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      }
      return amount.toFixed(2);
    };
    
    quotation.items.forEach(item => {
      doc.fontSize(9)
         .fillColor('#000')
         .text(item.description, 50, yPosition, { width: 280 })
         .text(item.quantity.toString(), 320, yPosition, { width: 40 })
         .text(`${currencySymbol}${formatAmount(item.unitPrice)}`, 370, yPosition, { width: 70 })
         .text(`${currencySymbol}${formatAmount(item.total)}`, 450, yPosition, { width: 90 });
      
      yPosition += 25;
    });
    
    // Totals
    yPosition += 20;
    
    doc.moveTo(370, yPosition)
       .lineTo(550, yPosition)
       .stroke('#303661');
    
    yPosition += 15;
    
    doc.fontSize(10)
       .fillColor('#000')
       .text('Subtotal:', 370, yPosition)
       .text(`${currencySymbol}${formatAmount(quotation.subtotal)}`, 450, yPosition, { width: 90 });
    
    if (quotation.discount > 0) {
      yPosition += 20;
      doc.text('Discount:', 370, yPosition)
         .text(`-${currencySymbol}${formatAmount(quotation.discount)}`, 450, yPosition, { width: 90 });
    }
    
    if (quotation.taxRate > 0) {
      yPosition += 20;
      doc.text(`Tax (${quotation.taxRate}%):`, 370, yPosition)
         .text(`${currencySymbol}${formatAmount(quotation.taxAmount)}`, 450, yPosition, { width: 90 });
    }
    
    yPosition += 20;
    doc.moveTo(370, yPosition)
       .lineTo(550, yPosition)
       .stroke('#303661');
    
    yPosition += 15;
    
    doc.fontSize(12)
       .fillColor('#303661')
       .text('Total:', 370, yPosition)
       .text(`${currencySymbol}${formatAmount(quotation.total)}`, 450, yPosition, { width: 90 });
    
    // Notes
    if (quotation.notes) {
      yPosition += 40;
      doc.fontSize(10)
         .fillColor('#303661')
         .text('Notes:', 50, yPosition);
      
      doc.fontSize(9)
         .fillColor('#000')
         .text(quotation.notes, 50, yPosition + 15, { width: 500 });
    }
    
    // Footer
    const pageHeight = doc.page.height;
    doc.fontSize(10)
       .fillColor('#666')
       .text('This quotation is valid for 30 days from the date of issue.', 50, pageHeight - 100)
       .text('Email: info@skyfalke.com | Phone: +254(071)797-238', 50, pageHeight - 80)
       .text('Authorized by Skyfalke Limited.', 50, pageHeight - 60)
       .text('Thank you for your business!', 50, pageHeight - 40);
    
    doc.end();
    
  } catch (error) {
    console.error('Error sending quotation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete quotation
router.delete('/:id', adminAuth, dbCheck, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    
    // Don't allow deletion if already sent
    if (quotation.status !== 'draft') {
      return res.status(400).json({ message: 'Cannot delete sent quotations' });
    }
    
    await Quotation.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    console.error('Error deleting quotation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quotation statistics
router.get('/stats/overview', adminAuth, dbCheck, async (req, res) => {
  try {
    const stats = await Quotation.aggregate([
      {
        $group: {
          _id: null,
          totalQuotations: { $sum: 1 },
          totalValue: { $sum: '$total' },
          draftQuotations: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          sentQuotations: {
            $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] }
          },
          acceptedQuotations: {
            $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
          },
          rejectedQuotations: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          },
          expiredQuotations: {
            $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] }
          }
        }
      }
    ]);
    
    res.json(stats[0] || {
      totalQuotations: 0,
      totalValue: 0,
      draftQuotations: 0,
      sentQuotations: 0,
      acceptedQuotations: 0,
      rejectedQuotations: 0,
      expiredQuotations: 0
    });
  } catch (error) {
    console.error('Error fetching quotation stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
