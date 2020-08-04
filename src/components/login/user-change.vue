<template>
  <div class="login-container">
    <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-position="left" class="demo-ruleForm">
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="新密码"></el-input>
      </el-form-item>
      <el-form-item prop="repassword">
          <el-input type="password" v-model="ruleForm.repassword" auto-complete="off" placeholder="确认密码"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="btn" @click="handleSubmit" :loading="logining">确 定</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
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
        result: '',
        logining: false,
        rules: {
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
          repassword: [{required: true, validator: equal, trigger: 'blur'}],
        },
        ruleForm: {
          password: '',
          repassword: '',
        },
      }
    },
    methods: {
      handleSubmit(){
        if (this.ruleForm.password === this.ruleForm.repassword){
          this.$ajax.post('http://182.92.149.135:8080/yiJu/user/reSetPassword',this.ruleForm.password, {
            headers: {
              'Content-Type': 'application/json'
            },
          })
            .then(response => {
              this.result = response.data;
              console.log(this.result);
              if (this.result.code === 200){
                this.$message({
                  type : 'success',
                  message : '密码修改成功,请重新登陆.'
                });
                this.$emit('func',false);
              } else {
                this.$message({
                  type : 'error',
                  message : this.result.message
                });
              }
            })
            .catch(function (error) { // 请求失败处理
              console.log(error);
            });
        } else {
          this.$message({
            type : 'error',
            message : '两次密码不一致请重新输入!'
          });
        }
      },
    },
  };
</script>

<style scoped>
  .style1 {
    margin: 0 0 15px;
  }
  .btn {
    width: 100%;
    margin-top: 20px;
  }
</style>
