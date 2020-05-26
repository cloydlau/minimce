<template>
  <el-dialog :visible.sync="show" :title="'插入'+{'audio':'音频','video':'视频'}[type]" :append-to-body="true"
             :close-on-click-modal="false"
             destroy-on-close
             @close="$emit('update:show', false)"
  >
    <el-form ref="rowForm"
             :model="form"
             label-width="85px"
    >
      <template v-if="type==='audio'">
        <el-form-item label="名称" prop="name" :rules="required">
          <el-input v-model="form.name" maxlength="14" show-word-limit/>
        </el-form-item>
        <el-form-item label="封面" prop="imgUrl" :rules="required">
          <slot name="Imgpond"
                :v_model="form"
                :count="1"
                fixedRatio="1/1"
          />
        </el-form-item>
      </template>
      <el-form-item label="上传文件" prop="fileUrl" :rules="required">
        <slot name="Filepool"
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
import { $validator, warn } from 'plain-kit'

export default {
  props: {
    show: Boolean,
    type: String
  },
  data () {
    return {
      required: $validator.required,
      form: {
        imgUrl: '',
        name: '',
        fileUrl: ''
      }
    }
  },
  watch: {
    show (newVal, oldVal) {
      if (!newVal) {
        this.form = {
          imgUrl: '',
          name: '',
          fileUrl: ''
        }
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.rowForm.validate(valid => {
        if (valid) {
          if (this.type === 'audio') {
            this.$emit('insertTag', `<audio controls data-name="${this.form.name}" data-poster="${this.form.imgUrl}" src="${this.form.fileUrl}"></audio>`)
            this.$emit('update:show', false)
          } else if (this.type === 'video') {
            if (this.form.fileUrl.toLowerCase().endsWith('.mp4')) {
              this.$emit('insertTag', `<video controls controlslist="nodownload" src="${this.form.fileUrl}"></video>`)
              this.$emit('update:show', false)
            } else {
              warn('仅支持以.mp4结尾的视频链接')
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
