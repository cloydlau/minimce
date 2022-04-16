import './index.scss'
import {
  isVue3,
  defineComponent,
  ref,
  computed,
  watch,
  inject,
  nextTick,
  onUnmounted,
  h,
  vShow,
  getCurrentInstance,
  withDirectives, // 不支持Vue2
  resolveDirective,
} from 'vue-demi'
import insertWord from './components/insert-word'
import Spin from './components/Spin.vue'
import { globalProps, globalAttrs } from './index'
import { conclude } from 'vue-global-config'
import { v4 as uuidv4 } from 'uuid'
import { throttle } from 'lodash-es'

const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

import 'tinymce/tinymce'
// skin
import 'tinymce/skins/ui/oxide/skin.min.css'
// Content styles, including inline UI like fake cursors
// All the above CSS files are loaded on to the page but these two must
// be loaded into the editor iframe so they are loaded as strings and passed
// to the init function.
import contentCSS from 'tinymce/skins/content/default/content.min.css?raw'
import contentUICSS from 'tinymce/skins/ui/oxide/content.min.css?raw'
const contentCustomCSS = `
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
`
// dark mode
/*import 'tinymce/skins/content/dark/content.min.css'
import 'tinymce/skins/ui/oxide-dark/content.min.css'
import 'tinymce/skins/ui/oxide-dark/skin.min.css'*/
// languages
import './assets/5.10.3-128/langs/zh_CN' // https://www.tiny.cloud/get-tiny/language-packages/
import './assets/5.10.3-128/langs/zh_CN_expansion'
// models
import 'tinymce/models/dom'
// themes
import 'tinymce/themes/silver'
// icons
import 'tinymce/icons/default'
// plugins
//import.meta.glob('./assets/5.10.3-128/plugins/*/plugin.min.js')
import './assets/5.10.3-128/plugins/hr/plugin.min'
import './assets/5.10.3-128/plugins/noneditable/plugin.min'
import './assets/5.10.3-128/plugins/paste/plugin.min'
import './assets/5.10.3-128/plugins/print/plugin.min'
import './assets/5.10.3-128/plugins/textpattern/plugin.min'
//import './assets/5.10.3-128/plugins/imagetools/plugin.min' // 6.0 移除
//import './assets/5.10.3-128/plugins/toc/plugin.min' // 6.0 移除
import 'tinymce/plugins/media'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/importcss'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/code'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/template'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/table'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/help'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/emoticons/js/emojis.min'
import 'tinymce/plugins/save'
import 'tinymce/plugins/quickbars'
// Vue wrapper
import TinyMCE from '@tinymce/tinymce-vue'
import TinyMCE_Vue2 from '@tinymce/tinymce-vue2'

export default defineComponent({
  name: 'MiniMCE',
  components: { TinyMCE: isVue3 ? TinyMCE : TinyMCE_Vue2, Spin },
  props: {
    value: String,
    modelValue: String,
    readonly: {
      type: Boolean,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: undefined
    },
    apiKey: {},
    init: {},
  },
  setup (props, { attrs, expose, emit }) {
    const currentInstance = getCurrentInstance()

    const miniMCE = ref(null)
    const loading = ref(true)
    const tinymceId = ref('minimce-' + uuidv4())
    const elForm = inject('elForm', { disabled: false })
    const modelValue__ = ref<string | null | undefined>('')

    /**
     * props & attrs
     */
    const Attrs = computed(() => conclude([attrs, globalAttrs]))
    const Readonly = computed(() => conclude([props.readonly, globalProps.readonly, Boolean(elForm.disabled)], {
      name: 'readonly',
      type: 'boolean'
    }))
    const ApiKey = computed(() => conclude([props.apiKey, globalProps.apiKey], {
      name: 'apiKey',
      type: 'string'
    }))
    const Disabled = computed(() => conclude([props.disabled, globalProps.disabled, Boolean(elForm.disabled)], {
      name: 'disabled',
      type: 'boolean',
    }))
    const Init = computed(() => conclude([props.init, globalProps.init, {
      /**
       * 开启所有免费功能
       * https://www.tiny.cloud/docs/demo/full-featured/
       */
      plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern noneditable help charmap quickbars emoticons',
      menubar: 'file edit view insert format tools table help',
      toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
      quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
      contextmenu: 'link image table',
      menu: {
        // 默认值：
        // https://www.tiny.cloud/docs/configure/editor-appearance/#examplethetinymcedefaultmenuitems
        insert: {
          title: 'Insert',
          items: 'image link media docx template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor | insertdatetime'
        },
      },
      //skin: useDarkMode ? 'oxide-dark' : 'oxide',
      //content_css: useDarkMode ? 'dark' : 'default',
      branding: false,
      quickbars_insert_toolbar: false,
      invalid_elements: 'iframe,frame',

      // note that skin and content_css is disabled to avoid the normal
      // loading process and is instead loaded as a string via content_style
      skin: false,
      content_css: false,
      content_style: [contentCSS, contentUICSS, contentCustomCSS].join('\n'),

      autosave_ask_before_unload: false, // 改动后刷新，不再弹 alert
      min_height: 500,
      relative_urls: false,
      convert_urls: false,
      image_advtab: true,
      image_caption: true,
      // 开启时，出现两个 bug：1. 部分菜单项失效；2. 拖拉拽调整视频大小会错位
      media_live_embeds: true,
      toolbar_mode: 'sliding',
      toolbar_sticky: true,
      //extended_valid_elements: 'img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|referrerpolicy=no-referrer]',
      language: 'zh_CN',
      init_instance_callback: editor => {
        loading.value = false
      },
      setup: editor => {
        nextTick(() => {
          miniMCE.value = window.tinymce.get(tinymceId.value)
        })

        // 注册插入 Word 文档菜单项
        editor.ui.registry.addMenuItem('docx', {
          text: 'Word 文档',
          icon: 'new-document',
          onAction: () => {
            insertWord(miniMCE.value)
          }
        })
      }
    }], {
      camelCase: false,
      mergeFunction: (globalFunction: Function, defaultFunction: Function) => (...args: any) => {
        globalFunction.call(currentInstance, ...args)
        defaultFunction(...args)
      },
      name: 'init',
      type: 'object',
    }))

    /**
     * modelValue 同步
     */
    const syncingModelValue = ref(false)
    // 外部设值时，同步内部的 modelValue__
    watch(() => props.modelValue, (n, o) => {
      if (syncingModelValue.value) {
        syncingModelValue.value = false
      } else {
        modelValue__.value = n
      }
    }, {
      immediate: true,
    })
    const syncModelValue = throttle((n: string | null | undefined) => {
      syncingModelValue.value = true
      emit('update:modelValue', n)
    }, 1000, {
      leading: false,
      trailing: true
    })
    // 用户输入时，同步 modelValue
    watch(modelValue__, syncModelValue)

    /**
     * 销毁时清空数据
     */
    onUnmounted(() => {
      miniMCE.value.setContent('')
    })

    /**
     * 暴露 tinymceId
     */
    expose({ tinymceId })

    return () =>
      Readonly.value ?
        /**
         * 只读状态
         */
        h('div', {
          class: 'minimce-readonly',
          innerHTML: modelValue__.value
        }) :
        isVue3 ?
          /**
           * Vue 3 模板
           */
          h('div', {
            style: {
              height: '500px',
              position: 'relative',
            }
          }, [
            withDirectives(h(Spin), [
              [vShow, loading.value]
            ]),
            h(TinyMCE, {
              id: tinymceId.value,
              init: Init.value,
              apiKey: ApiKey.value,
              disabled: Disabled.value,
              modelValue: modelValue__.value,
              'onUpdate:modelValue': (value: string | undefined | null) => emit('update:modelValue', value),
              ...Attrs.value,
            })
          ])
          :
          /**
           * Vue 2 模板
           */
          h('div', {
            style: {
              height: '500px',
              position: 'relative',
            }
          }, [
            h(Spin, {
              directives: [
                { name: 'show', value: loading.value },
              ]
            }),
            h(TinyMCE, {
              props: {
                id: tinymceId.value,
                init: Init.value,
                apiKey: ApiKey.value,
                disabled: Disabled.value,
                value: modelValue__.value,
                ...attrs,
              },
              on: {
                'update:value': (value: string | undefined | null) => emit('update:value', value)
              },
            })
          ])
  },
})
