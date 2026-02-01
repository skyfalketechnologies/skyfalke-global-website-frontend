'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { apiGet } from '../utils/api';
import { useCart } from '../contexts/CartContext';
import { useAnalytics } from '../hooks/useAnalytics';
import useMobileDetection from '../hooks/useMobileDetection';
import { getAnimationProps } from '../utils/animationUtils';
import OptimizedImage from '../components/OptimizedImage';
import {
  FaSearch,
  FaFilter,
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaEye,
  FaSpinner,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTimes,
  FaCheck,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaCreditCard,
  FaMobile,
  FaGift
} from 'react-icons/fa';

const Shop = () => {
  const { trackProductAddToCart, trackProductView, trackSearchQuery } = useAnalytics();
  const { shouldAnimate } = useMobileDetection();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart, isInCart, getItemQuantity, getCartItemCount } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchFeaturedProducts();
    fetchSaleProducts();
  }, [currentPage, searchTerm, selectedCategory, minPrice, maxPrice, inStock, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (inStock) params.append('inStock', 'true');

      const response = await apiGet(`/api/shop/products?${params}`);
      
      if (response.data.success) {
        setProducts(response.data.data.products);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalProducts(response.data.data.pagination.totalProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiGet('/api/shop/categories');
      if (response.data.success) {
        setCategories(response.data.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await apiGet('/api/shop/products/featured?limit=4');
      if (response.data.success) {
        setFeaturedProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchSaleProducts = async () => {
    try {
      const response = await apiGet('/api/shop/products/sale?limit=4');
      if (response.data.success) {
        setSaleProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching sale products:', error);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    
    // Track analytics event
    trackProductAddToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      category: product.category
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="text-gray-400" />;
    return sortOrder === 'asc' ? <FaSortUp className="text-blue-500" /> : <FaSortDown className="text-blue-500" />;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (stock <= 5) return { text: 'Low Stock', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
  };





  return (
    <>
      <Helmet>
        <meta name="description" content="Discover exclusive Skyfalke merchandise including hoodies, caps, mugs, stickers, and more. Premium quality products with eco-friendly design." />
        <meta name="keywords" content="Skyfalke, merchandise, hoodies, caps, mugs, stickers, eco-friendly, sustainable" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container-custom section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Skyfalke Shop
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Premium Merchandise, Accessories & Tech Products
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaTruck className="text-primary-200" />
                  <span>Affordable Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-primary-200" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUndo className="text-primary-200" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Featured & Sale Products */}
        {(featuredProducts.length > 0 || saleProducts.length > 0) && (
          <div className="container-custom section-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Featured Products */}
              {featuredProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Featured Products
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {featuredProducts.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="group cursor-pointer"
                        onClick={() => handleAddToCart(product)}
                      >
                        <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                          <img
                            src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url}
                            alt={product.name}
                            className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                            <FaShoppingCart className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xl" />
                          </div>
                        </div>
                        <div className="mt-2">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {product.name}
                          </h3>
                          <p className="text-primary-600 font-semibold">
                            {formatPrice(product.currentPrice)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Sale Products */}
              {saleProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-soft p-6"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FaGift className="text-2xl" />
                    On Sale!
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {saleProducts.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="group cursor-pointer"
                        onClick={() => handleAddToCart(product)}
                      >
                        <div className="relative overflow-hidden rounded-lg bg-white bg-opacity-20">
                          <img
                            src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url}
                            alt={product.name}
                            className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            SALE
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                            <FaShoppingCart className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xl" />
                          </div>
                        </div>
                        <div className="mt-2">
                          <h3 className="font-medium text-sm truncate">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              {formatPrice(product.currentPrice)}
                            </p>
                            {product.comparePrice && (
                              <p className="text-red-200 line-through text-sm">
                                {formatPrice(product.comparePrice)}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="container-custom py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FaFilter />
                  </button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search Products
                    </label>
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categories
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value="All"
                          checked={selectedCategory === 'All'}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">All Categories</span>
                      </label>
                      {categories.map((category) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={selectedCategory === category}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price Range (KES)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Stock Filter */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
                    </label>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    All Products
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {totalProducts} products found
                  </p>
                </div>
                
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  {/* Cart Summary */}
                  <div className="relative">
                    <Link href="/checkout" className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                      <FaShoppingCart />
                      <span>Cart ({getCartItemCount()})</span>
                      {getCartItemCount() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {getCartItemCount()}
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sort:</span>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-');
                        setSortBy(field);
                        setSortOrder(order);
                      }}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="createdAt-desc">Newest First</option>
                      <option value="createdAt-asc">Oldest First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <FaTimes className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
                  <span className="ml-3 text-gray-600">Loading products...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      {...getAnimationProps({
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.4, delay: index * 0.1 }
                      }, shouldAnimate)}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-soft overflow-hidden group hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden">
                        <OptimizedImage
                          src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          width={300}
                          height={192}
                          priority={index < 4}
                        />
                        
                        {/* Sale Badge */}
                        {product.isOnSale && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            SALE
                          </div>
                        )}

                        {/* Stock Status */}
                        <div className="absolute top-2 right-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStockStatus(product.stock).bg} ${getStockStatus(product.stock).color}`}>
                            {getStockStatus(product.stock).text}
                          </span>
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary-600 hover:text-white"
                            title="Add to Cart"
                          >
                            <FaShoppingCart />
                          </button>
                          <Link href={`/shop/product/${product.slug}`}
                            className="bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary-600 hover:text-white"
                            title="View Details"
                          >
                            <FaEye />
                          </Link>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                                                 <div className="flex items-center gap-1 mb-2">
                           <span className="text-xs text-gray-500">{product.category}</span>
                         </div>
                        
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {product.shortDescription}
                        </p>

                        {/* Rating */}
                        {product.rating.count > 0 && (
                          <div className="flex items-center gap-1 mb-3">
                            <FaStar className="text-yellow-400 text-sm" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {product.rating.average.toFixed(1)} ({product.rating.count})
                            </span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-primary-600">
                              {formatPrice(product.currentPrice)}
                            </p>
                            {product.comparePrice && product.comparePrice > product.currentPrice && (
                              <p className="text-sm text-gray-500 line-through">
                                {formatPrice(product.comparePrice)}
                              </p>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock <= 0}
                            className="bg-primary-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                            title={product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                          >
                            {product.stock <= 0 ? (
                              <FaTimes className="text-sm" />
                            ) : (
                              <FaShoppingCart className="text-sm" />
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-2 border rounded-lg ${
                          currentPage === index + 1
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
