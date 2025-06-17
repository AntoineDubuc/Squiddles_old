#!/usr/bin/env node

/**
 * Simple HTTP server to serve the ticket display page
 * Handles CORS and static file serving for ticket visualization
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
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
  '.svg': 'image/svg+xml'
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
  let filePath = req.url === '/' ? '/ticket-display.html' : req.url;
  
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
  console.log('🎫 Jira Ticket Display Server Started!');
  console.log('');
  console.log(`📡 Server running at: http://${HOST}:${PORT}`);
  console.log(`🔍 Ticket display: http://${HOST}:${PORT}/ticket-display.html`);
  console.log(`📊 JSON data: http://${HOST}:${PORT}/ticket-display-data.json`);
  console.log('');
  console.log('📋 Available files:');
  console.log('   - ticket-display.html (Main display page)');
  console.log('   - ticket-display-data.json (Ticket data)');
  console.log('   - extract-ticket-for-display.js (Data extractor)');
  console.log('');
  console.log('💡 To refresh data: node extract-ticket-for-display.js');
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