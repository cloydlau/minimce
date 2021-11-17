<template>
  <el-dialog
    :visible="show"
    title="插入Word文档"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @close="$emit('update:show', false)"
  >
    <el-form
      ref="rowForm"
      :model="form"
    >
      <el-form-item prop="file" :rules="{required:true,message:'必填项'}">
        <slot
          name="Filepool"
          :v_model="form"
          fileType="word"
          :upload="false"
          valueType="array"
        />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="$emit('update:show', false)">取消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="loading">确定</el-button>
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
    type: String
  },
  data () {
    return {
      form: {
        file: []
      },
      loading: false,
      allSettled: true,
    }
  },
  methods: {
    onSubmit () {
      this.$refs.rowForm.validate(async valid => {
        if (valid) {
          this.loading = true
          const results = await Promise.allSettled(this.form.file.map(v =>
            new Promise((resolve, reject) => {
              if (v.name.endsWith('.doc') && v.type === 'application/msword') {
                reject('不支持 doc 格式')
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

          this.form.file = []
          this.loading = false
          if (this.allSettled) {
            this.$emit('update:show', false)
          }
          this.allSettled = true
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
