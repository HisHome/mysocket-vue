<template>
  <div class="hello" >
        xxxxxxx个人信息
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
        }
      },
      created(){
        let data = util.cookieGet('PY_SOCKET')
        if ( data ) {
            this.isLoginName = decodeURI(data);
            this.getHistory();
        } else {
                  VueRouter.push({name: 'Login'});
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
                this.isLoginName = ''
                this.username = ''
           })
         }
      }
    }
</script>
<style scoped>
    
</style>
