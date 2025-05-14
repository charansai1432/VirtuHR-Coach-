import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // Where to build the production files
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },

  // For development only
  ...(mode === 'development' && {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }),

  // Optimize deps
  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  // Base path (important for static hosting like Render)
  base: './',
}));
