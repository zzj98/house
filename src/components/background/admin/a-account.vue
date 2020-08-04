<template>
  <div>
    <el-table :data="tableData" border @filter-change="filterChange" :header-cell-style="{background:'#fff'}">
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <el-button type="primary" icon="el-icon-plus" size="mini" class='btn' title="添加新的管理员" @click="paging()" circle plain></el-button>
          <el-button icon="el-icon-search" size="mini" class='btn' circle></el-button>
          <el-input v-model="search" size="mini" style="width: 200px;float: right" placeholder="输入关键字搜索"/>
        </template>
        <el-table-column prop="id" label="账号 ID">
        </el-table-column>
        <el-table-column prop="userName" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="status" label="激活"
                         :filters="[{ text: '已激活', value: '1' }, { text: '未激活', value: '2' }]"
                         :filter-multiple="false"
                         filter-placement="bottom-end"
                         :column-key="'status'">
        </el-table-column>
        <el-table-column prop="type" label="身份"
                         :filters="[{ text: '用户', value: '1' }, { text: '发布者', value: '2' }, { text: '管理员', value: '3' }]"
                         :filter-multiple="false"
                         filter-placement="bottom-end"
                         :column-key="'type'">
        </el-table-column>
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
      <div>添加新的管理员</div>
      <button type="button" @click="Close" class="el-message-box__headerbtn">
        <i class="el-message-box__close el-icon-close"></i>
      </button>
      <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-position="left" class="check">
        <el-form-item prop="email">
          <el-input type="text" v-model="ruleForm.email" auto-complete="off" placeholder="邮箱号"></el-input>
        </el-form-item>
        <el-form-item prop="userName">
          <div>
            <el-input type="text" v-model="ruleForm.userName" auto-complete="off" placeholder="姓名"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="aadd()" round>提交审核</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      let email = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('邮箱不能为空'));
        } else {
          const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('您的邮箱格式不正确，请输入正确的邮箱。'));
          }
        }
      };
      return {
        tableData: '',
        showModal:false,
        total:'',
        currentPage:1,
        rules: {
          email: [{required: true, validator: email, trigger: 'blur'}],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
          userName: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
        },
        ruleForm: {
          email: '',
          password: '',
          userName: '',
        },
        flag: '',
        sFlag: '',
        tFlag: '',
      }
    },
    mounted(){
      this.getinformation(this.flag);
    },
    methods: {
      paging(){
        if (this.showModal === false){
          this.ruleForm.email = '';
          this.ruleForm.password = '';
          this.ruleForm.userName = '';
        }
        this.showModal=true;
      },
      aadd(){
        this.$ajax.post("http://182.92.149.135:8080/yiJu/user/addAdmin",{
          email: this.ruleForm.email,
          password: this.ruleForm.password,
          type: 0,
          userName: this.ruleForm.userName,
        }).then(response => {
          console.log(response.data);
          this.$alert(response.data.message,'提示',{
            confirmButtonText:'确定'
          }).then((action) => {
            if (response.data.code === 200){
              this.getinformation();
              this.showModal=false;
              this.getinformation(this.flag = '')
            }
          })
        })
      },
      Close(){
        this.showModal = false;
      },
      filterChange(filters) {
        // console.log(filters);
        if (filters.status) {
          if (filters.status[0] === '1') {
            this.sFlag = `&status=1`;
          } else if (filters.status[0] === '2') {
            this.sFlag = `&status=0`;
          } else {
            this.sFlag = ``;
          }
        }else if (filters.type) {
          if (filters.type[0] === '1') {
            this.tFlag = `&type=1`;
          } else if (filters.type[0] === '2') {
            this.tFlag = `&type=2`;
          } else if (filters.type[0] === '3') {
            this.tFlag = `&type=0`;
          } else {
            this.tFlag = ``
          }
        }
        this.flag = this.sFlag + this.tFlag;
        // console.log(this.flag);
        this.currentPage = 1;
        this.getinformation(this.flag)
      },
      getinformation(flag){
        this.$ajax.get('http://182.92.149.135:8080/yiJu/user/getAll?index=' + this.currentPage + flag)
          .then(response => {
            console.log(response.data.data);
            this.total = response.data.data.count;
            this.tableData = response.data.data.data;
            for (let x = 0 ; x < this.tableData.length ; x++){
              switch (this.tableData[x].status) {
                case 0 : this.tableData[x].status = "未激活";break;
                case 1 : this.tableData[x].status = "已激活";break;
              }
              switch (this.tableData[x].type) {
                case 0 : this.tableData[x].type = "管理员";break;
                case 1 : this.tableData[x].type = "用户";break;
                case 2 : this.tableData[x].type = "发布者";break;
              }
            }
            // console.log(this.tableData);
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
          });
      },
      handleCurrentChange(val) {
        this.currentPage =  val;
        this.getinformation(this.flag);
      },
    },
  }
</script>

<style scoped>
  .btn{
    float: right;
    margin-left: 10px;
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
    height: 260px;
    margin: -130px -150px;
    z-index: 2;
    padding: 15px;
    border-radius: 15px;
    text-align: center;
  }

  .check {
    margin: 15px 0 20px;
  }

  .el-pagination{
    margin: 10px auto 0;
    text-align: center
  }

</style>
