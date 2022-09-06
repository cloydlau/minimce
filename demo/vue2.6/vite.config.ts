import type { ConfigEnv, UserConfigExport } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    optimizeDeps: {
      exclude: ['vue-demi'],
    },
    plugins: [
      AutoImport(),
      createVuePlugin(),
      {
        name: 'html-transform',
        transformIndexHtml(html: string) {
          return html.replace(/\{\{VUE_VERSION\}\}/g, '2')
        },
      },
    ],
  }
}
