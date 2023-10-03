import vue from '@vitejs/plugin-vue'
import { version } from 'vue'
import dts from 'vite-plugin-dts'
import { parse } from 'semver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
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
    AutoImport({
      // targets to transform
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      // global imports to register
      imports: [
        // presets
        (major === 3 || (major === 2 && minor >= 7)) ? 'vue' : '@vue/composition-api',
      ],
    }),
    Components(),
    dts({ rollupTypes: true }),
    vue(),
  ],
}
