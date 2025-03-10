import MillionLint from "@million/lint";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    MillionLint.vite({
      rsc: true,
      optimizeDOM: true,
    }),
    react(),
  ],
});
