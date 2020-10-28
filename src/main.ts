import Minimce from './RichText.vue'
import { init } from './config'

interface installInterface {
  installed?: boolean

  (Vue: any, opts?: object): void
}

const install: installInterface = (Vue, opts) => {
  if (install.installed) {
    return
  }
  init(opts)
  Vue.component(Minimce.name, Minimce)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// @ts-ignore
Minimce.install = install

export default Minimce

// todo: deprecated
export {
  Minimce
}

