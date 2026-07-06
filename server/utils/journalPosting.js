const Account = require('../models/Account');

function isDebitNormal(accountType) {
  return ['asset', 'expense', 'bank', 'cash', 'accounts-receivable'].includes(accountType);
}

/**
 * Apply posted journal lines to account balances (double-entry).
 * @param {Array<{ account: import('mongoose').Types.ObjectId, debit?: number, credit?: number }>} lines
 */
async function applyJournalLinesToBalances(lines) {
  for (const line of lines) {
    const debit = Number(line.debit) || 0;
    const credit = Number(line.credit) || 0;
    if (debit === 0 && credit === 0) continue;
    if (debit > 0 && credit > 0) {
      throw new Error('Each line must be either debit or credit, not both');
    }

    const account = await Account.findById(line.account);
    if (!account) {
      throw new Error('Account not found');
    }
    if (!account.isActive) {
      throw new Error(`Account ${account.name} is inactive`);
    }

    const delta = isDebitNormal(account.type) ? debit - credit : credit - debit;
    account.balance += delta;
    await account.save();
  }
}

function validateBalancedLines(lines) {
  const totalDebit = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  if (Math.abs(totalDebit - totalCredit) > 0.0001) {
    throw new Error('Journal entry is not balanced: debits must equal credits');
  }
  if (totalDebit === 0) {
    throw new Error('Journal entry must have non-zero amounts');
  }
}

module.exports = { applyJournalLinesToBalances, validateBalancedLines, isDebitNormal };
