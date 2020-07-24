<template>
  <Minimce v-model="selfValue"
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
  </Minimce>
</template>

<script>
import Minimce from './index'
import { apiKey, html2text, textMaxlength, audioMenuItem, Imgpond, Filepool, MobileLink } from './config.ts'

export default {
  name: 'RichText',
  components: { Minimce },
  props: {
    value: {
      type: String,
      default: '',
      required: true
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
    return {
      MobileLink: MobileLink || this.$slots.MobileLink,
      Imgpond: Imgpond || this.$slots.Imgpond,
      Filepool: Filepool || this.$slots.Filepool,
      selfValue: '',
      selfText: '',
    }
  },
  created() {
    console.log(this.$slots)
  },
  computed: {
    props () {
      return {
        ...this.$attrs,
        audioMenuItem: this.audioMenuItem === 'boolean' ?
          this.audioMenuItem :
          typeof audioMenuItem === 'boolean' ?
            audioMenuItem : true,
        apiKey: this.apiKey || apiKey,
        html2text: this.html2text || html2text,
        textMaxlength: this.textMaxlength || textMaxlength,
      }
    }
  }
}
</script>
