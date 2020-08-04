<template>
  <div class="login-container">
    <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-position="left" class="demo-ruleForm login-page">
      <h3 class="title">管理员登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="ruleForm.email" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item prop="check">
        <div>
          <el-input type="text" v-model="ruleForm.check" class="check" auto-complete="off" placeholder="验证码"></el-input>
        </div>
        <div>
          <img @click="editCaptcha" :src="img[0].src">
        </div>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
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
        logining: false,
        ruleForm: {
          email: '',
          password: '',
          check:'',
        },
        rules: {
          email: [{required: true, validator: email, trigger: 'blur'}],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
          check: [{required: true, message: '验证码不能为空', trigger: 'blur'}],
        },
        img: [{src: 'http://182.92.149.135:8080/yiJu/user/kaptcha'}],
      }
    },
    methods: {
      handleSubmit(){
        this.$ajax.post('http://182.92.149.135:8080/yiJu/user/login?admin=true&userCode='+this.ruleForm.check, {
          "email": this.ruleForm.email,
          "password": this.ruleForm.password,
          // "type":0,
        })
          .then(response => {
            this.reasult = response.data;
            this.$alert(this.reasult.message, '提示', {
              confirmButtonText: '确定'
            }).then((action) => {
              this.editCaptcha();
              if (this.reasult.code === 200){
                this.$router.push('/admin')
              }
            });
            console.log(this.reasult)
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
  img {
    width: 135px;
    height: 40px;
    padding-left: 20px;
  }
  .login-container {
    width: 100%;
    height: 100%;
    position: absolute;
    background: #3498db;
  }
  .login-page {
    top: 50%;
    left: 50%;
    margin: -175px -185px;
    position: absolute;
    width: 300px;
    padding: 20px 35px 15px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    background: #fff;
    border: 1px solid #eaeaea;
  }
  .title{
    text-align: center;
    padding-bottom: 15px;
  }
  label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
  }
  .check {
    width: 140px;
    float: left;
  }
  >>> .el-form-item__content {
    line-height: 0;
  }
</style>
