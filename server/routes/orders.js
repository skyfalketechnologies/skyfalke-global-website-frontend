const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const { sendNotificationToAllAdmins } = require('../socket');

// Create a new order (public)
router.post('/', async (req, res) => {
  try {
    const {
      items,
      billingAddress,
      shippingAddress,
      payment,
      subtotal,
      shipping,
      tax,
      total,
      notes
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    if (!billingAddress || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Billing and shipping addresses are required'
      });
    }

    // Validate and populate items with product details
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        image: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url
      });
    }

    // Generate order number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = `SKY-${year}${month}${day}-${random}`;

    // Create the order
    const order = new Order({
      orderNumber,
      customer: {
        email: billingAddress.email,
        firstName: billingAddress.firstName,
        lastName: billingAddress.lastName,
        phone: billingAddress.phone
      },
      billingAddress,
      shippingAddress,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      payment: {
        method: payment.method,
        cardNumber: payment.cardNumber,
        cardExpiry: payment.cardExpiry,
        cardCvv: payment.cardCvv,
        cardName: payment.cardName,
        mpesaPhone: payment.mpesaPhone
      },
      notes: {
        customer: notes
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await order.save();

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    // Send notification to all admins
    try {
      await sendNotificationToAllAdmins({
        title: 'New Order Received',
        message: `New order #${order.orderNumber} from ${billingAddress.firstName} ${billingAddress.lastName} for ${total.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}`,
        type: 'order',
        category: 'order',
        priority: 'high',
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          customerName: `${billingAddress.firstName} ${billingAddress.lastName}`,
          total: total,
          itemCount: orderItems.length
        },
        actionUrl: `/system/dashboard/orders/${order._id}`
      });
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
          payment: {
            method: order.payment.method,
            status: order.payment.status
          }
        }
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Get orders for authenticated user
router.get('/my-orders', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const orders = await Order.getByCustomer(req.user.id, page, limit);
    const totalOrders = await Order.countDocuments({ 'customer.userId': req.user.id });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalOrders / limit),
          totalOrders,
          hasNext: page * limit < totalOrders,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Admin routes - must come before /:orderId route
// Get all orders (admin only)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const search = req.query.search;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.firstName': { $regex: search, $options: 'i' } },
        { 'customer.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('items.productId', 'name images');

    const totalOrders = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalOrders / limit),
          totalOrders,
          hasNext: page * limit < totalOrders,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Get order statistics (admin)
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {

    const stats = await Order.getStats();
    const statsData = stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      pendingOrders: 0,
      processingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0
    };

    res.json({
      success: true,
      data: { stats: statsData }
    });

  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
});

// Get order by ID (admin)
router.get('/admin/:orderId', adminAuth, async (req, res) => {
  try {

    const order = await Order.findById(req.params.orderId)
      .populate('items.productId', 'name images slug sku');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// Update order status (admin)
router.patch('/admin/:orderId/status', adminAuth, async (req, res) => {
  try {

    const { status, notes } = req.body;

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.updateStatus(status, notes);
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// Get order by ID (for authenticated user) - must come after admin routes
router.get('/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      'customer.userId': req.user.id
    }).populate('items.productId', 'name images slug');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

module.exports = router;
