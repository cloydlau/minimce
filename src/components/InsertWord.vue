<template>
  <el-dialog
    :visible="show"
    title="插入Word文档"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @close="$emit('update:show', false)"
  >
    <el-form
      ref="rowForm"
      :model="form"
    >
      <el-form-item prop="file" :rules="{required:true,message:'必填项'}">
        <slot
          name="Filepool"
          :v_model="form"
          :count="1"
          fileType="word"
          :upload="false"
        />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="$emit('update:show', false)">取消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="loading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import mammoth from 'mammoth'
import { Swal } from 'kikimore'
import { name } from '../../package.json'

export default {
  props: {
    show: Boolean,
    type: String
  },
  data () {
    return {
      form: {
        file: null
      },
      loading: false
    }
  },
  watch: {
    show (n, o) {
      if (!n) {
        this.form = {
          file: null
        }
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.rowForm.validate(valid => {
        if (valid) {
          this.loading = true
          const reader = new FileReader()
          reader.onload = e => {
            const arrayBuffer = e.target.result
            if (arrayBuffer.byteLength) {
              mammoth.convertToHtml({ arrayBuffer })
              .then(e => {
                console.log(`${name}-Word解析结果：`, e)
                const { messages, value } = e
                if (value) {
                  this.$emit('insertTag', value)
                  this.$emit('update:show', false)
                } else {
                  Swal.warning('文档内容为空')
                }
              })
              .done(e => {
                this.form.file = null
                this.loading = false
              })
            } else {
              this.loading = false
              Swal.warning('文档内容为空')
            }
          }
          reader.readAsArrayBuffer(this.form.file)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  min-width: 600px;
}
</style>
