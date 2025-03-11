#!/usr/bin/env node

/**
 * Bundle analyzer script for Vendura application
 * 
 * This script builds the application with bundle analysis enabled
 */

import { execSync } from 'child_process';

console.log('Building with bundle analysis...');

try {
  // Set environment variable to enable bundle analysis
  process.env.ANALYZE = 'true';
  
  // Run the build with bundle analysis
  execSync('vite build --mode production', { 
    stdio: 'inherit',
    env: { ...process.env, ANALYZE: 'true' }
  });
  
  console.log('✅ Bundle analysis completed!');
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
} 