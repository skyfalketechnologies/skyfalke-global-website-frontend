const mongoose = require('mongoose');

const quotationItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const quotationSchema = new mongoose.Schema({
  quotationNumber: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
    default: 'draft'
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  client: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  items: [quotationItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'KES'],
    default: 'USD'
  },
  notes: {
    type: String,
    trim: true
  },
  terms: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sentAt: Date,
  acceptedAt: Date,
  rejectedAt: Date,
  convertedToInvoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  }
}, {
  timestamps: true
});

// Virtual for formatted quotation number
quotationSchema.virtual('formattedNumber').get(function() {
  return `QT-${this.quotationNumber}`;
});

// Virtual for days until expiry
quotationSchema.virtual('daysUntilExpiry').get(function() {
  const today = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for expired status
quotationSchema.virtual('isExpired').get(function() {
  return this.status !== 'accepted' && this.status !== 'rejected' && new Date() > this.expiryDate;
});

// Pre-save middleware to calculate totals
quotationSchema.pre('save', function(next) {
  // Calculate item totals
  this.items.forEach(item => {
    item.total = item.quantity * item.unitPrice;
  });
  
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  
  // Calculate tax amount
  this.taxAmount = (this.subtotal - this.discount) * (this.taxRate / 100);
  
  // Calculate total
  this.total = this.subtotal - this.discount + this.taxAmount;
  
  next();
});

// Static method to generate next quotation number
quotationSchema.statics.generateQuotationNumber = async function() {
  const lastQuotation = await this.findOne({}, {}, { sort: { createdAt: -1 } });
  if (!lastQuotation) {
    return '0001';
  }
  
  const lastNumber = parseInt(lastQuotation.quotationNumber);
  const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
  return nextNumber;
};

// Method to convert quotation to invoice
quotationSchema.methods.convertToInvoice = async function() {
  const Invoice = mongoose.model('Invoice');
  
  const invoiceData = {
    invoiceNumber: await Invoice.generateInvoiceNumber(),
    status: 'draft',
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    client: this.client,
    items: this.items,
    subtotal: this.subtotal,
    taxRate: this.taxRate,
    taxAmount: this.taxAmount,
    discount: this.discount,
    total: this.total,
    notes: this.notes,
    terms: this.terms,
    createdBy: this.createdBy,
    lastModifiedBy: this.lastModifiedBy
  };
  
  const invoice = new Invoice(invoiceData);
  await invoice.save();
  
  // Update quotation status
  this.status = 'accepted';
  this.acceptedAt = new Date();
  this.convertedToInvoice = invoice._id;
  await this.save();
  
  return invoice;
};

// Index for better query performance
quotationSchema.index({ quotationNumber: 1 }, { unique: true });
quotationSchema.index({ status: 1 });
quotationSchema.index({ 'client.email': 1 });
quotationSchema.index({ issueDate: -1 });
quotationSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Quotation', quotationSchema);
