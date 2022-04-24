<template>
  <el-dialog
    title="插入小程序页面链接"
    :visible="show"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
    custom-class="custom-dialog"
    @close="show = false"
  >
    <el-form
      ref="rowForm"
      :model="material"
      label-position="right"
      label-width="85px"
    >
      <el-form-item label="目标页面" prop="target" verify>

      </el-form-item>
      <el-form-item
        label="链接名称"
        prop="innerText"
        verify
      >
        <el-input v-model="material.innerText" maxlength="30" show-word-limit />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">关 闭</el-button>
      <el-button type="primary" @click="insert">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import qs from 'qs'

function getInitData () {
  return {
    show: false,
    material: {
      type: '',
      sourceId: '',
      sourceName: '',
      innerText: '',
      queryString: true,
      param: [
        {
          key: 'id',
          value: ''
        }
      ]
    },
    tag: ''
  }
}

export default {
  props: {
    editor: {
      required: true,
    }
  },
  data () {
    return getInitData()
  },
  watch: {
    show (newVal) {
      if (!newVal) {
        Object.assign(this.$data, getInitData())
      }
    }
  },
  methods: {
    open () {
      this.show = true
    },
    add () {
      if (this.material.param.length >= 10) {
        this.$warn('最多10个参数')
      } else {
        this.material.param.push({
          key: '',
          value: ''
        })
      }
    },
    insert () {
      this.$refs.rowForm.validate(async valid => {
        if (valid) {
          let detail = null,
            innerText = ''
          if (this.material.type === 'product') {
            innerText = this.material.sourceName
            let data = (
              await this.$POST('', {
                id: this.material.sourceId
              })
            ).data
            if (data) {
              detail = data
            }
          } else {
            innerText = this.material.innerText
          }
          if (detail) {
            detail = JSON.stringify(detail)
          }
          this.tag = `<a data-type="${
            this.material.type
          }" href="${this.material.type +
            qs.stringify(
              { id: this.material.sourceId },
              { addQueryPrefix: true }
            )}" ${detail && `data-detail='${detail}'`}>${innerText}</a>`
          this.show = false
          this.editor.insertContent(this.tag)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
