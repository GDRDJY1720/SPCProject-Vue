<template>
  <div :id="id + '_' + flag" class="spc-chart"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: ['id', 'flag', 'name', 'history'],
  data () {
    return {
      charts: '',
      seriesArr: [],
      legendArr: [],
      xAxisArr: []
    }
  },
  methods: {
    drawLine (id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        // title: {
        //   text: this.name
        // },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.legendArr
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '13%',
          containLabel: true
        },
        // toolbox: {
        //   right: 10,
        //   feature: {
        //     dataZoom: {
        //       yAxisIndex: 'none'
        //     },
        //     restore: {},
        //     saveAsImage: {}
        //   }
        // },
        dataZoom: [{
          startValue: this.xAxisArr[0]
        }, {
          type: 'inside'
        }],
        // visualMap: {
        //   top: 50,
        //   right: 10,
        //   pieces: [{
        //     gt: 0,
        //     lte: 50,
        //     color: '#93CE07'
        //   }, {
        //     gt: 50,
        //     lte: 100,
        //     color: '#FBDB0F'
        //   }, {
        //     gt: 100,
        //     lte: 150,
        //     color: '#FC7D02'
        //   }, {
        //     gt: 150,
        //     lte: 200,
        //     color: '#FD0100'
        //   }, {
        //     gt: 200,
        //     lte: 300,
        //     color: '#AA069F'
        //   }, {
        //     gt: 300,
        //     color: '#AC3B2A'
        //   }],
        //   outOfRange: {
        //     color: '#999'
        //   }
        // },
        xAxis: {
          data: this.xAxisArr
        },
        yAxis: {
          type: 'value',
          min: 'dataMin'
        },
        series: this.seriesArr
      })
    },
    chartDataset () {
      var chartArr = this.$store.state.chartData[this.flag]
      //   处理显示图标的名称
      for (let i = 0; i < chartArr.length; i++) {
        this.legendArr.push(chartArr[i].name)
      }
      for (let i = 0; i < chartArr.length; i++) {
        //   处理x轴的时间戳
        var list = chartArr[i].List.PropertyInfo
        // 处理series数据
        var tmp = {
          name: chartArr[i].name,
          type: 'line',
          //   stack: '总量',
          data: []
        }
        for (let j = 0; j < list.length; j++) {
          this.xAxisArr.push(this.getdate(list[j].Time))
          tmp.data.push(list[j].Value)
        }
        this.seriesArr.push(tmp)
      }
      this.xAxisArr = this.uniq(this.xAxisArr)
      // console.log('chartDataset', this.xAxisArr, this.legendArr, this.seriesArr)
    },
    getdate (time) {
      var now = new Date(time)
      //   var y = now.getFullYear()
      //   var m = now.getMonth() + 1
      //   var d = now.getDate()
      //   return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + now.toTimeString().substr(0, 8)
      return now.toTimeString().substr(0, 8)
    },
    uniq (array) {
      array.sort()
      var temp = [array[0]]
      for (var i = 1; i < array.length; i++) {
        if (array[i] !== temp[temp.length - 1]) {
          temp.push(array[i])
        }
      }
      return temp
    },
    getChartData () {
      this.updataChartData()
      this.charts.setOption({
        xAxis: {
          data: this.xAxisArr
        },
        series: this.seriesArr
      })
    },
    updataChartData () {
      var chartArr = this.$store.state.chartData[this.flag]
      for (let i = 0; i < chartArr.length; i++) {
        var list = chartArr[i].List.PropertyInfo
        var index = 0
        while (index <= this.seriesArr.length - 1) {
          if (this.seriesArr[index].name === chartArr[i].name) {
            break
          }
          index++
        }
        for (let j = 0; j < list.length; j++) {
          this.xAxisArr.push(this.getdate(list[j].Time))
          this.seriesArr[index].data.push(list[j].Value)
        }
      }
      this.xAxisArr = this.uniq(this.xAxisArr)
    }
  },
  mounted () {
    this.chartDataset()
    this.$nextTick(function () {
      this.drawLine(this.id + '_' + this.flag)
      if (!this.history) {
        const timer = setInterval(this.getChartData, 3000)
        this.$once('hook:beforeDestroy', () => {
          clearInterval(timer)
        })
      } else {
        console.log(false)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.spc-chart{
    width: 600px;
    height: 400px;
}
</style>
