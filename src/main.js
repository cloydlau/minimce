import Minimce from './index.vue'

const install = Vue => {
  if (install.installed) {
    return
  }
  Vue.component(Minimce.name, Minimce)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  Minimce
}
