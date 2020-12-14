<!--
 * @Descripttion:
 * @Author: mikasa
 * @Date: 2020-08-19 10:56:53
-->
<template>
  <div class="index">
    <!-- 顶部筛选 -->
    <el-row :gutter="20">
      <el-col :xl="2" :lg="1">
        <div class="grid-content bg-purple kongbai" />
      </el-col>
      <el-col :xl="4" :lg="5">
        <div class="grid-content bg-purple index-item">
          <span class="index-item-span">关键字：</span>
          <el-input v-model="keywords" placeholder="请输入关键字" />
        </div>
      </el-col>
      <el-col :xl="5" :lg="6">
        <div class="grid-content bg-purple index-item">
          <span class="index-item-span">开始时间：</span>
          <el-date-picker v-model="time_start" type="datetime" placeholder="选择日期时间" />
        </div>
      </el-col>
      <el-col :xl="5" :lg="6">
        <div class="grid-content bg-purple index-item">
          <span class="index-item-span">结束时间：</span>
          <el-date-picker v-model="time_end" type="datetime" placeholder="选择日期时间" />
        </div>
      </el-col>
      <el-col :xl="2" :lg="2">
        <download-excel
          class="export-excel-wrapper"
          :data="json_data"
          :fields="json_fields"
          name="远程诊断报告导出.xls"
        >
          <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
          <el-button type="primary" size="small">导出EXCEL</el-button>
        </download-excel>
      </el-col>
      <el-col :xl="2" :lg="1">
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
          <el-table-column label="日期" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.date }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
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
            :current-page="currentPage"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="10"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalpage"
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
export default {
  data() {
    return {
      keywords: '', // 关键字
      time_start: '', // 开始时间
      time_end: '', // 结束时间
      currentPage: 1, // 当前页数
      totalpage: 20, // 总条数
      loading: false, // loading
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      json_fields: {
        '头部-诊断名称': 'name', // 常规字段
        '头部-联系电话': 'phone.mobile', // 支持嵌套属性
        '头部-损坏区域代码': {
          field: 'phone.landline',
          // 自定义回调函数
          callback: value => {
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
      ]
    }
  },
  methods: {
    handleSizeChange(val) {
      // 每页条数变化
      // 发送请求
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // 当前页数
      // 发送请求
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
      console.log(`当前页: ${val}`)
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
.index {
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
