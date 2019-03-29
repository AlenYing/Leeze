<template>
  <div :class="toThemeClass(isEditMode ? 'receipt_item_wrapper receipt_item_wrapper_edit' : 'receipt_item_wrapper')">
    <div @click="onSelected" class='receipt_item_data_wrapper'>
      <DateInput class="receipt_item_p receipt_item_date_picker" name="date"  place-holder=""  v-bind:propValue.sync="itemData.date" v-if="isEditMode"></DateInput>
      <p class="receipt_item_p receipt_item_date" v-else>{{propItem.date}}</p>
      <input class="receipt_item_p receipt_item_name" type="text" v-if="isEditMode" v-model="itemData.name"/>
      <p class="receipt_item_p receipt_item_name" v-else>{{propItem.name}}</p>
      <input class="receipt_item_p receipt_item_amount" type="text" v-if="isEditMode" v-model="itemData.amount"  @input="limitNumberFunc(itemData.amount)"/>
      <p class="receipt_item_p receipt_item_amount" v-else>￥{{formatAmount}}</p>
      <input class="receipt_item_p receipt_item_payee" type="text" v-if="isEditMode" v-model="itemData.payee"/>
      <p class="receipt_item_p receipt_item_payee" v-else>{{propItem.payee}}</p>
      <input class="receipt_item_p receipt_item_issuer" type="text" v-if="isEditMode" v-model="itemData.issuer"/>
      <p class="receipt_item_p receipt_item_issuer" v-else>{{propItem.issuer}}</p>
      <input class="receipt_item_p receipt_item_comment" type="text" v-if="isEditMode" v-model="itemData.comment"/>
      <p class="receipt_item_p receipt_item_comment" v-else>{{propItem.comment}}</p>
    </div>
    <div :class="isEditMode ? 'receipt_item_bts_wrapper receipt_item_bts_wrapper_show' : 'receipt_item_bts_wrapper receipt_item_bts_wrapper_hide'">

        <button class="receipt_item_bt receipt_item_cancel_bt" @click="onCancel">
          {{ multLang({'cn': '取消', 'en': 'Cancel'}) }}
        </button>
        <button class="receipt_item_bt receipt_item_save_bt" @click="onSave" >
          {{ multLang({'cn': '保存', 'en': 'Save'}) }}
        </button>

        <button v-if="!propItem.deleted" v-show="isEditMode" :class="deleteComfirmed ? 'receipt_item_delete_bt receipt_item_delete_bt_comfirmed' : 'receipt_item_delete_bt receipt_item_delete_bt_uncomfirmed'" @click="onDelete" >
          <span v-show="!deleteComfirmed">
            {{ multLang({'cn': '删除', 'en': 'Delete'}) }}
          </span>
          <span v-show="deleteComfirmed">
            {{ multLang({'cn': '确认删除', 'en': 'Comfirm?'}) }}
          </span>
        </button>

        <button v-else v-show="isEditMode" :class="recoverComfirmed ? 'receipt_item_recover_bt receipt_item_recover_bt_comfirmed' : 'receipt_item_recover_bt receipt_item_recover_bt_uncomfirmed'" @click="onRecover" >
          <span v-show="!recoverComfirmed">
            {{ multLang({'cn': '恢复', 'en': 'Recover'}) }}
          </span>
          <span v-show="recoverComfirmed">
            {{ multLang({'cn': '确认恢复', 'en': 'Comfirm?'}) }}
          </span>
        </button>
    </div>
  </div>
</template>

<script>
import DateInput from './DateInput.vue'
import moment from 'moment'
import accounting from 'accounting'
export default {
  name: 'ReceiptItem',
  data () {
    return {
      isEditMode: false,
      deleteComfirmed: false,
      recoverComfirmed: false,
      itemData: {
        name: '',
        amount: '',
        payee: '',
        issuer: '',
        date: new Date(),
        comment: '',
        deleted: false
      }
    }
  },
  components: {
    DateInput
  },
  props: {
    propItem: Object
  },
  computed: {
    // formatAmount：格式化金额数字
    formatAmount () {
      return accounting.format(this.propItem.amount)
    }
  },
  methods: {
    // limitNumberFunc：限制只能输入数字
    limitNumberFunc (num) {
      num = '' + num
      num = num.replace(/[^\d.]/g, '')
      num = num.replace(/\.{2,}/g, '.')
      num = num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      num = num.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      if (num.indexOf('.') < 0 && num !== '') {
        num = parseFloat(num)
      }
      this.itemData.amount = num.toString()
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
    // isDataDirty：判断数据是否有修改
    isDataDirty () {
      return this.itemData.name.trim() !== this.propItem.name ||
                this.itemData.amount !== this.propItem.amount ||
                this.itemData.payee.trim() !== this.propItem.payee ||
                this.itemData.issuer.trim() !== this.propItem.issuer ||
                moment(this.itemData.date).format('YYYY-MM-DD') !== this.propItem.date ||
                this.itemData.comment.trim() !== this.propItem.comment
    },
    // isDataCompleted：判断数据是否完整
    isDataCompleted () {
      let errorMsg = ''
      errorMsg += this.itemData.name === '' ? this.multLang({'cn': '捐款人 ', 'en': 'Donor '}) : ''
      errorMsg += this.itemData.amount === '' ? this.multLang({'cn': '金额 ', 'en': 'Amount '}) : ''
      errorMsg += this.itemData.date === null ? this.multLang({'cn': '日期 ', 'en': 'Date '}) : ''
      errorMsg += this.itemData.payee === '' ? this.multLang({'cn': '收款人 ', 'en': 'Payee '}) : ''
      errorMsg += this.itemData.issuer === '' ? this.multLang({'cn': '开票人 ', 'en': 'Issuer '}) : ''
      return errorMsg
    },
    // toEditMode： 进入编辑模式
    toEditMode () {
      this.itemData.name = this.propItem.name
      this.itemData.amount = this.propItem.amount
      this.itemData.payee = this.propItem.payee
      this.itemData.issuer = this.propItem.issuer
      this.itemData.date = moment(this.propItem.date).toDate()
      this.itemData.comment = this.propItem.comment
    },
    // onSelected: 当该item被点击时回调函数
    onSelected (e) {
      if (!this.isEditMode) {
        this.isEditMode = true
        this.deleteComfirmed = false
        this.toEditMode()
      }
    },
    // onCancel: 当取消编辑时候回调函数
    onCancel () {
      this.isEditMode = false
    },
    // onSave: 当保存编辑时候回调函数
    onSave () {
      let errorMsg = this.isDataCompleted()
      if (errorMsg !== '') {
        this.$store.commit('setAlert', {
          title: this.multLang({'cn': '信息填写不全', 'en': 'Incompleted Data'}),
          desc: errorMsg + this.multLang({'cn': '不可为空', 'en': 'Should be filled'}),
          level: 2
        })
      } else if (this.isDataDirty()) {
        console.log('dirty')
        let newItem = {
          _id: this.propItem._id,
          receiptIndex: this.propItem.receiptIndex,
          name: this.html_encode(this.itemData.name),
          amount: this.itemData.amount,
          payee: this.html_encode(this.itemData.payee),
          issuer: this.html_encode(this.itemData.issuer),
          comment: this.html_encode(this.itemData.comment)
        }
        newItem.date = moment(this.itemData.date).format('YYYY-MM-DD')
        newItem.deleted = this.propItem.deleted
        let oldItem = {
          ...this.propItem
        }
        this.$emit('updateData', newItem, oldItem)
        this.isEditMode = false
      } else {
        this.isEditMode = false
      }
    },
    // onDelete: 当删除该item时候回调函数
    onDelete () {
      if (this.deleteComfirmed) {
        this.$emit('deleteData', this.propItem)
      } else {
        this.deleteComfirmed = true
      }
    },
    // onDelete: 当回收该item时候回调函数
    onRecover () {
      if (this.recoverComfirmed) {
        this.$emit('recoverData', this.propItem)
      } else {
        this.recoverComfirmed = true
      }
    }
  }
}
</script>

<style>
.receipt_item_wrapper {
  width: 100%;
  height: 40px;
  margin-top: 6px;
  position: relative;
  padding: 0 10px;
  box-sizing: border-box;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0px 0px 50px 0px rgba(76, 145, 224, 0.14);
}
.receipt_item_wrapper_white:hover {
  background-color: #c3e0c3;
}
.receipt_item_wrapper_black:hover {
  background-color: #c3e0c3;
  color: #686868;
}
.receipt_item_wrapper_white {
  background-color: #fff;
  /* color: #666666; */
}
.receipt_item_wrapper_black {
  background-color: #202020;
  /* color: #aaaaaa; */
}
.receipt_item_wrapper_edit {
  height: 100px;
  background: #40d16e;
}
.receipt_item_wrapper_edit:hover {
  background: #40d16e;
}
.receipt_item_data_wrapper {
  width: 100%;
  height: 40px;
  z-index: 10;
  display: flex;
  justify-content: space-between;
}
.receipt_item_bts_wrapper {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    transition: all 0.3s;
    position: relative;
    margin-top: 10px;
    padding-right: 10px;
    box-sizing: border-box;
}
.receipt_item_bts_wrapper_hide {
    opacity: 0;
    pointer-events: none;
}
.receipt_item_bts_wrapper_show {
    opacity: 1;
    pointer-events: all;
}
.receipt_item_bt {
    width: 60px;
    height: 30px;
    background-color: #fff;
    font-weight: bolder;
    color: #40d16e;
    margin-left: 10px;
}
.receipt_item_bt:hover {
    background-color: #dddddd;
}
.receipt_item_generate_bt {
  margin-right: auto;
}
.receipt_item_p {
  height: 40px;
  line-height: 40px;
  margin-left: 10px;
  display: inline-block;
}
.receipt_item_p:last-child {
  margin-right: 10px;
}
.receipt_item_name, .receipt_item_payee, .receipt_item_issuer {
  width: 12%;
}
.receipt_item_date, .receipt_item_date_picker {
  width: 14%;
  min-width: 80px;
}
.receipt_item_comment {
  width: 28%;
}
.receipt_item_amount {
  width: 12%;
}
input.receipt_item_p, .receipt_item_date_picker {
  padding: 5px;
  height: 30px;
  margin-top: 15px;
  margin-bottom: 5px;
  line-height: 30px;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  color: #444444;
  font-size: 12px;
  box-sizing: border-box;
}
.receipt_item_delete_bt {
    position: absolute;
    left: 0;
    transition: all 0.3s;
    font-weight: bolder;
    margin-left: 10px;
}
.receipt_item_delete_bt_uncomfirmed {
    background-color: #fff;
    color: #40d16e;
    width: 60px;
    height: 30px;
}
.receipt_item_delete_bt_comfirmed {
    background-color: #ff6955;
    color: #fff;
    width: 80px;
    height: 30px;
}
.receipt_item_delete_bt_uncomfirmed:hover {
    background-color: #dddddd;
}
.receipt_item_delete_bt_comfirmed:hover {
    background-color: #eb604e;
    color: #fff;
}
.delete_bt_anim-enter-active, .delete_bt_anim-leave-active {
  transition: all .3s ease;
}
.delete_bt_anim-enter, .delete_bt_anim-leave-to {
  opacity: 0;
  transform: scale(0);
}
.receipt_item_recover_bt {
    position: absolute;
    left: 0;
    transition: all 0.3s;
    font-weight: bolder;
    margin-left: 1%;
}
.receipt_item_recover_bt_uncomfirmed {
    background-color: #fff;
    color: #40d16e;
    width: 60px;
    height: 30px;
}
.receipt_item_recover_bt_comfirmed {
    background-color: #2693e0;
    color: #fff;
    width: 80px;
    height: 30px;
}
.receipt_item_recover_bt_uncomfirmed:hover {
    background-color: #dddddd;
}
.receipt_item_recover_bt_comfirmed:hover {
    background-color: #2693e0;
    color: #fff;
}
</style>
