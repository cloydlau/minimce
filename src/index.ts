import { name } from '../package.json'
import './index.scss'
import {
  isVue3,
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  inject,
  toRaw,
  nextTick,
  onMounted,
  onUnmounted,
  h,
  vShow,
  withDirectives, // 不支持Vue2
  resolveDirective,
} from 'vue-demi'
import insertWord from './components/insert-word'
import Spin from './components/Spin.vue'
import globalConfig from './config.ts'
import { getFinalProp } from 'kayran'
import { v4 as uuidv4 } from 'uuid'
//const plugins = 'autoresize|print|preview|paste|importcss|searchreplace|autolink|autosave|directionality|code|visualblocks|visualchars|fullscreen|image|link|media|template|codesample|table|charmap|hr|pagebreak|nonbreaking|anchor|insertdatetime|advlist|lists|wordcount|textpattern|noneditable|help|charmap|emoticons'
//const regExp = new RegExp(`^\.\/(${plugins})\/index\.js$`)
/*function requireAll (requireContext) {
  return requireContext.keys().map(requireContext)
}*/
//requireAll(require.context('tinymce/plugins', true, regExp)) // 报错
//media插件导致video标签渲染为空白 暂时去掉
//requireAll(require.context('tinymce/plugins', true, /^\.\/(media|print|preview|paste|importcss|searchreplace|autolink|autosave|directionality|code|visualblocks|visualchars|fullscreen|image|link|template|codesample|table|charmap|hr|pagebreak|nonbreaking|anchor|insertdatetime|advlist|lists|wordcount|textpattern|noneditable|help|charmap|emoticons|emoticons\/js\/emojis\.min\.js)$/))
//const modules = import.meta.glob('tinymce/plugins/*/index.js')

import 'tinymce/tinymce'
// skins
import 'tinymce/skins/content/default/content.min.css'
import 'tinymce/skins/ui/oxide/content.min.css'
import 'tinymce/skins/ui/oxide/skin.min.css'
// models
import 'tinymce/models/dom'
// themes
import 'tinymce/themes/silver'
// icons
import 'tinymce/icons/default'
// plugins
//const modules = import.meta.glob('/node_modules/tinymce/plugins/*/index.js')
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
//import 'tinymce/plugins/print'
//import 'tinymce/plugins/hr'
//import 'tinymce/plugins/textpattern'
//import 'tinymce/plugins/noneditable'
// languages
import './assets/5.10.2-126/langs/zh_CN' // https://www.tiny.cloud/get-tiny/language-packages/
import './assets/5.10.2-126/langs/zh_CN_expansion'
// Vue wrapper
import TinyMCE from '@tinymce/tinymce-vue'
import TinyMCE_Vue2 from '@tinymce/tinymce-vue2'

const plans = ['core', 'essential', 'professional', 'custom']
const defaultPremiumSkin = 'material-classic'

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
    plan: {
      type: String,
      validator: value => plans.includes(value)
    },
    eventBus: {},
  },
  setup (props, { attrs, slots, emit }) {
    const loading = ref(true)
    const tinymceId = ref('minimce-' + uuidv4())
    const showTelInsertion = ref(false)
    const showWordInsertion = ref(false)
    const elForm = inject('elForm', { disabled: false })
    const value__ = ref('')

    const Readonly = computed(() => getFinalProp([props.readonly, globalConfig.readonly, Boolean(elForm.disabled)], {
      name: 'readonly',
      type: 'boolean'
    }))
    const ApiKey = computed(() => getFinalProp([props.apiKey, globalConfig.apiKey], {
      name: 'apiKey',
      type: 'string'
    }))
    const Plan = computed(() => getFinalProp([props.plan, globalConfig.plan, 'core'], {
      name: 'plan',
      type: 'string'
    }))
    const planGrade = computed(() => plans.indexOf(Plan.value))
    const EventBus = computed(() => getFinalProp([props.eventBus, globalConfig.eventBus], {
      name: 'eventBus',
    }))
    const Disabled = computed(() => getFinalProp([props.disabled, globalConfig.disabled, Boolean(elForm.disabled)], {
      name: 'disabled',
      type: 'boolean',
    }))
    const Init = computed(() => getFinalProp([props.init, globalConfig.init, {
      // core
      branding: false,
      quickbars_insert_toolbar: false,
      plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
      toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
      invalid_elements: 'iframe,frame',
      // 含'tinymce/skins/ui/oxide/content.min.css'
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
          .mce-content-body .mce-item-anchor{background:transparent url("data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D'8'%20height%3D'12'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpath%20d%3D'M0%200L8%200%208%2012%204.09117821%209%200%2012z'%2F%3E%3C%2Fsvg%3E%0A") no-repeat center;cursor:default;display:inline-block;height:12px!important;padding:0 2px;-webkit-user-modify:read-only;-moz-user-modify:read-only;-webkit-user-select:all;-moz-user-select:all;-ms-user-select:all;user-select:all;width:8px!important}.mce-content-body .mce-item-anchor[data-mce-selected]{outline-offset:1px}.tox-comments-visible .tox-comment{background-color:#fff0b7}.tox-comments-visible .tox-comment--active{background-color:#ffe168}.tox-checklist>li:not(.tox-checklist--hidden){list-style:none;margin:.25em 0}.tox-checklist>li:not(.tox-checklist--hidden)::before{content:url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cg%20id%3D%22checklist-unchecked%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Crect%20id%3D%22Rectangle%22%20width%3D%2215%22%20height%3D%2215%22%20x%3D%22.5%22%20y%3D%22.5%22%20fill-rule%3D%22nonzero%22%20stroke%3D%22%234C4C4C%22%20rx%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E%0A");cursor:pointer;height:1em;margin-left:-1.5em;margin-top:.125em;position:absolute;width:1em}.tox-checklist li:not(.tox-checklist--hidden).tox-checklist--checked::before{content:url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cg%20id%3D%22checklist-checked%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Crect%20id%3D%22Rectangle%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%234099FF%22%20fill-rule%3D%22nonzero%22%20rx%3D%222%22%2F%3E%3Cpath%20id%3D%22Path%22%20fill%3D%22%23FFF%22%20fill-rule%3D%22nonzero%22%20d%3D%22M11.5703186%2C3.14417309%20C11.8516238%2C2.73724603%2012.4164781%2C2.62829933%2012.83558%2C2.89774797%20C13.260121%2C3.17069355%2013.3759736%2C3.72932262%2013.0909105%2C4.14168582%20L7.7580587%2C11.8560195%20C7.43776896%2C12.3193404%206.76483983%2C12.3852142%206.35607322%2C11.9948725%20L3.02491697%2C8.8138662%20C2.66090143%2C8.46625845%202.65798871%2C7.89594698%203.01850234%2C7.54483354%20C3.373942%2C7.19866177%203.94940006%2C7.19592841%204.30829608%2C7.5386474%20L6.85276923%2C9.9684299%20L11.5703186%2C3.14417309%20Z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E%0A")}[dir=rtl] .tox-checklist>li:not(.tox-checklist--hidden)::before{margin-left:0;margin-right:-1.5em}code[class*=language-],pre[class*=language-]{color:#000;background:0 0;text-shadow:0 1px #fff;font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;tab-size:4;-webkit-hyphens:none;-ms-hyphens:none;hyphens:none}code[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,pre[class*=language-]::-moz-selection{text-shadow:none;background:#b3d4fc}code[class*=language-] ::selection,code[class*=language-]::selection,pre[class*=language-] ::selection,pre[class*=language-]::selection{text-shadow:none;background:#b3d4fc}@media print{code[class*=language-],pre[class*=language-]{text-shadow:none}}pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto}:not(pre)>code[class*=language-],pre[class*=language-]{background:#f5f2f0}:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em;white-space:normal}.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#708090}.token.punctuation{color:#999}.namespace{opacity:.7}.token.boolean,.token.constant,.token.deleted,.token.number,.token.property,.token.symbol,.token.tag{color:#905}.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string{color:#690}.language-css .token.string,.style .token.string,.token.entity,.token.operator,.token.url{color:#9a6e3a;background:hsla(0,0%,100%,.5)}.token.atrule,.token.attr-value,.token.keyword{color:#07a}.token.class-name,.token.function{color:#dd4a68}.token.important,.token.regex,.token.variable{color:#e90}.token.bold,.token.important{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}.mce-content-body{overflow-wrap:break-word;word-wrap:break-word}.mce-content-body .mce-visual-caret{background-color:#000;background-color:currentColor;position:absolute}.mce-content-body .mce-visual-caret-hidden{display:none}.mce-content-body [data-mce-caret]{left:-1000px;margin:0;padding:0;position:absolute;right:auto;top:0}.mce-content-body .mce-offscreen-selection{left:-2000000px;max-width:1000000px;position:absolute}.mce-content-body [contentEditable=false]{cursor:default}.mce-content-body [contentEditable=true]{cursor:text}.tox-cursor-format-painter{cursor:url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%0A%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%3Cpath%20fill%3D%22%23000%22%20fill-rule%3D%22nonzero%22%20d%3D%22M15%2C6%20C15%2C5.45%2014.55%2C5%2014%2C5%20L6%2C5%20C5.45%2C5%205%2C5.45%205%2C6%20L5%2C10%20C5%2C10.55%205.45%2C11%206%2C11%20L14%2C11%20C14.55%2C11%2015%2C10.55%2015%2C10%20L15%2C9%20L16%2C9%20L16%2C12%20L9%2C12%20L9%2C19%20C9%2C19.55%209.45%2C20%2010%2C20%20L11%2C20%20C11.55%2C20%2012%2C19.55%2012%2C19%20L12%2C14%20L18%2C14%20L18%2C7%20L15%2C7%20L15%2C6%20Z%22%2F%3E%0A%20%20%20%20%3Cpath%20fill%3D%22%23000%22%20fill-rule%3D%22nonzero%22%20d%3D%22M1%2C1%20L8.25%2C1%20C8.66421356%2C1%209%2C1.33578644%209%2C1.75%20L9%2C1.75%20C9%2C2.16421356%208.66421356%2C2.5%208.25%2C2.5%20L2.5%2C2.5%20L2.5%2C8.25%20C2.5%2C8.66421356%202.16421356%2C9%201.75%2C9%20L1.75%2C9%20C1.33578644%2C9%201%2C8.66421356%201%2C8.25%20L1%2C1%20Z%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A"),default}.mce-content-body figure.align-left{float:left}.mce-content-body figure.align-right{float:right}.mce-content-body figure.image.align-center{display:table;margin-left:auto;margin-right:auto}.mce-preview-object{border:1px solid gray;display:inline-block;line-height:0;margin:0 2px 0 2px;position:relative}.mce-preview-object .mce-shim{background:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7);height:100%;left:0;position:absolute;top:0;width:100%}.mce-preview-object[data-mce-selected="2"] .mce-shim{display:none}.mce-object{background:transparent url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M4%203h16a1%201%200%200%201%201%201v16a1%201%200%200%201-1%201H4a1%201%200%200%201-1-1V4a1%201%200%200%201%201-1zm1%202v14h14V5H5zm4.79%202.565l5.64%204.028a.5.5%200%200%201%200%20.814l-5.64%204.028a.5.5%200%200%201-.79-.407V7.972a.5.5%200%200%201%20.79-.407z%22%2F%3E%3C%2Fsvg%3E%0A") no-repeat center;border:1px dashed #aaa}.mce-pagebreak{border:1px dashed #aaa;cursor:default;display:block;height:5px;margin-top:15px;page-break-before:always;width:100%}@media print{.mce-pagebreak{border:0}}.tiny-pageembed .mce-shim{background:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7);height:100%;left:0;position:absolute;top:0;width:100%}.tiny-pageembed[data-mce-selected="2"] .mce-shim{display:none}.tiny-pageembed{display:inline-block;position:relative}.tiny-pageembed--16by9,.tiny-pageembed--1by1,.tiny-pageembed--21by9,.tiny-pageembed--4by3{display:block;overflow:hidden;padding:0;position:relative;width:100%}.tiny-pageembed--21by9{padding-top:42.857143%}.tiny-pageembed--16by9{padding-top:56.25%}.tiny-pageembed--4by3{padding-top:75%}.tiny-pageembed--1by1{padding-top:100%}.tiny-pageembed--16by9 iframe,.tiny-pageembed--1by1 iframe,.tiny-pageembed--21by9 iframe,.tiny-pageembed--4by3 iframe{border:0;height:100%;left:0;position:absolute;top:0;width:100%}.mce-content-body[data-mce-placeholder]{position:relative}.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before{color:rgba(34,47,62,.7);content:attr(data-mce-placeholder);position:absolute}.mce-content-body:not([dir=rtl])[data-mce-placeholder]:not(.mce-visualblocks)::before{left:1px}.mce-content-body[dir=rtl][data-mce-placeholder]:not(.mce-visualblocks)::before{right:1px}.mce-content-body div.mce-resizehandle{background-color:#4099ff;border-color:#4099ff;border-style:solid;border-width:1px;box-sizing:border-box;height:10px;position:absolute;width:10px;z-index:1298}.mce-content-body div.mce-resizehandle:hover{background-color:#4099ff}.mce-content-body div.mce-resizehandle:nth-of-type(1){cursor:nwse-resize}.mce-content-body div.mce-resizehandle:nth-of-type(2){cursor:nesw-resize}.mce-content-body div.mce-resizehandle:nth-of-type(3){cursor:nwse-resize}.mce-content-body div.mce-resizehandle:nth-of-type(4){cursor:nesw-resize}.mce-content-body .mce-resize-backdrop{z-index:10000}.mce-content-body .mce-clonedresizable{cursor:default;opacity:.5;outline:1px dashed #000;position:absolute;z-index:10001}.mce-content-body .mce-clonedresizable.mce-resizetable-columns td,.mce-content-body .mce-clonedresizable.mce-resizetable-columns th{border:0}.mce-content-body .mce-resize-helper{background:#555;background:rgba(0,0,0,.75);border:1px;border-radius:3px;color:#fff;display:none;font-family:sans-serif;font-size:12px;line-height:14px;margin:5px 10px;padding:5px;position:absolute;white-space:nowrap;z-index:10002}.tox-rtc-user-selection{position:relative}.tox-rtc-user-cursor{bottom:0;cursor:default;position:absolute;top:0;width:2px}.tox-rtc-user-cursor::before{background-color:inherit;border-radius:50%;content:'';display:block;height:8px;position:absolute;right:-3px;top:-3px;width:8px}.tox-rtc-user-cursor:hover::after{background-color:inherit;border-radius:100px;box-sizing:border-box;color:#fff;content:attr(data-user);display:block;font-size:12px;font-weight:700;left:-5px;min-height:8px;min-width:8px;padding:0 12px;position:absolute;top:-11px;white-space:nowrap;z-index:1000}.tox-rtc-user-selection--1 .tox-rtc-user-cursor{background-color:#2dc26b}.tox-rtc-user-selection--2 .tox-rtc-user-cursor{background-color:#e03e2d}.tox-rtc-user-selection--3 .tox-rtc-user-cursor{background-color:#f1c40f}.tox-rtc-user-selection--4 .tox-rtc-user-cursor{background-color:#3598db}.tox-rtc-user-selection--5 .tox-rtc-user-cursor{background-color:#b96ad9}.tox-rtc-user-selection--6 .tox-rtc-user-cursor{background-color:#e67e23}.tox-rtc-user-selection--7 .tox-rtc-user-cursor{background-color:#aaa69d}.tox-rtc-user-selection--8 .tox-rtc-user-cursor{background-color:#f368e0}.tox-rtc-remote-image{background:#eaeaea url("data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2236%22%20height%3D%2212%22%20viewBox%3D%220%200%2036%2012%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Ccircle%20cx%3D%226%22%20cy%3D%226%22%20r%3D%223%22%20fill%3D%22rgba(0%2C%200%2C%200%2C%20.2)%22%3E%0A%20%20%20%20%3Canimate%20attributeName%3D%22r%22%20values%3D%223%3B5%3B3%22%20calcMode%3D%22linear%22%20dur%3D%221s%22%20repeatCount%3D%22indefinite%22%20%2F%3E%0A%20%20%3C%2Fcircle%3E%0A%20%20%3Ccircle%20cx%3D%2218%22%20cy%3D%226%22%20r%3D%223%22%20fill%3D%22rgba(0%2C%200%2C%200%2C%20.2)%22%3E%0A%20%20%20%20%3Canimate%20attributeName%3D%22r%22%20values%3D%223%3B5%3B3%22%20calcMode%3D%22linear%22%20begin%3D%22.33s%22%20dur%3D%221s%22%20repeatCount%3D%22indefinite%22%20%2F%3E%0A%20%20%3C%2Fcircle%3E%0A%20%20%3Ccircle%20cx%3D%2230%22%20cy%3D%226%22%20r%3D%223%22%20fill%3D%22rgba(0%2C%200%2C%200%2C%20.2)%22%3E%0A%20%20%20%20%3Canimate%20attributeName%3D%22r%22%20values%3D%223%3B5%3B3%22%20calcMode%3D%22linear%22%20begin%3D%22.66s%22%20dur%3D%221s%22%20repeatCount%3D%22indefinite%22%20%2F%3E%0A%20%20%3C%2Fcircle%3E%0A%3C%2Fsvg%3E%0A") no-repeat center center;border:1px solid #ccc;min-height:240px;min-width:320px}.mce-match-marker{background:#aaa;color:#fff}.mce-match-marker-selected{background:#39f;color:#fff}.mce-match-marker-selected::-moz-selection{background:#39f;color:#fff}.mce-match-marker-selected::selection{background:#39f;color:#fff}.mce-content-body audio[data-mce-selected],.mce-content-body embed[data-mce-selected],.mce-content-body img[data-mce-selected],.mce-content-body object[data-mce-selected],.mce-content-body table[data-mce-selected],.mce-content-body video[data-mce-selected]{outline:3px solid #b4d7ff}.mce-content-body hr[data-mce-selected]{outline:3px solid #b4d7ff;outline-offset:1px}.mce-content-body [contentEditable=false] [contentEditable=true]:focus{outline:3px solid #b4d7ff}.mce-content-body [contentEditable=false] [contentEditable=true]:hover{outline:3px solid #b4d7ff}.mce-content-body [contentEditable=false][data-mce-selected]{cursor:not-allowed;outline:3px solid #b4d7ff}.mce-content-body.mce-content-readonly [contentEditable=true]:focus,.mce-content-body.mce-content-readonly [contentEditable=true]:hover{outline:0}.mce-content-body [data-mce-selected=inline-boundary]{background-color:#b4d7ff}.mce-content-body .mce-edit-focus{outline:3px solid #b4d7ff}.mce-content-body td[data-mce-selected],.mce-content-body th[data-mce-selected]{position:relative}.mce-content-body td[data-mce-selected]::-moz-selection,.mce-content-body th[data-mce-selected]::-moz-selection{background:0 0}.mce-content-body td[data-mce-selected]::selection,.mce-content-body th[data-mce-selected]::selection{background:0 0}.mce-content-body td[data-mce-selected] *,.mce-content-body th[data-mce-selected] *{outline:0;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mce-content-body td[data-mce-selected]::after,.mce-content-body th[data-mce-selected]::after{background-color:rgba(180,215,255,.7);border:1px solid rgba(180,215,255,.7);bottom:-1px;content:'';left:-1px;mix-blend-mode:multiply;position:absolute;right:-1px;top:-1px}@media screen and (-ms-high-contrast:active),(-ms-high-contrast:none){.mce-content-body td[data-mce-selected]::after,.mce-content-body th[data-mce-selected]::after{border-color:rgba(0,84,180,.7)}}.mce-content-body img::-moz-selection{background:0 0}.mce-content-body img::selection{background:0 0}.ephox-snooker-resizer-bar{background-color:#b4d7ff;opacity:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ephox-snooker-resizer-cols{cursor:col-resize}.ephox-snooker-resizer-rows{cursor:row-resize}.ephox-snooker-resizer-bar.ephox-snooker-resizer-bar-dragging{opacity:1}.mce-spellchecker-word{background-image:url("data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D'4'%20height%3D'4'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpath%20stroke%3D'%23ff0000'%20fill%3D'none'%20stroke-linecap%3D'round'%20stroke-opacity%3D'.75'%20d%3D'M0%203L2%201%204%203'%2F%3E%3C%2Fsvg%3E%0A");background-position:0 calc(100% + 1px);background-repeat:repeat-x;background-size:auto 6px;cursor:default;height:2rem}.mce-spellchecker-grammar{background-image:url("data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D'4'%20height%3D'4'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpath%20stroke%3D'%2300A835'%20fill%3D'none'%20stroke-linecap%3D'round'%20d%3D'M0%203L2%201%204%203'%2F%3E%3C%2Fsvg%3E%0A");background-position:0 calc(100% + 1px);background-repeat:repeat-x;background-size:auto 6px;cursor:default}.mce-toc{border:1px solid gray}.mce-toc h2{margin:4px}.mce-toc li{list-style-type:none}.mce-item-table:not([border]),.mce-item-table:not([border]) caption,.mce-item-table:not([border]) td,.mce-item-table:not([border]) th,.mce-item-table[border="0"],.mce-item-table[border="0"] caption,.mce-item-table[border="0"] td,.mce-item-table[border="0"] th,table[style*="border-width: 0px"],table[style*="border-width: 0px"] caption,table[style*="border-width: 0px"] td,table[style*="border-width: 0px"] th{border:1px dashed #bbb}.mce-visualblocks address,.mce-visualblocks article,.mce-visualblocks aside,.mce-visualblocks blockquote,.mce-visualblocks div:not([data-mce-bogus]),.mce-visualblocks dl,.mce-visualblocks figcaption,.mce-visualblocks figure,.mce-visualblocks h1,.mce-visualblocks h2,.mce-visualblocks h3,.mce-visualblocks h4,.mce-visualblocks h5,.mce-visualblocks h6,.mce-visualblocks hgroup,.mce-visualblocks ol,.mce-visualblocks p,.mce-visualblocks pre,.mce-visualblocks section,.mce-visualblocks ul{background-repeat:no-repeat;border:1px dashed #bbb;margin-left:3px;padding-top:10px}.mce-visualblocks p{background-image:url(data:image/gif;base64,R0lGODlhCQAJAJEAAAAAAP///7u7u////yH5BAEAAAMALAAAAAAJAAkAAAIQnG+CqCN/mlyvsRUpThG6AgA7)}.mce-visualblocks h1{background-image:url(data:image/gif;base64,R0lGODlhDQAKAIABALu7u////yH5BAEAAAEALAAAAAANAAoAAAIXjI8GybGu1JuxHoAfRNRW3TWXyF2YiRUAOw==)}.mce-visualblocks h2{background-image:url(data:image/gif;base64,R0lGODlhDgAKAIABALu7u////yH5BAEAAAEALAAAAAAOAAoAAAIajI8Hybbx4oOuqgTynJd6bGlWg3DkJzoaUAAAOw==)}.mce-visualblocks h3{background-image:url(data:image/gif;base64,R0lGODlhDgAKAIABALu7u////yH5BAEAAAEALAAAAAAOAAoAAAIZjI8Hybbx4oOuqgTynJf2Ln2NOHpQpmhAAQA7)}.mce-visualblocks h4{background-image:url(data:image/gif;base64,R0lGODlhDgAKAIABALu7u////yH5BAEAAAEALAAAAAAOAAoAAAIajI8HybbxInR0zqeAdhtJlXwV1oCll2HaWgAAOw==)}.mce-visualblocks h5{background-image:url(data:image/gif;base64,R0lGODlhDgAKAIABALu7u////yH5BAEAAAEALAAAAAAOAAoAAAIajI8HybbxIoiuwjane4iq5GlW05GgIkIZUAAAOw==)}.mce-visualblocks h6{background-image:url(data:image/gif;base64,R0lGODlhDgAKAIABALu7u////yH5BAEAAAEALAAAAAAOAAoAAAIajI8HybbxIoiuwjan04jep1iZ1XRlAo5bVgAAOw==)}.mce-visualblocks div:not([data-mce-bogus]){background-image:url(data:image/gif;base64,R0lGODlhEgAKAIABALu7u////yH5BAEAAAEALAAAAAASAAoAAAIfjI9poI0cgDywrhuxfbrzDEbQM2Ei5aRjmoySW4pAAQA7)}.mce-visualblocks section{background-image:url(data:image/gif;base64,R0lGODlhKAAKAIABALu7u////yH5BAEAAAEALAAAAAAoAAoAAAI5jI+pywcNY3sBWHdNrplytD2ellDeSVbp+GmWqaDqDMepc8t17Y4vBsK5hDyJMcI6KkuYU+jpjLoKADs=)}.mce-visualblocks article{background-image:url(data:image/gif;base64,R0lGODlhKgAKAIABALu7u////yH5BAEAAAEALAAAAAAqAAoAAAI6jI+pywkNY3wG0GBvrsd2tXGYSGnfiF7ikpXemTpOiJScasYoDJJrjsG9gkCJ0ag6KhmaIe3pjDYBBQA7)}.mce-visualblocks blockquote{background-image:url(data:image/gif;base64,R0lGODlhPgAKAIABALu7u////yH5BAEAAAEALAAAAAA+AAoAAAJPjI+py+0Knpz0xQDyuUhvfoGgIX5iSKZYgq5uNL5q69asZ8s5rrf0yZmpNkJZzFesBTu8TOlDVAabUyatguVhWduud3EyiUk45xhTTgMBBQA7)}.mce-visualblocks address{background-image:url(data:image/gif;base64,R0lGODlhLQAKAIABALu7u////yH5BAEAAAEALAAAAAAtAAoAAAI/jI+pywwNozSP1gDyyZcjb3UaRpXkWaXmZW4OqKLhBmLs+K263DkJK7OJeifh7FicKD9A1/IpGdKkyFpNmCkAADs=)}.mce-visualblocks pre{background-image:url(data:image/gif;base64,R0lGODlhFQAKAIABALu7uwAAACH5BAEAAAEALAAAAAAVAAoAAAIjjI+ZoN0cgDwSmnpz1NCueYERhnibZVKLNnbOq8IvKpJtVQAAOw==)}.mce-visualblocks figure{background-image:url(data:image/gif;base64,R0lGODlhJAAKAIAAALu7u////yH5BAEAAAEALAAAAAAkAAoAAAI0jI+py+2fwAHUSFvD3RlvG4HIp4nX5JFSpnZUJ6LlrM52OE7uSWosBHScgkSZj7dDKnWAAgA7)}.mce-visualblocks figcaption{border:1px dashed #bbb}.mce-visualblocks hgroup{background-image:url(data:image/gif;base64,R0lGODlhJwAKAIABALu7uwAAACH5BAEAAAEALAAAAAAnAAoAAAI3jI+pywYNI3uB0gpsRtt5fFnfNZaVSYJil4Wo03Hv6Z62uOCgiXH1kZIIJ8NiIxRrAZNMZAtQAAA7)}.mce-visualblocks aside{background-image:url(data:image/gif;base64,R0lGODlhHgAKAIABAKqqqv///yH5BAEAAAEALAAAAAAeAAoAAAItjI+pG8APjZOTzgtqy7I3f1yehmQcFY4WKZbqByutmW4aHUd6vfcVbgudgpYCADs=)}.mce-visualblocks ul{background-image:url(data:image/gif;base64,R0lGODlhDQAKAIAAALu7u////yH5BAEAAAEALAAAAAANAAoAAAIXjI8GybGuYnqUVSjvw26DzzXiqIDlVwAAOw==)}.mce-visualblocks ol{background-image:url(data:image/gif;base64,R0lGODlhDQAKAIABALu7u////yH5BAEAAAEALAAAAAANAAoAAAIXjI8GybH6HHt0qourxC6CvzXieHyeWQAAOw==)}.mce-visualblocks dl{background-image:url(data:image/gif;base64,R0lGODlhDQAKAIABALu7u////yH5BAEAAAEALAAAAAANAAoAAAIXjI8GybEOnmOvUoWznTqeuEjNSCqeGRUAOw==)}.mce-visualblocks:not([dir=rtl]) address,.mce-visualblocks:not([dir=rtl]) article,.mce-visualblocks:not([dir=rtl]) aside,.mce-visualblocks:not([dir=rtl]) blockquote,.mce-visualblocks:not([dir=rtl]) div:not([data-mce-bogus]),.mce-visualblocks:not([dir=rtl]) dl,.mce-visualblocks:not([dir=rtl]) figcaption,.mce-visualblocks:not([dir=rtl]) figure,.mce-visualblocks:not([dir=rtl]) h1,.mce-visualblocks:not([dir=rtl]) h2,.mce-visualblocks:not([dir=rtl]) h3,.mce-visualblocks:not([dir=rtl]) h4,.mce-visualblocks:not([dir=rtl]) h5,.mce-visualblocks:not([dir=rtl]) h6,.mce-visualblocks:not([dir=rtl]) hgroup,.mce-visualblocks:not([dir=rtl]) ol,.mce-visualblocks:not([dir=rtl]) p,.mce-visualblocks:not([dir=rtl]) pre,.mce-visualblocks:not([dir=rtl]) section,.mce-visualblocks:not([dir=rtl]) ul{margin-left:3px}.mce-visualblocks[dir=rtl] address,.mce-visualblocks[dir=rtl] article,.mce-visualblocks[dir=rtl] aside,.mce-visualblocks[dir=rtl] blockquote,.mce-visualblocks[dir=rtl] div:not([data-mce-bogus]),.mce-visualblocks[dir=rtl] dl,.mce-visualblocks[dir=rtl] figcaption,.mce-visualblocks[dir=rtl] figure,.mce-visualblocks[dir=rtl] h1,.mce-visualblocks[dir=rtl] h2,.mce-visualblocks[dir=rtl] h3,.mce-visualblocks[dir=rtl] h4,.mce-visualblocks[dir=rtl] h5,.mce-visualblocks[dir=rtl] h6,.mce-visualblocks[dir=rtl] hgroup,.mce-visualblocks[dir=rtl] ol,.mce-visualblocks[dir=rtl] p,.mce-visualblocks[dir=rtl] pre,.mce-visualblocks[dir=rtl] section,.mce-visualblocks[dir=rtl] ul{background-position-x:right;margin-right:3px}.mce-nbsp,.mce-shy{background:#aaa}.mce-shy::after{content:'-'}body{font-family:sans-serif}table{border-collapse:collapse}
        `,
      min_height: 500,
      relative_urls: false,
      convert_urls: false,
      menu: {
        // 默认值：
        // https://www.tiny.cloud/docs/configure/editor-appearance/#examplethetinymcedefaultmenuitems
        insert: {
          title: 'Insert',
          items: 'localimage localvideo localaudio docx | link mobilelink tel | image media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor | insertdatetime'
        },
        view: {
          title: 'View',
          items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | icons skin'
        },
        format: {
          title: 'Format',
          items: `bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat${planGrade.value > 0 ? ' configurepermanentpen' : ''}`
        },
      },
      menubar: 'file edit view insert format tools table help',
      image_advtab: true,
      image_caption: true,
      // 开启时，出现两个 bug：1. 部分菜单项失效；2. 拖拉拽调整视频大小会错位
      media_live_embeds: false,
      toolbar_mode: 'sliding',
      toolbar_sticky: true,
      //extended_valid_elements: 'img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|referrerpolicy=no-referrer]',
      language: 'zh_CN',
      init_instance_callback: editor => {
        loading.value = false
      },
      // base_url: './tinymce-static/',
      // language_url: './tinymce-static/zh_CN.js',
      // skin_url: './tinymce-static',
      // theme_url: './tinymce-static/theme.min.js',
      // 由于content.css应用于iframe内部 所以直接import不生效 必须在这里指定 但是组件外部也同样需要将该文件放入public才能访问到 所以只能使用content_style
      // content_css: './tinymce-static/content.min.css',
      setup: editor => {
        /*if (planGrade.value > 0) {
          /!**
           * 皮肤
           *!/
          let iconsList = [
            '默认',
            'jam',
            'small',
          ]
          let skinsList = [
            'oxide',
            'material-classic',
            'material-outline', // todo: 无法切换
            'bootstrap',
            'fabric',
            'borderless',
            'naked',
            'outside',
            'snow',
          ]
          if (localStorage[`${name}-icons`] === undefined || iconsList.includes(localStorage[`${name}-icons`])) {
            skinsList = [
              ...skinsList,
              'small',
              'jam',
            ]
          }
          skinsList.map(text => {
            editor.ui.registry.addToggleMenuItem(`toggleMenuItem-skin-${text}`, {
              text,
              active: (localStorage[`${name}-skin`] || 'oxide') === text,
              /!*onSetup: api => {
              if (!localStorage[`${name}-skin`]) {
                localStorage[`${name}-skin`] = defaultPremiumSkin
                api.setActive(true)
              }
              return function () {}
            },*!/
              onAction: () => {
                if (text === 'oxide') {
                  delete Init.value.skin
                  localStorage.removeItem(`${name}-skin`)
                } else {
                  Init.value.skin = text
                  localStorage[`${name}-skin`] = text
                }
                window.location.reload()
              },
            })
          })
          editor.ui.registry.addNestedMenuItem('skin', {
            text: '皮肤',
            getSubmenuItems: () => skinsList.map(text => `toggleMenuItem-skin-${text}`)
          })

          /!**
           * 图标风格
           *!/
          if (!iconsList.includes(localStorage[`${name}-skin`])) {
            iconsList = [
              ...iconsList,
              'bootstrap',
              'material',
              'thin',
            ]
          }
          iconsList.map(text => {
            editor.ui.registry.addToggleMenuItem(`toggleMenuItem-icons-${text}`, {
              text,
              active: (localStorage[`${name}-icons`] || '默认') === text,
              onAction: () => {
                if (text === '默认') {
                  delete Init.value.icons
                  localStorage.removeItem(`${name}-icons`)
                } else {
                  Init.value.icons = text
                  localStorage[`${name}-icons`] = text
                }
                window.location.reload()
              },
            })
          })
          editor.ui.registry.addNestedMenuItem('icons', {
            text: '图标风格',
            getSubmenuItems: () => iconsList.map(text => `toggleMenuItem-icons-${text}`)
          })
        }*/

        /**
         * 电话号码
         */
        editor.ui.registry.addIcon('tel', `<svg t="1593331139446" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10282" width="200" height="200"><path d="M780.207 868.621c0 48.892-40.51 89.402-89.402 89.402L333.195 958.023c-48.892 0-89.402-40.511-89.402-89.402L243.793 153.402c0-48.891 40.51-89.402 89.402-89.402l357.609 0c48.893 0 89.402 40.511 89.402 89.402L780.206 868.621zM713.155 265.155c0-11.875-10.478-22.351-22.351-22.351L333.195 242.804c-11.874 0-22.351 10.476-22.351 22.351l0 491.713c0 11.874 10.477 22.351 22.351 22.351l357.609 0c11.873 0 22.351-10.477 22.351-22.351L713.155 265.155zM567.877 153.402 456.124 153.402c-6.286 0-11.175 4.89-11.175 11.176 0 6.284 4.889 11.174 11.175 11.174l111.753 0c6.285 0 11.175-4.89 11.175-11.174C579.052 158.292 574.162 153.402 567.877 153.402zM512 812.744c-30.732 0-55.876 25.145-55.876 55.877s25.145 55.877 55.876 55.877c30.732 0 55.877-25.145 55.877-55.877S542.732 812.744 512 812.744z" p-id="10283"></path></svg>`)
        editor.ui.registry.addMenuItem('tel', {
          text: '电话号码',
          icon: 'tel',
          onAction: () => {
            showTelInsertion.value = true
          }
        })

        /**
         * 插入 Word 文档
         */
        editor.ui.registry.addMenuItem('docx', {
          text: 'Word 文档',
          icon: 'new-document',
          onAction: () => {
            showWordInsertion.value = true
          }
        })
      }
    }], {
      default: userProp => {
        const allowIframe = !/\biframe\b/.test(userProp.invalid_elements)
        //const allowAudio = !/\baudio\b/.test(userProp.invalid_elements)
        return {
          ...planGrade.value > 0 && {
            ...localStorage[`${name}-skin`] && { skin: localStorage[`${name}-skin`] },
            ...localStorage[`${name}-icons`] && { icons: localStorage[`${name}-icons`] },
            //powerpaste_keep_unsupported_src: true, // todo: If your application has access to the file system, setting powerpaste_keep_unsupported_src to true may allow you to replace unsupported images during post-processing using the original file paths.
            powerpaste_html_import: 'merge',
            powerpaste_word_import: 'merge',
            plugins: `print preview powerpaste casechange importcss searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists checklist wordcount textpattern noneditable help formatpainter permanentpen${allowIframe ? ' pageembed' : ''} charmap quickbars emoticons advtable`,
            mobile: {
              plugins: `print preview powerpaste casechange importcss searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists checklist wordcount textpattern noneditable help formatpainter${allowIframe ? ' pageembed' : ''} charmap quickbars emoticons advtable`
            },
            toolbar: `undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media${allowIframe ? ' pageembed' : ''} template link anchor codesample | ltr rtl`,
          },
          ...planGrade.value > 1 && {
            plugins: `print preview powerpaste casechange importcss searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter permanentpen${allowIframe ? ' pageembed' : ''} charmap quickbars linkchecker emoticons advtable`,
            mobile: {
              plugins: `print preview powerpaste casechange importcss searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter${allowIframe ? ' pageembed' : ''} charmap quickbars linkchecker emoticons advtable`
            },
            toolbar: `undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media${allowIframe ? ' pageembed' : ''} template link anchor codesample | a11ycheck ltr rtl`,
          },
          ...planGrade.value > 2 && {
            plugins: `print preview powerpaste casechange importcss searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter permanentpen${allowIframe ? ' pageembed' : ''} charmap tinycomments mentions quickbars linkchecker emoticons advtable`,
            mobile: {
              plugins: `print preview powerpaste casechange importcss searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter${allowIframe ? ' pageembed' : ''} charmap mentions quickbars linkchecker emoticons advtable`,
            },
            toolbar: `undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media${allowIframe ? ' pageembed' : ''} template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment`,
          },
        }
      },
      defaultIsDynamic: true,
      camelCase: false,
      mergeFunction: (accumulator, item) => (...args) => {
        accumulator(...args)
        item?.(...args)
      },
      name: 'init',
      type: 'object',
    }))

    /*function importSkin () {
      //require('./assets/5.7.1-108/skin/default-content.min.css').default

      const skin = localStorage[`${name}-skin`]
      if (planGrade.value > 0 && skin) {
        require(`./assets/5.7.1-108/skin/${skin}.min.css`).default
        require(`./assets/5.7.1-108/skin/${skin}-content.min.css`).default
      } else {
        require('tinymce/skins/ui/oxide/skin.min.css').default
      }
    }

    function importIcons () {
      require('tinymce/icons/default').default

      const icons = localStorage[`${name}-icons`]
      if (planGrade.value > 0 && icons) {
        // 将与默认图标进行合并
        require(`./assets/5.7.1-108/icons/${icons}.js`).default
      }
    }

    function importPlugins () {
      if (planGrade.value === 0) {
        require('tinymce/plugins/paste').default
      } else {
        // 增强粘贴：主要用于office文档粘贴
        require('./assets/5.10.2-126/plugins/powerpaste/plugin.min').default
        // 表格排序
        require('./assets/5.10.2-126/plugins/advtable/plugin.min').default
        // 一键转换大小写、首字母大写
        require('./assets/5.10.2-126/plugins/casechange/plugin.min').default
        // 插入清单
        require('./assets/5.10.2-126/plugins/checklist/plugin.min').default
        // 格式刷
        require('./assets/5.10.2-126/plugins/formatpainter/plugin.min').default
        // 永久笔：允许预设一套文字格式 应用于新输入的内容
        require('./assets/5.10.2-126/plugins/permanentpen/plugin.min').default
        if (!/\biframe\b/.test(Init.value.invalid_elements)) {
          // 插入iframe：以可视化的方式插入子页面
          require('./assets/5.10.2-126/plugins/pageembed/plugin.min').default
        }
        // 增强代码编辑：语法高亮/元素匹配/元素闭合/代码折叠/多选/多行光标/查找替换
        require('./assets/5.10.2-126/plugins/advcode/plugin.min').default

        if (planGrade.value > 1) {
          require('./assets/5.10.2-126/plugins/a11ychecker/plugin.min').default
          require('./assets/5.10.2-126/plugins/linkchecker/plugin.min').default
          require('./assets/5.10.2-126/plugins/tinymcespellchecker/plugin.min').default
        }

        if (planGrade.value > 2) {
          require('./assets/5.10.2-126/plugins/mentions/plugin.min').default
          require('./assets/5.10.2-126/plugins/tinycomments/plugin.min').default
        }
      }
    }*/

    function insertContent (tag) {
      window.tinymce.get(tinymceId.value).insertContent(tag)
    }

    //importSkin()
    //importIcons()
    //importPlugins()

    watch(() => props.modelValue, (n, o) => {
      value__.value = n
    }, {
      immediate: true,
    })

    watch(value__, (n, o) => {
      emit('update:modelValue', n)
    })

    watch(EventBus, (n, o) => {
      if (n) {
        EventBus.value.on('MiniMCE:insertContent', insertContent)
      }
    }, {
      immediate: true,
    })

    onUnmounted(() => {
      // window.tinymce?.get(tinymceId.value) 在 HMR 时为空
      window.tinymce?.get(tinymceId.value)?.setContent('')
      EventBus.value?.all.clear()
    })

    return {
      loading,
      tinymceId,
      showTelInsertion,
      showWordInsertion,
      value__,
      Readonly,
      ApiKey,
      Disabled,
      Init,
      insertContent,
    }
  },
  render (ctx: any) {
    // Vue 2 中 ctx 为渲染函数 h
    return isVue3 ?
      ctx.Readonly ?
        h('div', {
          class: 'minimce-readonly',
          innerHTML: ctx.value__
        })
        :
        h('div', {
          style: {
            height: '500px',
            position: 'relative',
          }
        }, [
          withDirectives(h(Spin), [
            [vShow, ctx.loading]
          ]),
          h(TinyMCE, {
            id: ctx.tinymceId,
            init: ctx.Init,
            apiKey: ctx.ApiKey,
            disabled: ctx.Disabled,
            modelValue: ctx.value__,
            'onUpdate:modelValue': (value: string | undefined | null) => this.$emit('update:modelValue', value),
            ...ctx.$attrs,
          })
        ])
      :
      this.Readonly ?
        h('div', {
          class: 'minimce-readonly',
          innerHTML: this.value__
        })
        :
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
          h(TinyMCE, {
            props: {
              id: this.tinymceId,
              init: this.Init,
              apiKey: this.ApiKey,
              disabled: this.Disabled,
              value: this.value__,
              ...this.$attrs,
            },
            on: {
              'update:value': (value: string | undefined | null) => this.$emit('update:value', value)
            },
          })
        ])
  }
})
