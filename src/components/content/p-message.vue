<template>
  <div class="message">
    <el-tabs type="border-card" @tab-click="getList">
      <el-tab-pane>
      <span slot="label">
        <span>审核结果</span>
        <el-badge :hidden="rNumber <= 0" :value="rNumber" size="mini" :max="99"></el-badge>
      </span>
        <ul class="side-box">
          <li v-for="(item,index) in list" :key="index">
            <div class="box">
              <el-col :span="21" class="information">
                <p>{{item}}</p>
              </el-col>
            </div>
          </li>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            background
            v-if="total > 10"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </ul>
      </el-tab-pane>
      <el-tab-pane>
      <span slot="label">
        <span>下架提示</span>
        <el-badge :hidden="dNumber <= 0" :value="dNumber" size="mini" :max="99"></el-badge>
      </span>
        <ul class="side-box">
          <li v-for="(item,index) in list" :key="index">
            <div class="box">
              <el-col :span="24" class="information">
                <p>{{item}}</p>
              </el-col>
            </div>
          </li>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            background
            v-if="total > 10"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </ul>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <span>预约审批</span>
        <el-badge :hidden="bNumber <= 0" :value="bNumber" size="mini" :max="99"></el-badge>
        </span>
        <ul class="side-box">
          <li v-for="(item,index) in list" :key="index">
            <div class="box">
              <el-col :span="24" class="information">
                <p>{{item}}</p>
              </el-col>
            </div>
          </li>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            background
            v-if="total > 10"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </ul>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <span>举报警告</span>
        <el-badge :hidden="fbNumber <= 0" :value="fbNumber" size="mini" :max="99"></el-badge>
        </span>
        <ul class="side-box">
          <li v-for="(item,index) in list" :key="index">
            <div class="box">
              <el-col :span="24" class="information">
                <p>{{item}}</p>
              </el-col>
            </div>
          </li>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            background
            v-if="total > 10"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        total: '',
        currentPage: 1,
        index: '0',
        rNumber: '',
        dNumber: '',
        bNumber: '',
        fbNumber: '',
      }
    },
    mounted() {
      this.getrList();
      this.allNumber();
    },
    methods: {
      //获取所有类型未读消息的数量
      allNumber() {
        this.$ajax.get('http://182.92.149.135:8080/yiJu/message/countOfPublisher')
          .then(response => {
            console.log(response.data);
            this.rNumber = response.data.data.auditHouseMessageCount;
            this.dNumber = response.data.data.downHouseMessageCount;
            this.bNumber = response.data.data.houseAppoMessageCount;
            this.fbNumber = response.data.data.houseReportMessageCount;
            switch (this.index) {
              case '0' :
                this.rNumber -= 10; break;
              case '1' :
                this.dNumber -= 10; break;
              case '2' :
                this.bNumber -= 10; break;
              case '3' :
                this.fbNumber -= 10; break;
            }
            // console.log(this.bNumber);
            // console.log(this.fbNumber);
          })
      },
      //获取审核信息
      getrList() {
        this.$ajax.get('http://182.92.149.135:8080/yiJu/message/auditHouseMessageList?index=' + this.currentPage)
          .then(response => {
            this.list = [];
            console.log(response.data.data.data);
            this.total = response.data.data.count;
            for (let x = 0; x < response.data.data.data.length; x++) {
              if (response.data.data.data[x].house.auditingState === 1) {
                this.list[x] = `您的房屋${response.data.data.data[x].house.address}已通过审核.`;
              } else if (response.data.data.data[x].house.auditingState === 2 ){
                this.list[x] = `您的房屋${response.data.data.data[x].house.address}因${response.data.data.data[x].reason}未通过审核.`;
              }
            }
            console.log(this.list)
          })
      },
      //获取下架信息
      getdList() {
        this.$ajax.get('http://182.92.149.135:8080/yiJu/message/downHouseMessageList?index=' + this.currentPage)
          .then(response => {
            this.list = [];
            console.log(response.data.data.data);
            this.total = response.data.data.count;
            for (let x = 0; x < response.data.data.data.length; x++) {
              this.list[x] = `由于您的房屋${response.data.data.data[x].house.address}不符合相关规定，已被下架.`;
            }
            console.log(this.list);
          })
      },
      //获取预约信息
      getbList() {
        this.$ajax.get('http://182.92.149.135:8080/yiJu/message/houseAppoMessageList?index=' + this.currentPage)
          .then(response => {
            this.list = [];
            console.log(response.data.data.data);
            this.total = response.data.data.count;
            for (let x = 0; x < response.data.data.data.length; x++) {
              this.list[x] = `用户${response.data.data.data[x].appVo.userName}请求预约您发布的${response.data.data.data[x].house.address}于${response.data.data.data[x].appVo.realDate}.`;
            }
            console.log(this.list)
          })
      },
      //获取举报信息
      getfdList() {
        this.$ajax.get('http://182.92.149.135:8080/yiJu/message/houseReportMessageList?index=' + this.currentPage)
          .then(response => {
            this.list = [];
            console.log(response.data.data.data);
            this.total = response.data.data.count;
            for (let x = 0; x < response.data.data.data.length; x++) {
              this.list[x] = `经核实，您的房屋${response.data.data.data[x].house.address}存在${response.data.data.data[x].reason}的问题,请您修改后重新提交.`;
            }
            console.log(this.list);
          })
      },
      //tabs切换
      getList(tab, event) {
        console.log(tab.index);
        if (this.index !== tab.index) {
          this.index = tab.index;
          switch (tab.index) {
            case '0' :
              this.getrList();
              break;
            case '1' :
              this.getdList();
              break;
            case '2' :
              this.getbList();
              break;
            case '3' :
              this.getfdList();
              break;
          }
          this.allNumber();
        }
      },
      //分页跳转
      handleCurrentChange(val) {
        if (this.currentPage === val - 1){
          this.allNumber();
        }
        this.currentPage = val;
        switch (this.index) {
          case '0' :
            this.getrList();
            break;
          case '1' :
            this.getdList();
            break;
          case '2' :
            this.getbList();
            break;
          case '3' :
            this.getfdList();
            break;
        }
      },
    },
  };
</script>

<style scoped>
  *{
    padding: 0;
  }

  p {
    margin: 10px 5px;
    font-weight: 500;
  }

  .message {
    width: 55%;
    min-width: 400px;
    margin: 20px auto;
  }

  .side-box {
    margin: 7px 0 20px;
    border-radius: 10px;
    background: #fff;
  }

  .box {
    margin: 5px;
    padding: 7px;
    color: black;
    height: 80px;
    overflow: hidden; /* 清除flout影响的父级元素高度坍塌 */
    position: relative;
    border-radius: 5px;
    border: 1px solid #95a5a6;
  }

  .el-pagination {
    margin: 10px auto 5px;
    text-align: center
  }
</style>
