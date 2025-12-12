const axios = require('axios');
const crypto = require('crypto');

class PaymentService {
  constructor() {
    this.mpesaBaseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';
    
    this.paypalBaseUrl = process.env.NODE_ENV === 'production'
      ? 'https://api.paypal.com'
      : 'https://api.sandbox.paypal.com';
  }

  // M-Pesa Payment Methods
  async getMpesaAccessToken() {
    try {
      // Validate M-Pesa credentials
      if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
        throw new Error('M-Pesa credentials not configured. Please set MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET environment variables.');
      }

      console.log('🔑 M-Pesa Auth Debug:', {
        baseUrl: this.mpesaBaseUrl,
        consumerKey: process.env.MPESA_CONSUMER_KEY ? `${process.env.MPESA_CONSUMER_KEY.substring(0, 8)}...` : 'NOT SET',
        consumerSecret: process.env.MPESA_CONSUMER_SECRET ? `${process.env.MPESA_CONSUMER_SECRET.substring(0, 8)}...` : 'NOT SET'
      });

      const auth = Buffer.from(
        `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
      ).toString('base64');

      const response = await axios.get(
        `${this.mpesaBaseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      console.log('✅ M-Pesa access token generated successfully');
      return response.data.access_token;
    } catch (error) {
      console.error('❌ Error getting M-Pesa access token:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
      
      if (error.response?.data?.errorMessage === 'Invalid Access Token') {
        throw new Error('M-Pesa credentials are invalid. Please check your MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET in the .env file.');
      }
      
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  async initiateMpesaPayment(orderId, phoneNumber, amount, description) {
    try {
      console.log('🚀 Initiating M-Pesa payment:', {
        orderId,
        phoneNumber,
        amount,
        description
      });

      const accessToken = await this.getMpesaAccessToken();
      
      // Validate BASE_URL (required for M-Pesa callbacks)
      let baseUrl = process.env.BASE_URL;
      if (!baseUrl || baseUrl === 'undefined' || baseUrl === 'https://your-domain.com') {
        throw new Error('BASE_URL environment variable is required for M-Pesa payments. Please set BASE_URL in your .env file to your publicly accessible server URL.');
      }
      
      // Ensure URL doesn't end with slash
      baseUrl = baseUrl.replace(/\/$/, '');
      const callbackUrl = `${baseUrl}/api/payments/mpesa/callback`;
      
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = Buffer.from(
        `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
      ).toString('base64');

      console.log('🔧 M-Pesa Payment Config:', {
        shortcode: process.env.MPESA_SHORTCODE,
        passkey: process.env.MPESA_PASSKEY ? `${process.env.MPESA_PASSKEY.substring(0, 8)}...` : 'NOT SET',
        timestamp,
        baseUrl: this.mpesaBaseUrl,
        callbackUrl
      });

      const requestBody = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: callbackUrl,
        AccountReference: `SKY-${orderId}`,
        TransactionDesc: description || 'Payment for order',
      };

      console.log('📤 Sending M-Pesa STK Push request...');
      const response = await axios.post(
        `${this.mpesaBaseUrl}/mpesa/stkpush/v1/processrequest`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ M-Pesa STK Push response:', {
        status: response.status,
        data: response.data
      });

      return {
        success: true,
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
      };
    } catch (error) {
      console.error('❌ Error initiating M-Pesa payment:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
      
      return {
        success: false,
        error: error.response?.data?.errorMessage || 'Failed to initiate M-Pesa payment',
      };
    }
  }

  async checkMpesaPaymentStatus(checkoutRequestId) {
    try {
      const accessToken = await this.getMpesaAccessToken();
      
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = Buffer.from(
        `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
      ).toString('base64');

      const requestBody = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      };

      const response = await axios.post(
        `${this.mpesaBaseUrl}/mpesa/stkpushquery/v1/query`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        resultCode: response.data.ResultCode,
        resultDesc: response.data.ResultDesc,
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
      };
    } catch (error) {
      console.error('Error checking M-Pesa payment status:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errorMessage || 'Failed to check M-Pesa payment status',
      };
    }
  }

  // PayPal Payment Methods
  async getPaypalAccessToken() {
    try {
      // Validate PayPal credentials
      if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
        throw new Error('PayPal credentials not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables.');
      }

      // Check if credentials are placeholder values
      const clientId = process.env.PAYPAL_CLIENT_ID.trim();
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET.trim();
      
      if (clientId === 'your_paypal_client_id' || clientSecret === 'your_paypal_client_secret') {
        throw new Error('PayPal credentials are still set to placeholder values. Please update PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET with your actual PayPal API credentials from https://developer.paypal.com/');
      }

      // Validate credential format
      if (clientId.length < 10 || clientSecret.length < 10) {
        throw new Error(`PayPal credentials appear to be invalid. Client ID length: ${clientId.length}, Secret length: ${clientSecret.length}. Please verify your credentials from https://developer.paypal.com/`);
      }

      console.log('🔑 PayPal Auth Debug:', {
        baseUrl: this.paypalBaseUrl,
        environment: process.env.NODE_ENV,
        clientId: clientId ? `${clientId.substring(0, 8)}... (length: ${clientId.length})` : 'NOT SET',
        clientSecret: clientSecret ? `${clientSecret.substring(0, 8)}... (length: ${clientSecret.length})` : 'NOT SET',
        clientIdPrefix: clientId.substring(0, 3), // PayPal client IDs usually start with specific prefixes
        note: 'If credentials are correct, they may be for the wrong environment (sandbox vs production)'
      });

      const auth = Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString('base64');

      const response = await axios.post(
        `${this.paypalBaseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('✅ PayPal access token generated successfully');
      return response.data.access_token;
    } catch (error) {
      console.error('❌ Error getting PayPal access token:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        baseUrl: this.paypalBaseUrl,
        environment: process.env.NODE_ENV
      });
      
      if (error.response?.data?.error === 'invalid_client') {
        const errorMsg = 'PayPal client authentication failed. Please check your PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables.\n' +
          `Current environment: ${process.env.NODE_ENV}\n` +
          `PayPal API URL: ${this.paypalBaseUrl}\n\n` +
          'Troubleshooting steps:\n' +
          '1. Verify credentials are correct in your .env file (no extra spaces, quotes, or special characters)\n' +
          '2. Ensure you are using SANDBOX credentials for development/testing (https://api.sandbox.paypal.com)\n' +
          '3. Ensure you are using PRODUCTION credentials for production (https://api.paypal.com)\n' +
          '4. Check your PayPal Developer Dashboard: https://developer.paypal.com/\n' +
          '5. Verify the app is active and credentials haven\'t been revoked\n' +
          '6. Make sure you copied the full Client ID and Secret (they can be long strings)\n' +
          '7. Restart your server after updating .env file';
        throw new Error(errorMsg);
      }
      
      throw error;
    }
  }

  async createPaypalOrder(orderId, amount, currency = 'USD', description) {
    try {
      const accessToken = await this.getPaypalAccessToken();
      
      // Determine client URL with fallback for development
      let clientUrl = process.env.CLIENT_URL;
      if (!clientUrl || clientUrl === 'undefined' || clientUrl === 'https://your-domain.com') {
        if (process.env.NODE_ENV === 'production') {
          throw new Error('CLIENT_URL environment variable is required for production. Please set CLIENT_URL in your .env file.');
        }
        // Fallback to localhost for development
        clientUrl = 'http://localhost:3000';
        console.warn('⚠️ CLIENT_URL not set, using fallback:', clientUrl);
      }
      
      // Ensure URL doesn't end with slash
      clientUrl = clientUrl.replace(/\/$/, '');
      
      const returnUrl = `${clientUrl}/checkout/success?orderId=${orderId}`;
      const cancelUrl = `${clientUrl}/checkout/cancel?orderId=${orderId}`;
      
      console.log('🔗 PayPal Order URLs:', {
        returnUrl,
        cancelUrl,
        clientUrl
      });
      
      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: `SKY-${orderId}`,
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
            description: description || 'Payment for order',
          },
        ],
        application_context: {
          brand_name: 'Skyfalke Group',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      };

      const response = await axios.post(
        `${this.paypalBaseUrl}/v2/checkout/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': orderId,
          },
        }
      );

      return {
        success: true,
        orderId: response.data.id,
        status: response.data.status,
        links: response.data.links,
      };
    } catch (error) {
      console.error('❌ Error creating PayPal order:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
      
      // Provide more specific error messages
      if (error.response?.data?.details) {
        const details = error.response.data.details.map(d => 
          `${d.field}: ${d.description} (value: ${d.value})`
        ).join('\n');
        return {
          success: false,
          error: `PayPal order creation failed: ${error.response.data.message}\n${details}`,
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create PayPal order',
      };
    }
  }

  async capturePaypalOrder(paypalOrderId) {
    try {
      const accessToken = await this.getPaypalAccessToken();

      const response = await axios.post(
        `${this.paypalBaseUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        orderId: response.data.id,
        status: response.data.status,
        purchaseUnits: response.data.purchase_units,
      };
    } catch (error) {
      console.error('Error capturing PayPal order:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to capture PayPal order',
      };
    }
  }

  async getPaypalOrderDetails(paypalOrderId) {
    try {
      const accessToken = await this.getPaypalAccessToken();

      const response = await axios.get(
        `${this.paypalBaseUrl}/v2/checkout/orders/${paypalOrderId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return {
        success: true,
        orderId: response.data.id,
        status: response.data.status,
        purchaseUnits: response.data.purchase_units,
      };
    } catch (error) {
      console.error('Error getting PayPal order details:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get PayPal order details',
      };
    }
  }

  // Utility Methods
  generateTransactionId() {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  validatePaymentAmount(amount) {
    return amount > 0 && amount <= 1000000; // Max 1M
  }

  formatPhoneNumber(phoneNumber) {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Handle Kenyan phone numbers
    if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7')) {
      return '254' + cleaned;
    }
    
    return cleaned;
  }

  // Webhook signature verification for PayPal
  verifyPaypalWebhook(headers, body, webhookId) {
    try {
      const signature = headers['paypal-transmission-id'];
      const timestamp = headers['paypal-transmission-time'];
      const certId = headers['paypal-cert-id'];
      const algorithm = headers['paypal-transmission-sig'];

      if (!signature || !timestamp || !certId || !algorithm) {
        return false;
      }

      // In production, you should verify the webhook signature
      // For now, we'll do basic validation
      return true;
    } catch (error) {
      console.error('Error verifying PayPal webhook:', error);
      return false;
    }
  }
}

module.exports = new PaymentService();
