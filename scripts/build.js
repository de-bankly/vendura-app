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

// Get the environment from command line arguments or default to production
const args = process.argv.slice(2);
const envArg = args.find(arg => arg.startsWith('--env='));
const env = envArg ? envArg.split('=')[1] : 'production';

console.log(`Building for ${env} environment...`);

// Validate environment
const validEnvs = ['development', 'staging', 'production'];
if (!validEnvs.includes(env)) {
  console.error(`Error: Invalid environment "${env}". Valid options are: ${validEnvs.join(', ')}`);
  process.exit(1);
}

try {
  // Run the build with the specified environment
  execSync(`vite build --mode ${env}`, { stdio: 'inherit' });
  
  // Create a version.json file with build information
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const buildInfo = {
    version: packageJson.version,
    name: packageJson.name,
    buildDate: new Date().toISOString(),
    environment: env
  };
  
  fs.writeFileSync(
    path.join('dist', 'version.json'),
    JSON.stringify(buildInfo, null, 2)
  );
  
  console.log(`✅ Build completed successfully for ${env} environment!`);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 