<template>
  <div style="margin-bottom: 200px;">
    <h2>props</h2>

    <el-form>
      <el-form-item label="apiKey">
        <el-input v-model="value.apiKey" clearable readonly/>
      </el-form-item>
      <el-form-item label="audioMenuItem">
        <el-switch v-model="value.audioMenuItem" :active-value="true" :inactive-value="false" disabled/>
      </el-form-item>
      <el-form-item label="html2text">
        <el-switch v-model="value.html2text" :active-value="true" :inactive-value="false"/>
      </el-form-item>
      <div v-show="value.html2text">
        <el-form-item label="text">
          <el-input v-model="value.text" type="textarea" :autosize="{minRows:3}" maxlength="1000" show-word-limit
                    clearable/>
        </el-form-item>
        <el-form-item label="textMaxlength">
          <el-input-number v-model="value.textMaxlength" :min="1" :precision="0"/>
        </el-form-item>
      </div>
      <el-form-item label="disabled">
        <el-switch v-model="value.disabled"
                   :active-value="true"
                   :inactive-value="false">
        </el-switch>
      </el-form-item>
      <el-form-item label="readonly">
        <el-switch v-model="value.readonly"
                   :active-value="true"
                   :inactive-value="false">
        </el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    value: Object
  },
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
