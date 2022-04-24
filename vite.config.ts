import type { UserConfigExport, ConfigEnv } from 'vite'
import { name } from './package.json'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    optimizeDeps: {
      exclude: ['vue-demi']
    },
    plugins: [
      {
        name: 'html-transform',
        transformIndexHtml (html: string) {
          return html.replace(/{{.*}}/, `/demo/vue3/index.ts`)
        },
      },
    ],
    build: {
      lib: {
        name,
        entry: 'src/index.ts'
      },
      rollupOptions: {
        external: [
          'tinymce',
          'vue',
          'vue-demi',
        ],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            'tinymce': 'TinyMCE',
            'vue': 'Vue',
            'vue-demi': 'VueDemi',
          }
        },
      }
    }
  }
}
