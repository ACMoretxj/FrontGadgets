<template>
  <div class="index">
    <v-head :title="title"/>
    <h1>{{ greeting }}</h1>
    <link-hub
      v-for="item in links"
      :key="link-category-`${item.category}`"
      v-bind:category="item.category"
      v-bind:links="item.content"
    />
  </div>
</template>

<script>
import VHead from '../components/util/Head'
import LinkHub from '../components/util/LinkHub'

export default {
  name: 'Index',
  components: { VHead, LinkHub },
  data () {
    return {
      title: '前端工具库',
      greeting: 'Welcome to Your Vue.js App',
      links: [
        {
          category: 'Canvas Effects',
          content: [
            { name: '碰撞反射', link: { name: 'canvas-reflection' } },
            { name: '迷宫效果', link: { name: 'canvas-maze' } }
          ]
        },
        {
          category: 'Computer Basics',
          content: [
            { name: '进制转换', link: { name: 'algorithm-number-base' } },
            { name: '表达式生成器', link: { name: 'algorithm-generate-expression' } },
            { name: '前缀/后缀表达式', link: { name: 'algorithm-polish-expression' } },
            { name: '图论', link: { name: 'algorithm-graph' } }
          ]
        },
        {
          category: 'Cyber-Security',
          content: [
            { name: '密码生成器', link: { name: 'security-password-generator' } }
          ]
        },
        {
          category: 'Fantastic Effects',
          content: [
            { name: '曲率航行', link: { name: 'effect-warp-drive' } }
          ]
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
}
</style>
