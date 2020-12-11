<template>
  <div>
    <a-modal title="新建构建" :visible="visible" @ok="handleOk" @cancel="handleCancel" :confirmLoading="confirmLoading">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="Tag">
            <a-select v-decorator="['tag', { rules: [{ required: true, message: '该字段不能为空' }] }]">
              <a-select-option v-for="i in tags" :value="i.tag" :key="i.tag">{{i.tag}}</a-select-option>
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
      insId: '',
      tags: []
    }
  },
  methods: {
    add(insId) {
      this.editMod = false
      this.confirmLoading = true
      this.visible = true
      this.insId=insId
      api.cicd.loadInstanceTag(insId).then(resp=>{
        this.tags = resp.data.tags
        this.confirmLoading = false
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
            // api.auth.modifyRole(this.record.id, value).then(
            //   (resp) => {
            //     this.visible = false
            //     this.confirmLoading = false
            //     this.$emit('ok', value)
            //     this.form.resetFields()
            //   },
            //   (errors) => {
            //     this.confirmLoading = false
            //   }
            // )
          } else {
            api.cicd.createInstanceBuild(this.insId,value).then(
              (resp) => {
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', value)
                this.form.resetFields()
              },
              (errors) => {
                this.confirmLoading = false
                this.visible = false
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
