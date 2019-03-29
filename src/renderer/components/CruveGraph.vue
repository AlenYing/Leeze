<template>
  <div class="cruve_graph_wrapper">
    <svg id="cruve_graph_svg" :viewBox="[0, 0, width, height].join(',')" xmlns="http://www.w3.org/2000/svg" version="1.1" :width="width" :height="height">
      <defs>
        <linearGradient id="curve-fill-gradient" x1="0%" y1="0%" x2="0%" y2="85%">
          <stop offset="0%" style="stop-color:#6094ff; stop-opacity:0.4"/>
          <stop offset="100%" style="stop-color:#46d5d0; stop-opacity:0.0"/>
        </linearGradient>
        <linearGradient id="curve-stroke-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#4bfff9; stop-opacity:1"/>
          <stop offset="100%" style="stop-color:#6baaff; stop-opacity:1"/>
        </linearGradient>
      </defs>

      <g class="axis">
        <g class="axisX"></g>
        <g class="axisY"></g>
      </g>
      <g class="curve"></g>
      <g class="points"></g>
    </svg>
    <GraphTypeSwitch class="graph_type_switch" :propContent.sync="showDayNum" ></GraphTypeSwitch>
    <ToolTip class="graph_tooltip" :toolTipData="toolTipData" ></ToolTip>
    <p :class="toThemeClass('graph_title')">
      {{ multLang({'cn': '数据曲线图', 'en': 'Data Graph'}) }}
    </p>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import ToolTip from './ToolTip.vue'
import GraphTypeSwitch from './GraphTypeSwitch.vue'
import * as d3 from 'd3'

export default {
  name: 'CruveGraph',
  components: {
    ToolTip,
    GraphTypeSwitch
  },
  props: {
    propData: Object
  },
  data () {
    return {
      backgroundColor: '#ffffff',
      width: 1280,
      height: 720,
      dayNum: 30,
      showDayNum: 30,
      toolTipData: {
        selectPointDate: moment().format('MM-DD'),
        selectPointAmount: 0,
        left: 0,
        top: 0
      }
    }
  },
  computed: {
    // data: 从当前天开始往后推，每一天的捐款额数组
    data () {
      let res = []
      for (let i = 0; i < this.showDayNum; i++) {
        res.unshift(this.propData['prev' + i] === undefined ? 0 : this.propData['prev' + i].amount)
      }
      return res
    },
    // padding：曲线图区域相对svg区域的padding
    padding () {
      return {
        top: 0.2 * this.height,
        bottom: 0.2 * this.height,
        left: 0 * this.width,
        right: 0 * this.width
      }
    },
    svg () {
      return d3.select(this.$el).select('svg')
    },
    minY () {
      return _.min(this.data)
    },
    maxY () {
      return _.max(this.data)
    },
    range () {
      return Math.max(1, this.maxY - this.minY)
    },
    // drawWidth：曲线可绘制区域的宽度
    drawWidth () {
      return this.width - this.padding.left - this.padding.right
    },
    // drawHeight：曲线可绘制区域的高度
    drawHeight () {
      return this.height - this.padding.top - this.padding.bottom
    },
    // xStep： 横坐标相邻点之间间距
    xStep () {
      return this.drawWidth / this.showDayNum
    },
    // dataPoins: 数据映射到svg画布上的具体位置
    dataPoins () {
      let res = []
      for (let i = 0; i < this.data.length; i++) {
        let x = i * this.xStep + this.xStep / 2
        let y = this.yForDraw(this.data[i])
        res.push([x, y])
      }
      return res
    },
    // curvePoints: 利用Cardinal样条曲线公式，计算构成平滑曲线的点
    curvePoints () {
      var tension = 0
      var numOfSegments = 20
      var pts = this.dataPoins
      var _pts = []
      var res = []
      _pts = pts.slice(0)

      _pts.unshift([pts[0][0] - this.xStep, pts[0][1]])
      _pts.unshift([pts[0][0] - this.xStep, pts[0][1]])
      _pts.push([pts[pts.length - 1][0] + this.xStep, pts[pts.length - 1][1]])
      _pts.push([pts[pts.length - 1][0] + this.xStep, pts[pts.length - 1][1]])

      let s = (1 - tension) / 2
      for (let i = 1; i < (_pts.length - 2); i++) {
        for (let j = 0; j <= numOfSegments; j++) {
          let t = j / numOfSegments
          let t2 = Math.pow(t, 2)
          let t3 = Math.pow(t, 3)
          let p00 = _pts[i - 1][0]
          let p01 = _pts[i - 1][1]
          let p10 = _pts[i][0]
          let p11 = _pts[i][1]
          let p20 = _pts[i + 1][0]
          let p21 = _pts[i + 1][1]
          let p30 = _pts[i + 2][0]
          let p31 = _pts[i + 2][1]
          let factor0 = -s * t3 + 2 * s * t2 - s * t
          let factor1 = (2 - s) * t3 + (s - 3) * t2 + 1
          let factor2 = (s - 2) * t3 + (3 - 2 * s) * t2 + s * t
          let factor3 = s * t3 - s * t2
          let x = p00 * factor0 + p10 * factor1 + p20 * factor2 + p30 * factor3
          let y = p01 * factor0 + p11 * factor1 + p21 * factor2 + p31 * factor3
          res.push([x, y])
        }
      }
      return res
    }
  },
  watch: {
    data () {
      this.drawGraph()
    },
    showDayNum () {
      d3.select(this.$el).select('.graph_tooltip').transition().duration(200).style('opacity', 0)
    }
  },
  methods: {
    // yForDraw: 将数据值映射到SVG纵坐标
    yForDraw (y) {
      return (this.drawHeight - (y - this.minY) / this.range * this.drawHeight) + this.padding.top
    },
    // drawGraph: 绘制曲线图
    drawGraph () {
      this.drawAxis()
      this.drawCurve(true)
      this.drawPoints(true)
      this.drawCurve()
      this.drawPoints()
    },
    // drawAxis: 绘制坐标系
    // TODO：现在取的是数据点的最大值和最小值作为坐标系纵轴的最大值和最小值，但是这些数字都不是例如10000、5000这种参考值，而是类似45212，因此目前的坐标系只有横线，没有值。
    drawAxis () {
      let xNum = this.showDayNum
      let x = new Array(xNum).fill(0).map((d, i) => {
        return moment().subtract(xNum - i - 1, 'day').date()
      })
      this.svg.select('.axisX')
        .selectAll('text')
        .data(x)
        .join('text')
        .text(function (d, i) {
          return this.padZero(d, 2)
        }.bind(this))
        .attr('x', function (d, i) {
          return i * this.xStep + this.xStep / 2
        }.bind(this))
        .attr('y', this.height - this.padding.bottom / 2)
        .attr('text-anchor', 'middle')
        .style('font', 'bolder 10px sans-serif')
        .style('fill', 'rgba(0, 15, 20, 0.34)')
      let yLines = []
      let yAxisNum = 5
      let yMinForDraw = this.yForDraw(this.minY)
      let yMaxForDraw = this.yForDraw(this.maxY)
      for (let i = 0; i < yAxisNum; i++) {
        yLines.push(yMaxForDraw + (yMinForDraw - yMaxForDraw) * i / (yAxisNum - 1))
      }
      this.svg.select('.axisY')
        .selectAll('rect')
        .data(yLines)
        .join('rect')
        .attr('width', this.width)
        .attr('height', 1)
        .attr('x', 0)
        .attr('y', (d, i) => d)
        .attr('class', this.toThemeClass('y_line'))
    },
    // drawPoints：绘制数据点
    drawPoints (reset) {
      var t = d3.transition()
        .duration(reset ? 0 : 1000)
        .ease(d3.easeSin)
      let startY = this.yForDraw(this.minY)
      let ps = this.svg.select('.points')
        .selectAll('circle')
        .data(this.dataPoins)
        .join('circle')
        .attr('class', 'graph_point')
      ps.transition(t)
        .attr('cx', function (d) {
          return d[0]
        })
        .attr('cy', function (d) {
          return reset ? startY : d[1]
        })
        .attr('r', 4)
        .attr('stroke-width', '2')
        .style('stroke', '#fff')
        .style('fill', '#46d5d0')
      ps.on('mouseover', function (d, i) {
        let selectedCircle = this.selectCircleByIndex(i)
        if (Math.abs(parseFloat(selectedCircle.attr('cy')) - d[1]) < 0.0001) {
          selectedCircle.attr('r', 8).attr('stroke-width', 4).style('fill', 'url(#curve-stroke-gradient)')
          this.toolTipData.date = moment().subtract(this.showDayNum - i - 1, 'day').format('MM-DD')
          this.toolTipData.amount = this.data[i]
          this.toolTipData.left = d[0]
          this.toolTipData.top = d[1]
        }
      }.bind(this))
        .on('mouseout', function (d, i) {
          let selectedCircle = this.selectCircleByIndex(i)
          if (parseFloat(selectedCircle.attr('cy')) === d[1]) {
            selectedCircle.transition().duration(500).attr('r', 4).attr('stroke-width', 2).style('fill', '#46d5d0')
          }
        }.bind(this))
    },
    selectCircleByIndex (i) {
      let selectedCircle = this.svg.select('.points').selectAll('circle').filter((d, index) => {
        return i === index ? this : undefined
      })
      return selectedCircle
    },
    // drawPoints：绘制曲线
    drawCurve (reset) {
      let startY = this.yForDraw(this.minY)
      var path = d3.path()
      path.moveTo(this.curvePoints[0][0] - 9999, reset ? startY : this.height)
      path.lineTo(this.curvePoints[0][0] - 9999, reset ? startY : this.curvePoints[0][1])
      path.lineTo(this.curvePoints[0][0], reset ? startY : this.curvePoints[0][1])
      for (let i = 1; i < this.curvePoints.length; i++) {
        path.lineTo(this.curvePoints[i][0], reset ? startY : this.curvePoints[i][1])
      }
      path.lineTo(this.curvePoints[this.curvePoints.length - 1][0] + 9999, reset ? startY : this.curvePoints[this.curvePoints.length - 1][1])
      path.lineTo(this.curvePoints[this.curvePoints.length - 1][0] + 9999, reset ? startY : this.height)

      var t = d3.transition()
        .duration(reset ? 0 : 1000)
        .ease(d3.easeSin)

      let p = this.svg.select('.curve')
        .selectAll('path')
        .data([path.toString()])
      p.join('path')
        .style('fill', 'url(#curve-fill-gradient)')
        .style('stroke', 'url(#curve-stroke-gradient)')
        .style('stroke-width', '2')
        .transition(t)
        .attr('d', function (d) {
          return d
        })
    },
    padZero (num, size) {
      var s = num + ''
      while (s.length < size) s = '0' + s
      return s
    },
    resetSize () {
      this.width = this.$el.offsetWidth
      this.height = this.$el.offsetHeight
      this.drawGraph()
    }
  },
  mounted () {
    this.resetSize()
    window.addEventListener('resize', function () {
      this.resetSize()
    }.bind(this))
  },
  activated () {
    this.resetSize()
  }
}
</script>

<style>
.cruve_graph_wrapper {
  border-radius: 8px;
  position: relative;
}
.graph_title {
  font-weight: bold;
  font-size: 12px;
  position: absolute;
  left: 20px;
  top: 26px;
}
.graph_title_white {
  color: #202020;
}
.graph_title_black {
  color: #d0d0d0;
}
#cruve_graph_svg {
  width: 100%;
  height: 100%;
}
.graph_point {
  cursor: pointer;
}
.graph_type_switch {
  position: absolute;
  right: 20px;
  top: 20px;
}
.graph_tooltip {
  z-index: 20;
  pointer-events: none;
}
.y_line_white {
  fill: rgba(0, 0, 0, 0.07);
}
.y_line_black {
  fill: rgba(255, 255, 255, 0.07);
}
</style>
