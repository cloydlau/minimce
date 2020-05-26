<template>
  <el-dialog :visible.sync="show" :close-on-click-modal="false">
    <RichText v-model="value"/>
  </el-dialog>
</template>

<script>
//如果多个地方引用 建议进行封装 封装参考./RichText.vue
import RichText from './RichText'

export default {
  components: { RichText },
  data () {
    return {
      show: true,
      value: '<style>\n        .rich__text {\n          line-height: 1.8;\n          overflow: auto;\n        }\n        .rich__text p {\n          margin-block-end: 0;\n          margin-block-start: 0;\n        }\n        .rich__text img {\n          max-width: 100%;\n          height: auto !important;\n          vertical-align: middle;\n        }\n        .rich__text audio, .rich__text video {\n          width: 100%;\n          background-color: #000;\n        }\n      </style>'
    }
  },
}
</script>
