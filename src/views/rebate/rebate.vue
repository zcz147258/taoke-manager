<!--
 * @Descripttion:
 * @Author: mikasa
 * @Date: 2020-08-19 10:56:53
-->
<template>
  <div class="rebate-list">
    <!-- 顶部筛选 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline serachForm">
      <el-form-item label="关键字">
        <el-input v-model="formInline.keywords" placeholder="请输入邀请码" />
      </el-form-item>
      <el-form-item label="返利状态">
        <el-select v-model="formInline.type" placeholder="请选择">
          <el-option label="全部" value="" />
          <el-option label="已返利" value="CPS_OR_01" />
          <el-option label="待返利" value="CPS_OR_02" />
          <el-option label="无返利" value="CPS_OR_03" />
        </el-select>
      </el-form-item>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="formInline.orderSn" placeholder="订单号" />
      </el-form-item>
      <el-form-item label="开始时间：">
        <el-date-picker
          v-model="formInline.startTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item label="结束时间：">
        <el-date-picker
          v-model="formInline.endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item>
        <div class="grid-content bg-purple index-item">
          <span class="index-item-span">提现状态：  </span>
          <el-select v-model="formInline.platformId" placeholder="请选择平台">
            <el-option label="淘宝" value="1" />
            <el-option label="京东" value="2" />
            <el-option label="拼多多" value="3" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>

    </el-form>
    <el-col style="margin-left:50px" :xl="2" :lg="5">
      <download-excel
        class="export-excel-wrapper"
        :fields="json_fields"
        :fetch="fetchData"
        :before-generate="startDownload"
        :before-finish="finishDownload"
        :stringify-long-num="true"
        name="返利明细.xls"
      >
        <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
        <el-button type="primary" size="small">导出EXCEL</el-button>
      </download-excel>
    </el-col>
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
          <el-table-column label="用户ID" min-width="280px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.userId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邀请码" min-width="100px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.invitationCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单号" min-width="220px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.orderSn }}</span>
            </template>
          </el-table-column>
          <el-table-column label="平台id" min-width="120px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.platformId==1?"淘宝":scope.row.platformId==2?"京东":"拼多多" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账户余额" min-width="120px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.balance/100 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="返利金额" min-width="120px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.amount/100 }}</span>
            </template>
          </el-table-column>

          <el-table-column label="返利比例" min-width="120px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.amountRatio/1000 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额类型" min-width="120px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.amountTypeName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="到账时间" min-width="220px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.reachTime }}</span>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            :current-page="formInline.pageNo"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="formInline.pageSize"
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
    <!--
    <el-dialog title :visible.sync="dialogFormVisible">
      <el-form :model="orderItemForm">
        <el-form-item label="商品Id" :label-width="formLabelWidth">
          <el-input v-model="orderItemForm.goodsId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品链接" :label-width="formLabelWidth">
          <el-input v-model="orderItemForm.goodsLink" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="orderItemForm.goodsName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品单价" :label-width="formLabelWidth">
          <el-input v-model="orderItemForm.goodsPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" :label-width="formLabelWidth">
          <el-input v-model="orderItemForm.goodsQuantity" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品主图地址" :label-width="formLabelWidth">
          <el-input v-model="orderItemForm.goodsThumbnailUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="订单号" :label-width="formLabelWidth">
          <el-input v-model="orderItemForm.orderId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="店铺名称" :label-width="formLabelWidth">
          <el-input v-model="orderItemForm.shopTitle" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { userAccountList, WithdrawsListDownload } from '@/api'
// 引入日期格式化
import moment from 'moment'
export default {
  data() {
    return {
      totalpage: 20, // 总条数
      totalCount: 1, // 总条数
      loading: false, // loading

      formInline: {
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        keywords: '', // 关键字
        type: '',

        pageSize: 10,
        pageNo: 1 // 当前页数
      },
      tableData: [],
      json_fields: {
        '单号': {
          callback: value => {
            // platformId==1?"淘宝":scope.row.platformId==2?"京东":"拼多多"
            return '&nbsp;' + value.orderSn
          }
        },
        '邀请码': 'invitationCode', // 常规字段
        '佣金金额(元)': {
          callback: value => {
            // platformId==1?"淘宝":scope.row.platformId==2?"京东":"拼多多"
            return (value.promotionAmount) / 100
          }
        },
        '返利金额(元)': {
          callback: value => {
            // platformId==1?"淘宝":scope.row.platformId==2?"京东":"拼多多"
            return (value.amount) / 100
          }
        },
        '返利比例(千分比)': {
          callback: value => {
            // platformId==1?"淘宝":scope.row.platformId==2?"京东":"拼多多"
            return (value.amountRatio) / 1000
          }
        },
        '金额类型': 'amountTypeName',
        '返利类型': {
          callback: value => {
            // platformId==1?"淘宝":scope.row.platformId==2?"京东":"拼多多"
            return value.category == 'USER_RC_01' ? '购物返利' : '推广返利'
          }
        },
        '平台ID': {
          callback: value => {
            // platformId==1?"淘宝":scope.row.platformId==2?"京东":"拼多多"
            return value.platformId == 1 ? '淘宝' : value.platformId == 2 ? '京东' : '拼多多'
          }
        }
      },
      dialogFormVisible: false,
      orderItemForm: {
        goodsId: '',
        goodsLink: '',
        goodsName: '',
        goodsPrice: '',
        goodsQuantity: '',
        goodsThumbnailUrl: '',
        orderId: '',
        shopTitle: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    async fetchData() {
      // this.formInline.startTime = moment(this.formInline.startTime)
      //   .utc(8)
      //   .format('YYYY-MM-DD HH:mm:ss')
      // this.formInline.endTime = moment(this.formInline.endTime)
      //   .utc(8)
      //   .format('YYYY-MM-DD HH:mm:ss')
      // 下载数据
      var result = await userAccountList({ 'pageSize': 1000, 'startTime': this.formInline.startTime, 'endTime': this.formInline.endTime })
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
    onSubmit() {
      if (!this.formInline.startTime || !this.formInline.endTime) {
        this.$message.error('请选择时间')
        return
      }
      this.getdata()
    },
    getdata() {
      this.loading = true

      userAccountList(this.formInline)
        .then((res) => {
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

      this.formInline.pageSize = val
      this.getdata()
    },
    handleCurrentChange(val) {
      // 当前页数
      // 发送请求
      this.formInline.pageNo = val
      this.getdata()
    },
    handleSee(index, row) {
      // 查看
      this.dialogFormVisible = true
      console.log('查看', index, row)
      orderItem({ orderId: index }).then((res) => {
        console.log('查看', res)
        if (res.code == 0) {
          this.orderItemForm = res.data[0]
        }
      })
    }
  }
}
</script>

<style lang="less">
.rebate-list {
  margin-top: 20px;
  .serachForm{
   padding: 0 50px;
  }
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
