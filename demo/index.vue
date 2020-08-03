<template>
  <el-dialog visible :close-on-click-modal="false" :show-close="false" title="minimce">
    <Minimce v-model="value"
             :text.sync="props.text"
             v-bind="props"
    />
    <PropsEditor v-model="props"/>
  </el-dialog>
</template>

<script>
import Minimce from '../src/RichText' //dev
//import { Minimce } from '../dist/minimce.umd' //prod
//import { Minimce } from 'minimce' //todo

import PropsEditor from './PropsEditor'

import Filepool from 'filepool'
import Imgpond from 'imgpond'

export default {
  components: { PropsEditor },
  data () {
    return {
      value: '<style>\n        .rich__text {\n          line-height: 1.8;\n          overflow: auto;\n        }\n        .rich__text p {\n          margin-block-end: 0;\n          margin-block-start: 0;\n        }\n        .rich__text img {\n          max-width: 100%;\n          height: auto !important;\n          vertical-align: middle;\n        }\n        .rich__text audio, .rich__text video {\n          width: 100%;\n          background-color: #000;\n        }\n      </style>',
      props: {
        text: '',
        disabled: false,
        html2text: false,
        audioMenuItem: true,
        apiKey: '',
        textMaxlength: 30,
        Imgpond: Imgpond.Imgpond,
        Filepool: Filepool.Filepool,
        MobileLink: () => import('./MobileLink.vue'),
      }
    }
  },
}
</script>
