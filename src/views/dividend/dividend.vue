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
      <!-- <el-col :xl="3" :lg="4">
        <div class="grid-content bg-purple index-item">
          <span class="index-item-span">提现状态：  </span>
          <el-select v-model="filters.status" placeholder="请选择活动区域">
            <el-option label="提现中" value="USER_WS_01" />
            <el-option label="提现成功" value="USER_WS_03" />
            <el-option label="全部" value="" />
          </el-select>
        </div>
      </el-col> -->
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
          <el-button type="primary" size="small">导出EXCEL</el-button>
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
        <el-table-column label="ID" width="140">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.id }}</span>
            </template>
          </el-table-column>

          <el-table-column label="邀请码" width="150">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.invitationCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="红利金额" width="150">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单号" width="150">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.orderSn }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">添加</el-button>
              <el-button size="mini" type="primary" @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
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
    <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>确定要删除吗？</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancelDelete">取 消</el-button>
    <el-button type="primary" @click="confirmDelete">确 定</el-button>
  </span>
</el-dialog>

 <!-- 弹窗 -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form
        ref="ruleForm"
        :model="currentedit"
        status-icon
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="ID" prop="pass">
          <el-input v-model="currentedit.id" type="text" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item label="邀请码" prop="checkPass">
          <el-input v-model="currentedit.invitationCode" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="金额(分)" prop="checkPass">
          <el-input v-model="currentedit.amount" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm(type)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteBonus, bonusOrderList,updateBonusOrder,addBonusOrder } from '@/api'
// 引入日期格式化
import moment from 'moment'
export default {
  data() {
    return {
      dialogFormVisible:false,
      totalpage: 20, // 总条数
      totalCount: 1, // 总条数
      loading: false, // loading
      filters: {
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        keywords: '', // 关键字
        pageSize: 10,
        pageNo: 1, // 当前页数
      },
      type:'',
      tableData: [],
       dialogVisible: false,
       currentObj:{},
       currentedit: {},
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

      this.loading = true
      this.filters.startTime = moment(this.filters.startTime)
        .utc(8)
        .format('YYYY-MM-DD HH:mm:ss')
      this.filters.endTime = moment(this.filters.endTime)
        .utc(8)
        .format('YYYY-MM-DD HH:mm:ss')

      console.log(this.filters)

      // 列表请求
      bonusOrderList(this.filters)
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
    cancelDelete(){
      this.dialogVisible = false
      this.currentObj = {}
    },
    cancelForm(){
        this.type = ''
    },
    confirmDelete(row){
      this.dialogVisible = false
      deleteBonus(this.currentObj).then(res=>{
        if(res.data){
            this.$message.success('删除成功')
            this.currentObj = {}
            this.getdata()
        }
      }).catch(err=>{
        this.$message.error('删除失败')
        this.currentObj = {}
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
     // 提交表单
    submitForm(name) {
      if(this.type == 'update'){
          updateBonusOrder(this.currentedit).then((res) => {
            this.type = ''
          if (res.code === 0) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.currentedit = {}
            this.getdata()
          }
        })
      }
      if(this.type == 'add'){
          addBonusOrder(this.currentedit).then((res) => {
            this.type = ''
          if (res.code === 0) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.currentedit = {}
            this.getdata()
          }
        })
      }
    },
    handleEdit(index, row) {
      // 编辑
      console.log(index, row)
      // 编辑
      this.dialogFormVisible = true
      this.currentedit = {}
      this.type = 'add'
    },
    handleDelete(index, row) {
      this.dialogVisible = true
      // 删除
      this.currentObj = row
    },
    handleUpdate(index, row){
      console.log(index, row)
      // 编辑
      this.dialogFormVisible = true
      this.currentedit = row
      this.type = 'update'
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
