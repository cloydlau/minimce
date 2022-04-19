import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import GlobPlugin from 'vite-plugin-glob'
const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3003
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    }
  },
  plugins: [
    GlobPlugin({
      takeover: true,
    }),
    vue(),
  ],
})
