<!--suppress ALL -->
<template>
  <div class="algorithm-graph">
    <h2>图论（无向图）</h2>
    <a-tabs defaultActiveKey="2">
      <a-tab-pane tab="完全图" key="1">
        <a-row type="flex" justify="center" align="middle">
          <a-col :span="4">
            <a-input size="large" v-model="completeGraph.vertex" placeholder="请在此输入完全图顶点的个数"/>
          </a-col>
        </a-row>
        <a-row type="flex" justify="center" align="middle" style="margin-top: 15px;">
          <a-col :span="4">
            <a-input type="number" size="large" addonBefore="边的个数" :value="completeGraph.edge" disabled="true"/>
          </a-col>
        </a-row>
        <a-row type="flex" justify="center" align="middle" style="margin-top: 15px;">
          <a-col :span="4">
            <a-input type="number" size="large" addonBefore="对角线的个数" :value="completeGraph.diagonal" disabled="true"/>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane tab="图的表示" key="2">
      </a-tab-pane>
      <a-tab-pane tab="路径和环" key="3">
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
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import ACol from 'ant-design-vue/es/grid/Col'
import ARow from 'ant-design-vue/es/grid/Row'
import _ from 'lodash'

export default {
  name: 'Graph',
  components: { ARow, ACol },
  data () {
    return {
      completeGraph: { vertex: null, edge: null, diagonal: null },
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
        vertexes.forEach(iv => mark[iv] = iv === v ? 1 : 0)
        this.traverseGraph(v, [ v ], mark)
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
        }
        else if (path[0] === edge.to && _.nth(path, -2) !== edge.to) {
          this.checkPath(_.concat(path, edge.to), true)
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
        vertexes.forEach(v => (this.graph.next[v] = -1))
        const loadEdge = edge => {
          const last = this.graph.next[edge.from]
          this.graph.edges.push(_.extend(edge, { next: last }))
          this.graph.next[edge.from] = this.graph.edges.length - 1
        }
        for (let i = 0; i < edges.length; ++i) {
          loadEdge({ from: edges[i][0], to: edges[i][1] })
          loadEdge({ from: edges[i][1], to: edges[i][0] })
        }
      }
      return suc
    },

    renderPaths (pathSet) {
      return Array.from(pathSet).filter(p => !this.path.lenLimit || p.length === this.path.lenLimit + 1)
    }
  },

  watch: {
    'completeGraph.vertex' (val) {
      const nums = _.filter(val.split(''), i => /\d/.test(i))
      if (nums.length <= 0) {
        this.completeGraph.edge = null
        return
      }
      this.completeGraph.vertex = val = parseInt(nums.join(''))
      this.completeGraph.edge = val * (val - 1) / 2
      this.completeGraph.diagonal = this.completeGraph.edge - val
    }
  }
}
</script>

<style scoped>

</style>
