<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.createForm.showDrawer()">新建</a-button>
    </div>
    <a-table :pagination="pagination" @change="handleTableChange" :columns="columns" :row-key="(record) => record.id" :data-source="data">
      <!-- prettier-ignore -->
      <template v-slot:keepAlive="text">{{ text? '是' : '否' }}</template>
      <span slot="show" slot-scope="text">{{ text ? '是' : '否' }}</span>
      <template v-slot:action="record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="handleDelete(record)">删除</a>
      </template>
    </a-table>
    <create-form ref="createForm" @ok="getList"></create-form>
  </a-card>
</template>
<script>
import api from '@/api'
import CreateForm from './modules/CreateForm'
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'title',
    key: 'title',
    sorter: true,
  },
  {
    title: '路径',
    dataIndex: 'path',
    key: 'path',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: '12%',
  },
  {
    title: 'keepAlive',

    key: 'keepAlive',
    scopedSlots: { customRender: 'keepAlive' },
  },
  {
    title: '组件',
    dataIndex: 'component',
    key: 'component',
    sorter: true,
  },
  {
    title: '是否可见',
    dataIndex: 'show',
    scopedSlots: { customRender: 'show' },
    key: 'show',
  },
  {
    title: '排序',
    dataIndex: 'weight',
    key: 'weight',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  components: {
    CreateForm,
  },
  data() {
    return {
      advanced: false,
      data: [],
      columns,
      pagination: {
        pageSize: 10,
        current: 1,
        showSizeChanger: true,
        pageSizeOptions: ['10', '15', '20', '25'],
      },
      queryParam: {},
      sorter: {},
      loading: false,
    }
  },
  methods: {
    getList() {
      this.loading = true
      const { pageSize, current } = { ...this.pagination }
      const mquery = { level: 1, withSubmenus: true }
      const params = { pageSize: pageSize, current: current, ...this.sorter, ...this.queryParam, ...mquery }
      api.auth.getMenus(params).then((resp) => {
        this.data = resp.data.map((item) => {
          return { ...item, children: item.edges.submenus }
        })
        const pagination = { ...this.pagination }
        pagination.total = resp.total
        this.pagination = pagination
        this.loading = false
      })
    },
    handleDelete(record) {
      api.auth.deleteMenu(record.id).then((resp) => {
        this.getList()
      })
    },
    handleEdit(record) {
      this.$refs.createForm.edit(record)
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = pagination
      this.sorter = {
        sortField: sorter.field,
        sortOrder: sorter.order,
      }
      this.getList()
    },
  },
  mounted() {
    this.getList()
  },
}
</script>
