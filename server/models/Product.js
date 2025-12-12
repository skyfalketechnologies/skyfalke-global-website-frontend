const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  costPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Hoodies', 'Caps', 'Mugs', 'Stickers', 'T-Shirts', 'Accessories', 'Digital Products']
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    default: 'Skyfalke'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    imageKitId: String
  }],
  variants: [{
    name: {
      type: String,
      required: true
    },
    options: [{
      name: String,
      price: Number,
      stock: Number,
      sku: String
    }]
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  tags: [{
    type: String,
    trim: true
  }],
  features: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    min: 0
  },
  saleStartDate: Date,
  saleEndDate: Date,
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingClass: {
      type: String,
      enum: ['Standard', 'Express', 'Premium'],
      default: 'Standard'
    }
  },
  tax: {
    rate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    taxable: {
      type: Boolean,
      default: true
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ isOnSale: 1, isActive: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual for current price (sale or regular)
productSchema.virtual('currentPrice').get(function() {
  if (this.isOnSale && this.salePrice) {
    const now = new Date();
    if ((!this.saleStartDate || now >= this.saleStartDate) && 
        (!this.saleEndDate || now <= this.saleEndDate)) {
      return this.salePrice;
    }
  }
  return this.price;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock <= 0) return 'out_of_stock';
  if (this.stock <= 5) return 'low_stock';
  return 'in_stock';
});

// Pre-save middleware to generate SKU if not provided and ensure isActive is set
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = `SKY-${this.category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
  }
  
  // Ensure isActive is set to true by default for new products
  if (this.isNew && this.isActive === undefined) {
    this.isActive = true;
  }
  
  next();
});

// Method to update rating
productSchema.methods.updateRating = function() {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = totalRating / this.reviews.length;
    this.rating.count = this.reviews.length;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }
};

// Static method to get featured products
productSchema.statics.getFeatured = function(limit = 8) {
  return this.find({ isFeatured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
};

// Static method to get products on sale
productSchema.statics.getOnSale = function(limit = 8) {
  const now = new Date();
  return this.find({
    isOnSale: true,
    isActive: true,
    $and: [
      {
        $or: [
          { saleStartDate: { $lte: now } },
          { saleStartDate: { $exists: false } }
        ]
      },
      {
        $or: [
          { saleEndDate: { $gte: now } },
          { saleEndDate: { $exists: false } }
        ]
      }
    ]
  }).sort({ createdAt: -1 }).limit(limit).exec();
};

// Static method to search products
productSchema.statics.search = function(query, options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    inStock,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 12
  } = options;

  let filter = { isActive: true };

  // Text search
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ];
  }

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  // Stock filter
  if (inStock) {
    filter.stock = { $gt: 0 };
  }

  // Sort options
  let sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return this.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
};

module.exports = mongoose.model('Product', productSchema);
