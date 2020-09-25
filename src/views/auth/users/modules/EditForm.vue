<template>
  <a-modal title="修改用户" :visible="visible" :confirm-loading="confirmLoading" @ok="ok" @cancel="cancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="用户名">
          <span>{{ record.username }}</span>
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-decorator="['name', { rules: [{ required: true, message: 'Please input your note!' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-decorator="['email', { rules: [{ required: true, message: 'Please input your note!' }] }]"></a-input>
        </a-form-item>
        <a-form-item label="手机">
          <a-input v-decorator="['telephone', { rules: [{ required: true, message: 'Please input your note!' }] }]"></a-input>
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
</template>

<script>
import api from '@/api'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      record: {},
    }
  },
  methods: {
    edit(record) {
      this.visible = true
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
    ok() {
      const {
        form: { validateFields },
      } = this
      validateFields((errors, value) => {
        if (!errors) {
          this.confirmLoading = true
          api.auth.modifyUser(this.record.id, value).then(
            (resp) => {
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', value)
              this.form.resetFields()
            },
            (errors) => {
              this.confirmLoading = false
            }
          )
        }
      })
    },
    cancel() {
      this.visible = false
    },
  },
}
</script>
