<template>
  <div class="algorithm-graph-degree">
    <a-row :gutter="4" type="flex" justify="center" align="middle">
      <a-col :span="5">
        <a-input size="large" v-model="graph.vertexInput" addonBefore="点集" placeholder="请输入点集，空格隔开"/>
      </a-col>
      <a-col :span="5">
        <a-input size="large" v-model="graph.edgeInput" addonBefore="边集" placeholder="请输入边集，空格隔开"/>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="middle" style="margin: 24px 0 24px 0;">
      <a-col :span="6">
        <a-button type="primary" :size="'large'" :disabled="button.disabled" :loading="button.loading" @click="button.handler(button)">{{ button.text }}</a-button>
      </a-col>
    </a-row>
    <a-row :gutter="4" type="flex" justify="center" align="middle" style="margin-bottom: 15px;">
      <a-radio-group @change="onFilterChange" v-model="filterValue">
        <a-radio :value="'all'">全部</a-radio>
        <a-radio :value="'odd'">奇数度</a-radio>
        <a-radio :value="'even'">偶数度</a-radio>
      </a-radio-group>
    </a-row>
    <a-row :gutter="4" type="flex" justify="center" align="middle">
      <a-col :span="10">
        <a-table :columns="table.columns" :dataSource="table.data" :pagination="false">
        </a-table>
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
import graphAlgo from '../../../core/algorithm/graph'

export default {
  name: 'GraphDegree',

  data () {
    return {
      button: { text: '计算度', alias: 'calculate-degree', handler: this.calculateDegree, disabled: false, loading: false },
      // represent a graph with adjacent table
      graph: { maxVertex: 16, vertexInput: 'A B C D E F', edgeInput: 'AB AC AE BD CF DE DF', edges: [], next: {} },
      originData: [],
      table: { columns: [], data: [] },
      filterValue: 'all',
      errorMessage: null
    }
  },

  beforeMount () {
    this.table.columns = [{
      title: 'Vertex',
      dataIndex: 'vertex',
      key: 'Vertex',
      sorter: true
    }, {
      title: 'Degree',
      dataIndex: 'degree',
      key: 'Degree',
      sorter: true
    }, {
      title: 'Adjacent Vertexes',
      dataIndex: 'adjacentVertexes',
      key: 'Adjacent Vertexes'
    }]
  },

  methods: {
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

    async calculateDegree () {
      this.button.loading = true
      this.errorMessage = null
      this.table.data = []
      this.originData = []
      await new Promise(resolve => setTimeout(resolve, 500))

      const suc = this.parseGraph()
      if (!suc) {
        this.button.loading = false
        return
      }

      for (let vertex in this.graph.next) {
        const item = { vertex, degree: 0, adjacentVertexes: [] }
        for (let i = this.graph.next[vertex]; i !== -1; i = this.graph.edges[i].next) {
          const edge = this.graph.edges[i]
          item.adjacentVertexes.push(edge.to)
        }
        item.degree = item.adjacentVertexes.length
        item.adjacentVertexes = item.adjacentVertexes.sort().join(' ')
        this.originData.push(item)
        this.table.data.push(item)
      }

      this.button.loading = false
    },

    onFilterChange (e) {
      if (e.target.value === 'all') {
        this.table.data = this.originData
      } else if (e.target.value === 'even') {
        this.table.data = this.originData.filter(item => !(item.degree % 2))
      } else {
        this.table.data = this.originData.filter(item => item.degree % 2)
      }
    }
  }
}
</script>

<style scoped>
</style>
