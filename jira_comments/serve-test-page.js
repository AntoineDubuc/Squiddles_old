#!/usr/bin/env node

/**
 * Simple HTTP server to serve the ADF test page
 * Handles CORS and static file serving
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = 'localhost';

// MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xls': 'application/vnd.ms-excel',
  '.csv': 'text/csv',
  '.pdf': 'application/pdf'
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'text/plain';
}

function serveFile(res, filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      console.error(`❌ Error serving ${filePath}:`, err.message);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 - File Not Found: ${filePath}`);
      return;
    }
    
    const mimeType = getMimeType(filePath);
    console.log(`✅ ${filePath} (${data.length} bytes)`);
    res.writeHead(200, { 
      'Content-Type': mimeType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/test-adf-rendering.html' : req.url;
  
  // Remove query parameters
  filePath = filePath.split('?')[0];
  
  // Decode URL encoding (handles spaces and special characters)
  try {
    filePath = decodeURIComponent(filePath);
  } catch (error) {
    console.warn(`⚠️  Failed to decode URL: ${filePath}`);
  }
  
  // Security: prevent directory traversal
  if (filePath.includes('..')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 - Forbidden');
    return;
  }
  
  console.log(`📄 Serving: ${filePath}`);
  serveFile(res, filePath);
});

server.listen(PORT, HOST, () => {
  console.log('🚀 ADF Test Page Server Started!');
  console.log('');
  console.log(`📡 Server running at: http://${HOST}:${PORT}`);
  console.log(`🔍 Test page: http://${HOST}:${PORT}/test-adf-rendering.html`);
  console.log(`📊 JSON data: http://${HOST}:${PORT}/test-data-examples-2025-06-17.json`);
  console.log('');
  console.log('📋 Available files:');
  console.log('   - test-adf-rendering.html (Main test page)');
  console.log('   - test-data-examples-2025-06-17.json (Test data)');
  console.log('   - find-data-type-examples.js (Data finder script)');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error(`   Try running: lsof -ti:${PORT} | xargs kill`);
  } else {
    console.error('❌ Server error:', err);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});