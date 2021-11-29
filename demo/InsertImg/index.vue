<template>
  <div class="fixed z-999999">
    <div class="fixed left-0 top-0 w-full h-full opacity-50" style="background: rgb(0, 0, 0);"/>

    <el-dialog

      class="fixed top-0 bottom-0 left-0 right-0 m-auto"
      style="width:fit-content;height:fit-content"
      @login="()=>{$emit('login')}"

      :visible="show"
      title="插入图片"
      :append-to-body="true"
      :close-on-click-modal="false"
      destroy-on-close
      @close="$emit('update:show', false)"
    >
      <el-form ref="rowForm" :model="form">
        <el-form-item
          prop="imgUrl"
          :rules="{required:true,message:'必填项'}"
        >
          <Imgpond
            v-model="form"
            valueType="array"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="$emit('update:show', false)">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import 'imgpond/dist/style.css'
import Imgpond from 'imgpond'

export default {
  components: { Imgpond },
  props: {
    show: Boolean,
  },
  data () {
    return {
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
