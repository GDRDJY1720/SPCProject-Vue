<template>
  <div :id="id" :style="{ height: height, width: width }"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {
    id: {
      type: [String, Number],
      default: 'chartTest'
    },
    label: {
      type: String,
      default: 'SPC折线图'
    },
    chartData: {
      type: Array,
      require: true
    },
    xAxisArr: {
      type: Array,
      require: true
    },
    height: {
      type: String,
      default: '400px'
    },
    width: {
      type: String,
      default: '600px'
    }
  },
  data () {
    return {
      charts: ''
    }
  },
  methods: {
    drawLine (id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        title: {
          text: this.label
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.chartData.map(item => {
            return item.name
          })
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '13%',
          containLabel: true
        },
        dataZoom: [{
          startValue: this.xAxisArr[0]
        }
        // , {
        //   type: 'inside' // 添加此条就会有滚轮滚动
        // }
        ],
        toolbox: {
          right: 10,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {},
            magicType: {
              type: ['line', 'bar']
            }
          }
        },
        xAxis: {
          data: this.xAxisArr
        },
        yAxis: {
          type: 'value',
          min: 'dataMin'
        },
        series: this.chartData
      })
    }
  },
  mounted () {
    this.drawLine(this.id)
  }
}
</script>

<style lang="scss" scoped>

</style>
