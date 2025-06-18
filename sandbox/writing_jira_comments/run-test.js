#!/usr/bin/env node

// Load environment variables from .env.local
require('dotenv').config({ path: '../../.env.local' });

// Run the test
require('./test-de-3417.js');