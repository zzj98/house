<template>
  <div>
    <el-table :data="tableData" @filter-change="filterChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="房屋ID">
              <span>{{ props.row.toHouse.id }}</span>
            </el-form-item>
            <el-form-item label="小区">
              <span>{{ props.row.toHouse.community }}</span>
            </el-form-item>
            <el-form-item label="楼层">
              <span>{{ props.row.toHouse.storey }}楼</span>
            </el-form-item>
            <el-form-item label="户型">
              <span>{{ props.row.toHouse.layout }}</span>
            </el-form-item>
            <el-form-item label="朝向">
              <span>{{ props.row.toHouse.direction }}向</span>
            </el-form-item>
            <el-form-item label="装修">
              <span>{{ props.row.toHouse.decoration }}</span>
            </el-form-item>
            <el-form-item label="面积">
              <span>{{ props.row.toHouse.area }}平米</span>
            </el-form-item>
            <el-form-item label="建筑年份">
              <span>{{ props.row.toHouse.years }}</span>
            </el-form-item>
            <el-form-item label="价格">
              <span>{{ props.row.toHouse.price }}万元</span>
            </el-form-item>
            <el-form-item label="房屋简介">
              <span>{{ props.row.toHouse.description }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="举报 ID" prop="reportInformation.id">
      </el-table-column>
      <el-table-column label="举报用户" prop="reporter.userName">
      </el-table-column>
      <el-table-column label="地址" prop="toHouse.address" width="300">
      </el-table-column>
      <el-table-column label="原因" prop="reportInformation.reason" width="250">
      </el-table-column>
      <el-table-column label="操作(审核人)" width="250"
                       :filters="[{ text: '审核中', value: '1' }, { text: '已通过', value: '2' },{ text: '未通过', value: '3' }]"
                       :filter-multiple="false"
                       filter-placement="bottom-end"
                       :column-key="'state'">
        <template slot-scope="scope">
          <el-button v-if="scope.row.reportInformation.state ==='审核中'" @click="paging(scope.row)" type="text" size="small">审核</el-button>
          <span v-if="scope.row.reportInformation.state ==='通过'">通过({{scope.row.auditor.userName}})</span>
          <span v-if="scope.row.reportInformation.state ==='未通过'">未通过：{{scope.row.audit.reason}}({{scope.row.auditor.userName}})</span>
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
      <button type="button" @click="Close" class="el-message-box__headerbtn">
        <i class="el-message-box__close el-icon-close"></i>
      </button>
      <div class="check">
        <el-radio v-model="radio" label="1">通过</el-radio>
        <el-radio v-model="radio" label="2">未通过</el-radio>
        <el-input type="textarea" class="reason" v-model="reason" :rows="4" placeholder="请注明未通过原因"></el-input>
      </div>
      <el-button v-if="radio==='1'" type="primary" @click="check" round>提交审核</el-button>
      <el-button v-if="radio==='2'" type="primary" @click="check" round :disabled="!reason">提交审核</el-button>
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
        index:'',
        radio:'1',
        total:'',
        currentPage:1,
        flag:'',
      }
    },
    mounted() {
      this.getinformation(this.flag);
    },
    methods: {
      paging(index){
        if (this.showModal === false){
          this.reason = ''
        }
        this.showModal=true;
        this.index = index;
        console.log(index)
      },
      check(){
        this.$ajax.post("http://182.92.149.135:8080/yiJu/audit/updateReportState",{
          auditState:this.radio*1,
          id:this.index.reportInformation.id,
          reason:this.reason
        }).then(response =>{
          console.log(response.data);
          this.$alert(response.data.message,"提示",{
            confirmButtonText:'确定'
          }).then((action) => {
            this.showModal = false;
            this.reason = '';
            this.getinformation(this.flag);
          })
        })
      },
      Close(){
        this.showModal = false;
      },
      filterChange(filters){
        if (filters.state[0] === '1'){
          this.flag = '&state=0'
        } else if (filters.state[0] === '2'){
          this.flag = '&state=1'
        } else if (filters.state[0] === '3'){
          this.flag = '&state=2'
        } else {
          this.flag = ''
        }
        this.currentPage = 1;
        this.getinformation(this.flag)
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getinformation(this.flag);
      },
      getinformation(flag) {
        this.$ajax.get('http://182.92.149.135:8080/yiJu/report/getAll?index=' + this.currentPage + flag)
          .then(response => {
            this.total = response.data.data.count;
            this.tableData = response.data.data.data;
            console.log(this.tableData);
            for (let x = 0 ; x < this.tableData.length ; x++){
              switch (this.tableData[x].reportInformation.state){
                case 0 : this.tableData[x].reportInformation.state = "审核中";break;
                case 1 : this.tableData[x].reportInformation.state = "通过";break;
                case 2 : this.tableData[x].reportInformation.state = "未通过";break;
              }
              switch (this.tableData[x].toHouse.direction){
                case 0 : this.tableData[x].toHouse.direction = "南北";break;
                case 1 : this.tableData[x].toHouse.direction = "东西";break;
              }
              switch (this.tableData[x].toHouse.decoration){
                case 0 : this.tableData[x].toHouse.decoration = "毛坯房";break;
                case 1 : this.tableData[x].toHouse.decoration = "简装";break;
                case 2 : this.tableData[x].toHouse.decoration = "精装";break;
              }
              this.tableData[x].toHouse.years = this.tableData[x].toHouse.years.substring(0, 4);
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
    opacity: 0.2;
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

  .reason{
    width: 90%;
    margin: 18px 0 0;
  }

  .el-pagination{
    margin: 10px auto 0;
    text-align: center
  }

</style>
