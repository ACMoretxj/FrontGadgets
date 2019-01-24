import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Canvas from '@/components/canvas/Index'
import Reflection from '@/components/canvas/Reflection'
import Algorithm from '@/components/algorithm/Index'
import PolishExpr from '@/components/algorithm/PolishExpr'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/canvas/',
      name: 'canvas',
      component: Canvas,
      children: [
        {
          path: 'reflection/',
          name: 'canvas-reflection',
          component: Reflection
        }
      ]
    },
    {
      path: '/algorithm/',
      name: 'algorithm',
      component: Algorithm,
      children: [
        {
          path: 'polish-expression/',
          name: 'algorithm-polish-expression',
          component: PolishExpr
        }
      ]
    }
  ]
})
