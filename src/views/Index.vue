<template>
  <div class="hello" >
        <mt-header fixed :title=" userData.user ? 'mySocket - ' + userData.user : 'mySocket' ">
            <mt-button slot="right" icon="more" @click="()=>{this.sheetVisible = true}"></mt-button>
        </mt-header>
        <div style="padding: 10px;">
             <div style="padding-bottom: 66px;">
                <div style="border: 1px solid #ececec;height: 100%;">
                    <div v-for="(item, index) in dataList"  :key="index" style="padding: 6px;" >
                        <!-- 别人 -->
                        <div v-if="item.user != userData.user" :key="index" class="other_msg">
                            <div class="img_left_header_box">
                                <img v-if="item.headerImg" :src="item.headerImg" alt="">
                                <div class="no_header_img" v-else >暂无<br />头像</div>
                            </div>
                            <div>
                                <div class="name_title_left">{{item.user || '未知'}}</div>  
                                <div class="content_left"> {{item.introduction}} </div>
                            </div>
                        </div>
                        <!-- 自己 -->
                        <div v-else :key="index" class="my_msg">
                            <div class="img_right_header_box">
                                <img v-if="item.headerImg" :src="item.headerImg" alt="">
                                <div class="no_header_img" v-else >暂无<br />头像</div>
                            </div>
                            <div>
                                <div class="name_title_right">{{item.user || "未知"}}</div>  
                                <div class="content_right">
                                    <div class="content_right_info"> {{item.introduction}} </div>
                                </div>
                            </div>
                        </div>
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
          userData: {},
          introduction: '',
          io: undefined,
          dataList: [],
          sheetVisible: false,
        }
      },
      created(){
        let data = util.cookieGet('PY_SOCKET')
        if ( data ) {
            // this.userData.user = decodeURI(data);
            this.getHistory();
            this.getUserInfo();
        } else {
            // VueRouter.push({name: 'Login', query: {taskId: 1233}});
            VueRouter.push({name: 'Login'});
        }
        this.io = io();
        this.io.on('addChatInfo', (data)=>{
            this.getHistory();
        })
        this.io.on('add user', (data)=>{
            if (data.user && data.user != this.userData.user) {
                Toast({
                  message: `${data.user}已上线`,
                  position: 'top',
                  duration: 3000
                });
            }
        })
        this.io.on('user left', (data)=>{
            if (data.user && data.user != this.userData.user) {
                Toast({
                  message: `${data.user}已离开`,
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
         sendMsg(){
            let obj = {
                user: this.userData.user,
                introduction: this.introduction,
                headerImg: this.userData.headerImg
            }
            console.log(obj);
            util.post('/apis/addChatInfo', obj, ()=>{
                this.introduction = ''
                this.io.emit('addChatInfo')
            })
         },
         loginOut(){
           util.post('/apis/logout', {}, ()=>{
                this.io.emit('user left', {
                    user: this.userData.user
                });
                VueRouter.push({name: 'Login'});
           })
         },
         linkTo(){
            VueRouter.push({name: 'PersonInfo'});
         },
         getUserInfo(){
             util.post('/apis/getUserInfo',{},(data)=>{
                 console.log('----------------')
                 console.log(data)
                 this.userData = data.result;
             })
         }
      }
    }
</script>
<style scoped>
    .other_msg{
        position: relative;
        padding-left: 56px;
    }
    .my_msg{
        position: relative;
        padding-right: 54px;
    }
    .img_left_header_box{
        display: inline-block;
        border: 1px solid #ececec;
        width: 46px;
        height: 46px;
        border-radius: 200px;
        overflow: hidden;
        position:absolute;
        left:0;
        top:0;
        font-size: 14px;
        text-align: center;
    }
    .img_right_header_box{
        display: inline-block;
        border: 1px solid #ececec;
        width: 46px;
        height: 46px;
        border-radius: 200px;
        overflow: hidden;
        position:absolute;
        right:0;
        top:0;
        font-size: 14px;
        text-align: center;
    }
    .img_left_header_box img, .img_right_header_box img{
        width: 100%;
        height:100%;
    }
    .name_title_right{
        text-align: right;
        height:26px;
    }
    .name_title_left{
        text-align: left;
        height:26px;
    }
    .content_right{
        text-align: right;
    }
    .content_right_info{
        display: inline-block;
        padding: 6px;
        border-radius: 6px;
        background: #b8e0ff;
    }
    .content_left{
        display: inline-block;
        padding: 6px;
        border-radius: 6px;
        background: #fbe5db;
    }
    .no_header_img{
        padding: 6px 0 0 2px;
        font-size: 12px;
    }
</style>
