# Chrome DevTools MCP Demo Walkthrough

Follow this step-by-step guide to understand how DevTools MCP enables automated debugging and performance analysis.

## Prerequisites

- Chrome browser installed
- Node.js and npm
- Claude Code installed
- .claude/settings.json configured with DevTools MCP

---

## Part 1: Setup

### Step 1: Configure DevTools MCP

Ensure your `.claude/settings.json` contains:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

### Step 2: Enable Remote Debugging in Chrome

Chrome DevTools MCP requires Chrome to be running with remote debugging enabled:

**On macOS:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 &
```

**On Linux:**
```bash
google-chrome --remote-debugging-port=9222 &
```

**On Windows (PowerShell):**
```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

Leave this running in the background.

### Step 3: Start the Debug App

In the `examples/debug-app/` directory:

```bash
cd examples/debug-app
npm install
npm start
```

You should see:
```
========================================
Debug Demo App Server
========================================
Server running at: http://localhost:3000
```

### Step 4: Open the App in Chrome

Open http://localhost:3000 in Chrome (the one with remote debugging enabled).

You should see the demo app with 5 buttons for different issues.

### Step 5: Start Claude Code

In the 3.2-demo-devtools-mcp directory:

```bash
npx claude
```

Claude will automatically:
1. Connect to the Chrome instance on port 9222
2. Initialize DevTools MCP access
3. Be ready to control DevTools

---

## Part 2: Basic DevTools Inspection

### Step 1: Take a Screenshot

In Claude Code, ask:

```
Use DevTools MCP to navigate to http://localhost:3000 and take a screenshot
of the page. Tell me what you see.
```

Claude will:
1. Navigate to the URL in Chrome
2. Capture a screenshot
3. Describe what's visible

This is the foundation - Claude now has visual context about your app.

### Step 2: Inspect the DOM

Ask Claude:

```
Use DevTools MCP to:
1. Read the DOM structure of http://localhost:3000
2. Count the total number of elements
3. Find all button elements and list their labels
4. Tell me what you found
```

Claude will:
- Inspect the full page structure
- Count elements (you should see ~50+ elements)
- List buttons: "Trigger Layout Thrashing", "Trigger Console Error", etc.

### Step 3: Check for Console Errors

Ask Claude:

```
Use DevTools MCP to check the console for any errors or warnings on
http://localhost:3000. Tell me what you find.
```

Claude will read the console and report:
- Deprecation warning about deprecated API
- Info message about the demo app

---

## Part 3: Analyzing Specific Issues

### Issue 1: Layout Thrashing

**Step A: Trigger the issue**

In Claude Code, ask:

```
Use DevTools MCP to:
1. Click the "Trigger Layout Thrashing (Watch DevTools Performance)" button
2. Take a performance trace during this action
3. Analyze the performance trace
4. Tell me what's causing the layout recalculations
5. Suggest how to fix it
```

Claude will:
1. Click the button in Chrome
2. Capture performance metrics
3. Identify the excessive Layout tasks
4. Suggest batching DOM operations

**Step B: Compare to Reference**

Look at `examples/debug-app/ISSUES.md` to see the detailed breakdown.

### Issue 2: Console Error

**Step A: Trigger and capture**

Ask Claude:

```
Use DevTools MCP to:
1. Click the "Trigger Console Error" button
2. Capture any console errors that appear
3. Tell me the exact error message
4. Suggest how to fix this error
```

Claude will:
1. Click the button
2. Read the console
3. Report: `TypeError: Cannot read property 'property' of undefined`
4. Suggest checking if the variable exists first

### Issue 3: Slow Network

**Step A: Monitor network**

Ask Claude:

```
Use DevTools MCP to:
1. Clear the network log
2. Click the "Make Slow API Request" button
3. Monitor the network request to /api/slow
4. Report how long it takes
5. Suggest optimizations
```

Claude will:
1. Monitor the request
2. Report: "Request to /api/slow took 3000ms"
3. Suggest: caching, optimization, or async loading

### Issue 4: Image Optimization

**Step A: Measure layout shift**

Ask Claude:

```
Use DevTools MCP to:
1. Click "Load Unoptimized Images"
2. Measure the Cumulative Layout Shift (CLS)
3. Identify which images are causing the shift
4. Tell me the CLS value and recommendations
```

Claude will:
1. Load images
2. Measure CLS: ~0.15 (should be < 0.1)
3. Report: Images are missing width/height attributes
4. Suggest: Adding explicit dimensions or aspect-ratio CSS

### Issue 5: Blocking JavaScript

**Step A: Profile the blocking code**

Ask Claude:

```
Use DevTools MCP to:
1. Start a performance profile
2. Click "Run Blocking JavaScript"
3. Record the performance while it runs
4. Stop the profile
5. Tell me how long the main thread was blocked
6. Suggest alternatives (Web Worker, chunking, etc.)
```

Claude will:
1. Record performance
2. Report: "Main thread blocked for ~3000ms"
3. Show long scripting task bar
4. Suggest: Use Web Worker for background computation

---

## Part 3: Complete Performance Audit

### Comprehensive Audit Request

Ask Claude to perform a full audit:

```
Use DevTools MCP to perform a complete performance audit of
http://localhost:3000 and:

1. Measure Core Web Vitals:
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

2. Analyze the Network tab:
   - Total page size
   - Number of requests
   - Slowest requests
   - Failed requests

3. Profile JavaScript:
   - Total scripting time
   - Any Long Tasks (> 50ms)
   - Main thread usage

4. Check the Console:
   - Any errors or warnings
   - Count of each type

5. Analyze Rendering:
   - Any layout thrashing
   - Paint operations

6. Provide a summary:
   - Performance score (1-100)
   - Top 3 issues to fix
   - Estimated impact of each fix

Create a detailed report with findings and recommendations.
```

Claude will:
1. Take screenshots
2. Measure all Core Web Vitals
3. Analyze network waterfall
4. Profile JavaScript performance
5. Check for errors
6. Generate a comprehensive report

---

## Part 4: Real-World Debugging

### Scenario: "My App is Slow on Mobile"

Ask Claude:

```
Use DevTools MCP to debug mobile performance:
1. Resize the viewport to 375x667 (iPhone size)
2. Set network to "Slow 4G" throttling
3. Measure load time and Core Web Vitals
4. Identify which resources are largest
5. Tell me what's causing slowness on mobile
6. Suggest specific optimizations for mobile
```

Claude will:
1. Resize the viewport
2. Enable throttling
3. Measure load time
4. Identify issues (large images, unoptimized JS)
5. Suggest: responsive images, code splitting, lazy-loading

### Scenario: "Users Report Janky Scrolling"

Ask Claude:

```
Use DevTools MCP to debug scrolling performance:
1. Take a performance trace during page scrolling
2. Measure the frame rate (should be 60fps)
3. Look for jank or frame drops
4. Identify what's causing low FPS
5. Suggest how to fix it
```

Claude will:
1. Record scroll performance
2. Report: "FPS dropped to 24 (should be 60)"
3. Identify: inefficient event listeners
4. Suggest: debounce listeners, use passive event listeners

---

## Part 5: Comparing Tools

### Manual Debugging (Old Way)

1. Open DevTools manually (F12)
2. Take screenshot
3. Copy/paste findings to Claude
4. Describe what you see (information loss)
5. Claude makes guesses based on description
6. Manual implementation

**Time: 20+ minutes, high error rate**

### With DevTools MCP (New Way)

1. Ask Claude to debug via DevTools MCP
2. Claude sees exact state
3. Claude reads metrics directly
4. Claude makes precise recommendations
5. Faster implementation

**Time: 2-3 minutes, high accuracy**

---

## Part 6: Key Insights

### What DevTools MCP Enables

1. **Direct Access** - Claude can see your app's real state
2. **Automated Measurement** - Core Web Vitals measured automatically
3. **Real Data** - Recommendations based on actual metrics, not guesses
4. **Faster Feedback** - No manual context switching
5. **Reproducible** - Same analysis every time

### When to Use DevTools MCP

- **Performance Optimization** - Identify bottlenecks automatically
- **Bug Reproduction** - Capture console errors and network issues
- **Mobile Testing** - Debug on simulated slow networks
- **Regression Detection** - Compare before/after metrics
- **Accessibility Audit** - Check for accessibility issues
- **Load Testing** - Measure performance under different conditions

### Workflow Integration

```
1. Make changes to your code
2. Ask Claude: "Audit the performance of my app"
3. Claude uses DevTools MCP to measure
4. Claude reports findings with data
5. You implement fixes
6. Repeat until metrics are good
```

---

## Part 7: Advanced Topics

### Custom Performance Traces

Ask Claude:

```
Use DevTools MCP to create a custom performance trace:
1. Start tracing
2. Trigger the "Load Unoptimized Images" button
3. Wait for all images to load
4. Stop tracing
5. Analyze the trace for:
   - Image load timing
   - Layout recalculations
   - Paint operations
6. Report findings
```

### Network Throttling Scenarios

Ask Claude:

```
Use DevTools MCP to test different network conditions:
1. Test at "Slow 4G" speed
2. Test at "Fast 3G" speed
3. Test at regular desktop speed
4. Compare metrics across all three
5. Tell me where performance degrades
```

### Accessibility Analysis

Ask Claude:

```
Use DevTools MCP to analyze accessibility:
1. Check color contrast ratios
2. Look for missing alt text
3. Verify heading hierarchy
4. Check for keyboard navigation issues
5. Generate an accessibility report
```

---

## Troubleshooting

### "DevTools MCP Not Connecting"

**Solution:**
1. Make sure Chrome is running with `--remote-debugging-port=9222`
2. Check that the port isn't already in use: `lsof -i :9222`
3. Restart Chrome and try again

### "Cannot Navigate to URL"

**Solution:**
1. Make sure the app is actually running at that URL
2. Try navigating to it manually in the Chrome window first
3. Check for firewall/proxy issues

### "Performance Metrics Are Slow"

**Solution:**
1. Make sure other tabs aren't using resources
2. Close extensions that might affect performance
3. Use incognito mode for cleaner measurements
4. Clear cache for consistent results

---

## Next Steps

1. **Explore the debug app** - Try all 5 issue buttons
2. **Run full audits** - Ask Claude to audit completely
3. **Test on mobile** - Use viewport resizing and throttling
4. **Check real apps** - Use DevTools MCP on your own projects
5. **Optimize based on data** - Let metrics guide your fixes

---

## Key Takeaways

- DevTools MCP = Automated debugging and performance analysis
- Claude can see your app's real state and metrics
- No more manual screenshot/copy/paste workflow
- Data-driven optimization recommendations
- Faster feedback loop for performance work
- Works on any web app (your own, or public sites)

This is how modern, efficient debugging and optimization works with AI-assisted development!

