<template>
  <div class="house">
    <div class="house-room">
      <div class="title"><b>{{results.house.community}}{{results.house.storey}}楼{{decoration}}</b></div>
      <div class="bheight">
        <el-col :span="13">
          <el-carousel trigger="click" height="300px" style="text-align: center">
            <el-carousel-item v-for="item in results.houseImages" :key="item">
              <img :src="item">
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="11" class="block">
          <p class="prices">{{results.house.price}}万</p><hr>
          <el-col :span="8">
            <div>{{results.house.layout}}<br/>户型</div>
          </el-col>
          <el-col :span="8">
            <div>{{results.house.area}}m&sup2<br/>面积</div>
          </el-col>
          <el-col :span="8">
            <div>{{results.house.storey}}楼<br/>楼层</div>
          </el-col><br/>
          <el-col :span="8">
            <div>{{direction}}向<br/>朝向</div>
          </el-col>
          <el-col :span="8">
            <div>{{decoration}}<br/>装修</div>
          </el-col>
          <el-col :span="8">
            <div>{{years}}年<br/>  建筑年份</div>
          </el-col><hr>
          <span><i class="el-icon-location-outline"></i>&nbsp;{{results.house.address}}</span><br/>
          <span><i class="el-icon-office-building"></i>&nbsp;周边信息：{{results.house.description}}</span><br/>
        </el-col>
        <div class="btn">
          <el-button type="primary" round @click="paging">预约看房</el-button>
        </div>
      </div>
    </div>
    <div class="mask" v-if="showModal" @click="showModal=false"></div>
    <div class="pop" v-if="showModal">
      <div>请选择预约时间</div>
      <button type="button" @click="Close" class="el-message-box__headerbtn">
        <i class="el-message-box__close el-icon-close"></i>
      </button>
      <el-date-picker v-model="selectDatetime" type="datetime" class="clock" placeholder="选择时间" @change="dataSearch" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      <el-button type="primary" @click="book()" round >确认时间</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        results: '',
        years: '',
        direction:'',
        decoration:'',
        img:[],
        userData:'',
        showModal: false,
        selectDatetime:'',
      }
    },
    created() {
      this.initData({});
    },
    methods: {
      book(){
        this.$ajax.post("http://182.92.149.135:8080/yiJu/appointment/add",{
          realDate:this.selectDatetime,
          toHouse:this.results.house.id,
          toUser:this.results.house.userId
        }).then(response=>{
          // console.log(response.data)
          this.$alert(response.data.message,'提示',{
            showConfirmButton:'确定'
          });
        });
        // console.log(this.selectDatetime);
        this.showModal=false;
      },
      Close(){
        this.showModal = false;
      },
      paging(){
        this.userData = JSON.parse(localStorage.getItem('userData'));
        console.log(this.userData);
        if(this.userData.code === 401) {
          this.$message({
            type: 'error',
            message: '请登录后再执行预约操作!'
          })
        } else if (this.userData.data.type === 2) {
          this.$message({
            type: 'error',
            message: '发布者无法执行预约操作!'
          })
        } else if (this.userData.data.type === 1){
          this.showModal=true
        } else {
          this.$message({
            type: 'error',
            message: '请登录后再执行预约操作!'
          })
        }
      },
      dataSearch() {
        this.getListByDataTime();
      },
      async initData(data) {
        //获取当前时间
        var now   = new Date();
        var monthn = now.getMonth()+1;
        var yearn  = now.getFullYear();
        var dayn = now.getDate();
        var h = now.getHours();
        var m =now.getMinutes();
        var s = now.getSeconds();
        this.selectDatetime = yearn+"-"+monthn+"-"+dayn+" "+h+":"+m+":"+s;

        this.selectUser = parseInt(sessionStorage.getItem("userid"));
        this.getListByDataTime();
      },
      async getListByDataTime(data) {
      }
    },
    mounted() {
      this.$ajax.get('http://182.92.149.135:8080/yiJu/house/getDetail/' + this.$route.query.id)
        .then(response => {
          this.results = response.data.data;
          // console.log(this.results.houseImages);
          this.years = this.results.house.years.substring(0, 4);
          switch (this.results.house.direction) {
            case 0:this.direction='南北';break;
            case 1:this.direction='东西';break;
          }
          switch (this.results.house.decoration) {
            case 0:this.decoration='毛坯房';break;
            case 1:this.decoration='简装';break;
            case 2:this.decoration='精装';break;
          }
        })
        .catch(function (error) { // 请求失败处理
          console.log(error);
        });
    },
  };
</script>

<style scoped>
  b {
    font-size: 20px;
    padding-left: 10px;
    float: none;
  }

  img{
    height: 100%;
  }

  hr{
    width: 98%;
  }

  span{
    font-size: 13px;
  }

  .el-col > div {
    padding: 3px 10px;
  }

  .block > div {
    color: gray;
    margin: 15px 0;
    font-size: 15px;
    text-align: center;
  }

  .house{
    height: calc(100% - 55px);
    padding-top: 55px;
  }

  .house-room {
    width: 65%;
    margin: 0 auto 0;
    padding: 20px 25px;
    min-width: 860px;
    border-radius: 8px;
    background-color: #fff;
  }

  .title {
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    font-size: 24px;
  }

  .bheight {
    overflow: hidden;
  }

  .block {
    padding: 3px 20px;
  }

  .prices {
    color: #eb2f06;
    margin: 5px 0;
    font-size: 24px;
    font-weight: 500;
  }

  .btn {
    float: left;
    width: 98%;
    text-align: center;
    margin-top: 15px;
    padding-bottom: -7px;
  }

  .mask {
    background-color: #000;
    opacity: 0.3;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2
  }

  .pop {
    background-color: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 300px;
    height:160px;
    margin: -80px -150px;
    z-index: 3;
    padding: 15px;
    border-radius: 15px;
    text-align: center;
  }

  .clock{
    width: 85%;
    margin: 28px 0;
  }
</style>
