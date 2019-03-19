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
      </a-tab-pane>
      <a-tab-pane tab="路径和环" key="2">
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
            <a-slider v-model="path.lenLimit" :min="0" :max="100" :tipFormatter="val => val === 0 ? '不限长度' : `长度 ${val}`">路径/环的长度</a-slider>
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
              <a-collapse-panel :header="`所有路径: ${path.allPath.length} 条`" key="1">
                {{ path.allPath.join('\n') }}
              </a-collapse-panel>
              <a-collapse-panel :header="`简单路径: ${path.simplePath.length} 条`" key="2">
                {{ path.simplePath.join('\n') }}
              </a-collapse-panel>
              <a-collapse-panel :header="`环路: ${path.circlePath.length} 条`" key="3">
                {{ path.circlePath.join('\n') }}
              </a-collapse-panel>
              <a-collapse-panel :header="`欧拉回路: ${path.eulerPath.length} 条`" key="4">
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
      completeGraph: { vertex: null, edge: null },
      button: { text: '计算路径', alias: 'generate-expression', handler: this.calculatePath, disabled: false, loading: false },
      // represent a graph with adjacent table
      graph: { maxVertex: 16, vertexInput: 'A B C D', edgeInput: 'AB AC BC CD', edges: [], next: {} },
      path: { lenLimit: 0, allPath: [], simplePath: [], circlePath: [], eulerPath: [] },
      errorMessage: null
    }
  },

  methods: {
    clean () {
      this.graph.edges = []
      this.graph.next = {}
      this.path.allPath = []
      this.path.simplePath = []
      this.path.circlePath = []
      this.path.eulerPath = []
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
      const mark = {}
      vertexes.forEach(v => {
        vertexes.forEach(iv => (mark[iv] = -1))
        this.traverseGraph(v, [ v ], mark)
      })
      this.button.loading = false
    },

    checkPath (path, circle = false) {
      if (path.length <= 1) {
        return
      }
      this.path.allPath.push(path.join(''))
      this.path[circle ? 'circlePath' : 'simplePath'].push(path.join(''))
    },

    traverseGraph (vertex, path, mark) {
      console.log(vertex, path, mark)
      this.checkPath(path, mark[vertex] === 1)
      if (mark[vertex] !== -1) {
        mark[vertex] += 1
        return
      }
      mark[vertex] = 1
      for (let i = this.graph.next[vertex]; i !== -1; i = this.graph.edges[i].next) {
        const edge = this.graph.edges[i]
        console.log('inner', edge, vertex)
        // prevent illegal path such as `ABA`
        if (path.length >= 2 && path[path.length - 2] === edge.to) {
          continue
        }
        path.push(edge.to)
        this.traverseGraph(edge.to, path, mark)
        path.pop()
      }
      mark[vertex] = 2
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
        console.log(this.graph)
      }
      return suc
    }
  },

  watch: {
    'completeGraph.vertex' (val) {
      console.log(val)
      const nums = _.filter(val.split(''), i => /\d/.test(i))
      if (nums.length <= 0) {
        this.completeGraph.edge = null
        return
      }
      this.completeGraph.vertex = val = parseInt(nums.join(''))
      this.completeGraph.edge = val * (val - 1) / 2
    }
  }
}
</script>

<style scoped>

</style>
