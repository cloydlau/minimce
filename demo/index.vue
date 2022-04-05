<template>
  <el-dialog modelValue :close-on-click-modal="false" :show-close="false" title="MiniMCE" append-to-body
             :close-on-press-escape="false" width="600px">
    <MiniMCE
      v-if="onOperation"
      v-model="modelValue"
      v-bind="props"
    />

    <br>
    <el-button-group>
      <el-button @click="modelValue='123'">编程式设值</el-button>
      <el-button @click="modelValue=''">清空</el-button>
      <el-button @click="onOperation=true" v-if="onOperation===false">挂载</el-button>
      <el-button @click="onOperation=false" v-else>销毁</el-button>
      <el-button @click="()=>{window.localStorage.clear()}">清缓存</el-button>
    </el-button-group>

    <p>{{ modelValue }}</p>
    <p>{{ props }}</p>
  </el-dialog>
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

<style lang="scss" scoped>

</style>
