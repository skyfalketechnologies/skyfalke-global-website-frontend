const mongoose = require('mongoose');
const CaseStudy = require('../models/CaseStudy');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyfalke', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample images for different types of case studies
const sampleImages = [
  {
    url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
    caption: 'Business Strategy Meeting',
    isPrimary: true
  },
  {
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    caption: 'Data Analytics Dashboard',
    isPrimary: true
  },
  {
    url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
    caption: 'Digital Marketing Campaign',
    isPrimary: true
  },
  {
    url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
    caption: 'Cloud Infrastructure',
    isPrimary: true
  },
  {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    caption: 'Business Intelligence',
    isPrimary: true
  },
  {
    url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
    caption: 'Technology Consulting',
    isPrimary: true
  },
  {
    url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
    caption: 'Creative Services',
    isPrimary: true
  },
  {
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    caption: 'Custom Development',
    isPrimary: true
  }
];

async function updateCaseStudyImages() {
  try {
    console.log('Starting to update case study images...');
    
    // Get all case studies
    const caseStudies = await CaseStudy.find({});
    console.log(`Found ${caseStudies.length} case studies`);
    
    for (let i = 0; i < caseStudies.length; i++) {
      const caseStudy = caseStudies[i];
      
      // Check if case study already has images
      if (caseStudy.images && caseStudy.images.length > 0) {
        console.log(`Case study "${caseStudy.title}" already has images, skipping...`);
        continue;
      }
      
      // Assign a unique image based on index
      const imageIndex = i % sampleImages.length;
      const primaryImage = { ...sampleImages[imageIndex] };
      
      // Add some additional images for variety
      const additionalImages = [];
      for (let j = 1; j <= 2; j++) {
        const additionalIndex = (i + j) % sampleImages.length;
        additionalImages.push({
          ...sampleImages[additionalIndex],
          isPrimary: false,
          caption: `Additional project image ${j}`
        });
      }
      
      // Update the case study with images
      caseStudy.images = [primaryImage, ...additionalImages];
      await caseStudy.save();
      
      console.log(`Updated case study "${caseStudy.title}" with images`);
    }
    
    console.log('✅ Successfully updated all case study images!');
    
  } catch (error) {
    console.error('❌ Error updating case study images:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
updateCaseStudyImages();
