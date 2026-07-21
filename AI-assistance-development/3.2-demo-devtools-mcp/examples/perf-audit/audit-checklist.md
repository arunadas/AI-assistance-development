# Performance Audit Checklist

Use this checklist with Claude Code and DevTools MCP to perform a comprehensive performance audit of any web application.

## Pre-Audit Setup

- [ ] Chrome DevTools MCP configured in `.claude/settings.json`
- [ ] Chrome running with `--remote-debugging-port=9222`
- [ ] Target app running at specified URL
- [ ] Cache cleared or in incognito mode
- [ ] Network throttling set (if testing slow connections)

---

## 1. Initial Page Inspection

**Ask Claude Code:**

```
Use DevTools MCP to:
1. Navigate to [URL]
2. Take a screenshot of the initial page load
3. Count the number of DOM elements
4. List any visible errors or warnings in the console
5. Report what you see
```

**Things to look for:**
- [ ] Page loads without obvious errors
- [ ] Content visible above the fold
- [ ] No major console warnings
- [ ] Proper responsive design

---

## 2. Core Web Vitals Measurement

**Ask Claude Code:**

```
Use DevTools MCP to measure and report the Core Web Vitals for [URL]:
1. LCP (Largest Contentful Paint) - should be < 2.5s
2. FID (First Input Delay) - should be < 100ms
3. CLS (Cumulative Layout Shift) - should be < 0.1
4. FCP (First Contentful Paint)
5. TTFB (Time to First Byte)

Tell me if any metrics are in the "poor" range (red).
```

**Expected values:**
- LCP: < 2.5s (good), < 4s (needs improvement)
- FID: < 100ms (good), < 300ms (needs improvement)
- CLS: < 0.1 (good), < 0.25 (needs improvement)

---

## 3. Network Analysis

**Ask Claude Code:**

```
Use DevTools MCP to analyze the Network tab:
1. Record all network requests for [URL]
2. Find the largest requests (by file size)
3. Find the slowest requests (by response time)
4. List any failed requests (4xx or 5xx)
5. Calculate total page weight
6. Identify requests with high latency
7. Report any blocking requests that delay rendering
```

**Things to check:**
- [ ] Total page size < 2MB (ideally < 500KB)
- [ ] Largest requests are optimized (images, bundles)
- [ ] No unnecessary requests
- [ ] No failed requests (unless expected)
- [ ] Critical resources load early
- [ ] No blocking resources before interactive

---

## 4. JavaScript Performance

**Ask Claude Code:**

```
Use DevTools MCP to profile JavaScript performance:
1. Take a performance trace while the page loads
2. Identify the longest scripting tasks
3. Find tasks > 50ms (Long Tasks)
4. Report the total scripting time
5. Show me the main thread timeline during load
6. Tell me which scripts are causing delays
```

**Things to check:**
- [ ] Total JavaScript is < 300KB
- [ ] No Long Tasks (> 50ms)
- [ ] Main thread blocking time is minimal
- [ ] Initialization scripts are optimized
- [ ] No unnecessary parsing/compilation

---

## 5. Image Optimization

**Ask Claude Code:**

```
Use DevTools MCP to analyze images:
1. Take screenshots of the page
2. List all images loaded
3. Check if images have explicit width/height attributes
4. Measure Cumulative Layout Shift (CLS)
5. Check for unoptimized or over-sized images
6. Tell me if images could be served in modern formats (WebP)
```

**Things to check:**
- [ ] Images have width/height attributes
- [ ] Images use responsive srcset where needed
- [ ] Large images are lazy-loaded
- [ ] Modern formats (WebP) are used where possible
- [ ] CLS from images is minimal (< 0.05)

---

## 6. CSS and Rendering

**Ask Claude Code:**

```
Use DevTools MCP to analyze rendering:
1. Take a performance trace
2. Look for Recalculate Style events
3. Look for Layout events
4. Measure time spent in rendering
5. Check for layout thrashing patterns
6. Report the frame rate during scrolling
```

**Things to check:**
- [ ] CSS is optimized (< 100KB)
- [ ] No excessive recalculations
- [ ] No layout thrashing
- [ ] Smooth scrolling (60fps or higher)
- [ ] Animations use GPU-accelerated properties

---

## 7. Console Warnings and Errors

**Ask Claude Code:**

```
Use DevTools MCP to check the console:
1. Clear the console
2. Reload the page
3. Wait for all resources to load
4. Capture all warnings and errors
5. Report any deprecation warnings
6. Tell me about any failed API calls
```

**Things to check:**
- [ ] No JavaScript errors
- [ ] No deprecation warnings
- [ ] No CORS errors
- [ ] No Resource loading errors
- [ ] No unhandled promise rejections

---

## 8. Third-Party Scripts

**Ask Claude Code:**

```
Use DevTools MCP to identify third-party scripts:
1. List all external scripts loaded
2. Measure the total size of third-party code
3. Identify which domains are slowest
4. Check if any third-party code is blocking rendering
5. Recommend which scripts could be deferred/async
```

**Things to check:**
- [ ] Third-party scripts don't exceed 30% of total JS
- [ ] Analytics/tracking scripts are async
- [ ] Ad scripts are deferred if possible
- [ ] Third-party fonts are optimized

---

## 9. Mobile Performance

**Ask Claude Code:**

```
Use DevTools MCP to test mobile performance:
1. Resize the viewport to 375x667 (iPhone SE)
2. Set network throttling to Slow 4G
3. Take a performance trace
4. Report the load time and metrics
5. Check for mobile-specific issues (tiny buttons, horizontal scroll)
```

**Things to check:**
- [ ] Page is responsive at 375px width
- [ ] Text is readable without zoom
- [ ] Buttons are at least 44x44px
- [ ] No horizontal scrolling
- [ ] Mobile load time < 5s on Slow 4G

---

## 10. Accessibility Quick Check

**Ask Claude Code:**

```
Use DevTools MCP to check accessibility:
1. Use the DevTools accessibility panel
2. Check for color contrast issues
3. Look for missing alt text on images
4. Check heading hierarchy (h1, h2, h3...)
5. Look for missing labels on form inputs
```

**Things to check:**
- [ ] All images have descriptive alt text
- [ ] Color contrast is at least 4.5:1 for text
- [ ] Headings follow logical order (one h1 per page)
- [ ] Form inputs are labeled
- [ ] No keyboard traps

---

## 11. Caching Analysis

**Ask Claude Code:**

```
Use DevTools MCP to analyze caching:
1. Check the Network tab headers
2. Look for Cache-Control headers
3. Check for ETag or Last-Modified headers
4. Identify which resources are cached
5. Identify which resources are missing cache headers
```

**Things to check:**
- [ ] Static assets have long cache times (1 year)
- [ ] HTML has short cache or no-cache
- [ ] Dynamic content has appropriate headers
- [ ] No unnecessary cache misses

---

## 12. Security Check

**Ask Claude Code:**

```
Use DevTools MCP to check security:
1. Check for mixed content (HTTP on HTTPS site)
2. Look for security warnings
3. Check the console for CSP violations
4. Verify HTTPS is being used
```

**Things to check:**
- [ ] All resources are served over HTTPS
- [ ] No mixed content warnings
- [ ] No CSP (Content Security Policy) errors
- [ ] Security headers look appropriate

---

## Summary Report Template

Once you've completed the audit, create a summary:

```markdown
# Performance Audit Report

## Date: [Date]
## URL: [URL]

### Overall Assessment
- **Performance Score:** [X/100]
- **Status:** [Good/Needs Improvement/Critical Issues]

### Key Metrics
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| LCP | [value] | < 2.5s | [Pass/Fail] |
| FID | [value] | < 100ms | [Pass/Fail] |
| CLS | [value] | < 0.1 | [Pass/Fail] |
| Page Size | [value] | < 500KB | [Pass/Fail] |
| Load Time | [value] | < 3s | [Pass/Fail] |

### Critical Issues (Fix First)
1. [Issue with specific metric]
2. [Issue with specific metric]

### Important Issues (Fix Soon)
1. [Issue]
2. [Issue]

### Minor Issues (Nice to Have)
1. [Issue]
2. [Issue]

### Recommendations
1. [Specific action item with expected impact]
2. [Specific action item with expected impact]
3. [Specific action item with expected impact]

### Next Steps
- [ ] Implement fix #1
- [ ] Implement fix #2
- [ ] Re-audit after fixes
```

---

## Audit Commands for Claude

### Quick Audit (5 minutes)
```
Use DevTools MCP to quickly audit [URL]:
1. Core Web Vitals
2. Total page size and load time
3. Any console errors
4. Top 3 slowest resources
Report back with findings.
```

### Detailed Audit (15 minutes)
```
Use DevTools MCP for a detailed audit of [URL]:
1. Core Web Vitals
2. Network analysis (slowest requests, total size)
3. JavaScript performance (longest tasks)
4. Image optimization check
5. Console errors and warnings
6. Accessibility quick check
Report each finding with recommendations.
```

### Deep Dive Audit (30 minutes)
```
Use DevTools MCP to deeply audit [URL]:
1. Perform all steps from the Performance Audit Checklist
2. For each failing metric, suggest specific fixes
3. Estimate the performance improvement for each fix
4. Create a prioritized action plan
5. Generate a detailed report

Focus on:
- Core Web Vitals optimization
- Network optimization
- JavaScript optimization
- Image optimization
- Rendering performance
```

---

## Tips for Effective Auditing

1. **Baseline Measurement:** Always measure before making changes
2. **Real User Metrics:** Also check with real-world monitoring (not just synthetic tests)
3. **Multiple Runs:** Run audits multiple times to account for network variations
4. **Mobile vs Desktop:** Test both thoroughly (not the same)
5. **Throttling:** Test on slow networks and devices
6. **Monitoring:** Set up continuous monitoring after fixes
7. **User Testing:** Performance metrics matter, but user experience matters more

---

## Common Performance Issues and Fixes

See the debug app's ISSUES.md for detailed examples of:
- Layout thrashing and how to fix it
- JavaScript errors and prevention
- Slow API calls and optimization
- Unoptimized images and responsive design
- Blocking JavaScript and async patterns

This checklist pairs perfectly with the debug app demo!
