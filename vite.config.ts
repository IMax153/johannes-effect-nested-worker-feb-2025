import { defineConfig } from 'vite'

export default defineConfig({
  // Enable source maps for better debugging
  build: {
    sourcemap: true,
  },
  // Ensure worker files are properly handled
  worker: {
    format: 'es'
  },
  optimizeDeps: {
    // This ensures proper handling of worker dependencies
    exclude: ['@effect/platform-browser']
  }
}) 