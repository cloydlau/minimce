const path = require('path')

const externals = process.env.NODE_ENV === 'development' ? {} : {
  "axios": "axios",
  "element-ui": "element-ui",
  "filepool": "filepool",
  "imgpond": "imgpond",
  "pic-viewer": "pic-viewer",
  "plain-kit": "plain-kit",
  'vue': 'vue'
}

module.exports = {
  pages: {
    index: {
      entry: 'demo/main.js',
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
    },
    externals
  }
}
