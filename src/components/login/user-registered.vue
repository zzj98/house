<template>
  <div class="login-container">
    <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-position="left"
             class="demo-ruleForm login-page">
      <el-form-item prop="email">
        <el-input type="text" v-model="ruleForm.email" auto-complete="off" placeholder="邮箱号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item prop="repassword">
        <el-input type="password" v-model="ruleForm.repassword" auto-complete="off" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input type="name" v-model="ruleForm.name" auto-complete="off" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item prop="identity">
        <el-radio v-model="radio" label="1">用户</el-radio>
        <el-radio v-model="radio" label="2">发布者</el-radio>
      </el-form-item>
      <el-form-item prop="check">
        <div>
          <el-input type="text" v-model="ruleForm.check" class="check" auto-complete="off"
                    placeholder="验证码"></el-input>
        </div>
        <div>
          <img @click="editCaptcha" :src="img[0].src">
        </div>
      </el-form-item>
      <el-link type="primary" class="style1" @click="send()" :underline="false">登录账号</el-link>
      <el-link type="primary" class="style1" style="float: right" @click="sendf()" :underline="false">忘记密码</el-link>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">注 册</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      let email = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('邮箱不能为空哦！'));
        } else {
          const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('您的邮箱格式不正确，请输入正确的邮箱！'));
          }
        }
      };
      let equal = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请重新输入密码以便核对！'));
        } else {
          if (this.ruleForm.password !== this.ruleForm.repassword) {
            return callback(new Error('您输入的两次密码不相同，请重新输入！'));
          } else {
            return callback();
          }
        }
      };
      return {
        logining: false,
        result:'',
        radio: '1',
        bounced: 0,
        ruleForm: {
          email: '',
          password: '',
          repassword: '',
          name: '',
          check: '',
        },
        rules: {
          email: [{required: true, validator: email, trigger: 'blur'}],
          password: [{required: true, message: '密码不能为空哦！', trigger: 'blur'}],
          repassword: [{required: true, validator: equal, trigger: 'blur'}],
          name: [{required: true, message: '姓名不能为空哦！', trigger: 'blur'}],
          check: [{required: true, message: '验证码不能为空哦！', trigger: 'blur'}],
        },
        img: [{src: 'http://182.92.149.135:8080/yiJu/user/kaptcha'}],
      };
    },
    methods: {
      send(){
        this.$emit('sendb',0);
      },
      sendf(){
        this.$emit('sendb',2);
      },
      handleSubmit() {
        if(this.ruleForm.email !== '' & this.ruleForm.name !== '' & this.ruleForm.password !== '' & this.ruleForm.repassword !== '' && this.ruleForm.check !== ''){
          this.$ajax.post('http://182.92.149.135:8080/yiJu/user/register?userCode='+this.ruleForm.check, {
            "email": this.ruleForm.email,
            "password": this.ruleForm.password,
            "userName": this.ruleForm.name,
            "type":parseInt(this.radio),
          })
            .then(response => {
              this.result = response.data;
              this.$alert(this.result.message, '提示', {
                confirmButtonText: '确定'
              }).then((action) => {
                if (this.result.code === 200){
                  this.$emit('sendb',0);
                  // console.log("bounced")
                }
                this.editCaptcha();
              });
              console.log(this.result)
            })
            .catch(function (error) { // 请求失败处理
              console.log(error);
            });
        }else {
          this.$alert('请填写全部内容!', '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      editCaptcha() {
        let num = Math.ceil(Math.random() * 100);//生成一个随机数（防止缓存）
        this.img[0].src = 'http://182.92.149.135:8080/yiJu/user/kaptcha?'+ num;
      },
    },
    mounted(){
      this.editCaptcha();
    }
  };
</script>

<style scoped>
  .check {
    width: 140px;
    float: left;
  }

  .style1 {
    margin: 0 0 15px;
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
