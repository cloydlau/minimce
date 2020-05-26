import Vue from 'vue'
import App from './index.vue'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

//使用视频上传时需要注册
import Filepool from 'filepool'
Vue.use(Filepool)

//使用图片上传/音频上传时需要注册
import Imgpond from 'imgpond'
Vue.use(Imgpond)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
