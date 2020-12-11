<template>
  <page-layout :title="title" logo="https://gitblog-me.oss-cn-hangzhou.aliyuncs.com/20201201105143.svg">
    <description-list slot="headerContent" size="small" :col="2" class="detail-layout">
      <detail-list-item term="支持灰度">{{ app.multi ? '是' : '否' }}</detail-list-item>
      <detail-list-item term="当前版本">k1.18.2</detail-list-item>
      <detail-list-item term="发布时间">2020-12-23 13：53</detail-list-item>
      <detail-list-item term="发布人">张三</detail-list-item>
      <detail-list-item term="切换时间">切换时间</detail-list-item>
    </description-list>
    <template slot="action">
      <a-button>切换实例</a-button>
      <a-button type="primary" style="margin-left: 5px;" @click="handleCreateInstance">新建实例</a-button>
    </template>
    <a-card title="实例列表" :bordered="false">
      <div slot="extra">
        <a-radio-group v-model="status">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="processing">进行中</a-radio-button>
          <a-radio-button value="waiting">等待中</a-radio-button>
        </a-radio-group>
        <a-input-search style="margin-left: 16px; width: 272px;" />
      </div>
      <a-list item-layout="horizontal" :pagination="pagination" :data-source="data">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta :description="item.title">
            <span slot="title">{{ item.name }}</span>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="handleBuild(item)" style="margin-left: 5px">发版</a>
            <a @click="handleBuildLog(item)" style="margin-left: 5px">日志</a>
            <a @click="handleBuildList(item)" style="margin-left: 5px">构建记录</a>
          </div>
          <div slot="actions">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item><a>编辑</a></a-menu-item>
                <a-menu-item><a>删除</a></a-menu-item>
              </a-menu>
              <a>更多<a-icon type="down" /></a>
            </a-dropdown>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>Owner</span>
              <p>张三</p>
            </div>
            <div class="list-content-item">
              <span>开始时间</span>
              <p>2020-12-20</p>
            </div>
            <div class="list-content-item">
              <span>开始时间</span>
              <p>2020-12-20</p>
            </div>
            <div class="list-content-item">
              <span>发布时间</span>
              <p>2020-12-20</p>
            </div>
            <div class="list-content-item">
              <span>当前状态</span>
              <p>ss</p>
            </div>
            <div class="list-content-item">
              <a-progress :percent="90" status="active" style="width: 180px;" />
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
    <create-instance ref="createInstance" @ok="getList"></create-instance>
    <build-form ref="buildForm" @ok="getList"></build-form>
  </page-layout>
</template>
<script>
import api from '@/api'
import { PageLayout } from '@/layouts'
import CreateInstance from './modules/CreateInstance'
import BuildForm from "./modules/BuildForm";
import DescriptionList from '@/components/DescriptionList/DescriptionList'
const DetailListItem = DescriptionList.Item
export default {
  name: 'ApplicationDetail',
  components: {
    PageLayout,
    DescriptionList,
    CreateInstance,
    BuildForm,
    DetailListItem,
  },
  mounted() {
    this.appid = this.$route.params['id']
    this.getApplication()
    this.getInstance()
  },
  data() {
    return {
      message: 'hello world',
      status: '',
      data: [
        {
          title: 'K1.50.2',
          progress: {
            value: 100,
          },
        },
        {
          title: 'K1.50.3',
          progress: {
            value: 80,
          },
        },
        {
          title: 'K1.50.5',
          progress: {
            value: 90,
          },
        },
        {
          title: 'K1.50.5',
          progress: {
            value: 100,
          },
        },
      ],
      appid: '',
      app: {},
      pagination: {
        current: 1,
        showSizeChanger: true,
        pageSizeOptions: ['2', '4', '6', '100'],
        pageSize: 2,
        onChange: this.handleListChange,
        onShowSizeChange: this.handleListChange,
      },
    }
  },
  methods: {
    handleListChange(cur, pageSize) {
      this.pagination.pageSize = pageSize
      this.pagination.current = cur
      this.getInstance()
    },
    // 构建
    handleBuild(ins){
      this.$refs.buildForm.add(ins.id)
    },
    // 构建日志
    handleBuildLog(instance) {
      console.log('show build log')
    },
    handleBuildList(instance) {
      console.log('show instance build')
    },
    getList() {
      this.getApplication()
      this.getInstance()
    },
    getApplication() {
      api.cicd.getApplication(this.appid).then((resp) => {
        this.app = resp.data
      })
    },
    getInstance() {
      // 查询实例
      const { pageSize, current } = { ...this.pagination }
      const params = { pageSize: pageSize, current: current }
      api.cicd.getInstances(this.appid, params).then((resp) => {
        this.data = resp.data
        this.pagination.total = resp.total
      })
    },
    handleCreateInstance() {
      this.$refs.createInstance.showDrawer(this.app)
    },
  },
  computed: {
    title() {
      return '应用名: ' + this.app.name
    },
  },
}
</script>

<style lang="less" scoped>
.detail-layout {
  margin-left: 44px;
}
.list-content-item {
  color: rgba(0, 0, 0, 0.45);
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 40px;
  span {
    line-height: 20px;
  }
  p {
    margin-top: 4px;
    margin-bottom: 0;
    line-height: 22px;
  }
}
</style>
