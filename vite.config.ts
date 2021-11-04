import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import Unocss from 'unocss/vite'
import { name } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createVuePlugin(/*options*/),
    Unocss({ /* options */ }),
  ],
  build: {
    lib: {
      name,
      entry: 'src/main.ts'
    },
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: ['element-ui', 'tinymce', 'vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        },
        //inlineDynamicImports: true
      },
    }
  }
})
