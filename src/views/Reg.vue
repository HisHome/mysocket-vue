<template>
  <div class="hello" >
        <mt-header fixed title=" 注册 "></mt-header>
        <div style="padding: 15px;">
            <div class="imgBox">
                <Upload  v-model="imgData" :name="'bankCardImg'" :data="{fileUsageType: 23}" />
            </div>
            <mt-field label="用户名" placeholder="输入用户名" type="text" v-model="username"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" style="border-bottom: 1px solid #ececec;" type="password" v-model="password"></mt-field>
            <router-link :to="{name:'Reg'}" >
                <mt-button type="primary" style="width: 100%;margin-top:40px;" @click="getUserAndPassword" > 注册并登录 </mt-button>
            </router-link>
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
          username: '',
          password: '',
          io: undefined,
          imgData: ''
        }
      },
      created(){
        let data = util.cookieGet('PY_SOCKET')
        if ( data ) {
             VueRouter.push({name: 'IndexPage'});
        }
        this.io = io();
        this.io.on('add user', (data)=>{
            if (data.username && data.username != this.isLoginName) {
                Toast({
                  message: `${data.username}已上线`,
                  position: 'top',
                  duration: 3000
                });
            }
        })
      },
      methods: {
         getUserAndPassword(type){
            if ( this.username && this.password ) {
                util.post('/apis/regUser', {username: this.username, password: this.password},  (data) => {
                    this.io.emit('add user', {username: this.username})
                })
            } else {
                Toast({
                    message: '用户名/密码不能为空',
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
    .imgBox{
        text-align: center;
        margin-bottom: 15px;
    }
    .imgHeader{
        display: inline-block;
        width: 140px;
        height: 140px;
        border-radius: 500px;
        border: 1px solid #ececec;
    }
</style>

