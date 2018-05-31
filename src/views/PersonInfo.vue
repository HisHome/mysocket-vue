<template>
  <div class="hello" >
        <mt-header fixed title=" 个人信息 ">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <div style="padding: 15px;">
            xxxxx等待添加
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
          user: '',
          pwd: '',
          io: undefined,
          imgData: ''
        }
      },
      created(){
        let data = util.cookieGet('PY_SOCKET')
        if ( !data ) {
             VueRouter.push({name: 'Login'});
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
         getUserAndPwd(type){
            if ( this.user && this.pwd && this.imgData ) {
                util.post('/apis/regUser', {user: this.user, pwd: this.pwd, headerImg: this.imgData },  (data) => {
                    this.io.emit('add user', {user: this.user})
                    VueRouter.push({name: 'IndexPage'});
                })
            } else {
                Toast({
                    message: '用户名/密码/头像不能为空',
                    position: 'top',
                    duration: 2000
                });
            }
         },
      },
      components: {
          Upload
      }
    }
</script>
<style  scoped>
    
</style>

