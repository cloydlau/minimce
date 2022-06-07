import './index.scss'
//const isVue3 = false
import {
  isVue3,
  defineComponent,
  ref,
  computed,
  onMounted,
  watch,
  h,
  //vShow, // 不支持 Vue 2
  //withDirectives, // 不支持 Vue 2
}
  from 'vue-demi'
//from '@vue/composition-api'
import Spin from './components/Spin'
import { globalProps } from './index'
import { conclude } from 'vue-global-config'
import { v4 as uuidv4 } from 'uuid'
import { throttle } from 'lodash-es'

import tinymce from 'tinymce/tinymce'
// languages
// 下载地址：https://www.tiny.cloud/get-tiny/language-packages/
import './langs/zh-Hans'
// models
import 'tinymce/models/dom'
// plugins
import 'tinymce/plugins/media'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/importcss'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
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
//import 'tinymce/plugins/code'
//import 'tinymce/plugins/codesample'
//import 'tinymce/plugins/template'

const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches

export default defineComponent({
  name: 'MiniMCE',
  props: {
    ...isVue3 ? {
      modelValue: String,
    } : {
      value: String,
    },
    disabled: {
      type: Boolean,
      default: undefined
    },
    outputFormat: {},
    options: {},
  },
  setup(props, { expose, emit }) {
    const loading = ref(true)
    const tinymceId = ref('minimce-' + uuidv4())
    const syncingValue = ref(false)

    /**
     * props & attrs
     */
    const Disabled = computed(() => conclude([props.disabled, globalProps.disabled], {
      name: 'disabled',
      type: 'boolean',
    }))
    const OutputFormat = computed(() => conclude([props.outputFormat, globalProps.outputFormat], {
      name: 'outputFormat',
      type: 'string',
    }))
    const Options = computed(() => conclude([props.options, globalProps.options, {
      /**
       * 默认开启所有免费功能
       * https://www.tiny.cloud/docs/tinymce/6/full-featured-open-source-demo/
       */
      plugins: 'preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
      menubar: 'file edit view insert format tools table help',
      toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
      quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
      contextmenu: 'link image table',
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
      autosave_interval: '30s',
      autosave_prefix: '{path}{query}-{id}-',
      autosave_restore_when_empty: false,
      autosave_retention: '2m',
      //importcss_append: true,
      height: 500,
      relative_urls: false,
      convert_urls: false,
      image_advtab: true,
      image_caption: true,
      // 开启时，出现两个 bug：1. 部分菜单项失效；2. 拖拉拽调整视频大小会错位（该问题在 v6.0 仍在存在）
      media_live_embeds: false,
      toolbar_mode: 'sliding',
      toolbar_sticky: true,
      toolbar_sticky_offset: isSmallScreen ? 102 : 108,
      //extended_valid_elements: 'img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|referrerpolicy=no-referrer]',
      init_instance_callback: editor => {
        watch(Disabled, (n) => {
          editor.mode.set(n ? 'readonly' : 'design')
        }, {
          immediate: true
        })

        watch(() => isVue3 ? props.modelValue : props.value, n => {
          if (syncingValue.value) {
            syncingValue.value = false
            return
          }
          // 参数必须为 string 类型，否则无效
          editor.setContent(n || '')
        }, {
          immediate: true,
        })

        const eventName = isVue3 ? 'update:modelValue' : 'input'
        const onChange = throttle(() => {
          syncingValue.value = true
          emit(eventName, editor.getContent({ format: OutputFormat.value }))
        }, 100, {
          leading: false,
          trailing: true
        })

        // 事件列表：https://www.tiny.cloud/docs/tinymce/6/events/#supported-browser-native-events
        // 为什么不包含 change 事件？
        // 外部设值时不需要同步
        editor.on('input undo redo paste drop', onChange)

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

    if (isVue3) {
      expose({ tinymceId })
    }

    return {
      loading,
      tinymceId,
    }
  },
  render(ctx: any) {
    // Vue 2 中 ctx 为渲染函数 h
    return isVue3 ?
      /**
       * Vue 3 模板
       */
      h('div', {
        style: {
          height: '500px',
          position: 'relative',
        },
      }, [
        h(Spin, {
          style: {
            display: ctx.loading ? undefined : 'none',
          }
        }),
        h('textarea', {
          id: ctx.tinymceId,
        })
      ]) :
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
            { name: 'show', value: this.loading },
          ]
        }),
        h('textarea', {
          attrs: {
            id: this.tinymceId,
          },
          on: {
            'input': (value: string | undefined | null) => { this.$emit('input', value) }
          },
        })
      ])
  },
})
