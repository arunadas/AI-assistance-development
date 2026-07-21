# Sample Performance Findings

This document shows what performance findings look like when Claude Code uses DevTools MCP to audit an application.

## Example 1: E-Commerce Product Page

### Audit Summary
- **URL:** https://shop.example.com/products/widget
- **Date:** March 2026
- **Overall Score:** 42/100 (Needs Improvement)
- **Main Issue:** Large unoptimized images causing layout shift and slow load time

### Core Web Vitals

| Metric | Measured | Target | Status |
|--------|----------|--------|--------|
| LCP | 4.2s | < 2.5s | ❌ FAIL |
| FID | 145ms | < 100ms | ❌ FAIL |
| CLS | 0.28 | < 0.1 | ❌ FAIL |
| TTFB | 850ms | < 600ms | ❌ FAIL |
| FCP | 2.1s | < 1.8s | ❌ FAIL |

### Network Analysis

**Total Page Size:** 8.4 MB

**Largest Resources:**
1. product-hero-image.jpg - 3.2 MB (38% of page)
   - Should be < 500KB with proper optimization
   - No responsive srcset
   - Not using WebP format

2. JavaScript bundle - 1.2 MB (14% of page)
   - Has minification but still large
   - Contains unused code (24% unused by this page)
   - Recommend code splitting

3. Font files - 0.8 MB (10% of page)
   - Loading 4 font weights
   - Consider variable font instead
   - Should be preloaded better

4. Analytics/tracking scripts - 0.6 MB (7% of page)
   - 3 different third-party scripts
   - All loaded synchronously
   - Recommend deferring

### JavaScript Performance Issues

**Profiling Results:**

Long Tasks (> 50ms):
1. React component hydration: 312ms
   - React version: 18.2 (outdated, should use 19)
   - Multiple expensive computations during render
   - No suspense boundaries for code splitting

2. Image lazy-load observer setup: 78ms
   - Inefficient DOM traversal
   - Creating intersection observers in a loop

3. Analytics initialization: 142ms
   - Blocking main thread unnecessarily
   - Should use Web Worker

**Total JavaScript Time:** 1,240ms (26% of page load)

### Image Optimization Issues

**Problems Identified:**

1. Hero image (3.2 MB) - Missing attributes:
   ```html
   <!-- Current (bad) -->
   <img src="hero.jpg" />

   <!-- Should be -->
   <img
     src="hero-1024.webp"
     srcset="hero-2048.webp 2048w, hero-1024.webp 1024w, hero-512.webp 512w"
     sizes="100vw"
     width="2048"
     height="1365"
     alt="Premium Widget"
     loading="lazy"
   />
   ```

2. Layout Shift from Images:
   - CLS = 0.28 (should be < 0.1)
   - Caused by images loading without height
   - Hero loads: +0.15 CLS
   - Gallery loads: +0.13 CLS

3. No modern format support:
   - JPG can be 60% smaller as WebP
   - No AVIF fallback for newer browsers

### Console Warnings/Errors

```
⚠️ Warning: Each child in a list should have a unique "key" prop.
   at ProductGallery (productPage.js:234)
   Affects: 12 images in the gallery

⚠️ Deprecation Warning: 'getRenderingContext' is deprecated. Use 'getContext' instead.
   at animate.js:45

❌ Uncaught TypeError: Cannot read property 'querySelector' of undefined
   at initializeCheckout (checkout.js:178)
   Causes: Checkout button to fail 5% of the time

⚠️ CSP Warning: img-src directive does not allow this image
   Image: tracker.analytics.com/pixel.gif
   Should whitelist domain in Content-Security-Policy header
```

### Rendering Performance

**Paint Timing:**
- First Paint (FP): 2.1s
- First Contentful Paint (FCP): 2.1s
- Largest Contentful Paint (LCP): 4.2s (hero image takes 4.2s to load)

**Frame Rate:**
- During load: 8 FPS (should be 60)
- During scroll: 22 FPS (should be 60)
- Caused by: Inefficient scroll listeners on Gallery

### Recommendations (Prioritized)

#### 🔴 Critical (Fix Immediately)
1. **Optimize hero image** (impact: -2.1s LCP, -25% page size)
   - Convert to WebP format
   - Create responsive srcset for different devices
   - Target: hero.webp (400KB), hero-large.webp (800KB)
   - Estimated improvement: LCP from 4.2s to 2.1s

2. **Fix layout shift issues** (impact: CLS from 0.28 to < 0.1)
   - Add width/height to all images
   - Reserve space before images load
   - Use aspect-ratio CSS property
   - Estimated improvement: CLS from 0.28 to 0.05

#### 🟡 High Priority (Fix Soon)
3. **Defer non-critical JavaScript** (impact: -312ms load time)
   - Move analytics to separate Web Worker
   - Code-split React component based on routes
   - Defer image observer initialization
   - Estimated improvement: -250ms LCP

4. **Optimize JavaScript bundle** (impact: -600KB)
   - Remove 24% unused code
   - Tree-shake unused dependencies
   - Implement dynamic imports for features
   - Estimated improvement: -600KB, -140ms load time

5. **Consolidate web fonts** (impact: -500KB)
   - Switch from 4 font files to 1 variable font
   - Subset fonts to only needed characters
   - Estimated improvement: -500KB, -100ms load time

#### 🟢 Medium Priority (Nice to Have)
6. **Fix React deprecations**
   - Update to React 19 with automatic batching
   - Use new hooks API
   - Estimated improvement: -80ms (hydration time)

7. **Implement proper caching headers**
   - Static assets: Cache-Control: max-age=31536000
   - HTML: Cache-Control: max-age=3600, must-revalidate
   - Estimated improvement: repeat visits load 80% faster

---

## Example 2: SaaS Dashboard

### Audit Summary
- **URL:** https://dashboard.example.com
- **Date:** March 2026
- **Overall Score:** 78/100 (Good, with optimizations possible)
- **Main Issue:** Main thread blocking from data processing

### Core Web Vitals

| Metric | Measured | Target | Status |
|--------|----------|--------|--------|
| LCP | 1.8s | < 2.5s | ✅ PASS |
| FID | 85ms | < 100ms | ✅ PASS |
| CLS | 0.05 | < 0.1 | ✅ PASS |
| TTFB | 320ms | < 600ms | ✅ PASS |
| FCP | 1.2s | < 1.8s | ✅ PASS |

### Identified Issues

1. **Long Task (152ms) in Data Processing**
   ```javascript
   // Current - Blocks main thread
   const processedData = largeDataArray.map(item => {
     return complexCalculation(item); // 152ms total
   });
   ```

   Solution: Use Web Worker
   ```javascript
   const worker = new Worker('processor.js');
   worker.postMessage(largeDataArray);
   worker.onmessage = (e) => setProcessedData(e.data);
   ```

2. **Excessive DOM Queries in Dashboard Widgets**
   - Each chart widget queries DOM for size: 24 queries
   - Causes layout recalculation: 340ms total

   Solution: Use ResizeObserver instead
   ```javascript
   const observer = new ResizeObserver(() => resizeChart());
   observer.observe(chartContainer);
   ```

3. **Missing Compression on API Responses**
   - Dashboard data: 450KB (should be < 100KB)
   - Enable gzip: Would reduce to 95KB (79% savings)

### Recommendations

1. **Offload calculation to Web Worker** (Impact: -152ms main thread)
   - Complexity: Medium (1-2 hours)
   - Benefit: Smoother dashboard, better responsiveness

2. **Enable gzip compression on API responses** (Impact: -355KB data)
   - Complexity: Low (15 minutes)
   - Benefit: Faster load, less bandwidth

3. **Implement ResizeObserver for chart sizing** (Impact: -340ms reflows)
   - Complexity: Low (30 minutes)
   - Benefit: Smoother interactions

---

## Example 3: Blog Site (Mobile)

### Audit Summary (Mobile - Slow 4G)
- **URL:** https://blog.example.com
- **Device:** iPhone SE (375x667)
- **Network:** Slow 4G throttling
- **Date:** March 2026
- **Overall Score:** 65/100 (Needs Improvement)
- **Main Issue:** Slow initial load time on mobile networks

### Core Web Vitals (Mobile)

| Metric | Measured | Target | Status |
|--------|----------|--------|--------|
| LCP | 6.8s | < 2.5s | ❌ FAIL |
| FID | 320ms | < 100ms | ❌ FAIL |
| CLS | 0.12 | < 0.1 | ❌ FAIL |

### Mobile-Specific Issues

1. **Unoptimized images for mobile**
   - Desktop images (2048x1365) served to mobile
   - Mobile viewport: 375px wide, but loading 2048px images
   - Should serve 375px images on mobile

2. **Slow JavaScript parsing**
   - 1.2 MB JavaScript bundle takes 3.2s to parse on mobile
   - Modern mobile CPU is 3-4x slower than desktop

3. **No code splitting**
   - Loading all features upfront (even unused ones)
   - Recommend lazy-loading below-fold features

### Recommendations for Mobile

1. **Responsive images for mobile** (Impact: -2.1s LCP on mobile)
   - Serve 375px images on mobile, 1024px on desktop
   - Use `srcset` attribute
   - Estimated benefit: LCP from 6.8s to 2.1s

2. **Code splitting by route** (Impact: -1.2s load time)
   - Split bundle into route-specific chunks
   - Load feature A only when needed
   - Estimated benefit: Initial JS load -600KB

3. **Aggressive image lazy-loading** (Impact: -1.5s perceived load)
   - Only load images in viewport
   - Use loading="lazy" attribute
   - Estimated benefit: First render -1.5s

---

## How to Interpret These Findings

### Colors and Status

- ✅ **PASS (Green):** Metric meets target
- ⚠️ **SLOW (Yellow):** Metric is below target
- ❌ **FAIL (Red):** Metric is significantly below target

### Impact Estimation

When Claude reports findings, it will note:
- **Impact:** Estimated improvement in seconds or percentage
- **Complexity:** Effort required (Low/Medium/High)
- **Priority:** Based on impact × frequency

### Using These Findings

1. **Start with Critical issues** (red items)
2. **Measure before/after** (run audit again)
3. **Focus on what users experience** (CLS, LCP, FID)
4. **Consider effort vs benefit** (prefer high-impact, low-effort fixes)

---

## Real-World Application

These findings are based on actual performance audits Claude Code can perform using DevTools MCP. To get findings like these:

```
In Claude Code:

Use DevTools MCP to audit [URL] and:
1. Measure all Core Web Vitals
2. Analyze network waterfall
3. Profile JavaScript execution
4. Check for layout shifts
5. List all console errors
6. Provide a prioritized fix list with estimated impact
```

The above examples show the type and depth of analysis Claude can provide with direct DevTools access!

