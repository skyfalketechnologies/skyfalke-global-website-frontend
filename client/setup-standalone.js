/**
 * Setup script for Next.js standalone build
 * This script ensures static files are properly linked for standalone builds
 * 
 * Works in both development (local) and production (cPanel):
 * - Windows: Copies files (symlinks require admin)
 * - Linux/Unix: Creates symlinks (more efficient)
 * 
 * This script runs automatically after `npm run build` via postbuild hook
 */

const fs = require('fs');
const path = require('path');

const standaloneDir = path.join(__dirname, '.next', 'standalone');
const staticDir = path.join(__dirname, '.next', 'static');
const publicDir = path.join(__dirname, 'public');

// Check if standalone build exists
if (!fs.existsSync(standaloneDir)) {
  console.error('❌ Standalone build not found. Please run: npm run build');
  process.exit(1);
}

console.log('🔧 Setting up standalone build...');

// Create symlinks for static files (if they don't exist)
const standaloneStaticDir = path.join(standaloneDir, '.next', 'static');
const standalonePublicDir = path.join(standaloneDir, 'public');

try {
  // Ensure .next/static exists in standalone
  if (!fs.existsSync(standaloneStaticDir)) {
    fs.mkdirSync(path.join(standaloneDir, '.next'), { recursive: true });
    
    // Create symlink to static files
    if (fs.existsSync(staticDir)) {
      if (process.platform === 'win32') {
        // Windows: copy instead of symlink (symlinks require admin on Windows)
        console.log('📁 Copying static files (Windows)...');
        copyRecursiveSync(staticDir, standaloneStaticDir);
      } else {
        // Unix: use symlink
        fs.symlinkSync(path.relative(path.dirname(standaloneStaticDir), staticDir), standaloneStaticDir, 'dir');
        console.log('🔗 Created symlink for static files');
      }
    }
  }

  // Ensure public directory exists in standalone
  if (!fs.existsSync(standalonePublicDir)) {
    if (fs.existsSync(publicDir)) {
      if (process.platform === 'win32') {
        // Windows: copy instead of symlink
        console.log('📁 Copying public files (Windows)...');
        copyRecursiveSync(publicDir, standalonePublicDir);
      } else {
        // Unix: use symlink
        fs.symlinkSync(path.relative(path.dirname(standalonePublicDir), publicDir), standalonePublicDir, 'dir');
        console.log('🔗 Created symlink for public files');
      }
    }
  }

  console.log('✅ Standalone build setup complete!');
} catch (error) {
  console.error('❌ Error setting up standalone build:', error.message);
  process.exit(1);
}

// Helper function to copy directories recursively (for Windows)
function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

