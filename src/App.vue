<template>
  <div id="app">
     <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  export default {
    provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
      return {
        reload: this.reload
      }
    },
    data () {
      return {
        radio: '1',
        isRouterAlive: true                    //控制视图是否显示的变量
      };
    },
    methods: {
      reload () {
        this.isRouterAlive = false;            //先关闭，
        this.$nextTick(function () {
          this.isRouterAlive = true;         //再打开
        })
      }
    },
  }
</script>

<style>
  body,html{
    padding: 0;
    margin: 0;
    height: 100%;
  }
  a{
    text-decoration:none
  }
  ul{
    list-style: none;
  }
  #app {
    width: 100%;
    height: 100%;
  }
  .el-menu-item-group__title{
    padding: 0;
  }
  :focus{
    outline:none
  }
  .demo-drawer__footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 10px 16px;
  }
</style>
