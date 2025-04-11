#!/usr/bin/env node

/**
 * Bundle size report generator for Vendura application
 * 
 * This script analyzes the build output and generates a report of bundle sizes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('Generating bundle size report...');

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run build first.');
  process.exit(1);
}

try {
  // Get all files in the dist directory recursively
  const files = getAllFiles(distDir);
  
  // Group files by type
  const filesByType = {};
  let totalSize = 0;
  
  files.forEach(file => {
    const stats = fs.statSync(file);
    const size = stats.size;
    totalSize += size;
    
    const ext = path.extname(file).toLowerCase();
    if (!filesByType[ext]) {
      filesByType[ext] = {
        count: 0,
        size: 0,
        files: []
      };
    }
    
    filesByType[ext].count++;
    filesByType[ext].size += size;
    filesByType[ext].files.push({
      path: path.relative(distDir, file),
      size
    });
  });
  
  // Sort files by size within each type
  Object.keys(filesByType).forEach(ext => {
    filesByType[ext].files.sort((a, b) => b.size - a.size);
  });
  
  // Generate report
  const report = {
    totalSize,
    totalFiles: files.length,
    filesByType: Object.keys(filesByType).map(ext => ({
      extension: ext || 'no-extension',
      count: filesByType[ext].count,
      size: filesByType[ext].size,
      percentage: (filesByType[ext].size / totalSize) * 100,
      largestFiles: filesByType[ext].files.slice(0, 5).map(file => ({
        path: file.path,
        size: file.size,
        sizeFormatted: formatSize(file.size)
      }))
    })).sort((a, b) => b.size - a.size)
  };
  
  // Add formatted sizes
  report.totalSizeFormatted = formatSize(report.totalSize);
  report.filesByType.forEach(type => {
    type.sizeFormatted = formatSize(type.size);
  });
  
  // Write report to file
  const reportFile = path.join(distDir, 'bundle-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  // Generate HTML report
  const htmlReport = generateHtmlReport(report);
  const htmlReportFile = path.join(distDir, 'bundle-report.html');
  fs.writeFileSync(htmlReportFile, htmlReport);
  
  console.log(`✅ Bundle size report generated successfully!`);
  console.log(`Report saved to: ${reportFile}`);
  console.log(`HTML report saved to: ${htmlReportFile}`);
  console.log(`Total bundle size: ${report.totalSizeFormatted}`);
} catch (error) {
  console.error('❌ Bundle size report generation failed:', error.message);
  process.exit(1);
}

/**
 * Get all files in a directory recursively
 * @param {string} dir - The directory to search
 * @returns {string[]} Array of file paths
 */
function getAllFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Format file size in a human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Generate an HTML report from the bundle size data
 * @param {Object} report - The bundle size report
 * @returns {string} HTML report
 */
function generateHtmlReport(report) {
  const fileTypeRows = report.filesByType.map(type => `
    <tr>
      <td>${type.extension}</td>
      <td>${type.count}</td>
      <td>${type.sizeFormatted}</td>
      <td>${type.percentage.toFixed(2)}%</td>
    </tr>
  `).join('');
  
  const fileDetailSections = report.filesByType.map(type => {
    const fileRows = type.largestFiles.map(file => `
      <tr>
        <td>${file.path}</td>
        <td>${file.sizeFormatted}</td>
      </tr>
    `).join('');
    
    return `
      <div class="file-type-section">
        <h3>${type.extension} (${type.sizeFormatted})</h3>
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            ${fileRows}
          </tbody>
        </table>
      </div>
    `;
  }).join('');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vendura Bundle Size Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    tr:hover {
      background-color: #f5f5f5;
    }
    .summary {
      background-color: #e8f4f8;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .file-type-section {
      margin-bottom: 30px;
    }
    .chart-container {
      width: 100%;
      height: 400px;
      margin-bottom: 30px;
    }
  </style>
</head>
<body>
  <h1>Vendura Bundle Size Report</h1>
  
  <div class="summary">
    <h2>Summary</h2>
    <p>Total bundle size: <strong>${report.totalSizeFormatted}</strong></p>
    <p>Total files: <strong>${report.totalFiles}</strong></p>
  </div>
  
  <h2>File Types</h2>
  <table>
    <thead>
      <tr>
        <th>Extension</th>
        <th>Count</th>
        <th>Size</th>
        <th>Percentage</th>
      </tr>
    </thead>
    <tbody>
      ${fileTypeRows}
    </tbody>
  </table>
  
  <h2>Largest Files by Type</h2>
  ${fileDetailSections}
  
  <script>
    // Add timestamp to the report
    document.body.innerHTML += '<p>Report generated on: ' + new Date().toLocaleString() + '</p>';
  </script>
</body>
</html>
  `;
} 