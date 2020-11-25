<template>
  <el-dialog
    :visible="show"
    title="插入图片"
    :append-to-body="true"
    :close-on-click-modal="false"
    destroy-on-close
    @close="$emit('update:show', false)"
  >
    <el-form ref="rowForm"
             :model="form"
    >
      <el-form-item label="" prop="imgUrl" :rules="required">
        <slot name="Imgpond"
              :v_model="form"
              valueType="array"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="$emit('update:show', false)">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { validator } from 'plain-kit'

export default {
  props: {
    show: Boolean,
  },
  data () {
    return {
      required: validator.required,
      form: {
        imgUrl: []
      }
    }
  },
  watch: {
    show: {
      handler (newVal, oldVal) {
        if (!newVal) {
          this.form = {
            imgUrl: []
          }
        }
      },
    },
  },
  methods: {
    handleSubmit () {
      this.$refs.rowForm.validate(valid => {
        if (valid) {
          this.form.imgUrl.map(v => {
            this.$emit('insertTag', `<img src=${v}>`)
          })
          this.$emit('update:show', false)
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
