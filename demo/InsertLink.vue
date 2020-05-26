<template>
  <el-dialog title="插入移动端页面链接" :visible.sync="show" :close-on-click-modal="false" append-to-body destroy-on-close
             @close="$emit('update:show', false)"
  >
    <el-form ref="rowForm" :model="material" label-position="right" label-width="85px">
      <el-form-item label="目标页面" prop="target" :rules="required">

      </el-form-item>
      <el-form-item label="链接名称" prop="innerText" :rules="required">
        <el-input v-model="material.innerText" maxlength="30" show-word-limit/>
      </el-form-item>
      <!--        <el-form-item label="链接参数">
                <el-table :data="material.param" border fit stripe highlight-current-row>
                  <el-table-column label="键">
                    <template slot-scope="{row}">
                      <el-input v-model="row.key" maxlength="30" show-word-limit/>
                    </template>
                  </el-table-column>
                  <el-table-column label="值">
                    <template slot-scope="{row}">
                      <el-form-item>
                        <el-input v-model="row.value" type="textarea" autosize maxlength="500" show-word-limit/>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="添加到属性">
                    <template slot-scope="{row}">
                      <el-switch v-model="row.attr"
                                 :active-value="true"
                                 :inactive-value="false"
                                 active-color="#13ce66"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" circle icon="el-icon-delete" @click="material.param.splice(scope.$index, 1)"/>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button icon="el-icon-circle-plus-outline" @click="add" style="width:100%">增加</el-button>
              </el-form-item>
              <transition name="slide-fade">
                <el-form-item label="拼接到url" v-if="material.param.length>0">
                  <el-switch v-model="material.queryString"
                             :active-value="true"
                             :inactive-value="false"
                             active-color="#13ce66"
                  />
                </el-form-item>
              </transition>-->
      <transition name="slide-fade">
        <el-form-item label="链接标签" v-if="tag">
          <el-input readonly :value="tag"/>
        </el-form-item>
      </transition>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:show', false)">关 闭</el-button>
      <el-button type="primary" @click="insert" v-if="tag">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { $validator } from 'plain-kit'
const { required } = $validator
import qs from 'qs'

function getInitData () {
  return {
    required,
    material: {
      target: '',
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
    show: Boolean,
  },
  //components: { GlobalSearch },
  data () {
    return getInitData()
  },
  watch: {
    material: {
      deep: true,
      handler (newVal) {
        if (this.show) {
          this.$refs.rowForm.validate(valid => {
            if (valid) {
              /*
                let paramObj = {}
                let attr = ''
                this.material.param.filter(v => {
                  return v.key && v.value
                }).map(v => {
                  paramObj[v.key] = v.value
                  if (v.attr) {
                    attr += ` ${v.key}="${v.value}"`
                  }
                })

                this.tag = `<a href="${this.material.pageId + (this.material.queryString ? qs.stringify(paramObj, {addQueryPrefix: true}) : '')}"${attr}>${this.material.innerText}</a>`
              */
              this.tag = `<a href="${this.material.target.src_type + qs.stringify({ id: this.material.target.id }, { addQueryPrefix: true })}">${this.material.innerText}</a>`
            }
          })
        }
      }
    },
    show (newVal) {
      if (!newVal) {
        Object.assign(this.$data, getInitData())
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
      this.$emit('update:show', false)
      this.$eventBus.emit('insertTag', this.tag)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
