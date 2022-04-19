import Vue from 'vue'
import App from './index.vue'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

import MiniMCE from './src'
import insertWord from './plugins/insert-word'
import InsertTel from './plugins/InsertTel'
import InsertMiniProgramPageLink from './plugins/InsertMiniProgramPageLink'

Vue.use(MiniMCE, {
  apiKey: '',
  init: {
    menu: {
      insert: {
        items: 'localimage localvideo localaudio tel miniprogrampagelink | image link media docx template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime'
      },
    },
    setup (editor) {
      Vue.nextTick(() => {
        const currentEditor = window.tinymce.get(editor.id)

        /*ImageInsertion.init()
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
        })*/

        editor.ui.registry.addMenuItem('docx', {
          text: 'Word 文档',
          icon: 'new-document',
          onAction: () => {
            insertWord(currentEditor)
          }
        })

        InsertMiniProgramPageLink.mount({ currentEditor })
        editor.ui.registry.addMenuItem('miniprogrampagelink', {
          text: '小程序页面链接',
          icon: 'link',
          onAction: () => {
            InsertMiniProgramPageLink.open()
          }
        })

        InsertTel.mount({ currentEditor })
        // 菜单图标：
        // 如果官方图标库 https://www.tiny.cloud/docs/advanced/editor-icon-identifiers/ 里没有，
        // 可以自行添加图标 https://www.tiny.cloud/docs/api/tinymce.editor.ui/tinymce.editor.ui.registry/#addicon
        editor.ui.registry.addIcon('tel', `<svg t="1593331139446" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10282" width="200" height="200"><path d="M780.207 868.621c0 48.892-40.51 89.402-89.402 89.402L333.195 958.023c-48.892 0-89.402-40.511-89.402-89.402L243.793 153.402c0-48.891 40.51-89.402 89.402-89.402l357.609 0c48.893 0 89.402 40.511 89.402 89.402L780.206 868.621zM713.155 265.155c0-11.875-10.478-22.351-22.351-22.351L333.195 242.804c-11.874 0-22.351 10.476-22.351 22.351l0 491.713c0 11.874 10.477 22.351 22.351 22.351l357.609 0c11.873 0 22.351-10.477 22.351-22.351L713.155 265.155zM567.877 153.402 456.124 153.402c-6.286 0-11.175 4.89-11.175 11.176 0 6.284 4.889 11.174 11.175 11.174l111.753 0c6.285 0 11.175-4.89 11.175-11.174C579.052 158.292 574.162 153.402 567.877 153.402zM512 812.744c-30.732 0-55.876 25.145-55.876 55.877s25.145 55.877 55.876 55.877c30.732 0 55.877-25.145 55.877-55.877S542.732 812.744 512 812.744z" p-id="10283"></path></svg>`)
        editor.ui.registry.addMenuItem('tel', {
          text: '电话号码',
          icon: 'tel',
          onAction: () => {
            InsertTel.open()
          }
        })
      })
    },
    /*images_upload_handler (blobInfo, success, failure, progress) {
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
    },*/
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
