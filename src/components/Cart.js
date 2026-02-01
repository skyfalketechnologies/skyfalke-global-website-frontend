'use client';

import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { FaShoppingCart, FaTimes, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Cart = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (productId, newQuantity) => {
    setIsUpdating(true);
    updateQuantity(productId, newQuantity);
    setTimeout(() => setIsUpdating(false), 300);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES'
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FaShoppingCart className="text-2xl text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Shopping Cart</h2>
            {items.length > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some products to get started!</p>
              <Link href="/shop"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={isUpdating}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors disabled:opacity-50"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={isUpdating}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors disabled:opacity-50"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-blue-600">
                {formatPrice(getCartTotal())}
              </span>
            </div>
            
            <div className="space-y-3">
              <Link href="/checkout"
                onClick={onClose}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium block"
              >
                Proceed to Checkout
              </Link>
              
              <button
                onClick={clearCart}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;
