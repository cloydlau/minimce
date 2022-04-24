import type { UserConfigExport, ConfigEnv } from 'vite'
import { name } from './package.json'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    server: {
      port: 3003
    },
    optimizeDeps: {
      exclude: ['vue-demi']
    },
    plugins: [
      vue(),
      {
        name: 'html-transform',
        transformIndexHtml (html: string) {
          return html.replace(/{{.*}}/, `/demo/vue3/index.ts`)
        },
      },
    ],
  }
}
