<template>
  <el-dialog
    :visible="show"
    title="插入 Word 文档"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @close="$emit('update:show', false)"
  >
    <el-upload
      drag
      action=""
      multiple
      :auto-upload="false"
      :on-change="onChange"
      style="width:100%;"
      ref="elUploadRef"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将 docx 文件拖到此处，或<em>点击上传</em></div>
    </el-upload>

    <div slot="footer">
      <el-button @click="$emit('update:show', false)">取消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="loading" :disabled="!files.length">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import mammoth from 'mammoth/mammoth.browser.min.js'
import { waitFor } from 'kayran'
import { name } from '../../package.json'
import 'sweetalert2/dist/sweetalert2.min.css'
import Swal from 'sweetalert2'

export default {
  props: {
    show: Boolean,
  },
  data () {
    return {
      files: [],
      loading: false,
      allSettled: true,
    }
  },
  watch: {
    show (n) {
      if (!n) {
        this.$nextTick(() => {
          this.files = []
        })
      }
    }
  },
  methods: {
    onChange (file, fileList) {
      this.files = Array.from(fileList, ({ raw }) => raw)
    },
    async onSubmit () {
      this.loading = true
      const results = await Promise.allSettled(this.files.map(v =>
        new Promise((resolve, reject) => {
          if (!v.name.endsWith('.docx')) {
            reject('仅支持 docx 格式')
          }

          const reader = new FileReader()
          reader.onload = async e => {
            const arrayBuffer = e.target.result
            if (arrayBuffer.byteLength) {
              const [res, err] = await waitFor(mammoth.convertToHtml({ arrayBuffer }))
              if (err) {
                reject(err)
              } else {
                const { messages, value } = res
                console.log(`[${name}] ${v.name} 解析结果：`, res)
                if (value) {
                  resolve(value)
                } else {
                  reject(`${v.name} 内容为空`)
                }
              }
            } else {
              reject(`${v.name} 内容为空`)
            }
          }
          reader.readAsArrayBuffer(v)
        })
      ))

      results.map(result => {
        const { status, value, reason } = result
        if (status === 'fulfilled') {
          this.$emit('insertTag', value)
        } else {
          if (reason) {
            console.error(reason)
            Swal.fire({
              titleText: typeof reason === 'string' ? reason : '解析失败',
              icon: 'warning',
              backdrop: false,
              timer: 5000,
              customClass: {
                container: '__minimce__',
              },
            })
          }
          this.allSettled = false
        }
      })

      this.files = []
      this.$refs.elUploadRef.clearFiles()
      this.loading = false
      if (this.allSettled) {
        this.$emit('update:show', false)
      }
      this.allSettled = true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  min-width: 600px;

  & > .el-dialog__body {
    display: flex;
    justify-content: center;

    .el-upload {
      width: 100%;

      &.el-upload-dragger {
        width: 100%;
      }
    }
  }
}
</style>
