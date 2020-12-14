<!--
 * @Descripttion:
 * @Author: mikasa
 * @Date: 2020-08-19 10:56:53
-->
<template>
  <div class="config-list">
    <!-- 顶部筛选 -->
    <el-row :gutter="20">
      <el-col :xl="2" :lg="1">
        <div class="grid-content bg-purple kongbai" />
      </el-col>
      <el-col :xl="5" :lg="10">
        <div class="grid-content bg-purple index-item">
          <span class="index-item-span">配置项：</span>
          <el-select v-model="selectable" placeholder="请选择配置项">
            <el-option
              v-for="(item,index) in selectoption"
              :key="index"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </div>
      </el-col>
      <el-col :xl="2" :lg="1">
        <el-button type="warning" size="small" style="margin-left:10px" @click="add">添加</el-button>
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
          <el-table-column label="ID" width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="配置编码" width="150">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column label="配置名称" width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="值类型" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ CalcName(scope.row.type) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="配置值" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </template>
          </el-table-column>
          <el-table-column label="值code" width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.valueCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="配置描述" width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.comment }}</span>
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
    <!-- 弹窗 -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form
        ref="ruleForm"
        :model="currentedit"
        status-icon
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="配置名称" prop="pass">
          <el-input v-model="currentedit.name" type="text" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item label="配置类型" prop="checkPass">
          <el-select v-model="currentedit.type" placeholder="请选择配置项">
            <el-option
              v-for="(item,index) in configoptionlist"
              :key="index"
              :label="item.value"
              :value="item.subCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配置描述" prop="checkPass">
          <el-input v-model="currentedit.comment" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="配置值" prop="checkPass">
          <el-input v-model="currentedit.value" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  AccountList,
  ConfigSelectable,
  ConfigList,
  ListSubDictByCode,
  SaveConfig,
  DelConfig
} from '@/api'
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
        pageNo: 1 // 当前页数
      },
      selectable: '', // 配置项
      selectoption: [], // 配置项列表
      tableData: [],
      configoptionlist: [], // 配置值列表
      dialogFormVisible: false, // 弹窗
      currentedit: {}
    }
  },
  created() {
    // 配置值列表
    ListSubDictByCode({ code: 'CPS_CT' }).then((res) => {
      if (res.code === 0) {
        this.configoptionlist = res.data
      }
    })
    // 请求配置项
    ConfigSelectable().then((res) => {
      if (res.code === 0) {
        this.selectoption = res.data
      }
    })
    // 请求配置列表
    ConfigList().then((res) => {
      if (res.code === 0) {
        this.tableData = res.data
      }
    })
  },
  methods: {
    add() {
      // 新增数据
      var result = this.selectoption.find((item) => {
        return item.code == this.selectable
      })
      if (this.selectable === '') {
        this.$message({
          showClose: true,
          message: '配置项不能为空',
          type: 'error'
        })
      }
      var obj = {
        code: this.selectable,
        comment: '千分比',
        name: result.name,
        type: '',
        value: '',
        valueCode: ''
      }
      this.tableData.push(obj)
      console.log(this.tableData)
    },
    // 提交表单
    submitForm(name) {
      console.log(this.currentedit)
      SaveConfig(this.currentedit).then((res) => {
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
    },
    CalcName(id) {
      var res = this.configoptionlist.find((item) => {
        return id == item.subCode
      })
      console.log(res)
      if (!res) {
        return 'dsada'
      } else {
      }
      return res.value
    },
    getdata() {
      ConfigList().then((res) => {
        if (res.code === 0) {
          this.tableData = res.data
        }
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
      this.dialogFormVisible = true
      this.currentedit = row
      this.getdata()
    },
    handleDelete(index, row) {
      // 删除
      DelConfig(row.id).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.getdata()
        }
      })
    }
  }
}
</script>

<style lang="less">
.config-list {
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
