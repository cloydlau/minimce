import Vue from 'vue'
import App from './index.vue'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

import axios from 'axios'
const request = axios.create()
request.interceptors.response.use(response => response.config.method.toUpperCase() === 'HEAD' ? response : response.data)

import Filepool from 'filepool'
Vue.use(Filepool, {
  upload ({ file, jsonToFormData, }) {
    return new Promise((resolve, reject) => {
      request({
        url: '',
        method: 'POST',
        data: jsonToFormData({
          file,
          domainId: 4,
          dir: 'video'
        }),
      }).then(res => {
        if (typeof res?.data === 'string') {
          resolve(res.data)
        } else {
          reject(res.message)
        }
      }).catch(e => {
        reject(e)
      })
    })
  },
})

import Imgpond from 'imgpond'
Vue.use(Imgpond)

import { eventBus } from 'plain-kit'
Vue.use(eventBus)

//import Minimce from '../dist/minimce.umd.js'
import Minimce from '../src/main.ts'

Vue.use(Minimce, {
  apiKey: '',
  html2text: true,
  textMaxlength: 10,
  audioMenuItem: false,
  Imgpond,
  Filepool,
  MobileLink: () => import('./MobileLink.vue'),
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
