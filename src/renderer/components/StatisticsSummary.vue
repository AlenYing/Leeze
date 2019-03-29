<template>
  <div :class="toThemeClass('statistics_summary_wrapper')">
    <p :class="toThemeClass('statistics_summary_desc')">{{data.desc}}</p>
    <div class="statistics_data_wrapper">
      <div class="statistics_summary_num_wrapper">
        <p class="statistics_summary_num">
          <span class="statistics_summary_number">
            {{data.number}}
          </span>
          <span class="statistics_summary_unit">
            {{data.unit}}
          </span>
        </p>
        <p :class="data.lastNumber > data.number ? 'percent_change percent_change_down' : 'percent_change percent_change_up'">
          <span v-if="data.lastNumber > data.number && data.lastNumber !== 0">-</span>
          <span v-else-if="data.lastNumber !== 0">+</span>
            {{percentChange}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>

import * as d3 from 'd3'
import accounting from 'accounting'
export default {
  name: 'StatisticsSummary',
  props: {
    data: Object
  },
  computed: {
    // formatNumber：对金额进行格式化，添加千分号
    formatNumber () {
      return accounting.format(this.data.number)
    },
    // percentChange：对比昨日增长额
    percentChange () {
      let result = ''
      if (this.data.lastNumber === 0) {
        result += this.multLang({'cn': '昨日无数据', 'en': 'No Data Yesterday'})
      } else {
        result += Math.abs(Math.floor((this.data.number - this.data.lastNumber) / this.data.lastNumber * 1000)) / 10 + '%'
      }
      return result
    },
    numberSelection () {
      return d3.select(this.$el).select('.statistics_summary_number')
    }
  },
  watch: {
    // 监听梗概数据，如果变化，则进行数字跳动动画
    data: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.numberSelection.transition()
          .duration(500)
          .tween('text', function () {
            var that = d3.select(this)
            var i = d3.interpolateNumber(that.text().replace(/,/g, ''), newVal.number)
            return function (t) {
              that.text(accounting.format(i(t)))
            }
          })
      }
    }
  }
}
</script>

<style>
.statistics_summary_wrapper {
  border-radius: 8px;
  position: relative;
}
.statistics_summary_wrapper_white {
  background-color: #fff;
}
.statistics_summary_wrapper_black {
  background-color: #202020;
}
.statistics_data_wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 0px 20px;
  padding-top: 10px;
  flex-direction: column;
  box-sizing: border-box;
}
.statistics_summary_num_wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.percent_change {
  height: 16px;
  padding: 0 4px;
  box-sizing: border-box;
  border-radius: 8px;
  color: white;
  line-height: 16px;
  margin-left: 15px;
  font-size: 9px;
}
.percent_change_up {
  background-color: #40d16e;
}
.percent_change_down {
  background-color: #ff6955;
}
.statistics_summary_num {
  color: #6076ff;
  font-weight: bolder;
  font-size: 24px;
  margin-bottom: 4px;
}
.statistics_summary_unit {
  color: #6076ff;
  font-weight: normal;
  font-size: 16px;
  margin-left: 5px;
}
.statistics_summary_desc {
  font-weight: bold;
  font-size: 12px;
  position: absolute;
  left: 20px;
  top: 20px;
}
.statistics_summary_desc_white {
  color: #202020;
}
.statistics_summary_desc_black {
  color: #d0d0d0;
}
</style>
