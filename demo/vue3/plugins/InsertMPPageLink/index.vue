<template>
  <el-dialog
    v-model="show"
    title="插入小程序页面链接"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
    @close="show = false"
  >
    <el-form
      ref="formRef"
      :model="material"
      label-position="right"
      label-width="85px"
    >
      <!-- <el-form-item label="目标页面" prop="target" :rules="{required:true,message:'必填项'}">

      </el-form-item> -->
      <el-form-item
        label="链接名称"
        prop="innerText"
        :rules="{ required: true, message: '必填项' }"
      >
        <el-input
          v-model="material.innerText"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>
      <transition name="slide-fade">
        <el-form-item
          v-if="tag"
          label="链接标签"
        >
          <el-input
            disabled
            :value="tag"
          />
        </el-form-item>
      </transition>
    </el-form>

    <template #footer>
      <el-button @click="show = false">关 闭</el-button>
      <el-button
        v-if="tag"
        type="primary"
        @click="insert"
      >
        确 定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import qs from 'qs'

function getInitialData() {
  return {
    show: false,
    material: {
      target: {
        src_type: 'test',
      },
      innerText: '',
      queryString: true,
      param: [{
        key: 'id',
        value: '',
      }],
    },
    tag: '',
  }
}

export default {
  props: {
    editor: {
      required: true,
    },
  },
  data() {
    return getInitialData()
  },
  watch: {
    material: {
      deep: true,
      handler(n) {
        if (this.show) {
          this.$refs.formRef.validate().then(() => {
            this.tag = `<a href="${this.material.target.src_type + qs.stringify({ id: this.material.target.id }, { addQueryPrefix: true })}">${this.material.innerText}</a>`
          })
        }
      },
    },
    show(newVal) {
      if (!newVal) {
        Object.assign(this.$data, getInitialData())
      }
    },
  },
  expose: ['open'],
  methods: {
    open() {
      this.show = true
    },
    add() {
      if (this.material.param.length >= 10) {
        this.$warn('最多10个参数')
      } else {
        this.material.param.push({
          key: '',
          value: '',
        })
      }
    },
    insert() {
      this.editor.insertContent(this.tag)
      this.show = false
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
