<template>
  <div class="push">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="房屋地址">
        <el-input v-model="form.city" style="width:90px" disabled></el-input>
        <el-input v-model="form.address" style="width:76%" disabled></el-input>
      </el-form-item>
      <el-form-item label="房屋信息">
        <el-col :span="2">小区</el-col>
        <el-col :span="10">
          <el-input v-model="form.community" style="width:80%" disabled></el-input>
        </el-col>
        <el-col :span="2">楼层</el-col>
        <el-col :span="10">
          <el-input v-model="form.storey" style="width:80%" disabled></el-input>
        </el-col>
        <br/>
      </el-form-item>
      <el-form-item>
        <el-col :span="2">年份</el-col>
        <el-col :span="10">
          <el-input v-model="form.years" style="width:80%"></el-input>
        </el-col>
        <el-col :span="2">户型</el-col>
        <el-col :span="10">
          <el-input v-model="form.layout" style="width:80%"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="2">面积</el-col>
        <el-col :span="10">
          <el-input v-model="form.area" style="width:80%"></el-input>&nbsp;&nbsp;m&sup2
        </el-col>
        <el-col :span="2">价格</el-col>
        <el-col :span="10">
          <el-input v-model="form.price" style="width:80%"></el-input>&nbsp;&nbsp;万
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="2">朝向</el-col>
        <el-col :span="10">
          <el-radio v-model="form.direction" label="0">南北向</el-radio>
          <el-radio v-model="form.direction" label="1">东西向</el-radio>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="2">装修</el-col>
        <el-col :span="14">
          <el-radio v-model="form.decoration" label="0">毛坯房</el-radio>
          <el-radio v-model="form.decoration" label="1">简装</el-radio>
          <el-radio v-model="form.decoration" label="2">精装</el-radio>
        </el-col>
      </el-form-item>
      <el-form-item label="房屋介绍">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload
          ref="upload"
          name="files"
          accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG"
          class="upload-demo"
          list-type="picture"
          :auto-upload="false"
          with-credentials="true"
          multiple
          :action="uploadUrl"
          :file-list="fileList"
          :on-preview="handlePreview"
          :before-upload="onChangeUpload"
          :before-remove="handleBRemove"
          :on-success="handleAvatarSuccess"
          :on-change="handlechange">
          <el-button size="small" type="primary">图片上传</el-button>
          <span slot="tip" class="el-upload__tip" style="margin-left: 10px">(只能上传jpg/png文件,且不超过500kb)</span>
        </el-upload>
      </el-form-item>
      <div class="btn">
        <el-button type="primary" @click="submitAll">确定上传</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        flag: true,
        fileList: [],
        fileListbackup: [],
        uploadUrl: '',
        form: {},
        formbackup: {},
      }
    },
    mounted() {
      this.$ajax.get('http://182.92.149.135:8080/yiJu/house/getDetail/' + this.houseID + '?flag=true')
        .then(response => {
          response.data.data.house.direction += "";
          response.data.data.house.decoration += "";
          response.data.data.house.years = response.data.data.house.years.substring(0, 4);
          this.form = JSON.parse(JSON.stringify(response.data.data.house));
          this.formbackup = JSON.parse(JSON.stringify(response.data.data.house));
          this.fileList = JSON.parse(JSON.stringify(response.data.data.houseImages));
          this.fileListbackup = JSON.parse(JSON.stringify(response.data.data.houseImages));
          for (let x = 0; x < this.fileList.length; x++) {
            this.fileList[x] = {name: this.fileList[x].slice(-36), url: this.fileList[x]}
          }
          console.log(this.fileList);
        })
        .catch(function (error) { // 请求失败处理
          console.log(error);
        });
    },
    methods: {
      submitAll() {
        this.uploadImg();
        console.log(this.fileList)
        if (this.flag) {
          this.submitWord()
        }
      },
      uploadImg() {
        //图片修改上传
        this.uploadUrl = 'http://182.92.149.135:8080/yiJu/house/upload?houseId=' + this.houseID;
        this.$nextTick(() => {
          this.$refs.upload.submit()
        });
      },
      submitWord() {
        // console.log("3",JSON.stringify(this.fileList) === JSON.stringify(this.fileListbackup) && this.flag);
        console.log(this.form !== this.formbackup);
        if (!(JSON.stringify(this.form) === JSON.stringify(this.formbackup) && this.flag)) {
          this.$ajax.post('http://182.92.149.135:8080/yiJu/house/update', {
            "id": this.houseID,
            "city":this.form.city,
            "layout": this.form.layout,
            "address": this.form.address,
            "community": this.form.community,
            "description": this.form.description,
            "years": this.form.years + '-01-01 00:00:00',
            "area": this.form.area * 1,
            "price": this.form.price * 1,
            "storey": this.form.storey * 1,
            "direction": this.form.direction * 1,
            "decoration": this.form.decoration * 1,
          }).then(response => {
            console.log(response.data);
            if (response.data.code === 200) {
              this.$emit('closec', false);
              this.$message({
                type: 'success',
                message: '修改成功,请等待审核.',
              });
            } else {
              this.$message({
                type: 'warn',
                message: response.data.message
              })
            }
            this.form = {};
          })
            .catch(function (error) { // 请求失败处理
              console.log(error);
            });
        } else {
          this.$message({
            type: 'info',
            message: '信息尚未修改!!!',
          })
        }
      },
      handleBRemove(file, fileList){
        console.log(file,fileList);
        this.$confirm('您是否要从展示列表中删除该图片?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleRemove(file, fileList);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        return false;
      },
      handleRemove(file, fileList) {
        console.log(file.url, fileList);
        this.$ajax.post("http://182.92.149.135:8080/yiJu/images/delete/" + this.houseID, [file.url + ''])
          .then(response => {
          console.log(response.data);
          this.$message({
            type: 'success',
            message: '图片删除成功'
          });
         }).then(() => {
          for (let x = 0 ; x < fileList.length ; x++){
            if (fileList[x].url === file.url){
              fileList.splice(x,1);
            }
          }
        })
        },
      handlePreview(file) {
        console.log(file);
      },
      onChangeUpload(file, fileList) {
        let a = 0;
        // fileList.forEach((item, idx) => {
        //   if (file.name === item.name) {
        //     a++;
        //     if (a === 2) {
        //       this.$message({
        //         message: '文件名不能重复',
        //         type: 'info'
        //       });
        //       fileList.splice(idx, 1)
        //     }
        //   }
        // })
      },
      handleAvatarSuccess(response) {
        console.log(response);
        this.flag = false;
        this.submitWord()
      },
      handlechange(file, fileList){
        console.log('file',file);
        console.log('fileList',fileList);
        console.log();
        if (JSON.stringify(fileList) !== JSON.stringify(this.fileList)){
          this.flag = false;
        }
      }
    },
    props: ['houseID'],
  }
</script>
<style scoped>
  .push {
    width: 50%;
    background: #fff;
    min-width: 500px;
    margin: 0 auto;
    padding: 15px 15px 7px;
    /*border: 1px solid #272727;*/
    border-radius: 15px;
  }

  >>> .el-switch__core {
    margin-top: 10px;
  }

  .btn {
    text-align: center;
    margin-bottom: 10px;
  }
</style>
