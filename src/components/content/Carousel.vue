<template>
  <div class="Carousel">
    <el-carousel :interval="4000" type="card" class="wh" height="250px" style="text-align: center">
      <el-carousel-item v-for="item in imageUrl" :key="item">
        <img :src="item">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        imageUrl: []
      }
    },
    mounted() {
      this.$ajax.get("http://182.92.149.135:8080/yiJu/homePagePicture/getHomePagePictures")
        .then(response => {
          console.log(response.data);
          this.imageUrl = response.data.data;
        }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    },
  }
</script>

<style scoped>
  img{
    height: 100%;
  }

  .Carousel {
    width: 100%;
  }

  .wh {
    width: 85%;
    margin: 0 auto;
  }

  >>> .el-carousel__indicators--outside {
    bottom: 0;
    margin-left: -114px;
    position: absolute;
  }

  .el-carousel__indicators--outside button {
    /*background-color:black;*/
    /*opacity: .70;*/
  }

  .el-carousel__indicators--horizontal {
    margin-left: -114px;
  }

  .el-carousel__indicators--outside {
    bottom: 0;
    position: absolute;
  }
  >>> .el-carousel__indicators--outside button {
    background-color: #fff;
    opacity: 1;
  }
</style>
