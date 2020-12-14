<!--
 * @Descripttion:
 * @Author: mikasa
 * @Date: 2020-08-19 10:56:53
-->
<template>
  <div class="account-list">
    <!-- 顶部筛选 -->
    <el-row :gutter="20">
      <el-col :xl="2" :lg="1">
        <div class="grid-content bg-purple kongbai" />
      </el-col>
      <el-col :xl="4" :lg="5">
        <div class="grid-content bg-purple index-item">
          <span class="index-item-span">关键字：</span>
          <el-input v-model="filters.keywords" placeholder="请输入关键字" />
        </div>
      </el-col>

      <el-col :xl="2" :lg="2">
        <download-excel
          class="export-excel-wrapper"
          :fields="json_fields"
          :fetch="fetchData"
          :before-generate="startDownload"
          :before-finish="finishDownload"
          name="提现账户信息.xls"
        >
          <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
          <el-button type="primary" size="small">导出EXCEL</el-button>
        </download-excel>
      </el-col>

      <el-col :xl="2" :lg="1">
        <el-button type="primary" size="small" style="margin-left:10px" @click="query">查询</el-button>
        <div class="grid-content bg-purple kongbai" />
      </el-col>

    </el-row>
    <!-- 表格 -->
    <el-row :gutter="20" style="margin-top:50px">
      <el-col :span="2">
        <div class="grid-content bg-purple kongbai" />
      </el-col>
      <el-col :span="20">
        <el-table
          v-loading="loading"
          :data="tableData"
          :border="true"
          style="width: 100%"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table-column label="用户ID" width="300">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.userId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邀请码" width="120">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.invitationCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账户名" width="120">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账户类型" width="140">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.withdrawType === 'USER_WA_01' ? '支付宝' : scope.row.withdrawType === 'USER_WA_02' ? '储蓄卡' : '其它' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账户号" width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.accountNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="220">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            :current-page="filters.pageNo"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="filters.pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
      <el-col :span="2">
        <div class="grid-content bg-purple kongbai" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { AccountList,AllAccountList } from '@/api'

export default {
  data() {
    return {
      totalpage: 20, // 总条数
      totalCount: 1, // 总条数
      loading: false, // loading
      filters: {
        keywords: '', // 关键字
        pageSize: 10,
        pageNo: 1 // 当前页数
      },
      tableData: [],
     json_fields: {
       '邀请码':'invitationCode',
        '账户名': 'userName', // 支持嵌套属性
        '账户号': 'accountNumber' // 常规字段
      }
    }
  },
  methods: {
    async fetchData() {
      // 下载数据
      var result = await AllAccountList()
      console.log(result)
      if (result.code === 0) {
        return result.data
      }
      console.log('请求数据')
    },
    startDownload() {
      console.log('开始下载')
    },
    finishDownload() {
      console.log('下载完成')
    },
    query() {
      
      this.getdata()
    },
    getdata() {
      this.loading = true

      AccountList(this.filters).then((res) => {
        console.log(res)
        this.totalCount = res.data.totalCount
        this.tableData = res.data.list
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    handleSizeChange(val) {
      // 每页条数变化
      // 发送请求

      this.filters.pageSize = val
      this.getdata()
    },
    handleCurrentChange(val) {
      // 当前页数
      // 发送请求
      this.filters.pageNo = val
      this.getdata()
    },
    handleEdit(index, row) {
      // 编辑
      console.log(index, row)
    },
    handleDelete(index, row) {
      // 删除
      console.log(index, row)
    }
  }
}
</script>

<style lang="less">
.account-list {
  margin-top: 20px;
  .index-item {
    display: flex;
    margin-left: 50px;
    .index-item-span {
      color: rgb(70, 73, 71);
      width: 150px;
      text-align: center;
      line-height: 36px;
    }
  }
  .pagination {
    margin-top: 20px;
    float: right;
    margin-bottom: 50px;
  }
  .pagination::before {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .kongbai {
    width: 100%;
    height: 1px;
  }
}
</style>
