#!/usr/bin/env node

/**
 * Build optimization script for Vendura application
 * 
 * This script analyzes the build output and optimizes it further
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('Optimizing build output...');

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run build first.');
  process.exit(1);
}

try {
  // Get the size of the dist directory before optimization
  const getSizeInMB = (directory) => {
    // Cross-platform directory size calculation
    let totalSize = 0;
    
    function calculateSize(dirPath) {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          calculateSize(fullPath);
        } else if (entry.isFile()) {
          const { size } = fs.statSync(fullPath);
          totalSize += size;
        }
      }
    }
    
    calculateSize(directory);
    return totalSize / (1024 * 1024); // Convert bytes to MB
  };
  
  const initialSize = getSizeInMB(distDir);
  console.log(`Initial build size: ${initialSize.toFixed(2)} MB`);
  
  // Remove source maps if they exist (should not be in production, but just in case)
  const sourceMapFiles = findFiles(distDir, '.map');
  if (sourceMapFiles.length > 0) {
    console.log(`Removing ${sourceMapFiles.length} source map files...`);
    sourceMapFiles.forEach(file => {
      fs.unlinkSync(file);
    });
  }
  
  // Remove any leftover license comments that might have been included
  const jsFiles = findFiles(distDir, '.js');
  console.log(`Processing ${jsFiles.length} JavaScript files...`);
  
  jsFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove license comments (simple approach, might need refinement)
    content = content.replace(/\/\*![\s\S]*?\*\//g, '');
    
    // Remove empty lines
    content = content.replace(/^\s*[\r\n]/gm, '');
    
    fs.writeFileSync(file, content);
  });
  
  // Get the final size
  const finalSize = getSizeInMB(distDir);
  const savedSize = initialSize - finalSize;
  const savedPercentage = (savedSize / initialSize) * 100;
  
  console.log(`Final build size: ${finalSize.toFixed(2)} MB`);
  console.log(`Saved: ${savedSize.toFixed(2)} MB (${savedPercentage.toFixed(2)}%)`);
  
  console.log('✅ Build optimization completed successfully!');
} catch (error) {
  console.error('❌ Build optimization failed:', error.message);
  process.exit(1);
}

/**
 * Find files with a specific extension in a directory (recursive)
 * @param {string} directory - The directory to search in
 * @param {string} extension - The file extension to look for
 * @returns {string[]} Array of file paths
 */
function findFiles(directory, extension) {
  const files = [];
  
  function traverse(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(directory);
  return files;
} 