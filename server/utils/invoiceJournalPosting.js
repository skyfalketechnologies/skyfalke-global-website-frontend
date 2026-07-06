const Account = require('../models/Account');
const JournalEntry = require('../models/JournalEntry');
const Invoice = require('../models/Invoice');
const { applyJournalLinesToBalances, validateBalancedLines } = require('./journalPosting');
const { logAccountingAudit } = require('./accountingAudit');

/**
 * Cash-basis: when an invoice is paid, post DR Bank/Cash, CR Revenue, CR Tax liability (if any).
 * Idempotent via invoice.paymentJournalEntry.
 */
async function postInvoicePaymentJournal(invoiceDoc, userId, req) {
  const invoice = invoiceDoc;
  const id = invoice._id;

  if (invoice.paymentJournalEntry) {
    return { skipped: true, reason: 'already_posted' };
  }
  if (invoice.status !== 'paid') {
    return { skipped: true, reason: 'not_paid' };
  }
  const total = Number(invoice.total) || 0;
  if (total <= 0) {
    return { skipped: true, reason: 'zero_total' };
  }

  const bank = await Account.findOne({
    type: { $in: ['bank', 'cash'] },
    isActive: true
  }).sort({ createdAt: 1 });

  const revenue = await Account.findOne({
    type: 'revenue',
    isActive: true
  }).sort({ createdAt: 1 });

  if (!bank || !revenue) {
    throw new Error(
      'Chart of accounts must include at least one Bank or Cash account and one Revenue account before posting invoice payments.'
    );
  }

  const discount = Number(invoice.discount) || 0;
  const subtotal = Number(invoice.subtotal) || 0;
  const netRevenue = Math.max(0, subtotal - discount);
  const tax = Number(invoice.taxAmount) || 0;

  const lines = [
    {
      account: bank._id,
      debit: total,
      credit: 0,
      memo: `Invoice INV-${invoice.invoiceNumber} — receipt`
    },
    {
      account: revenue._id,
      debit: 0,
      credit: netRevenue,
      memo: `Invoice INV-${invoice.invoiceNumber} — revenue`
    }
  ];

  if (tax > 0) {
    const taxAccount =
      (await Account.findOne({
        type: { $in: ['liability', 'accounts-payable'] },
        isActive: true,
        $or: [
          { category: { $regex: /tax|vat|sales/i } },
          { name: { $regex: /tax|vat|sales/i } }
        ]
      })) ||
      (await Account.findOne({
        type: 'liability',
        isActive: true
      }).sort({ createdAt: 1 }));

    if (!taxAccount) {
      throw new Error(
        'Tax is charged on this invoice but no liability account was found. Add a tax / VAT payable account.'
      );
    }
    lines.push({
      account: taxAccount._id,
      debit: 0,
      credit: tax,
      memo: `Invoice INV-${invoice.invoiceNumber} — tax`
    });
  }

  validateBalancedLines(lines);

  const entry = new JournalEntry({
    date: invoice.paidAt ? new Date(invoice.paidAt) : new Date(),
    description: `Invoice INV-${invoice.invoiceNumber} — payment received (${invoice.currency || 'KES'})`,
    lines,
    status: 'draft',
    sourceType: 'invoice',
    sourceId: id,
    reference: `INV-${invoice.invoiceNumber}`,
    createdBy: userId
  });

  await entry.save();

  const plainLines = entry.lines.map((l) => ({
    account: l.account,
    debit: l.debit || 0,
    credit: l.credit || 0
  }));
  await applyJournalLinesToBalances(plainLines);

  entry.status = 'posted';
  entry.postedBy = userId;
  entry.postedAt = new Date();
  await entry.save();

  await Invoice.findByIdAndUpdate(id, { paymentJournalEntry: entry._id });

  await logAccountingAudit({
    userId,
    action: 'invoice_payment_journal',
    entityType: 'invoice',
    entityId: id,
    details: {
      invoiceNumber: invoice.invoiceNumber,
      journalEntryNumber: entry.entryNumber,
      total
    },
    req
  });

  return { skipped: false, entry };
}

module.exports = { postInvoicePaymentJournal };
