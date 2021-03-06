<template>
  <div class="algorithm-graph-path">
    <a-row :gutter="4" type="flex" justify="center" align="middle">
      <a-col :span="5">
        <a-input size="large" v-model="graph.vertexInput" addonBefore="点集" placeholder="请输入点集，空格隔开"/>
      </a-col>
      <a-col :span="5">
        <a-input size="large" v-model="graph.edgeInput" addonBefore="边集" placeholder="请输入边集，空格隔开"/>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="middle" style="margin-top: 15px;">
      <a-col :span="10">
        <a-slider v-model.number="path.lenLimit" :min="0" :max="100" :tipFormatter="val => val === 0 ? '不限长度' : `长度 ${val}`">路径/环的长度</a-slider>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="middle" style="margin: 24px 0 24px 0;">
      <a-col :span="6">
        <a-button type="primary" :size="'large'" :disabled="button.disabled" :loading="button.loading" @click="button.handler(button)">{{ button.text }}</a-button>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="middle" style="margin-top: 15px;">
      <a-col :span="10">
        <a-collapse>
          <a-collapse-panel :header="`所有路径: ${renderPaths(path.allPath).length} 条`" key="1">
            {{ renderPaths(path.allPath).join('\n') }}
          </a-collapse-panel>
          <a-collapse-panel :header="`简单路径: ${renderPaths(path.simplePath).length} 条`" key="2">
            {{ renderPaths(path.simplePath).join('\n') }}
          </a-collapse-panel>
          <a-collapse-panel :header="`环路: ${renderPaths(path.circlePath).length} 条`" key="3">
            {{ renderPaths(path.circlePath).join('\n') }}
          </a-collapse-panel>
          <a-collapse-panel :header="`欧拉回路: ${renderPaths(path.eulerPath).length} 条`" key="4">
            {{ renderPaths(path.eulerPath).join('\n') }}
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="middle" :hidden="!errorMessage">
      <a-col :span="10">
        <a-alert :message="errorMessage" type="error" style="margin-top: 15px;"/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import _ from 'lodash'
import ACol from 'ant-design-vue/es/grid/Col'
import ARow from 'ant-design-vue/es/grid/Row'
import graphAlgo from '../../../core/algorithm/graph'

export default {
  name: 'Path',
  components: { ARow, ACol },

  data () {
    return {
      button: { text: '计算路径', alias: 'generate-expression', handler: this.calculatePath, disabled: false, loading: false },
      // represent a graph with adjacent table
      graph: { maxVertex: 16, vertexInput: 'A B C D E F', edgeInput: 'AC AD BD DE DF EF', edges: [], next: {} },
      path: { lenLimit: 0, allPath: new Set(), simplePath: new Set(), circlePath: new Set(), eulerPath: new Set() },
      errorMessage: null
    }
  },

  methods: {
    clean () {
      this.graph.edges = []
      this.graph.next = {}
      this.path.lenLimit = 0
      this.path.allPath = new Set()
      this.path.simplePath = new Set()
      this.path.circlePath = new Set()
      this.path.eulerPath = new Set()
      this.graph.vertexInput = this.graph.vertexInput.replace(/ +/g, ' ').trim()
      this.graph.edgeInput = this.graph.edgeInput.replace(/ +/g, ' ').trim()
    },

    async calculatePath () {
      this.button.loading = true
      this.errorMessage = null
      await new Promise(resolve => setTimeout(resolve, 500))
      this.clean()
      const suc = this.parseGraph()
      if (!suc) {
        this.button.loading = false
        return
      }

      const vertexes = this.graph.vertexInput.split(' ')
      vertexes.forEach(v => {
        const mark = {}
        vertexes.forEach(iv => (mark[iv] = iv === v ? 1 : 0))
        this.traverseGraph(v, [ v ], mark)
        this.traverseEulerPath(v, [ v ], new Set())
      })
      this.button.loading = false
    },

    checkPath (path, circle = false) {
      this.path.allPath.add(path.join(''))
      this.path[circle ? 'circlePath' : 'simplePath'].add(path.join(''))
    },

    traverseGraph (vertex, path, mark) {
      for (let i = this.graph.next[vertex]; i !== -1; i = this.graph.edges[i].next) {
        const edge = this.graph.edges[i]
        if (!path.includes(edge.to)) {
          this.checkPath(_.concat(path, edge.to))
          this.traverseGraph(edge.to, _.concat(path, edge.to), mark)
        } else if (path[0] === edge.to && _.nth(path, -2) !== edge.to) {
          this.checkPath(_.concat(path, edge.to), true)
        }
      }
    },

    traverseEulerPath (vertex, path, edges) {
      // finished current euler path
      if (edges.size >= this.graph.edges.length / 2) {
        this.path.eulerPath.add(path.join(''))
        console.log(Array.from(edges).join('|'))
        return
      }

      for (let i = this.graph.next[vertex]; i !== -1; i = this.graph.edges[i].next) {
        const edge = this.graph.edges[i]
        const pastCount = path.filter(v => v === edge.to).length
        // 1. every vertex in the path appears at most twice
        // 2. the repeated vertex distance is bigger than 2
        if (pastCount < 2 && (path.length < 2 || _.nth(path, -2) !== edge.to)) {
          const edgeStr = [ vertex, edge.to ].sort().join('')
          if (edges.has(edgeStr)) {
            continue
          }
          path.push(edge.to)
          edges.add(edgeStr)
          this.traverseEulerPath(edge.to, path, edges)
          edges.delete(edgeStr)
          path.pop()
        }
      }
    },

    validateGraph () {
      const vertexInput = this.graph.vertexInput
      const edgeInput = this.graph.edgeInput
      const vertexValidator = v => /^[a-z]$/i.test(v) && edgeInput.indexOf(v) > -1
      const edgeValidator = e => /^[a-z]{2}$/i.test(e) && e.split('').every(v => vertexInput.indexOf(v) > -1)
      if (vertexInput.split(' ').length > this.graph.maxVertex) {
        this.errorMessage = `顶点数目超过限制[${this.graph.maxVertex}]，请再次输入`
        return false
      }
      if (!vertexInput.split(' ').every(vertexValidator)) {
        this.errorMessage = '顶点集错误，请再次检查'
        return false
      }
      if (!edgeInput.split(' ').every(edgeValidator)) {
        this.errorMessage = '边集错误，请再次检查'
        return false
      }
      return true
    },

    parseGraph () {
      const suc = this.validateGraph()
      if (suc) {
        const vertexes = this.graph.vertexInput.replace(/ +/g, ' ').split(' ')
        const edges = this.graph.edgeInput.replace(/ +/g, ' ').split(' ')
        const result = graphAlgo.parse(vertexes, edges)
        this.graph.next = result.next
        this.graph.edges = result.edges
      }
      return suc
    },

    renderPaths (pathSet) {
      return Array.from(pathSet).filter(p => !this.path.lenLimit || p.length === this.path.lenLimit + 1)
    }
  }
}
</script>

<style scoped>
</style>
