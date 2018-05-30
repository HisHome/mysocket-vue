<template>
  <div class="hello" >
        <mt-header fixed :title=" isLoginName ? 'mySocket - ' + isLoginName : 'mySocket' ">
            <mt-button slot="right" icon="more" @click="()=>{this.sheetVisible = true}"></mt-button>
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
        <mt-actionsheet
            :actions="[{name:'个人信息',method: linkTo},{name:'退出',method: loginOut}]"
            v-model="sheetVisible">
        </mt-actionsheet>
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
          username: '',
          password: '',
          userData: {},
          introduction: '',
          io: undefined,
          dataList: [],
          isLoginName: '',
          sheetVisible: false,
        }
      },
      created(){
        let data = util.cookieGet('PY_SOCKET')
        if ( data ) {
            this.isLoginName = decodeURI(data);
            this.getHistory();
        }
        this.io = io();
        this.io.on('addChatInfo', (data)=>{
            this.getHistory();
        })
        this.io.on('add user', (data)=>{
            if (data.username && data.username != this.isLoginName) {
                Toast({
                  message: `${data.username}已上线`,
                  position: 'top',
                  duration: 3000
                });
            }
        })
        this.io.on('user left', (data)=>{
            if (data.username && data.username != this.isLoginName) {
                Toast({
                  message: `${data.username}已离开`,
                  position: 'top',
                  duration: 3000
                });
            }
        })
        this.getAllusers()
      },
      methods: {
          getAllusers() {
              util.post('/apis/searchUsers', {}, (data) => {
                  if (data.code != 200) {
                      Toast({
                          message: '查询数据失败',
                          position: 'top',
                          duration: 2000
                      });
                  }
              })
          },
          getHistory() {
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
                    this.getHistory();
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
                this.io.emit('user left', {
                    username: this.isLoginName
                });
                this.username = ''
                this.isLoginName = ''
                VueRouter.push({name: 'Login'});
           })
         },
         linkTo(){
            VueRouter.push({name: 'PersonInfo'});
         }
      }
    }
</script>
<style scoped>
    
</style>
