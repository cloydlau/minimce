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
        url: process.env.VUE_APP_UPLOAD_API,
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
  },
})

const eventBus = new Vue()
export { eventBus } // 用于其它组件与Minimce进行通信

//import '../dist/style.css'
//import Minimce from '../dist/minimce.umd.min.js'
import Minimce from '../src/main.ts'
import * as ImageInsertion from './ImageInsertion/index.js'
import * as FileInsertion from './FileInsertion/index.js'
import * as MobileLink from './MobileLink/index.js'
//import { jsonToFormData } from 'kayran'
import createAxiosShortcut from 'axios-shortcut'
const { POST } = createAxiosShortcut(axios)

Vue.use(Minimce, {
  apiKey: '',
  plan: 'custom',
  eventBus,
  tinymceOptions: {
    menu: {
      insert: {
        items: 'localimage localvideo localaudio docx | link mobilelink tel | template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime'
      },
    },
    setup: editor => {
      ImageInsertion.init()
      editor.ui.registry.addMenuItem('localimage', {
        text: '图片',
        icon: 'image',
        onAction: () => {
          ImageInsertion.open()
        }
      })

      FileInsertion.init()
      editor.ui.registry.addMenuItem('localaudio', {
        text: '音频',
        icon: 'arrow-right',
        onAction: () => {
          FileInsertion.open({
            type: 'audio'
          })
        }
      })
      editor.ui.registry.addMenuItem('localvideo', {
        text: '视频',
        icon: 'embed',
        onAction: () => {
          FileInsertion.open({
            type: 'video'
          })
        }
      })

      MobileLink.init()
      editor.ui.registry.addMenuItem('mobilelink', {
        text: '小程序页面链接',
        icon: 'link',
        onAction: () => {
          MobileLink.open()
        }
      })
    },
    images_upload_handler (blobInfo, success, failure, progress) {
      const loading = Vue.prototype.$loading()
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
      }).finally(() => {
        loading.close()
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
    // 加async报错
    /*urlconverter_callback: (url, node, on_save, name) => {
      console.log('urlconverter_callback', url, node, on_save, name)
      /!*if (node === 'img') {
        const res = await fetch(`${process.env.VUE_APP_DYNAMIC_PROXY_URL}${window.encodeURI(url)}`, {
          method: 'GET',
          responseType: 'blob',
          mode: 'cors',
        })
        const blob = await res.blob()
        console.log(blob)
        url = window.URL.createObjectURL(blob)
        console.log(url)
      }*!/

      // Return new URL
      return url
    },
    paste_postprocess: async (pluginApi, data) => {
      // node不支持异步修改
      console.log('paste_postprocess', data.node, data.mode, data.source)

      // 可能的值：
      // 'html', 'msoffice', 'googledocs', 'image', 'imagedrop', 'plaintext', 'text', or 'invalid'

      // Apply custom filtering by mutating data.node
      /!*const additionalNode = document.createElement('div')
      additionalNode.innerHTML = '<p>This will go before the pasted content.</p>'
      data.node.insertBefore(additionalNode, data.node.firstElementChild)*!/

      switch (data.source) {
        case 'msoffice':
          //this.onPaste()
          break
        case 'html':
          //this.loading = true
          for (let v of data.node.querySelectorAll('img') || []) {
            const imgSrc = v.src
            v.src = `${process.env.VUE_APP_DYNAMIC_PROXY_URL}${window.encodeURIComponent(imgSrc)}`
            /!*const res = await fetch(`${process.env.VUE_APP_DYNAMIC_PROXY_URL}${window.encodeURIComponent(imgSrc)}`, {
              method: 'GET',
              responseType: 'blob',
              mode: 'cors',
            })

            const blob = await res.blob()

            console.log(blob)

            v.src = window.URL.createObjectURL(blob)

            console.log(v.src)*!/

            /!*.then(res => {
              console.log(res)
              return res.blob()
            })
            .then(blob => {
              console.log(blob)
              v.onload = e => {
                window.URL.revokeObjectURL(v.src)
              }
              v.src = window.URL.createObjectURL(blob)
              console.log(v.src)
            })
            .finally(e => {
              if (i === imgList.length - 1) {
                this.loading = false
                console.log(imgList)
              }
            })*!/
          }
      }
    },*/
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
