<template>
  <div class="hello" >
        <mt-header fixed title=" 登录 "></mt-header>
        <div style="padding: 15px;">
            <mt-field label="用户名" placeholder="输入用户名" type="text" v-model="user"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" style="border-bottom: 1px solid #ececec;" type="password" v-model="pwd"></mt-field>
            <mt-button type="primary" style="width: 100%;margin-top:40px;" @click="getUserAndPwd" > 登录 </mt-button>
            <router-link :to="{name:'Reg'}" >
                <mt-button type="default" style="width: 100%;margin-top:10px;" > 注册 </mt-button>
            </router-link>
        </div>
  </div>
</template>
<script>
    import { Toast } from 'mint-ui';
    import util from '@/public/util';
    import VueRouter from '@/router/index.js';
    export default {
      name: 'HelloWorld',
      data () {
        return {
          user: '',
          pwd: '',
          io: undefined,
        }
      },
      created(){
        let data = util.cookieGet('PY_SOCKET')
        if ( data ) {
            VueRouter.push({name: 'IndexPage'});
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
            if ( this.user && this.pwd ) {
                util.post('/apis/login', {user: this.user, pwd: this.pwd},  (data) => {
                    this.io.emit('add user', { user: this.user });
                    VueRouter.push({name: 'IndexPage'});
                })
            } else {
                Toast({
                    message: '用户名/密码不能为空',
                    position: 'top',
                    duration: 2000
                });
            }
         }
      }
    }
</script>
<style >
    .hello .mint-header-title{
        font-size: 18px;
    }
</style>
