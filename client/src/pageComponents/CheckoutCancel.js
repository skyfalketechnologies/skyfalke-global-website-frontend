'use client';

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaTimes,
  FaShoppingCart,
  FaArrowLeft
} from 'react-icons/fa';

const CheckoutCancel = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');

  return (
    <>
      <Helmet>
        <title>Payment Cancelled - Skyfalke Group</title>
        <meta name="description" content="Your payment was cancelled. You can try again or contact support." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimes className="text-2xl text-yellow-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
          <p className="text-gray-600 mb-4">
            Your payment was cancelled. No charges have been made to your account.
          </p>
          
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
              <div className="text-sm text-gray-600">
                <p>Order ID: {orderId}</p>
                <p className="mt-1">You can complete this order later or start a new one.</p>
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
            <Link href="/checkout"
              className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <FaArrowLeft className="mr-2" />
              Back to Checkout
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CheckoutCancel;
