const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const paymentService = require('../services/paymentService');
const { auth, adminAuth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for payment routes (more lenient than general rate limiting)
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Allow 20 payment attempts per 15 minutes per IP
  message: {
    success: false,
    error: 'Too many payment attempts from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful payments
  skipFailedRequests: false, // Count failed attempts
});

// M-Pesa Payment Routes

// @route   POST /api/payments/mpesa/initiate
// @desc    Initiate M-Pesa payment
// @access  Public
router.post('/mpesa/initiate', paymentLimiter, async (req, res) => {
  try {
    const { orderId, phoneNumber, amount, description } = req.body;

    // Validate required fields
    if (!orderId || !phoneNumber || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, phone number, and amount are required'
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Validate amount matches order total
    if (Math.abs(amount - order.total) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Amount does not match order total'
      });
    }

    // Format phone number
    const formattedPhone = paymentService.formatPhoneNumber(phoneNumber);
    
    // Validate payment amount
    if (!paymentService.validatePaymentAmount(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount'
      });
    }

    // Initiate M-Pesa payment
    const result = await paymentService.initiateMpesaPayment(
      orderId,
      formattedPhone,
      amount,
      description || `Payment for order ${order.orderNumber}`
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }

    // Update order with M-Pesa details
    order.payment.status = 'processing';
    order.payment.mpesaCheckoutRequestId = result.checkoutRequestId;
    order.payment.mpesaMerchantRequestId = result.merchantRequestId;
    order.payment.transactionId = paymentService.generateTransactionId();
    await order.save();

    res.json({
      success: true,
      message: 'M-Pesa payment initiated successfully',
      data: {
        checkoutRequestId: result.checkoutRequestId,
        merchantRequestId: result.merchantRequestId,
        responseCode: result.responseCode,
        responseDescription: result.responseDescription
      }
    });
  } catch (error) {
    console.error('Error initiating M-Pesa payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate M-Pesa payment'
    });
  }
});

// @route   POST /api/payments/mpesa/callback
// @desc    M-Pesa payment callback
// @access  Public
router.post('/mpesa/callback', async (req, res) => {
  try {
    const { Body } = req.body;
    const { stkCallback } = Body;

    if (!stkCallback) {
      return res.status(400).json({
        success: false,
        message: 'Invalid callback data'
      });
    }

    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = stkCallback;

    // Find order by checkout request ID
    const order = await Order.findOne({
      'payment.mpesaCheckoutRequestId': CheckoutRequestID
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order based on result
    if (ResultCode === 0) {
      // Payment successful
      const metadata = CallbackMetadata?.Item || [];
      const amount = metadata.find(item => item.Name === 'Amount')?.Value;
      const mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value;
      const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;

      order.payment.status = 'completed';
      order.payment.transactionId = mpesaReceiptNumber;
      order.payment.processedAt = new Date();
      order.status = 'confirmed';
      order.payment.mpesaPhone = phoneNumber;

      await order.save();

      res.json({
        success: true,
        message: 'Payment completed successfully'
      });
    } else {
      // Payment failed
      order.payment.status = 'failed';
      order.payment.failureReason = ResultDesc;
      await order.save();

      res.json({
        success: false,
        message: 'Payment failed',
        error: ResultDesc
      });
    }
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process M-Pesa callback'
    });
  }
});

// @route   GET /api/payments/mpesa/status/:checkoutRequestId
// @desc    Check M-Pesa payment status
// @access  Public
router.get('/mpesa/status/:checkoutRequestId', async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;

    // Find order by checkout request ID
    const order = await Order.findOne({
      'payment.mpesaCheckoutRequestId': checkoutRequestId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check payment status with M-Pesa
    const statusResult = await paymentService.checkMpesaPaymentStatus(checkoutRequestId);

    if (!statusResult.success) {
      return res.status(400).json({
        success: false,
        message: statusResult.error
      });
    }

    // Update order status based on M-Pesa response
    if (statusResult.resultCode === 0) {
      order.payment.status = 'completed';
      order.status = 'confirmed';
      order.payment.processedAt = new Date();
    } else {
      order.payment.status = 'failed';
      order.payment.failureReason = statusResult.resultDesc;
    }

    await order.save();

    res.json({
      success: true,
      data: {
        orderId: order._id,
        paymentStatus: order.payment.status,
        orderStatus: order.status,
        resultCode: statusResult.resultCode,
        resultDesc: statusResult.resultDesc
      }
    });
  } catch (error) {
    console.error('Error checking M-Pesa payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check M-Pesa payment status'
    });
  }
});

// PayPal Payment Routes

// @route   POST /api/payments/paypal/create
// @desc    Create PayPal order
// @access  Public
router.post('/paypal/create', paymentLimiter, async (req, res) => {
  try {
    const { orderId, amount, currency, description } = req.body;

    // Validate required fields
    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and amount are required'
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Validate amount matches order total
    if (Math.abs(amount - order.total) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Amount does not match order total'
      });
    }

    // Create PayPal order
    const result = await paymentService.createPaypalOrder(
      orderId,
      amount,
      currency || 'USD',
      description || `Payment for order ${order.orderNumber}`
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }

    // Update order with PayPal details
    order.payment.status = 'processing';
    order.payment.paypalOrderId = result.orderId;
    order.payment.transactionId = paymentService.generateTransactionId();
    await order.save();

    res.json({
      success: true,
      message: 'PayPal order created successfully',
      data: {
        orderId: result.orderId,
        status: result.status,
        links: result.links
      }
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create PayPal order'
    });
  }
});

// @route   POST /api/payments/paypal/execute
// @desc    Execute PayPal payment
// @access  Public
router.post('/paypal/execute', paymentLimiter, async (req, res) => {
  try {
    const { orderId, paypalOrderId } = req.body;

    // Validate required fields
    if (!orderId || !paypalOrderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and PayPal order ID are required'
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Capture PayPal payment
    const result = await paymentService.capturePaypalOrder(paypalOrderId);

    if (!result.success) {
      // Update order status to failed
      order.payment.status = 'failed';
      order.payment.failureReason = result.error;
      await order.save();

      return res.status(400).json({
        success: false,
        message: result.error
      });
    }

    // Update order with successful payment
    order.payment.status = 'completed';
    order.payment.paypalPaymentId = result.purchaseUnits[0]?.payments?.captures[0]?.id;
    order.payment.paypalPayerId = result.purchaseUnits[0]?.payments?.captures[0]?.payer?.payer_id;
    order.payment.processedAt = new Date();
    order.status = 'confirmed';
    await order.save();

    res.json({
      success: true,
      message: 'PayPal payment completed successfully',
      data: {
        orderId: result.orderId,
        status: result.status,
        paymentId: order.payment.paypalPaymentId
      }
    });
  } catch (error) {
    console.error('Error executing PayPal payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to execute PayPal payment'
    });
  }
});

// @route   POST /api/payments/paypal/webhook
// @desc    PayPal webhook handler
// @access  Public
router.post('/paypal/webhook', async (req, res) => {
  try {
    const headers = req.headers;
    const body = req.body;

    // Verify webhook signature (implement proper verification in production)
    const isValid = paymentService.verifyPaypalWebhook(headers, body, process.env.PAYPAL_WEBHOOK_ID);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    const { event_type, resource } = body;

    // Handle different PayPal events
    switch (event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        // Payment was captured successfully
        const captureId = resource.id;
        const order = await Order.findOne({
          'payment.paypalPaymentId': captureId
        });

        if (order) {
          order.payment.status = 'completed';
          order.status = 'confirmed';
          order.payment.processedAt = new Date();
          await order.save();
        }
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        // Payment was denied
        const deniedOrder = await Order.findOne({
          'payment.paypalOrderId': resource.supplementary_data?.related_ids?.order_id
        });

        if (deniedOrder) {
          deniedOrder.payment.status = 'failed';
          deniedOrder.payment.failureReason = 'Payment was denied by PayPal';
          await deniedOrder.save();
        }
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        // Payment was refunded
        const refundedOrder = await Order.findOne({
          'payment.paypalPaymentId': resource.supplementary_data?.related_ids?.capture_id
        });

        if (refundedOrder) {
          refundedOrder.payment.status = 'refunded';
          refundedOrder.payment.refundAmount = parseFloat(resource.amount.value);
          refundedOrder.payment.refundedAt = new Date();
          await refundedOrder.save();
        }
        break;
    }

    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process PayPal webhook'
    });
  }
});

// @route   GET /api/payments/paypal/status/:paypalOrderId
// @desc    Check PayPal payment status
// @access  Public
router.get('/paypal/status/:paypalOrderId', async (req, res) => {
  try {
    const { paypalOrderId } = req.params;

    // Find order by PayPal order ID
    const order = await Order.findOne({
      'payment.paypalOrderId': paypalOrderId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get PayPal order details
    const result = await paymentService.getPaypalOrderDetails(paypalOrderId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }

    // Update order status based on PayPal response
    if (result.status === 'COMPLETED') {
      order.payment.status = 'completed';
      order.status = 'confirmed';
      order.payment.processedAt = new Date();
    } else if (result.status === 'CANCELLED') {
      order.payment.status = 'cancelled';
      order.status = 'cancelled';
    }

    await order.save();

    res.json({
      success: true,
      data: {
        orderId: order._id,
        paymentStatus: order.payment.status,
        orderStatus: order.status,
        paypalStatus: result.status
      }
    });
  } catch (error) {
    console.error('Error checking PayPal payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check PayPal payment status'
    });
  }
});

// General Payment Routes

// @route   GET /api/payments/status/:orderId
// @desc    Get payment status for an order
// @access  Public
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentMethod: order.payment.method,
        paymentStatus: order.payment.status,
        orderStatus: order.status,
        total: order.total,
        transactionId: order.payment.transactionId,
        processedAt: order.payment.processedAt
      }
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status'
    });
  }
});

// Test endpoint to verify payment system configuration
router.get('/test', async (req, res) => {
  try {
    const config = {
      mpesa: {
        configured: !!(process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET && process.env.MPESA_SHORTCODE && process.env.MPESA_PASSKEY),
        baseUrl: process.env.NODE_ENV === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke'
      },
      paypal: {
        configured: !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
        baseUrl: process.env.NODE_ENV === 'production' ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com'
      },
      environment: process.env.NODE_ENV || 'development'
    };

    res.json({
      success: true,
      data: config,
      message: 'Payment system configuration check'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking payment configuration'
    });
  }
});

module.exports = router;
