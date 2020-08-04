<template>
  <div class="pinformation">
    <h3>个人信息</h3><hr/>
    <el-card>
      <el-col :span="6">
        <el-upload
          class="avatar-uploader"
          action="http://182.92.149.135:8080/yiJu/user/updateHeader"
          accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG"
          :show-file-list="false"
          :with-credentials="true"
          :on-success="handleAvatarSuccess">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <span v-if="imageUrl" class="el-upload-action">
          <i class="el-icon-upload2"></i></span>
        </el-upload>
      </el-col>
      <el-col :span="18">
        <div class="information">
          <el-col :span="10"><b>用户ID&nbsp;:&nbsp;&nbsp;&nbsp;</b>{{myData.id}}</el-col>
          <el-col :span="14"><b>创建时间&nbsp;:&nbsp;</b>{{myData.createTime}}</el-col>
          <el-col :span="10"><b>用户姓名&nbsp;:&nbsp;</b>{{myData.userName}}</el-col>
          <el-col :span="14"><b>绑定邮箱&nbsp;:&nbsp;</b>{{myData.email}}</el-col>
        </div>
      </el-col>
    </el-card>
    <h3>修改密码</h3><hr/>
    <el-card>
      <el-input type="password" class="passwordinput" v-model="password" auto-complete="off" placeholder="新密码"></el-input>
      <br/>
      <el-input type="password" class="passwordinput" v-model="repassword" auto-complete="off"
                placeholder="再次核对"></el-input>
      <br/>
      <el-button type="primary" @click="submit">确定</el-button>
    </el-card>
  </div>
</template>
<script>
  export default {
    inject:['reload'],
    data() {
      return {
        myData: '',
        imageUrl: '',
        password: '',
        repassword: '',
      }
    },
    methods: {
      // 上传成功回调
      handleAvatarSuccess(response, file) {
        console.log(response);
        if (response.code === 200) {
          this.$message({
            type: 'success',
            message: '头像上传成功.'
          });
          this.reload();
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
        // this.imageUrl = res.data.url
      },
      // 修改密码
      submit() {
        // console.log(this.password);
        if (this.password === this.repassword) {
          this.$ajax.post("http://182.92.149.135:8080/yiJu/user/modifyPassword", this.password, {
            headers: {
              'Content-Type': 'application/json'
            },
          })
            .then(response => {
              console.log(response.data);
              if (response.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '密码修改成功,请重新登陆.'
                });
                this.$router.push('/')
              } else {
                this.$message({
                  type: 'error',
                  message: response.data.message
                })
              }
            })
        } else {
          this.$message({
            type : 'info',
            message : '两次密码不相同哦,请重新修改.',
          })
        }
      }
    },
    mounted(){
      this.$ajax.get("http://182.92.149.135:8080/yiJu/user/getCur")
        .then(response => {
          console.log(response.data);
          if (response.data.code === 200) {
            this.imageUrl = response.data.data.headerUrl;
            this.myData = response.data.data;
            this.myData.createTime = this.myData.createTime.substring(0, 10);
          }
        }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    },
  }
</script>

<style scoped>
  .pinformation {
    width: 60%;
    height: 95%;
    margin: 0 auto;
    padding: 5px 10px;
    background: white;
  }

  hr {
    width: 98%;
    color: #E0E3DA;
  }

  .avatar-uploader {
    width: 120PX;
    height: 120px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: rgba(0, 0, 0, .3);
    background-size: 100% 100%;
  }

  .avatar {
    position: relative;
    width: 120px;
    height: 120px;
    display: block;
  }

  .el-upload-action {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 0;
    color: #fff;
    text-align: center;
    line-height: 120px;
  }

  .el-upload-action:hover {
    font-size: 20px;
    background-color: #000;
    background-color: rgba(0, 0, 0, .3)
  }

  .passwordinput{
    width: 250px;
    padding: 5px 0;
  }
  .information{
    padding: 15px 0;
  }
  .information > .el-col{
    margin: 10px 0;
  }
  .el-button{
    width: 100px;
  }
  >>>.el-card {
    height: 170px;
  }
</style>
