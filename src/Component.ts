import {
  computed,
  defineComponent,
  h,
  isVue3,
  onMounted,
  onUnmounted,
  ref,
  unref,
  watch,
  // vShow, // 不支持 Vue 2
  // withDirectives, // 不支持 Vue 2
} from 'vue-demi'
import { conclude } from 'vue-global-config'
import { v4 as uuidv4 } from 'uuid'
import { debounce } from 'lodash-es'

import tinymce from 'tinymce/tinymce'
import type { Editor } from 'tinymce/tinymce'
import { PascalCasedName as name } from '../package.json'
import { globalProps } from './install'

// models
import 'tinymce/models/dom'

// plugins
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'

// 该插件在官方的 full-featured 示例中被排除，故默认关闭
// import 'tinymce/plugins/autoresize' //
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/charmap'

// 该插件只有开发者会用到，故默认关闭
// import 'tinymce/plugins/code'
// 该插件只有开发者会用到，故默认关闭
// import 'tinymce/plugins/codesample'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/emoticons/js/emojis.min'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'
import 'tinymce/plugins/image'
import 'tinymce/plugins/importcss'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'

// 该插件需要用户进一步的配置，故默认关闭
// import 'tinymce/plugins/template'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'

// const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches

const model = {
  prop: isVue3 ? 'modelValue' : 'value',
  event: isVue3 ? 'update:modelValue' : 'input',
}

export default defineComponent({
  name,
  props: {
    [model.prop]: String,
    disabled: {
      type: Boolean,
      default: undefined,
    },
    outputFormat: {},
    options: {},
  },
  emits: [model.event, 'init'],
  setup(props, { emit, expose }) {
    const loading = ref(true)
    const id = ref(`minimce-${uuidv4()}`)
    const preventSettingContent = ref(false)
    const preventUpdatingModelValue = ref(false)
    /**
     * props & attrs
     */
    const Disabled = computed(() =>
      conclude([props.disabled, globalProps.disabled], {
        type: Boolean,
      }),
    )
    const OutputFormat = computed(() =>
      conclude([props.outputFormat, globalProps.outputFormat], {
        type: String,
      }),
    )
    const Options = computed(() =>
      conclude(
        [
          props.options,
          globalProps.options,
          {
            selector: `#${id.value}`,
            /**
             * 默认开启所有免费插件
             * https://www.tiny.cloud/docs/tinymce/6/full-featured-open-source-demo/
             */
            plugins:
              'preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
            menubar: 'file edit view insert format tools table help',
            toolbar:
              'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
            quickbars_selection_toolbar:
              'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
            contextmenu: 'link image table',
            branding: false,
            promotion: false,
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
            // skin: useDarkMode ? 'oxide-dark' : 'oxide',
            // content_css: useDarkMode ? 'dark' : 'default',

            autosave_ask_before_unload: false, // 改动后刷新，不再弹 alert
            autosave_interval: '30s',
            autosave_prefix: '{path}{query}-{id}-',
            autosave_restore_when_empty: false,
            autosave_retention: '2m',
            // importcss_append: true,
            // height: 500,
            relative_urls: false,
            convert_urls: false,
            image_advtab: true,
            image_caption: true,
            // 开启时，出现两个 bug：1. 部分菜单项失效；2. 拖拉拽调整视频大小会错位（该问题在 v6.0 仍在存在）
            media_live_embeds: false,
            toolbar_mode: 'sliding',
            // toolbar_sticky: true,
            // toolbar_sticky_offset: isSmallScreen ? 102 : 108,
            // extended_valid_elements: 'img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|referrerpolicy=no-referrer]',
            init_instance_callback: (editor: Editor) => {
              watch(
                Disabled,
                (n: boolean) => {
                  editor.mode.set(n ? 'readonly' : 'design')
                },
                {
                  immediate: true,
                },
              )

              // 监听手动输入，更新绑定值
              const onContentChange = debounce(() => {
                if (preventUpdatingModelValue.value) {
                  preventUpdatingModelValue.value = false
                  return
                }
                // 更新绑定值会触发编程式输入的监听，需要避免
                preventSettingContent.value = true
                const newContent = editor.getContent({ format: OutputFormat.value })
                // console.log('手动输入:', newContent)
                emit(model.event, newContent)
              }, 100)

              /**
               * 事件列表: https://www.tiny.cloud/docs/tinymce/6/events/
               *
               * SetContent 事件
               *   触发：Undo Redo paste drop insertContent resetContent setContent
               *   不触发：input
               *
               * Change 事件
               *   触发：blur Undo paste drop insertContent
               *   不触发：input Redo setContent resetContent
               *
               * 全小写表示原生事件，editor.on 不区分大小写
               *
               * 顺序：先监听手动输入，再监听编程式输入
               *
               * tinymce-vue 使用的是: Change input Redo Undo
               *
               * input 监听不到加粗，所以需要 Change
               */
              editor.on('Change input Redo Undo SetContent', onContentChange)

              // 监听编程式输入，更新文本内容
              watch(
                () => props[model.prop],
                (newModelValue) => {
                  if (preventSettingContent.value) {
                    preventSettingContent.value = false
                    return
                  }
                  // 更新文本内容会触发手动输入的监听，需要避免
                  preventUpdatingModelValue.value = true
                  // 参数必须为 string 类型，否则无效
                  // console.log('编程式输入:', newModelValue)
                  editor.setContent((newModelValue || '') as string)
                },
                {
                  immediate: true,
                },
              )

              loading.value = false
            },
          },
        ],
        {
          mergeFunction: (previousValue: Function, currentValue: Function) => (...args: any) => {
            previousValue(...args)
            currentValue(...args)
          },
          type: Object,
        },
      ),
    )

    onUnmounted(() => {
      tinymce.get(id.value)?.destroy()
    })

    onMounted(() => {
      const el = document.querySelector(`#${id.value}`) as Element
      const intersectionObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // el is visible
          intersectionObserver.unobserve(el) // tinymce.init will trigger invisible
          tinymce.init(Options.value)
        } else {
          // el is invisible
        }
      })
      // Asynchronous call
      intersectionObserver.observe(el)
    })

    expose?.({ id })

    // 在 Vue 2.6 中，return 出去的数据不需要 expose
    return {
      id,
      loading,
      // height: (Options.value.height ?? '400') + 'px',
    }
  },
  render() {
    // this 为组件实例
    // this.id 在 Vue 2.6 中为 id 的 ref
    // 参数 ctx 在 Vue 3 中为组件实例，在 Vue 2 中为渲染函数 h
    // console.log('this.id: ', this.id)
    // console.log('ctx: ', ctx)
    return isVue3
      ? h('textarea', { id: this.id })
      : h('textarea', {
        attrs: {
          id: unref(this.id),
        },
        on: {
          input: (value?: string | null) => {
            this.$emit(model.event, value)
          },
        },
      })
  },
})
