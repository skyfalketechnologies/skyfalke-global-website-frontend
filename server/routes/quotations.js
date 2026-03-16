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

// ─── Brand Tokens ────────────────────────────────────────────────────────────
const BRAND = {
  navy:        '#303661',   // logo primary (exact match)
  navyMid:     '#3a4175',   // slightly lighter for geometric overlay
  gold:        '#E0AE00',   // logo gold (exact match)
  goldLight:   '#f0cc40',   // lighter gold for text on dark bg
  goldPale:    '#fffbe6',   // very pale gold for tinted boxes/rows
  white:       '#ffffff',
  offWhite:    '#f9fafb',
  gray100:     '#f1f4f8',
  gray200:     '#e2e8f0',
  gray400:     '#94a3b8',
  gray700:     '#374151',
  ink:         '#1a1f36',   // body text
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// Draw a filled rounded rectangle (PDFKit has no native roundedRect fill helper)
function roundedRect(doc, x, y, w, h, r, fillColor, strokeColor) {
  doc.save();
  doc.roundedRect(x, y, w, h, r);
  if (fillColor) {
    doc.fillColor(fillColor);
    strokeColor ? doc.fillAndStroke(fillColor, strokeColor) : doc.fill();
  } else if (strokeColor) {
    doc.strokeColor(strokeColor).stroke();
  }
  doc.restore();
}

// Draw diagonal hatching pattern (decorative background element)
function drawHatch(doc, x, y, w, h, color, spacing = 12, alpha = 0.08) {
  doc.save();
  doc.rect(x, y, w, h).clip();
  const [r, g, b] = hexToRgb(color);
  doc.strokeColor(`rgb(${r},${g},${b})`).opacity(alpha).lineWidth(0.6);
  for (let i = -h; i < w + h; i += spacing) {
    doc.moveTo(x + i, y).lineTo(x + i + h, y + h).stroke();
  }
  doc.restore();
  doc.opacity(1);
}

// Thin decorative rule
function rule(doc, x, y, width, color = BRAND.gold, thickness = 0.8) {
  doc.save().strokeColor(color).lineWidth(thickness)
    .moveTo(x, y).lineTo(x + width, y).stroke().restore();
}

/**
 * Builds a professional, corporate quotation PDF.
 * @param {PDFKit.PDFDocument} doc
 * @param {Object} quotation
 * @param {Object} opts - { logoPath }
 */
function buildQuotationPDF(doc, quotation, opts = {}) {
  const PW   = doc.page.width;   // 595 pt (A4)
  const PH   = doc.page.height;  // 842 pt
  const M    = 48;               // page margin
  const CW   = PW - M * 2;      // content width

  const currencySymbol = quotation.currency === 'KES' ? 'KSh' : '$';
  const fmtAmt = (amount) => {
    if (quotation.currency === 'KES') {
      return new Intl.NumberFormat('en-KE', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
      }).format(amount);
    }
    return amount.toFixed(2);
  };

  // ── 1. HEADER BAND ──────────────────────────────────────────────────────────
  const HEADER_H = 100;

  // Base navy fill
  doc.fillColor(BRAND.navy).rect(0, 0, PW, HEADER_H).fill();

  // Subtle diagonal hatch overlay for texture
  drawHatch(doc, 0, 0, PW, HEADER_H, BRAND.white, 14, 0.04);

  // Decorative right-side geometric block (layered triangles effect)
  doc.save();
  doc.fillColor(BRAND.navyMid).opacity(0.7)
    .moveTo(PW - 160, 0).lineTo(PW, 0).lineTo(PW, HEADER_H).lineTo(PW - 100, HEADER_H).closePath().fill();
  doc.fillColor(BRAND.gold).opacity(0.15)
    .moveTo(PW - 90, 0).lineTo(PW, 0).lineTo(PW, HEADER_H).closePath().fill();
  doc.restore();
  doc.opacity(1);

  // Gold accent bar at bottom of header
  doc.fillColor(BRAND.gold).rect(0, HEADER_H - 3, PW, 3).fill();

  // Logo
  const logoPath = opts.logoPath || path.join(__dirname, '../public/images/white-gold.png');
  if (fs.existsSync(logoPath)) {
    try { doc.image(logoPath, M, 20, { fit: [110, 55], align: 'left' }); }
    catch (_) {}
  }

  // Company name + contact (white / gold)
  doc.fillColor(BRAND.white).fontSize(16).font('Helvetica-Bold')
    .text('SKYFALKE LIMITED', M + 120, 24, { characterSpacing: 1.5 });
  doc.fillColor(BRAND.goldLight).fontSize(8).font('Helvetica')
    .text('info@skyfalke.com  ·  +254 (071) 797-238', M + 120, 46);
  doc.fillColor(BRAND.gray400).fontSize(7.5)
    .text('Nairobi, Kenya', M + 120, 58);

  // QUOTATION label (right-aligned in header)
  doc.fillColor(BRAND.goldLight).fontSize(24).font('Helvetica-Bold')
    .text('QUOTATION', 0, 18, { align: 'right', width: PW - M - 8, characterSpacing: 2 });
  doc.fillColor(BRAND.white).fontSize(9).font('Helvetica')
    .text(`Ref: QT-${quotation.quotationNumber}`, 0, 50, { align: 'right', width: PW - M - 8 })
    .text(`Issued: ${quotation.issueDate.toLocaleDateString()}`, 0, 63, { align: 'right', width: PW - M - 8 })
    .text(`Valid Until: ${quotation.expiryDate.toLocaleDateString()}`, 0, 76, { align: 'right', width: PW - M - 8 });

  // ── 2. META ROW (two info cards side-by-side) ───────────────────────────────
  let y = HEADER_H + 18;

  // Status pill
  const statusColors = {
    draft:    { bg: '#e8f0fe', text: '#1a56db' },
    sent:     { bg: '#fdf6e3', text: '#92600a' },
    accepted: { bg: '#dcfce7', text: '#166534' },
    rejected: { bg: '#fee2e2', text: '#991b1b' },
    expired:  { bg: '#f3f4f6', text: '#374151' },
  };
  const sc = statusColors[quotation.status] || statusColors.draft;
  roundedRect(doc, M, y, 70, 18, 9, sc.bg);
  doc.fillColor(sc.text).fontSize(8).font('Helvetica-Bold')
    .text((quotation.status || 'DRAFT').toUpperCase(), M, y + 5, { width: 70, align: 'center' });

  y += 28;

  // Card dimensions
  const cardW = (CW - 12) / 2;
  const cardH  = 76;

  // Left card – BILL TO
  roundedRect(doc, M, y, cardW, cardH, 6, BRAND.gray100);
  doc.fillColor(BRAND.gold).rect(M, y, 4, cardH).fill();                  // left stripe
  doc.fillColor(BRAND.navy).fontSize(7.5).font('Helvetica-Bold')
    .text('BILL TO', M + 14, y + 10, { characterSpacing: 1 });
  rule(doc, M + 14, y + 22, 70, BRAND.gold, 0.6);
  doc.fillColor(BRAND.ink).fontSize(10).font('Helvetica-Bold')
    .text(quotation.client.name, M + 14, y + 27, { width: cardW - 20 });
  let cly = y + 41;
  if (quotation.client.company) {
    doc.fontSize(9).font('Helvetica').fillColor(BRAND.gray700)
      .text(quotation.client.company, M + 14, cly, { width: cardW - 20 });
    cly += 13;
  }
  doc.fontSize(8.5).fillColor(BRAND.gray400)
    .text(quotation.client.email, M + 14, cly, { width: cardW - 20 });
  if (quotation.client.phone) {
    doc.text(quotation.client.phone, M + 14, cly + 12, { width: cardW - 20 });
  }

  // Right card – QUOTATION DETAILS
  const rxCard = M + cardW + 12;
  roundedRect(doc, rxCard, y, cardW, cardH, 6, BRAND.gray100);
  doc.fillColor(BRAND.gold).rect(rxCard, y, 4, cardH).fill();
  doc.fillColor(BRAND.navy).fontSize(7.5).font('Helvetica-Bold')
    .text('QUOTATION DETAILS', rxCard + 14, y + 10, { characterSpacing: 1 });
  rule(doc, rxCard + 14, y + 22, 110, BRAND.gold, 0.6);

  const detailRows = [
    ['Quotation No.', `QT-${quotation.quotationNumber}`],
    ['Issue Date',    quotation.issueDate.toLocaleDateString()],
    ['Valid Until',   quotation.expiryDate.toLocaleDateString()],
    ['Currency',      quotation.currency || 'KES'],
  ];
  let dRow = y + 27;
  detailRows.forEach(([label, val]) => {
    doc.fillColor(BRAND.gray400).fontSize(8).font('Helvetica').text(label + ':', rxCard + 14, dRow, { width: 80 });
    doc.fillColor(BRAND.ink).fontSize(8).font('Helvetica-Bold').text(val, rxCard + 100, dRow, { width: cardW - 110 });
    dRow += 12;
  });

  y += cardH + 22;

  // ── 3. ITEMS TABLE ──────────────────────────────────────────────────────────
  // Column layout
  const COL = {
    desc:    M,
    qty:     M + 258,
    unit:    M + 310,
    amount:  M + 400,
    right:   M + CW,
  };

  // Table header
  roundedRect(doc, M, y, CW, 24, 4, BRAND.navy);
  doc.fillColor(BRAND.white).fontSize(8.5).font('Helvetica-Bold')
    .text('DESCRIPTION',  COL.desc   + 8, y + 8, { width: 240 })
    .text('QTY',          COL.qty    + 4, y + 8, { width: 40, align: 'center' })
    .text('UNIT PRICE',   COL.unit   + 4, y + 8, { width: 80, align: 'right' })
    .text('AMOUNT',       COL.amount + 4, y + 8, { width: COL.right - COL.amount - 4, align: 'right' });

  y += 24;
  doc.strokeColor(BRAND.gray200).lineWidth(0.5);

  quotation.items.forEach((item, i) => {
    const ROW_H = 26;

    // Alternating row tint
    if (i % 2 === 0) {
      doc.fillColor(BRAND.white).rect(M, y, CW, ROW_H).fill();
    } else {
      doc.fillColor(BRAND.offWhite).rect(M, y, CW, ROW_H).fill();
    }

    // Subtle bottom border
    doc.strokeColor(BRAND.gray200).lineWidth(0.4)
      .moveTo(M, y + ROW_H).lineTo(M + CW, y + ROW_H).stroke();

    // Gold left accent on first item only (draws attention)
    if (i === 0) {
      doc.fillColor(BRAND.gold).rect(M, y, 3, ROW_H).fill();
    }

    doc.fillColor(BRAND.ink).fontSize(9).font('Helvetica')
      .text(item.description, COL.desc + 10, y + 8, { width: 238, ellipsis: true })
    doc.fillColor(BRAND.gray700).fontSize(9)
      .text(String(item.quantity), COL.qty + 4, y + 8, { width: 40, align: 'center' })
      .text(`${currencySymbol} ${fmtAmt(item.unitPrice)}`, COL.unit + 4, y + 8, { width: 80, align: 'right' })
    doc.fillColor(BRAND.ink).font('Helvetica-Bold')
      .text(`${currencySymbol} ${fmtAmt(item.total)}`, COL.amount + 4, y + 8, { width: COL.right - COL.amount - 8, align: 'right' });

    y += ROW_H;
  });

  // Outer table border
  doc.strokeColor(BRAND.gray200).lineWidth(0.6)
    .rect(M, y - quotation.items.length * 26 - 24, CW, quotation.items.length * 26 + 24).stroke();

  y += 10;

  // ── 4. TOTALS BLOCK ─────────────────────────────────────────────────────────
  const totW  = 200;
  const totX  = M + CW - totW;
  const totPad = 12;

  // Container
  roundedRect(doc, totX, y, totW, 110, 6, BRAND.gray100);
  doc.fillColor(BRAND.gold).rect(totX, y, 3, 110).fill();  // accent stripe

  let tRow = y + totPad;
  const rowLabel = (label, val, bold = false) => {
    doc.fillColor(BRAND.gray700).fontSize(9).font(bold ? 'Helvetica-Bold' : 'Helvetica')
      .text(label, totX + 12, tRow, { width: 90 });
    doc.fillColor(bold ? BRAND.navy : BRAND.ink).fontSize(9).font(bold ? 'Helvetica-Bold' : 'Helvetica')
      .text(val, totX + 12, tRow, { width: totW - 24, align: 'right' });
    tRow += 16;
  };

  rowLabel('Subtotal', `${currencySymbol} ${fmtAmt(quotation.subtotal)}`);

  if (quotation.discount > 0) {
    rowLabel('Discount', `-${currencySymbol} ${fmtAmt(quotation.discount)}`);
  }
  if (quotation.taxRate > 0) {
    rowLabel(`Tax (${quotation.taxRate}%)`, `${currencySymbol} ${fmtAmt(quotation.taxAmount)}`);
  }

  // Divider before total
  tRow += 2;
  rule(doc, totX + 12, tRow, totW - 24, BRAND.gold, 1);
  tRow += 8;

  // Grand total
  roundedRect(doc, totX + 6, tRow - 4, totW - 12, 24, 4, BRAND.navy);
  doc.fillColor(BRAND.goldLight).fontSize(11).font('Helvetica-Bold')
    .text('TOTAL', totX + 14, tRow + 3, { width: 80 });
  doc.fillColor(BRAND.white).fontSize(11).font('Helvetica-Bold')
    .text(`${currencySymbol} ${fmtAmt(quotation.total)}`, totX + 14, tRow + 3, { width: totW - 28, align: 'right' });

  y += 120;

  // ── 5. NOTES & TERMS ────────────────────────────────────────────────────────
  const noteBoxW = (quotation.notes && quotation.terms) ? (CW - 10) / 2 : CW;

  if (quotation.notes || quotation.terms) {
    let bx = M;
    const boxH = 70;

    const renderBox = (title, body, x, w) => {
      roundedRect(doc, x, y, w, boxH, 5, BRAND.goldPale);
      doc.fillColor(BRAND.gold).rect(x, y, 3, boxH).fill();
      doc.fillColor(BRAND.navy).fontSize(8).font('Helvetica-Bold')
        .text(title.toUpperCase(), x + 12, y + 10, { characterSpacing: 0.8 });
      rule(doc, x + 12, y + 22, 60, BRAND.gold, 0.5);
      doc.fillColor(BRAND.gray700).fontSize(8).font('Helvetica')
        .text(body, x + 12, y + 27, { width: w - 24, height: boxH - 30, ellipsis: true });
    };

    if (quotation.notes) {
      renderBox('Notes', quotation.notes, bx, noteBoxW);
      bx += noteBoxW + 10;
    }
    if (quotation.terms) {
      renderBox('Terms & Conditions', quotation.terms, bx, noteBoxW);
    }

    y += boxH + 16;
  }

  // ── 6. FOOTER BAND ──────────────────────────────────────────────────────────
  const FOOTER_H = 46;
  const FOOTER_Y = PH - FOOTER_H;

  doc.fillColor(BRAND.navy).rect(0, FOOTER_Y, PW, FOOTER_H).fill();
  doc.fillColor(BRAND.gold).rect(0, FOOTER_Y, PW, 2).fill();

  // Hatch on footer too
  drawHatch(doc, 0, FOOTER_Y, PW, FOOTER_H, BRAND.white, 12, 0.04);

  doc.fillColor(BRAND.gray400).fontSize(7.5).font('Helvetica')
    .text('This quotation is valid for 30 days from the date of issue.', M, FOOTER_Y + 10, { width: CW * 0.55 })
    .text('info@skyfalke.com  ·  +254 (071) 797-238', M, FOOTER_Y + 22, { width: CW * 0.55 });

  doc.fillColor(BRAND.goldLight).fontSize(7.5).font('Helvetica-Bold')
    .text('Thank you for choosing Skyfalke Limited.', 0, FOOTER_Y + 16, { align: 'right', width: PW - M });
}

// ─── Routes (unchanged from original) ─────────────────────────────────────────

// Get all quotations with pagination and filtering
router.get('/', adminAuth, dbCheck, async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { quotationNumber:   { $regex: search, $options: 'i' } },
        { 'client.name':     { $regex: search, $options: 'i' } },
        { 'client.email':    { $regex: search, $options: 'i' } },
        { 'client.company':  { $regex: search, $options: 'i' } },
      ];
    }

    const quotations = await Quotation.find(filter)
      .populate('createdBy',      'name email')
      .populate('lastModifiedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Quotation.countDocuments(filter);
    res.json({ quotations, pagination: { current: page, pages: Math.ceil(total / limit), total } });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single quotation
router.get('/:id', adminAuth, dbCheck, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('createdBy',        'name email')
      .populate('lastModifiedBy',   'name email')
      .populate('convertedToInvoice');

    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
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
    const quotationData   = { ...req.body, quotationNumber, createdBy: req.user.id, lastModifiedBy: req.user.id };
    const quotation       = new Quotation(quotationData);
    await quotation.save();

    const populated = await Quotation.findById(quotation._id)
      .populate('createdBy', 'name email').populate('lastModifiedBy', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating quotation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update quotation
router.put('/:id', adminAuth, dbCheck, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
    if (quotation.status === 'accepted' || quotation.status === 'rejected') {
      return res.status(400).json({ message: 'Cannot edit accepted or rejected quotations' });
    }
    Object.assign(quotation, req.body);
    quotation.lastModifiedBy = req.user.id;
    await quotation.save();

    const updated = await Quotation.findById(quotation._id)
      .populate('createdBy', 'name email').populate('lastModifiedBy', 'name email');
    res.json(updated);
  } catch (error) {
    console.error('Error updating quotation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update quotation status
router.patch('/:id/status', adminAuth, dbCheck, async (req, res) => {
  try {
    const { status }  = req.body;
    const quotation   = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });

    quotation.status           = status;
    quotation.lastModifiedBy   = req.user.id;
    if (status === 'sent')     quotation.sentAt     = new Date();
    if (status === 'accepted') quotation.acceptedAt = new Date();
    if (status === 'rejected') quotation.rejectedAt = new Date();
    await quotation.save();

    const updated = await Quotation.findById(quotation._id)
      .populate('createdBy', 'name email').populate('lastModifiedBy', 'name email');
    res.json(updated);
  } catch (error) {
    console.error('Error updating quotation status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Convert quotation to invoice
router.post('/:id/convert-to-invoice', adminAuth, dbCheck, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
    if (quotation.status !== 'accepted')
      return res.status(400).json({ message: 'Only accepted quotations can be converted to invoices' });
    if (quotation.convertedToInvoice)
      return res.status(400).json({ message: 'Quotation has already been converted to invoice' });

    const invoice = await quotation.convertToInvoice();
    res.json({ message: 'Quotation converted to invoice successfully', invoice, quotation });
  } catch (error) {
    console.error('Error converting quotation to invoice:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate PDF for quotation
router.get('/:id/pdf', adminAuth, dbCheck, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate('createdBy', 'name email');
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });

    const doc = new PDFDocument({ size: 'A4', margin: 48 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="quotation-${quotation.quotationNumber}.pdf"`);
    res.setHeader('Cache-Control', 'no-cache');
    doc.pipe(res);

    buildQuotationPDF(doc, quotation, { logoPath: path.join(__dirname, '../public/images/white-gold.png') });

    doc.on('error', (err) => {
      console.error('PDF generation error:', err);
      if (!res.headersSent) res.status(500).json({ message: 'Error generating PDF' });
    });
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (!res.headersSent) res.status(500).json({ message: 'Server error' });
  }
});

// Send quotation by email
router.post('/:id/send', adminAuth, dbCheck, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate('createdBy', 'name email');
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });

    const transporter = nodemailer.createTransport({
      host:   process.env.EMAIL_HOST,
      port:   process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465,
      auth:   { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const pdfDoc = new PDFDocument({ size: 'A4', margin: 48 });
    const chunks = [];
    pdfDoc.on('data', chunk => chunks.push(chunk));
    pdfDoc.on('end', async () => {
      const pdfBuffer   = Buffer.concat(chunks);
      const cs          = quotation.currency === 'KES' ? 'KSh' : '$';
      const fmtAmt      = (v) => quotation.currency === 'KES'
        ? new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)
        : v.toFixed(2);

      const mailOptions = {
        from:    `"Skyfalke Limited" <${process.env.EMAIL_USER}>`,
        to:      quotation.client.email,
        subject: `Quotation QT-${quotation.quotationNumber} from Skyfalke Limited`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;background:#f9fafb;border-radius:8px;overflow:hidden;">
            <div style="background:#1e2a4a;padding:24px 28px;">
              <h1 style="margin:0;color:#e8c96a;font-size:20px;letter-spacing:1px;">SKYFALKE LIMITED</h1>
              <p style="margin:4px 0 0;color:#94a3b8;font-size:12px;">info@skyfalke.com &nbsp;·&nbsp; +254 (071) 797-238</p>
            </div>
            <div style="padding:28px;">
              <h2 style="color:#1e2a4a;margin-top:0;">Your Quotation is Ready</h2>
              <p>Dear ${quotation.client.name},</p>
              <p>Please find attached quotation <strong>QT-${quotation.quotationNumber}</strong>. Here's a quick summary:</p>
              <table style="width:100%;border-collapse:collapse;margin:20px 0;background:#fff;border-radius:6px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">
                <tr style="background:#1e2a4a;color:#fff;font-size:13px;">
                  <th style="padding:10px 16px;text-align:left;">Field</th>
                  <th style="padding:10px 16px;text-align:left;">Detail</th>
                </tr>
                ${[
                  ['Quotation No.',  `QT-${quotation.quotationNumber}`],
                  ['Issue Date',     quotation.issueDate.toLocaleDateString()],
                  ['Valid Until',    quotation.expiryDate.toLocaleDateString()],
                  ['Total Amount',   `${cs} ${fmtAmt(quotation.total)}`],
                  ['Currency',       quotation.currency],
                ].map(([k, v], i) => `
                  <tr style="background:${i % 2 === 0 ? '#f9fafb' : '#fff'};">
                    <td style="padding:9px 16px;color:#6b7280;font-size:13px;">${k}</td>
                    <td style="padding:9px 16px;color:#1a1f36;font-size:13px;font-weight:600;">${v}</td>
                  </tr>`).join('')}
              </table>
              <p style="color:#6b7280;font-size:13px;">This quotation is valid for 30 days. Please don't hesitate to reach out with any questions.</p>
              <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e2e8f0;color:#9ca3af;font-size:12px;">
                Best regards,<br><strong style="color:#1e2a4a;">Skyfalke Limited</strong><br>
                <span style="color:#c89b2a;">info@skyfalke.com &nbsp;·&nbsp; +254 (071) 797-238</span>
              </div>
            </div>
          </div>`,
        attachments: [{
          filename:    `quotation-${quotation.quotationNumber}.pdf`,
          content:     pdfBuffer,
          contentType: 'application/pdf'
        }]
      };

      try {
        await transporter.sendMail(mailOptions);
        quotation.status           = 'sent';
        quotation.sentAt           = new Date();
        quotation.lastModifiedBy   = req.user.id;
        await quotation.save();
        res.json({ message: 'Quotation sent successfully' });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        res.status(500).json({ message: 'Failed to send email' });
      }
    });

    buildQuotationPDF(pdfDoc, quotation, { logoPath: path.join(__dirname, '../public/images/white-gold.png') });
    pdfDoc.end();

  } catch (error) {
    console.error('Error sending quotation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete quotation
router.delete('/:id', adminAuth, dbCheck, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
    if (quotation.status !== 'draft')
      return res.status(400).json({ message: 'Cannot delete sent quotations' });
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
    const stats = await Quotation.aggregate([{
      $group: {
        _id: null,
        totalQuotations:    { $sum: 1 },
        totalValue:         { $sum: '$total' },
        draftQuotations:    { $sum: { $cond: [{ $eq: ['$status', 'draft']    }, 1, 0] } },
        sentQuotations:     { $sum: { $cond: [{ $eq: ['$status', 'sent']     }, 1, 0] } },
        acceptedQuotations: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
        rejectedQuotations: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
        expiredQuotations:  { $sum: { $cond: [{ $eq: ['$status', 'expired']  }, 1, 0] } },
      }
    }]);
    res.json(stats[0] || {
      totalQuotations: 0, totalValue: 0,
      draftQuotations: 0, sentQuotations: 0,
      acceptedQuotations: 0, rejectedQuotations: 0, expiredQuotations: 0
    });
  } catch (error) {
    console.error('Error fetching quotation stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;