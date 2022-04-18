<template>
  <el-dialog
    title="插入移动端页面链接"
    v-model="show"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
    @close="show=false"
    width="600px"
  >
    <el-form ref="formRef" :model="material" label-position="right" label-width="85px">
      <!--<el-form-item label="目标页面" prop="target" :rules="{required:true,message:'必填项'}">

      </el-form-item>-->
      <el-form-item label="链接名称" prop="innerText" :rules="{required:true,message:'必填项'}">
        <el-input v-model="material.innerText" maxlength="30" show-word-limit/>
      </el-form-item>
      <transition name="slide-fade">
        <el-form-item label="链接标签" v-if="tag">
          <el-input readonly :value="tag"/>
        </el-form-item>
      </transition>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="show=false">关 闭</el-button>
      <el-button type="primary" @click="insert" v-if="tag">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import qs from 'qs'

function getInitialData () {
  return {
    show: false,
    material: {
      target: {
        src_type: 'test'
      },
      innerText: '',
      queryString: true,
      param: [{
        key: 'id',
        value: ''
      }],
    },
    tag: ''
  }
}

export default {
  props: {
    miniMCE: {
      required: true,
    }
  },
  data () {
    return getInitialData()
  },
  watch: {
    material: {
      deep: true,
      handler (n) {
        if (this.show) {
          this.$refs.formRef.validate().then(() => {
            this.tag = `<a href="${this.material.target.src_type + qs.stringify({ id: this.material.target.id }, { addQueryPrefix: true })}">${this.material.innerText}</a>`
          })
        }
      }
    },
    show (newVal) {
      if (!newVal) {
        Object.assign(this.$data, getInitialData())
      }
    }
  },
  methods: {
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
      this.miniMCE.insertContent(this.tag)
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
