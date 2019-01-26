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
            { name: '表达式生成器', link: { name: 'algorithm-generate-expression' } },
            { name: '前缀/后缀表达式', link: { name: 'algorithm-polish-expression' } }
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
