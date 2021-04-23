<template>
  <RichText
    v-model="selfValue"
    :text.sync="selfText"
    v-bind="props"
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
        html2text,
        textMaxlength,
        audioMenuItem,
        tinymceOptions
      } = globalProps

      return {
        ...this.$attrs,
        audioMenuItem: typeof this.$attrs.audioMenuItem === 'boolean' ?
          this.$attrs.audioMenuItem :
          typeof audioMenuItem === 'boolean' ?
            audioMenuItem : true,
        html2text: typeof this.$attrs.html2text === 'boolean' ?
          this.$attrs.html2text :
          typeof html2text === 'boolean' ?
            html2text : true,
        apiKey: this.$attrs.apiKey || apiKey,
        textMaxlength: this.$attrs.textMaxlength || textMaxlength,
        tinymceOptions: this.$attrs.tinymceOptions || tinymceOptions,
        plan
      }
    }
  }
}
</script>
