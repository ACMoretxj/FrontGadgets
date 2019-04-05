<!--suppress ALL -->
<template>
  <div class="algorithm-graph">
    <h2>图论（无向图）</h2>
    <a-tabs defaultActiveKey="2">
      <a-tab-pane tab="完全图" key="1">
        <complete-graph/>
      </a-tab-pane>
      <a-tab-pane tab="图的表示" key="2">
      </a-tab-pane>
      <a-tab-pane tab="路径和环" key="3">
        <graph-path/>
      </a-tab-pane>
      <a-tab-pane tab="图的度" key="4">
        <graph-degree/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import ACol from 'ant-design-vue/es/grid/Col'
import ARow from 'ant-design-vue/es/grid/Row'
import CompleteGraph from './CompleteGraph'
import GraphPath from './Path'
import GraphDegree from './Degree'

export default {
  name: 'Graph',
  components: { ARow, ACol, CompleteGraph, GraphPath, GraphDegree }
}
</script>

<style scoped>
</style>
