<template>
  <MiniMCE
    v-if="onOperation"
    v-model="modelValue"
    v-bind="props"
  />

  <br>
  <button @click="modelValue='123'">编程式设值</button>
  <button @click="modelValue=''">清空</button>
  <button @click="onOperation=true" v-if="onOperation===false">挂载</button>
  <button @click="onOperation=false" v-else>销毁</button>
  <button @click="()=>{window.localStorage.clear()}">清缓存</button>

  <p>{{ modelValue }}</p>
  <p>{{ props }}</p>
</template>

<script setup>
import { ref } from 'vue-demi'

const onOperation = ref(true)
const modelValue = ref('初始值')
const props = ref({
  readonly: false,
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
