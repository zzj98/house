<template>
  <div class="aBook">
    <el-table :data="tableData">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" v-if="props.row.size !== 0" inline class="demo-table-expand">
            <el-form-item label="预约ID"></el-form-item>
            <el-form-item label="预约"></el-form-item>
            <el-form-item label="预约时间"></el-form-item>
            <el-form-item label="预约状态"></el-form-item>
            <span  v-for="(item,key) in props.row.recordList" :key="key">
            <el-form-item>
              <span>{{item.id }}</span>
            </el-form-item>
            <el-form-item>
              <span>{{item.userName}}</span>
            </el-form-item>
            <el-form-item>
              <span>{{item.realDate}}</span>
            </el-form-item>
            <el-form-item>
              <span v-if="item.state === 0">等待同意</span>
              <span v-if="item.state === 1">同意看房</span>
              <span v-if="item.state === 2">暂不同意</span>
              <span v-if="item.state === 3">看房结束</span>
            </el-form-item>
          </span>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="房屋 ID" prop="house.id">
      </el-table-column>
      <el-table-column label="发布者" prop="house.userId">
      </el-table-column>
      <el-table-column label="发布者邮箱" prop="house.community">
      </el-table-column>
      <el-table-column label="地址" prop="house.address" width="350">
      </el-table-column>
      <el-table-column label="预约人数" prop="size">
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      background
      v-if="total > 10"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        total:'',
        currentPage:1,
      }
    },
    mounted(){
      this.getinformation();
    },
    methods: {
      handleCurrentChange(val) {
        this.currentPage =  val;
        this.getinformation();
      },
      getinformation(){
        this.$ajax.get('http://182.92.149.135:8080/yiJu/appointment/getAllByPage?index=' + this.currentPage)
          .then(response => {
            this.total = response.data.data.count;
            this.tableData = response.data.data.data;
            console.log(this.tableData);
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
          });
      },
    },
  }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 25%;
  }
  .el-pagination{
    margin: 10px auto 0;
    text-align: center
  }
</style>
