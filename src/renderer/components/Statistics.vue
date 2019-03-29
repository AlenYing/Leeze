<template>
  <div class="statistics_wrapper">
    <div class="statistics_top_wrapper">
      <StatisticsSummary class="statistics_summary" :data="todaySummary"></StatisticsSummary>
      <StatisticsSummary class="statistics_summary" :data="amountSummary"></StatisticsSummary>
      <StatisticsSummary class="statistics_summary" :data="quantitySummary"></StatisticsSummary>
    </div>
    <CruveGraph :class="toThemeClass('cruve_graph')" :propData="amountByDate"></CruveGraph>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import * as d3 from 'd3'
import StatisticsSummary from './StatisticsSummary'
import CruveGraph from './CruveGraph'
import electron from 'electron'
const ipcRenderer = electron.ipcRenderer
export default {
  name: 'Statistics',
  data () {
    return {
      initComplete: false
    }
  },
  components: {
    StatisticsSummary,
    CruveGraph
  },
  computed: {
    // items：数据库里的收据数据
    items () {
      return this.$store.getters.normalDatas
    },
    // amountSum：数据库里的收据金额总额
    amountSum () {
      let res = 0
      for (let key in this.amountByDate) {
        res += this.amountByDate[key].amount
      }
      return res
    },
    // todaySummary：今日捐款梗概数据
    todaySummary () {
      let today = this.amountByDate['prev' + 0] ? this.amountByDate['prev' + 0].amount : 0
      let yesterday = this.amountByDate['prev' + 1] ? this.amountByDate['prev' + 1].amount : 0
      return {
        number: today,
        lastNumber: yesterday,
        unit: '￥',
        desc: this.multLang({'cn': '今日捐款', 'en': 'Total Today'})
      }
    },
    // amountSummary：历史捐款梗概数据
    amountSummary () {
      let today = this.amountSum
      let yesterday = this.amountByDate['prev' + 0] ? this.amountSum - this.amountByDate['prev' + 0].amount : this.amountSum
      return {
        number: today,
        lastNumber: yesterday,
        unit: '￥',
        desc: this.multLang({'cn': '捐款总额', 'en': 'Total Amount'})
      }
    },
    // quantitySummary：捐款人数梗概数据
    quantitySummary () {
      let today = this.items.length
      let yesterday = this.amountByDate['prev' + 0] ? this.items.length - this.amountByDate['prev' + 0].count : this.items.length
      return {
        number: today,
        lastNumber: yesterday,
        unit: this.multLang({'cn': '人次', 'en': ''}),
        desc: this.multLang({'cn': '捐款人数', 'en': 'Number of Donations'})
      }
    },
    // amountByDate：按一天一天作为时间尺度的收据金额数据
    amountByDate () {
      let res = {}
      let today = moment()
      for (let date of Object.keys(this.$store.state.dateData)) {
        let diff = today.diff(date, 'days')
        res['prev' + diff] = {
          count: this.$store.state.dateData[date].length,
          amount: _.sum(this.$store.state.dateData[date])
        }
      }
      console.log(res)
      return res
    },
    summariesSelection () {
      return d3.select(this.$el).selectAll('.statistics_top_wrapper')
    }
  },
  watch: {
    // 监听amountByDate，当第一次amountByDate值变化（初始化完毕），向主进程发送'init-complete'信息
    amountByDate () {
      if (!this.initComplete) {
        this.initComplete = true
        ipcRenderer.send('init-complete')
      }
    }
  },
  activated () {
    // 进场动画
    this.summariesSelection.style('transition', 'all 0s')
    this.summariesSelection.style('opacity', '0')
    this.summariesSelection.style('width', '0%')
    setTimeout(function () {
      this.summariesSelection.style('transition', 'all 1s ease')
      this.summariesSelection.style('opacity', '1')
      this.summariesSelection.style('width', '100%')
    }.bind(this), 0)
  }
}
</script>

<style>
.statistics_wrapper {
  width: 100%;
  height: 100%;
}
.statistics_top_wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px 20px;
  box-sizing: border-box;
}
.statistics_summary {
  box-shadow: 0px 0px 50px 0px rgba(56, 136, 228, 0.14);
  width: 32%;
  height: 120px;
  transition: all 0.5s ease;
}
.cruve_graph {
  box-shadow: 0px 0px 50px 0px rgba(56, 136, 228, 0.14);
  width: calc(100% - 40px);
  height: calc(100% - 180px);
  margin-left: 20px;
}
.cruve_graph_white {
  background-color: #fff;
}
.cruve_graph_black {
  background-color: #202020;
}
</style>
