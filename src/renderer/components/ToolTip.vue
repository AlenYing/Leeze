<template>
  <div class="tooltip_wrapper">
    <p class="tooltip_date">{{date}}</p>
    <p ><span class="tooltip_amount">0</span>￥</p>
  </div>
</template>

<script>
import accounting from 'accounting'
import * as d3 from 'd3'
export default {
  name: 'ToolTip',
  props: {
    toolTipData: Object
  },
  data () {
    return {
      date: ''
    }
  },
  computed: {
    tooltip () {
      return d3.select(this.$el)
    },
    tooltipAmount () {
      return d3.select(this.$el).select('.tooltip_amount')
    }
  },
  watch: {
    toolTipData: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.date = newVal.date
        let tipWidth = this.tooltip.node().getBoundingClientRect().width
        let tipHeight = this.tooltip.node().getBoundingClientRect().height
        this.tooltip.style('opacity', 1).style('transform', 'translate3D(' + (newVal.left - tipWidth / 2) + 'px,' + (newVal.top - tipHeight - 12) + 'px,0px')

        this.tooltipAmount.transition()
          .duration(500)
          .tween('text', function () {
            var that = d3.select(this)
            var i = d3.interpolateNumber(that.text().replace(/,/g, ''), newVal.amount)
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

.tooltip_wrapper {
  width: auto;
  height: 34px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 8px 12px;
  color: #6076ff;
  font-weight: bold;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0px 0px 30px 0px rgba(0, 20, 30, 0.1);
  opacity: 0;
  transition: all 0.4s ease;
}
.tooltip_date {
  font-size: 10px;
  letter-spacing: 1px;
}
.tooltip_amount {
  font-size: 14px;
}
</style>
