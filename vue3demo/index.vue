<template>
  <MiniMCE
    v-model="modelValue"
    v-bind="props"
  />

  <br>
  <button @click="modelValue='<p>123</p><p>123</p>'">编程式设值</button>
  <button @click="modelValue=''">清空</button>

  <p>{{ modelValue }}</p>
  <p>{{ props }}</p>
</template>

<script setup>
import { ref } from 'vue'

const modelValue = ref('初始值')
const props = ref({
  readonly: true,
  disabled: false,
  apiKey: import.meta.env.VITE_APP_API_KEY,
})
</script>

<style lang="scss">
/*@media (prefers-color-scheme: dark) {
  body {
    filter: invert(1) hue-rotate(180deg);
    color: white;
  }
  img {
    filter: invert(1) hue-rotate(180deg);
  }
}*/
</style>
