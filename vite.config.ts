import { createVuePlugin as vue } from 'vite-plugin-vue2'
import type { ConfigEnv, UserConfigExport } from 'vite'
import { version } from 'vue'
import dts from 'vite-plugin-dts'
import { parse } from 'semver'
import { PascalCasedName, name } from './package.json'

const { major, minor } = parse(version)

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    optimizeDeps: {
      exclude: ['vue-demi'],
    },
    build: {
      lib: {
        name,
        entry: 'src/index.ts',
      },
      sourcemap: true,
      rollupOptions: {
        external: [
          'tinymce',
          'vue',
          'vue-demi',
        ],
        output: {
          globals: {
            [name]: PascalCasedName,
            'tinymce': 'TinyMCE',
            'vue': 'Vue',
            'vue-demi': 'VueDemi',
          },
        },
      },
    },
    plugins: [
      {
        name: 'html-transform',
        transformIndexHtml(html: string) {
          return html.replace(/\{\{NAME\}\}/, name).replace(/\{\{VUE_VERSION\}\}/g, String(major === 3 ? major : `${major}.${minor}`))
        },
      },
      vue(),
      dts(),
    ],
  }
}
