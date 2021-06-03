<template>
  <RichText
    v-if="inOperation"
    v-model="selfValue"
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
      <component :is="Filepool" v-bind="slotProps" v-model="slotProps['v_model'].file"/>
    </template>
  </RichText>
</template>

<script>
import RichText from './index.vue'
import globalProps from './config.ts'
import { isPlainObject, assignInWith, cloneDeep } from 'lodash-es'

/**
 * 参数有全局参数、实例参数和默认值之分 取哪个取决于用户传了哪个：
 *   1. 怎么判断用户传没传？ —— 以该参数是否全等于undefined作为标识
 *   2. 如果传了多个，权重顺序是怎样的？ —— 实例＞全局＞默认
 *
 * @param {any} prop - 实例参数
 * @param {any} globalProps - 全局参数（可以有多个）
 * @param {any} defaultValue - 默认值
 * @return {any} 最终值
 */
export function getFinalProp () {
  const args = Array.from(arguments)
  const defaultValue = args[args.length - 1]
  let result = defaultValue
  //console.log('传参：', cloneDeep(args))
  for (let i = 0; i < args.length - 1; i++) {
    const prop = args[i]
    if (prop !== undefined) {
      if (i === 0 && typeof (defaultValue) === 'boolean') {
        result = ['', true].includes(prop) ? true : prop
      } else if (isPlainObject(prop)) {
        result = assignInWith(...args, (objValue, srcValue) => objValue === undefined ? srcValue : objValue)
      } else {
        result = prop
      }
      break
    }
  }
  //console.log('生效：', result)
  return result
}

export default {
  name: 'Minimce',
  components: { RichText },
  props: {
    value: {
      type: String,
      default: '',
    },
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
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    const {
      MobileLink,
      Imgpond,
      Filepool,
    } = globalProps

    return {
      inOperation: true,
      MobileLink: getFinalProp(this.$attrs.MobileLink, MobileLink),
      Imgpond: getFinalProp(this.$attrs.Imgpond, Imgpond),
      Filepool: getFinalProp(this.$attrs.Filepool, Filepool),
      selfValue: '',
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
        tinymceOptions
      } = globalProps

      return {
        ...this.$attrs,
        disabled: getFinalProp(this.$attrs.disabled, disabled, false),
        readonly: getFinalProp(this.$attrs.readonly, readonly, false),
        apiKey: getFinalProp(this.$attrs.apiKey, apiKey, ''),
        tinymceOptions: getFinalProp(this.$attrs.tinymceOptions, tinymceOptions,),
        plan: getFinalProp(this.$attrs.plan, plan, 'core'),
        eventBus: getFinalProp(this.$attrs.eventBus, eventBus,)
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
