# 3.2: Chrome DevTools MCP Demo

## What is Chrome DevTools MCP?

Chrome DevTools MCP is an MCP (Model Context Protocol) server that gives Claude Code access to Chrome Developer Tools capabilities. It enables Claude to:

- Take screenshots of web pages
- Inspect the DOM and element hierarchy
- Read console messages and errors
- Monitor network requests and responses
- Analyze performance metrics
- Measure Core Web Vitals (LCP, FID, CLS)
- Run performance traces
- Debug JavaScript errors

### The Power of DevTools MCP

Traditional debugging workflow:
1. Open DevTools manually
2. Screenshot or copy error messages
3. Paste them into Claude
4. Claude makes suggestions
5. You manually implement fixes

With DevTools MCP:
1. Claude directly accesses DevTools
2. Claude sees screenshots, network activity, console errors
3. Claude identifies performance issues automatically
4. Claude suggests specific, data-backed fixes
5. You verify and implement

Result: **Automated debugging and performance analysis** without manual context switching.

## Why It Matters

### Problem 1: Communication Gap
Without DevTools MCP, explaining a bug to Claude requires:
- Manually taking screenshots
- Copying console error messages
- Describing what you see
- Risk of misunderstanding

With DevTools MCP:
- Claude sees the exact state of your app
- No information loss
- Precise debugging

### Problem 2: Performance Blindness
Without DevTools MCP, performance issues are hard to diagnose:
- You manually run Lighthouse
- Copy results into Claude
- Hope Claude interprets them correctly
- Might miss root causes

With DevTools MCP:
- Claude directly measures Core Web Vitals
- Claude analyzes network waterfall
- Claude spots layout thrashing automatically
- Claude identifies bottlenecks with precision

### Problem 3: Slow Feedback Loop
Manual debugging is slow:
1. Observe issue
2. Manually check DevTools
3. Copy findings
4. Ask Claude
5. Implement suggestion
6. Repeat

With DevTools MCP:
1. Claude checks DevTools automatically
2. Claude analyzes findings instantly
3. Claude suggests fixes based on real data
4. Faster iteration

## How to Set It Up

### 1. Create the MCP Configuration

Update `.claude/settings.json`:

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

### 2. Have Chrome Running

Chrome DevTools MCP requires Chrome to be running with remote debugging enabled:

```bash
# On macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# On Linux
google-chrome --remote-debugging-port=9222

# On Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

Or use the default Chrome if you have the extension installed.

### 3. Start Claude Code

```bash
npx claude
```

Claude will automatically connect to the Chrome DevTools port and gain access to debugging capabilities.

## DevTools MCP Capabilities

### Screenshots
- Capture the current state of a web page
- Useful for context before analyzing issues
- Can zoom in on specific regions

### DOM Inspection
- Read the full page structure
- Find specific elements
- Check accessibility attributes

### Console Analysis
- Read console.log, console.error, console.warn
- See stack traces
- Identify JavaScript errors

### Network Monitoring
- Monitor all HTTP/HTTPS requests
- See request/response timing
- Analyze payload sizes
- Identify slow endpoints

### Performance Analysis
- Measure Core Web Vitals:
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
- Analyze JavaScript execution time
- Measure render performance

### Performance Traces
- Record detailed performance profiles
- Analyze frame timing
- Identify jank and stuttering
- Measure layout and paint operations

## What's in This Demo

### Sample Web App (`examples/debug-app/`)

A deliberately broken and slow web app with intentional issues:

1. **Performance Issues:**
   - Layout thrashing (repeated reflows)
   - Large unoptimized images
   - Synchronous JavaScript blocking rendering
   - Inefficient DOM queries

2. **Console Errors:**
   - Undefined variable references
   - Network request failures
   - Deprecation warnings
   - Unhandled promise rejections

3. **Network Problems:**
   - Slow API endpoints
   - Large response payloads
   - Waterfall blocking
   - Missing caching headers

### Audit Workflow (`examples/perf-audit/`)

A step-by-step guide for using DevTools MCP to audit performance:

1. Take screenshots of key pages
2. Measure Core Web Vitals
3. Analyze console for errors
4. Monitor network requests
5. Profile JavaScript execution
6. Document findings
7. Suggest optimizations

## Quick Start

1. Set up Chrome with remote debugging:
   ```bash
   google-chrome --remote-debugging-port=9222
   ```

2. Start Claude Code:
   ```bash
   npx claude
   ```

3. Ask Claude to debug the sample app:
   ```
   Navigate to http://localhost:3000 and use DevTools MCP to:
   1. Take a screenshot
   2. Check for console errors
   3. Analyze network requests
   4. Measure Core Web Vitals
   5. Report your findings
   ```

4. Claude will:
   - Automatically take screenshots
   - Read console errors
   - Analyze network activity
   - Measure performance
   - Suggest specific fixes

## Common Use Cases

### 1. Debug Broken Apps
```
My app is crashing on production. Can you use DevTools MCP to:
1. Take a screenshot to see the error
2. Check the console for error messages
3. Analyze network requests
4. Tell me what's broken
```

### 2. Optimize Performance
```
Users report my app is slow. Can you:
1. Measure Core Web Vitals
2. Check for layout thrashing
3. Analyze the network waterfall
4. Suggest specific optimizations
```

### 3. Debug Network Issues
```
API calls are failing. Can you use DevTools MCP to:
1. Monitor the network requests
2. Show me request/response details
3. Check for CORS errors
4. Identify the root cause
```

### 4. Analyze JavaScript Performance
```
Pages take 5 seconds to load. Can you:
1. Profile JavaScript execution
2. Find the slowest functions
3. Check for layout thrashing
4. Suggest optimizations
```

## Key Takeaways

- DevTools MCP = Direct access to Chrome debugging
- Claude can see your app's actual state
- Automated performance analysis
- Data-backed debugging recommendations
- Faster feedback loop
- No more manual screenshot sharing
- Real metrics, not guesses

## Next Steps

1. Set up Chrome remote debugging
2. Configure DevTools MCP in `.claude/settings.json`
3. Start debugging: `npx claude`
4. Ask Claude to analyze your app
5. Get precise, data-backed recommendations
6. Fix issues faster with automation

This is game-changing for performance optimization and debugging!
