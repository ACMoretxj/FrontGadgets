<template>
  <div class="algorithm-graph-complete">
    <a-row type="flex" justify="center" align="middle">
      <a-col :span="6">
        <a-input size="large" v-model="vertex" placeholder="请在此输入完全图顶点的个数"/>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="middle" style="margin-top: 15px;">
      <a-col :span="6">
        <a-input type="number" size="large" addonBefore="边的个数" :value="edges.size" disabled="true"/>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="middle" style="margin-top: 15px;">
      <a-col :span="6">
        <a-input type="number" size="large" addonBefore="对角线的个数" :value="diagonals.size" disabled="true"/>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="middle" style="margin-top: 15px;">
      <a-col :span="10">
        <a-collapse>
          <a-collapse-panel :header="`边: ${edges.size} 条`" key="1">
            {{ Array.from(edges).join('\n') }}
          </a-collapse-panel>
          <a-collapse-panel :header="`对角线: ${diagonals.size} 条`" key="2">
            {{ Array.from(diagonals).join('\n') }}
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
import ACol from 'ant-design-vue/es/grid/Col'
import ARow from 'ant-design-vue/es/grid/Row'
import _ from 'lodash'

export default {
  name: 'CompleteGraph',
  components: { ARow, ACol },

  data () {
    return {
      vertex: null, edges: new Set(), diagonals: new Set(), errorMessage: null
    }
  },

  watch: {
    'vertex' (val) {
      if (!val) {
        return
      }

      const nums = _.filter((val + '').split(''), i => /\d/.test(i))
      if (nums.length <= 0) {
        this.errorMessage = '输入错误，请再次检查'
        return
      }
      this.vertex = val = parseInt(nums.join(''))
      if (val > 26) {
        this.errorMessage = '顶点数过多(>26)，请重新输入'
        return
      }

      this.errorMessage = null
      this.edges = new Set()
      this.diagonals = new Set()

      for (let i = 0; i < val; ++i) {
        const start = String.fromCharCode('A'.charCodeAt(0) + i)
        for (let j = i + 1; j < val; ++j) {
          const end = String.fromCharCode('A'.charCodeAt(0) + j)
          this.edges.add(start + end)
          if (j > i + 1 && j !== (i + val - 1) % val) {
            this.diagonals.add(start + end)
          }
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
