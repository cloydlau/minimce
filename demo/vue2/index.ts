import Vue from 'vue'
import App from './index.vue'

import VCA from '@vue/composition-api'
Vue.use(VCA)

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

import useMiniMCE from './useMiniMCE'
useMiniMCE(Vue)

new Vue({
  render: h => h(App),
}).$mount('#app')
