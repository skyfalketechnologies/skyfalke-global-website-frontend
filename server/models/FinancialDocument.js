const mongoose = require('mongoose');

const lineSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  unitPrice: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 }
});

const financialDocumentSchema = new mongoose.Schema({
  documentNumber: { type: String, required: true, unique: true, trim: true },
  documentType: {
    type: String,
    required: true,
    enum: ['sales_receipt', 'credit_note', 'debit_note'],
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'applied', 'void'],
    default: 'draft',
    index: true
  },
  issueDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date },
  client: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    company: String,
    taxId: String
  },
  items: [lineSchema],
  subtotal: { type: Number, required: true, min: 0 },
  taxRate: { type: Number, default: 0, min: 0, max: 100 },
  taxAmount: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  currency: { type: String, enum: ['USD', 'KES'], default: 'KES' },
  notes: { type: String, trim: true },
  relatedInvoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  reason: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

financialDocumentSchema.pre('save', function(next) {
  this.items.forEach((item) => {
    item.total = item.quantity * item.unitPrice;
  });
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.taxAmount = (this.subtotal - this.discount) * (this.taxRate / 100);
  this.total = this.subtotal - this.discount + this.taxAmount;
  next();
});

financialDocumentSchema.statics.generateDocumentNumber = async function(documentType) {
  const prefix = documentType === 'sales_receipt' ? 'SR' : documentType === 'credit_note' ? 'CN' : 'DN';
  const count = await this.countDocuments({ documentType });
  return `${prefix}${String(count + 1).padStart(5, '0')}`;
};

financialDocumentSchema.index({ documentType: 1, issueDate: -1 });
financialDocumentSchema.index({ 'client.email': 1 });

module.exports = mongoose.model('FinancialDocument', financialDocumentSchema);
