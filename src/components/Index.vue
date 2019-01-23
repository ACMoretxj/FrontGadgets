<template>
  <div class="hello">
    <h1>{{ greeting }}</h1>
    <div v-for="items in links" :key="link-category-`${items.category}`">
      <h2>{{ items.category }}</h2>
      <ul>
        <li v-for="item in items.content" :key="link-item-`${item.alias}`">
          <a
            :href="item.link"
            target="_blank"
          >
            {{ item.name }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      greeting: 'Welcome to Your Vue.js App',
      links: [
        {
          category: 'Canvas Effects',
          content: [
            { name: '碰撞反射', alias: 'reflect', link: '/#/reflect/' },
            { name: '迷宫效果', alias: 'maze', link: '/#/maze/' }
          ]
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
