<template>
  <div>
    <a-drawer
      title="新建实例"
      :width="720"
      :visible="visible"
      :header-style="{ height: '64px', boxShadow: '0 1px 1px #ddd' }"
      :body-style="{ paddingBottom: '64px' }"
      @close="onClose"
    >
      <a-form :form="form" layout="vertical" hide-required-mark>
        <a-spin :spinning="confirmLoading">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="实例名">
                <a-input v-decorator="['name', { rules: [{ required: true, message: '请选择所属项目' }] }]" placeholder="请输入实例名，例如K1.34.5">
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-button type="link" @click="advance = !advance" style="padding-left: 0;">高级设置</a-button>
            </a-col>
          </a-row>
        </a-spin>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          取消
        </a-button>
        <a-button type="primary" @click="handleOk" :loading="confirmLoading">
          确定
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import api from '@/api'
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      app: {},
      advance: false,
      redirect: false,
      visible: false,
      confirmLoading: false,
      editMod: false,
      record: {},
      level: 1,
      projects: [],
    }
  },
  methods: {
    showDrawer(app) {
      this.visible = true
      this.confirmLoading = false
      this.app = app
    },
    getProject() {
      api.cicd.getProjects().then((resp) => {
        this.projects = resp.data
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    edit(record) {
      this.visible = true
      this.editMod = true
      this.record = record
      const {
        form: { getFieldsValue, setFieldsValue, resetFields },
      } = this
      this.$nextTick(() => {
        const values = getFieldsValue()
        Object.keys(values).forEach((k) => {
          values[k] = record[k]
        })
        resetFields()
        setFieldsValue(values)
      })
    },
    handleOk() {
      const {
        form: { validateFields },
      } = this
      validateFields((errors, value) => {
        if (!errors) {
          this.confirmLoading = true
          if (this.editMod) {
            console.log('编辑菜单')
            // api.auth.modifyMenu(this.record.id, value).then((resp) => {
            //   this.visible = false
            //   this.confirmLoading = false
            //   this.$emit('ok', value)
            //   this.form.resetFields()
            // })
          } else {
            api.cicd.createInstance(this.app.id, value).then((resp) => {
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', value)
              this.form.resetFields()
            })
          }
        } else {
          console.log(errors)
        }
      })
    },
    onClose() {
      this.visible = false
    },
    levelChange(val) {
      this.level = val
    },
  },
}
</script>
