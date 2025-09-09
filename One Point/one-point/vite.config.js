import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Plugin to copy web.config for IIS deployment
    {
      name: 'copy-web-config',
      writeBundle() {
        try {
          copyFileSync(
            resolve(__dirname, 'public/web.config'),
            resolve(__dirname, 'dist/web.config')
          )
        } catch (error) {
          console.warn('web.config not found in public folder, skipping copy')
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification (using default esbuild)
    minify: 'esbuild'
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
