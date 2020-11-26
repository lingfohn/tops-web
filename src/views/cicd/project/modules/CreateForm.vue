<template>
  <div>
    <a-drawer
      title="新增项目"
      :width="720"
      :visible="visible"
      :header-style="{ height: '64px', boxShadow: '0 1px 1px #ddd' }"
      :body-style="{ paddingBottom: '64px' }"
      @close="onClose"
    >
      <a-form :form="form" layout="vertical" hide-required-mark>
        <a-spin :spinning="confirmLoading">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="项目名">
                <a-input
                  v-decorator="['projectName', { rules: [{ required: true, message: '请输入项目名' }] }]"
                  placeholder="项目名为英文，一般为git名称"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="类型">
                <a-select v-decorator="['proType', { rules: [{ required: true, message: '请选择项目类型' }] }]" placeholder="选择项目类型">
                  <a-select-option value="service">后端</a-select-option>
                  <a-select-option value="web">前端</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="gitlab">
                <a-input v-decorator="['gitlab', { rules: [{ required: true, message: '请输入gitlab地址' }] }]" placeholder="gitlab地址"> </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12" style="margin-bottom: 0;">
              <a-form-item label="端口">
                <a-input-number
                  style="width: 100%;"
                  v-decorator="['port', { rules: [{ required: true, message: '请输入项目的端口' }] }]"
                  placeholder="项目监听的端口，由运维分配"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Debug端口">
                <a-input-number
                  style="width: 100%;"
                  v-decorator="['debugPort', { rules: [{ required: true, message: 'debug端口号' }] }]"
                  placeholder="Debug端口号，一般值为={10000+端口号}"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <!--          <a-row>-->
          <!--            <a-col :span="24">-->
          <!--              <a-button type="link" @click="advance = !advance" style="padding-left: 0;">高级设置</a-button>-->
          <!--            </a-col>-->
          <!--          </a-row>-->
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
      advance: false,
      redirect: false,
      visible: false,
      confirmLoading: false,
      editMod: false,
      record: {},
      level: 1,
    }
  },
  methods: {
    showDrawer() {
      this.visible = true
      this.confirmLoading = false
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
            api.cicd.createProject(value).then((resp) => {
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
