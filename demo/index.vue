<template>
  <el-dialog visible :close-on-click-modal="false" :show-close="false" title="minimce">
    <el-form label-position="right"
             label-width="78px"
    >
      <el-form-item label="富文本">
        <Minimce v-model="value"
                 :text.sync="text"
                 v-bind="props"
        >
          <Imgpond slot="Imgpond"/>
          <Filepool slot="Filepool"/>
          <MobileLink slot="MobileLink"/>
        </Minimce>
      </el-form-item>
      <el-form-item label="普通文本">
        <el-input v-model="text" type="textarea" :autosize="{minRows:3}" maxlength="1000" show-word-limit clearable/>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import Minimce from '../src/index' //dev
//import { Minimce } from '../dist/minimce.umd' //prod
//import { Minimce } from 'minimce' //todo

export default {
  components: { Minimce },
  data () {
    return {
      value: '<style>\n        .rich__text {\n          line-height: 1.8;\n          overflow: auto;\n        }\n        .rich__text p {\n          margin-block-end: 0;\n          margin-block-start: 0;\n        }\n        .rich__text img {\n          max-width: 100%;\n          height: auto !important;\n          vertical-align: middle;\n        }\n        .rich__text audio, .rich__text video {\n          width: 100%;\n          background-color: #000;\n        }\n      </style>',
      text: '',
      MobileLink: () => import('./MobileLink.vue'),
      props: {
        disabled: false,
        html2text: true,
        apiKey: '',
        textMaxlength: 10,
      }
    }
  },
}
</script>
