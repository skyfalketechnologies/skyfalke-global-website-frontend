const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs').promises;
const path = require('path');

const runLighthouse = async (url, options = {}) => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  options.port = chrome.port;

  try {
    const runnerResult = await lighthouse(url, options);
    await chrome.kill();

    return {
      lhr: runnerResult.lhr,
      report: runnerResult.report
    };
  } catch (error) {
    await chrome.kill();
    throw error;
  }
};

const generateReport = async () => {
  const url = 'http://localhost:3000';
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'best-practices', 'accessibility', 'seo'],
    settings: {
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0
      },
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false
      }
    }
  };

  try {
    console.log('Running Lighthouse audit...');
    const { lhr, report } = await runLighthouse(url, options);
    
    // Save HTML report
    const reportPath = path.join(__dirname, '../lighthouse-report.html');
    await fs.writeFile(reportPath, report);
    console.log(`Lighthouse report saved to: ${reportPath}`);
    
    // Extract key metrics
    const metrics = {
      performance: lhr.categories.performance.score * 100,
      bestPractices: lhr.categories['best-practices'].score * 100,
      accessibility: lhr.categories.accessibility.score * 100,
      seo: lhr.categories.seo.score * 100,
      firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
      largestContentfulPaint: lhr.audits['largest-contentful-paint'].numericValue,
      cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue,
      totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
      speedIndex: lhr.audits['speed-index'].numericValue
    };
    
    console.log('\n=== LIGHTHOUSE RESULTS ===');
    console.log(`Performance: ${metrics.performance.toFixed(1)}/100`);
    console.log(`Best Practices: ${metrics.bestPractices.toFixed(1)}/100`);
    console.log(`Accessibility: ${metrics.accessibility.toFixed(1)}/100`);
    console.log(`SEO: ${metrics.seo.toFixed(1)}/100`);
    console.log('\n=== CORE WEB VITALS ===');
    console.log(`First Contentful Paint: ${(metrics.firstContentfulPaint / 1000).toFixed(2)}s`);
    console.log(`Largest Contentful Paint: ${(metrics.largestContentfulPaint / 1000).toFixed(2)}s`);
    console.log(`Cumulative Layout Shift: ${metrics.cumulativeLayoutShift.toFixed(3)}`);
    console.log(`Total Blocking Time: ${(metrics.totalBlockingTime / 1000).toFixed(2)}s`);
    console.log(`Speed Index: ${(metrics.speedIndex / 1000).toFixed(2)}s`);
    
    // Performance recommendations
    console.log('\n=== PERFORMANCE RECOMMENDATIONS ===');
    if (metrics.performance < 90) {
      console.log('⚠️  Performance score is below 90. Consider:');
      console.log('   - Optimizing images (WebP, AVIF formats)');
      console.log('   - Implementing lazy loading');
      console.log('   - Reducing JavaScript bundle size');
      console.log('   - Enabling compression');
    }
    
    if (metrics.largestContentfulPaint > 2500) {
      console.log('⚠️  LCP is above 2.5s. Consider:');
      console.log('   - Preloading critical resources');
      console.log('   - Optimizing above-the-fold images');
      console.log('   - Reducing server response time');
    }
    
    if (metrics.cumulativeLayoutShift > 0.1) {
      console.log('⚠️  CLS is above 0.1. Consider:');
      console.log('   - Setting explicit dimensions for images');
      console.log('   - Avoiding dynamic content insertion');
      console.log('   - Using font-display: swap');
    }
    
    return metrics;
  } catch (error) {
    console.error('Error running Lighthouse:', error);
    process.exit(1);
  }
};

// Run the performance test
generateReport();
