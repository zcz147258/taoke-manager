<!--
 * @Descripttion:
 * @Author: mikasa
 * @Date: 2020-08-19 10:56:53
-->
<template>
  <div class="allRebate-list">
    <!-- 顶部筛选 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline serachForm">
      <el-form-item label="关键字">
        <el-input v-model="formInline.keywords" placeholder="请输入邀请码" />
      </el-form-item>

      <!-- <el-form-item label="开始时间：">
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
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

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
          <el-table-column label="用户ID" min-width="140px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.userId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邀请码" min-width="100px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.invitationCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账户余额" min-width="200px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.balance/100 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="余额类型" min-width="200px">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.balanceTypeName }}</span>
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
import { userAllAccountList } from '@/api'
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
        '头部-诊断名称': 'name', // 常规字段
        '头部-联系电话': 'phone.mobile', // 支持嵌套属性
        '头部-损坏区域代码': {
          field: 'phone.landline',
          // 自定义回调函数
          callback: (value) => {
            return `损坏区域代码 - ${value}`
          }
        }
      },
      json_data: [
        {
          name: '损坏的组件一',
          city: 'New York',
          country: 'United States',
          birthdate: '1978-03-15',
          phone: {
            mobile: '1-541-754-3010',
            landline: '(541) 754-3010'
          }
        },
        {
          name: '损坏的组件二',
          city: 'Athens',
          country: 'Greece',
          birthdate: '1987-11-23',
          phone: {
            mobile: '+1 855 275 5071',
            landline: '(2741) 2621-244'
          }
        }
      ],
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
  created() {
    this.getdata()
  },
  methods: {

    onSubmit() {
      // if (!this.formInline.startTime || !this.formInline.endTime) {
      //   this.$message.error('请选择时间')
      //   return
      // }
      this.getdata()
    },
    getdata() {
      this.loading = true

      userAllAccountList(this.formInline)
        .then((res) => {
          console.log('列表数据', res)
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
.allRebate-list {
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
