<template>
  <div :class="basicClass" :style="{ width: `${width}px`, height: `${height}px` }">
    <empty-space v-show="!startWarpDrive"></empty-space>
    <hyperspace v-show="startWarpDrive"></hyperspace>
<!--    <universe></universe>-->
    <dash-board @command="handleCommand"></dash-board>
  </div>
</template>

<script>
import EmptySpace from './EmptySpace'
import Hyperspace from './Hyperspace'
import Universe from './Universe'
import DashBoard from './DashBoard'

export default {
  name: 'WarpDrive',

  components: { EmptySpace, Hyperspace, Universe, DashBoard },

  data () {
    return {
      basicClass: 'front-gadgets-component-effect-warp-drive',
      width: 0,
      height: 0,
      startWarpDrive: false
    }
  },

  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },

  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    handleResize () {
      this.width = window.innerWidth
      this.height = window.innerHeight
    },

    handleCommand (command) {
      this.startWarpDrive = command === 'warp-drive'
    }
  }
}
</script>

<style scoped lang="scss">
.front-gadgets-component-effect-warp-drive {
  display: flex;
  flex-direction: column;

  empty-space {
    width: 100%;
    height: 50%;
  }

  hyperspace {
    width: 100%;
    height: 50%;
  }

  dash-board {
    width: 100%;
    height: 50%;
  }
}
</style>
