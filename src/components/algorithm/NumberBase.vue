<template>
  <div class="component-number-base">
    <v-head :title="title"/>
    <a-radio-group @change="onChange" v-model="currentBase">
      <a-radio v-for="radio in radios" :key="`radio-${radio.value}`" :value="radio.value">{{ radio.name }}</a-radio>
    </a-radio-group>
    <div>
    </div>
    <div style="width: 25%; margin: 10px auto 10px auto;">
      <a-input size="large" v-model="expression" :disabled="true"/>
      <a-row v-for="(items, rowIdx) in tokens" :key="`token-row-${rowIdx}`" :gutter="1" style="margin-top: 1px;">
        <a-col :span="4" v-for="(token, colIdx) in items" :key="`token-col-${colIdx}`">
          <a-button type="default" :icon="token.icon" :size="'large'" :disabled="token.disabled" @click="clickToken(token)" @keydown.delete="clickToken({ value: 'del' })" style="width: 100%;">{{ token.name }}</a-button>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */

  import VHead from '../util/Head'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'

import _ from 'lodash'

export default {
  name: 'NumberBase',
  components: { VHead, ACol, ARow },

  data () {
    return {
      title: '进制转换',
      radios: [
        { name: '二进制', value: 'bin' },
        { name: '八进制', value: 'oct' },
        { name: '十进制', value: 'dec' },
        { name: '十六进制', value: 'hex' }
      ],
      currentBase: 'dec',
      tokens: [ ],
      exprTokens: [ ],
      expression: ''
    }
  },

  mounted () {
    this.tokens.splice(0, this.tokens.length)
    const tokenList = [
      [ [ 'A' ], [ '9' ], [ '8' ], [ '7' ], [ '+' ], [ '(' ] ],
      [ [ 'B' ], [ '6' ], [ '5' ], [ '4' ], [ '-' ], [ ')' ] ],
      [ [ 'C' ], [ '3' ], [ '2' ], [ '1' ], [ 'x', '*' ], [ 'c', 'clear' ] ],
      [ [ 'D' ], [ 'E' ], [ 'F' ], [ '0' ], [ '-' ], [ '=' ] ]
    ]
    this.tokens = _.map(tokenList,
      tokens => _.map(tokens,
        token => ({
          name: token[0],
          value: token[token.length === 1 ? 0 : 1],
          disabled: false })))
    this.clear()
  },

  methods: {
    clear () {
      this.exprTokens.splice(0, this.exprTokens.length)
    },

    clickToken (token) {
      switch (token.value) {
        case 'del':
          this.exprTokens.pop()
          break
        case 'clear':
          this.clear()
          break
        case '=':
          this.evaluate()
          break
        default:
          const nums = _.concat(Array.from(new Array(10), (num, idx) => '' + idx), [ 'A', 'B', 'C', 'D', 'E', 'F' ])
          if (nums.includes(_.last(_.last(this.exprTokens))) && nums.includes(token.value)) {
            this.exprTokens.push(this.exprTokens.pop() + token.value)
            break
          }
          this.exprTokens.push(token.name)
      }
    },

    evaluate () {
      const expr = this.exprTokens.join('').replace(/x/g, '*')
      this.exprTokens = [ eval(expr) ]
    }
  },

  watch: {
    exprTokens (vals) {
      this.expression = vals.join(' ')
    },

    currentBase (val, oVal) {
      const nb = { 'bin': 2, 'oct': 8, dec: 10, 'hex': 16 }this.exprTokens.map(token => !nums.includes(token[0]) ? token : (val === 'dec' ? parseInt(token, nb[val]) : parseInt(token, nb[oVal]).toString(nb[val])))
      const nums = _.concat(Array.from(new Array(10), (num, idx) => '' + idx), [ 'A', 'B', 'C', 'D', 'E', 'F' ])
      this.exprTokens =
    }
  }
}
</script>

<style scoped>

</style>
