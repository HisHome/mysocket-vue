<template>
  <div class="hello" >
        <mt-header fixed title=" 个人信息 ">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <div style="padding: 15px;text-align:center;">
            <div class="img_box">
                <img v-if="userData.headerImg" :src="userData.headerImg" alt="">
            </div>
            <div style="padding-top:20px;">
                <mt-button type="primary">用户名:{{userData.user}}</mt-button>
            </div>
        </div>
  </div>
</template>
<script>
    import { Toast } from 'mint-ui';
    import util from '@/public/util';
    import VueRouter from '@/router/index.js';
    import Upload from '@/views/Upload';
    export default {
      name: 'HelloWorld',
      data () {
        return {
          userData: {},
          io: undefined,
        }
      },
      created(){
        let data = util.cookieGet('PY_SOCKET')
        if ( !data ) {
             VueRouter.push({name: 'Login'});
        }
        if (this.$route.query.user) {
            this.getUserAndPwd({user: this.$route.query.user})
        } else {
            this.getUserAndPwd()
        }
        this.io = io();
        this.io.on('add user', (data)=>{
            if (data.user && data.user != this.user) {
                Toast({
                  message: `${data.user}已上线`,
                  position: 'top',
                  duration: 3000
                });
            }
        })
      },
      methods: {
         getUserAndPwd(obj){
            obj = obj || {}
            util.post('/apis/getUserInfo', obj,  (data) => {
                this.userData = data.result
            })
         },
      },
      components: {
          Upload
      }
    }
</script>
<style  scoped>
    .img_box{
        display: inline-block;
        width: 160px;
        height:160px;
        overflow: hidden;
        border-radius: 500px;
        border: 1px solid #ececec;
    }
    .img_box img{
        width: 100%;
        height: 100%;
    }
</style>

