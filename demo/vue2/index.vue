<template>
  <div>
    <el-form :model="data" disabled ref="formRef">
      <el-form-item prop="value" required>
        <MiniMCE v-model="data.value" v-bind="props"/>
      </el-form-item>
    </el-form>

    <p>
      <button @click="data.value='<p>123</p><p>123</p>'">编程式设值</button>
      <button @click="data.value=''">清空</button>
      <button @click="() => { $refs.formRef.validate() }">校验</button>
    </p>

    <p>
      <JsonEditorVue v-model="data.value"/>
    </p>
    <p>
      <JsonEditorVue v-model="props"/>
    </p>
  </div>
</template>

<script>
import JsonEditorVue from 'json-editor-vue'

export default {
  components: { JsonEditorVue },
  data () {
    return {
      data: {
        value: '初始值',
      },
      props: {
        readonly: false,
        disabled: false,
        apiKey: import.meta.env.VITE_APP_API_KEY,
      }
    }
  }
}
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
