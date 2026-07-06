const path = require('path');

function titleForType(documentType) {
  switch (documentType) {
    case 'sales_receipt':
      return 'SALES RECEIPT';
    case 'credit_note':
      return 'CREDIT NOTE';
    case 'debit_note':
      return 'DEBIT NOTE';
    default:
      return 'FINANCIAL DOCUMENT';
  }
}

/**
 * @param {import('pdfkit')} doc
 * @param {import('mongoose').Document} financialDoc
 */
async function generateFinancialDocumentPDF(doc, financialDoc) {
  try {
    const logoPath = path.join(__dirname, '../public/images/logo.png');
    doc.image(logoPath, 50, 50, { width: 120, fit: [120, 80] });
  } catch (e) {
    console.log('Logo loading failed for financial document PDF:', e.message);
  }

  doc.fontSize(10)
    .fillColor('#303661')
    .text('Email: info@skyfalke.com', 50, 80)
    .text('Phone: +254(071)797-238', 50, 95);

  const heading = titleForType(financialDoc.documentType);
  doc.fontSize(18)
    .fillColor('#303661')
    .text(heading, 400, 50);

  doc.fontSize(11)
    .fillColor('#666')
    .text(`Document #: ${financialDoc.documentNumber}`, 400, 85)
    .text(`Date: ${new Date(financialDoc.issueDate).toLocaleDateString()}`, 400, 102);

  doc.fontSize(12)
    .fillColor('#303661')
    .text('Bill To / Party:', 50, 150);

  doc.fontSize(11)
    .fillColor('#333')
    .text(financialDoc.client?.name || '—', 50, 170)
    .text(financialDoc.client?.email || '', 50, 186);

  if (financialDoc.reason) {
    doc.fontSize(10)
      .fillColor('#555')
      .text(`Reason: ${financialDoc.reason}`, 50, 210);
  }

  let yPosition = financialDoc.reason ? 240 : 220;
  const currency = financialDoc.currency || 'KES';
  const currencySymbol = currency === 'KES' ? 'KSh' : '$';
  const formatAmount = (amount) => {
    if (currency === 'KES') {
      return new Intl.NumberFormat('en-KE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    }
    return Number(amount).toFixed(2);
  };

  doc.rect(50, yPosition, 520, 28).fill('#303661');
  doc.fillColor('white')
    .fontSize(11)
    .text('Description', 60, yPosition + 8)
    .text('Qty', 350, yPosition + 8)
    .text('Price', 400, yPosition + 8)
    .text('Total', 480, yPosition + 8);

  yPosition += 28;

  (financialDoc.items || []).forEach((item) => {
    doc.rect(50, yPosition, 520, 26).stroke();
    doc.fillColor('#333')
      .fontSize(10)
      .text(item.description || '', 60, yPosition + 8, { width: 280 })
      .text(String(item.quantity ?? ''), 350, yPosition + 8)
      .text(`${currencySymbol}${formatAmount(item.unitPrice)}`, 400, yPosition + 8)
      .text(`${currencySymbol}${formatAmount(item.total)}`, 480, yPosition + 8);
    yPosition += 26;
  });

  yPosition += 16;
  doc.fontSize(11)
    .fillColor('#333')
    .text(`Subtotal: ${currencySymbol}${formatAmount(financialDoc.subtotal)}`, 400, yPosition, { width: 170 });

  if (financialDoc.taxRate > 0) {
    yPosition += 18;
    doc.text(
      `Tax (${financialDoc.taxRate}%): ${currencySymbol}${formatAmount(financialDoc.taxAmount)}`,
      400,
      yPosition,
      { width: 170 }
    );
  }
  if (financialDoc.discount > 0) {
    yPosition += 18;
    doc.text(`Discount: -${currencySymbol}${formatAmount(financialDoc.discount)}`, 400, yPosition, { width: 170 });
  }
  yPosition += 22;
  doc.fontSize(13)
    .fillColor('#303661')
    .text(`Total: ${currencySymbol}${formatAmount(financialDoc.total)}`, 400, yPosition, { width: 170 });

  if (financialDoc.notes) {
    yPosition += 40;
    doc.fontSize(11).fillColor('#303661').text('Notes:', 50, yPosition);
    yPosition += 18;
    doc.fillColor('#333').text(financialDoc.notes, 50, yPosition);
  }

  const pageHeight = doc.page.height;
  doc.fontSize(8)
    .fillColor('#666')
    .text('Skyfalke Limited — Accounting document', 50, pageHeight - 50);
}

module.exports = { generateFinancialDocumentPDF };
