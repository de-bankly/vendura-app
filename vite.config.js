import MillionLint from "@million/lint";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import faroUploader from '@grafana/faro-rollup-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
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
      apiKey: process.env.GRAFANA_API_KEY,
      gzipContents: true,
    })
  ],
});
