'use client';

'use client';

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {
  FaCheck,
  FaSpinner,
  FaTimes,
  FaShoppingCart,
  FaReceipt
} from 'react-icons/fa';

const CheckoutSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('processing');

  const orderId = searchParams.get('orderId');
  const paypalOrderId = searchParams.get('paypalOrderId');

  useEffect(() => {
    if (!orderId) {
      router.push('/shop');
      return;
    }

    const processPayment = async () => {
      try {
        if (paypalOrderId) {
          // Execute PayPal payment
          const executeResponse = await axios.post('/api/payments/paypal/execute', {
            orderId,
            paypalOrderId
          });

          if (executeResponse.data.success) {
            setPaymentStatus('completed');
          } else {
            setPaymentStatus('failed');
            setError(executeResponse.data.message || 'Payment execution failed');
          }
        }

        // Get order details
        const orderResponse = await axios.get(`/api/payments/status/${orderId}`);
        if (orderResponse.data.success) {
          setOrder(orderResponse.data.data);
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        setError('Failed to process payment. Please contact support.');
        setPaymentStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, paypalOrderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSpinner className="text-2xl text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (error || paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimes className="text-2xl text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-4">{error || 'Your payment could not be processed.'}</p>
          <div className="space-y-3">
            <Link href="/shop"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </Link>
            <Link href="/contact"
              className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Successful - Skyfalke Group</title>
        <meta name="description" content="Your payment has been processed successfully." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="text-2xl text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Thank you for your purchase. Your order has been confirmed.</p>
          
          {order && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 capitalize">{order.orderStatus}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link href="/shop"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <FaShoppingCart className="mr-2" />
              Continue Shopping
            </Link>
            <Link href="/orders"
              className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <FaReceipt className="mr-2" />
              View Orders
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CheckoutSuccess;
