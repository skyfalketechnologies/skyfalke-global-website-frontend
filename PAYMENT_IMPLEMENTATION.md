# Payment Implementation Documentation

## Overview

This document outlines the implementation of M-Pesa and PayPal payment options for the Skyfalke Group e-commerce platform. The implementation includes both backend API endpoints and frontend integration.

## Features Implemented

### 1. Backend Implementation

#### Order Model Updates
- Enhanced `Order` model to support multiple payment methods
- Added PayPal-specific fields: `paypalOrderId`, `paypalPaymentId`, `paypalPayerId`
- Added M-Pesa-specific fields: `mpesaCheckoutRequestId`, `mpesaMerchantRequestId`
- Enhanced payment status tracking with additional states

#### Payment Service (`server/services/paymentService.js`)
- **M-Pesa Integration:**
  - Access token generation
  - STK Push payment initiation
  - Payment status checking
  - Phone number formatting for Kenyan numbers

- **PayPal Integration:**
  - Access token generation
  - Order creation
  - Payment capture
  - Order details retrieval
  - Webhook signature verification

#### Payment Routes (`server/routes/payments.js`)
- **M-Pesa Routes:**
  - `POST /api/payments/mpesa/initiate` - Initiate M-Pesa payment
  - `POST /api/payments/mpesa/callback` - Handle M-Pesa callbacks
  - `GET /api/payments/mpesa/status/:checkoutRequestId` - Check payment status

- **PayPal Routes:**
  - `POST /api/payments/paypal/create` - Create PayPal order
  - `POST /api/payments/paypal/execute` - Execute PayPal payment
  - `POST /api/payments/paypal/webhook` - Handle PayPal webhooks
  - `GET /api/payments/paypal/status/:paypalOrderId` - Check payment status

- **General Routes:**
  - `GET /api/payments/status/:orderId` - Get payment status for any order

### 2. Frontend Implementation

#### Checkout Page Updates (`client/src/pages/Checkout.js`)
- Added PayPal as a payment option
- Enhanced payment method selection UI
- Updated form submission logic to handle different payment methods
- Added PayPal-specific UI elements

#### New Pages
- **CheckoutSuccess** (`client/src/pages/CheckoutSuccess.js`)
  - Handles PayPal payment completion
  - Displays order confirmation
  - Provides navigation options

- **CheckoutCancel** (`client/src/pages/CheckoutCancel.js`)
  - Handles cancelled PayPal payments
  - Provides retry options

#### App.js Updates
- Added new routes for checkout success and cancel pages
- Lazy loading for new components

## Environment Configuration

### Required Environment Variables

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id

# M-Pesa Configuration
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=your_mpesa_shortcode
MPESA_PASSKEY=your_mpesa_passkey

# Base URLs for callbacks
BASE_URL=https://your-domain.com
CLIENT_URL=https://your-domain.com
```

## Payment Flow

### M-Pesa Payment Flow
1. Customer selects M-Pesa payment method
2. Customer enters phone number
3. Order is created with "processing" status
4. M-Pesa STK Push is initiated
5. Customer receives M-Pesa prompt on their phone
6. Customer completes payment on their phone
7. M-Pesa sends callback to our server
8. Order status is updated to "completed"

### PayPal Payment Flow
1. Customer selects PayPal payment method
2. Order is created with "processing" status
3. PayPal order is created
4. Customer is redirected to PayPal
5. Customer completes payment on PayPal
6. PayPal redirects back to success/cancel page
7. Payment is executed and order status is updated

## API Endpoints

### M-Pesa Endpoints

#### Initiate M-Pesa Payment
```http
POST /api/payments/mpesa/initiate
Content-Type: application/json

{
  "orderId": "order_id",
  "phoneNumber": "254700000000",
  "amount": 100.00,
  "description": "Payment for order"
}
```

#### M-Pesa Callback (Internal)
```http
POST /api/payments/mpesa/callback
Content-Type: application/json

{
  "Body": {
    "stkCallback": {
      "CheckoutRequestID": "ws_CO_123456789",
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          {"Name": "Amount", "Value": 100},
          {"Name": "MpesaReceiptNumber", "Value": "NLJ7RT61SV"},
          {"Name": "PhoneNumber", "Value": "254700000000"}
        ]
      }
    }
  }
}
```

### PayPal Endpoints

#### Create PayPal Order
```http
POST /api/payments/paypal/create
Content-Type: application/json

{
  "orderId": "order_id",
  "amount": 100.00,
  "currency": "USD",
  "description": "Payment for order"
}
```

#### Execute PayPal Payment
```http
POST /api/payments/paypal/execute
Content-Type: application/json

{
  "orderId": "order_id",
  "paypalOrderId": "paypal_order_id"
}
```

## Security Considerations

1. **Webhook Verification**: PayPal webhooks include signature verification
2. **Phone Number Validation**: M-Pesa phone numbers are formatted and validated
3. **Amount Validation**: Payment amounts are validated against order totals
4. **Order Status Tracking**: Comprehensive status tracking for all payment methods
5. **Error Handling**: Robust error handling and user feedback

## Testing

### Test Scenarios
1. **M-Pesa Payment:**
   - Valid phone number
   - Invalid phone number
   - Insufficient funds
   - Payment timeout

2. **PayPal Payment:**
   - Successful payment
   - Payment cancellation
   - Payment failure
   - Webhook processing

3. **General:**
   - Order creation
   - Payment status checking
   - Error handling

## Deployment Notes

1. **Environment Variables**: Ensure all required environment variables are set
2. **Webhook URLs**: Configure PayPal webhook URLs in PayPal Developer Dashboard
3. **M-Pesa Credentials**: Obtain production credentials from Safaricom
4. **SSL Certificate**: Required for production webhook endpoints
5. **Database**: Ensure MongoDB is accessible for order storage

## Monitoring and Logging

- All payment transactions are logged
- Order status changes are tracked
- Error messages are captured and logged
- Payment webhooks are monitored for failures

## Support and Maintenance

- Regular monitoring of payment success rates
- Webhook endpoint health checks
- Order status reconciliation
- Customer support for payment issues

## Future Enhancements

1. **Additional Payment Methods**: Stripe, bank transfers
2. **Refund Processing**: Automated refund handling
3. **Payment Analytics**: Detailed payment reporting
4. **Multi-currency Support**: Support for different currencies
5. **Recurring Payments**: Subscription payment handling
