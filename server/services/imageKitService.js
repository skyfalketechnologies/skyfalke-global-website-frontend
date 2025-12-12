const ImageKit = require('imagekit');

// Initialize ImageKit with your credentials
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

class ImageKitService {
  // Upload image to ImageKit
  static async uploadImage(file, folder = 'blog-images') {
    try {
      const uploadResponse = await imagekit.upload({
        file: file.buffer,
        fileName: `${Date.now()}-${file.originalname}`,
        folder: folder,
        useUniqueFileName: true,
        tags: ['blog', 'skyfalke'],
        responseFields: ['isPrivateFile', 'tags']
      });

      return {
        url: uploadResponse.url,
        imageKitId: uploadResponse.fileId,
        name: uploadResponse.name,
        size: uploadResponse.size,
        height: uploadResponse.height,
        width: uploadResponse.width
      };
    } catch (error) {
      console.error('ImageKit upload error:', error);
      throw new Error('Failed to upload image to ImageKit');
    }
  }

  // Delete image from ImageKit
  static async deleteImage(imageKitId) {
    try {
      await imagekit.deleteFile(imageKitId);
      return true;
    } catch (error) {
      console.error('ImageKit delete error:', error);
      throw new Error('Failed to delete image from ImageKit');
    }
  }

  // Get image info from ImageKit
  static async getImageInfo(imageKitId) {
    try {
      const imageInfo = await imagekit.getFileDetails(imageKitId);
      return imageInfo;
    } catch (error) {
      console.error('ImageKit get info error:', error);
      throw new Error('Failed to get image info from ImageKit');
    }
  }

  // Generate optimized URL for different sizes
  static generateOptimizedUrl(url, options = {}) {
    const { width, height, quality = 80, format = 'auto' } = options;
    let optimizedUrl = url;
    
    if (width || height) {
      optimizedUrl += `?tr=w-${width || 'auto'},h-${height || 'auto'},q-${quality},f-${format}`;
    }
    
    return optimizedUrl;
  }

  // Generate thumbnail URL
  static generateThumbnailUrl(url, size = 300) {
    return this.generateOptimizedUrl(url, { width: size, height: size });
  }

  // Generate hero image URL
  static generateHeroUrl(url, width = 1200, height = 600) {
    return this.generateOptimizedUrl(url, { width, height });
  }

  // Generate social sharing image URL
  static generateSocialUrl(url, width = 1200, height = 630) {
    return this.generateOptimizedUrl(url, { width, height });
  }
}

module.exports = ImageKitService;
