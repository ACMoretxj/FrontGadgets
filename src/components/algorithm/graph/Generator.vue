<template>
  <div class="algorithm-graph-generator">
    <a-row type="flex" justify="center" align="middle" style="margin: 24px 0 24px 0">
      <a-col :span="12">
        <a-row type="flex" justify="center" align="middle" style="margin: 24px 0 24px 0;">
          <a-col :span="12">
            <a-row justify="start" align="middle">
              <a-col :span="24">
                <a-card title="生成选项">
                  <a-checkbox :indeterminate="checkboxes.checkAll.indeterminate" @change="onCheckAllChange" :checked="checkboxes.checkAll.checked">全选</a-checkbox>
                  <br /><br />
                  <a-checkbox-group :options="checkboxes.group" v-model="checkboxes.checkedList" @change="onCheckChange" />
                  <a-slider :min="1" :max="26" v-model="vertexSize" :tipFormatter="val => `顶点数量 ${val}`">顶点数量</a-slider>
                </a-card>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row :gutter="5" type="flex" justify="center" align="middle">
          <a-col :span="12">
            <a-input size="large" v-model="nodesOutput" addonBefore="点集" disabled="true"/>
          </a-col>
        </a-row>
        <a-row :gutter="5" type="flex" justify="center" align="middle">
          <a-col :span="12">
            <a-input size="large" v-model="edgesOutput" addonBefore="边集" disabled="true"/>
          </a-col>
        </a-row>
        <a-row type="flex" justify="center" align="middle" style="margin: 24px 0 24px 0;">
          <a-col :span="6">
            <a-row type="flex" justify="space-around" align="middle">
              <a-col :span="6" v-for="button in buttons" :key="button.alias">
                <a-button type="primary" :size="'large'" :disabled="button.disabled" :loading="button.loading" @click="button.handler(button)">{{ button.text }}</a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <div id="graph-canvas" ref="graphCanvas"></div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import vis from 'vis'
import _ from 'lodash'
import UniFind from '../../../core/algorithm/uni-find'
import ACol from 'ant-design-vue/es/grid/Col'

export default {
  name: 'GraphGenerator',
  components: {ACol},
  data () {
    return {
      title: '图生成器',
      vertexSize: 3,
      buttons: [
        { text: '开始生成', alias: 'generate-graph', handler: this.generateGraph, disabled: false, loading: false }
      ],
      checkboxes: {
        checkAll: { indeterminate: false, checked: false },
        group: [
          { label: '连通', value: 'connected' }
        ],
        checkedList: []
      },
      nodes: [],
      edges: []
    }
  },

  methods: {
    onCheckAllChange (e) {
      Object.assign(this.checkboxes, { checkedList: e.target.checked ? _.map(this.checkboxes.group, item => item.value) : [] })
      Object.assign(this.checkboxes.checkAll, { indeterminate: false, checked: e.target.checked })
    },

    onCheckChange (checkedList) {
      this.checkboxes.checkAll.indeterminate = !!checkedList.length && (checkedList.length < this.checkboxes.group.length)
      this.checkboxes.checkAll.checked = checkedList.length === this.checkboxes.group.length
    },

    async generateGraph (button) {
      button.loading = true
      await new Promise(resolve => setTimeout(resolve, 500))
      this.nodes = Array.from(new Array(this.vertexSize), (n, i) => ({id: i + 1, label: String.fromCharCode('A'.charCodeAt(0) + i)}))
      this.edges = this.__generateGraph()
      this.__renderGraph(new vis.DataSet(this.nodes), new vis.DataSet(this.edges))
      button.loading = false
    },

    __generateGraph () {
      const unifind = new UniFind(this.vertexSize)
      const probThresh = 0.8
      const edges = []
      const edgeSet = new Set()
      // firstly create edges in order
      for (let i = 0; i < this.vertexSize; ++i) {
        for (let j = i + 1; j < this.vertexSize; ++j) {
          const prob = Math.random()
          if (prob < probThresh) {
            continue
          }
          unifind.union(i, j)
          edgeSet.add(`${i}-${j}`)
          edges.push({from: i + 1, to: j + 1})
        }
      }
      // then fix some edges to make the graph connective
      const connected = () => {
        for (let i = 0; i < this.vertexSize - 1; ++i) {
          if (unifind.find(i) !== unifind.find(i + 1)) {
            return false
          }
        }
        return true
      }
      if (this.checkboxes.checkedList.includes('connected')) {
        while (!connected()) {
          const x = _.sample(this.nodes).id - 1
          const y = _.sample(this.nodes).id - 1
          if (edgeSet.has(`${x}-${y}`) || edgeSet.has(`${y}-${x}`) || x === y) {
            continue
          }
          unifind.union(x, y)
          edgeSet.add(`${x}-${y}`)
          edges.push({from: Math.max(x) + 1, to: Math.min(y) + 1})
        }
      }
      for (let i = 0; i < this.vertexSize; ++i) {
        console.log(unifind.find(i))
      }
      return edges
    },

    __renderGraph (nodes, edges) {
      const container = this.$refs.graphCanvas
      const data = { nodes, edges }
      const options = {
        nodes: {
          color: {
            border: '#000',
            background: '#FFF'
          }
        },
        edges: {
          color: {
            color: '#000'
          }
        }
      }
      return new vis.Network(container, data, options)
    }
  },

  computed: {
    nodesOutput () {
      return this.nodes.map(node => node.label).join(' ')
    },

    edgesOutput () {
      const edges = this.edges.map(edge => `${this.nodes[edge.from - 1].label}${this.nodes[edge.to - 1].label}`)
      return edges.sort().join(' ')
    }
  }
}
</script>

<style scoped>
#graph-canvas {
  height: 700px;
}
</style>
