const path = require('path');

/**
 * Branding presets for generated invoices (PDF + email).
 * `invoiceType` on an invoice selects one of these; falls back to `standard`.
 */
/** Payment options shown on every invoice (PDF, preview and email). */
const paymentOptions = {
  mpesa: {
    paybill: '4567109',
    accountNote: 'Use the invoice number as the account number'
  },
  bank: {
    accountNumber: '00310686551250',
    accountName: 'SKYFALKE LIMITED',
    name: 'I&M Bank',
    branch: 'Sarit Center',
    currency: 'USD'
  }
};

const brands = {
  standard: {
    label: 'Skyfalke',
    companyName: 'SKYFALKE LIMITED',
    tagline: 'Digital Solutions Partner',
    logoPath: path.join(__dirname, '../public/images/logo.png'),
    logoWidth: 120,
    primaryColor: '#303661',
    accentColor: '#e0ae00',
    lightBg: '#f4f5f9',
    email: 'billing@skyfalke.com',
    phone: '+254(071)797-238',
    taxPin: 'P052474944J',
    address: 'Nairobi, Kenya',
    footerNote: 'Authorized by Skyfalke Limited.'
  },
  'google-cloud': {
    label: 'Google Cloud',
    companyName: 'SKYFALKE LIMITED',
    tagline: 'Google Cloud Partner',
    logoPath: path.join(__dirname, '../public/images/google-cloud-logo.png'),
    logoWidth: 160,
    primaryColor: '#1a73e8',
    accentColor: '#34a853',
    lightBg: '#f1f6fe',
    email: 'billing@skyfalke.com',
    phone: '+254(071)797-238',
    taxPin: 'P052474944J',
    address: 'Nairobi, Kenya',
    footerNote: ''
  }
};

function getBrand(invoiceType) {
  return brands[invoiceType] || brands.standard;
}

module.exports = { brands, getBrand, paymentOptions };
