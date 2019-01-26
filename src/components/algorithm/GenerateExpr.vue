<template>
  <div class="component-generate-expression">
    <v-head :title="title"/>
    <h1>{{ title }}</h1>

    <a-row type="flex" justify="center" align="middle" style="margin: 24px 0 24px 0;">
      <a-col :span="8">
        <a-row justify="start" align="middle">
          <a-col :span="24">
            <a-card title="生成选项">
              <a-checkbox :indeterminate="checkboxes.checkAll.indeterminate" @change="onCheckAllChange" :checked="checkboxes.checkAll.checked">全选</a-checkbox>
              <br /><br />
              <a-checkbox-group :options="checkboxes.group" v-model="checkboxes.checkedList" @change="onCheckChange" />
              <a-slider :min="1" :max="10" v-model="difficulty" :tipFormatter="val => `难度 ${val}`">题目难度</a-slider>
            </a-card>
          </a-col>
        </a-row>
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
        <a-input size="large" v-model="expression" placeholder="转换结果" :disabled="true"/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import VHead from '../util/Head'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'

import _ from 'lodash'

export default {
  name: 'GenerateExpr',
  components: { VHead, ACol, ARow },

  data () {
    return {
      title: '表达式生成器',
      // the range of numbers in generated expression
      range: { min: 1, max: 100 },
      difficulty: 3,
      buttons: [
        { text: '生成表达式', alias: 'generate-expression', handler: this.generateExpression, loading: false }
      ],
      checkboxes: {
        checkAll: { indeterminate: false, checked: false },
        group: [ { label: '混合运算', value: 'mixed' }, { label: '带有括号', value: 'bracket' }, { label: '这个没用', value: 'extra' } ],
        checkedList: []
      },
      expression: ''
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

    validate () {
      try {
        // eslint-disable-next-line no-eval
        eval(this.expression.replace('^', '**'))
        return true
      } catch (error) {
        return false
      }
    },

    async generateExpression (button) {
      button.loading = true
      await new Promise(resolve => setTimeout(resolve, 500))
      const exprSize = this.difficulty + 1
      const originOperators = [ [ '+', '-' ], [ '*', '/' ], [ '^' ] ]
      const numbers = Array.from(new Array(this.range.max - this.range.min + 1), (val, idx) => idx + this.range.min)
      const operators = this.checkboxes.checkedList.includes('mixed') ? _.flatten(originOperators) : _.slice(_.sample(originOperators))
      // select `exprSize` numbers and `exprSize - 1` operators
      const nums = _.sampleSize(_.flatMap(numbers, val => _.fill(new Array(exprSize), '' + val)), exprSize)
      const ops = _.sampleSize(_.flatMap(operators, val => _.fill(new Array(exprSize), val)), exprSize - 1)
      // cross merge `nums` and `ops`
      ops.forEach((val, idx) => nums.splice(2 * idx + 1, 0, val))
      // judges whether a token is a number, the token includes '|' also counts, such as '(|1|+|2|)|'
      // the following sentence is also right but too ugly, using `ops` is more clear
      // const isDigit = token => token !== undefined && (!_.isNaN(Number(token)) || token.includes('|'))
      const isDigit = token => token !== undefined && !ops.includes(token)
      // add brackets
      if (this.checkboxes.checkedList.includes('bracket')) {
        for (let i = 0; i < parseInt('' + this.difficulty / 2); ++i) {
          // randomly choose two indexes from range [0, nums.length] in order to assure the position of brackets
          const choices = _.sampleSize(Array.from(new Array(nums.length + 1), (val, idx) => idx), 2)
          let max = Math.max.apply(null, choices)
          let min = Math.min.apply(null, choices)
          // if the max value points to the number, move it forward by one step
          // so that the right bracket will be behind the number
          max = isDigit(nums[max]) ? max + 1 : max
          // if the min value points to the operator, move it backward by one step
          // so that the left bracket will be in front of the number
          min = !isDigit(nums[min]) ? min - 1 : min
          // when `max - min <= 1`, it means that there is only a single number
          // in the brackets, expand the scope instead
          if (max - min <= 1) {
            max = Math.min(max + 2, nums.length)
            min = Math.max(min - 2, 0)
          }
          // insert brackets into the specified positions
          nums.splice(max, 0, ')')
          nums.splice(min, 0, '(')
          // consider this circumstance: when you want to insert brackets into
          // `(1 + 2) + 3`, you got the `(1 + (2) + 3)`, the result is illegal
          // so we decide to combine the expressions between brackets each time
          // we insert new brackets, and split them as detached tokens
          nums.splice(min, max - min + 2, _.slice(nums, min, max + 2).join('|'))
        }
      }
      this.expression = _.flatMap(nums, val => val.split('|')).join(' ')
      // invalidate the generated expression
      if (!this.validate()) {
        this.generateExpression(button)
      }
      button.loading = false
    }
  }
}
</script>
