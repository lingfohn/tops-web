<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" placeholder="输入角色名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-select v-model="queryParam.status" placeholder="请选择状态">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="1">启用</a-select-option>
              <a-select-option value="2">禁用</a-select-option>
            </a-select>
          </a-col>
          <a-col :md="(!advanced && 8) || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}">
              <a-button type="primary" @click="getList">查询</a-button>
              <a-button @click="() => (queryParam = {})" style="margin-left: 8px;">重置</a-button>
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
      :columns="columns"
      :dataSource="data"
      :row-key="(record) => record.id"
      @change="handleTableChange"
      :loading="loading"
    >
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record)">删除</a>
        </template>
      </span>
    </a-table>
    <create-form ref="createForm" @ok="getList"></create-form>
  </a-card>
</template>
<script>
import api from '@/api'
import CreateForm from './modules/CreateForm'
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
  components: {
    CreateForm,
  },
  data() {
    const columns = [
      {
        title: '角色名',
        dataIndex: 'name',
        sorter: true,
        key: 'name',
      },
      {
        title: '描述',
        dataIndex: 'description',
        sorter: true,
        key: 'description',
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
    getList() {
      this.loading = true
      const { pageSize, current } = { ...this.pagination }
      const params = { pageSize: pageSize, current: current, ...this.sorter, ...this.queryParam }
      api.auth.getRoles(params).then((resp) => {
        this.data = resp.data
        const pagination = { ...this.pagination }
        pagination.total = resp.total
        this.pagination = pagination
        this.loading = false
      })
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = pagination
      this.sorter = {
        sortField: sorter.field,
        sortOrder: sorter.order,
      }
      this.getList()
    },
    handleEdit(record) {
      this.$refs.createForm.edit(record)
    },
    handleDelete(record) {
      api.auth.deleteRole(record.id).then((resp) => {
        this.getList()
      })
    },
  },
}
</script>
