<template>
  <div class="aShuffling">
    <h3>轮播图设置</h3><hr/>
    <el-card>
      <div>
        <el-upload
          class="avatar-uploader room"
          action="http://182.92.149.135:8080/yiJu/homePagePicture/upload?index=1"
          accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG"
          :show-file-list="false"
          :with-credentials="true"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl[0]" :src="imageUrl[0]" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-upload
          class="avatar-uploader room"
          action="http://182.92.149.135:8080/yiJu/homePagePicture/upload?index=2"
          accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG"
          :show-file-list="false"
          :with-credentials="true"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl[1]" :src="imageUrl[1]" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-upload
          class="avatar-uploader room"
          action="http://182.92.149.135:8080/yiJu/homePagePicture/upload?index=3"
          accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG"
          :show-file-list="false"
          :with-credentials="true"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl[2]" :src="imageUrl[2]" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-upload
          class="avatar-uploader room"
          action="http://182.92.149.135:8080/yiJu/homePagePicture/upload?index=4"
          accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG"
          :show-file-list="false"
          :with-credentials="true"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl[3]" :src="imageUrl[3]" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-upload
          style="float: left"
          class="avatar-uploader"
          action="http://182.92.149.135:8080/yiJu/homePagePicture/upload?index=5"
          accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG"
          :show-file-list="false"
          :with-credentials="true"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl[4]" :src="imageUrl[4]" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-col :span="2"></el-col>
      </div>
    </el-card>
  </div>
</template>
<script>
  export default {
    inject:['reload'],
    data() {
      return {
        imageUrl:'',
      }
    },
    methods: {
      // 移除图片
      handleRemove() {
        this.imageUrl = ''
      },
      // 上传成功回调
      handleAvatarSuccess(response, file) {
        console.log(response);
        if (response.code === 200) {
          this.$message({
            type: 'success',
            message: '轮播图上传成功.'
          });
          this.reload();
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      },
    },
    mounted(){
      this.$ajax.get("http://182.92.149.135:8080/yiJu/homePagePicture/getHomePagePictures")
        .then(response => {
          console.log(response.data);
          this.imageUrl = [];
          for (let x = 0 ; x < 5 ; x++){
            if (response.data.data[x] === undefined){
              this.imageUrl[x] = '';
            } else {
              this.imageUrl[x] = response.data.data[x];
            }
          }
          console.log(this.imageUrl)
        }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    },
  }
</script>

<style scoped>
  h3 {
    margin-left: 5px;
  }
  hr {
    width: 98%;
    color: #E0E3DA;
  }
  .aShuffling {
    width: 75%;
    height: 60%;
    margin: 70px auto;
    padding: 5px 10px;
    background: white;
  }
  .room{
    float: left;
    margin-right: 5px;
  }
  >>>.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  >>>.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 157px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 157px;
    height: 120px;
    display: block;
    margin: 0 auto;
    padding: 0 auto;
  }
  >>>.el-card{
    height: 170px;
  }
</style>
