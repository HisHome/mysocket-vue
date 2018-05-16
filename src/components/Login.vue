<template>
  <div class="hello" >
        <mt-header fixed :title=" userData && userData.username ? 'mySocket - ' + userData.username : 'mySocket' ">
            <mt-button slot="right" @click="loginOut">退出</mt-button>
        </mt-header>
        <div style="padding: 15px;" v-if="!userData || !userData.username">
            <mt-field label="用户名" placeholder="输入用户名" type="text" v-model="username"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" style="border-bottom: 1px solid #ececec;" type="password" v-model="password"></mt-field>
            <mt-button type="primary" style="width: 100%;margin-top:40px;" @click="getUserAndPassword" > 登录 </mt-button>
            <mt-button type="default" style="width: 100%;margin-top:10px;" @click="getUserAndPassword" > 注册 </mt-button>
        </div>
        <div style="padding: 10px;" v-if="userData && userData.username">
             <div style="padding-bottom: 66px;">
                <!--  -->
                <div style="border: 1px solid #ececec;height: 100%;">
                    <div v-for="(item, index) in dataList"  :key="index">
                        <mt-cell v-if="item.username != userData.username" :title=" item.username +': '+ item.msg " :key="index"></mt-cell>
                        <mt-cell v-else :key="index"> {{ item.msg +' : '+  item.username}} </mt-cell>
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
        }
      },
      created(){
        let data = localStorage.getItem('socketUser')
        if ( data ) {
            this.userData = JSON.parse(data)
        }
        this.io = io();
        console.log(this.io)
        this.io.on('addnews', (data)=>{
          this.dataList.push(data)
        })
      },
      methods: {
         getUserAndPassword(){
           if ( this.username && this.password ) {
             this.userData = {username: this.username, password: this.password}
             localStorage.setItem('socketUser', JSON.stringify(this.userData))
             this.username = '';
             this.password = '';
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
             username: this.userData.username,
             password: this.userData.password,
             msg: this.introduction,
           }
           this.io.emit('addnews', obj)
           this.introduction = ''
         },
         loginOut(){
           localStorage.removeItem('socketUser');
           this.userData = {};
         }
      }
    }
</script>
<style scoped>
    
</style>
