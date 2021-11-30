<template>
  <el-dialog visible :close-on-click-modal="false" :show-close="false" title="minimce" append-to-body>
    <Minimce
      v-if="onOperation"
      v-model="value"
      v-bind="props"
    />

    <br/>
    <el-button-group>
      <el-button @click="value='123'">编程式设值</el-button>
      <el-button @click="value=''">清空</el-button>
      <el-button @click="onOperation=true" v-if="onOperation===false">挂载</el-button>
      <el-button @click="onOperation=false" v-else>销毁</el-button>
      <el-button @click="()=>{localStorage.clear()}">清缓存</el-button>
    </el-button-group>

    <PropsEditor v-model="props"/>
  </el-dialog>
</template>

<script>
import PropsEditor from './PropsEditor.vue'

export default {
  components: { PropsEditor },
  data () {
    return {
      localStorage,
      onOperation: true,
      value: '<style>\n        .rich__text {\n          line-height: 1.8;\n          overflow: auto;\n        }\n        .rich__text p {\n          margin-block-end: 0;\n          margin-block-start: 0;\n        }\n        .rich__text img {\n          max-width: 100%;\n          height: auto !important;\n          vertical-align: middle;\n        }\n        .rich__text audio, .rich__text video {\n          width: 100%;\n          background-color: #000;\n        }\n      </style>',
      props: {
        readonly: false,
        disabled: false,
        apiKey: process.env.VUE_APP_API_KEY,
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  min-width: 600px;
}
</style>
