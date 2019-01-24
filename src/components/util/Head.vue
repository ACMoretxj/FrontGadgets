<template>
  <meta/>
</template>

<script>
export default {
  name: 'Head',
  props: [ 'title' ],
  created () {
    document.title = this.title
  },
  watch: {
    title (val) {
      document.title = val
    }
  }
}
</script>
