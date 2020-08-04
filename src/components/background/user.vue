<template>
  <div class="user">
    <el-container>
      <div :class="{sShrinkage:isCollapse,sAn:!isCollapse}">
        <el-menu :default-active="this.$route.path" class="el-menu-vertical-demo scover" @open="handleOpen" @close="handleClose"
                 background-color="#304156" text-color="#b2bec3" router :collapse="isCollapse">
          <div class="divImg">
            <router-link to="/" >
              <img src="../../assets/logo.png" :class="{imgAn:isCollapse,imgShrinkage:!isCollapse}">
            </router-link>
          </div>
          <el-menu-item index="/ubook">
            <i class="el-icon-date"></i>
            <span slot="title">预约信息</span>
          </el-menu-item>
          <el-menu-item index="/ufeedback">
            <i class="el-icon-document"></i>
            <span slot="title">举报信息</span>
          </el-menu-item>
          <el-menu-item index="/upinformation">
              <i class="el-icon-edit"></i>
              <span slot="title">编辑资料</span>
          </el-menu-item>
        </el-menu>
      </div>
      <el-container>
        <el-header>
          <span v-if="isCollapse" @click="isCollapse = false" class="showBtn"><i class="el-icon-s-unfold"></i></span>
          <span v-if="!isCollapse" @click="isCollapse = true" class="showBtn"><i class="el-icon-s-fold"></i></span>
          <el-dropdown style="float: right;padding-right: 10px;font-size: 17px;">
            <span class="el-dropdown-link">{{userName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link class="col" to="/">返回主页</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-badge class="item" :hidden="hidden" :value="number" :max="99">
                  <router-link class="col" to="/uMessage">消息提示</router-link>
                </el-badge>
              </el-dropdown-item>
              <el-dropdown-item>
                <span class="col" @click="exit()">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-avatar :src="avatar"></el-avatar>
        </el-header>
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
        isCollapse: false,
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
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },
    mounted(){
      this.$ajax.get("http://182.92.149.135:8080/yiJu/user/getCur")
        .then(response => {
          console.log(response.data);
          if (response.data.code === 200) {
            this.userName = response.data.data.userName;
            this.avatar = response.data.data.headerUrl;
          }
        }).catch(function (error) { // 请求失败处理
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

  .user {
    height: 100%;
  }

  .el-header {
    background-color: #2e86de;
    color: white;
    line-height: 60px;
    font-size: 25px;
  }

  .el-container{
    height: 100%;
    background: #E9EEF3;
    overflow-x: hidden;
  }

  .el-main {
    width: 100%;
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

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .sShrinkage{
    width: 64px;
    height: 100%;
  }
  .sAn{
    width: 200px;
    height: 100%;
  }
  .divImg{
    width: 100%;
    height: 60px;
    background: #2b2f3a;
  }
  .imgShrinkage{
    height: 60px;
    margin: 0 20px;
  }
  .imgAn{
    width: 60px;
    padding: 10px 2px;
  }
  .showBtn{
    height: 60px;
  }

  div >>> .collapse-transition {
    -webkit-transition: 0s height, 0s padding-top, 0s padding-bottom;
    transition: 0s height, 0s padding-top, 0s padding-bottom
  }

  div >>> .horizontal-collapse-transition {
    -webkit-transition: 0s width, 0s padding-left, 0s padding-right;
    transition: 0s width, 0s padding-left, 0s padding-right
  }

  div >>> .horizontal-collapse-transition .el-submenu__title .el-submenu__icon-arrow {
    -webkit-transition: 0s;
    transition: 0s;
    opacity: 0
  }
</style>
