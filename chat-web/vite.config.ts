import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/service': {
        target: 'http://10.168.1.128:20770',
        changeOrigin: true,
        bypass(req, res, options) {
          const proxyURL = options.target + options.rewrite(req.url);
          res.setHeader('x-req-proxyURL', proxyURL) // 将真实请求地址设置到响应头中
        },
        rewrite: (path) => path.replace(/^\/service/, '')
      }
    }
  },
})
