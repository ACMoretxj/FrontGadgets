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
              <a-slider :min="6" :max="64" v-model="passwordLength" :tipFormatter="val => `长度 ${val}`">密码长度</a-slider>
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
        <a-input size="large" v-model="password" placeholder="生成结果" :disabled="true"/>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center" align="middle" :hidden="password.length <= 0">
      <a-col :span="8">
        <a-alert :message="`需要 ${timeDecipher} 可以破解`" type="success" style="margin-top: 15px;"/>
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
  name: 'PasswordGenerator',
  components: { VHead, ACol, ARow },

  data () {
    return {
      title: '密码生成器',
      passwordLength: 6,
      buttons: [
        { text: '生成密码', alias: 'generate-password', handler: this.generatePassword, disabled: true, loading: false }
      ],
      checkboxes: {
        checkAll: { indeterminate: false, checked: false },
        group: [
          { label: '大写字母', value: 'upper-case', tokens: Array.from(new Array(26), (item, idx) => String.fromCharCode('A'.charCodeAt(0) + idx)) },
          { label: '小写字母', value: 'lower-case', tokens: Array.from(new Array(26), (item, idx) => String.fromCharCode('a'.charCodeAt(0) + idx)) },
          { label: '数字', value: 'number', tokens: Array.from(new Array(10), (item, idx) => idx) },
          { label: '特殊字符', value: 'special-character', tokens: '@#$%^&*'.match(/./g) }
        ],
        checkedList: []
      },
      password: '',
      timeDecipher: ''
    }
  },

  methods: {
    onCheckAllChange (e) {
      Object.assign(this.checkboxes, {checkedList: e.target.checked ? _.map(this.checkboxes.group, item => item.value) : []})
      Object.assign(this.checkboxes.checkAll, {indeterminate: false, checked: e.target.checked})
    },

    onCheckChange (checkedList) {
      this.checkboxes.checkAll.indeterminate = !!checkedList.length && (checkedList.length < this.checkboxes.group.length)
      this.checkboxes.checkAll.checked = checkedList.length === this.checkboxes.group.length
    },

    async generatePassword (button) {
      button.loading = true
      await new Promise(resolve => setTimeout(resolve, 500))
      const tokens = this.checkboxes.group.filter(item => this.checkboxes.checkedList.includes(item.value)).map(item => item.tokens)
      const rangeTokens = _.flatMap(_.flatMap(tokens), op => new Array(this.passwordLength).fill(op))
      const results = _.concat(tokens.map(_.sample), _.sampleSize(rangeTokens, this.passwordLength - this.checkboxes.checkedList.length))
      this.password = _.shuffle(results).join('')
      button.loading = false
    }
  },

  watch: {
    'checkboxes.checkedList' (val) {
      const disabled = val.length <= 0
      this.buttons.forEach(button => (button.disabled = disabled))
    },

    password () {
      const tokens = this.checkboxes.group.filter(item => this.checkboxes.checkedList.includes(item.value)).map(item => item.tokens)
      // suppose that the normal computer can try 100 password per microsecond
      let cost = Math.max(_.flatMap(tokens).length ** this.passwordLength / 100, 1)
      const units = [
        [ '微秒', 1 ], [ '毫秒', 1000 ], [ '秒', 1000 ], [ '分', 60 ], [ '时', 60 ],
        [ '天', 24 ], [ '周', 7 ], [ '月', 4 ], [ '年', 52 ], [ '世纪', 100 ],
        [ '万世纪', 10000 ], [ '百万世纪', 100 ], [ '亿世纪', 100 ], [ '万亿世纪', 10000 ],
        [ '百万亿世纪', 100 ], [ '亿亿世纪', 100 ]
      ]
      for (let i in units) {
        const unit = units[i]
        if (cost / unit[1] < 1) {
          return (this.timeDecipher = `${Math.ceil(cost)}${units[i - 1][0]}`)
        }
        cost /= unit[1]
      }
      this.timeDecipher = `${Math.ceil(cost)}${_.last(units)[0]}`
    }
  }
}
</script>
