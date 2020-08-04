<template>
  <div>
    <el-table :data="tableData" index="house.id">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="房屋ID">
              <span>{{ props.row.house.id }}</span>
            </el-form-item>
            <el-form-item label="小区">
              <span>{{ props.row.house.community }}</span>
            </el-form-item>
            <el-form-item label="楼层">
              <span>{{ props.row.house.storey }}楼</span>
            </el-form-item>
            <el-form-item label="户型">
              <span>{{ props.row.house.layout }}</span>
            </el-form-item>
            <el-form-item label="朝向">
              <span>{{ props.row.house.direction }}向</span>
            </el-form-item>
            <el-form-item label="装修">
              <span>{{ props.row.house.decoration }}</span>
            </el-form-item>
            <el-form-item label="面积">
              <span>{{ props.row.house.area }}平米</span>
            </el-form-item>
            <el-form-item label="建筑年份">
              <span>{{ props.row.house.years }}</span>
            </el-form-item>
            <el-form-item label="价格">
              <span>{{ props.row.house.price }}万元</span>
            </el-form-item>
            <el-form-item label="房屋简介">
              <span>{{ props.row.house.description }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="举报 ID" prop="reportInformation.id">
      </el-table-column>
      <el-table-column label="地址" prop="house.address">
      </el-table-column>
      <el-table-column label="原因" prop="reportInformation.reason">
      </el-table-column>
      <el-table-column label="状态" prop="reportInformation.state">
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
        total:'',
        tableData: [],
        currentPage:1,
      }
    },
    mounted() {
      this.getinformation();
    },
    methods: {
      handleCurrentChange(val){
        this.currentPage =  val;
        this.getinformation();
      },
      getinformation() {
        this.$ajax.get('http://182.92.149.135:8080/yiJu/report/get?index=' + this.currentPage)
          .then(response => {
            this.total = response.data.data.count;
            this.tableData = response.data.data.data;
            for (let x = 0 ; x < this.tableData.length ; x++){
              switch (this.tableData[x].reportInformation.state){
                case 0 : this.tableData[x].reportInformation.state = "审核中";break;
                case 1 : this.tableData[x].reportInformation.state = "已通过";break;
                case 2 : this.tableData[x].reportInformation.state = "未通过";break;
              }
              switch (this.tableData[x].house.direction){
                case 0 : this.tableData[x].house.direction = "南北";break;
                case 1 : this.tableData[x].house.direction = "东西";break;
              }
              switch (this.tableData[x].house.decoration){
                case 0 : this.tableData[x].house.decoration = "毛坯房";break;
                case 1 : this.tableData[x].house.decoration = "简装";break;
                case 2 : this.tableData[x].house.decoration = "精装";break;
              }
              this.tableData[x].house.years = this.tableData[x].house.years.substring(0, 4);
            }
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
    width: 50%;
  }

  .el-pagination{
    margin: 10px auto 0;
    text-align: center
  }
</style>
