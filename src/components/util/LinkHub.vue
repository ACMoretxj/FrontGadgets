<template>
  <div class="link-hub">
    <h2>{{ category }}</h2>
    <ul>
      <li v-for="item in links" :key="link-item-`${item.link.name}`">
        <router-link
          :to="item.link"
          _target="blank"
        >
          {{ item.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'LinkHub',
  props: [ 'category', 'links' ]
}
</script>

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
