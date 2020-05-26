<template>
  <Minimce v-model="selfValue"
           :disabled="disabled"
           :customPlugins="['audio','video','img','mobilelink']"
           apiKey=""
  >
    <template #mobilelink="{show}">
      <InsertLink :show.sync="show.mobilelink"/>
    </template>
    <template #Imgpond="{slotProps}">
      <Imgpond v-bind="slotProps" v-model="slotProps['v_model'].imgUrl"/>
    </template>
    <template #Filepool="{slotProps}">
      <Filepool v-bind="slotProps" v-model="slotProps['v_model'].fileUrl"/>
    </template>
  </Minimce>
</template>

<script>
import Minimce from '../src/index'
//todo: import Minimce from 'minimce'
import InsertLink from './InsertLink'

export default {
  components: { Minimce, InsertLink },
  props: {
    value: {
      type: String,
      default: '',
      required: true
    },
    disabled: Boolean
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
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      selfValue: '',
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
