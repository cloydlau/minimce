<template>
  <div>
    <el-dialog
      :visible.sync="showDialog"
      @closed="data = {}"
    >
      <el-form
        :model="data"
        disabled
      >
        <el-form-item
          prop="value"
          required
        >
          <MiniMCE
            v-bind="props"
            v-model="data.value"
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
      <button @click="data.value = '<p>123</p><p>123</p>'">
        编程式设值
      </button>
      <button @click="data = {}">
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

<script>
import JsonEditorVue from 'json-editor-vue'

export default {
  components: { JsonEditorVue },
  data() {
    return {
      showDialog: true,
      data: {
        value: '初始值',
      },
      props: {
        disabled: false,
        outputFormat: 'html',
      },
    }
  },
}
</script>
