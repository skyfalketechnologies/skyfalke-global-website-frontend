const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');
const ImageKitService = require('../services/imageKitService');

// Configure multer for product images (disk storage for regular uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/products/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer for ImageKit uploads (memory storage)
const imageKitUpload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, and WebP files are allowed!'));
    }
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, and WebP files are allowed!'));
    }
  }
});

// ==================== PUBLIC ROUTES ====================

// @route   GET /api/shop/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/products', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const options = {
      category,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      inStock: inStock === 'true',
      sortBy,
      sortOrder,
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const products = await Product.search(search, options);
    
    // Build the same filter for counting
    let countFilter = { isActive: true };
    if (search) {
      countFilter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (category) countFilter.category = category;
    if (minPrice || maxPrice) {
      countFilter.price = {};
      if (minPrice) countFilter.price.$gte = parseFloat(minPrice);
      if (maxPrice) countFilter.price.$lte = parseFloat(maxPrice);
    }
    if (inStock === 'true') countFilter.stock = { $gt: 0 };
    
    const total = await Product.countDocuments(countFilter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNextPage: parseInt(page) < Math.ceil(total / limit),
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/shop/products/featured
// @desc    Get featured products
// @access  Public
router.get('/products/featured', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const products = await Product.getFeatured(parseInt(limit));
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/shop/products/sale
// @desc    Get products on sale
// @access  Public
router.get('/products/sale', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const products = await Product.getOnSale(parseInt(limit));
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching sale products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/shop/products/:slug
// @desc    Get product by slug
// @access  Public
router.get('/products/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(4);

    res.json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/shop/debug/products
// @desc    Debug route to check products in database
// @access  Public
router.get('/debug/products', async (req, res) => {
  try {
    const allProducts = await Product.find({});
    const activeProducts = await Product.find({ isActive: true });
    
    res.json({
      success: true,
      data: {
        totalProducts: allProducts.length,
        activeProducts: activeProducts.length,
        allProducts: allProducts.map(p => ({
          _id: p._id,
          name: p.name,
          isActive: p.isActive,
          category: p.category,
          price: p.price,
          stock: p.stock,
          images: p.images?.length || 0
        }))
      }
    });
  } catch (error) {
    console.error('Error in debug route:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/shop/categories
// @desc    Get all product categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        categories,
        stats: categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/shop/orders
// @desc    Create a new order
// @access  Private
router.post('/orders', auth, async (req, res) => {
  try {
    const {
      items,
      billingAddress,
      shippingAddress,
      paymentMethod,
      couponCode,
      notes
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cart is empty' 
      });
    }

    // Get products and validate stock
    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'Some products not found' 
      });
    }

    // Build order items and validate stock
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId);
      
      if (!product) {
        return res.status(400).json({ 
          success: false, 
          message: `Product ${item.productId} not found` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}` 
        });
      }

      const itemTotal = product.currentPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        quantity: item.quantity,
        price: product.currentPrice,
        total: itemTotal,
        variant: item.variant || {},
        image: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url
      });
    }

    // Create order object
    const orderData = {
      customer: {
        userId: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone || billingAddress.phone
      },
      billingAddress,
      shippingAddress,
      items: orderItems,
      subtotal,
      payment: {
        method: paymentMethod
      },
      notes: {
        customer: notes
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    // Apply coupon if provided
    if (couponCode) {
      try {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
          // Generate temporary order number for coupon calculation
          const tempDate = new Date();
          const tempYear = tempDate.getFullYear().toString().slice(-2);
          const tempMonth = (tempDate.getMonth() + 1).toString().padStart(2, '0');
          const tempDay = tempDate.getDate().toString().padStart(2, '0');
          const tempRandom = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          const tempOrderNumber = `TEMP-${tempYear}${tempMonth}${tempDay}-${tempRandom}`;
          
          const tempOrderData = { ...orderData, orderNumber: tempOrderNumber };
          const order = new Order(tempOrderData);
          coupon.applyToOrder(order, req.user._id);
          await coupon.save();
          orderData.discount = order.discount;
          orderData.total = order.total;
        }
      } catch (couponError) {
        return res.status(400).json({ 
          success: false, 
          message: couponError.message 
        });
      }
    }

    // Generate order number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = `SKY-${year}${month}${day}-${random}`;

    // Add order number to order data
    orderData.orderNumber = orderNumber;

    // Calculate totals
    const order = new Order(orderData);
    order.calculateTotals();

    // Save order
    await order.save();

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      data: {
        order,
        message: 'Order created successfully'
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/shop/orders
// @desc    Get user's orders
// @access  Private
router.get('/orders', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const orders = await Order.getByCustomer(req.user._id, parseInt(page), parseInt(limit));
    
    const total = await Order.countDocuments({ 'customer.userId': req.user._id });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalOrders: total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/shop/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/orders/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      'customer.userId': req.user._id
    }).populate('items.productId', 'name images slug');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/shop/coupons/validate
// @desc    Validate coupon code
// @access  Private
router.post('/coupons/validate', auth, async (req, res) => {
  try {
    const { code, orderData } = req.body;

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Coupon code is required' 
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid coupon code' 
      });
    }

    // Create temporary order for validation
    const tempOrder = new Order(orderData);
    const validation = coupon.validateForOrder(tempOrder, req.user._id);

    if (!validation.valid) {
      return res.status(400).json({ 
        success: false, 
        message: validation.message 
      });
    }

    const discountAmount = coupon.calculateDiscount(tempOrder.subtotal);

    res.json({
      success: true,
      data: {
        coupon: {
          code: coupon.code,
          name: coupon.name,
          type: coupon.type,
          value: coupon.value,
          discountAmount
        }
      }
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== ADMIN ROUTES ====================

// @route   POST /api/shop/admin/products/upload-images
// @desc    Upload product images to ImageKit
// @access  Private (Admin)
router.post('/admin/products/upload-images', adminAuth, imageKitUpload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No images uploaded' 
      });
    }

    const uploadedImages = [];
    
    for (const file of req.files) {
      try {
        const uploadResult = await ImageKitService.uploadImage(file, 'product-images');
        uploadedImages.push({
          url: uploadResult.url,
          alt: file.originalname,
          imageKitId: uploadResult.imageKitId
        });
      } catch (imageError) {
        console.error('Error uploading image to ImageKit:', imageError);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to upload image to ImageKit' 
        });
      }
    }

    res.json({
      success: true,
      data: {
        images: uploadedImages,
        message: 'Images uploaded successfully'
      }
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/shop/admin/products
// @desc    Create a new product
// @access  Private (Admin)
router.post('/admin/products', adminAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      comparePrice,
      costPrice,
      category,
      subcategory,
      brand,
      stock,
      weight,
      tags,
      features,
      isActive,
      isFeatured,
      isOnSale,
      salePrice,
      saleStartDate,
      saleEndDate,
      seoTitle,
      seoDescription,
      seoKeywords
    } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product name is required' 
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product description is required' 
      });
    }

    if (!shortDescription || !shortDescription.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product short description is required' 
      });
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid price is required' 
      });
    }

    if (!category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product category is required' 
      });
    }

    // Generate slug
    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ 
        success: false, 
        message: 'A product with this name already exists' 
      });
    }

    // Process images from request body (already uploaded to ImageKit)
    const images = req.body.images || [];

    const productData = {
      name: name.trim(),
      slug,
      description: description.trim(),
      shortDescription: shortDescription.trim(),
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      costPrice: costPrice ? parseFloat(costPrice) : null,
      category,
      subcategory: subcategory ? subcategory.trim() : null,
      brand: brand ? brand.trim() : 'Skyfalke',
      stock: parseInt(stock) || 0,
      weight: weight ? parseFloat(weight) : null,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
      features: features ? features.split(',').map(feature => feature.trim()).filter(feature => feature.length > 0) : [],
      isActive: isActive === 'true' || isActive === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isOnSale: isOnSale === 'true' || isOnSale === true,
      salePrice: salePrice ? parseFloat(salePrice) : null,
      saleStartDate: saleStartDate ? new Date(saleStartDate) : null,
      saleEndDate: saleEndDate ? new Date(saleEndDate) : null,
      images,
      seo: {
        title: seoTitle ? seoTitle.trim() : null,
        description: seoDescription ? seoDescription.trim() : null,
        keywords: seoKeywords ? seoKeywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0) : []
      },
      createdBy: req.user._id
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      data: {
        product,
        message: 'Product created successfully'
      }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'A product with this name or slug already exists' 
      });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/shop/admin/products
// @desc    Get all products (Admin)
// @access  Private (Admin)
router.get('/admin/products', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      switch (status) {
        case 'active':
          filter.isActive = true;
          break;
        case 'inactive':
          filter.isActive = false;
          break;
        case 'featured':
          filter.isFeatured = true;
          break;
        case 'sale':
          filter.isOnSale = true;
          break;
        case 'out_of_stock':
          filter.stock = 0;
          break;
        case 'low_stock':
          filter.stock = { $gt: 0, $lte: 5 };
          break;
      }
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('createdBy', 'firstName lastName');

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/shop/admin/products/:id
// @desc    Get single product by ID (Admin)
// @access  Private (Admin)
router.get('/admin/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/shop/admin/products/:id
// @desc    Update product
// @access  Private (Admin)
router.put('/admin/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    const updateData = { ...req.body };
    
    // Handle price fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.comparePrice) updateData.comparePrice = parseFloat(updateData.comparePrice);
    if (updateData.costPrice) updateData.costPrice = parseFloat(updateData.costPrice);
    if (updateData.salePrice) updateData.salePrice = parseFloat(updateData.salePrice);
    
    // Handle boolean fields
    if (updateData.isActive !== undefined) updateData.isActive = updateData.isActive === 'true';
    if (updateData.isFeatured !== undefined) updateData.isFeatured = updateData.isFeatured === 'true';
    if (updateData.isOnSale !== undefined) updateData.isOnSale = updateData.isOnSale === 'true';
    
    // Handle arrays
    if (updateData.tags) updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
    if (updateData.features) updateData.features = updateData.features.split(',').map(feature => feature.trim());
    if (updateData.seoKeywords) updateData.seoKeywords = updateData.seoKeywords.split(',').map(keyword => keyword.trim());
    
    // Handle images from request body (already uploaded to ImageKit)
    if (updateData.images) {
      updateData.images = updateData.images;
    }

    updateData.updatedBy = req.user._id;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: {
        product: updatedProduct,
        message: 'Product updated successfully'
      }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PATCH /api/shop/admin/products/:id
// @desc    Update product (partial update)
// @access  Private (Admin)
router.patch('/admin/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    const updateData = { ...req.body };
    
    // Handle price fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.comparePrice) updateData.comparePrice = parseFloat(updateData.comparePrice);
    if (updateData.costPrice) updateData.costPrice = parseFloat(updateData.costPrice);
    if (updateData.salePrice) updateData.salePrice = parseFloat(updateData.salePrice);
    
    // Handle boolean fields
    if (updateData.isActive !== undefined) updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
    if (updateData.isFeatured !== undefined) updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
    if (updateData.isOnSale !== undefined) updateData.isOnSale = updateData.isOnSale === 'true' || updateData.isOnSale === true;
    
    // Handle arrays
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    if (updateData.features && typeof updateData.features === 'string') {
      updateData.features = updateData.features.split(',').map(feature => feature.trim()).filter(feature => feature.length > 0);
    }
    if (updateData.seoKeywords && typeof updateData.seoKeywords === 'string') {
      updateData.seoKeywords = updateData.seoKeywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0);
    }
    
    // Handle string fields - trim whitespace
    if (updateData.name) updateData.name = updateData.name.trim();
    if (updateData.description) updateData.description = updateData.description.trim();
    if (updateData.shortDescription) updateData.shortDescription = updateData.shortDescription.trim();
    if (updateData.brand) updateData.brand = updateData.brand.trim();
    if (updateData.subcategory) updateData.subcategory = updateData.subcategory.trim();
    
    // Handle SEO fields
    if (updateData.seoTitle) updateData.seoTitle = updateData.seoTitle.trim();
    if (updateData.seoDescription) updateData.seoDescription = updateData.seoDescription.trim();
    
    // Handle images from request body (already uploaded to ImageKit)
    if (updateData.images) {
      updateData.images = updateData.images;
    }

    updateData.updatedBy = req.user._id;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: {
        product: updatedProduct,
        message: 'Product updated successfully'
      }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'A product with this name or slug already exists' 
      });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/shop/admin/products/:id
// @desc    Delete product
// @access  Private (Admin)
router.delete('/admin/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Delete product images from ImageKit
    if (product.images) {
      for (const image of product.images) {
        if (image.imageKitId) {
          try {
            await ImageKitService.deleteImage(image.imageKitId);
          } catch (imageError) {
            console.error('Failed to delete image from ImageKit:', imageError);
          }
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/shop/admin/orders
// @desc    Get all orders (Admin)
// @access  Private (Admin)
router.get('/admin/orders', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      paymentStatus,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.firstName': { $regex: search, $options: 'i' } },
        { 'customer.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter['payment.status'] = paymentStatus;
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('customer.userId', 'firstName lastName email');

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalOrders: total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/shop/admin/orders/:id/status
// @desc    Update order status
// @access  Private (Admin)
router.put('/admin/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, notes, trackingNumber, carrier } = req.body;

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    order.updateStatus(status, notes);

    if (trackingNumber) {
      order.shipping.trackingNumber = trackingNumber;
    }

    if (carrier) {
      order.shipping.carrier = carrier;
    }

    await order.save();

    res.json({
      success: true,
      data: {
        order,
        message: 'Order status updated successfully'
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/shop/admin/stats
// @desc    Get shop statistics
// @access  Private (Admin)
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const [orderStats, productStats] = await Promise.all([
      Order.getStats(),
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            activeProducts: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
            featuredProducts: { $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] } },
            outOfStock: { $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] } },
            lowStock: { $sum: { $cond: [{ $and: [{ $gt: ['$stock', 0] }, { $lte: ['$stock', 5] }] }, 1, 0] } }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        orders: orderStats,
        products: productStats[0] || {
          totalProducts: 0,
          activeProducts: 0,
          featuredProducts: 0,
          outOfStock: 0,
          lowStock: 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching shop stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
