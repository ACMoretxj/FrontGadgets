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
            <a-button type="primary" :size="'large'" :disabled="button.disabled" :loading="button.loading" @click="button.handler(button)">{{ button.text }}</a-button>
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
/* eslint-disable one-var */

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
        { text: '生成表达式', alias: 'generate-expression', handler: this.generateExpression, disabled: true, loading: false }
      ],
      checkboxes: {
        checkAll: { indeterminate: false, checked: false },
        group: [
          { label: '加减', value: 'add-sub', operators: [ '+', '-' ] },
          { label: '乘除', value: 'mul-div', operators: [ '*', '/' ] },
          { label: '乘方', value: 'power', operators: [ '^' ] },
          // { label: '括号', value: 'bracket', operators: [ ] },
          { label: '易算', value: 'manual-easy', operators: [ ] }
        ],
        checkedList: []
      },
      expression: '',
      answer: 0
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

    /**
     * expand a single number into an expression, the scale of the expression is
     * determined by the `depth`
     * @param num the specified number, also the result of the expression
     * @param operators the available operators
     * @param depth the expand depth, the function will directly return `num` when depth is 0
     * @param op1 the left side operator of the number in origin expression
     * @param op2 the right side operator of the number in origin expression
     * @return {Array<string>} a list of elements make up of the result expression
     */
    expandExpression (num, operators, depth, op1, op2) {
      if (depth <= 0) {
        return [ num ]
      }
      const range = (l, r) => Array.from(new Array(r - l + 1), (i, j) => j + l)
      const opMap = { '(': 0, ')': 0, '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 }
      let op = _.sample(operators, 1)
      // the left operator will seize the operation process so that 'equal' should be considers
      let needBracket = opMap[op1] >= opMap[op] || opMap[op2] > opMap[op]
      let leftOpr = 0, rightOpr = 0, tail = [ ]

      switch (op) {
        case '+':
          rightOpr = _.sample(range(this.range.min, num - 1))
          leftOpr = num - rightOpr
          // when num is 1, the operator should be changed to minus
          if (!rightOpr) {
            op = '-'
            rightOpr = _.sample(range(this.range.min, this.range.max))
            leftOpr = num + rightOpr
          }
          break
        case '-':
          rightOpr = _.sample(range(this.range.min, this.range.max))
          leftOpr = num + rightOpr
          break
        case '*':
          rightOpr = _.sample(range(2, Math.max(2, Math.floor(num / 2))))
          leftOpr = Math.ceil(num / rightOpr)
          // if the result is not integer, transform the expression a * b into a' * b' +(-) c
          if (leftOpr * rightOpr !== num) {
            tail = [ leftOpr * rightOpr > num ? '-' : '+', Math.abs(leftOpr * rightOpr - num) ]
            needBracket = opMap[op1] >= opMap[tail[0]] || opMap[op2] > opMap[tail[0]]
          }
          break
        case '/':
          rightOpr = _.sample(range(2, this.range.max))
          leftOpr = num * rightOpr
          break
        case '^':
          rightOpr = _.sample(range(2, Math.max(2, Math.ceil(Math.log(num) / Math.log(2)))))
          leftOpr = Math.ceil(num ** (1 / rightOpr))
          // if the result is not integer, transform the expression a ^ b into a' ^ b' +(-) c
          if (leftOpr ** rightOpr !== num) {
            tail = [ leftOpr ** rightOpr > num ? '-' : '+', Math.abs(leftOpr ** rightOpr - num) ]
            needBracket = opMap[op1] >= opMap[tail[0]] || opMap[op2] > opMap[tail[0]]
          }
          break
      }

      // flag = 1: only expand left operand
      // flag = 2: only expand right operand
      // flag = 3: expand both left and right operands
      const flag = _.sample([ 1, 2 ], 1)
      const leftExpr = this.expandExpression(leftOpr, operators, (flag === 1 || flag === 3) ? depth - 1 : 0, needBracket ? '(' : op1, op)
      // the right operator should be handled differently, because the '*' or '^' will
      // create a `tail`, so the right operator of `rightOpr` will also change
      const rightExpr = this.expandExpression(rightOpr, operators, (flag === 2 || flag === 3) ? depth - 1 : 0, op, tail.length > 0 ? tail[0] : (needBracket ? ')' : op2))
      return _.concat(needBracket ? [ '(' ] : [ '' ], leftExpr, op, rightExpr, tail, needBracket ? [ ')' ] : [ '' ])
    },

    async generateExpression (button) {
      button.loading = true
      await new Promise(resolve => setTimeout(resolve, 500))
      const operators = _.flatMap(this.checkboxes.checkedList, item => _.find(this.checkboxes.group, { value: item }).operators)
      this.answer = _.sample(Array.from(new Array(this.range.max - this.range.min + 1), (i, j) => j + this.range.min + 1))
      this.expression = this.expandExpression(this.answer, operators, this.difficulty, null, null).join(' ').replace(/\s\s+/g, ' ').trim()
      button.loading = false
    },

    /**
     * @deprecated 2019.02.18
     *
     * primary algorithm, basic mechanism is as follows
     * 1. generate a series of numbers
     * 2. insert operators between numbers
     * 3. insert brackets between number and operator
     * but in this way the expression generated often can not be calculate,
     * so I decide to generate it in another way: expanding
     * @param button
     * @return {Promise<void>}
     */
    async __generateExpression (button) {
      button.loading = true
      await new Promise(resolve => setTimeout(resolve, 500))
      const exprSize = this.difficulty + 1
      const numbers = Array.from(new Array(this.range.max - this.range.min + 1), (val, idx) => idx + this.range.min)
      const operators = _.flatMap(this.checkboxes.checkedList, item => _.find(this.checkboxes.group, { value: item }).operators)
      // select `exprSize` numbers and `exprSize - 1` operators
      const nums = _.sampleSize(_.shuffle(_.flatMap(numbers, val => _.fill(new Array(exprSize), '' + val))), exprSize)
      const ops = _.sampleSize(_.shuffle(_.flatMap(operators, val => _.fill(new Array(exprSize), val))), exprSize - 1)
      // cross merge `nums` and `ops`
      ops.forEach((val, idx) => nums.splice(2 * idx + 1, 0, val))
      // judges whether a token is a number, the token includes '|' also counts, such as '(|1|+|2|)|'
      // the following sentence is also right but too ugly, using `ops` is more clear
      // const isDigit = token => token !== undefined && (!_.isNaN(Number(token)) || token.includes('|'))
      const isDigit = token => token !== undefined && !ops.includes(token)
      // add brackets
      const bracketNum = Math.floor(this.difficulty / 2)
      if (this.checkboxes.checkedList.includes('bracket')) {
        for (let i = 0; i < bracketNum; ++i) {
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
          // distance restriction between `min` and `max` so that there will
          // be not exist expressions such as `1 + (2) + 3` or (((1 + 2 + 3)))
          const minDist = 3
          const maxDist = (Math.ceil(nums.length / 2) - bracketNum + i) * 2 - 1
          while (max - min > maxDist) {
            max -= 2
            min += 2
          }
          if (max - min < minDist) {
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

      const validate = () => {
        try {
          // eslint-disable-next-line no-eval
          eval(this.expression)
          return true
        } catch (error) {
          return false
        }
      }
      // invalidate the generated expression
      if (!validate()) {
        this.generateExpression(button)
      }
      button.loading = false
    }
  },

  watch: {
    'checkboxes.checkedList' (val) {
      const disabled = !(val.includes('add-sub') || val.includes('mul-div') || val.includes('power'))
      // eslint-disable-next-line no-return-assign
      this.buttons.forEach(button => button.disabled = disabled)
      this.range.max = val.includes('manual-easy') ? 10 : 100
    }
  }
}
</script>
