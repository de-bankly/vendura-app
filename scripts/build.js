#!/usr/bin/env node

/**
 * Build script for Vendura application
 * 
 * This script handles building the application for different environments
 * and performs additional optimizations.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the environment from command line arguments or default to production
const args = process.argv.slice(2);
const envArg = args.find(arg => arg.startsWith('--env='));
const env = envArg ? envArg.split('=')[1] : 'production';
const shouldOptimize = args.includes('--optimize') || env === 'production';

console.log(`Building for ${env} environment...`);

// Validate environment
const validEnvs = ['development', 'staging', 'production'];
if (!validEnvs.includes(env)) {
  console.error(`Error: Invalid environment "${env}". Valid options are: ${validEnvs.join(', ')}`);
  process.exit(1);
}

try {
  // Clean the dist directory if it exists
  const distDir = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    console.log('Cleaning dist directory...');
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  
  // Run the build with the specified environment
  console.log(`Running Vite build for ${env} environment...`);
  execSync(`vite build --mode ${env}`, { stdio: 'inherit' });
  
  // Generate runtime configuration
  console.log('Generating runtime configuration...');
  const deployConfigPath = path.join(__dirname, 'deploy-config.js');
  execSync(`node "${deployConfigPath}" --env=${env}`, { stdio: 'inherit' });
  
  // Create a version.json file with build information
  console.log('Creating version.json...');
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const buildInfo = {
    version: packageJson.version,
    name: packageJson.name,
    buildDate: new Date().toISOString(),
    environment: env
  };
  
  fs.writeFileSync(
    path.join(distDir, 'version.json'),
    JSON.stringify(buildInfo, null, 2)
  );
  
  // Run optimization for production builds
  if (shouldOptimize) {
    console.log('Running additional optimizations...');
    const optimizePath = path.join(__dirname, 'optimize.js');
    execSync(`node "${optimizePath}"`, { stdio: 'inherit' });
  }
  
  console.log(`✅ Build completed successfully for ${env} environment!`);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 