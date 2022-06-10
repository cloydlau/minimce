<template>
  <el-dialog v-model="showDialog" @closed="form.data = {}">
    <el-form :model="form.data" ref="formRef">
      <el-form-item prop="richtext" required>
        <MiniMCE v-model="form.data.richtext" v-bind="props" ref="minimce" />
      </el-form-item>
      <el-button-group>
        <el-button @click="() => {
          minimce.tinymceInstance.insertContent('insertContent')
        }">insertContent</el-button>
        <el-button @click="() => {
          minimce.tinymceInstance.resetContent('resetContent')
        }">resetContent</el-button>
        <el-button @click="() => {
          minimce.tinymceInstance.setContent('setContent')
        }">setContent</el-button>
      </el-button-group>
    </el-form>

    <template #footer>
      <el-button @click="showDialog = false">关 闭</el-button>
    </template>
  </el-dialog>

  <el-button-group>
    <el-button @click="showDialog = true">打开对话框</el-button>
    <el-button @click="form.data.richtext = '<p>123</p><p>123</p>'">编程式设值
    </el-button>
    <el-button @click="form.data.richtext = undefined">清空</el-button>
    <el-button @click="() => { formRef.validate() }">校验</el-button>
  </el-button-group>
  
  <p>
    <JsonEditorVue v-model="form.data.richtext" />
  </p>

  <p>
    <JsonEditorVue v-model="props" />
  </p>
</template>

<script setup>
import { ref, reactive } from 'vue'
import JsonEditorVue from 'json-editor-vue'

const formRef = ref()
const minimce = ref()
const showDialog = ref(true)
const form = reactive({
  data: {
    richtext: '初始值'
  }
})
const props = ref({
  disabled: false,
  outputFormat: 'html',
})
</script>

<style>
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
