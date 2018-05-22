<template>
  <div class="hello" >
        <mt-header fixed :title=" isLoginName ? 'mySocket - ' + isLoginName : 'mySocket' ">
            <mt-button slot="right" @click="loginOut">退出</mt-button>
        </mt-header>
        <div style="padding: 15px;" v-if="!isLoginName">
            <mt-field label="用户名" placeholder="输入用户名" type="text" v-model="username"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" style="border-bottom: 1px solid #ececec;" type="password" v-model="password"></mt-field>
            <mt-button type="primary" style="width: 100%;margin-top:40px;" @click="getUserAndPassword" > 登录 </mt-button>
            <mt-button type="default" style="width: 100%;margin-top:10px;" @click="getUserAndPassword('reg')" > 注册 </mt-button>
        </div>
        <div style="padding: 10px;" v-if="isLoginName">
             <div style="padding-bottom: 66px;">
                <div style="border: 1px solid #ececec;height: 100%;">
                    <div v-for="(item, index) in dataList"  :key="index">
                        <mt-cell v-if="item.username != isLoginName" :title=" item.username +': '+ item.introduction " :key="index"></mt-cell>
                        <mt-cell v-else :key="index"> {{ item.introduction +' : '+  item.username}} </mt-cell>
                    </div>
                </div>
             </div>
             <mt-tabbar fixed>
                <mt-tab-item style="padding:0;">
                  <div style="height:50px;">
                      <mt-field placeholder="输入内容" type="textarea" rows="1" v-model="introduction">
                          <mt-button type="primary" @click="sendMsg">发送</mt-button>
                      </mt-field>
                  </div>
                </mt-tab-item>
              </mt-tabbar>
        </div>
  </div>
</template>
<script>
    import { Toast } from 'mint-ui';
    import util from '@/public/util';
    export default {
      name: 'HelloWorld',
      data () {
        return {
          username: '',
          password: '',
          userData: {},
          introduction: '',
          io: undefined,
          dataList: [],
          isLoginName: '',
        }
      },
      created(){
        let data = util.cookieGet('PY_SOCKET')
        if ( data ) {
            this.isLoginName = data;
            this.getMongoDB();
        }
        this.io = io();
        this.io.on('addChatInfo', (data)=>{
          this.getMongoDB();
        })
        this.io.on('add user', (data)=>{
          if (data.username && data.username != this.username) {
            Toast({
              message: `${data.username}已上线`,
              position: 'top',
              duration: 3000
            });
          }
        })
        this.io.on('user left', (data)=>{
          if (data.username && data.username != this.username) {
            Toast({
              message: `${data.username}已离开`,
              position: 'top',
              duration: 3000
            });
          }
        })
      },
      methods: {
          getMongoDB() {
            util.post('/apis/searchHistory', {}, (data) => {
              if (data.code == 200) {
                if (data.result && data.result.length) {
                  this.dataList = data.result;
                }
              } else {
                Toast({
                    message: '查询数据失败',
                    position: 'top',
                    duration: 2000
                  });
              }
            })
          },
         getUserAndPassword(type){
            if ( this.username && this.password ) {
                let strUrl = '/apis/login';
                if (type == 'reg' ) strUrl = '/apis/regUser';
                util.post(strUrl, {username: this.username, password: this.password},  (data) => {
                    this.isLoginName = this.username;
                    this.getMongoDB();
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
         sendMsg(){
           let obj = {
             username: this.isLoginName,
             introduction: this.introduction,
           }
           util.post('/apis/addChatInfo', obj, ()=>{
                this.introduction = ''
                this.io.emit('addChatInfo')
           })
         },
         loginOut(){
           util.post('/apis/logout', {}, ()=>{
                this.isLoginName = ''
                this.io.emit('user left', {
                  username: this.isLoginName
                });
           })
         }
      }
    }
</script>
<style scoped>
    
</style>
