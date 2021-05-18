import Minimce from './RichText.vue'
import { init } from './config'

/*import Vue from 'vue'
import ElementFormVerify from 'element-form-verify'
Vue.use(ElementFormVerify)*/

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
