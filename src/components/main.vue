<template>
  <div class="main">
    <div class="Header">
      <el-menu :default-active="this.$route.path" class="el-menu-demo" mode="horizontal" @select="handleSelect"
               background-color="#2e86de" text-color="#bdc3c7" active-text-color="#FFFFFF" router>
        <el-menu-item index="/"><img src="../assets/logo.png" alt=""></el-menu-item>
        <el-menu-item index="/content">&nbsp;&nbsp;首页&nbsp;&nbsp;</el-menu-item>
        <!--<el-menu-item index="/">&nbsp;&nbsp;page1&nbsp;&nbsp;</el-menu-item>-->
        <!--<el-menu-item index="/">&nbsp;&nbsp;page2&nbsp;&nbsp;</el-menu-item>-->
        <!--<el-menu-item index="/">&nbsp;&nbsp;page3&nbsp;&nbsp;</el-menu-item>-->
        <el-menu-item style="float: right" v-if="!show" @click="showModal=true">登录</el-menu-item>
        <el-dropdown class="itemtop" style="margin-left: 20px" v-if="show">
            <el-badge is-dot :hidden="hidden">
              <span class="el-dropdown-link">{{userName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
            </el-badge>
            <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link class="col" :to="myurl">个人中心</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-badge class="item" :hidden="hidden" :value="number" :max="99">
                <router-link class="col" :to="myMessage">消息提示</router-link>
              </el-badge>
            </el-dropdown-item>
            <el-dropdown-item>
              <span class="col" @click="exit()">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span class="city el-icon-place">&nbsp;{{city}}</span>
      </el-menu>
    </div>
    <div class="back">
        <router-view @city="getCity"></router-view>
    </div>
    <el-dialog title="用户登录" v-if="bounced===0" :visible.sync="showModal" :append-to-body='true' :destroy-on-close="true"
               :close-on-click-modal="false" top="120px" width="350px" center>
      <login @func="getson" @sendb="getbounced"></login>
    </el-dialog>
    <el-dialog title="注册账号" v-if="bounced===1" :visible.sync="showModal" :append-to-body='true' :destroy-on-close="true"
               :close-on-click-modal="false" @close="clearb()" top="40px" width="350px" center>
      <registered @sendb="getbounced"></registered>
    </el-dialog>
    <el-dialog title="忘记密码" v-if="bounced===2" :visible.sync="showModal" :append-to-body='true' :destroy-on-close="true"
               :close-on-click-modal="false" @close="clearb()" top="120px" width="350px" center>
      <forget @sendb="getbounced"></forget>
    </el-dialog>
    <el-dialog title="忘记密码" v-if="bounced===3" :visible.sync="showModal" :append-to-body='true' :destroy-on-close="true"
               :close-on-click-modal="false" @close="clearb()" top="140px" width="350px" center>
      <change @func="getson"></change>
    </el-dialog>
  </div>
</template>

<script>
  import login from './login/user-login'
  import forget from './login/user-forget'
  import change from './login/user-change'
  import registered from './login/user-registered'

  export default {
    data() {
      return {
        show: '',
        myurl: '',
        myMessage: '',
        search: '',
        number: '',
        hidden: true,
        drawer: false,
        bounced: 0,
        userName: '',
        identityId: '',
        showModal: false,
        city: '北京'
      }
    },
    mounted() {
      this.identity();
      this.aaa();
    },
    methods: {
      exit() {
        this.$ajax.get("http://182.92.149.135:8080/yiJu/user/logout")
          .then(response => {
            if (response.data.code === 200) {
              this.$message({
                type: 'info',
                message: '成功退出登录'
              });
              this.$router.push('/')
            }
            console.log(response.data);
            this.show = 0;
          })
      },
      getCity(val) {
        this.city = val;
      },
      bbb(){
        var a = 'aswdfgasdqwe';
        var b = 'as';
        var c = '111';
        var flag = '';
        var ax = '';
        for (let x = 1 ; x <= a.length ; x++){
          ax = x;
          console.log("x="+a.substring(x-1,x))
          if (a.substring(x-1,x) === b.substring(0,1)){
            if (a.substring(ax-1,ax-1+b.length) === b) {
              flag += c;
              ax = ax + b.length - 1
            } else {
              flag += a.substring(ax-1,ax);
            }
          }else {
            flag += a.substring(x-1,x);
          }
          x = ax
        }
        console.log(flag)
      },
      identity() {
        this.$ajax.get("http://182.92.149.135:8080/yiJu/user/getCur")
          .then(response => {
            console.log(response.data);
            localStorage.setItem("userData", JSON.stringify(response.data));
            switch (response.data.code) {
              case 401 :
                this.show = 0;
                break;
              case 200 :
                this.show = 1;
                switch (response.data.data.type) {
                  case 0 :
                    this.show = 0;
                    break;
                  case 1 :
                    this.myurl = '/user';
                    this.myMessage = '/uMessage';
                    break;
                  case 2 :
                    this.myurl = '/publisher';
                    this.myMessage = '/pMessage';
                    break;
                }
            }
            if (response.data.code === 200) {
              this.identityId = response.data.data.type;
              this.userName = response.data.data.userName;
              this.countAll(response.data.data.type)
            }
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
          });
      },
      countAll(identity){
        if (identity === 1) {
          this.$ajax.get('http://182.92.149.135:8080/yiJu/message/countOfNormalUser')
            .then(response => {
              console.log(response.data);
              this.number = response.data.data.allCount;
              this.hidden = response.data.data.allCount === 0;
            })
        } else if (identity === 2) {
          this.$ajax.get('http://182.92.149.135:8080/yiJu/message/countOfPublisher')
            .then(response => {
              console.log(response.data);
              this.number = response.data.data.allCount;
              this.hidden = response.data.data.allCount === 0;
            })
        }
      },
      clearb() {
        this.bounced = 0;
      },
      getson(data) {
        console.log(data);
        this.showModal = data;
        this.bounced = 0;
        this.identity();
      },
      getbounced(data) {
        console.log(data);
        this.bounced = data;
      },
      screening(){
        this.$router.push({
          path: '/house',
          query: {id: aaa}
        })
      },
    },
    watch:{
      '$route'(now,old) {
        if(now.path === "/uMessage" || now.path === "/pMessage" ) {
          this.hidden = true;
        } else {
          this.countAll(this.identityId);
        }
      },
    },
    components: {
      login,
      forget,
      change,
      registered,
    },
  };
</script>

<style scoped>
  img {
    height: 100%;
  }
  .main {
    height: 100%;
  }
  .Header {
    height: 60px;
    min-width: 850px;
  }
  .el-menu-demo {
    padding-right: 15px;
  }
  /*.el-menu.el-menu--horizontal {*/
    /*border-bottom: solid 0 #e6e6e6;*/
  /*}*/
  .el-menu-item i {
     color: #fff;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #fff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-menu--horizontal>.el-menu-item.is-active {
    border-bottom: 0;
  }
  .col {
    color: #000;
  }
  .back {
    background: #f1f2f6;
    height: calc(100% - 61px);
    width: 100%;
    overflow-x: hidden;
  }
  .header-right{
    float: right;
    /*line-height: 60px;*/
    /*padding-right: 15px;*/
  }
  .item {
    margin-top: -2px;
  }
  .itemtop{
    float: right;
    padding-right: 15px;
    margin-top: 20px;
  }
  .city{
    float: right;
    color: white;
    padding: 0 5px;
    margin-right: 7px;
    line-height: 60px;
  }
</style>
