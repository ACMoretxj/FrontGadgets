<template>
  <div class="algorithm-graph">
    <h2>图论（无向图）</h2>
    <a-tabs defaultActiveKey="1">
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
            <a-input size="large" addonBefore="点集" placeholder="请输入点集，空格隔开"/>
          </a-col>
          <a-col :span="5">
            <a-input size="large" addonBefore="边集" placeholder="请输入边集，空格隔开"/>
          </a-col>
        </a-row>
        <a-row type="flex" justify="center" align="middle" style="margin-top: 15px;">
          <a-col :span="10">
            <a-slider v-model="path.len" :min="0" :max="100" :tipFormatter="val => val === 0 ? '不限长度' : `长度 ${val}`">路径/环的长度</a-slider>
          </a-col>
        </a-row>
        <a-row type="flex" justify="center" align="middle" style="margin-top: 15px;">
          <a-col :span="10">
            <a-collapse>
              <a-collapse-panel header="所有路径" key="1">
              </a-collapse-panel>
              <a-collapse-panel header="简单路径" key="2">
              </a-collapse-panel>
              <a-collapse-panel header="环路" key="3">
              </a-collapse-panel>
            </a-collapse>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane tab="欧拉连通" key="3">
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
      completeGraph: {
        vertex: null,
        edge: null
      },
      path: {
        len: 0
      }
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
