import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import * as path from 'path'

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src')
        }
      },
    plugins: [react(), tailwindcss()],
    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://10.168.1.117:20770',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
            '/service': {
                target: 'http://10.168.1.117:20771',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/service/, '')
            }
        }
    },

})
