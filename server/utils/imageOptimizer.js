const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * Image Optimization Utility
 * Compresses and converts images to modern formats for better performance
 */

class ImageOptimizer {
  constructor() {
    this.supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
    this.outputFormats = ['webp', 'avif']; // Modern formats
    this.qualitySettings = {
      webp: 85,
      avif: 80,
      jpeg: 90
    };
    this.sizes = [
      { name: 'thumbnail', width: 150, height: 150 },
      { name: 'small', width: 400, height: 300 },
      { name: 'medium', width: 800, height: 600 },
      { name: 'large', width: 1200, height: 900 },
      { name: 'original', width: null, height: null }
    ];
  }

  /**
   * Optimize a single image file
   */
  async optimizeImage(inputPath, outputDir, filename) {
    try {
      const results = [];
      const baseName = path.parse(filename).name;
      
      // Create output directory if it doesn't exist
      await fs.mkdir(outputDir, { recursive: true });

      // Get image metadata
      const metadata = await sharp(inputPath).metadata();
      console.log(`📸 Processing: ${filename} (${metadata.width}x${metadata.height}, ${metadata.format})`);

      // Generate optimized versions for each size and format
      for (const size of this.sizes) {
        for (const format of this.outputFormats) {
          const outputFilename = `${baseName}_${size.name}.${format}`;
          const outputPath = path.join(outputDir, outputFilename);
          
          let sharpInstance = sharp(inputPath);
          
          // Resize if needed
          if (size.width && size.height) {
            sharpInstance = sharpInstance.resize(size.width, size.height, {
              fit: 'inside',
              withoutEnlargement: true
            });
          }
          
          // Apply format-specific optimizations
          if (format === 'webp') {
            sharpInstance = sharpInstance.webp({ 
              quality: this.qualitySettings.webp,
              effort: 6 // Higher effort for better compression
            });
          } else if (format === 'avif') {
            sharpInstance = sharpInstance.avif({ 
              quality: this.qualitySettings.avif,
              effort: 4
            });
          }
          
          await sharpInstance.toFile(outputPath);
          
          // Get file size
          const stats = await fs.stat(outputPath);
          const originalStats = await fs.stat(inputPath);
          const compressionRatio = ((originalStats.size - stats.size) / originalStats.size * 100).toFixed(1);
          
          results.push({
            size: size.name,
            format: format,
            path: outputPath,
            filename: outputFilename,
            dimensions: size.width ? `${size.width}x${size.height}` : 'original',
            fileSize: this.formatBytes(stats.size),
            compressionRatio: `${compressionRatio}%`
          });
          
          console.log(`  ✅ ${outputFilename} - ${this.formatBytes(stats.size)} (${compressionRatio}% smaller)`);
        }
      }
      
      return results;
    } catch (error) {
      console.error(`❌ Error optimizing ${filename}:`, error.message);
      throw error;
    }
  }

  /**
   * Optimize all images in a directory
   */
  async optimizeDirectory(inputDir, outputDir) {
    try {
      const files = await fs.readdir(inputDir);
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase().slice(1);
        return this.supportedFormats.includes(ext);
      });

      console.log(`🚀 Found ${imageFiles.length} images to optimize in ${inputDir}`);
      
      const allResults = [];
      
      for (const file of imageFiles) {
        const inputPath = path.join(inputDir, file);
        const results = await this.optimizeImage(inputPath, outputDir, file);
        allResults.push(...results);
      }
      
      return allResults;
    } catch (error) {
      console.error('❌ Error optimizing directory:', error.message);
      throw error;
    }
  }

  /**
   * Generate responsive image HTML
   */
  generateResponsiveImageHTML(baseName, alt = '', className = '') {
    return `
      <picture class="${className}">
        <source srcset="/images/optimized/${baseName}_small.avif" media="(max-width: 400px)" type="image/avif">
        <source srcset="/images/optimized/${baseName}_small.webp" media="(max-width: 400px)" type="image/webp">
        <source srcset="/images/optimized/${baseName}_medium.avif" media="(max-width: 800px)" type="image/avif">
        <source srcset="/images/optimized/${baseName}_medium.webp" media="(max-width: 800px)" type="image/webp">
        <source srcset="/images/optimized/${baseName}_large.avif" media="(max-width: 1200px)" type="image/avif">
        <source srcset="/images/optimized/${baseName}_large.webp" media="(max-width: 1200px)" type="image/webp">
        <source srcset="/images/optimized/${baseName}_original.avif" type="image/avif">
        <source srcset="/images/optimized/${baseName}_original.webp" type="image/webp">
        <img src="/images/optimized/${baseName}_medium.webp" alt="${alt}" loading="lazy">
      </picture>
    `;
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get optimization statistics
   */
  async getOptimizationStats(results) {
    const stats = {
      totalImages: results.length / (this.sizes.length * this.outputFormats.length),
      totalFiles: results.length,
      totalSize: 0,
      averageCompression: 0,
      formats: {}
    };

    results.forEach(result => {
      stats.totalSize += result.fileSize;
      stats.averageCompression += parseFloat(result.compressionRatio);
      
      if (!stats.formats[result.format]) {
        stats.formats[result.format] = { count: 0, totalSize: 0 };
      }
      stats.formats[result.format].count++;
      stats.formats[result.format].totalSize += result.fileSize;
    });

    stats.averageCompression = (stats.averageCompression / results.length).toFixed(1);
    
    return stats;
  }
}

module.exports = ImageOptimizer;
