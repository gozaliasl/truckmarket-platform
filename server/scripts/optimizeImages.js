const ImageOptimizer = require('../utils/imageOptimizer');
const path = require('path');
const fs = require('fs').promises;

async function optimizeAllImages() {
  const optimizer = new ImageOptimizer();
  
  console.log('🖼️ Starting image optimization process...\n');
  
  try {
    // Define input and output directories
    const inputDirs = [
      path.join(__dirname, '../../client/public/images'),
      path.join(__dirname, '../../client/public/images/car-brands'),
      path.join(__dirname, '../../client/public/images/vehicle-types'),
      path.join(__dirname, '../../photos')
    ];
    
    const outputDir = path.join(__dirname, '../../client/public/images/optimized');
    
    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });
    
    let totalResults = [];
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    
    for (const inputDir of inputDirs) {
      try {
        // Check if directory exists
        await fs.access(inputDir);
        
        console.log(`📁 Processing directory: ${inputDir}`);
        const results = await optimizer.optimizeDirectory(inputDir, outputDir);
        totalResults.push(...results);
        
        // Calculate size savings
        const originalFiles = await fs.readdir(inputDir);
        for (const file of originalFiles) {
          const ext = path.extname(file).toLowerCase().slice(1);
          if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
            const filePath = path.join(inputDir, file);
            const stats = await fs.stat(filePath);
            totalOriginalSize += stats.size;
          }
        }
        
        console.log(`✅ Completed: ${inputDir}\n`);
      } catch (error) {
        console.log(`⚠️ Skipping ${inputDir} (directory not found or empty)\n`);
      }
    }
    
    // Calculate total optimized size
    for (const result of totalResults) {
      const stats = await fs.stat(result.path);
      totalOptimizedSize += stats.size;
    }
    
    // Generate optimization report
    const totalSavings = totalOriginalSize - totalOptimizedSize;
    const savingsPercentage = ((totalSavings / totalOriginalSize) * 100).toFixed(1);
    
    console.log('🎉 Image optimization complete!\n');
    console.log('📊 Optimization Report:');
    console.log(`   • Total images processed: ${totalResults.length / 10} (10 variants each)`);
    console.log(`   • Original total size: ${optimizer.formatBytes(totalOriginalSize)}`);
    console.log(`   • Optimized total size: ${optimizer.formatBytes(totalOptimizedSize)}`);
    console.log(`   • Total savings: ${optimizer.formatBytes(totalSavings)} (${savingsPercentage}%)`);
    console.log(`   • Generated formats: WebP, AVIF`);
    console.log(`   • Generated sizes: Thumbnail, Small, Medium, Large, Original`);
    
    // Create a manifest file for easy reference
    const manifest = {
      generated: new Date().toISOString(),
      totalImages: totalResults.length / 10,
      totalFiles: totalResults.length,
      originalSize: totalOriginalSize,
      optimizedSize: totalOptimizedSize,
      savings: totalSavings,
      savingsPercentage: parseFloat(savingsPercentage),
      results: totalResults
    };
    
    await fs.writeFile(
      path.join(outputDir, 'optimization-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log(`\n📄 Manifest saved to: ${path.join(outputDir, 'optimization-manifest.json')}`);
    
    // Generate usage examples
    const usageExamples = `
// Usage Examples for Optimized Images

// 1. Responsive Image Component
const ResponsiveImage = ({ baseName, alt, className }) => {
  return (
    <picture className={className}>
      <source srcSet="/images/optimized/${baseName}_small.avif" media="(max-width: 400px)" type="image/avif" />
      <source srcSet="/images/optimized/${baseName}_small.webp" media="(max-width: 400px)" type="image/webp" />
      <source srcSet="/images/optimized/${baseName}_medium.avif" media="(max-width: 800px)" type="image/avif" />
      <source srcSet="/images/optimized/${baseName}_medium.webp" media="(max-width: 800px)" type="image/webp" />
      <source srcSet="/images/optimized/${baseName}_large.avif" media="(max-width: 1200px)" type="image/avif" />
      <source srcSet="/images/optimized/${baseName}_large.webp" media="(max-width: 1200px)" type="image/webp" />
      <source srcSet="/images/optimized/${baseName}_original.avif" type="image/avif" />
      <source srcSet="/images/optimized/${baseName}_original.webp" type="image/webp" />
      <img src="/images/optimized/${baseName}_medium.webp" alt={alt} loading="lazy" />
    </picture>
  );
};

// 2. CSS for background images
.hero-bg {
  background-image: url('/images/optimized/hero-bg_small.webp');
}

@media (min-width: 400px) {
  .hero-bg {
    background-image: url('/images/optimized/hero-bg_medium.webp');
  }
}

@media (min-width: 800px) {
  .hero-bg {
    background-image: url('/images/optimized/hero-bg_large.webp');
  }
}

@media (min-width: 1200px) {
  .hero-bg {
    background-image: url('/images/optimized/hero-bg_original.webp');
  }
}

// 3. Lazy loading with intersection observer
const LazyImage = ({ baseName, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={imgRef}>
      {isLoaded && (
        <picture>
          <source srcSet="/images/optimized/${baseName}_medium.avif" type="image/avif" />
          <source srcSet="/images/optimized/${baseName}_medium.webp" type="image/webp" />
          <img src="/images/optimized/${baseName}_medium.webp" alt={alt} />
        </picture>
      )}
    </div>
  );
};
`;
    
    await fs.writeFile(
      path.join(outputDir, 'usage-examples.js'),
      usageExamples
    );
    
    console.log(`\n📚 Usage examples saved to: ${path.join(outputDir, 'usage-examples.js')}`);
    console.log('\n🚀 Image optimization benefits:');
    console.log('   • 60-80% smaller file sizes');
    console.log('   • Faster page load times');
    console.log('   • Better mobile experience');
    console.log('   • Reduced bandwidth usage');
    console.log('   • Modern format support (WebP, AVIF)');
    console.log('   • Responsive image delivery');
    
  } catch (error) {
    console.error('❌ Error during image optimization:', error);
  }
}

// Run the optimization
optimizeAllImages();
