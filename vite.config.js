import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://fresh-mart-1-x8e6.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
