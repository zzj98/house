<template>
  <div>
    <el-table :data="tableData" @filter-change="filterChange" border>
      <el-table-column prop="house.id" label="房屋ID">
      </el-table-column>
      <el-table-column prop="house.address" label="房屋地址" width="350">
      </el-table-column>
      <el-table-column prop="recordList[0].userName" label="发布者">
      </el-table-column>
      <el-table-column prop="recordList[0].email" label="发布者邮箱" width="170">
      </el-table-column>
      <el-table-column prop="recordList[0].realDate" label="预约时间" width="170">
      </el-table-column>
      <el-table-column label="预约状态" width="170"
                       :filters="[{ text: '等待同意', value: '1' }, { text: '已同意', value: '2' },{ text: '未同意', value: '3' },{ text: '已完成', value: '4' }]"
                       :filter-multiple="false"
                       filter-placement="bottom-end"
                       :column-key="'state'">
        <template slot-scope="scope">
          <span v-if="scope.row.recordList[0].state === 0">等待同意</span>
          <span v-if="scope.row.recordList[0].state === 2">未同意</span>
          <span v-if="scope.row.recordList[0].state === 1">
          <span>已同意</span>
          <el-button @click="confirm(scope.row)" type="text" size="small">完成预约</el-button>
        </span>
          <span v-if="scope.row.recordList[0].state === 3">
          <span>已完成</span>
          <el-button @click="paging(scope.row)" v-if="scope.row.state === -1" type="text" size="small">问题举报</el-button>
          <span v-if="scope.row.state === 0">举报审核中</span>
          <span v-if="scope.row.state === 1">举报通过</span>
          <el-button @click="paging(scope.row)" v-if="scope.row.state === 2" type="text" size="small">再次举报</el-button>
        </span>
        </template>
      </el-table-column >
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
      <span>请填写举报原因</span>
      <button type="button" @click="Close" class="el-message-box__headerbtn">
        <i class="el-message-box__close el-icon-close"></i>
      </button>
      <el-input type="textarea" class="reason" v-model="reason" :rows="4" placeholder="注明举报原因"></el-input>
      <el-button type="primary" @click="toreport" round :disabled="!reason">提交审核</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        index:'',
        total:'',
        reason:'',
        houseID:'',
        tableData: [],
        currentPage:1,
        showModal: false,
        flag: '',
      }
    },
    mounted(){
      this.getinformation(this.flag);
    },
    methods: {
      Close(){
        this.showModal = false;
      },
      confirm(index) {
        // console.log(index.recordList[key].realDate);
        this.$ajax.post("http://182.92.149.135:8080/yiJu/appointment/update",{
          id:index.recordList[0].id,
          realDate:index.recordList[0].realDate,
          toHouse:index.house.id,
          toUser:index.house.userId,
          state:3
        }).then(response=>{
          console.log(response.data);
          this.$alert(response.data.message,'提示',{
            showConfirmButton:'确定'
          }).then((action) => {
            this.getinformation(this.flag);
          })
        });
      },
      paging(index){
        if (this.showModal === false){
          this.reason = ''
        }
        this.showModal=true;
        this.index = index;
      },
      toreport(){
        let userData = JSON.parse(localStorage.getItem('userData'));
        this.$ajax.post("http://182.92.149.135:8080/yiJu/report/add",{
          fromUser:userData.data.id,
          reason:this.reason,
          toHouse:this.index.recordList[0].toHouse,
          toUser:this.index.recordList[0].userId
        }).then(response => {
          // console.log(response.data);
          if (response.data.code === 200){
            this.$alert("举报成功等待审核中","提示",{
              confirmButtonText:"确定"
            }).then((action) => {
              this.showModal = false;
              this.getinformation(this.flag = '');
              this.reason = '';
            })
          }else {
            this.$alert(response.data.message,"提示",{
              confirmButtonText:"确定"
            }).then((action) => {
              this.showModal = false;
              this.reason = '';
            })
          }
        })
      },
      filterChange(filters){
        if (filters.state[0] === '1'){
          this.flag = '&state=0'
        } else if (filters.state[0] === '2'){
          this.flag = '&state=1'
        } else if (filters.state[0] === '3'){
          this.flag = '&state=2'
        } else if (filters.state[0] === '4'){
          this.flag = '&state=3'
        } else {
          this.flag = ''
        }
        this.currentPage = 1;
        this.getinformation(this.flag)
      },
      handleCurrentChange(val){
        this.currentPage =  val;
        this.getinformation(this.flag);
      },
      getinformation(flag){
        this.$ajax.get('http://182.92.149.135:8080/yiJu/appointment/getMyAppRecordByPage?index=' + this.currentPage + flag)
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
    margin: -100px -150px;
    z-index: 2;
    padding: 15px;
    border-radius: 15px;
    text-align: center;
  }

  .reason{
    width: 90%;
    margin: 20px 0;
  }

  .el-pagination{
    margin: 10px auto 0;
    text-align: center
  }

</style>
