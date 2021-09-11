<template>
  <RichText
    v-if="inOperation"
    v-model="selfValue"
    v-bind="props"
    @reload="reload"
  >
    <template #mobilelink="{show}" v-if="MobileLink__">
      <component :is="MobileLink__" :show.sync="show.mobilelink"/>
    </template>
    <template #Imgpond="{slotProps}" v-if="Imgpond__">
      <component :is="Imgpond__" v-bind="slotProps" v-model="slotProps['v_model'].imgUrl"/>
    </template>
    <template #Filepool="{slotProps}" v-if="Filepool__">
      <component :is="Filepool__" v-bind="slotProps" v-model="slotProps['v_model'].file"/>
    </template>
  </RichText>
</template>

<script>
import RichText from './index.vue'
import globalConfig from './config.ts'
import { getFinalProp } from 'kayran'

export default {
  name: 'Minimce',
  components: { RichText },
  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: {},
    readonly: {},
    MobileLink: {},
    Imgpond: {},
    Filepool: {},
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
    } = globalConfig

    return {
      inOperation: true,
      MobileLink__: getFinalProp(
        [this.MobileLink, MobileLink], {
          name: 'Vue Instance'
        }
      ),
      Imgpond__: getFinalProp(
        [this.Imgpond, Imgpond], {
          name: 'Vue Instance'
        }
      ),
      Filepool__: getFinalProp(
        [this.Filepool, Filepool], {
          name: 'Vue Instance'
        }),
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
      } = globalConfig

      return {
        ...this.$attrs,
        disabled: getFinalProp([this.disabled, disabled, false], {
          type: 'boolean'
        }),
        readonly: getFinalProp([this.readonly, readonly, false], {
          type: 'boolean'
        }),
        apiKey: getFinalProp([this.$attrs.apiKey, apiKey, ''], {
          type: 'string'
        }),
        tinymceOptions: getFinalProp([this.$attrs.tinymceOptions, tinymceOptions,], {
          type: 'object'
        }),
        plan: getFinalProp([this.$attrs.plan, plan, 'core'], {
          type: 'string'
        }),
        eventBus: getFinalProp([this.$attrs.eventBus, eventBus,])
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
