<template>
  <RichText
    v-if="inOperation"
    v-model="selfValue"
    :text.sync="selfText"
    v-bind="props"
    @reload="reload"
  >
    <template #mobilelink="{show}" v-if="MobileLink">
      <component :is="MobileLink" :show.sync="show.mobilelink"/>
    </template>
    <template #Imgpond="{slotProps}" v-if="Imgpond">
      <component :is="Imgpond" v-bind="slotProps" v-model="slotProps['v_model'].imgUrl"/>
    </template>
    <template #Filepool="{slotProps}" v-if="Filepool">
      <component :is="Filepool" v-bind="slotProps" v-model="slotProps['v_model'].fileUrl"/>
    </template>
  </RichText>
</template>

<script>
import RichText from './index.vue'
import globalProps from './config.ts'

/**
 * 参数有全局参数、实例参数和默认值之分 取哪个取决于用户传了哪个：
 *   1. 怎么判断用户传没传？ —— 以该参数是否全等于undefined作为标识
 *   2. 如果传了多个，权重顺序是怎样的？ —— 实例＞全局＞默认
 *
 * @param {any} globalProp - 全局参数
 * @param {any} prop - 实例参数
 * @param {any} defaultValue - 默认值
 * @return {any} 最终值
 */
function getFinalProp (globalProp, prop, defaultValue) {
  return prop !== undefined ?
    typeof defaultValue === 'boolean' ? ['', true].includes(prop) :
      prop :
    globalProp !== undefined ? globalProp :
      defaultValue
}

export default {
  name: 'Minimce',
  components: { RichText },
  props: {
    value: {
      type: String,
      default: '',
    },
    text: String,
  },
  watch: {
    value: {
      immediate: true,
      handler (newVal) {
        this.selfValue = newVal
      }
    },
    selfValue (newVal) {
      this.$emit('change', newVal)
    },
    text: {
      immediate: true,
      handler (newVal) {
        this.selfText = newVal
      }
    },
    selfText (newVal) {
      this.$emit('update:text', newVal)
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    const {
      Imgpond,
      Filepool,
      MobileLink,
    } = globalProps

    return {
      inOperation: true,
      MobileLink: MobileLink || this.$attrs.MobileLink,
      Imgpond: Imgpond || this.$attrs.Imgpond,
      Filepool: Filepool || this.$attrs.Filepool,
      selfValue: '',
      selfText: '',
    }
  },
  computed: {
    props () {
      const {
        plan,
        apiKey,
        disabled,
        readonly,
        eventBus,
        html2text,
        textMaxlength,
        tinymceOptions
      } = globalProps

      return {
        ...this.$attrs,
        disabled: getFinalProp(disabled, this.$attrs.disabled, false),
        readonly: getFinalProp(readonly, this.$attrs.readonly, false),
        html2text: getFinalProp(html2text, this.$attrs.html2text, false),
        apiKey: getFinalProp(apiKey, this.$attrs.apiKey, ''),
        textMaxlength: getFinalProp(textMaxlength, this.$attrs.textMaxlength, 30),
        tinymceOptions: getFinalProp(tinymceOptions, this.$attrs.tinymceOptions),
        plan: getFinalProp(plan, this.$attrs.plan, 'core'),
        eventBus: getFinalProp(eventBus, this.$attrs.eventBus)
      }
    }
  },
  methods: {
    async reload () {
      /*this.inOperation = false
      await this.$nextTick()
      this.inOperation = true*/
      window.location.reload()
    }
  }
}
</script>
