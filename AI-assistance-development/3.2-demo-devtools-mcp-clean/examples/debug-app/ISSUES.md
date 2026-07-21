# Debug App: Intentional Issues

This demo app has 5 intentional issues planted for you to debug using Chrome DevTools and Claude Code.

## Issue 1: Layout Thrashing

**What it is:** Repeated, unnecessary DOM reads and writes that force the browser to recalculate layout multiple times.

**How to trigger:** Click "Trigger Layout Thrashing (Watch DevTools Performance)"

**Where to see it:**
- DevTools → Performance tab
- Click Record, trigger the issue, stop recording
- Look for long yellow bars (scripting) or purple bars (rendering)
- You'll see many "Recalculate Style" and "Layout" tasks

**The problem:**
```javascript
for (let i = 0; i < 100; i++) {
  const width = element.offsetWidth;  // Read (triggers layout calculation)
  element.style.width = (width + 1) + 'px';  // Write (modifies DOM)
  const height = element.offsetHeight;  // Read again (recalculates layout)
  element.style.height = (height + 1) + 'px';  // Write again
}
```

Each iteration forces a layout recalculation. This is ~100x slower than it should be.

**The fix:**
```javascript
// Read all layout properties first
const width = element.offsetWidth;
const height = element.offsetHeight;

// Then write all changes at once
element.style.width = (width + 100) + 'px';
element.style.height = (height + 100) + 'px';
```

**DevTools indicators:**
- Long Layout tasks
- Multiple Recalculate Style events
- Slow scripting time
- Low FPS or frame drops

---

## Issue 2: Undefined Variable Error

**What it is:** JavaScript code trying to access a property on an undefined variable.

**How to trigger:** Click "Trigger Console Error"

**Where to see it:**
- DevTools → Console tab
- You'll see a red error: `TypeError: Cannot read property 'property' of undefined`
- Stack trace shows the exact line

**The problem:**
```javascript
const result = undefinedVariable.property.method();
```

`undefinedVariable` doesn't exist. Trying to access `.property` on it causes an error.

**The fix:**
```javascript
// Check if variable exists first
if (typeof undefinedVariable !== 'undefined') {
  const result = undefinedVariable.property.method();
}

// Or use optional chaining (modern)
const result = undefinedVariable?.property?.method();
```

**DevTools indicators:**
- Red error message in Console
- Error icon next to script name
- Stack trace showing file and line number

---

## Issue 3: Slow Network Request

**What it is:** An API endpoint that takes 3+ seconds to respond.

**How to trigger:** Click "Make Slow API Request"

**Where to see it:**
- DevTools → Network tab
- Look for the request to `/api/slow`
- See the Timeline column shows ~3000ms
- Waterfall chart shows this request blocking subsequent requests

**The problem:**
```javascript
// Server-side
app.get('/api/slow', (req, res) => {
  setTimeout(() => {
    res.json({ data: 'finally here' });
  }, 3000); // Takes 3 seconds!
});
```

3 seconds is too long. Users waiting for this data have to sit and wait.

**The fix:**
```javascript
// 1. Optimize the database query or computation
// 2. Add caching (Redis, memcached)
// 3. Use pagination to return less data
// 4. Implement server-side rendering
// 5. Use CDN for static assets
```

**DevTools indicators:**
- Long blue bar in Network waterfall
- Response time > 1000ms
- Time to First Byte (TTFB) > 500ms
- Slow requests block page rendering

---

## Issue 4: Unoptimized Images

**What it is:** Large images without explicit dimensions, causing layout shift and slow loading.

**How to trigger:** Click "Load Unoptimized Images"

**Where to see it:**
- DevTools → Network tab (see image file sizes)
- Watch the page while images load (should see content shift)
- DevTools → Performance → Core Web Vitals (CLS - Cumulative Layout Shift)

**The problem:**
```html
<img
    src="https://via.placeholder.com/640x480?text=Image"
    alt="Placeholder"
    <!-- NO WIDTH/HEIGHT! -->
>
```

Without explicit dimensions, the browser doesn't know the image size. When the image loads, the page layout shifts.

**The fix:**
```html
<!-- Add width and height for aspect ratio lock -->
<img
    src="..."
    alt="..."
    width="640"
    height="480"
    style="aspect-ratio: 640/480"
>

<!-- Or use modern format with srcset for responsive -->
<img
    src="image-640.webp"
    srcset="image-1024.webp 1024w, image-640.webp 640w"
    sizes="(max-width: 600px) 100vw, 50vw"
    width="640"
    height="480"
    alt="Optimized image"
>
```

**DevTools indicators:**
- Large image files (>100KB)
- Missing width/height attributes
- CLS score > 0.1 (poor)
- Layout shift after images load

---

## Issue 5: Synchronous Blocking JavaScript

**What it is:** Long-running JavaScript code that blocks the main thread, freezing the UI.

**How to trigger:** Click "Run Blocking JavaScript"

**Where to see it:**
- UI should freeze for 2-3 seconds
- DevTools → Performance (main thread is completely blocked)
- DevTools → Console shows execution time

**The problem:**
```javascript
// This blocks the main thread for ~3 seconds
let sum = 0;
for (let i = 0; i < 500000000; i++) {
  sum += Math.sqrt(i);
}
```

The browser can't:
- Respond to user input (clicks, scrolls)
- Render updates
- Process other JavaScript
- Update animations

Everything is frozen.

**The fix:**
```javascript
// 1. Use Web Workers to run on separate thread
const worker = new Worker('worker.js');
worker.postMessage(data);
worker.onmessage = (e) => console.log(e.data);

// 2. Break work into chunks (requestAnimationFrame)
function heavyWork() {
  let sum = 0;
  const CHUNK_SIZE = 10000000;
  let i = 0;

  function processChunk() {
    const end = Math.min(i + CHUNK_SIZE, 500000000);
    while (i < end) {
      sum += Math.sqrt(i);
      i++;
    }

    if (i < 500000000) {
      requestAnimationFrame(processChunk);
    }
  }

  processChunk();
}

// 3. Use setTimeout for async execution
setTimeout(() => {
  // long running work
}, 0);
```

**DevTools indicators:**
- Long yellow bar (scripting) in Performance
- Main thread usage near 100% for extended time
- FPS drops to 0
- No animation frames during execution
- Slow response to input

---

## How to Debug with DevTools MCP

### For Issue 1 (Layout Thrashing):
```
In Claude Code, ask:
"Use DevTools MCP to take a performance trace of the 'Trigger Layout Thrashing' button
and tell me what's causing the excessive reflows."
```

### For Issue 2 (Error):
```
In Claude Code, ask:
"Use DevTools MCP to check the console for JavaScript errors and tell me
what's wrong with the 'Trigger Console Error' button."
```

### For Issue 3 (Slow API):
```
In Claude Code, ask:
"Use DevTools MCP to analyze the network requests when I trigger the slow API.
What's taking so long and how would you fix it?"
```

### For Issue 4 (Images):
```
In Claude Code, ask:
"Use DevTools MCP to measure the Cumulative Layout Shift (CLS) when images load.
Why is the layout shifting and how do I fix it?"
```

### For Issue 5 (Blocking JS):
```
In Claude Code, ask:
"Use DevTools MCP to take a performance profile of the blocking JavaScript button.
Why is the main thread frozen and what's a better approach?"
```

---

## Quick Reference: What to Watch in DevTools

| Issue | Console | Network | Performance | Elements |
|-------|---------|---------|-------------|----------|
| Layout Thrashing | Check for errors | N/A | Look for Layout tasks | Watch DOM changes |
| Undefined Error | Red errors | N/A | Long scripting | N/A |
| Slow API | N/A | >3000ms response | Long blocking | N/A |
| Unoptimized Images | N/A | Large files | CLS > 0.1 | Missing width/height |
| Blocking JS | Execution time log | N/A | Long scripting bar | N/A |

---

## Why This Matters

These aren't contrived examples. Real production code has these issues:
- **Layout thrashing:** jQuery DOM loops, React anti-patterns
- **Undefined errors:** Missing validation, bad API responses
- **Slow APIs:** Unoptimized databases, N+1 queries
- **Unoptimized images:** Common in content-heavy sites
- **Blocking JS:** Complex parsing, transpilation, initialization

By learning to spot and fix these with DevTools, you become much more productive at optimization and debugging.

---

## Next Steps

1. Start the debug app: `node server.js`
2. Open in browser: http://localhost:3000
3. Open DevTools (F12)
4. Trigger each issue and watch the different tabs
5. Use Claude Code with DevTools MCP to analyze
6. Follow the "How to Debug with DevTools MCP" section above

This is how modern, data-driven debugging works!
