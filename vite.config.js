import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@emotion'] // ✅ Enable Emotion classNames and style labels
      }
    })
  ],
  server: {
    port: 3003, // Change if port 3000 is in use
    open: true, // Automatically opens in the browser
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001', // Backend API URL
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      usePolling: true, // Optional for some environments like WSL or Docker
    },
  },
});
