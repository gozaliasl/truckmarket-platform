const fs = require('fs').promises;
const path = require('path');
const { gzip, brotliCompress } = require('zlib');
const { promisify } = require('util');

const gzipAsync = promisify(gzip);
const brotliAsync = promisify(brotliCompress);

/**
 * Static Asset Optimization Script
 * Compresses and optimizes static assets for CDN delivery
 */

class StaticAssetOptimizer {
  constructor() {
    this.supportedFormats = ['.js', '.css', '.html', '.json', '.svg', '.xml'];
    this.compressionFormats = ['gzip', 'brotli'];
    this.stats = {
      totalFiles: 0,
      totalOriginalSize: 0,
      totalCompressedSize: 0,
      savings: 0
    };
  }

  /**
   * Optimize a single file
   */
  async optimizeFile(filePath, outputDir) {
    try {
      const content = await fs.readFile(filePath);
      const originalSize = content.length;
      const fileName = path.basename(filePath);
      const fileExt = path.extname(filePath);
      
      console.log(`📦 Optimizing: ${fileName} (${this.formatBytes(originalSize)})`);
      
      const results = [];
      
      // Create gzip version
      const gzipContent = await gzipAsync(content, { level: 9 });
      const gzipPath = path.join(outputDir, `${fileName}.gz`);
      await fs.writeFile(gzipPath, gzipContent);
      
      const gzipSize = gzipContent.length;
      const gzipSavings = ((originalSize - gzipSize) / originalSize * 100).toFixed(1);
      
      results.push({
        format: 'gzip',
        path: gzipPath,
        originalSize,
        compressedSize: gzipSize,
        savings: gzipSavings
      });
      
      console.log(`  ✅ Gzip: ${this.formatBytes(gzipSize)} (${gzipSavings}% smaller)`);
      
      // Create brotli version (if supported)
      try {
        const brotliContent = await brotliAsync(content, {
          params: {
            [require('zlib').constants.BROTLI_PARAM_MODE]: require('zlib').constants.BROTLI_MODE_TEXT,
            [require('zlib').constants.BROTLI_PARAM_QUALITY]: 11
          }
        });
        
        const brotliPath = path.join(outputDir, `${fileName}.br`);
        await fs.writeFile(brotliPath, brotliContent);
        
        const brotliSize = brotliContent.length;
        const brotliSavings = ((originalSize - brotliSize) / originalSize * 100).toFixed(1);
        
        results.push({
          format: 'brotli',
          path: brotliPath,
          originalSize,
          compressedSize: brotliSize,
          savings: brotliSavings
        });
        
        console.log(`  ✅ Brotli: ${this.formatBytes(brotliSize)} (${brotliSavings}% smaller)`);
      } catch (error) {
        console.log(`  ⚠️ Brotli not available for ${fileName}`);
      }
      
      // Update stats
      this.stats.totalFiles++;
      this.stats.totalOriginalSize += originalSize;
      this.stats.totalCompressedSize += Math.min(...results.map(r => r.compressedSize));
      
      return results;
    } catch (error) {
      console.error(`❌ Error optimizing ${filePath}:`, error.message);
      return [];
    }
  }

  /**
   * Optimize all files in a directory
   */
  async optimizeDirectory(inputDir, outputDir) {
    try {
      await fs.mkdir(outputDir, { recursive: true });
      
      const files = await fs.readdir(inputDir);
      const supportedFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return this.supportedFormats.includes(ext);
      });
      
      console.log(`🚀 Found ${supportedFiles.length} files to optimize in ${inputDir}`);
      
      const allResults = [];
      
      for (const file of supportedFiles) {
        const filePath = path.join(inputDir, file);
        const results = await this.optimizeFile(filePath, outputDir);
        allResults.push(...results);
      }
      
      return allResults;
    } catch (error) {
      console.error('❌ Error optimizing directory:', error.message);
      return [];
    }
  }

  /**
   * Generate .htaccess file for Apache servers
   */
  async generateHtaccess(outputDir) {
    const htaccessContent = `
# Enable compression
<IfModule mod_deflate.c>
    # Compress HTML, CSS, JavaScript, Text, XML and fonts
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/vnd.ms-fontobject
    AddOutputFilterByType DEFLATE application/x-font
    AddOutputFilterByType DEFLATE application/x-font-opentype
    AddOutputFilterByType DEFLATE application/x-font-otf
    AddOutputFilterByType DEFLATE application/x-font-truetype
    AddOutputFilterByType DEFLATE application/x-font-ttf
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE font/opentype
    AddOutputFilterByType DEFLATE font/otf
    AddOutputFilterByType DEFLATE font/ttf
    AddOutputFilterByType DEFLATE image/svg+xml
    AddOutputFilterByType DEFLATE image/x-icon
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/xml
</IfModule>

# Enable Brotli compression
<IfModule mod_brotli.c>
    AddOutputFilterByType BROTLI_COMPRESS text/plain
    AddOutputFilterByType BROTLI_COMPRESS text/css
    AddOutputFilterByType BROTLI_COMPRESS text/xml
    AddOutputFilterByType BROTLI_COMPRESS text/javascript
    AddOutputFilterByType BROTLI_COMPRESS application/javascript
    AddOutputFilterByType BROTLI_COMPRESS application/xml
    AddOutputFilterByType BROTLI_COMPRESS application/xhtml+xml
    AddOutputFilterByType BROTLI_COMPRESS application/rss+xml
    AddOutputFilterByType BROTLI_COMPRESS application/atom_xml
    AddOutputFilterByType BROTLI_COMPRESS image/svg+xml
</IfModule>

# Serve pre-compressed files
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Serve gzip files
    RewriteCond %{HTTP:Accept-Encoding} gzip
    RewriteCond %{REQUEST_FILENAME}\.gz -f
    RewriteRule ^(.*)$ $1.gz [QSA,L]
    
    # Serve brotli files
    RewriteCond %{HTTP:Accept-Encoding} br
    RewriteCond %{REQUEST_FILENAME}\.br -f
    RewriteRule ^(.*)$ $1.br [QSA,L]
</IfModule>

# Set proper MIME types for compressed files
<IfModule mod_mime.c>
    AddType application/javascript .js.gz
    AddType text/css .css.gz
    AddType text/html .html.gz
    AddType application/json .json.gz
    AddType image/svg+xml .svg.gz
    
    AddType application/javascript .js.br
    AddType text/css .css.br
    AddType text/html .html.br
    AddType application/json .json.br
    AddType image/svg+xml .svg.br
</IfModule>

# Cache control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/avif "access plus 1 year"
</IfModule>
`;

    await fs.writeFile(path.join(outputDir, '.htaccess'), htaccessContent);
    console.log('✅ Generated .htaccess file for Apache servers');
  }

  /**
   * Generate nginx configuration
   */
  async generateNginxConfig(outputDir) {
    const nginxConfig = `
# Nginx configuration for optimized static assets
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        image/svg+xml;
    
    # Enable brotli compression
    brotli on;
    brotli_comp_level 6;
    brotli_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        image/svg+xml;
    
    # Serve pre-compressed files
    location ~* \\.(js|css|html|json|svg)$ {
        # Try brotli first, then gzip, then original
        try_files $uri.br $uri.gz $uri =404;
        
        # Set proper headers
        add_header Vary "Accept-Encoding";
        add_header Cache-Control "public, max-age=31536000";
        
        # Set MIME types for compressed files
        location ~* \\.(js|css|html|json|svg)\\.br$ {
            add_header Content-Encoding br;
            add_header Content-Type $mime_type;
        }
        
        location ~* \\.(js|css|html|json|svg)\\.gz$ {
            add_header Content-Encoding gzip;
            add_header Content-Type $mime_type;
        }
    }
    
    # Cache static assets
    location ~* \\.(png|jpg|jpeg|gif|ico|svg|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
`;

    await fs.writeFile(path.join(outputDir, 'nginx.conf'), nginxConfig);
    console.log('✅ Generated nginx.conf file');
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
  getStats() {
    this.stats.savings = ((this.stats.totalOriginalSize - this.stats.totalCompressedSize) / this.stats.totalOriginalSize * 100).toFixed(1);
    return this.stats;
  }
}

// Main optimization function
async function optimizeStaticAssets() {
  const optimizer = new StaticAssetOptimizer();
  
  console.log('🚀 Starting static asset optimization...\n');
  
  try {
    // Define input and output directories
    const inputDirs = [
      path.join(__dirname, '../../client/public'),
      path.join(__dirname, '../../client/build/static'),
      path.join(__dirname, '../../client/dist')
    ];
    
    const outputDir = path.join(__dirname, '../../client/public/optimized');
    
    let totalResults = [];
    
    for (const inputDir of inputDirs) {
      try {
        await fs.access(inputDir);
        console.log(`📁 Processing directory: ${inputDir}`);
        const results = await optimizer.optimizeDirectory(inputDir, outputDir);
        totalResults.push(...results);
        console.log(`✅ Completed: ${inputDir}\n`);
      } catch (error) {
        console.log(`⚠️ Skipping ${inputDir} (directory not found)\n`);
      }
    }
    
    // Generate server configuration files
    await optimizer.generateHtaccess(outputDir);
    await optimizer.generateNginxConfig(outputDir);
    
    // Generate optimization report
    const stats = optimizer.getStats();
    
    console.log('🎉 Static asset optimization complete!\n');
    console.log('📊 Optimization Report:');
    console.log(`   • Total files processed: ${stats.totalFiles}`);
    console.log(`   • Original total size: ${optimizer.formatBytes(stats.totalOriginalSize)}`);
    console.log(`   • Compressed total size: ${optimizer.formatBytes(stats.totalCompressedSize)}`);
    console.log(`   • Total savings: ${optimizer.formatBytes(stats.totalOriginalSize - stats.totalCompressedSize)} (${stats.savings}%)`);
    console.log(`   • Generated formats: Gzip, Brotli`);
    console.log(`   • Server configs: Apache (.htaccess), Nginx (nginx.conf)`);
    
    console.log('\n🚀 Static asset optimization benefits:');
    console.log('   • 60-80% smaller file sizes');
    console.log('   • Faster page load times');
    console.log('   • Reduced bandwidth usage');
    console.log('   • Better CDN performance');
    console.log('   • Improved Core Web Vitals');
    
    // Create manifest file
    const manifest = {
      generated: new Date().toISOString(),
      totalFiles: stats.totalFiles,
      originalSize: stats.totalOriginalSize,
      compressedSize: stats.totalCompressedSize,
      savings: stats.savings,
      results: totalResults
    };
    
    await fs.writeFile(
      path.join(outputDir, 'optimization-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log(`\n📄 Manifest saved to: ${path.join(outputDir, 'optimization-manifest.json')}`);
    
  } catch (error) {
    console.error('❌ Error during static asset optimization:', error);
  }
}

// Run the optimization
optimizeStaticAssets();
