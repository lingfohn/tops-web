<template>
  <div>
    <a-modal title="新增权限" :visible="visible" @ok="handleOk" @cancel="handleCancel" :confirmLoading="confirmLoading">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="权限名">
            <a-input v-decorator="['summary', { rules: [{ required: true, min: 1, message: '该字段不能为空' }] }]"></a-input>
          </a-form-item>
          <a-form-item label="方法">
            <a-select v-decorator="['method', { rules: [{ required: true, message: '选择Http方法' }] }]">
              <a-select-option value="GET">GET</a-select-option>
              <a-select-option value="POST">POST</a-select-option>
              <a-select-option value="PUT">PUT</a-select-option>
              <a-select-option value="DELETE">DELETE</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="路径">
            <a-input v-decorator="['fullpath', { rules: [{ required: true, min: 1, message: '该字段不能为空' }] }]"></a-input>
          </a-form-item>
          <a-form-item label="Action">
            <a-input v-decorator="['action', { rules: [{ required: true, min: 1, message: '该字段不能为空' }] }]"></a-input>
          </a-form-item>
          <a-form-item label="控制级别">
            <a-select :allowClear="true" v-decorator="['controlLevel', { initialValue: 1, rules: [{ required: true, message: '该字段不能为空' }] }]">
              <a-select-option :value="1">Level 1</a-select-option>
              <a-select-option :value="2">Level 2</a-select-option>
              <a-select-option :value="3">Level 3</a-select-option>
              <a-select-option :value="4">Level 4</a-select-option>
            </a-select>
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
      editMod: false,
      record: {},
      form: this.$form.createForm(this),
    }
  },
  methods: {
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
          if (this.editMod) {
            // 修改权限
            api.auth.modifyPermission(this.record.id, value).then(
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
            // 新增权限
            api.auth.createPermission(value).then(
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
      this.editMod = false
      this.form.resetFields()
    },
  },
}
</script>
