const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Intentionally slow API endpoint
app.get('/api/slow', (req, res) => {
  console.log('Slow API endpoint called - delaying response by 3 seconds');

  // Simulate slow database query or processing
  setTimeout(() => {
    res.json({
      status: 'success',
      message: 'This response took 3 seconds intentionally to demonstrate slow API issues',
      timestamp: new Date().toISOString(),
      duration: '3000ms',
    });
  }, 3000);
});

// Fast API endpoint for comparison
app.get('/api/fast', (req, res) => {
  res.json({
    status: 'success',
    message: 'This response is fast',
    timestamp: new Date().toISOString(),
    duration: '50ms',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
========================================
Debug Demo App Server
========================================
Server running at: http://localhost:${PORT}
Open this in your browser to see the demo

Instructions:
1. Open Chrome DevTools (F12 or Cmd+Option+I)
2. Try each button to trigger different issues
3. Watch the Console, Network, and Performance tabs
4. See ISSUES.md for detailed issue descriptions
========================================
  `);
});
