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
import { getFinalProp } from './utils.ts'

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
