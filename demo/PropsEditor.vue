<template>
  <div style="margin-bottom: 200px;">
    <h2>props</h2>
    <el-collapse>
      <el-collapse-item>
        <template slot="title">
          <span class="title">【html2text】是否开启html转普通文本功能</span>
          <el-tag>Boolean</el-tag>
        </template>
        <el-card>
          <div slot="header">
            <el-switch v-model="value.html2text" :active-value="true" :inactive-value="false"/>
          </div>
          <el-tag type="success">默认值：false</el-tag>
        </el-card>
      </el-collapse-item>
      <div v-show="value.html2text">
        <el-collapse-item>
          <template slot="title">
            <span class="title">【text】普通文本</span>
            <el-tag>String</el-tag>
          </template>
          <el-card>
            <div slot="header">
              <el-input v-model="value.text" type="textarea" :autosize="{minRows:3}" maxlength="1000" show-word-limit clearable/>
            </div>
            <el-tag type="success">默认值：''</el-tag>
          </el-card>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <span class="title">【textMaxlength】普通文本取自前多少个字符</span>
            <el-radio v-model="textMaxlengthType__" label="Number">Number</el-radio>
            <el-radio v-model="textMaxlengthType__" label="Boolean">Boolean</el-radio>
          </template>
          <el-card>
            <div slot="header">
              <el-input-number v-if="textMaxlengthType__==='Number'" v-model="value.textMaxlength" :min="1" :precision="0"/>
              <el-switch v-else v-model="value.textMaxlength" :active-value="true" :inactive-value="false"/>
            </div>
            <el-tag type="success">默认值：30</el-tag>
            <el-tag>可以设置为false获取完整内容</el-tag>
          </el-card>
        </el-collapse-item>
      </div>
      <el-collapse-item>
        <template slot="title">
          <span class="title">【disabled】是否禁用</span>
          <el-tag>Boolean</el-tag>
        </template>
        <el-card>
          <div slot="header">
            <el-switch v-model="value.disabled"
                       :active-value="true"
                       :inactive-value="false">
            </el-switch>
          </div>
          <el-tag type="success">默认值：false</el-tag>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  props: {
    value: Object
  },
  data () {
    return {
      textMaxlengthType__: 'Number',
    }
  },
  watch: {
    textMaxlengthType__ (newVal) {
      if (newVal === 'Boolean') {
        this.value.textMaxlength = true
      } else {
        this.value.textMaxlength = 30
      }
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  margin-top: 50px;
}

.el-tag ~ .el-tag {
  margin-left: 16px;
}

.title {
  margin-right: 16px;
}
</style>
