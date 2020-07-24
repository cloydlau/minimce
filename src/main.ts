import RichText from './RichText.vue'
import {init} from './config.ts'

const install = (Vue, opts) => {
  if (install.installed) {
    return
  }
  init(opts)
  Vue.component('Minimce', RichText)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  RichText
}
