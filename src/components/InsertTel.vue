<template>
  <el-dialog :visible="show" title="插入电话号码"
             :append-to-body="true"
             :close-on-click-modal="false"
             destroy-on-close
             @close="$emit('update:show', false)"
  >
    <el-form ref="rowForm"
             :model="form"
    >
      <el-form-item label="" prop="tel" :rules="[required,tel(false)]">
        <el-input v-model="form.tel" clearable/>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="$emit('update:show', false)">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { $validator } from 'plain-kit'

export default {
  props: {
    show: Boolean,
  },
  data () {
    return {
      required: $validator.required,
      tel: $validator.tel,
      form: {
        tel: ''
      }
    }
  },
  watch: {
    show: {
      handler (newVal, oldVal) {
        if (!newVal) {
          this.form = {
            tel: ''
          }
        }
      },
    },
  },
  methods: {
    handleSubmit () {
      this.$refs.rowForm.validate(valid => {
        if (valid) {
          this.$emit('insertTag', `<a href="tel:${this.form.tel}">${this.form.tel}</a>`)
          this.$emit('update:show', false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
