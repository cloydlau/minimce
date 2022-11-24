<template>
  <el-dialog v-model="showDialog" width="1200px" @closed="form.data = {}">
    <el-form :model="form.data">
      <el-form-item prop="richtext" required>
        <MiniMCE
          ref="left" v-model="form.data.richtext" v-bind="props" @init="editor => {
            targetEditor = editor
          }"
        />
        <!-- <MiniMCE ref="right" /> -->
      </el-form-item>
      <p>
        <el-radio-group v-model="radioValue">
          <el-radio label="active">
            tinymce.activeEditor
          </el-radio>
          <el-radio label="left">
            左侧的
          </el-radio>
          <el-radio label="right">
            右侧的
          </el-radio>
        </el-radio-group>
      </p>
      <p>
        <el-button-group>
          <el-button
            @click="() => {
              targetEditor.insertContent('insertContent')
            }"
          >
            insertContent
          </el-button>
          <el-button
            @click="() => {
              targetEditor.resetContent('resetContent')
            }"
          >
            resetContent
          </el-button>
          <el-button
            @click="() => {
              targetEditor.setContent('setContent')
            }"
          >
            setContent
          </el-button>
        </el-button-group>
      </p>
    </el-form>

    <template #footer>
      <el-button @click="showDialog = false">
        关 闭
      </el-button>
    </template>
  </el-dialog>

  <el-button-group>
    <el-button @click="showDialog = true">
      打开对话框
    </el-button>
    <el-button @click="form.data.richtext = '<p>123</p><p>123</p>'">
      编程式设值
    </el-button>
    <el-button @click="form.data.richtext = undefined">
      清空
    </el-button>
  </el-button-group>

  <p>
    <JsonEditorVue v-model="form.data.richtext" />
  </p>

  <p>
    <JsonEditorVue v-model="props" />
  </p>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import JsonEditorVue from 'json-editor-vue'
import tinymce from 'tinymce/tinymce'

const left = ref()
const right = ref()
const radioValue = ref('active')
const targetEditor = ref()
watch(radioValue, (n) => {
  switch (n) {
    case ('active'):
      targetEditor.value = tinymce.activeEditor
      break
    case ('left'):
      targetEditor.value = tinymce.get((left.value.id))
      break
    case ('right'):
      targetEditor.value = tinymce.get((right.value.id))
      break
  }
})

const showDialog = ref(true)
const form = reactive({
  data: {
    richtext: '初始值',
  },
})
const props = ref({
  disabled: false,
  outputFormat: 'html',
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item__content) {
  gap: 1rem;

  &>div {
    flex: 1;
  }
}
</style>
