<template>
  <div class="receipt_table_wrapper">
    <div class="sort_export_wrapper">
      <SortSelect class="sort_prop_select" @updateSortBy="onUpdateSortBy"></SortSelect>
      <button v-if="type==='database'" :class="toThemeClass('export_bt')" @click="exportExcel">
        {{ multLang({'cn': '导出芳名版', 'en': 'Export Excel'}) }}
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg>
      </button>
    </div>
    <div class="receipt_table_bottom_wrapper">
      <ReceiptTableHeader></ReceiptTableHeader>
      <div v-if="items.length === 0 && !setEmpty" :class="toThemeClass('receipt_table_no_result_wrapper')">
        <div class="receipt_table_no_result_lottie"></div>
        <p v-if="type==='database'">
          {{  multLang({'cn': '数据库暂时没有找到数据哦', 'en': 'No data found in the database'}) }}
        </p>
        <p v-else>
          {{  multLang({'cn': '回收站暂时没有找到数据哦', 'en': 'No data found in the trash'}) }}
        </p>
      </div>
      <transition-group v-else name="list" appear 
        v-bind:css="false"
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:before-leave="beforeLeave"
        v-on:leave="leave">
        <ReceiptItem v-for="(item, index) in this.currentPageItems" :key="item._id" :style="'z-index:' + (numPerPage-index)" :data-index="index" :propItem="item" @updateData="onUpdateData" @deleteData="onDeleteData" @recoverData="onRecoverData"></ReceiptItem>
      </transition-group>
      <pagination class="pagination" :pageNum="pageNum" :page.sync="page"></pagination>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import ReceiptItem from './ReceiptItem.vue'
import ReceiptTableHeader from './ReceiptTableHeader.vue'
import SortSelect from './SortSelect.vue'
import Pagination from './Pagination.vue'
import _ from 'lodash'
import xlsxGenerator from '../libs/XLSXGenerator.js'
import $ from 'jquery'
import lottie from 'lottie-web'
import noResultAnimJson from '../assets/lotties/lottie-noResult.json'
const dialog = require('electron').remote.dialog

export default {
  name: 'ReceiptTable',
  components: {
    ReceiptItem,
    ReceiptTableHeader,
    SortSelect,
    Pagination
  },
  props: {
    type: String
  },
  data () {
    return {
      page: 1,
      numPerPage: 10,
      sortBy: 'date',
      order: 'desc',
      setEmpty: false
    }
  },
  computed: {
    // items: 收据数据
    items: function () {
      if (this.setEmpty === true) return []
      if (this.type === 'database') {
        return this.$store.getters.normalDatas
      } else if (this.type === 'trash') {
        return this.$store.getters.trashDatas
      }
    },
    // orderedItems: 排序后的收据数据
    orderedItems: function () {
      return _.orderBy(this.items, [this.sortBy, 'receiptIndex'], [this.order, 'desc'])
    },
    // currentPageItems: 排序后的当前页的收据数据
    currentPageItems () {
      return _.chunk(this.orderedItems, this.numPerPage)[this.page - 1]
    },
    // pageNum: 数据库页数
    pageNum () {
      return Math.ceil(this.items.length / this.numPerPage)
    }
  },
  methods: {
    // onUpdateData: 当有数据更新的时候回调函数
    onUpdateData: function (newItem, oldItem) {
      this.$store.dispatch('updateReceiptData', {
        newItem, oldItem
      })
    },
    // onDeleteData: 当有数据删除的时候回调函数
    onDeleteData: function (data) {
      this.$store.dispatch('deleteReceiptData', data)
    },
    // onDeleteData: 当有数据回收的时候回调函数
    onRecoverData: function (data) {
      this.$store.dispatch('recoverReceiptData', data)
    },
    // onUpdateSortBy: 当有数据更新的时候回调函数
    onUpdateSortBy (sortByData) {
      this.numPerPage = parseInt(sortByData.numPerPage)
      this.order = sortByData.order
      this.sortBy = sortByData.sortBy
      this.page = 1
    },
    // exportExcel: 导出excel芳名版文件
    exportExcel () {
      let fileName = dialog.showSaveDialog({
        title: this.multLang({'cn': '保存芳名版位置', 'en': 'Choose A Save Location'}),
        filters: [
          { name: 'EXCEL', extensions: ['xlsx'] }
        ]
      })
      if (fileName) {
        try {
          xlsxGenerator.generateXLSX(this.orderedItems, fileName)
        } catch (err) {
          this.$store.commit('setAlert', {
            title: this.multLang({'cn': '保存芳名版表格失败', 'en': 'Failed to Save'}),
            desc: err.message,
            level: 2
          })
          console.log(Object.keys(err))
          console.log(err)
          return
        }
        this.$store.commit('setAlert', {
          title: this.multLang({'cn': '导出芳名版表格成功', 'en': 'Success!'}),
          desc: this.multLang({'cn': `保存至：${fileName}`, 'en': `Save to：${fileName}`}),
          level: 0
        })
        console.log('save finished')
      }
    },
    // beforeEnter：列表动画进入前
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.transform = 'translateX(-400px)'
    },
    // enter：列表动画开始进入
    enter: function (el, done) {
      var delay = el.dataset.index * 100 / Math.max(1, (this.currentPageItems.length / 10))
      setTimeout(function () {
        el.style.opacity = 1
        el.style.transform = 'translateX(0px)'
        done()
      }, delay)
    },
    // beforeLeave：列表动画离开前
    beforeLeave: function (el) {
      if (this.setEmpty === true) {
        el.style.position = 'absolute'
        el.style.transition = 'all 0s'
      } else {
        el.style.position = 'absolute'
        el.style.transition = 'all 0.5s'
      }
    },
    // leave：列表动画开始离开
    leave: function (el, done) {
      if (this.setEmpty === true) {
        done()
      } else {
        var delay = 0 * 100
        setTimeout(function () {
          el.style.opacity = 0
          el.style.transform = 'translateX(400px)'
          setTimeout(() => done(), 500)
        }, delay)
      }
    },
    // anim：无数据时播放提示icon动画
    anim () {
      if (!this.setEmpty && this.items.length === 0 && $('.receipt_table_no_result_lottie svg', this.$el).length === 0) {
        lottie.loadAnimation({
          container: $('.receipt_table_no_result_lottie', this.$el)[0],
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: noResultAnimJson
        })
      }
    }
  },
  watch: {
    items (newVal) {
      if (newVal.length === 0) {
        Vue.nextTick(function () {
          this.anim()
        }.bind(this))
      }
    }
  }
}
</script>

<style>
.receipt_table_wrapper {
  position: relative;
}
.sort_export_wrapper {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 20px 40px;
  padding-bottom: 0px;
  position: absolute;
  z-index: 99;
}
.export_bt {
  width: 120px;
  height: 30px;
  border-radius: 15px;
  color: #fff;
  box-shadow: 0px 10px 30px 0px rgba(76, 145, 224, 0.34);
  background-color: #6076ff;
}
.export_bt:hover {
  background-color: #5365d8;
}

.receipt_table_bottom_wrapper {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 20px;
  padding-bottom: 0;
  position: absolute;
  left: 0;
  top: 50px;
}
.pagination {
  margin-top: 20px;
  margin-bottom: 20px;
}
.receipt_table_no_result_wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  font-size: 18px;
  font-weight: bolder;
}
.receipt_table_no_result_wrapper_white {
  color: black;
  opacity: 0.18;
}
.receipt_table_no_result_wrapper_black {
  color: white;
  opacity: 0.25;
}
.receipt_table_no_result_lottie {
  width: 200px;
  height: 200px;
}
</style>
