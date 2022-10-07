// '?url' 是 Vite 语法，在 Webpack 中请使用 https://webpack.js.org/guides/asset-modules/
// '?raw' 是 Vite 语法，在 Webpack 中请使用 https://github.com/webpack-contrib/raw-loader

import 'minimce/dist/style.css'
import MiniMCE from 'minimce'
// import './index.scss'
// import MiniMCE from '../../src'

// 浅色模式
import 'tinymce/skins/ui/oxide/skin.min.css' // 皮肤
import contentCSS from 'tinymce/skins/content/default/content.min.css?raw'
import contentUICSS from 'tinymce/skins/ui/oxide/content.min.css?raw'

// 深色模式
/* import 'tinymce/skins/ui/oxide-dark/skin.min.css' // 皮肤
import contentCSS from 'tinymce/skins/content/dark/content.min.css?raw'
import contentUICSS from 'tinymce/skins/ui/oxide-dark/content.min.css?raw' */

// 图标
import 'tinymce/icons/default/icons'

// 主题
import 'tinymce/themes/silver/theme'

// 语言（非必须，默认英文，下载地址：https://www.tiny.cloud/get-tiny/language-packages）
import '../langs/zh-Hans'

// 自定义插件（非必须）
import insertWord from './plugins/insert-word'
import InsertFile from './plugins/InsertFile/index'
import InsertImage from './plugins/InsertImage/index'
import InsertMPPageLink from './plugins/InsertMPPageLink/index'
import InsertTel from './plugins/InsertTel/index'

// 官方插件（非必须）
if (import.meta.env.MODE === 'development') {
  await import('tinymce/plugins/code')
  await import('tinymce/plugins/codesample')
}

/**
 * 自定义内容样式（非必须）
 * 该样式仅在生产侧有效，不包含在生成的 HTML 文本中
 * 可拷贝至展示侧使用
 */
const contentCustomCSS = `
  .mce-content-body {
    line-height: 1.8;
    overflow: auto;
  }
  p {
    margin-block-end: 0;
    margin-block-start: 0;
  }
  img {
    max-width: 100%;
    height: auto !important;
    vertical-align: middle;
  }
`

export default function () {
  Vue.use(MiniMCE, {
    options: {
      language: 'zh-Hans',
      content_style: [contentCSS, contentUICSS, contentCustomCSS].join('\n'),
      plugins: `preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons
        ${import.meta.env.MODE === 'development' ? ' code codesample' : ''}`,
      // https://www.tiny.cloud/docs/tinymce/6/menus-configuration-options/#example-the-tinymce-default-menu-items
      menu: {
        insert: {
          title: 'Insert',
          items: 'localimage localvideo localaudio tel mppagelink docx | image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime',
        },
      },
      setup(editor) {
        const insertImage = InsertImage({ editor })
        editor.ui.registry.addMenuItem('localimage', {
          text: '本地图片',
          icon: 'image',
          onAction: () => {
            insertImage.$children[0].open()
          },
        })

        const insertAudio = InsertFile({ editor, type: 'audio' })
        editor.ui.registry.addMenuItem('localaudio', {
          text: '本地音频',
          icon: 'arrow-right',
          onAction: () => {
            insertAudio.$children[0].open()
          },
        })

        const insertVideo = InsertFile({ editor, type: 'video' })
        editor.ui.registry.addMenuItem('localvideo', {
          text: '本地视频',
          icon: 'embed',
          onAction: () => {
            insertVideo.$children[0].open()
          },
        })

        editor.ui.registry.addMenuItem('docx', {
          text: 'Word 文档',
          icon: 'new-document',
          onAction: () => {
            insertWord(editor)
          },
        })

        const insertMPPageLink = InsertMPPageLink({ editor })
        editor.ui.registry.addMenuItem('mppagelink', {
          text: '小程序页面链接',
          icon: 'link',
          onAction: () => {
            insertMPPageLink.$children[0].open()
          },
        })

        const insertTel = InsertTel({ editor })
        // 菜单图标：
        // 如果官方图标库 https://www.tiny.cloud/docs/advanced/editor-icon-identifiers/ 里没有，
        // 可以自行添加图标 https://www.tiny.cloud/docs/api/tinymce.editor.ui/tinymce.editor.ui.registry/#addicon
        editor.ui.registry.addIcon('tel', '<svg t="1593331139446" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10282" width="200" height="200"><path d="M780.207 868.621c0 48.892-40.51 89.402-89.402 89.402L333.195 958.023c-48.892 0-89.402-40.511-89.402-89.402L243.793 153.402c0-48.891 40.51-89.402 89.402-89.402l357.609 0c48.893 0 89.402 40.511 89.402 89.402L780.206 868.621zM713.155 265.155c0-11.875-10.478-22.351-22.351-22.351L333.195 242.804c-11.874 0-22.351 10.476-22.351 22.351l0 491.713c0 11.874 10.477 22.351 22.351 22.351l357.609 0c11.873 0 22.351-10.477 22.351-22.351L713.155 265.155zM567.877 153.402 456.124 153.402c-6.286 0-11.175 4.89-11.175 11.176 0 6.284 4.889 11.174 11.175 11.174l111.753 0c6.285 0 11.175-4.89 11.175-11.174C579.052 158.292 574.162 153.402 567.877 153.402zM512 812.744c-30.732 0-55.876 25.145-55.876 55.877s25.145 55.877 55.876 55.877c30.732 0 55.877-25.145 55.877-55.877S542.732 812.744 512 812.744z" p-id="10283"></path></svg>')
        editor.ui.registry.addMenuItem('tel', {
          text: '电话号码',
          icon: 'tel',
          onAction: () => {
            insertTel.$children[0].open()
          },
        })
      },
      // 用于复制粘贴的图片和 TinyMCE 自带的图片上传
      /* images_upload_handler: (blobInfo, progress) =>
        new Promise((resolve, reject) => {
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
          }).then(res => {
            if (typeof res.data?.data === 'string') {
              resolve(res.data.data)
            } else {
              reject(res.data?.message)
            }
          }).catch(err => {
            reject(String(err))
          }).finally(() => {
            loading.close()
          })
        }), */
    },
  })
}
