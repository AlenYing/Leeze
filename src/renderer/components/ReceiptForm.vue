<template>
    <div class="receipt_form_wrapper">
      <p :class="toThemeClass('new_title')">
        {{ multLang({'cn':'创建新的收据', 'en': 'Create A New Receipt'}) }}
      </p>
      <div class="receipt_input_wrapper">
        <DateInput name="date" style="width:100%; height: 50px;" :place-holder="multLang({'cn':'日期', 'en': 'Date'})"  v-bind:propValue.sync="receiptData.date"></DateInput>
        <TextInput name="name" style="width:100%; height: 50px;" :place-holder="multLang({'cn':'捐款人', 'en': 'Donor'})" v-bind:propValue.sync="receiptData.name"/>
        <TextInput name="amount" style="width:100%; height: 50px;" :place-holder="multLang({'cn':'金额', 'en': 'Amount'})" limitNumber  v-bind:propValue.sync="receiptData.amount"/>
        <TextInput name="payee" style="width:100%; height: 50px;" :place-holder="multLang({'cn':'收款人', 'en': 'Payee'})"  v-bind:propValue.sync="receiptData.payee"/>
        <TextInput name="issuer" style="width:100%; height: 50px;" :place-holder="multLang({'cn':'开票人', 'en': 'Issuer'})"  v-bind:propValue.sync="receiptData.issuer"/>
        <TextInput name="comment" style="width:100%; height: 50px;" :place-holder="multLang({'cn':'备注', 'en': 'Comment'})"  v-bind:propValue.sync="receiptData.comment"/>
      </div>
      <button :class="toThemeClass('submit_receipt_bt')" @click="submitReceipt" >
        <span>
          {{ multLang({'en':'Create', 'cn': '生成收据'})}}
        </span>
      </button>
    </div>
</template>

<script>
import TextInput from './TextInput.vue'
import DateInput from './DateInput.vue'
import moment from 'moment'
import $ from 'jquery'
import digitUppercase from '../libs/DigitUpperCase.js'

export default {
  name: 'ReceiptForm',
  components: {
    TextInput,
    DateInput
  },
  data () {
    return {
      receiptData: {
        name: '',
        amount: '',
        date: new Date(),
        comment: '',
        payee: '',
        issuer: '',
        amountCn: ''
      }
    }
  },
  methods: {
    // submitReceipt：提交表单
    submitReceipt () {
      // 判断关键信息是否为空
      let errorMsg = ''
      errorMsg += this.receiptData.name === '' ? this.multLang({'cn': '捐款人 ', 'en': 'Donor '}) : ''
      errorMsg += this.receiptData.amount === '' ? this.multLang({'cn': '金额 ', 'en': 'Amount '}) : ''
      errorMsg += this.receiptData.date === null ? this.multLang({'cn': '日期 ', 'en': 'Date '}) : ''
      errorMsg += this.receiptData.payee === '' ? this.multLang({'cn': '收款人 ', 'en': 'Payee '}) : ''
      errorMsg += this.receiptData.issuer === '' ? this.multLang({'cn': '开票人 ', 'en': 'Issuer '}) : ''
      // 如果为空，弹出error弹窗
      if (errorMsg !== '') {
        this.$store.commit('setAlert', {
          title: this.multLang({'cn': '信息不全', 'en': 'Incomplete Information'}),
          desc: errorMsg + this.multLang({'cn': '不可为空', 'en': 'Should be filled'}),
          level: 2
        })
      } else {
        this.receiptData.amountCn = digitUppercase(parseInt(this.receiptData.amount))
        let newData = {
          name: this.html_encode(this.receiptData.name),
          amount: this.html_encode(this.receiptData.amount),
          amountCn: this.receiptData.amountCn,
          payee: this.html_encode(this.receiptData.payee),
          issuer: this.html_encode(this.receiptData.issuer),
          comment: this.html_encode(this.receiptData.comment)
        }
        newData.date = moment(this.receiptData.date).format('YYYY-MM-DD')
        this.$store.dispatch('addReceiptData', newData)
        // 清除输入框内容
        $('.text_input', this.$el).val('')
        this.receiptData.name = ''
        this.receiptData.amount = ''
        this.receiptData.payee = ''
        this.receiptData.issuer = ''
        this.receiptData.comment = ''
      }
    },
    // html_encode：转义输入
    html_encode (str) {
      var s = ''
      if (str.length === 0) return ''
      console.log(str)
      s = str.replace(/&/g, '&amp;')
      s = s.replace(/</g, '&lt;')
      s = s.replace(/>/g, '&gt;')
      s = s.replace(/'/g, '&quot;')
      return s.trim()
    },
    // randName：随机生成名字，用于测试
    randName () {
      let name = Math.random().toString(36).substring(2)
      if (name.length > 5) {
        name = name.substring(name.length - 5)
      }
      return name
    },
    // randomData：随机生成收据数据，用于测试
    randomData (num) {
      for (let i = 0; i < num; i++) {
        this.receiptData.name = this.randName()
        this.receiptData.amount = '' + Math.floor(Math.random() * 2000)
        this.receiptData.date = moment().subtract(Math.floor(Math.random() * 30), 'day').toDate()
        this.receiptData.payee = this.randName()
        this.receiptData.issuer = this.randName()
        this.receiptData.comment = this.randName()
        console.log(this.receiptData)
        this.submitReceipt()
      }
    }
  },
  mounted () {
    // this.randomData(2000)
  }
}
</script>

<style>
.receipt_form_wrapper {
    width: 100%;
    height: 100%;
    /* display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center; */
    transition: all 1s;
}
.new_title {
  font-weight: bolder;
  width: 100%;
  text-align: left;
  padding-left: 8%;
  box-sizing: border-box;
  margin-top: 80px;
  letter-spacing: 1px;
  /* font-family: "Microsoft YaHei","黑体","宋体";   */
}
.new_title_white {
  color: #202020;
}
.new_title_black {
  color: #d0d0d0;
}
.receipt_input_wrapper {
  width: 300px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-top: 40px;
}
.submit_receipt_bt {
  width: 120px;
  height: 30px;
  color: #fff;
  margin-top: 50px;
  margin-left: calc(50% - 50px);
  line-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 10px 30px 0px rgba(76, 145, 224, 0.34);
}
.submit_receipt_bt_white {
  color: #fff;
  background-color: #6076ff;
}
.submit_receipt_bt_white:hover {
  background-color: #5365d8;
}
.submit_receipt_bt_black {
  color: #fff;
  background-color: #6076ff;
}
.submit_receipt_bt_black:hover {
  background-color: #5365d8;
}

</style>
