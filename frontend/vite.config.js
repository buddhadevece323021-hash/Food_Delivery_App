import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,       // ✅ Forces Vite to actively check for file changes
      interval: 100,          // Check every 100 ms
    },
    hmr: {
      overlay: true,          // Show errors directly in the browser
    },
  },
})
