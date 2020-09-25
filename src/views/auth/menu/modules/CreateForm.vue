<template>
  <div>
    <a-drawer
      title="新增菜单"
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
              <a-form-item label="层级">
                <a-select
                  v-decorator="['level', { rules: [{ required: true, message: '请选择层级' }] }]"
                  placeholder="请选择菜单层级"
                  @change="levelChange"
                >
                  <a-select-option :value="1">一级菜单</a-select-option>
                  <a-select-option :value="2">二级菜单</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="父菜单">
                <a-select v-decorator="['parentId', { rules: [{ required: true, message: '选择父菜单' }] }]" placeholder="选择父级菜单">
                  <a-select-option :value="0" v-if="level === 1">根菜单</a-select-option>
                  <a-select-option v-else v-for="i in menus" :value="i.id" :key="i.id">{{ i.title }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12" style="margin-bottom: 0;">
              <a-form-item label="菜单名">
                <a-input
                  v-decorator="['name', { rules: [{ required: true, message: '请输入菜单名称' }] }]"
                  placeholder="请输入菜单名称，菜单名应为英文"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="组件">
                <a-input v-decorator="['component', { rules: [{ required: true, message: '组件' }] }]" placeholder="请输入组件" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="标题">
                <a-input v-decorator="['title', { rules: [{ required: true, message: '请输入菜单的标题' }] }]" placeholder="请输入菜单的标题">
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24" style="margin-bottom: 0;">
              <a-form-item label="路径">
                <a-input
                  v-decorator="['path', { rules: [{ required: true, message: '路径不能为空' }] }]"
                  style="width: 100%;"
                  placeholder="请输入路径"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="重定向">
                <span>
                  <a-switch v-model="redirect"></a-switch>
                </span>
                <a-input
                  v-if="redirect"
                  v-decorator="['redirect', { rules: [{ required: true, message: '重定向地址不能为空' }] }]"
                  style="width: 90%; margin-left: 20px; float: right;"
                  placeholder="请输入重定向地址"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-button type="link" @click="advance = !advance" style="padding-left: 0;">高级设置</a-button>
            </a-col>
          </a-row>
          <template v-if="advance">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="图标">
                  <a-input
                    v-decorator="['icon', { rules: [{ required: false, message: '请输入图标' }] }]"
                    style="width: 100%;"
                    placeholder="请选择图标"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="权重">
                  <a-input-number
                    v-decorator="['weight', { initialValue: 10, rules: [{ required: false, message: 'Please enter url description' }] }]"
                    placeholder="请设置菜单权重"
                    style="width: 100%;"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="在菜单栏显示">
                  <a-switch v-decorator="['show', { initialValue: true, valuePropName: 'checked' }]" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="缓存">
                  <a-switch v-decorator="['keepAlive', { initialValue: true, valuePropName: 'checked' }]"></a-switch>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
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
      menus: [],
    }
  },
  methods: {
    showDrawer() {
      this.visible = true
      this.confirmLoading = false
      this.getList({ level: 1, show: true })
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
            api.auth.modifyMenu(this.record.id, value).then((resp) => {
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', value)
              this.form.resetFields()
            })
          } else {
            api.auth.createMenu(value).then((resp) => {
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
    getList(params) {
      api.auth.getMenus(params).then((resp) => {
        this.menus = resp.data
      })
    },
    levelChange(val) {
      this.level = val
    },
  },
}
</script>
