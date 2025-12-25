import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    strictPort: true,
    port: 5173
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    outDir: './dist',
    emptyOutDir: true
  }
})
