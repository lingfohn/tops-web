<template>
  <div>
    <a-modal title="新增角色" :visible="visible" @ok="handleOk" @cancel="handleCancel" :confirmLoading="confirmLoading">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="角色名称">
            <a-input v-decorator="['name', { rules: [{ required: true, min: 1, message: '该字段不能为空' }] }]"></a-input>
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['status', { initialValue: 1, rules: [{ required: true, message: '该字段不能为空' }] }]">
              <a-select-option :value="1">可用</a-select-option>
              <a-select-option :value="2">禁用</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="描述">
            <a-textarea :row="3" v-decorator="['description', { rules: [{ required: true, min: 1, message: '该字段不能为空' }] }]"></a-textarea>
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
      editMod: false,
      record: {},
      form: this.$form.createForm(this),
    }
  },
  methods: {
    add() {
      this.editMod = false
      this.visible = true
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
            api.auth.modifyRole(this.record.id, value).then(
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
          } else {
            api.auth.createRole(value).then(
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
