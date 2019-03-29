<template>
    <div class="pageination_wrapper" v-if="pageNum > 0">
        <button v-if="showStartPageBt" :class="toThemeClass('page_bt_unselected page_bt')" @click="onClickPageBt">1</button>
        <span v-if="showStartPageBt" class="page_omit">...</span>
        
        <button :class="toThemeClass(page===i ? 'page_bt_selected page_bt' : 'page_bt_unselected page_bt')" v-for="i in pageArray" :key="i" @click="onClickPageBt">{{i}}</button>
        
        <span v-if="showEndPageBt" class="page_omit">...</span>
        <button v-if="showEndPageBt" :class="toThemeClass('page_bt_unselected page_bt')" @click="onClickPageBt">{{pageNum}}</button>
        
        <input v-model="inputPage" :class="toThemeClass('page_input')" @input="limitIntFunc(inputPage)"  @keypress="onKeyPressed"/>
        <button :class="toThemeClass('to_page_bt')" @click="jumpPage">GO</button>
        
        <div class="page_num_indication" ></div>
    </div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
export default {
  name: 'Pageination',
  data () {
    return {
      inputPage: ''
    }
  },
  props: {
    pageNum: Number,
    page: Number
  },
  computed: {
    // pageArray：根据当前页计算，需要出现的页按钮有哪些
    pageArray () {
      let res = []
      for (let i = -2; i <= 2; i++) {
        if (this.page + i > 0 && this.page + i <= this.pageNum) {
          res.push(this.page + i)
        }
      }
      if (res.indexOf(1 + 1) !== -1 && res.indexOf(1) === -1) {
        res.unshift(1)
      }
      if (res.indexOf(this.pageNum - 1) !== -1 && res.indexOf(this.pageNum) === -1) {
        res.push(this.pageNum)
      }
      return res
    },
    // showStartPageBt：是否显示第一页按钮
    showStartPageBt () {
      return this.pageArray.indexOf(1) === -1
    },
    // showEndPageBt：是否显示最后一页按钮
    showEndPageBt () {
      return this.pageArray.indexOf(this.pageNum) === -1
    }
  },
  methods: {
    onClickPageBt: function (e) {
      this.$emit('update:page', parseInt(e.target.innerHTML))
    },
    // jumpPage：页跳转
    jumpPage () {
      if (this.inputPage) {
        this.$emit('update:page', parseInt(this.inputPage))
        this.inputPage = ''
      }
    },
    // limitIntFunc：限制只能数字输入
    limitIntFunc (num) {
      num = num.replace(/[^\d]/g, '')
      if (num === '') {
        this.inputPage = ''
        return
      }
      if (num.indexOf('.') < 0 && num !== '') {
        num = parseInt(num)
      }
      num = Math.min(this.pageNum, num)
      num = Math.max(1, num)
      this.inputPage = num.toString()
    },
    // updateIndicatorPos：更新indicator位置
    updateIndicatorPos (animation) {
      if ($('.page_bt_selected', this.$el)[0]) {
        let left = $('.page_bt_selected', this.$el)[0].offsetLeft
        let width = $('.page_bt_selected', this.$el)[0].offsetWidth
        $('.page_num_indication', this.$el).css('transition', animation ? 'all 0.3s' : 'all 0s').css('left', left + 'px').css('width', width + 'px')
      }
    },
    // onKeyPressed：监听回车键
    onKeyPressed (e) {
      console.log(e)
      if (e.keyCode === 13) {
        this.jumpPage()
      }
    }
  },
  watch: {
    page () {
      Vue.nextTick(function () {
        this.updateIndicatorPos(true)
      }.bind(this))
    },
    pageNum () {
      Vue.nextTick(function () {
        this.updateIndicatorPos(false)
      }.bind(this))
    }
  },
  mounted () {
    Vue.nextTick(function () {
      this.updateIndicatorPos(false)
    }.bind(this))
  }
}
</script>

<style >
.pageination_wrapper {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.page_omit {
  display: inline-block;
  width: 14px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.page_bt {
  min-width: 25px;
  width: auto;
  height: 25px;
  margin: 0 3px;
}
.page_bt_unselected_white {
  color: #202020;
}
.page_bt_unselected_white:hover {
  color: #6076ff;
  background-color: rgba(0, 0, 0, 0.08);
}
.page_bt_unselected_black {
  color: #666666;
}
.page_bt_unselected_black:hover {
  color: #6076ff;
  background-color: rgba(255, 255, 255, 0.08);
}
.page_bt_selected {
  color: #6076ff;
}
.page_bt_selected:hover {
  background-color: rgba(0, 0, 0, 0);
}

.page_num_indication {
  width: 25px;
  height: 25px;
  position: absolute;
  left: 0;
  transition: left 0.3s;
}
.page_num_indication::after {
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  height: 2px;
  background-color: #6076ff;
}
.page_input {
  width: 25px;
  height: 25px;
  border-radius: 4px;
  background-color: #e0e0e0;
  padding: 0 2px;
  text-align: center;
  margin-left: 20px;
}
.page_input_white {
  background-color: #e0e0e0;
  color: #666666;
}
.page_input_black {
  background-color: #444444;
  color: #d0d0d0;
}
.to_page_bt {
  width: 30px;
  height: 25px;
  border-radius: 4px;
  padding: 0 2px;
  text-align: center;
  margin-left: 5px;
  background-color: #6076ff;
}
.to_page_bt:hover {
  background-color: #5365d8;
}
</style>
