import vue from '@vitejs/plugin-vue'
import { version } from 'vue'
import dts from 'vite-plugin-dts'
import { parse } from 'semver'
import { PascalCasedName, name } from './package.json'

const { major, minor } = parse(version)

export default {
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
    dts({ rollupTypes: true }),
    vue(),
  ],
}
