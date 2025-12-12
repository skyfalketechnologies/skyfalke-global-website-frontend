const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const createTestProduct = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyfalke', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if product already exists
    const existingProduct = await Product.findOne({ slug: 'dells-poweredge-r760xa' });
    if (existingProduct) {
      console.log('Product already exists:', existingProduct.name);
      return;
    }

    // Create test product
    const testProduct = new Product({
      name: "Dell's PowerEdge R760XA Server",
      slug: "dells-poweredge-r760xa",
      description: `
        <p>The Dell PowerEdge R760XA is a high-performance 2U rack server designed for demanding workloads including AI/ML, analytics, and high-performance computing.</p>
        
        <h3>Key Features:</h3>
        <ul>
          <li>4th Gen Intel Xeon Scalable processors</li>
          <li>Up to 2TB DDR5 memory</li>
          <li>Support for up to 8x 2.5" drives</li>
          <li>Dual 10GbE network ports</li>
          <li>Redundant power supplies</li>
          <li>iDRAC9 management</li>
        </ul>
        
        <h3>Specifications:</h3>
        <ul>
          <li>Form Factor: 2U Rack</li>
          <li>Processor: Intel Xeon Scalable (4th Gen)</li>
          <li>Memory: Up to 2TB DDR5-4800</li>
          <li>Storage: Up to 8x 2.5" drives</li>
          <li>Network: Dual 10GbE ports</li>
          <li>Power: 800W or 1100W PSUs</li>
        </ul>
      `,
      shortDescription: "High-performance 2U rack server with 4th Gen Intel Xeon processors, up to 2TB DDR5 memory, and advanced management features.",
      price: 15000,
      comparePrice: 18000,
      category: "Digital Products",
      subcategory: "Servers",
      brand: "Dell",
      images: [
        {
          url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center",
          alt: "Dell PowerEdge R760XA Server",
          isPrimary: true
        },
        {
          url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center",
          alt: "Server rack view",
          isPrimary: false
        },
        {
          url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center",
          alt: "Data center",
          isPrimary: false
        }
      ],
      stock: 5,
      sku: "DELL-R760XA-001",
      weight: 25.5,
      dimensions: {
        length: 68.2,
        width: 43.2,
        height: 8.7
      },
      tags: ["server", "dell", "poweredge", "rack", "enterprise", "datacenter"],
      features: [
        "4th Gen Intel Xeon Scalable processors",
        "Up to 2TB DDR5 memory",
        "Dual 10GbE network ports",
        "iDRAC9 management",
        "Redundant power supplies",
        "Hot-swappable drives"
      ],
      specifications: {
        "Form Factor": "2U Rack",
        "Processor": "Intel Xeon Scalable (4th Gen)",
        "Memory": "Up to 2TB DDR5-4800",
        "Storage": "Up to 8x 2.5\" drives",
        "Network": "Dual 10GbE ports",
        "Power": "800W or 1100W PSUs",
        "Management": "iDRAC9"
      },
      isActive: true,
      isFeatured: true,
      isOnSale: true,
      salePrice: 15000,
      rating: {
        average: 4.5,
        count: 12
      },
      shipping: {
        weight: 25.5,
        dimensions: {
          length: 68.2,
          width: 43.2,
          height: 8.7
        },
        freeShipping: false,
        shippingClass: "Express"
      },
      tax: {
        rate: 16,
        taxable: true
      },
      createdBy: new mongoose.Types.ObjectId(), // You might want to use a real user ID
      seo: {
        title: "Dell PowerEdge R760XA Server - High Performance Rack Server",
        description: "Dell PowerEdge R760XA 2U rack server with 4th Gen Intel Xeon processors, up to 2TB DDR5 memory, and advanced management features.",
        keywords: ["dell", "poweredge", "server", "rack", "enterprise", "datacenter", "intel", "xeon"]
      }
    });

    await testProduct.save();
    console.log('Test product created successfully:', testProduct.name);
    console.log('Product ID:', testProduct._id);
    console.log('Product Slug:', testProduct.slug);

  } catch (error) {
    console.error('Error creating test product:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createTestProduct();
