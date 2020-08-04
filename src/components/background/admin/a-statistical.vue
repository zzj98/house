<template>
  <div class="statistical">
    <div>
      <el-col :span="6" class="allF">
        <el-card>
          <i class="el-icon-phone" style="color: green"></i>
          <div style="float: right">
            <span style="font-size: 14px">预约</span><br/>
            <span>{{form.book}}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" class="allF">
        <el-card>
          <i class="el-icon-s-home" style="color: dodgerblue"></i>
          <div style="float: right">
            <span style="font-size: 14px">房屋</span><br/>
            <span>{{form.house}}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" class="allF">
        <el-card>
          <i class="el-icon-warning" style="color: brown"></i>
          <div style="float: right">
            <span style="font-size: 14px">举报</span><br/>
            <span>{{form.report}}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" class="allF">
        <el-card>
          <i class="el-icon-s-custom" style="color: darkorchid"></i>
          <div style="float: right">
            <span style="font-size: 14px">用户</span><br/>
            <span>{{form.user}}</span>
          </div>
        </el-card>
      </el-col>
    </div>
    <el-card class="trend">
      <div id="chartColumn" style="width:100%;height: 300px;clear: both"></div>
      <el-radio-group v-model="isCollapse" @change="getDrawLineTrend" style="margin-top: -300px;float: right">
        <el-radio-button :label="true"><span class="el-icon-sunny"></span></el-radio-button>
        <el-radio-button :label="false"><span class="el-icon-moon"></span></el-radio-button>
      </el-radio-group>
    </el-card>
    <div class="allT">
      <el-col :span="12">
        <el-card class="cardT">
          <div id="histogram" style="width:100%;height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="cardT" style="float: right">
          <div id="PieChart" style="width:100%;height: 300px;"></div>
        </el-card>
      </el-col>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    data() {
      return {
        nth: 7,
        timeUnit: 'day',
        xList: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        form:{
          book: '',
          house: '',
          report: '',
          user: '',
        },
        bookData: '',
        houseData: '',
        reportData: '',
        userData: '',
        todayList: [],
        PieChartList: [],
        isCollapse: true,
        chartColumn: null,
        histogram: null,
        chartPie: null,
      }
    },
    methods: {
      //趋势图
      drawLineTrend(){
        this.chartColumn = echarts.init(document.getElementById('chartColumn'));
        this.chartColumn.setOption({
          tooltip: {},
          legend: {
            data:['预约','房屋','举报','用户']
          },
          color: ['#008000', '#1e90ff','#a52a2a','#9932cc'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.xList
          },
          yAxis: {
            type: 'value',
          },
          series: [{
            name: '预约',
            data: this.bookData,
            type: 'line'
          },{
            name: '房屋',
            data: this.houseData,
            type: 'line'
          },{
            name: '举报',
            data: this.reportData,
            type: 'line'
          },{
            name: '用户',
            data: this.userData,
            type: 'line'
          }]
        });
        window.addEventListener("resize", function () {
          this.drawLineTrend.chartColumn.resize();//myCharts是你的初始化echarts图表时取的名字
        });
      },
      //柱状图 histogram
      drawLineHistogram(){
        this.histogram = echarts.init(document.getElementById('histogram'));
        this.histogram.setOption({
          title : {
            text: '今日新增数据',//主标题
            x:'center',//x轴方向对齐方式
          },
          tooltip: {},
          legend: {
            bottom: 'bottom',
            data:['预约','房屋','举报','用户']
          },
          color: ['#008000', '#1e90ff','#a52a2a','#9932cc'],
          xAxis: {
            type: 'category',
            data: ['今日新增']
          },
          yAxis: {
            type: 'value',
          },
          series: this.todayList
        });
        window.addEventListener("resize", function () {
          this.drawLineHistogram.histogram.resize();//myCharts是你的初始化echarts图表时取的名字
        });
      },
      //饼状图 PieChart
      drawLinePieChart(){
        this.chartPie = echarts.init(document.getElementById('PieChart'));
        // 绘制图表
        this.chartPie.setOption({
          title : {
            text: '房屋合格率',//主标题
            x:'center',//x轴方向对齐方式
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            bottom: 'bottom',
            data: ['合格房源','问题房源']
          },
          color: ['#1e90ff','#e84118'],
          series : [
            {
              name: '访问来源',
              type: 'pie',
              radius : '55%',
              data:this.PieChartList,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
        window.addEventListener("resize", function () {
          this.drawLinePieChart.chartPie.resize();//myCharts是你的初始化echarts图表时取的名字
        });
      },
      getDrawLineTrend(){
        let week = new Date().getDay();
        let month = new Date().getMonth();
        console.log(week);
        console.log(month);
        if (this.isCollapse === true){
          this.nth = 7;
          this.timeUnit = 'day';
          switch (week) {
            case 0 : this.xList = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];break;
            case 1 : this.xList = [ 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];break;
            case 2 : this.xList = [ 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];break;
            case 3 : this.xList = [ 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'];break;
            case 4 : this.xList = [ 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];break;
            case 5 : this.xList = [ 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];break;
            case 6 : this.xList = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];break;
          }
        } else {
          this.nth = 12;
          this.timeUnit = 'month';
          switch (month) {
            case 0 : this.xList = ['Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan'];break;
            case 1 : this.xList = ['Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];break;
            case 2 : this.xList = ['Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];break;
            case 3 : this.xList = ['May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];break;
            case 4 : this.xList = ['June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];break;
            case 5 : this.xList = ['July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'];break;
            case 6 : this.xList = ['Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'];break;
            case 7 : this.xList = ['Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug'];break;
            case 8 : this.xList = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept'];break;
            case 9 : this.xList = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct'];break;
            case 10 : this.xList = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov'];break;
            case 11 : this.xList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];break;
          }
        }
        this.$ajax.get(`http://182.92.149.135:8080/yiJu/statistics/getNthStatisticsDataByTimeUnit?nth=${this.nth}&timeUnit=${this.timeUnit}`)
          .then(response => {
            console.log(response.data);
            this.bookData = response.data.data.appoData;
            this.houseData = response.data.data.houseData;
            this.reportData = response.data.data.reportData;
            this.userData = response.data.data.userData;
            this.drawLineTrend();
          }).catch(function (error) { // 请求失败处理
          console.log(error);
        });
      },
      //echarts 自适应
      init() {
        const self = this;//因为箭头函数会改变this指向，指向windows。所以先把this保存
        setTimeout(() => {
          window.addEventListener("resize", function () {
            self.chartColumn.resize();
            self.histogram.resize();
            self.chartPie.resize();
          });
        },10)
      }
    },
    mounted() {
      this.$ajax.get("http://182.92.149.135:8080/yiJu/statistics/getAllTypeStatisticsData")
        .then(response => {
          console.log(response.data);
          this.form.book = response.data.data.appoStatisticsData.allCount;
          this.form.house = response.data.data.houseStatisticsData.allCount;
          this.form.report = response.data.data.reportStatisticsData.allCount;
          this.form.user = response.data.data.userStatisticsData.allCount;
          this.todayList =[{name: '预约', data: [response.data.data.appoStatisticsData.todayAdd], type: 'bar'},
                            {name: '房屋', data: [response.data.data.houseStatisticsData.todayAdd], type: 'bar'},
                            {name: '举报', data: [response.data.data.reportStatisticsData.todayAdd], type: 'bar'},
                            {name: '用户', data: [response.data.data.userStatisticsData.todayAdd], type: 'bar'}];
          this.drawLineHistogram();
        }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
      this.$ajax.get("http://182.92.149.135:8080/yiJu/statistics/getPassAndFailHouseCount")
        .then(response => {
          console.log(response.data);
          this.PieChartList = [
            {value:response.data.data.pass, name:'合格房源'},
            {value:response.data.data.fail, name:'问题房源'},
          ];
          this.drawLinePieChart();
        }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
      this.getDrawLineTrend();
      this.init() //echarts 自适应
    },
  }
</script>

<style scoped>
  .statistical {
    width: 84%;
    margin: 0 auto;
  }

  i{
    font-size: 45px;
  }

  .allF > .el-card {
    width: 92%;
    margin: 0 auto;
  }

  .allF{
    margin: 8px 0;
  }

  .trend{
    width: 98%;
    margin: 8px auto;
    padding: 0;
  }

  .allT{
    width: 98%;
    margin: 0 auto;
  }

  .cardT{
    width: 97%;
  }
</style>
