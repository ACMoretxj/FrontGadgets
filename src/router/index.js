import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Reflect from '@/components/Reflect'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/reflect/',
      name: 'Reflect',
      component: Reflect
    }
  ]
})
