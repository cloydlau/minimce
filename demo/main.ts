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
Vue.use(Imgpond, {
  request,
  url: '',
  param: {
    domainId: 2,
    dir: 'img',
  },
  poweredBy: 'element'
})

Vue.prototype.eventBus__ = new Vue({
  methods: {
    emit (event, ...args) {
      this.$emit(event, ...args)
    },
    on (event, callback) {
      this.$on(event, callback)
    },
    off (event, callback) {
      this.$off(event, callback)
    }
  }
})

//import '../dist/style.css'
//import Minimce from '../dist/minimce.umd.min.js'
import Minimce from '../src/main.ts'
import { jsonToFormData } from 'kayran'
Vue.use(Minimce, {
  apiKey: process.env.VUE_APP_API_KEY,
  html2text: true,
  textMaxlength: 10,
  audioMenuItem: false,
  Imgpond,
  Filepool,
  MobileLink: () => import('./MobileLink.vue'),
  tinymceOptions: {
    images_upload_handler (blobInfo, success, failure) {
      const blob = blobInfo.blob()
      const file = new File(
        [blob],
        blobInfo.filename(),
        { type: blob.type }
      )
      axios.post(
        process.env.VUE_APP_UPLOAD_API,
        jsonToFormData({
          domainId: 0,
          dir: 'img',
          file
        }),
        {
          headers: {
            'Authorization': process.env.VUE_APP_UPLOAD_API_TOKEN
          }
        }).then(res => {
        if (typeof res.data?.data === 'string') {
          success(res.data.data)
        } else {
          failure(res.data?.message)
        }
      }).catch(err => {
        failure(String(err))
      })
    },
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
