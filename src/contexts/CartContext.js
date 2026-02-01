'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: []
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedCart = localStorage.getItem('skyfalke_cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('skyfalke_cart', JSON.stringify(state.items));
  }, [state.items]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.currentPrice || product.price,
      image: product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url,
      quantity,
      slug: product.slug
    };
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Calculate cart totals
  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return state.items.some(item => item._id === productId);
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item._id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    items: state.items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
