import MillionLint from "@million/lint";
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import faroUploader from '@grafana/faro-rollup-plugin';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { splitVendorChunkPlugin } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '');
  
  // Determine if bundle analysis is enabled
  const isAnalyze = process.env.ANALYZE === 'true';
  const isProd = mode === 'production';
  
  const plugins = [
    MillionLint.vite({
      rsc: true,
      optimizeDOM: true,
    }),
    react(),
    faroUploader({
      appName: 'vendura',
      endpoint: 'https://faro-api-prod-eu-west-2.grafana.net/faro/api/v1',
      appId: 'vendura',
      stackId: '1194984',
      apiKey: env.GRAFANA_API_KEY,
      gzipContents: true,
    }),
    // Split vendor chunks for better caching
    splitVendorChunkPlugin()
  ];
  
  // Add compression plugins for production builds
  if (isProd) {
    // Gzip compression
    plugins.push(
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
      })
    );
    
    // Brotli compression (better than gzip but not supported by all browsers)
    plugins.push(
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
      })
    );
  }
  
  // Add visualizer plugin if analysis is enabled
  if (isAnalyze) {
    plugins.push(
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    );
  }
  
  return {
    plugins,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      // Optimize build output
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
          pure_funcs: isProd ? ['console.log', 'console.debug', 'console.info'] : [],
        },
      },
      // Split chunks for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          },
          // Add hashes to file names for cache busting
          entryFileNames: isProd ? 'assets/[name].[hash].js' : 'assets/[name].js',
          chunkFileNames: isProd ? 'assets/[name].[hash].js' : 'assets/[name].js',
          assetFileNames: isProd ? 'assets/[name].[hash].[ext]' : 'assets/[name].[ext]',
        },
      },
      // Generate source maps for development only
      sourcemap: mode !== 'production',
      // Reduce chunk size warnings threshold
      chunkSizeWarningLimit: 1000,
      // Optimize CSS
      cssCodeSplit: true,
      // Optimize images
      assetsInlineLimit: 4096, // 4kb
    },
    // Environment-specific settings
    server: {
      port: 3000,
      open: true,
      cors: true,
    },
    // Add preview server configuration
    preview: {
      port: 4173,
      open: true,
    },
  };
});
