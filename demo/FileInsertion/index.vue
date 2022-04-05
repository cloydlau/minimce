<template>
  <el-dialog
    v-model="show"
    :title="'插入'+{'audio':'音频','video':'视频'}[type]"
    :append-to-body="true"
    :close-on-click-modal="false"
    destroy-on-close
    @close="show=false"
    width="600px"
  >
    <el-form
      ref="formRef"
      :model="formData"
      label-width="auto"
    >
      <template v-if="type==='audio'">
        <el-form-item label="名称" prop="name" :rules="{required:true,message:'必填项'}">
          <el-input v-model="formData.name" maxlength="14" show-word-limit/>
        </el-form-item>
        <el-form-item label="封面" prop="cover" :rules="{required:true,message:'必填项'}">
          <Imgpond
            v-model="formData.cover"
            :count="1"
            fixedRatio="1/1"
          />
        </el-form-item>
      </template>
      <el-form-item label="文件" prop="file" :rules="{required:true,message:'必填项'}">
        <Filepool
          v-model="formData.file"
          :count='1'
          :fileType="type"
        />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="show=false">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import 'imgpond/dist/style.css'
import Imgpond from 'imgpond'
import Filepool from 'filepool'
import { eventBus } from '../main'
import 'sweetalert2/dist/sweetalert2.min.css'
import Swal from 'sweetalert2'

export default {
  components: { Imgpond, Filepool },
  data () {
    return {
      show: false,
      type: '',
      formData: {
        cover: '',
        name: '',
        file: ''
      }
    }
  },
  watch: {
    show: {
      handler (newVal, oldVal) {
        if (!newVal) {
          this.formData = {
            cover: '',
            name: '',
            file: ''
          }
        }
      },
    },
  },
  methods: {
    confirm () {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          if (this.type === 'audio') {
            eventBus.$emit('MiniMCE:insertContent', `<audio controls data-name="${this.formData.name}" data-poster="${this.formData.imgUrl}" src="${this.formData.file}"></audio>`)
            this.show = false
          } else if (this.type === 'video') {
            if (typeof this.formData.file === 'string' && this.formData.file.toLowerCase().endsWith('.mp4')) {
              eventBus.$emit('MiniMCE:insertContent', `<video controls controlslist="nodownload" src="${this.formData.file}"></video>`)
              this.show = false
            } else {
              Swal.fire({
                icon: 'warning',
                titleText: '仅支持以.mp4结尾的视频链接',
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

</style>
