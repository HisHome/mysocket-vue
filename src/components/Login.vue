<template>
  <div class="hello" >
        <mt-header fixed title="mySocket"></mt-header>
        <div style="padding: 15px;" v-if="!userData">
            <mt-field label="用户名" placeholder="输入用户名" type="text" v-model="username"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" style="border-bottom: 1px solid #ececec;" type="password" v-model="password"></mt-field>
            <mt-button type="primary" style="width: 100%;margin-top:40px;" @click="getUserAndPassword" > 登录 </mt-button>
            <mt-button type="default" style="width: 100%;margin-top:10px;" @click="getUserAndPassword" > 注册 </mt-button>
        </div>
        <div style="padding: 10px;">
             <div style="padding-bottom: 66px;">
                <mt-cell v-for="(n,index) in 10" :title="'tab-container'+ index" :key="index"></mt-cell>
             </div>
             <mt-tabbar fixed>
                <mt-tab-item style="padding:0;">
                  <div style="height:50px;">
                      <mt-field placeholder="自我介绍" type="textarea" rows="1" v-modal="introduction">
                          <mt-button type="primary">发送</mt-button>
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
          userData: undefined,
          introduction: ''
        }
      },
      created(){
        let data = localStorage.getItem('socketUser')
        if ( data ) {
            this.userData = JSON.parse(data)
        }
      },
      methods: {
         getUserAndPassword(){
           if ( this.username && this.password ) {
             this.userData = {username: this.username, password: this.password}
             localStorage.setItem('socketUser', JSON.stringify(this.userData))
           } else {
               Toast({
                  message: '用户名/密码不能为空',
                  position: 'top',
                  duration: 5000
                });
           }
         },
      }
    }
</script>
<style scoped>
    
</style>
