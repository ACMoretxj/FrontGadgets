<template>
  <div class="component-generate-expression">
    <v-head :title="title"/>
    <h1>{{ title }}</h1>

    <a-row type="flex" justify="center" align="middle" style="margin: 24px 0 24px 0;">
      <a-col :span="8">
        <a-row type="flex" justify="start" align="middle">
          <a-col :span="24">
            <div :style="{ borderBottom: '1px solid #E9E9E9' }">
              <a-checkbox :indeterminate="checkboxes.checkAll.indeterminate" @change="onCheckAllChange" :checked="checkboxes.checkAll.checked">全选</a-checkbox>
            </div>
            <br />
            <a-checkbox-group :options="checkboxes.group" v-model="checkboxes.checkedList" @change="onCheckChange" />
          </a-col>
        </a-row>
      </a-col>

      <a-col>
        <a-select defaultValue="lucy" style="width: 120px" @change="handleChange">
          <a-select-option v-for="item in selectOptions" value="item">{{ item }}</a-select-option>
        </a-select>
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
      title: '表达式转换器',
      buttons: [
        { text: '生成表达式', alias: 'generate-expression', handler: this.generateExpression, loading: false }
      ],
      checkboxes: {
        checkAll: { indeterminate: false, checked: false },
        group: [ '混合运算', '乘方符号', '带有括号' ],
        checkedList: []
      },
      selectOptions: Array.from(new Array(10), (val, index) => index),
      expression: '(19 - 10) * ((2 ^ 17 + 32) + 5) + 1 + 2 + 3'
    }
  },

  methods: {
    onCheckAllChange (e) {
      Object.assign(this, {
        'checkboxes.checkedList': e.target.checked ? this.checkboxes.group : [],
        'checkboxes.checkAll.indeterminate': false,
        'checkboxes.checkAll.checked': e.target.checked
      })
    },

    onCheckChange (checkedList) {
      this.checkboxes.checkAll.indeterminate = !!checkedList.length && (checkedList.length < this.checkboxes.group.length)
      this.checkboxes.checkAll.checked = checkedList.length === this.checkboxes.group.length
    },

    generateExpression () {
      this.expression = _.reverse(this.expression.split('')).join('')
    }
  }
}
</script>

<style scoped>

</style>
