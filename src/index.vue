<template>
  <div>
    <div v-if="readonly" v-html="selfValue" class="rich__text"/>
    <div v-else v-loading="loading">
      <TinyMCE :id="tinymceId"
               v-model="selfValue"
               :init="options"
               :api-key="apiKey"
               :disabled="disabled"
      />
      <slot name="mobilelink" :show.sync="showInsertionDialog"/>
      <InsertTel :show.sync="showInsertionDialog.tel" @insertTag="insertTag"/>
      <component :is="InsertImg"
                 @insertTag="insertTag"
                 :show.sync="showInsertionDialog.img"
      >
        <template #Imgpond="slotProps">
          <slot name="Imgpond" :slotProps="slotProps"/>
        </template>
      </component>
      <component :is="InsertAudio"
                 @insertTag="insertTag"
                 type="audio"
                 :show.sync="showInsertionDialog.audio"
      >
        <template #Imgpond="slotProps">
          <slot name="Imgpond" :slotProps="slotProps"/>
        </template>
        <template #Filepool="slotProps">
          <slot name="Filepool" :slotProps="slotProps"/>
        </template>
      </component>
      <component :is="InsertVideo"
                 @insertTag="insertTag"
                 type="video"
                 :show.sync="showInsertionDialog.video"
      >
        <template v-slot:Filepool="slotProps">
          <slot name="Filepool" :slotProps="slotProps"/>
        </template>
      </component>
    </div>
  </div>
</template>

<script>
import TinyMCE from '@tinymce/tinymce-vue'
import InsertTel from './components/InsertTel'

import 'tinymce/tinymce'
import 'tinymce/icons/default'
import 'tinymce/themes/silver'
import 'tinymce/skins/ui/oxide/skin.min.css'

import './static/zh_CN'

//const plugins = 'autoresize|print|preview|paste|importcss|searchreplace|autolink|autosave|directionality|code|visualblocks|visualchars|fullscreen|image|link|media|template|codesample|table|charmap|hr|pagebreak|nonbreaking|anchor|toc|insertdatetime|advlist|lists|wordcount|textpattern|noneditable|help|charmap|emoticons'
//const regExp = new RegExp(`^\.\/(${plugins})\/index\.js$`)

function requireAll (requireContext) {
  return requireContext.keys().map(requireContext)
}

export default {
  components: { TinyMCE, InsertTel },
  props: {
    value: String,
    disabled: Boolean,
    readonly: Boolean,
    apiKey: String,
    audioMenuItem: {
      type: Boolean,
      default: true
    },
    html2text: Boolean,
    text: String,
    textMaxlength: {
      type: Number,
      default: 30
    },
    tinymceOptions: {
      type: Object,
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    value: {
      immediate: true,
      handler (newVal, oldVal) {
        this.selfValue = newVal
      },
    },
    selfValue (newVal, oldVal) {
      this.$emit('change', newVal)
      //fix: 用于el表单中 且校验触发方式为blur时 没有生效
      if (this.$parent?.$options?._componentTag === ('el-form-item') && this.$parent.rules?.trigger === 'blur') {
        this.$parent.$emit('el.form.blur')
      }
      if (this.html2text && this.throttle && this.htmlToText) {
        if (!this.getTextThrottle__) {
          this.getTextThrottle__ = this.throttle(() => {
            if (this.selfValue) {
              let text = this.htmlToText.fromString(this.selfValue, {
                wordwrap: false,
                ignoreHref: true,
                ignoreImage: true
              })
              if (text) {
                text = text.replace(/[\f\n\r\t\v]/g, '')
                text = text.substr(0, this.textMaxlength)
                this.$emit('update:text', text)
              }
            } else {
              this.$emit('update:text', '')
            }
          }, 1000, {
            leading: false, //true会导致：如果调用≥2次 则至少触发2次 但此时可能只期望触发1次
            trailing: true
          })
        }

        this.getTextThrottle__()
      }
    },
    html2text: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal) {
          if (!this.htmlToText) {
            this.htmlToText = require('html-to-text')
          }
          if (!this.throttle) {
            this.throttle = require('lodash/throttle')
          }
        }
      }
    }
  },
  data () {
    return {
      tinymceId: 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''),
      selfValue: '',
      loading: true,
      showInsertionDialog: {
        img: false,
        audio: false,
        video: false,
        mobilelink: false,
        tel: false,
      },
      InsertImg: null,
      InsertAudio: null,
      InsertVideo: null,
    }
  },
  computed: {
    options () {
      return {
        invalid_elements: 'iframe,frame',
        content_style: `
          line-height: 1.8;
          overflow: auto;
          p {
            margin-block-end: 0;
            margin-block-start: 0;
          }
          img {
            max-width: 100%;
            height: auto !important;
            vertical-align: middle;
          }
          audio, video {
            width: 100%;
            background-color: #000;
          }
        `,
        min_height: 500,
        relative_urls: false,
        convert_urls: false,
        plugins: 'print preview paste importcss searchreplace autolink autosave directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount textpattern noneditable help charmap emoticons',
        toolbar: 'undo redo | bold italic underline | fontselect fontsizeselect formatselect | forecolor backcolor | charmap emoticons | alignleft aligncenter alignright alignjustify | outdent indent | ltr rtl | numlist bullist | removeformat preview save fullscreen',
        toolbar_sticky: true,
        menu: {
          insert: {
            title: 'Insert',
            items: 'localimage localvideo localaudio | mobilelink tel | image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime'
          },
        },
        menubar: 'file edit view insert format tools table help',
        language: 'zh_CN',

        ...this.tinymceOptions,

        init_instance_callback: editor => {
          if (typeof this.tinymceOptions?.init_instance_callback === 'function') {
            this.tinymceOptions.init_instance_callback(editor)
          }
          this.loading = false
        },
        setup: editor => {
          editor.ui.registry.addIcon('tel', `<svg t="1593331139446" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10282" width="200" height="200"><path d="M780.207 868.621c0 48.892-40.51 89.402-89.402 89.402L333.195 958.023c-48.892 0-89.402-40.511-89.402-89.402L243.793 153.402c0-48.891 40.51-89.402 89.402-89.402l357.609 0c48.893 0 89.402 40.511 89.402 89.402L780.206 868.621zM713.155 265.155c0-11.875-10.478-22.351-22.351-22.351L333.195 242.804c-11.874 0-22.351 10.476-22.351 22.351l0 491.713c0 11.874 10.477 22.351 22.351 22.351l357.609 0c11.873 0 22.351-10.477 22.351-22.351L713.155 265.155zM567.877 153.402 456.124 153.402c-6.286 0-11.175 4.89-11.175 11.176 0 6.284 4.889 11.174 11.175 11.174l111.753 0c6.285 0 11.175-4.89 11.175-11.174C579.052 158.292 574.162 153.402 567.877 153.402zM512 812.744c-30.732 0-55.876 25.145-55.876 55.877s25.145 55.877 55.876 55.877c30.732 0 55.877-25.145 55.877-55.877S542.732 812.744 512 812.744z" p-id="10283"></path></svg>`)
          editor.ui.registry.addMenuItem('tel', {
            text: '电话号码',
            icon: 'tel',
            onAction: () => {
              this.showInsertionDialog.tel = true
            }
          })
          if (this.$scopedSlots.Imgpond) {
            this.InsertImg = require('./components/InsertImg').default
            editor.ui.registry.addMenuItem('localimage', {
              text: '本地图片',
              icon: 'image',
              onAction: () => {
                this.showInsertionDialog.img = true
              }
            })
          }
          if (this.$scopedSlots.Filepool) {
            if (this.audioMenuItem) {
              this.InsertAudio = require('./components/InsertFile').default
              editor.ui.registry.addIcon('audio', `<svg t="1588903157483" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" width="200" height="200"><path d="M742.78 128H430.89v96h0.11v306.65c-28.24-16.34-61.03-25.69-96-25.69-106.04 0-192 85.96-192 192s85.96 192 192 192c103.68 0 188.15-82.18 191.86-184.96h0.14V224h119.78l96-96zM335 792.96c-53.02 0-96-42.98-96-96s42.98-96 96-96 96 42.98 96 96-42.98 96-96 96z" p-id="1161"></path></svg>`)
              editor.ui.registry.addMenuItem('localaudio', {
                text: '本地音频',
                icon: 'audio',
                onAction: () => {
                  this.showInsertionDialog.audio = true
                }
              })
            }

            this.InsertVideo = require('./components/InsertFile').default
            editor.ui.registry.addMenuItem('localvideo', {
              text: '本地视频',
              icon: 'embed',
              onAction: () => {
                this.showInsertionDialog.video = true
              }
            })
          }
          if (this.$scopedSlots.mobilelink) {
            editor.ui.registry.addMenuItem('mobilelink', {
              text: '移动端页面链接',
              icon: 'link',
              onAction: () => {
                this.showInsertionDialog.mobilelink = true
              }
            })
          }
        },
        //base_url: './tinymce-static/',
        //language_url: './tinymce-static/zh_CN.js',
        //skin_url: './tinymce-static',
        //theme_url: './tinymce-static/theme.min.js',
        //content_css: './tinymce-static/content.min.css',
      }
    },
  },
  created () {
    //requireAll(require.context('tinymce/plugins', true, regExp)) // 报错
    requireAll(require.context('tinymce/plugins', true, /^\.\/(print|preview|paste|importcss|searchreplace|autolink|autosave|directionality|code|visualblocks|visualchars|fullscreen|image|link|media|template|codesample|table|charmap|hr|pagebreak|nonbreaking|anchor|toc|insertdatetime|advlist|lists|wordcount|textpattern|noneditable|help|charmap|emoticons|emoticons\/js\/emojis\.min\.js)$/))

    this.$eventBus && this.$eventBus.on('insertTag', this.insertTag)
  },
  beforeDestroy () {
    this.close()
  },
  deactivated () {
    this.close()
  },
  methods: {
    close () {
      window.tinymce && window.tinymce.get(this.tinymceId).setContent('')
      this.$eventBus && this.$eventBus.off('insertTag', this.insertTag)
    },
    insertTag (tag) {
      window.tinymce.get(this.tinymceId).insertContent(tag)
    },
    addStyle (html) {
      window.tinymce.get(this.tinymceId).setContent(`<style>
        .rich__text {
          line-height: 1.8;
          overflow: auto;
        }
        .rich__text p {
          margin-block-end: 0;
          margin-block-start: 0;
        }
        .rich__text img {
          max-width: 100%;
          height: auto !important;
          vertical-align: middle;
        }
        .rich__text audio, .rich__text video {
          width: 100%;
          background-color: #000;
        }
      </style>`.replace(/[\f\n\r\t\v]/g, '') +
        `<div class="rich__text">${html}</div>`)
    }
  }
}
</script>

<style lang="scss" scoped>
//for disabled
.rich__text {
  line-height: 1.8;
  overflow: auto;

  ::v-deep p {
    margin-block-end: 0;
    margin-block-start: 0;
  }

  ::v-deep img {
    max-width: 100%;
    height: auto !important;
    vertical-align: middle;
  }

  ::v-deep audio, ::v-deep video {
    width: 100%;
    background-color: #000;
  }
}
</style>

<style lang="scss">
.tox-silver-sink {
  z-index: 3000 !important;
}
</style>
