<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="项目">
              <a-input v-model="queryParam.projectName" placeholder="输入项目名模糊查询"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="类型">
              <a-select v-model="queryParam.proType" placeholder="项目类型">
                <a-select-option value="service">后端</a-select-option>
                <a-select-option value="web">前端</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
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
      <a-button type="primary" icon="plus" @click="$refs.createForm.showDrawer()">新建</a-button>
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
      <template v-slot:multi="text">{{ text.multi ? '是' : '否' }}</template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical"></a-divider>
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
const columns = [
  {
    title: '应用名',
    dataIndex: 'name',
    sorter: true,
    key: 'name',
  },
  {
    title: '支持灰度',
    scopedSlots: { customRender: 'multi' },
    key: 'multi',
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

export default {
  components: {
    CreateForm,
  },
  data() {
    return {
      queryParam: {},
      advanced: false,
      columns,
      data: [],
      pagination: {
        pageSize: 2,
        current: 1,
        showSizeChanger: true,
        pageSizeOptions: ['2', '4', '6', '100'],
      },
      sorter: {},
      loading: false,
    }
  },
  mounted() {
    this.getList()
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
      api.cicd.getApplications(params).then((resp) => {
        this.data = resp.data
        const pagination = { ...this.pagination }
        pagination.total = resp.total
        this.pagination = pagination
        this.loading = false
      })
    },
  },
}
</script>
