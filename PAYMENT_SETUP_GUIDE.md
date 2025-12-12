# Payment System Setup Guide

## 🚀 **Payment Systems Implemented**

### ✅ **M-Pesa STK Push**
- **Endpoint**: `POST /api/payments/mpesa/initiate`
- **Features**: 
  - STK Push payment initiation
  - Phone number formatting for Kenyan numbers
  - Real-time payment status checking
  - Callback handling for payment completion

### ✅ **PayPal Integration**
- **Endpoints**: 
  - `POST /api/payments/paypal/create` - Create PayPal order
  - `POST /api/payments/paypal/execute` - Execute PayPal payment
- **Features**:
  - Secure order creation and execution
  - Redirect-based payment flow
  - Webhook processing for status updates
  - Success/cancel page handling

## 🔧 **Environment Configuration**

Add these variables to your `.env` file:

```env
# M-Pesa Configuration
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=your_mpesa_shortcode
MPESA_PASSKEY=your_mpesa_passkey

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id

# Base URLs for callbacks
BASE_URL=https://your-domain.com
CLIENT_URL=https://your-domain.com
```

## 🛠️ **Rate Limiting Fix**

### ✅ **Issue Resolved**
The 429 (Too Many Requests) error has been fixed by:

1. **Excluding payment routes** from general rate limiting
2. **Adding specific payment rate limiting** (20 attempts per 15 minutes)
3. **Skipping successful payments** from rate limit counting

### **Rate Limiting Configuration**
```javascript
// Payment routes are now excluded from general rate limiting
req.path.startsWith('/api/payments/') ||  // Skip payment routes
req.path.startsWith('/api/orders') ||     // Skip order routes

// Specific payment rate limiting
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Allow 20 payment attempts per 15 minutes per IP
  skipSuccessfulRequests: true, // Don't count successful payments
});
```

## 🧪 **Testing the Payment System**

### **1. Test Configuration**
```bash
GET /api/payments/test
```
This endpoint will show you if your payment credentials are properly configured.

### **2. Test M-Pesa Payment Flow**
```bash
POST /api/payments/mpesa/initiate
Content-Type: application/json

{
  "orderId": "your_order_id",
  "phoneNumber": "254700000000",
  "amount": 100.00,
  "description": "Test payment"
}
```

### **3. Test PayPal Payment Flow**
```bash
POST /api/payments/paypal/create
Content-Type: application/json

{
  "orderId": "your_order_id",
  "amount": 100.00,
  "currency": "USD",
  "description": "Test payment"
}
```

## 📱 **Frontend Integration**

### **Checkout Page Features**
- ✅ M-Pesa payment option with phone number input
- ✅ PayPal payment option with redirect flow
- ✅ Credit card payment option
- ✅ Enhanced payment method selection UI

### **New Pages Created**
- ✅ `CheckoutSuccess.js` - Handles successful PayPal payments
- ✅ `CheckoutCancel.js` - Handles cancelled PayPal payments

## 🔒 **Security Features**

1. **Webhook Verification**: PayPal webhooks include signature verification
2. **Phone Number Validation**: M-Pesa phone numbers are formatted and validated
3. **Amount Validation**: Payment amounts are validated against order totals
4. **Order Status Tracking**: Comprehensive status tracking for all payment methods
5. **Rate Limiting**: Appropriate rate limiting for payment endpoints

## 🚨 **Troubleshooting**

### **Common Issues**

1. **429 Rate Limit Error**: ✅ **FIXED** - Payment routes now excluded from rate limiting
2. **Missing Environment Variables**: Check your `.env` file configuration
3. **M-Pesa Credentials**: Ensure you have valid Safaricom API credentials
4. **PayPal Credentials**: Ensure you have valid PayPal Developer credentials

### **Debug Steps**

1. **Check Configuration**:
   ```bash
   curl http://localhost:5000/api/payments/test
   ```

2. **Check Server Logs**: Look for payment-related errors in server console

3. **Verify Environment Variables**: Ensure all required variables are set

4. **Test with Valid Data**: Use proper phone numbers and amounts

## 📋 **Payment Flow Summary**

### **M-Pesa Flow**
1. Customer selects M-Pesa payment
2. Customer enters phone number
3. Order created with "processing" status
4. M-Pesa STK Push initiated
5. Customer receives M-Pesa prompt
6. Customer completes payment
7. M-Pesa sends callback
8. Order status updated to "completed"

### **PayPal Flow**
1. Customer selects PayPal payment
2. Order created with "processing" status
3. PayPal order created
4. Customer redirected to PayPal
5. Customer completes payment
6. PayPal redirects back to success/cancel page
7. Payment executed and order status updated

## 🎯 **Next Steps**

1. **Configure Environment Variables**: Set up your M-Pesa and PayPal credentials
2. **Test Payment Flows**: Use the test endpoints to verify configuration
3. **Deploy to Production**: Ensure production environment variables are set
4. **Monitor Payments**: Set up logging and monitoring for payment transactions

The payment system is now fully implemented and the 429 rate limiting error has been resolved!
