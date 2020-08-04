<template>
  <div class="push">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="房屋地址">
        <el-select v-model="form.city" :visible-change="getAllCity()" placeholder="请选择"  style="width: 90px">
          <el-option
            v-for="item in cities"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="form.address" style="width:76%"></el-input>
      </el-form-item>
      <el-form-item label="房屋信息">
        <el-col :span="2">小区</el-col>
        <el-col :span="10">
          <el-input v-model="form.community" style="width:80%"></el-input>
        </el-col>
        <el-col :span="2">楼层</el-col>
        <el-col :span="10">
          <el-input v-model="form.storey" style="width:80%"></el-input>
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
          :with-credentials="true"
          multiple
          :action="uploadUrl"
          :file-list="fileList"
          :on-remove="handleRemove"
          :on-preview="handlePreview"
          :on-success="handleAvatarSuccess">
          <el-button size="small" type="primary">图片上传</el-button>
          <span slot="tip" class="el-upload__tip" style="margin-left: 10px">(只能上传jpg/png文件,且不超过500kb)</span>
        </el-upload>
      </el-form-item>
        <div class="btn"><el-button type="primary" @click="submit">确定上传</el-button></div>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        result:'',
        fileList: [],
        uploadUrl: '',
        form: {
          city: '',
          address: '',
          area: '',
          community: '',
          decoration: '0',
          description: '',
          direction: '0',
          layout: '',
          price: '',
          storey: '',
          years: ''
        },
        cities: [],
      }
    },
    methods: {
      submit() {
        this.$ajax.post('http://182.92.149.135:8080/yiJu/house/add', {
          "city":this.form.city,
          "area":this.form.area * 1,
          "layout":this.form.layout,
          "address":this.form.address,
          "community":this.form.community,
          "description":this.form.description,
          "years":this.form.years + '-01-01 00:00:00',
          "price":parseInt(this.form.price),
          "storey":parseInt(this.form.storey),
          "direction":parseInt(this.form.direction),
          "decoration":parseInt(this.form.decoration),
        })
          .then(response => {
            this.result = response.data;
            console.log(this.result);
            if (this.result.code === 200) {
               this.$message({
                 type : 'success',
                 message : '房屋信息上传成功.'
               })
            } else {
              this.$message({
                type : 'error',
                message : '上传失败请等待后重新尝试!'
              })
            }
            this.uploadUrl = 'http://182.92.149.135:8080/yiJu/house/upload?houseId=' + this.result.data;
            this.$nextTick(() => {
              this.$refs.upload.submit(response=>{
                console.log(response.data)
              })
            });
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
          });
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleAvatarSuccess(response) {
        console.log(response);
        if (response.code === 200){
          this.$message({
            type : 'success',
            message : '房屋图片上传成功.'
          })
        } else {
          this.$message({
            type : 'error',
            message : '上传失败请等待后重新尝试!'
          })
        }
      },
      getAllCity(){
        let address = ['北京','上海','广州','深圳','天津','杭州','成都','武汉','长沙','苏州','南京','大连','沈阳','郑州','西安','宁波','济南','青岛','东莞'];
        for (let x = 0 ; x < address.length ; x++){
          this.cities[x] = {value:address[x], label:address[x]}
        }
      }
    },
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

  .btn{
    text-align: center;
    margin-bottom: 10px;
  }
</style>
