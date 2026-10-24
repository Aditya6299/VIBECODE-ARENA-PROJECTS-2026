import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          // If port 5000 is open, it will route there; else falls back to 5001
          proxy.on('error', (err, req, res) => {
            console.warn('[Vite Proxy] Warning connecting to backend:', err.message);
          });
        }
      }
    }
  }
});
