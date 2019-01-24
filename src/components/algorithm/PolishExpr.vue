<template>
  <div class="component-polish-expression">
    <v-head :title="'前缀/后缀表达式转换器'"/>
    <h1>前缀/后缀表达式转换器</h1>
    <a-row type="flex" justify="center" align="middle">
      <a-col :span="8">
        <a-input size="large" v-model="expression" placeholder="请在此输入前缀表达式"/>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center" align="middle" style="margin: 24px 0 24px 0;">
      <a-col :span="6">
        <a-row type="flex" justify="space-around" align="middle">
          <a-col :span="6" v-for="button in buttons" :key="button.alias">
            <a-button type="primary" :size="'large'" :loading="button.loading" @click="button.handler(button)">{{ button.text }}</a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center" align="middle">
      <a-col :span="8">
        <a-input size="large" v-model="result" placeholder="转换结果" :disabled="true"/>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center" align="middle" style="margin-top: 24px;">
      <a-col :span="8">
        <a-alert v-if="showAlert" message="错误信息" description="您的输入有误，请重新检查！" type="error"/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import VHead from '@/components/util/Head'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'

import _ from 'lodash'

export default {
  name: 'PolishExpression',
  components: { VHead, ACol, ARow },

  data () {
    return {
      buttons: [
        { text: '转换前缀', alias: 'convert-prefix', handler: this.convertPrefix, loading: false },
        { text: '转换后缀', alias: 'convert-postfix', handler: this.convertPostfix, loading: false }
      ],
      expression: '(19 - 10) * ((2 ^ 17 + 32) + 5) + 1 + 2 + 3',
      result: '',
      showAlert: false
    }
  },

  methods: {
    async convertPrefix (button) {
      if (!this.validate()) {
        return
      }

      button.loading = true
      await new Promise(resolve => setTimeout(resolve, 500))
      const trans = { '(': ')', ')': '(' }
      const expr = _.reverse(this.parse(this.expression))
        .map(e => e in trans ? trans[e] : e)
      const prior = (a, b) => !this.strictPrior(b, a)
      this.result = _.reverse(this.notation(expr, prior)).join(' ')
      button.loading = false
    },

    async convertPostfix (button) {
      if (!this.validate()) {
        return
      }

      button.loading = true
      await new Promise(resolve => setTimeout(resolve, 500))
      const expr = this.parse(this.expression)
      const prior = (a, b) => this.strictPrior(a, b)
      this.result = this.notation(expr, prior).join(' ')
      button.loading = false
    },

    validate () {
      try {
        // eslint-disable-next-line no-eval
        eval(this.expression)
        return !(this.showAlert = false)
      } catch (error) {
        return !(this.showAlert = true)
      }
    },

    strictPrior (a, b) {
      const rela = { '(': 0, ')': 0, '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 }
      return rela[a] > rela[b]
    },

    parse (expression) {
      const result = []
      const num = []
      const expr = _.replace(expression, / /g, '')
      let index = 0

      while (index < expr.length) {
        if (!_.isNaN(Number(expr[index]))) {
          num.push(expr[index])
        } else if (num.length <= 0) {
          result.push(expr[index])
        } else {
          result.push(num.join(''))
          num.splice(0, num.length)
          continue
        }
        index += 1
      }
      if (num.length > 0) {
        result.push(num.join(''))
      }
      return result
    },

    notation (expr, prior) {
      let result = []
      const stack = []
      let index = 0

      while (index < expr.length) {
        if (!_.isNaN(Number(expr[index]))) {
          result.push(expr[index])
        } else if (stack.length <= 0 ||
          prior(expr[index], _.last(stack)) ||
          expr[index] === '(') {
          stack.push(expr[index])
        } else if (expr[index] === ')') {
          const pos = _.lastIndexOf(stack, '(')
          result = _.concat(result, _.reverse(_.slice(stack, pos + 1)))
          stack.splice(pos)
        } else if (stack.length > 0 && !prior(expr[index], _.last(stack))) {
          result.push(stack.splice(-1)[0])
          continue
        }
        index += 1
      }
      return _.concat(result, _.reverse(stack))
    }
  }
}
</script>

<style scoped>
</style>
