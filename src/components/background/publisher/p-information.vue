<template>
  <div>
    <el-table :data="tableData" @filter-change="filterChange" border index="house.id">
      <el-table-column prop="house.id" label="房屋ID">
      </el-table-column>
      <el-table-column prop="house.community" label="小区">
      </el-table-column>
      <el-table-column prop="house.address" label="地址" width="280">
      </el-table-column>
      <el-table-column prop="house.price" label="价格">
      </el-table-column>
      <el-table-column prop="house.creeateTime" label="创建日期" width="150">
      </el-table-column>
      <el-table-column prop="house.auditingState" label="审核状态"
                       :filters="[{ text: '审核中', value: '1' }, { text: '已通过', value: '2' },{ text: '未通过', value: '3' }, { text: '已下架', value: '4' }]"
                       :filter-multiple="false"
                       filter-placement="bottom-end"
                       :column-key="'auditingState'">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
        <span v-if="!scope.row.house.deleteState">
          <el-button v-if="!(scope.row.house.auditingState === '审核中'|| scope.row.house.auditingState === '未通过')" @click="paging(scope.row)" type="text" size="small">修改</el-button>
          <el-button v-if="scope.row.house.auditingState === '审核中'|| scope.row.house.auditingState === '未通过'" type="text" size="small" disabled>修改</el-button>
          <el-button v-if="scope.row.house.auditingState !== '未通过'" @click="download(scope.row)" type="text" size="small">下架</el-button>
          <el-button v-if="scope.row.house.auditingState === '未通过'" type="text" size="small" disabled>下架</el-button>
        </span>
          <el-button v-if="scope.row.house.deleteState" @click="paging(scope.row)" type="text" size="small">修改</el-button>
          <el-button v-if="scope.row.house.deleteState" type="text" size="small" disabled>已下架</el-button>
        </template>
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
    <el-dialog v-if="showModal" :visible.sync="showModal" :append-to-body='true' :destroy-on-close="true" width="600px" top="45px" center>
      <pchange :houseID="houseID" @closec="getSon"></pchange>
    </el-dialog>
  </div>
</template>

<script>
  import pchange from './p-change'
  export default {
    data() {
      return {
        tableData: [],
        show: '',
        flag: '',
        total: '',
        houseID:'',
        currentPage:1,
        showModal:false,
      }
    },
    mounted() {
      this.getInformation(this.flag);
    },
    methods: {
      getSon(data){
        this.showModal = data;
        this.getInformation(this.flag);
      },
      paging(index){
        this.showModal=true;
        this.houseID=index.house.id;
        console.log(this.houseID);
      },
      download(index) {
        console.log(index.house.id);
        this.$confirm('此操作将永久下架房屋信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax.post("http://182.92.149.135:8080/yiJu/house/down", index.house.id, {
            headers: {'Content-Type': 'application/json'}
          }).then(response => {
            console.log(response.data);
            if (response.data.code === 200){
              this.$message({
                type: 'success',
                message: '下架成功!'
              });
              this.getInformation(this.flag);
            } else {
              this.$message({
                type: 'error',
                message: '操作失败!'
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      getInformation(flag) {
        this.$ajax.get('http://182.92.149.135:8080/yiJu/house/getMyHouses?index=' + this.currentPage + flag)
          .then(response => {
            this.total = response.data.data.count;
            this.tableData = response.data.data.data;
            for (let x = 0; x < this.tableData.length; x++) {
              switch (this.tableData[x].house.auditingState) {
                case 0 :
                  this.tableData[x].house.auditingState = "审核中";
                  break;
                case 1 :
                  this.tableData[x].house.auditingState = "已通过";
                  break;
                case 2 :
                  this.tableData[x].house.auditingState = "未通过";
                  break;
              }
              this.tableData[x].house.creeateTime = this.tableData[x].house.creeateTime.substring(0, 10);
            }
            console.log(this.tableData);
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
          });
      },
      filterChange(filters){
        if (filters.auditingState[0] === '1'){
          this.flag = '&auditingState=0&deleteState=0'
        } else if (filters.auditingState[0] === '2'){
          this.flag = '&auditingState=1&deleteState=0'
        } else if (filters.auditingState[0] === '3'){
          this.flag = '&auditingState=2&deleteState=0'
        } else if (filters.auditingState[0] === '4'){
          this.flag = '&deleteState=1'
        } else {
          this.flag = ''
        }
        this.currentPage = 1;
        this.getInformation(this.flag)
      },
      handleCurrentChange(val) {
        this.currentPage =  val;
        this.getInformation(this.flag);
      },
    },
    components:{
      pchange,
    }
  }
</script>

<style scoped>
  .el-pagination{
    margin: 10px auto 0;
    text-align: center
  }
</style>
