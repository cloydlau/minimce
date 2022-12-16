import type { ConfigEnv, UserConfigExport } from 'vite'
import dts from 'vite-plugin-dts'
import { PascalCasedName, name } from './package.json'

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
    plugins: [dts()],
  }
}
