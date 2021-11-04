<template>
  <el-dialog
    :visible="show"
    title="插入电话号码"
    :append-to-body="true"
    :close-on-click-modal="false"
    destroy-on-close
    @close="$emit('update:show', false)"
  >
    <el-form ref="rowForm"
             :model="form"
    >
      <el-form-item label="" prop="tel" :rules="tel">
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
import { isEmpty, notEmpty } from 'kayran'

const tel = (value, { multiple = true } = {}) => {
  const regex = multiple ? /^((?:\d{3}-)?\d{8};?)+$|^((?:\d{4}-)?\d{7,8};?)+$/ : /^(?:\d{3}-)?\d{8}$|^(?:\d{4}-)?\d{7,8}$/
  const maxLen = 50

  let errInfo = ''
  if (typeof value === 'number' && Number.isNaN(value)) {
    errInfo = '格式不正确'
  } else if (notEmpty(value)) {
    value = value.toString()
    if (value.length > maxLen) {
      errInfo = '不能超过' + maxLen + '个字符'
    } else if (!regex.test(value)) {
      errInfo = '格式不正确' + (multiple ? '，如有多个请用英文分号隔开' : '')
    }
  }

  return errInfo
}

export default {
  props: {
    show: Boolean,
  },
  data () {
    return {
      tel: {
        required: true,
        validator (rule, value, callback) {
          let errInfo = ''
          if (isEmpty(value)) {
            errInfo = '必填项'
          } else {
            errInfo = tel(value, {
              multiple: false
            })
          }
          callback(errInfo ? new Error(errInfo) : undefined)
        }
      },
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
          //data-type data-value 用于小程序端解析
          this.$emit('insertTag', `<a data-type="tel" data-value="${this.form.tel}" href="tel:${this.form.tel}">${this.form.tel}</a>`)
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
