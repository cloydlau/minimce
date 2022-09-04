<template>
  <el-dialog
    v-model="show"
    title="插入电话号码"
    :append-to-body="true"
    :close-on-click-modal="false"
    destroy-on-close
    @close="show = false"
  >
    <el-form ref="rowForm" :model="form">
      <el-form-item label="" prop="tel" :rules="tel">
        <el-input v-model="form.tel" clearable/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
const tel = (value, { multiple = true } = {}) => {
  const regex = multiple ? /^((?:\d{3}-)?\d{8};?)+$|^((?:\d{4}-)?\d{7,8};?)+$/ : /^(?:\d{3}-)?\d{8}$|^(?:\d{4}-)?\d{7,8}$/
  const maxLen = 50
  let errInfo = ''
  if (typeof value === 'number' && Number.isNaN(value)) {
    errInfo = '格式不正确'
  } else if (value) {
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
    editor: {
      required: true,
    }
  },
  data () {
    return {
      show: false,
      tel: {
        required: true,
        validator (rule, value, callback) {
          let errInfo = ''
          if (notEmpty(value)) {
            errInfo = tel(value, {
              multiple: false
            })
          } else {
            errInfo = '必填项'
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
    show (n) {
      if (!n) {
        this.form = {
          tel: ''
        }
      }
    },
  },
  expose: ['open'],
  methods: {
    open () {
      this.show = true
    },
    confirm () {
      this.$refs.rowForm.validate().then(() => {
        // data-type data-value 用于小程序端解析
        this.editor.insertContent(`<a data-type="tel" data-value="${this.form.tel}" href="tel:${this.form.tel}">${this.form.tel}</a>`)
        this.show = false
      })
    }
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
