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
    // Plugin to copy configuration files
    {
      name: 'copy-config-files',
      writeBundle() {
        const __dirname = fileURLToPath(new URL('.', import.meta.url))
        const filesToCopy = [
          { src: 'public/web.config', dest: 'dist/web.config' },
          { src: 'public/.htaccess', dest: 'dist/.htaccess' },
          { src: 'public/env.js', dest: 'dist/env.js' },
          { src: 'public/env-company.js', dest: 'dist/env-company.js' }
        ]
        
        filesToCopy.forEach(({ src, dest }) => {
          try {
            copyFileSync(resolve(__dirname, src), resolve(__dirname, dest))
          } catch {
            // Silently skip missing files
          }
        })
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
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    sourcemap: mode === 'development',
    target: 'es2015',
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
