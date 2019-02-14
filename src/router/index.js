import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/Index'
import Canvas from '../components/canvas/Index'
import Reflection from '../components/canvas/Reflection'
import Maze from '../components/canvas/Maze'
import Algorithm from '../components/algorithm/Index'
import GenerateExpr from '../components/algorithm/GenerateExpr'
import PolishExpr from '../components/algorithm/PolishExpr'
import NumberBase from '../components/algorithm/NumberBase'

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
        },
        {
          path: 'maze/',
          name: 'canvas-maze',
          component: Maze
        }
      ]
    },
    {
      path: '/algorithm/',
      name: 'algorithm',
      component: Algorithm,
      children: [
        {
          path: 'generate-expression/',
          name: 'algorithm-generate-expression',
          component: GenerateExpr
        },
        {
          path: 'polish-expression/',
          name: 'algorithm-polish-expression',
          component: PolishExpr
        },
        {
          path: 'number-base/',
          name: 'algorithm-number-base',
          component: NumberBase
        }
      ]
    }
  ]
})
