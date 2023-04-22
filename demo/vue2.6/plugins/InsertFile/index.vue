<template>
  <el-dialog
    :visible="show"
    :title="`插入${{ audio: '音频', video: '视频' }[type]}`"
    :append-to-body="true"
    :close-on-click-modal="false"
    destroy-on-close
    @close="show = false"
  >
    <el-form
      ref="formRef"
      :model="formData"
      label-width="auto"
    >
      <template v-if="type === 'audio'">
        <el-form-item
          label="名称"
          prop="name"
          :rules="{ required: true, message: '必填项' }"
        >
          <el-input
            v-model="formData.name"
            maxlength="14"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="封面"
          prop="cover"
          :rules="{ required: true, message: '必填项' }"
        >
          <!--          <Imgpond
            v-model="formData.cover"
            :count="1"
            aspectRatio="1/1"
          /> -->
        </el-form-item>
      </template>
      <el-form-item
        label="文件"
        prop="file"
        :rules="{ required: true, message: '必填项' }"
      >
        <!--        <Filepool
          v-model="formData.file"
          :count='1'
          :fileType="type"
        /> -->
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="show = false">取消</el-button>
      <el-button
        type="primary"
        @click="confirm"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
// import 'imgpond/dist/style.css'
// import Imgpond from 'imgpond'
// import Filepool from 'filepool'

export default {
  // components: { Imgpond, Filepool },
  props: {
    editor: {
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      show: false,
      formData: {
        cover: '',
        name: '',
        file: '',
      },
    }
  },
  watch: {
    show: {
      handler(newVal, oldVal) {
        if (!newVal) {
          this.formData = {
            cover: '',
            name: '',
            file: '',
          }
        }
      },
    },
  },
  methods: {
    open() {
      this.show = true
    },
    confirm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (this.type === 'audio') {
            this.editor.insertContent(`<audio controls data-name="${this.formData.name}" data-poster="${this.formData.cover}" src="${this.formData.file}"></audio>`)
            this.show = false
          } else if (this.type === 'video') {
            if (typeof this.formData.file === 'string' && this.formData.file.toLowerCase().endsWith('.mp4')) {
              this.editor.insertContent(`<video controls controlslist="nodownload" src="${this.formData.file}"></video>`)
              this.show = false
            } else {
              /* warning({
                titleText: '仅支持以.mp4结尾的视频链接',
                backdrop: false,
                timer: 5000,
                customClass: {
                  container: '__minimce__',
                },
              }) */
            }
          }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
