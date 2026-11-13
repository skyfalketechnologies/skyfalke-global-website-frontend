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
// Flat, print-friendly palette: navy for structure, no gradients or textures.
const BRAND = {
  navy:    '#303661',
  ink:     '#1f2937',   // primary text
  body:    '#374151',   // body copy
  muted:   '#6b7280',   // labels / secondary text
  rule:    '#d1d5db',   // hairlines
  panel:   '#f4f5f9',   // flat tint for the total row
};

const COMPANY = {
  name:    'Skyfalke Limited',
  address: 'Nairobi, Kenya',
  email:   'info@skyfalke.com',
  phone:   '+254 (071) 797-238',
  web:     'www.skyfalke.com',
  taxPin:  'P052474944J',
};

const PAGE_MARGIN  = 48;
const FOOTER_SPACE = 84;   // reserved at the bottom of every page for the footer
const LOGO_PATH    = path.join(__dirname, '../public/images/logo.png');

/** A4 document with footer space reserved and pages buffered for "Page x of y". */
function createQuotationDoc() {
  return new PDFDocument({
    size: 'A4',
    bufferPages: true,
    margins: { top: PAGE_MARGIN, left: PAGE_MARGIN, right: PAGE_MARGIN, bottom: FOOTER_SPACE },
    info: { Title: 'Quotation', Author: COMPANY.name },
  });
}

/**
 * Builds a clean, print-ready quotation PDF.
 * @param {PDFKit.PDFDocument} doc - created with createQuotationDoc()
 * @param {Object} quotation
 * @param {Object} opts - { logoPath }
 */
function buildQuotationPDF(doc, quotation, opts = {}) {
  const PW = doc.page.width;          // 595pt (A4)
  const PH = doc.page.height;         // 842pt
  const M  = PAGE_MARGIN;
  const CW = PW - M * 2;
  const BOTTOM = PH - FOOTER_SPACE;   // lowest y content may reach

  const currency = quotation.currency || 'USD';
  const number   = `QT-${quotation.quotationNumber}`;
  const money = (v) => `${currency} ${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(Number(v) || 0)}`;
  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }) : '-');

  doc.info.Title = `Quotation ${number}`;

  const hline = (y, color = BRAND.rule, width = 0.5, x1 = M, x2 = M + CW) => {
    doc.save().moveTo(x1, y).lineTo(x2, y).lineWidth(width).strokeColor(color).stroke().restore();
  };
  const label = (text, x, y, o = {}) => doc.font('Helvetica-Bold').fontSize(7.5).fillColor(BRAND.muted)
    .text(text.toUpperCase(), x, y, { characterSpacing: 0.8, lineBreak: false, ...o });

  let y;
  const newPage = () => { doc.addPage(); y = M; };
  const ensureSpace = (h) => { if (y + h > BOTTOM) newPage(); };

  // ── 1. Header ───────────────────────────────────────────────────────────────
  doc.rect(0, 0, PW, 4).fill(BRAND.navy);

  const logoPath = opts.logoPath || LOGO_PATH;
  let logoOk = false;
  if (fs.existsSync(logoPath)) {
    try { doc.image(logoPath, M, 40, { fit: [150, 36] }); logoOk = true; } catch (_) {}
  }
  if (!logoOk) {
    doc.font('Helvetica-Bold').fontSize(16).fillColor(BRAND.navy).text(COMPANY.name.toUpperCase(), M, 46);
  }

  doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND.ink).text(COMPANY.name, M, 88);
  doc.font('Helvetica').fontSize(8.5).fillColor(BRAND.muted)
    .text(COMPANY.address, M, 101)
    .text(`${COMPANY.email}  |  ${COMPANY.phone}`, M, 113)
    .text(`KRA PIN: ${COMPANY.taxPin}`, M, 125);

  doc.font('Helvetica-Bold').fontSize(22).fillColor(BRAND.navy)
    .text('QUOTATION', M, 40, { width: CW, align: 'right', characterSpacing: 1 });

  const metaX = M + CW - 210;
  const meta = [
    ['Quotation No.', number],
    ['Date',          fmtDate(quotation.issueDate)],
    ['Valid Until',   fmtDate(quotation.expiryDate)],
    ['Currency',      currency],
  ];
  let my = 76;
  meta.forEach(([k, v]) => {
    doc.font('Helvetica').fontSize(8.5).fillColor(BRAND.muted).text(k, metaX, my, { width: 90 });
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(BRAND.ink).text(v, metaX + 90, my, { width: 120, align: 'right' });
    my += 13;
  });

  hline(150, BRAND.navy, 1);

  // ── 2. Parties ──────────────────────────────────────────────────────────────
  const colW = (CW - 30) / 2;
  const rightX = M + colW + 30;
  const topY = 168;

  const block = (title, lines, x) => {
    label(title, x, topY);
    let by = topY + 15;
    lines.filter(Boolean).forEach((line, i) => {
      const first = i === 0;
      doc.font(first ? 'Helvetica-Bold' : 'Helvetica').fontSize(first ? 10.5 : 9)
        .fillColor(first ? BRAND.ink : BRAND.body)
        .text(line, x, by, { width: colW });
      by = doc.y + (first ? 3 : 1.5);
    });
    return by;
  };

  const c = quotation.client || {};
  const a = c.address || {};
  const clientLines = [
    c.name,
    c.company,
    a.street,
    [a.city, a.state, a.zipCode].filter(Boolean).join(', '),
    a.country,
    c.email,
    c.phone,
  ];
  const preparer = quotation.createdBy && typeof quotation.createdBy === 'object' && quotation.createdBy.name
    ? quotation.createdBy : null;
  const preparedLines = [
    COMPANY.name,
    preparer ? `Contact: ${preparer.name}` : null,
    (preparer && preparer.email) || COMPANY.email,
    COMPANY.phone,
  ];

  y = Math.max(block('Prepared For', clientLines, M), block('Prepared By', preparedLines, rightX)) + 22;

  // ── 3. Line items ───────────────────────────────────────────────────────────
  const col = {
    no:     { x: M,             w: 26 },
    desc:   { x: M + 26,        w: CW - 26 - 46 - 100 - 104 },
    qty:    { x: M + CW - 250,  w: 46 },
    price:  { x: M + CW - 204,  w: 100 },
    amount: { x: M + CW - 104,  w: 104 },
  };
  const PAD = 7;

  const tableHeader = () => {
    label('#',           col.no.x,     y, { width: col.no.w });
    label('Description', col.desc.x,   y, { width: col.desc.w });
    label('Qty',         col.qty.x,    y, { width: col.qty.w,    align: 'right' });
    label('Unit Price',  col.price.x,  y, { width: col.price.w,  align: 'right' });
    label('Amount',      col.amount.x, y, { width: col.amount.w, align: 'right' });
    y += 13;
    hline(y, BRAND.navy, 1);
  };

  ensureSpace(60);
  tableHeader();

  (quotation.items || []).forEach((item, i) => {
    doc.font('Helvetica').fontSize(9);
    const descH = doc.heightOfString(item.description || '', { width: col.desc.w - 8 });
    const rowH = Math.max(descH, 11) + PAD * 2;
    if (y + rowH > BOTTOM) { newPage(); tableHeader(); }

    const ty = y + PAD;
    doc.font('Helvetica').fontSize(9).fillColor(BRAND.muted)
      .text(String(i + 1), col.no.x, ty, { width: col.no.w });
    doc.fillColor(BRAND.ink)
      .text(item.description || '', col.desc.x, ty, { width: col.desc.w - 8 });
    doc.fillColor(BRAND.body)
      .text(String(item.quantity ?? ''), col.qty.x,   ty, { width: col.qty.w,   align: 'right' })
      .text(money(item.unitPrice),       col.price.x, ty, { width: col.price.w, align: 'right' });
    doc.font('Helvetica-Bold').fillColor(BRAND.ink)
      .text(money(item.total), col.amount.x, ty, { width: col.amount.w, align: 'right' });

    y += rowH;
    hline(y);
  });

  // ── 4. Totals ───────────────────────────────────────────────────────────────
  const rows = [['Subtotal', money(quotation.subtotal)]];
  if (quotation.discount > 0) rows.push(['Discount', `- ${money(quotation.discount)}`]);
  if (quotation.taxRate > 0)  rows.push([`VAT (${quotation.taxRate}%)`, money(quotation.taxAmount)]);

  y += 14;
  ensureSpace(rows.length * 20 + 40);

  const totW = 240;
  const totX = M + CW - totW;
  const totalsTop = y;

  rows.forEach(([k, v]) => {
    doc.font('Helvetica').fontSize(9).fillColor(BRAND.body).text(k, totX + 10, y + 5, { width: 110 });
    doc.font('Helvetica').fontSize(9).fillColor(BRAND.ink).text(v, totX, y + 5, { width: totW - 10, align: 'right' });
    y += 20;
    hline(y, BRAND.rule, 0.5, totX, totX + totW);
  });

  doc.rect(totX, y, totW, 30).fill(BRAND.panel);
  hline(y, BRAND.navy, 1, totX, totX + totW);
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor(BRAND.navy)
    .text('Total', totX + 10, y + 10, { width: 100 });
  doc.text(money(quotation.total), totX, y + 10, { width: totW - 10, align: 'right' });
  y += 30;

  // Validity statement beside the totals
  doc.font('Helvetica').fontSize(8.5).fillColor(BRAND.muted)
    .text(
      `This quotation is valid until ${fmtDate(quotation.expiryDate)}. All amounts are in ${currency}.`,
      M, totalsTop + 5, { width: CW - totW - 30, lineGap: 2 }
    );

  y += 28;

  // ── 5. Notes & terms ────────────────────────────────────────────────────────
  const sectionTitle = (title) => {
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(BRAND.navy)
      .text(title.toUpperCase(), M, y, { characterSpacing: 0.8 });
    y = doc.y + 4;
    hline(y);
    y += 7;
  };
  const section = (title, body) => {
    if (!body) return;
    ensureSpace(52);
    sectionTitle(title);
    // Long bodies flow onto following pages; the bottom margin keeps them clear of the footer.
    doc.font('Helvetica').fontSize(9).fillColor(BRAND.body)
      .text(body, M, y, { width: CW, lineGap: 2 });
    y = doc.y + 20;
  };

  section('Notes', quotation.notes);
  section('Terms & Conditions', quotation.terms);

  // ── 6. Acceptance ───────────────────────────────────────────────────────────
  ensureSpace(80);
  sectionTitle('Acceptance');
  doc.font('Helvetica').fontSize(9).fillColor(BRAND.body)
    .text(`To accept this quotation, please sign below and return a copy to ${COMPANY.email}.`, M, y, { width: CW });
  y = doc.y + 28;

  const sigW = (CW - 40) / 3;
  ['Name', 'Signature', 'Date'].forEach((k, i) => {
    const sx = M + i * (sigW + 20);
    hline(y, BRAND.ink, 0.6, sx, sx + sigW);
    doc.font('Helvetica').fontSize(8).fillColor(BRAND.muted).text(k, sx, y + 5, { width: sigW });
  });

  // ── 7. Footer on every page ─────────────────────────────────────────────────
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    const savedBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;           // allow drawing inside the reserved footer area

    const fy = PH - 58;
    hline(fy);
    doc.font('Helvetica').fontSize(7.5).fillColor(BRAND.muted)
      .text(`${COMPANY.name}  ·  ${COMPANY.address}  ·  KRA PIN ${COMPANY.taxPin}`, M, fy + 9, { width: CW * 0.7, lineBreak: false })
      .text(`${COMPANY.email}  ·  ${COMPANY.phone}  ·  ${COMPANY.web}`, M, fy + 21, { width: CW * 0.7, lineBreak: false });
    doc.text(`${number}  ·  Page ${i - range.start + 1} of ${range.count}`, M, fy + 9,
      { width: CW, align: 'right', lineBreak: false });

    doc.page.margins.bottom = savedBottom;
  }
}

// ─── Routes ─────────────────────────────────────────

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

    const doc = createQuotationDoc();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="quotation-${quotation.quotationNumber}.pdf"`);
    res.setHeader('Cache-Control', 'no-cache');
    doc.pipe(res);

    buildQuotationPDF(doc, quotation);

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

    // Finance emails are sent from the billing account (falls back to the main account)
    const billingUser = process.env.BILLING_EMAIL_USER || process.env.EMAIL_USER;
    const billingPass = process.env.BILLING_EMAIL_PASS || process.env.EMAIL_PASS;
    const transporter = nodemailer.createTransport({
      host:   process.env.EMAIL_HOST,
      port:   process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465,
      auth:   { user: billingUser, pass: billingPass }
    });

    const pdfDoc = createQuotationDoc();
    const chunks = [];
    pdfDoc.on('data', chunk => chunks.push(chunk));
    pdfDoc.on('end', async () => {
      const pdfBuffer   = Buffer.concat(chunks);
      const currency    = quotation.currency || 'USD';
      const money       = (v) => `${currency} ${new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2, maximumFractionDigits: 2,
      }).format(Number(v) || 0)}`;
      const fmtDate     = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const esc         = (v) => String(v ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
      const number      = `QT-${quotation.quotationNumber}`;

      const mailOptions = {
        from:    `"Skyfalke Limited" <${billingUser}>`,
        to:      quotation.client.email,
        subject: `Quotation ${number} from Skyfalke Limited`,
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;color:#1f2937;">
            <div style="border-top:4px solid #303661;padding:24px 28px 18px;border-bottom:1px solid #e5e7eb;">
              <div style="font-size:16px;font-weight:bold;color:#303661;letter-spacing:0.5px;">SKYFALKE LIMITED</div>
              <div style="margin-top:4px;font-size:12px;color:#6b7280;">Nairobi, Kenya &nbsp;|&nbsp; info@skyfalke.com &nbsp;|&nbsp; +254 (071) 797-238</div>
            </div>
            <div style="padding:28px;font-size:14px;line-height:1.6;">
              <p style="margin:0 0 14px;">Dear ${esc(quotation.client.name)},</p>
              <p style="margin:0 0 20px;">Thank you for your interest in our services. Please find attached our quotation <strong>${number}</strong>. A summary is below for your reference.</p>
              <table style="width:100%;border-collapse:collapse;font-size:13px;margin:0 0 20px;">
                ${[
                  ['Quotation No.', number],
                  ['Date',          fmtDate(quotation.issueDate)],
                  ['Valid Until',   fmtDate(quotation.expiryDate)],
                ].map(([k, v]) => `
                  <tr>
                    <td style="padding:9px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;">${k}</td>
                    <td style="padding:9px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${v}</td>
                  </tr>`).join('')}
                <tr>
                  <td style="padding:12px 0;border-top:2px solid #303661;font-weight:bold;color:#303661;">Total</td>
                  <td style="padding:12px 0;border-top:2px solid #303661;font-weight:bold;color:#303661;text-align:right;">${money(quotation.total)}</td>
                </tr>
              </table>
              <p style="margin:0 0 14px;">To proceed, simply reply to this email or sign and return the attached quotation. We are happy to answer any questions.</p>
              <p style="margin:24px 0 0;">Kind regards,<br><strong>Skyfalke Limited</strong></p>
            </div>
            <div style="padding:14px 28px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;">
              Skyfalke Limited &nbsp;·&nbsp; KRA PIN P052474944J &nbsp;·&nbsp; www.skyfalke.com
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

    buildQuotationPDF(pdfDoc, quotation);
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