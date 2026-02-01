const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const optimizeImages = async () => {
  const publicDir = path.join(__dirname, '../public');
  const imagesDir = path.join(publicDir, 'images');
  
  try {
    const files = await fs.readdir(imagesDir, { withFileTypes: true });
    
    for (const file of files) {
      if (file.isDirectory()) {
        const subDir = path.join(imagesDir, file.name);
        await optimizeImagesInDirectory(subDir);
      } else if (file.name.match(/\.(jpg|jpeg|png)$/i)) {
        await optimizeImage(path.join(imagesDir, file.name));
      }
    }
    
    console.log('Image optimization completed!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
};

const optimizeImagesInDirectory = async (dir) => {
  try {
    const files = await fs.readdir(dir);
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        await optimizeImage(path.join(dir, file));
      }
    }
  } catch (error) {
    console.error(`Error optimizing images in ${dir}:`, error);
  }
};

const optimizeImage = async (imagePath) => {
  try {
    const ext = path.extname(imagePath).toLowerCase();
    const nameWithoutExt = path.basename(imagePath, ext);
    const dir = path.dirname(imagePath);
    
    // Generate WebP version
    const webpPath = path.join(dir, `${nameWithoutExt}.webp`);
    await sharp(imagePath)
      .webp({ quality: 85 })
      .toFile(webpPath);
    
    // Generate AVIF version (if supported)
    try {
      const avifPath = path.join(dir, `${nameWithoutExt}.avif`);
      await sharp(imagePath)
        .avif({ quality: 80 })
        .toFile(avifPath);
    } catch (error) {
      console.warn(`AVIF not supported for ${imagePath}`);
    }
    
    // Generate responsive sizes
    const sizes = [320, 640, 768, 1024, 1280, 1920];
    
    for (const size of sizes) {
      const responsivePath = path.join(dir, `${nameWithoutExt}-${size}.webp`);
      await sharp(imagePath)
        .resize(size, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(responsivePath);
    }
    
    console.log(`Optimized: ${imagePath}`);
  } catch (error) {
    console.error(`Error optimizing ${imagePath}:`, error);
  }
};

// Run optimization
optimizeImages();
