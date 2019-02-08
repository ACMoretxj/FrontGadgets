<template>
  <div class="component-generate-expression">
    <v-head :title="title"/>
  </div>
</template>

<script>
import VHead from '../util/Head'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'

import assert from 'assert'
import _ from 'lodash'

export default {
  name: 'Maze',
  components: { VHead, ACol, ARow },

  data () {
    return {
      title: '迷宫',
      size: 9,
      maze: [ ],
      // the delta distance from current point to the up/right/down/left point
      steps: [ [ 0, -1 ], [ 1, 0 ], [ 0, 1 ], [ -1, 0 ] ]
    }
  },

  mounted () {
    this.genMaze()
  },

  methods: {
    genMaze () {
      // init the maze and represent the it in adjacency matrix whose cell is maze[i][j][0...3],
      // the third dimension contains 4 members, from no.0 to no.3 separately represents the
      // up/right/down/left edge of the point (i, j), i.e. maze[1][2][3] = 1 means the point
      // (1, 2)'s left edge, or the edge between (1, 2) and (0, 2) is connected
      _.forEach(Array(this.size), (__, i) => { this.maze[i] = [ ] })
      _.forEach(Array(this.size), (__, i) => _.forEach(Array(this.size), (___, j) => { this.maze[i][j] = [ 1, 1, 1, 1 ] }))
      // start split the maze
      this.splitMaze(0, 0, this.size - 1, this.size - 1)
    },

    splitMaze (x1, y1, x2, y2) {
      if (x2 - x1 < 2 || y2 - y1 < 2) {
        return
      }
      assert(x2 > x1 && y2 > y1)
      const xMid = (x1 + x2) / 2
      const yMid = (y1 + y2) / 2
      // TODO: split main body
      this.splitMaze(x1, y1, xMid, yMid)
      this.splitMaze(xMid, y1, x2, yMid)
      this.splitMaze(x1, yMid, xMid, y2)
      this.splitMaze(xMid, yMid, x2, y2)
    }
  }
}
</script>

<style scoped>
</style>
