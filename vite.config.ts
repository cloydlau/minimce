import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { name } from './package.json'
//import Unocss from 'unocss/vite'
//import { presetUno, presetAttributify } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  plugins: [
    vue(),
    /*Unocss({
      presets: [
        presetAttributify({ /!* options *!/ }),
        presetUno(),
        // ...other presets
      ]
    }),*/
  ],
  build: {
    lib: {
      name,
      entry: 'src/index.ts'
    },
    rollupOptions: {
      external: [
        'vue',
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          'vue': 'Vue',
        }
      },
    }
  }
})
