import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    port: 5000,
  },
  base: '/base/',
  build: {
    rollupOptions: {
      output: {
        // Custom chunking strategy
        manualChunks(id) {
          // Example: Split libraries from node_modules into a separate chunk
          if (id.includes('node_modules')) {
            return 'vendor'; // This will bundle all vendor dependencies into a separate chunk
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,  // Increase the chunk size limit if necessary
  },
});
