<template>
  <div class="login-container">
    <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-position="left" class="demo-ruleForm login-page">
      <el-form-item prop="email">
        <el-input type="text" v-model="ruleForm.email" auto-complete="off" placeholder="邮箱号"></el-input>
      </el-form-item>
      <el-form-item prop="check">
        <div>
          <el-input type="text" v-model="ruleForm.check" class="check" auto-complete="off" placeholder="验证码"></el-input>
        </div>
        <div>
          <img @click="editCaptcha" :src="img[0].src">
        </div>
      </el-form-item>
      <el-form-item prop="emailcheck">
        <div>
          <el-input type="text" v-model="ruleForm.emailcheck" class="check" auto-complete="off" placeholder="邮箱验证"></el-input>
        </div>
        <div>
          <el-button type="primary" style="margin-left: 20px;width: 135px" :disabled="!ruleForm.check || !this.canClick" @click="countDown">
            {{content}}
          </el-button>
        </div>
      </el-form-item>
      <el-link type="primary" class="style1" @click="send()" :underline="false">登录账号</el-link>
      <el-link type="primary" class="style1" style="float: right" @click="sendr()" :underline="false">注册账号</el-link>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">确 定</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      let email = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('邮箱不能为空'));
        } else {
          const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('您的邮箱格式不正确，请输入正确的邮箱。'));
          }
        }
      };
      return {
        result: '',
        logining: false,
        content: '发送邮箱验证',  // 按钮里显示的内容
        totalTime: 60,     //记录具体倒计时时间
        canClick: true, //添加canClick
        rules: {
          email: [{required: true, validator: email, trigger: 'blur'}],
          check: [{required: true, message: '验证码不能为空', trigger: 'blur'}],
          emailcheck: [{required: true, message: '邮箱验证不能为空', trigger: 'blur'}],
        },
        ruleForm: {
          email: '',
          check: '',
          emailcheck: '',
        },
        img: [{src: 'http://182.92.149.135:8080/yiJu/user/kaptcha'}],
      }
    },
    methods: {
      send(){
        this.$emit('sendb',0);
      },
      sendr(){
        this.$emit('sendb',1);
      },
      countDown () {
        this.$ajax.post('http://182.92.149.135:8080/yiJu/user/forgetPSW?userCode='+this.ruleForm.check,this.ruleForm.email,{
          headers: {
            'Content-Type': 'application/json'
          },
        }).then(response => {
          console.log(response.data);
          if (response.data.code === 200){
            this.$message({
              type : 'success',
              message : '邮件已发送,请注意查收.'
            });
            if (!this.canClick) return ;
            this.canClick = false;
            this.content = this.totalTime + 's后重新发送';
            let clock = window.setInterval(() => {
              this.totalTime--;
              this.content = this.totalTime + 's后重新发送';
              if (this.totalTime < 0) {
                window.clearInterval(clock);
                this.content = '重新发送验证码';
                this.totalTime = 60;
                this.canClick = true  //这里重新开启
              }
            },1000)
          } else {
            if (response.data.message === '请稍后访问！'){
              this.$message({
                type : 'info',
                message : '验证码已发送请稍后重试.'
              });
              this.editCaptcha();
            } else {
              this.$message({
                type : 'error',
                message : response.data.message
              });
              this.editCaptcha();
            }
          }
        });

      },
      handleSubmit(){
        this.$ajax.post('http://182.92.149.135:8080/yiJu/user/verifyPSWCaptcha', {
          "userCaptcha": this.ruleForm.emailcheck,
          "userMail": this.ruleForm.email
        })
          .then(response => {
            this.result = response.data;
            console.log(this.result);
            if (this.result.code === 200){
              this.$emit('sendb',3);
            } else {
              this.$message({
                type : 'error',
                message : this.result.message
              });
              this.editCaptcha();
            }
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
          });
      },
      editCaptcha() {
        let num = Math.ceil(Math.random() * 100);//生成一个随机数（防止缓存）
        this.img[0].src = 'http://182.92.149.135:8080/yiJu/user/kaptcha?' + num;
      },
    },
    mounted(){
      this.editCaptcha();
    }
  };
</script>

<style scoped>
  .style1 {
    margin: 0 0 15px;
  }
  .check {
    width: 140px;
    float: left;
  }
  img {
    width: 135px;
    height: 40px;
    padding-left: 20px;
  }
  >>> .el-form-item__content {
    line-height: 0;
  }
</style>
