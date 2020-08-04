<template>
  <div>
    <el-table :data="tableData" @filter-change="filterChange" index="house.id">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="房主ID">
              <span>{{ props.row.house.userId }}</span>
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
      <el-table-column label="房屋 ID" prop="house.id">
      </el-table-column>
      <el-table-column label="地址" prop="house.address">
      </el-table-column>
      <el-table-column label="状态" prop="house.auditingState"
                       :filters="[{ text: '审核中', value: '1' }, { text: '已通过', value: '2' },{ text: '未通过', value: '3' }, { text: '已下架', value: '4' }]"
                       :filter-multiple="false"
                       filter-placement="bottom-end"
                       :column-key="'auditingState'">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span v-if="!scope.row.house.deleteState">
          <el-button @click="paging(scope.row.house)" v-if="scope.row.house.auditingState==='审核中'" type="text"
                     size="small">审核</el-button>
          <span v-if="scope.row.house.auditingState!=='审核中'" style="font-size: 12px">已审核</span>
          <el-button @click="download(scope.row.house)" type="text" size="small">下架</el-button></span>
          <el-button @click="upagain(scope.row.house)" v-if="scope.row.house.deleteState" type="text" size="small">
            重新上架
          </el-button>
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
    <div class="mask" v-if="showModal" @click="showModal=false"></div>
    <div class="pop" v-if="showModal">
      <div>请选择审核结果</div>
      <button type="button"  @click="Close" class="el-message-box__headerbtn">
        <i class="el-message-box__close el-icon-close"></i>
      </button>
      <div class="check">
        <el-radio v-model="radio" label="1">通过</el-radio>
        <el-radio v-model="radio" label="2">未通过</el-radio>
        <el-input type="textarea" class="reason" v-model="reason" :rows="4" placeholder="请注明未通过原因"></el-input>
      </div>
      <el-button v-if="radio==='1'" type="primary" @click="check()" round>提交审核</el-button>
      <el-button v-if="radio==='2'" type="primary" @click="check()" :disabled="!reason" round>提交审核</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showModal: false,
        tableData: [],
        reason: '',
        radio: '1',
        index: '',
        show: '',
        show1: '',
        total: '',
        currentPage: 1,
        flag: '',
      }
    },
    mounted() {
      this.getinformation(this.flag);
    },
    methods: {
      paging(index) {
        if (this.showModal === false) {
          this.reason = ''
        }
        this.showModal = true;
        this.index = index;
      },
      Close(){
        this.showModal = false;
      },
      check() {
        this.$ajax.post("http://182.92.149.135:8080/yiJu/audit/updateHouseState", {
          auditState: this.radio * 1,
          id: this.index.id,
          reason: this.reason
        }).then(response => {
          console.log(response.data);
          this.$alert(response.data.message, "提示", {
            confirmButtonText: '确定'
          }).then(action => {
            this.showModal = false;
            this.getinformation(this.flag);
          })
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
        this.getinformation(this.flag)
      },
      download(index) {
        // console.log(index.id);
        this.$confirm('此操作将永久下架房屋信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax.post("http://182.92.149.135:8080/yiJu/house/down", index.id, {
            headers: {'Content-Type': 'application/json'}
          }).then(response => {
            console.log(response.data);
            if (response.data.code === 200) {
              this.$message({
                type: 'success',
                message: '下架成功!'
              });
              this.getinformation(this.flag);
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
      upagain(index) {
        // console.log(index)
        this.$confirm(`将重新上架ID${index.id}的房屋信息, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax.post("http://182.92.149.135:8080/yiJu/house/up", index.id, {
            headers: {'Content-Type': 'application/json'}
          }).then(response => {
            console.log(response.data);
            index.auditingState = 0;
            if (response.data.code === 200) {
              this.$message({
                type: 'success',
                message: '重新上架成功!'
              });
              this.getinformation(this.flag);
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
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getinformation(this.flag);
      },
      getinformation(flag) {
        this.$ajax.get('http://182.92.149.135:8080/yiJu/house/getGlobalHouses?index=' + this.currentPage + flag)
          .then(response => {
            // console.log(this.tableData);
            this.total = response.data.data.count;
            this.tableData = response.data.data.data;
            for (let x = 0; x < this.tableData.length; x++) {
              if (this.tableData[x].house.deleteState === 1) {
                this.tableData[x].house.auditingState = "已下架"
              } else {
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
                  case "已下架" :
                    this.tableData[x].house.auditingState = "审核中";
                    break;
                }
              }
              this.tableData[x].house.years = this.tableData[x].house.years.substring(0, 4);
            }
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

  .mask {
    background-color: #000;
    opacity: 0.3;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1
  }

  .pop {
    background-color: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 300px;
    margin: -140px -150px;
    z-index: 2;
    padding: 15px;
    border-radius: 15px;
    text-align: center;
  }

  .check {
    margin: 20px 0;
  }

  .reason {
    width: 90%;
    margin: 20px 0 0;
  }

  .el-pagination {
    margin: 10px auto 0;
    text-align: center
  }

</style>
