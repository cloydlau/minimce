import Vue from 'vue'
import App from './index.vue'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

import useMiniMCE from './useMiniMCE'
useMiniMCE()

new Vue({
  render: h => h(App),
}).$mount('#app')
