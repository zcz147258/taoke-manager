<!--
 * @Descripttion:
 * @Author: mikasa
 * @Date: 2020-08-19 10:56:53
-->
<template>
  <div class="withdraw-list">
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

      <el-col :xl="4" :lg="6">
        <div class="grid-content bg-purple index-item">
          <span class="index-item-span">开始时间：</span>
          <el-date-picker v-model="filters.startTime" type="datetime" placeholder="选择日期时间" />
        </div>
      </el-col>
      <el-col :xl="4" :lg="6">
        <div class="grid-content bg-purple index-item">
          <span class="index-item-span">结束时间：</span>
          <el-date-picker v-model="filters.endTime" type="datetime" placeholder="选择日期时间" />
        </div>
      </el-col>

    </el-row>

    <el-row :gutter="20" style="margin-top:20px;margin-left:10px">
      <el-col :xl="2" :lg="1">
        <div class="grid-content bg-purple kongbai" />
      </el-col>
      <el-col :xl="3" :lg="4">
        <div class="grid-content bg-purple index-item">
          <span class="index-item-span">提现状态：  </span>
          <el-select v-model="filters.status" placeholder="请选择活动区域">
            <el-option label="提现中" value="USER_WS_01" />
            <el-option label="提现成功" value="USER_WS_03" />
            <el-option label="全部" value="" />
          </el-select>
        </div>
      </el-col>
      <el-col :xl="2" :lg="2">
        <download-excel
          class="export-excel-wrapper"
          :fields="json_fields"
          :fetch="fetchData"
          :before-generate="startDownload"
          :before-finish="finishDownload"
          name="提现申请.xls"
        >
          <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
          <el-button v-has="'sys:withdraw:export'" type="primary" size="small">导出EXCEL</el-button>
        </download-excel>
      </el-col>
      <el-col :xl="10" :lg="10">
        <el-button type="primary" size="small" style="margin-left:10px" @click="query">查询</el-button>
        <div class="grid-content bg-purple kongbai" />
      </el-col>
      <el-col :xl="2" :lg="2">
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
          <el-table-column label="编号" width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账户名" width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.accountName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="帐户号" width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.accountNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="提现金额" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.amount / 100 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实际到账金额" width="140">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.actualAmount / 100 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手续费" width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.fee / 100 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="提现状态" width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.status ==='USER_WS_01' ? '审核中':scope.row.status === 'USER_WS_02' ? '提现中' : '提现成功' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column> -->
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
import { WithdrawsList, DownloadWithdraws } from '@/api'
// 引入日期格式化
import moment from 'moment'
export default {
  data() {
    return {
      totalpage: 20, // 总条数
      totalCount: 1, // 总条数
      loading: false, // loading
      filters: {
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        keywords: '', // 关键字
        pageSize: 10,
        pageNo: 1, // 当前页数
        status: ''// 提现状态
      },
      tableData: [],
      json_fields: {
        '序号(必填)': 'id', // 支持嵌套属性
        '收款方姓名(必填)': 'accountName', // 常规字段
        '收款方支付宝账号(必填)': 'accountNo', // 支持嵌套属性
        '金额(必填，单位：元)': 'actualAmount', // 支持嵌套属性
        '备注(选填)': {
          callback: value => {
            return ` `
          }
        }
      }
    }
  },
  methods: {
    async fetchData() {
      this.filters.startTime = moment(this.filters.startTime)
        .utc(8)
        .format('YYYY-MM-DD HH:mm:ss')
      this.filters.endTime = moment(this.filters.endTime)
        .utc(8)
        .format('YYYY-MM-DD HH:mm:ss')
      // 下载数据
      var result = await DownloadWithdraws({ 'startTime': this.filters.startTime, 'endTime': this.filters.endTime })
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
      if (!this.filters.startTime || !this.filters.endTime) {
        this.$message.error('请选择时间')
        return
      }
      this.getdata()
    },
    getdata() {
      console.log(this.filters)

      this.loading = true
      this.filters.startTime = moment(this.filters.startTime)
        .utc(8)
        .format('YYYY-MM-DD HH:mm:ss')
      this.filters.endTime = moment(this.filters.endTime)
        .utc(8)
        .format('YYYY-MM-DD HH:mm:ss')

      // 列表请求
      WithdrawsList(this.filters)
        .then((res) => {
          console.log(res)
          this.totalCount = res.data.totalCount
          this.tableData = res.data.list
          this.loading = false
        })
        .catch((err) => {
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
.withdraw-list {
  margin-top: 20px;
  .index-item {
    display: flex;
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
