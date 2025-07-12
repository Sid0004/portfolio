import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  build: {
    outDir: 'dist', // optional, this is the default
  },
  // ✅ Only needed during `npm run dev`
  server: {
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
})
