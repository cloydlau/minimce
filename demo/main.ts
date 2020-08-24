import Vue from 'vue'
import App from './index.vue'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

import Filepool from 'filepool'

Vue.use(Filepool)

import Imgpond from 'imgpond'

Vue.use(Imgpond)

import {EventBus} from 'plain-kit'

Vue.use(EventBus)

import Minimce from '../src/main.ts'
/*Vue.use(Minimce, {
  //tinymce api key
  apiKey: '',
  //是否开启html转普通文本功能
  html2text: true,
  //普通文本取自前多少个字符 可设置为false以获取全部内容
  textMaxlength: 10,
  audioMenuItem: false,
  Imgpond: Imgpond.Imgpond,
  Filepool: Filepool.Filepool,
  MobileLink: () => import('./MobileLink.vue'),
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')