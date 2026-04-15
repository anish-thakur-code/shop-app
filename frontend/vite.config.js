import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://shop-app-1-l1m7.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});