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
  fileTypeCatalog: {
    word: {
      accept: '.docx',
    },
  }
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

const eventBus = new Vue()
export { eventBus } // 用于其它组件与Minimce进行通信

//import '../dist/style.css'
//import Minimce from '../dist/minimce.umd.min.js'
import Minimce from '../src/main.ts'
//import { jsonToFormData } from 'kayran'
import { getAxiosShortcut } from 'admate'
const { POST } = getAxiosShortcut(axios)

Vue.use(Minimce, {
  apiKey: '',
  plan: 'essential',
  Imgpond,
  Filepool,
  MobileLink: () => import('./MobileLink.vue'),
  eventBus,
  tinymceOptions: {
    images_upload_handler (blobInfo, success, failure, progress) {
      // img的src为blob或base64时触发
      console.log('images_upload_handler', blobInfo)
      const blob = blobInfo.blob()
      const file = new File(
        [blob],
        blobInfo.filename(),
        { type: blob.type }
      )

      POST.upload(process.env.VUE_APP_UPLOAD_API, {
        domainId: 0,
        dir: 'img',
        file
      }, {
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

      /*axios.post(
        process.env.VUE_APP_UPLOAD_API,
        jsonToFormData({
          domainId: 0,
          dir: 'img',
          file
        }), {
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
      })*/
    },
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
