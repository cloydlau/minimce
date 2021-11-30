const path = require('path')

const externals = process.env.NODE_ENV === 'development' ? {} : {
  'element-ui': 'element-ui',
  'tinymce': 'tinymce',
  'vue': 'vue',
}

module.exports = {
  pages: {
    index: {
      entry: 'demo/main.ts',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  css: { extract: false },
  publicPath: './',
  outputDir: path.resolve(__dirname, './dist'),
  configureWebpack: {
    output: {
      filename: 'minimce.min.js',
      library: 'minimce',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      //libraryExport: 'default'
    },
    externals
  }
}
