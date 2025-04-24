#!/usr/bin/env node

/**
 * Deploy configuration script for Vendura application
 *
 * This script generates environment-specific configuration files for deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the environment from command line arguments or default to production
const args = process.argv.slice(2);
const envArg = args.find(arg => arg.startsWith('--env='));
const env = envArg ? envArg.split('=')[1] : 'production';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log(`Generating deployment configuration for ${env} environment...`);

// Validate environment
const validEnvs = ['development', 'staging', 'production'];
if (!validEnvs.includes(env)) {
  console.error(`Error: Invalid environment "${env}". Valid options are: ${validEnvs.join(', ')}`);
  process.exit(1);
}

try {
  // Read the environment variables from the .env file (not environment-specific)
  const envFile = path.join(rootDir, `.env`);

  // Check if the env file exists
  if (!fs.existsSync(envFile)) {
    console.error(`Error: Environment file not found: ${envFile}`);
    console.log(`Creating empty configuration for ${env} environment...`);

    // Create an empty config if the file doesn't exist
    const configFile = path.join(distDir, 'runtime-config.json');
    fs.writeFileSync(configFile, JSON.stringify({}, null, 2));

    console.log(`✅ Empty deployment configuration generated at ${configFile}`);
    process.exit(0);
  }

  const envContent = fs.readFileSync(envFile, 'utf8');

  // Parse the environment variables
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, value] = trimmedLine.split('=');
      if (key && value) {
        // Only include VITE_ prefixed variables for client-side use
        if (key.startsWith('VITE_')) {
          envVars[key] = value;
        }
      }
    }
  });

  // Create runtime-config.json in the dist directory
  const configFile = path.join(distDir, 'runtime-config.json');
  fs.writeFileSync(configFile, JSON.stringify(envVars, null, 2));

  console.log(`✅ Deployment configuration generated successfully at ${configFile}`);
} catch (error) {
  console.error('❌ Failed to generate deployment configuration:', error.message);
  process.exit(1);
}
