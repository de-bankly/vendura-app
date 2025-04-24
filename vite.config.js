import { resolve } from 'path';
import { fileURLToPath, URL } from 'url';

import faroUploader from '@grafana/faro-rollup-plugin';
import MillionLint from '@million/lint';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { VitePWA } from 'vite-plugin-pwa';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  // Using empty string prefix to also load variables without VITE_ prefix
  // Using '' for mode will load the .env file instead of .env.{mode}
  const env = loadEnv('', __dirname, '');

  // Determine if bundle analysis is enabled
  const isAnalyze = env.ANALYZE === 'true';
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
    splitVendorChunkPlugin(),
    // Add PWA support
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Vendura App',
        short_name: 'Vendura',
        description: 'Vendura Banking Application',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MiB (increased from default 2 MiB)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.vendura\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },
    }),
  ];

  // Add image optimization for production builds
  if (isProd) {
    plugins.push(
      ViteImageOptimizer({
        png: {
          quality: 80,
        },
        jpeg: {
          quality: 80,
        },
        jpg: {
          quality: 80,
        },
        webp: {
          lossless: true,
        },
        avif: {
          lossless: true,
        },
        cache: true,
        cacheLocation: resolve(__dirname, 'node_modules/.vite-image-optimizer-cache'),
      })
    );

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
