<template>
  <div class="login-container">
    <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-position="left" class="demo-ruleForm login-page">
      <el-form-item prop="email">
        <el-input type="text" v-model="ruleForm.email" auto-complete="off" placeholder="邮箱号"></el-input>
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
      <el-link type="primary" class="style1" @click="sendf()" :underline="false">忘记账号</el-link>
      <el-link type="primary" class="style1" style="float: right" @click="sendr()" :underline="false">注册账号</el-link>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">登 录</el-button>
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
        rules: {
          email: [{required: true, validator: email, trigger: 'blur'}],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
          check: [{required: true, message: '验证码不能为空', trigger: 'blur'}],
        },
        ruleForm: {
          email: '',
          password: '',
          check: '',
        },
        img: [{src: 'http://182.92.149.135:8080/yiJu/user/kaptcha'}],
      }
    },
    methods: {
      sendf(){
        this.$emit('sendb',2);
        // console.log("send")
      },
      sendr(){
        this.$emit('sendb',1);
        // console.log("send")
      },
      handleSubmit(){
        this.$ajax.post('http://182.92.149.135:8080/yiJu/user/login?userCode='+this.ruleForm.check, {
          "email": this.ruleForm.email,
          "password": this.ruleForm.password,
        })
          .then(response => {
            this.result = response.data;
            this.$alert(this.result.message, '提示', {
              confirmButtonText: '确定'
            }).then((action) => {
              console.log(this.result.code);
              if (this.result.code === 200){
                this.$emit('func',false);
              }
              this.editCaptcha();
            });
            // console.log(this.result)
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
