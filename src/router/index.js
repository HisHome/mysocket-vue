import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/views/Index'
import Login from '@/views/Login'
import PersonInfo from '@/views/PersonInfo'
import Reg from '@/views/Reg'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/reg',
      name: 'Reg',
      component: Reg
    },
    {
      path: '/personInfo',
      name: 'PersonInfo',
      component: PersonInfo
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage
    }
  ]
})
