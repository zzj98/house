<template>
  <div>
    <el-table :data="tableData">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" v-if="props.row.size !== 0" inline class="demo-table-expand">
            <el-form-item label="预约ID"></el-form-item>
            <el-form-item label="预约人"></el-form-item>
            <el-form-item label="预约时间"></el-form-item>
            <el-form-item label="预约状态"></el-form-item>
            <el-form-item label="预约操作"></el-form-item>
            <span  v-for="(item,key) in props.row.recordList" :key="key">
              <el-form-item>
                <span>{{item.id }}</span>
              </el-form-item>
              <el-form-item>
                <span>{{item.userName }}</span>
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
              <el-form-item>
                <span v-if="item.state === 0">
                  <el-button @click="confirm(props.row,key)" type="text" size="small">同意</el-button>
                  <el-button @click="cancel(props.row,key)" type="text" size="small">不同意</el-button>
                </span>
                <span v-if="item.state === 1">
                  <span>等待预约完成</span>
                </span>
                <span v-if="item.state === 3">
                  <span>预约已完成</span>
                </span>
              </el-form-item>
            </span>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="房屋 ID" prop="house.id">
      </el-table-column>
      <el-table-column label="地址" prop="house.address" width="350">
      </el-table-column>
      <el-table-column label="小区" prop="house.community">
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
        results: '',
        index:'',
        total:'',
        currentPage:1,
      }
    },
    mounted(){
      this.getinformation();
    },
    methods: {
      confirm(index,key) {
        // console.log(index.recordList[key].realDate);
        this.$ajax.post("http://182.92.149.135:8080/yiJu/appointment/update",{
          id:index.recordList[key].id,
          realDate:index.recordList[key].realDate,
          toHouse:index.house.id,
          toUser:index.house.userId,
          state:1
        }).then(response=>{
          console.log(response.data);
          this.$alert(response.data.message,'提示',{
            showConfirmButton:'确定'
          }).then((action) => {
            this.getinformation();
          })
        });
      },
      cancel(index,key){
        this.$ajax.post("http://182.92.149.135:8080/yiJu/appointment/update",{
          id:index.recordList[key].id,
          realDate:index.recordList[key].realDate,
          toHouse:index.house.id,
          toUser:index.house.userId,
          state:2
        }).then(response=>{
          console.log(response.data)
          this.$alert(response.data.message,'提示',{
            showConfirmButton:'确定'
          }).then((action) => {
            this.getinformation();
          });
        });
      },
      upload(index) {
        this.$ajax.post("http://182.92.149.135:8080/yiJu/house/down",{
          houseId : index.house.id
        }).then(response=>{
          console.log(response.data)
        });
        console.log(index);
      },
      getinformation(){
        this.$ajax.get('http://182.92.149.135:8080/yiJu/appointment/getHouseAppRecordByPage?index=' + this.currentPage)
          .then(response => {
            this.total = response.data.data.count;
            this.tableData = response.data.data.data;
            console.log(this.tableData);
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
          });
      },
      handleCurrentChange(val) {
        this.currentPage =  val;
        this.getinformation();
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
    width: 20%;
  }
  .el-pagination{
    margin: 10px auto 0;
    text-align: center
  }
</style>
