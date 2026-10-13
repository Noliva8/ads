import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@emotion'] // ✅ Enable Emotion classNames and style labels
      }
    }),
       visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    port: 3003, // Change if port 3000 is in use
    strictPort: true,
    open: true, // Automatically opens in the browser
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 3003,
    },
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001', // Backend API URL
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    watch: {
      usePolling: true, // Optional for some environments like WSL or Docker
    },
  },
});
