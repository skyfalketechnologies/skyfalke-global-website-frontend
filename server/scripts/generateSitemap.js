const mongoose = require('mongoose');
require('dotenv').config();
const sitemapService = require('../services/sitemapService');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyfalke', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  generateSitemap();
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

async function generateSitemap() {
  try {
    const result = await sitemapService.generateAndUpdate();
    
    console.log('\n✅ Sitemap generation completed successfully!');
    console.log('📊 Statistics:', result.stats);
    console.log('🔔 Search engine ping results:', result.pingResults);

    // Close database connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}
