<template>
  <el-dialog visible :close-on-click-modal="false" :show-close="false" title="minimce" append-to-body>
    <Minimce
      v-model="value"
      v-bind="props"
    />

    <br/>
    <el-button-group>
      <el-button @click="set" type="primary">编程式设值</el-button>
      <el-button @click="clear">清空</el-button>
    </el-button-group>

    <PropsEditor v-model="props"/>
  </el-dialog>
</template>

<script>
//import { Minimce } from '../dist/minimce.umd'

import PropsEditor from './PropsEditor.vue'

import Filepool from 'filepool'
import Imgpond from 'imgpond'

export default {
  components: { PropsEditor },
  data () {
    return {
      value: '<style>\n        .rich__text {\n          line-height: 1.8;\n          overflow: auto;\n        }\n        .rich__text p {\n          margin-block-end: 0;\n          margin-block-start: 0;\n        }\n        .rich__text img {\n          max-width: 100%;\n          height: auto !important;\n          vertical-align: middle;\n        }\n        .rich__text audio, .rich__text video {\n          width: 100%;\n          background-color: #000;\n        }\n      </style>',
      props: {
        readonly: false,
        disabled: false,
        apiKey: process.env.VUE_APP_API_KEY,
        Imgpond,
        Filepool,
        MobileLink: () => import('./MobileLink.vue'),
      }
    }
  },
  methods: {
    set () {
      this.value = '123'
    },
    clear () {
      this.value = ''
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  min-width: 600px;
}
</style>
