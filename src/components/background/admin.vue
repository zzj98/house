<template>
  <div class="admin">
    <el-container>
      <el-header>
        <router-link to="/"><img src="../../assets/logo.png" alt=""></router-link>
        <el-dropdown style="float: right;padding-right: 10px;font-size: 17px">
          <span class="el-dropdown-link">{{userName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link class="col" to="/">返回主页</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <span class="col" @click="exit()">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-avatar :src="avatar"></el-avatar>
      </el-header>
      <el-container>
        <el-aside width="180px">
          <el-col :span="24" class="scover">
            <el-menu :default-active="this.$route.path" class="el-menu-vertical-demo scover" background-color="#333744"
                     text-color="#fff" active-text-color="#ffd04b" router>
              <el-menu-item index="/aStatistical">
                <template slot="title">
                  <i class="el-icon-s-data"></i>
                  <span>数据统计</span>
                </template>
              </el-menu-item>
              <el-menu-item index="/aAccount">
                <template slot="title">
                  <i class="el-icon-shopping-bag-1"></i>
                  <span>账号管理</span>
                </template>
              </el-menu-item>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>信息列表</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/aHinfor">房源信息</el-menu-item>
                  <el-menu-item index="/aBook">预约信息</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-menu-item index="/aFeedback">
                <template slot="title">
                  <i class="el-icon-shopping-bag-1"></i>
                  <span>反馈审核</span>
                </template>
              </el-menu-item>
              <el-menu-item index="/aShuffling">
                <template slot="title">
                  <i class="el-icon-setting"></i>
                  <span>设置轮播</span>
                </template>
              </el-menu-item>
              <el-menu-item index="/apInformation">
                <template slot="title">
                  <i class="el-icon-edit"></i>
                  <span>编辑资料</span>
                </template>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        avatar: '',
        userName: '',
      }
    },
    methods: {
      exit(){
        this.$ajax.get("http://182.92.149.135:8080/yiJu/user/logout")
          .then(response => {
            console.log(response.data);
            this.$alert(response.data.message, '提示', {
              confirmButtonText: '确定'
            }).then((action) => {
              this.$router.push('/')
            })
          })
      },
    },
    mounted(){
      this.$ajax.get("http://182.92.149.135:8080/yiJu/user/getCur")
        .then(response => {
          console.log(response.data);
          localStorage.setItem("userData", JSON.stringify(response.data));
          if (response.data.code === 200) {
            this.userName = response.data.data.userName;
            this.avatar = response.data.data.headerUrl;
          }
        })
        .catch(function (error) { // 请求失败处理
          console.log(error);
        });
    },
  };
</script>

<style scoped>
  html, body {
    padding: 0;
    margin: 0;
  }

  img{
    height: 100%;
  }

  .admin {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    color: white;
    line-height: 60px;
    font-size: 25px;
  }

  .el-container{
    height: 100%;
    overflow-x: hidden;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }

  .el-menu {
    border-right: 0;
  }

  .el-submenu .el-menu-item {
    min-width: 180px;
  }

  .col {
    color: #000;
  }

  .scover {
    height: 100%;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #fff;
  }

  .el-avatar{
    float: right;
    margin: 10px 10px 0 0;
  }
</style>
