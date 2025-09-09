import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // Plugin to copy web.config for IIS deployment
    {
      name: 'copy-web-config',
      writeBundle() {
        try {
          const __dirname = fileURLToPath(new URL('.', import.meta.url))
          copyFileSync(
            resolve(__dirname, 'public/web.config'),
            resolve(__dirname, 'dist/web.config')
          )
        } catch {
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
    minify: 'esbuild',
    // Source maps for production debugging (optional)
    sourcemap: mode === 'development',
    // Optimize for production
    target: 'es2015',
    // Ensure consistent build output
    emptyOutDir: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  // Define environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode)
  }
}))
