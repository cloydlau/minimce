import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import GlobPlugin from 'vite-plugin-glob'
const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3002
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    }
  },
  plugins: [
    /*GlobPlugin({
      takeover: true,
    }),*/
    createVuePlugin(),
  ],
})
