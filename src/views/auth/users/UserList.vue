<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户">
              <a-input v-model="queryParam.username" placeholder="输入用户名查询"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="用户状态">
              <a-select v-model="queryParam.status" placeholder="请选择用户状态" default-value="0">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="1">启用</a-select-option>
                <a-select-option value="2">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="姓名">
                <a-input v-model="queryParam.name" placeholder="输入姓名模糊查询"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="邮箱">
                <a-input v-model="queryParam.email" placeholder="输入邮箱模糊查询"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="手机号码">
                <a-input v-model="queryParam.telephone" placeholder="输入手机号模糊查询"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="(!advanced && 8) || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}">
              <a-button type="primary" @click="getList">查询</a-button>
              <a-button @click="() => (queryParam = {})" style="margin-left: 8px;">重置</a-button>
              <a style="margin-left: 8px;" @click="() => (advanced = !advanced)">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"></a-icon>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.createForm.add()">新建</a-button>
    </div>
    <a-table
      :pagination="pagination"
      :loading="loading"
      :columns="columns"
      :dataSource="data"
      :row-key="(record) => record.id"
      @change="handleTableChange"
    >
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleDelete(record)">删除</a>
        </template>
      </span>
    </a-table>
    <create-form ref="createForm" @ok="getList"></create-form>
    <edit-form ref="editForm" @ok="getList"></edit-form>
  </a-card>
</template>

<script>
import api from '@/api'
import CreateForm from './modules/CreateForm'
import EditForm from './modules/EditForm'
const columns = [
  {
    title: '用户',
    dataIndex: 'username',
    sorter: true,
    key: 'username',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    sorter: true,
    key: 'email',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '手机',
    dataIndex: 'telephone',
    key: 'telephone',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true,
    key: 'updatedAt',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' },
  },
]
const statusMap = {
  1: {
    status: 'success',
    text: '启用',
  },
  2: {
    status: 'error',
    text: '禁用',
  },
}
export default {
  name: 'UserList',
  components: {
    CreateForm,
    EditForm,
  },
  data() {
    return {
      advanced: false,
      data: [],
      columns,
      pagination: {
        pageSize: 2,
        current: 1,
        showSizeChanger: true,
        pageSizeOptions: ['2', '4', '6', '100'],
      },
      queryParam: {},
      sorter: {},
      loading: false,
    }
  },
  mounted() {
    this.getList()
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    },
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      this.pagination = pagination
      this.sorter = {
        sortField: sorter.field,
        sortOrder: sorter.order,
      }
      this.getList()
    },
    getList() {
      this.loading = true
      const { pageSize, current } = { ...this.pagination }
      const params = { pageSize: pageSize, current: current, ...this.sorter, ...this.queryParam }
      api.auth.getUsers(params).then((resp) => {
        this.data = resp.data
        const pagination = { ...this.pagination }
        pagination.total = resp.total
        this.pagination = pagination
        this.loading = false
      })
    },
    handleEdit(record) {
      console.log(record)
      this.$refs.editForm.edit(record)
    },
    handleDelete(record) {
      api.auth.deleteUsers(record.id).then((resp) => {
        this.getList()
      })
    },
  },
}
</script>
