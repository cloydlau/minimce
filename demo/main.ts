import { createApp } from 'vue-demi'
import App from './index.vue'

import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

import MiniMCE from '../src/main'
//import * as ImageInsertion from './ImageInsertion/index.js'
//import * as FileInsertion from './FileInsertion/index.js'
//import * as MobileLink from './MobileLink/index.js'

import mitt from 'mitt'

createApp(App)
.use(ElementPlus)
.use(MiniMCE, {
  apiKey: '',
  plan: 'custom',
  eventBus: mitt(),
  /*options: {
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
    },
  }*/
})
.mount('#app')
