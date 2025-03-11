#!/usr/bin/env node

/**
 * Deployment script for Vendura application
 * 
 * This script handles deploying the application to different environments
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// Get the environment from command line arguments or default to production
const args = process.argv.slice(2);
const envArg = args.find(arg => arg.startsWith('--env='));
const env = envArg ? envArg.split('=')[1] : 'production';

console.log(`Preparing deployment for ${env} environment...`);

// Validate environment
const validEnvs = ['development', 'staging', 'production'];
if (!validEnvs.includes(env)) {
  console.error(`Error: Invalid environment "${env}". Valid options are: ${validEnvs.join(', ')}`);
  process.exit(1);
}

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run build first.');
  process.exit(1);
}

try {
  // Build the application for the specified environment if --build flag is provided
  if (args.includes('--build')) {
    console.log(`Building application for ${env} environment...`);
    const buildPath = path.join(__dirname, 'build.js');
    execSync(`node "${buildPath}" --env=${env}`, { stdio: 'inherit' });
  }
  
  // Generate deployment configuration
  console.log('Generating deployment configuration...');
  const deployConfigPath = path.join(__dirname, 'deploy-config.js');
  execSync(`node "${deployConfigPath}" --env=${env}`, { stdio: 'inherit' });
  
  // Create a .env file for the deployment environment
  console.log('Creating deployment environment file...');
  const envFile = path.join(rootDir, `.env.${env}`);
  const deployEnvFile = path.join(distDir, '.env');
  
  if (fs.existsSync(envFile)) {
    fs.copyFileSync(envFile, deployEnvFile);
  } else {
    console.warn(`Warning: .env.${env} file not found. Skipping environment file creation.`);
  }
  
  // Create a deployment info file
  console.log('Creating deployment info file...');
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const deploymentInfo = {
    name: packageJson.name,
    version: packageJson.version,
    environment: env,
    deploymentDate: new Date().toISOString(),
    deployedBy: process.env.USERNAME || process.env.USER || 'unknown',
  };
  
  fs.writeFileSync(
    path.join(distDir, 'deployment-info.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  // Simulate deployment based on environment
  console.log(`Deploying to ${env} environment...`);
  
  switch (env) {
    case 'development':
      console.log('Simulating development deployment...');
      // In a real scenario, this might copy files to a development server
      break;
      
    case 'staging':
      console.log('Simulating staging deployment...');
      // In a real scenario, this might upload to a staging server or cloud environment
      break;
      
    case 'production':
      console.log('Simulating production deployment...');
      // In a real scenario, this might deploy to a production CDN or cloud environment
      break;
  }
  
  console.log(`✅ Deployment to ${env} environment completed successfully!`);
} catch (error) {
  console.error(`❌ Deployment to ${env} environment failed:`, error.message);
  process.exit(1);
} 