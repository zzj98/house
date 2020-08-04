<template>
  <div class="message">
    <el-tabs type="border-card" @tab-click="getList">
      <el-tab-pane>
        <span slot="label">
          <span>预约信息</span>
          <el-badge :hidden="bNumber <= 0" :value="bNumber" size="mini" :max="99"></el-badge>
        </span>
        <ul class="side-box">
          <li v-for="(item,index) in list" :key="index">
            <div class="box">
              <el-col :span="21" class="information">
                <p class="gey">{{item}}</p>
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
          <span>举报反馈</span>
          <el-badge :hidden="bNumber <= 0" :value="fbNumber" size="mini" :max="99"></el-badge>
        </span>
        <ul class="side-box">
          <li v-for="(item,index) in list" :key="index">
            <div class="box">
              <el-col :span="24" class="information">
                <p>{{item.result}}<br/>举报原因:{{item.reason}}</p>
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
        bNumber: '',
        fbNumber: '',
      }
    },
    mounted() {
      this.getbList();
      this.allNumber();
    },
    methods: {
      //获取所有类型未读消息的数量
      allNumber() {
        this.$ajax.get('http://182.92.149.135:8080/yiJu/message/countOfNormalUser')
          .then(response => {
            console.log(response.data);
            this.bNumber = response.data.data.appoBackMessageCount;
            this.fbNumber = response.data.data.reportMessageCount;
            if (this.index === '0'){
              this.bNumber -= 10;
            } else {
              this.fbNumber -= 10;
            }
            // console.log(this.bNumber);
            // console.log(this.fbNumber);
          })
      },
      //获取预约信息
      getbList() {
        this.$ajax.get('http://182.92.149.135:8080/yiJu/message/appoBackMessageList?index=' + this.currentPage)
          .then(response => {
            this.list = [];
            console.log(response.data.data.data);
            this.total = response.data.data.count;
            for (let x = 0; x < response.data.data.data.length; x++) {
              switch (response.data.data.data[x].appVo.state) {
                case 1 :
                  response.data.data.data[x].appVo.state = '接受';
                  break;
                case 2 :
                  response.data.data.data[x].appVo.state = '拒绝';
                  break;
              }
              this.list[x] = `${response.data.data.data[x].house.address}房源的发布者${response.data.data.data[x].appVo.userName}`
                +`${response.data.data.data[x].appVo.state}了您于${response.data.data.data[x].appVo.realDate}的看房预约.`
            }
          })
      },
      //获取举报信息
      getfdList() {
        this.$ajax.get('http://182.92.149.135:8080/yiJu/message/reportBackMessageList?index=' + this.currentPage)
          .then(response => {
            this.list = [];
            console.log(response.data.data.data);
            this.total = response.data.data.count;
            for (let x = 0; x < response.data.data.data.length; x++) {
              if (response.data.data.data[x].reportInformation.state === 1) {
                this.list[x] = {
                  'result' : `您对${response.data.data.data[x].house.address}的举报信息已通过审核,我们会要求房屋发布者对改房源信息作出整改.`,
                  'reason' : response.data.data.data[x].reportInformation.reason
                };
              } else if (response.data.data.data[x].reportInformation.state === 2 ){
                this.list[x] = {
                  'result' : `很抱歉,您对${response.data.data.data[x].house.address}的举报信息未通过审核,我们会关注改房屋信息,如有问题会及时对房屋信息整改.`,
                  'reason' : response.data.data.data[x].reportInformation.reason
                };
              }
            }
            console.log(this.list);
          })
      },
      //tabs切换
      getList(tab, event) {
        console.log(tab.index);
        if (this.index !== tab.index){
          this.index = tab.index;
          switch (tab.index) {
            case '0' :
              this.getbList();
              break;
            case '1' :
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
            this.getfdList() ;
            break ;
          case '1' :
            this.getbList() ;
            break ;
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
