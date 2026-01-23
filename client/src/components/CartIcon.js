'use client';

import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';

const CartIcon = ({ onClick, className = '' }) => {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-600 hover:text-blue-600 transition-colors ${className}`}
      aria-label="Shopping cart"
    >
      <FaShoppingCart className="text-xl" />
      
      {itemCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </motion.span>
      )}
    </button>
  );
};

export default CartIcon;
