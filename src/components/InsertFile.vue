<template>
  <el-dialog
    :visible="show"
    :title="'插入'+{'audio':'音频','video':'视频'}[type]"
    :append-to-body="true"
    :close-on-click-modal="false"
    destroy-on-close
    @close="$emit('update:show', false)"
  >
    <el-form
      ref="rowForm"
      :model="form"
      label-width="auto"
    >
      <template v-if="type==='audio'">
        <el-form-item label="名称" prop="name" :rules="{required:true,message:'必填项'}">
          <el-input v-model="form.name" maxlength="14" show-word-limit/>
        </el-form-item>
        <el-form-item label="封面" prop="imgUrl" :rules="{required:true,message:'必填项'}">
          <slot
            name="Imgpond"
            :v_model="form"
            :count="1"
            fixedRatio="1/1"
          />
        </el-form-item>
      </template>
      <el-form-item label="文件" prop="file" :rules="{required:true,message:'必填项'}">
        <slot
          name="Filepool"
          :v_model="form"
          :count='1'
          :fileType="type"
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
import 'sweetalert2/dist/sweetalert2.min.css'
import Swal from 'sweetalert2'

export default {
  props: {
    show: Boolean,
    type: String
  },
  data () {
    return {
      form: {
        imgUrl: '',
        name: '',
        file: ''
      }
    }
  },
  watch: {
    show (newVal, oldVal) {
      if (!newVal) {
        this.form = {
          imgUrl: '',
          name: '',
          file: ''
        }
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.rowForm.validate(valid => {
        if (valid) {
          if (this.type === 'audio') {
            this.$emit('insertTag', `<audio controls data-name="${this.form.name}" data-poster="${this.form.imgUrl}" src="${this.form.file}"></audio>`)
            this.$emit('update:show', false)
          } else if (this.type === 'video') {
            if (typeof this.form.file === 'string' && this.form.file.toLowerCase().endsWith('.mp4')) {
              this.$emit('insertTag', `<video controls controlslist="nodownload" src="${this.form.file}"></video>`)
              this.$emit('update:show', false)
            } else {
              Swal.fire({
                titleText: '仅支持以.mp4结尾的视频链接',
                icon: 'warning',
                backdrop: false,
                timer: 5000,
                customClass: {
                  container: '__minimce__',
                },
              })
            }
          }
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
