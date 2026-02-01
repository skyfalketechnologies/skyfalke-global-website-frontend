'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import {
  FaShoppingCart,
  FaMobile,
  FaTruck,
  FaShieldAlt,
  FaLock,
  FaArrowLeft,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaUndo,
  FaPaypal
} from 'react-icons/fa';

const Checkout = () => {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    // Billing Information
    billingFirstName: '',
    billingLastName: '',
    billingEmail: '',
    billingPhone: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'Kenya',

    // Shipping Information
    shippingFirstName: '',
    shippingLastName: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    shippingCountry: 'Kenya',
    sameAsBilling: true,

    // Payment Information
    paymentMethod: 'mpesa', // 'mpesa' or 'paypal'
    mpesaPhone: '',

    // Order Notes
    notes: ''
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/shop');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Auto-fill shipping when sameAsBilling is checked
  useEffect(() => {
    if (formData.sameAsBilling) {
      setFormData(prev => ({
        ...prev,
        shippingFirstName: prev.billingFirstName,
        shippingLastName: prev.billingLastName,
        shippingPhone: prev.billingPhone,
        shippingAddress: prev.billingAddress,
        shippingCity: prev.billingCity,
        shippingState: prev.billingState,
        shippingZipCode: prev.billingZipCode,
        shippingCountry: prev.billingCountry
      }));
    }
  }, [formData.sameAsBilling, formData.billingFirstName, formData.billingLastName, formData.billingPhone, formData.billingAddress, formData.billingCity, formData.billingState, formData.billingZipCode, formData.billingCountry]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 5000 ? 0 : 500; // Free shipping over 5000 KES
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.16; // 16% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const validateForm = () => {
    const requiredFields = [
      'billingFirstName', 'billingLastName', 'billingEmail', 'billingPhone',
      'billingAddress', 'billingCity', 'billingState', 'billingZipCode'
    ];

    if (!formData.sameAsBilling) {
      requiredFields.push(
        'shippingFirstName', 'shippingLastName', 'shippingPhone',
        'shippingAddress', 'shippingCity', 'shippingState', 'shippingZipCode'
      );
    }

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (formData.paymentMethod === 'mpesa') {
      if (!formData.mpesaPhone) {
        setError('Please enter your M-Pesa phone number');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        billingAddress: {
          firstName: formData.billingFirstName,
          lastName: formData.billingLastName,
          email: formData.billingEmail,
          phone: formData.billingPhone,
          address: formData.billingAddress,
          city: formData.billingCity,
          state: formData.billingState,
          zipCode: formData.billingZipCode,
          country: formData.billingCountry
        },
        shippingAddress: {
          firstName: formData.shippingFirstName,
          lastName: formData.shippingLastName,
          phone: formData.shippingPhone,
          address: formData.shippingAddress,
          city: formData.shippingCity,
          state: formData.shippingState,
          zipCode: formData.shippingZipCode,
          country: formData.shippingCountry
        },
        payment: {
          method: formData.paymentMethod,
          mpesaPhone: formData.paymentMethod === 'mpesa' ? formData.mpesaPhone : undefined
        },
        subtotal: calculateSubtotal(),
        shipping: calculateShipping(),
        tax: calculateTax(),
        total: calculateTotal(),
        notes: formData.notes
      };

      // Handle different payment methods
      if (formData.paymentMethod === 'paypal') {
        // Create order first, then redirect to PayPal
        const orderResponse = await axios.post('/api/orders', orderData);
        
        if (orderResponse.data.success) {
          const orderId = orderResponse.data.data.order._id;
          
          // Create PayPal order
          const paypalResponse = await axios.post('/api/payments/paypal/create', {
            orderId,
            amount: calculateTotal(),
            currency: 'USD',
            description: `Payment for order ${orderResponse.data.data.order.orderNumber}`
          });
          
          if (paypalResponse.data.success) {
            // Redirect to PayPal
            const approvalUrl = paypalResponse.data.data.links.find(link => link.rel === 'approve')?.href;
            if (approvalUrl) {
              window.location.href = approvalUrl;
            } else {
              throw new Error('PayPal approval URL not found');
            }
          } else {
            throw new Error(paypalResponse.data.message || 'Failed to create PayPal order');
          }
        }
      } else if (formData.paymentMethod === 'mpesa') {
        // Create order first, then initiate M-Pesa payment
        const orderResponse = await axios.post('/api/orders', orderData);
        
        if (orderResponse.data.success) {
          const orderId = orderResponse.data.data.order._id;
          
          // Initiate M-Pesa payment
          const mpesaResponse = await axios.post('/api/payments/mpesa/initiate', {
            orderId,
            phoneNumber: formData.mpesaPhone,
            amount: calculateTotal(),
            description: `Payment for order ${orderResponse.data.data.order.orderNumber}`
          });
          
          if (mpesaResponse.data.success) {
            setOrderId(orderId);
        setSuccess(true);
        clearCart();
          } else {
            throw new Error(mpesaResponse.data.message || 'Failed to initiate M-Pesa payment');
          }
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.response?.data?.message || error.message || 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect to shop
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="text-2xl text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
          <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>
          <div className="space-y-3">
            <Link href="/shop"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link href="/orders"
              className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Skyfalke Shop</title>
        <meta name="description" content="Complete your purchase securely with Skyfalke Shop" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32 flex items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center w-full"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Complete Your Purchase
              </h1>
              <p className="text-lg md:text-xl mb-6 text-primary-100">
                Secure checkout with multiple payment options
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-primary-200" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTruck className="text-primary-200" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUndo className="text-primary-200" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
            <div className="flex items-center justify-between">
              <Link href="/shop"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm md:text-base"
              >
                <FaArrowLeft className="mr-1 md:mr-2" />
                <span className="hidden sm:inline">Back to Shop</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Checkout Details</h2>
              <div className="flex items-center text-gray-600 text-sm md:text-base">
                <FaShoppingCart className="mr-1 md:mr-2" />
                <span className="hidden sm:inline">{items.length} items</span>
                <span className="sm:hidden">{items.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-semibold">
                    1
                  </div>
                  <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium text-primary-600 hidden sm:inline">Billing & Shipping</span>
                  <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium text-primary-600 sm:hidden">Billing</span>
                </div>
                <div className="w-8 md:w-12 h-0.5 bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-semibold">
                    2
                  </div>
                  <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium text-primary-600">Payment</span>
                </div>
                <div className="w-8 md:w-12 h-0.5 bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold">
                    3
                  </div>
                  <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium text-gray-500 hidden sm:inline">Confirmation</span>
                  <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium text-gray-500 sm:hidden">Confirm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
                {/* Billing Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm p-4 md:p-6"
                >
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Billing Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        name="billingFirstName"
                        value={formData.billingFirstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="billingLastName"
                        value={formData.billingLastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="billingEmail"
                        value={formData.billingEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        name="billingPhone"
                        value={formData.billingPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                      <input
                        type="text"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State/County *</label>
                      <input
                        type="text"
                        name="billingState"
                        value={formData.billingState}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                      <input
                        type="text"
                        name="billingZipCode"
                        value={formData.billingZipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        name="billingCountry"
                        value={formData.billingCountry}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Shipping Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-4 md:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="sameAsBilling"
                        checked={formData.sameAsBilling}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Same as billing</span>
                    </label>
                  </div>
                  
                  {!formData.sameAsBilling && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                          type="text"
                          name="shippingFirstName"
                          value={formData.shippingFirstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={!formData.sameAsBilling}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input
                          type="text"
                          name="shippingLastName"
                          value={formData.shippingLastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={!formData.sameAsBilling}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <input
                          type="tel"
                          name="shippingPhone"
                          value={formData.shippingPhone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={!formData.sameAsBilling}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                        <input
                          type="text"
                          name="shippingAddress"
                          value={formData.shippingAddress}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={!formData.sameAsBilling}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input
                          type="text"
                          name="shippingCity"
                          value={formData.shippingCity}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={!formData.sameAsBilling}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State/County *</label>
                        <input
                          type="text"
                          name="shippingState"
                          value={formData.shippingState}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={!formData.sameAsBilling}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                        <input
                          type="text"
                          name="shippingZipCode"
                          value={formData.shippingZipCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={!formData.sameAsBilling}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          name="shippingCountry"
                          value={formData.shippingCountry}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-lg shadow-sm p-4 md:p-6"
                >
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Payment Method</h2>
                  
                  <div className="space-y-3 md:space-y-4">

                    <label className="flex items-center p-3 md:p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mpesa"
                        checked={formData.paymentMethod === 'mpesa'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <FaMobile className="text-lg md:text-xl text-gray-600 mr-2 md:mr-3" />
                        <div>
                          <div className="font-medium text-sm md:text-base">M-Pesa</div>
                          <div className="text-xs md:text-sm text-gray-500">Mobile money payment</div>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-3 md:p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <FaPaypal className="text-lg md:text-xl text-blue-600 mr-2 md:mr-3" />
                        <div>
                          <div className="font-medium text-sm md:text-base">PayPal</div>
                          <div className="text-xs md:text-sm text-gray-500">Pay with PayPal account</div>
                        </div>
                      </div>
                    </label>
                  </div>


                  {/* M-Pesa Details */}
                  {formData.paymentMethod === 'mpesa' && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number *</label>
                      <input
                        type="tel"
                        name="mpesaPhone"
                        value={formData.mpesaPhone}
                        onChange={handleInputChange}
                        placeholder="254700000000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        You will receive an M-Pesa prompt to complete the payment.
                      </p>
                    </div>
                  )}

                  {/* PayPal Details */}
                  {formData.paymentMethod === 'paypal' && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <FaPaypal className="text-blue-600 mr-2" />
                        <span className="font-medium text-blue-900">PayPal Payment</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        You will be redirected to PayPal to complete your payment securely. 
                        You can pay with your PayPal account or use a credit/debit card.
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Order Notes */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-lg shadow-sm p-4 md:p-6"
                >
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Order Notes (Optional)</h2>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special instructions for your order..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </motion.div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <FaTimes className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock className="mr-2" />
                      Place Order - {formatPrice(calculateTotal())}
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm p-4 md:p-6 sticky top-4"
              >
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center space-x-2 md:space-x-3">
                      <img
                        src={item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'}
                        alt={item.name}
                        className="w-10 h-10 md:w-12 md:h-12 object-cover rounded"
                        onError={(e) => {
                          // Use a simple data URL placeholder to prevent infinite loops
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs md:text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs md:text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-3 md:pt-4 space-y-1 md:space-y-2">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {calculateShipping() === 0 ? 'Free' : formatPrice(calculateShipping())}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Tax (16% VAT)</span>
                    <span className="text-gray-900">{formatPrice(calculateTax())}</span>
                  </div>
                  <div className="flex justify-between text-base md:text-lg font-semibold border-t pt-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-blue-600">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-xs md:text-sm text-gray-600">
                    <FaShieldAlt className="mr-2 text-xs md:text-sm" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
