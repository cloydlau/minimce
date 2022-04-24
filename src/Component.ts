import './index.scss'
import {
  isVue3,
  defineComponent,
  ref,
  computed,
  onMounted,
  watch,
  nextTick,
  onUnmounted,
  h,
  vShow, // 不支持 Vue 2
  withDirectives, // 不支持 Vue 2
} from 'vue-demi'
import Spin from './components/Spin'
import { globalProps } from './index'
import { conclude } from 'vue-global-config'
import { v4 as uuidv4 } from 'uuid'
import { throttle } from 'lodash-es'

import tinymce from 'tinymce/tinymce'
// languages
import './assets/5.10.3-128/langs/zh_CN' // https://www.tiny.cloud/get-tiny/language-packages/
import './assets/5.10.3-128/langs/zh_CN_expansion'
// models
import 'tinymce/models/dom'
// plugins
//const plugins = import.meta.globEager('./assets/5.10.3-128/plugins/*/plugin.min.js', { eager: true })
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

export default defineComponent({
  name: 'MiniMCE',
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
    options: {},
  },
  setup: (props, { expose, emit }) => {
    const loading = ref(true)
    const tinymceId = ref('minimce-' + uuidv4())

    /**
     * props & attrs
     */
    const Readonly = computed(() => conclude([props.readonly, globalProps.readonly], {
      name: 'readonly',
      type: 'boolean'
    }))
    const ApiKey = computed(() => conclude([props.apiKey, globalProps.apiKey], {
      name: 'apiKey',
      type: 'string'
    }))
    const Disabled = computed(() => conclude([props.disabled, globalProps.disabled], {
      name: 'disabled',
      type: 'boolean',
    }))
    const Options = computed(() => conclude([props.options, globalProps.options, {
      /**
       * 默认开启所有免费功能
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
      branding: false,
      quickbars_insert_toolbar: false,
      // 默认屏蔽 iframe 原因：
      // - 允许用户引入未知的 iframe 存在执行未知脚本等安全隐患
      // - 小程序侧不支持 iframe
      // - 小程序侧 web-view 中使用 iframe 需要配置业务域名
      // - 给微信公众号 H5 侧带来授权问题
      invalid_elements: 'iframe,frame',

      // note that skin and content_css is disabled to avoid the normal
      // loading process and is instead loaded as a string via content_style
      skin: false,
      content_css: false,
      //skin: useDarkMode ? 'oxide-dark' : 'oxide',
      //content_css: useDarkMode ? 'dark' : 'default',

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
      init_instance_callback: editor => {
        watch(Readonly, n => {
          if (n) {
            editor.destroy()
          } else {
            nextTick(() => {
              tinymce.init({
                selector: '#' + tinymceId.value,
                ...Options.value,
              })
            })
          }
        })

        watch(Disabled, (n) => {
          editor.ui.setEnabled(!n)
        }, {
          immediate: true
        })

        watch(() => isVue3 ? props.modelValue : props.value, n => {
          editor.setContent(n)
        }, {
          immediate: true,
        })

        const eventName = isVue3 ? 'update:modelValue' : 'input'

        const onChange = throttle(() => {
          emit(eventName, editor.getContent({ format: Options.value.outputFormat }))
        }, 500, {
          leading: false,
          trailing: true
        })

        editor.on('input', onChange)

        /**
         * 销毁时清空数据
         */
        onUnmounted(() => {
          editor.setContent('')
        })

        loading.value = false
      },
    }], {
      camelCase: false,
      mergeFunction: (globalFunction: Function, defaultFunction: Function) => (...args: any) => {
        globalFunction(...args)
        defaultFunction(...args)
      },
      name: 'options',
      type: 'object',
    }))

    onMounted(() => {
      tinymce.init({
        selector: '#' + tinymceId.value,
        ...Options.value,
      })
    })

    /**
     * 暴露 tinymceId
     */
    if (isVue3) {
      expose({ tinymceId })
    }

    return () => isVue3 ?
      /**
       * Vue 3 模板
       */
      Readonly.value ?
        h('div', {
          key: 'minimce-readonly', // 不加 key 的话，在切换只读状态时会有问题
          innerHTML: props.modelValue
        }) :
        h('div', {
          key: 'minimce-textarea',
          style: {
            height: '500px',
            position: 'relative',
          },
        }, [
          h(Spin, {
            style: {
              display: loading.value ? undefined : 'none',
            }
          }),
          h('textarea', {
            id: tinymceId.value,
          })
        ])
      :
      /**
       * Vue 2 模板
       */
      Readonly.value ?
        h('div', {
          key: 'minimce-readonly',
          innerHTML: props.value
        }) :
        h('div', {
          key: 'minimce-textarea',
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
          h('textarea', {
            attrs: {
              id: tinymceId.value,
            },
            on: {
              'input': (value: string | undefined | null) => {emit('input', value)}
            },
          })
        ])
  },
})
