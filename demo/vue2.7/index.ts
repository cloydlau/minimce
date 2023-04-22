import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import App from './index.vue'
import useMiniMCE from './useMiniMCE'

Vue.use(ElementUI)
useMiniMCE()

new Vue({
  render: h => h(App),
}).$mount('#app')
