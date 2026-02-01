'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiGet } from '../utils/api';
import { useCart } from '../contexts/CartContext';
import { useAnalytics } from '../hooks/useAnalytics';
import OptimizedImage from '../components/OptimizedImage';
import {
  FaArrowLeft,
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaSpinner,
  FaTimes,
  FaEye,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaCreditCard,
  FaMobile,
  FaGift,
  FaCheck,
  FaMinus,
  FaPlus,
  FaShare,
  FaTag,
  FaBox,
  FaAward,
  FaShippingFast
} from 'react-icons/fa';

const ProductDetail = ({ slug: propSlug }) => {
  const params = useParams();
  const slug = propSlug || params?.slug;
  const router = useRouter();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { trackProductView, trackProductAddToCart } = useAnalytics();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check for SSR-injected initial data
      const initialData = window.__INITIAL_DATA__;
      if (initialData && initialData.product && initialData.product.slug === slug) {
        console.log('Using SSR-injected data for product');
        setProduct(initialData.product);
        if (initialData.relatedProducts) {
          setRelatedProducts(initialData.relatedProducts);
        }
        
        // Track product view
        trackProductView({
          id: initialData.product._id,
          name: initialData.product.name,
          price: initialData.product.currentPrice,
          category: initialData.product.category
        });
        
        // Clear initial data to prevent reuse
        window.__INITIAL_DATA__ = null;
        
        setLoading(false);
        return;
      }
      
      const response = await apiGet(`/api/shop/products/${slug}`);
      
      if (response.data.success) {
        setProduct(response.data.data.product);
        setRelatedProducts(response.data.data.relatedProducts);
        
        // Track product view
        trackProductView({
          id: response.data.data.product._id,
          name: response.data.data.product.name,
          price: response.data.data.product.currentPrice,
          category: response.data.data.product.category
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      if (error.response?.status === 404) {
        setError('Product not found');
      } else {
        setError('Failed to fetch product');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    
    setIsAddingToCart(true);
    try {
      addToCart(product, quantity);
      
      // Track analytics event
      trackProductAddToCart({
        id: product._id,
        name: product.name,
        price: product.currentPrice,
        category: product.category,
        quantity: quantity
      });
      
      // Show success feedback (you could add a toast notification here)
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href
      });
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareModal(false);
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaTimes className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Product Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push(-1)}
              className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>
            <Link href="/shop"
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              <FaShoppingCart className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const currentImage = product.images[selectedImageIndex] || primaryImage;
  const isInCartItem = isInCart(product._id);
  const cartQuantity = getItemQuantity(product._id);

  return (
    <>
      <Helmet>
        <title>{product.name} - Skyfalke Shop</title>
        <meta name="description" content={product.shortDescription} />
        <meta name="keywords" content={`${product.name}, ${product.category}, Skyfalke, merchandise`} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.shortDescription} />
        <meta property="og:image" content={currentImage?.url} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={product.shortDescription} />
        <meta name="twitter:image" content={currentImage?.url} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <nav className="flex items-center justify-center space-x-2 text-sm mb-6 text-primary-100">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
                <span>/</span>
                <span className="text-white">{product.name}</span>
              </nav>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {product.name}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 text-primary-100 max-w-4xl mx-auto">
                {product.shortDescription}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
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

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Product Images */}
            <div className="space-y-3 sm:space-y-4">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-soft">
                <OptimizedImage
                  src={currentImage?.url}
                  alt={product.name}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover transition-opacity duration-300"
                  width={600}
                  height={400}
                  priority={true}
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
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative overflow-hidden rounded-lg border-2 transition-colors ${
                        selectedImageIndex === index
                          ? 'border-primary-600'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <OptimizedImage
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-16 sm:h-20 object-cover"
                        width={100}
                        height={80}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{product.category}</span>
                    {product.isOnSale && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        <FaTag className="inline mr-1" />
                        On Sale
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {product.name}
                  </h2>
                  
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                    {product.shortDescription}
                  </p>

                  {/* Rating */}
                  {product.rating.count > 0 && (
                    <div className="flex items-center gap-1 mb-4">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {product.rating.average.toFixed(1)} ({product.rating.count})
                      </span>
                    </div>
                  )}
                </div>

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
                  
                  {product.isOnSale && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {Math.round(((product.comparePrice - product.currentPrice) / product.comparePrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quantity:
                    </label>
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        disabled={quantity <= 1}
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 dark:border-gray-600 min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        disabled={quantity >= product.stock}
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0 || isAddingToCart}
                      className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-lg text-sm hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isAddingToCart ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaShoppingCart />
                      )}
                      {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    
                    <button
                      onClick={handleShare}
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-3 rounded-lg transition-colors flex items-center justify-center"
                      title="Share"
                    >
                      <FaShare />
                    </button>
                  </div>

                  {/* Cart Status */}
                  {isInCartItem && (
                    <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <FaCheck className="text-sm" />
                        <span className="text-sm">
                          {cartQuantity} item{cartQuantity > 1 ? 's' : ''} in cart
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaTruck className="text-primary-600 flex-shrink-0" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaShieldAlt className="text-primary-600 flex-shrink-0" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaUndo className="text-primary-600 flex-shrink-0" />
                    <span>Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaAward className="text-primary-600 flex-shrink-0" />
                    <span>Quality Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Description */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 sm:p-6"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Product Description
                </h2>
                <div className="prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
                  {product.description ? (
                    <div 
                      className="rich-text-content"
                      dangerouslySetInnerHTML={{ __html: product.description }} 
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      {product.shortDescription}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 sm:p-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Specifications
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="text-gray-900 dark:text-white">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                  <span className="text-gray-900 dark:text-white">{product.stock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">SKU:</span>
                  <span className="text-gray-900 dark:text-white">{product.sku || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                  <span className="text-gray-900 dark:text-white">{product.weight || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>
                  <span className="text-gray-900 dark:text-white">{product.dimensions || 'N/A'}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 sm:mt-12"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <motion.div
                    key={relatedProduct._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-soft overflow-hidden group hover:shadow-lg transition-shadow duration-300"
                  >
                    <Link href={`/shop/product/${relatedProduct.slug}`}>
                      <div className="relative overflow-hidden">
                        <OptimizedImage
                          src={relatedProduct.images.find(img => img.isPrimary)?.url || relatedProduct.images[0]?.url}
                          alt={relatedProduct.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          width={300}
                          height={192}
                        />
                        
                        {relatedProduct.isOnSale && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            SALE
                          </div>
                        )}

                        {/* Stock Status */}
                        <div className="absolute top-2 right-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStockStatus(relatedProduct.stock).bg} ${getStockStatus(relatedProduct.stock).color}`}>
                            {getStockStatus(relatedProduct.stock).text}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-3 sm:p-4 flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-2">
                            <span className="text-xs text-gray-500">{relatedProduct.category}</span>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm sm:text-base">
                            {relatedProduct.name}
                          </h3>
                          
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {relatedProduct.shortDescription}
                          </p>

                          {/* Rating */}
                          {relatedProduct.rating.count > 0 && (
                            <div className="flex items-center gap-1 mb-3">
                              <FaStar className="text-yellow-400 text-sm" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {relatedProduct.rating.average.toFixed(1)} ({relatedProduct.rating.count})
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-auto pt-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0 pr-2">
                              <p className="text-sm sm:text-base font-bold text-primary-600">
                                {formatPrice(relatedProduct.currentPrice)}
                              </p>
                              {relatedProduct.comparePrice && relatedProduct.comparePrice > relatedProduct.currentPrice && (
                                <p className="text-xs text-gray-500 line-through">
                                  {formatPrice(relatedProduct.comparePrice)}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(relatedProduct, 1);
                            }}
                            disabled={relatedProduct.stock <= 0}
                            className="w-full bg-primary-600 text-white px-3 py-2 rounded text-xs hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                          >
                            <FaShoppingCart className="text-xs" />
                            <span>{relatedProduct.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Share Product
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Copy
                </button>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="mt-4 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
