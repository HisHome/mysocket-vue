<template>
  <div class="upload" @click="upload">
    <span class="plus"> + </span>
    <input type="file" class="hidden" :ref="name" >
    <img class="img_show" v-if="imgUrl" :src="imgUrl" :alt="fileKey">
  </div>
</template>
<script>
  import util from '@/public/util';
  import { Toast } from 'mint-ui';
  export default {
    name: 'upload',
    data () {
      return {
        imgUrl: '',
        fileKey: ''
      };
    },
    watch: {},
    props: {
      value: String,
      name: String,
      data: Object,
      action: String
    },
    created () {},
    methods: {
      upload (data) {
        let slef = this;
        this.$refs[this.name].onchange = function (e) {
          slef.fileUpload(e.target.files[0]);
        };
        this.$refs[this.name].click();
      },
      beforeUpload(file) {
        const fileNames = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'tif'];
        const isType = fileNames.indexOf(file.name.toLocaleLowerCase().replace(/^(\w|[u4e00-u9fa5]*).*(?:\.)/, ''));
        if (isType < 0) {
            Toast({
                message: '上传的文件不是图片!',
                position: 'top',
                duration: 2000
            });
        }
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
            Toast({
                message: '上传的文件不能超过1MB!',
                position: 'top',
                duration: 2000
            });
        }
        return isType >= 0 && isLt1M;
      },
      fileUpload(file) {
        if (!this.beforeUpload(file)) {
          return;
        }
        let self = this;
        let xhr = new XMLHttpRequest();
        let fileForm = new FormData();
        // fileForm.append('fileUsageType', self.data['fileUsageType']);
        fileForm.append('fulAvatar', file);
        xhr.open('POST', '/apis/uploadImg');
        xhr.onload = function (data) {
          let response = JSON.parse(data.currentTarget.response);
          console.log(response)
          if (response.code === 200) {
            self.imgUrl = '/apis'+response.result;
            self.$emit('input', response.result);
          } else {
            Toast({
                message: `${response.message}`,
                position: 'top',
                duration: 2000
            });
          }
        };
        xhr.error = function (data) {
        //   this.$Message.error('上传失败');
          Toast({
                message: `上传失败`,
                position: 'top',
                duration: 2000
            });
        };
        xhr.send(fileForm);
      }
    }
  };
</script>
<style scoped>
    .hidden{
        display: none;
    }
    .upload{
        position: relative;
        text-align: center;
        border: 1px solid #d7dde4;
        border-radius: 500px;
        width: 140px;
        height: 140px;
        display: inline-block;
        overflow: hidden;
    }
    .img_show{
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 2;
        border: none;
    }
    .upload:hover{
        border-color: #3e76f6;
        color: #3e76f6;
        cursor: pointer;
    }
   .plus{
       position: absolute;
      left: 50%;
      top:50%;
      font-size: 30px;
      margin-top: -22px;
      margin-left: -8px;
      z-index: 2;
   }
</style>

