<template>
  <div style="margin-bottom: 200px;">
    <h2>props</h2>

    <el-form>
      <el-form-item label="apiKey">
        <el-input v-model="value.apiKey" clearable/>
      </el-form-item>
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
