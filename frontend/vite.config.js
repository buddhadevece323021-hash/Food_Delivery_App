import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['generally-startup-theorem-zum.trycloudflare.com'],
    watch: {
      usePolling: true,       // ✅ Forces Vite to actively check for file changes
      interval: 100,          // Check every 100 ms
    },
    hmr: {
      overlay: true,          // Show errors directly in the browser
    },
  },
})
