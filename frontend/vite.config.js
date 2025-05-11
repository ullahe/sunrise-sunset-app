import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true
    },
  proxy: {
      '/api': {
        target: 'http://backend:4567', 
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})