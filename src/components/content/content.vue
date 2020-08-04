<template>
  <div class="content">
    <Carousel></Carousel>
    <ul v-if="total!==0" class="side-box">
      <li v-for="(item,index) in tool" :key="index" @click="jump(index)">
        <div class="box">
          <el-col :span="5" class="imgs">
            <div style="width: 150px ; overflow: hidden">
              <img :src="item.houseImages[0]" alt="">
            </div>
          </el-col>
          <el-col :span="16" class="information">
            <h4>{{item.house.community}}</h4>
            <p class="gey"><i class="el-icon-location-outline"></i>&nbsp;地址：{{item.house.address}}</p>
            <p class="gey"><i class="el-icon-office-building"></i>&nbsp;周边信息：{{item.house.description}}</p>
          </el-col>
          <el-col :span="3">
            <div class="sidebox">
              <span>{{item.house.price}}万元</span>
              <p>{{item.house.price}}m&sup2</p>
            </div>
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
    <div v-if="total===0" class="warn">
      <el-col :span="7">
        <img src="../../assets/sorry.png" style="width: 200px;height: 200px" alt="">
      </el-col>
      <el-col :span="17">
        <b>很抱歉没有您所需求的房屋信息，请更改条件重新筛选吧。</b>
      </el-col>
    </div>
    <el-button class="chick" @click="drawer = true">房<br/>屋<br/>信<br/>息<br/>筛<br/>选</el-button>
    <el-drawer
      title="房屋查筛"
      :visible.sync="drawer"
      :direction="direction"
      custom-class="demo-drawer"
      :before-close="handleClose"
      ref="drawer">
      <div class="drawerRoom demo-drawer__content">
        <el-col :span="3">城市</el-col>
        <el-col :span="21">
          <el-select v-model="radio.location" placeholder="请选择" size="mini" style="width: 90px;">
            <el-option
              v-for="item in cities"
              :value="item"
              :key="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" style="margin-top: 20px">朝向</el-col>
        <el-col :span="21">
          <el-radio-group v-model="radio.direction" style="margin-top: 20px" size="mini">
            <el-radio-button label='0'>南北向</el-radio-button>
            <el-radio-button label='1'>东西向</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="3" style="margin-top: 20px">装修</el-col>
        <el-col :span="21">
          <el-radio-group v-model="radio.decoration" style="margin-top: 20px" size="mini">
            <el-radio-button label='0'>毛坯房</el-radio-button>
            <el-radio-button label='1'>简装</el-radio-button>
            <el-radio-button label='2'>精装</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="3" style="margin-top: 20px">楼层</el-col>
        <el-col :span="21">
          <el-radio-group v-model="radio.storey" style="margin-top: 20px" size="mini">
            <el-radio-button label='0'>底楼层</el-radio-button>
            <el-radio-button label='1'>中楼层</el-radio-button>
            <el-radio-button label='2'>高楼层</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="3" style="margin-top: 20px">年份</el-col>
        <el-col :span="21">
          <el-radio-group v-model="radio.years" style="margin-top: 20px" size="mini">
            <el-radio-button label='0'>15年以内</el-radio-button>
            <el-radio-button label='1'>15~30年</el-radio-button>
            <el-radio-button label='2'>30年以上</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="3" style="margin-top: 20px">面积</el-col>
        <el-col :span="21">
          <el-radio-group v-model="radio.area" style="margin-top: 20px" size="mini">
            <el-radio-button label='0'>80m&sup2以下</el-radio-button>
            <el-radio-button label='1'>80m&sup2~150m&sup2</el-radio-button>
            <el-radio-button label='2'>150m&sup2以上</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="3" style="margin-top: 20px">价格</el-col>
        <el-col :span="21">
          <el-radio-group v-model="radio.price" style="margin-top: 20px" size="mini">
            <el-radio-button label='0'>200万以下</el-radio-button>
            <el-radio-button label='1'>200~350万</el-radio-button>
            <el-radio-button label='2'>350万以上</el-radio-button>
          </el-radio-group>
        </el-col>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="screening()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  import Carousel from './Carousel'

  export default {
    data() {
      return {
        drawer: false,
        reasult: '',
        imgurl: 'http://182.92.149.135:8080/yiJu/images/get/',
        tool: [],
        total:'',
        currentPage:1,
        radio:{
          location: '北京',
          direction: '-1',
          decoration: '-1',
          storey: '-1',
          years: '-1',
          area: '-1',
          price: '-1',
        },
        direction: 'ltr',
        cities:[],
        flag: '',
      }
    },
    mounted() {
     this.getinformation(this.flag);
      this.$ajax.get("http://182.92.149.135:8080/yiJu/house/getCity")
        .then(response => {
          console.log(response.data);
          this.cities = response.data.data
        })
    },
    methods: {
      jump(index) {
        let routeUrl = this.$router.resolve({
          path: '/house',
          query: {id: this.tool[index].house.id}
        });
        window.open(routeUrl.href, '_blank');
      },
      screening() {
        let flag = `city=${this.radio.location}`;
        if (this.radio.direction === '-1'){
          flag+='';
        }else{
          flag+=`&direction=${this.radio.direction}`;
        }
        if (this.radio.decoration === '-1'){
          flag+='';
        }else{
          flag+=`&decoration=${this.radio.decoration}`;
        }
        if (this.radio.storey === '-1'){
          flag+='';
        }else if (this.radio.storey === '0') {
          flag+=`&maxStorey=5&minStorey=1`;
        }else if (this.radio.storey === '1') {
          flag+=`&maxStorey=10&minStorey=6`;
        }else if (this.radio.storey === '2') {
          flag+=`&minStorey=11`;
        }
        if (this.radio.years === '-1'){
          flag+='';
        }else if (this.radio.years === '0') {
          flag+=`&maxAge=15&minAge=1`;
        }else if (this.radio.years === '1') {
          flag+=`&maxAge=30&minAge=15`;
        }else if (this.radio.years === '2') {
          flag+=`&minAge=30`;
        }
        if (this.radio.area === '-1'){
          flag+='';
        }else if (this.radio.area === '0') {
          flag+=`&maxArea=80&minArea=1`;
        }else if (this.radio.area === '1') {
          flag+=`&maxArea=150&minArea=80`;
        }else if (this.radio.area === '2') {
          flag+=`&minArea=150`;
        }
        if (this.radio.price === '-1'){
          flag+='';
        }else if (this.radio.price === '0') {
          flag+=`&maxPrice=200&minPrice=1`;
        }else if (this.radio.price === '1') {
          flag+=`&maxPrice=350&minPrice=200`;
        }else if (this.radio.price === '2') {
          flag+=`&minPrice=350`;
        }
        this.flag = flag;
        console.log(flag);
        this.$emit('city', this.radio.location);
        this.getinformation(this.flag);
        this.drawer = false;
      },
      cancelForm() {
        this.radio = {
          location: '北京',
          direction: '-1',
          decoration: '-1',
          storey: '-1',
          years: '-1',
          area: '-1',
          price: '-1',
        };
        this.getinformation(this.flag = '');
      },
      getinformation(flag){
        this.$ajax.get('http://182.92.149.135:8080/yiJu/house/get?index=' + this.currentPage + '&' +flag)
          .then(response => {
            this.total = response.data.data.count;
            this.reasult = response.data.data;
            this.tool = this.reasult.data;
            console.log(this.reasult);
            console.log(this.tool);
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
    components: {
      Carousel,
    },
  };
</script>

<style scoped>
  h4{
    padding: 0;
    margin: 0;
  }
  img {
    height: 100px;
  }
  p{
    margin: 10px 5px;
    font-weight: 500;
  }
  .content {
    width: 100%;
    height: calc(100% - 5px);
    padding-top: 5px;
  }
  .side-box {
    width: 55%;
    padding: 8px 4px;
    margin: 7px auto 20px;
    border-radius: 10px;
    background: #fff;
  }
  .box {
    margin: 5px;
    padding: 7px;
    color: black;
    height: 110px;
    overflow: hidden; /* 清除flout影响的父级元素高度坍塌 */
    position: relative;
    border-radius: 5px;
    border: 1px solid #95a5a6;
  }
  .information {
    height: 100px;
    padding: 8px 25px 5px;
  }
  .sidebox{
    margin-top: 30px;
  }
  .gey{
    font-size: 13px;
    color: #718093;
  }
  .imgs{
    padding: 5px 10px;
  }
  div > span{
    color: #eb2f06;
    font-weight: 600;
    padding-top: 30px;
  }
  .el-pagination{
    margin: 10px auto 5px;
    text-align: center
  }
  .chick{
    top: 50%;
    left: 0;
    height:160px;
    width: 36px !important;
    line-height: 17px;
    padding: 0 5px;
    margin: -40px 0;
    position: absolute;
    background: #bee7ff;
    color: black;
  }
  >>> .el-drawer{
    min-width: 400px;
  }
  .drawerRoom{
    margin-left: 35px;
  }
  .el-button{
    width: 45%;
  }
  .warn{
    width: 55%;
    height: 200px;
    font-size: 20px;
    line-height: 180px;
    margin: 20px auto 0;
    padding: 7px 10px;
    background: white;
  }
</style>
