const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

async function fixProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find products without isActive field or isActive is false
    const productsToFix = await Product.find({
      $or: [
        { isActive: { $exists: false } },
        { isActive: false }
      ]
    });

    console.log(`Found ${productsToFix.length} products to fix`);

    if (productsToFix.length > 0) {
      // Update all products to be active
      const result = await Product.updateMany(
        {
          $or: [
            { isActive: { $exists: false } },
            { isActive: false }
          ]
        },
        { $set: { isActive: true } }
      );

      console.log(`Updated ${result.modifiedCount} products to be active`);
    }

    // Count total products
    const totalProducts = await Product.countDocuments({});
    const activeProducts = await Product.countDocuments({ isActive: true });

    console.log(`Total products: ${totalProducts}`);
    console.log(`Active products: ${activeProducts}`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error fixing products:', error);
    process.exit(1);
  }
}

fixProducts();
