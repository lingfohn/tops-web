<template>
  <div>
    <a-modal title="新增用户" :visible="visible" @ok="handleOk" @cancel="handleCancel" :confirmLoading="confirmLoading">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="用户">
            <a-input v-decorator="['username', { rules: [{ required: true, min: 1, message: '请输入用户名' }] }]"></a-input>
          </a-form-item>
          <a-form-item label="邮箱">
            <a-input v-decorator="['email', { rules: [{ required: true, min: 3, message: '请输入用户邮箱' }] }]"></a-input>
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['status', { initialValue: 1, rules: [{ required: true, message: '该字段不能为空' }] }]">
              <a-select-option :value="1">可用</a-select-option>
              <a-select-option :value="2">禁用</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api'
export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
    }
  },
  methods: {
    add() {
      this.visible = true
    },
    handleOk() {
      const {
        form: { validateFields },
      } = this
      validateFields((errors, value) => {
        if (!errors) {
          this.confirmLoading = true
          api.auth.createUsers(value).then(
            (resp) => {
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', value)
              this.form.resetFields()
            },
            (errors) => {
              this.confirmLoading = false
              // TODO 这里处理错误消息
            }
          )
        } else {
          console.log(errors)
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      this.form.resetFields()
    },
  },
}
</script>
