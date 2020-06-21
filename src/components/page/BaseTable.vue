<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
            <el-select v-model="query.address" placeholder="地址" class="handle-select mr10" clearable>
                <el-option v-for="item in proOptions" :key="item.index" :label="item" :value="item" ></el-option>
            </el-select>
            <el-input  v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

        <el-table
            :data="tempData[query.pageIndex-1]"
            border
            class="table"
            ref="multipleTable"
            header-cell-class-name="table-header"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
            <el-table-column prop="name" label="用户名"></el-table-column>
            <el-table-column label="账户余额">
                    <template slot-scope="scope">￥{{scope.row.money}}</template>
            </el-table-column>
            <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.thumb"
                            :preview-src-list="[scope.row.thumb]"
                        ></el-image>
                    </template>
            </el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"
                        >{{scope.row.state}}</el-tag>
                    </template>
            </el-table-column>
            <el-table-column prop="date" label="注册时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                             style="color:#ff0000"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
        </div>
        </div>
         <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index'
export default {
  name: 'basetable',
  data () {
    return {
      query: {
        address: '',
        name: '',
        pageIndex: 1,
        pageSize: 2
      },
      proOptions: [],
      tempData: [],
      tableData: [],
      allData: [],
      trans: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1
    }
  },
  async created () {
    await this.getData()
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    unique (arr) {
      return Array.from(new Set(arr))
    },
    getData () {
      fetchData(this.query).then(res => {
        this.allData = res.list
        this.pageTotal = res.pageTotal || 50
        for (let i = 0; i < this.allData.length; i++) {
          const temp = this.allData[i].address.indexOf('省')
          this.proOptions.push(this.allData[i].address.slice(0, temp + 1))
        }
        this.proOptions = this.unique(this.proOptions)
        this.handleSearch()
      })
    },
    // 数组切分
    chunk (array, size) {
      const length = array.length
      if (!length || !size || size < 1) {
        return []
      }
      let index = 0
      let resIndex = 0

      const result = new Array(Math.ceil(length / size))
      while (index < length) {
        result[resIndex++] = array.slice(index, (index += size))
      }
      return result
    },
    // 初始化数据
    initData () {
      const res = this.chunk(this.tableData, this.query.pageSize)
      this.tempData = res
      if (this.tempData.length && this.query.pageIndex > this.tempData.length) {
        this.query.pageIndex = this.tempData.length
      }
    },
    // 触发搜索按钮
    handleSearch () {
      if (this.query.address) {
        this.tableData = this.allData.filter(item => !item.address.indexOf(this.query.address)
        )
      } else {
        this.tableData = this.allData
      }
      if (this.query.name) {
        this.tableData = this.tableData.filter(item => !item.name.indexOf(this.query.name))
      }
      this.initData()
      this.pageTotal = this.tableData.length
    },
    handleDelete (index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$message.success('删除成功')
          const res = this.allData.filter(item => {
            return item.id !== row.id
          })
          this.allData = res
          this.handleSearch()
        })
        .catch(() => {})
    },
    delAllSelection () {
      const length = this.multipleSelection.length
      var str = ''
      this.delList = this.delList.concat(this.multipleSelection)
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + ' '
        this.allData = this.allData.filter(item => item.id !== this.multipleSelection[i].id)
      }
      this.$message.error(`删除了${str}`)
      this.pageTotal = this.tableData.length
      this.handleSearch()
      this.multipleSelection = []
    },
    // 编辑操作
    handleEdit (index, row) {
      this.idx = index
      this.form = row
      this.editVisible = true
    },
    // 保存编辑
    saveEdit () {
      this.editVisible = false
      this.$message.success(`修改第 ${this.idx + 1} 行成功`)
      this.$set(this.tableData, this.idx, this.form)
    },
    // 分页导航
    handlePageChange (val) {
      this.$set(this.query, 'pageIndex', val)
    }

  }
}
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
