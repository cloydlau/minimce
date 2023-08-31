<template>
  <div>
    <el-dialog
      :visible.sync="showDialog"
      @closed="data.value = undefined"
    >
      <el-form
        :model="data"
      >
        <el-form-item
          prop="value"
          required
        >
          <el-switch v-model="toggle" />
          <MiniMCE
            v-if="toggle"
            v-model="data.value"
            v-bind="props"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showDialog = false">
          关 闭
        </el-button>
      </template>
    </el-dialog>

    <p>
      <button @click="showDialog = true">
        打开对话框
      </button>
      <button
        @click="() => {
          data.value = '<p>123</p><p>123</p>'
        }"
      >
        编程式设值
      </button>
      <button @click="data.value = undefined">
        清空
      </button>
    </p>

    <p>
      <JsonEditorVue v-model="data.value" />
    </p>
    <p>
      <JsonEditorVue v-model="props" />
    </p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import JsonEditorVue from 'json-editor-vue'

const showDialog = ref(true)
const data = reactive({
  value: '初始值',
})
const props = reactive({
  disabled: false,
  outputFormat: 'html',
})

const toggle = ref(false)
</script>
