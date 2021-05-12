<template>
	<div class="stratop">
		<div class="topTitle" >
		<!-- <svg-icon icon-class="alarun" style="color:#5cd9e8; "></svg-icon> -->
			<span class="fs-xl text mx-2">本周设备运行情况统计</span>
		</div>
		<div id="bottomLeftChart" style="height:100%"></div>
	</div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      chart: null,
      item: '',
      interval: '6000',
      option: '',
      type: 0
    }
  },
  mounted () {
    this.chart = this.$echarts.init(document.getElementById('bottomLeftChart'))
    this.option = {
      title: {
        text: '',
        x: 'center',
        y: 0,
        textStyle: {
          color: '#B4B4B4',
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.1)',
        axisPointer: {
          type: 'shadow',
          label: {
            show: true,
            backgroundColor: '#7B7DDC'
          }
        },
        textStyle: {
          color: 'yellow',
          fontWeight: 'bold'
        }
      },
      legend: {
        textStyle: {
          color: '#B4B4B4'
        }

      },
      grid: {
        x: '11%',
        width: '80%',
        y: '4%'
      },
      xAxis: {
        data: [],
        axisLine: {
          lineStyle: {
            color: '#B4B4B4'
          }
        },
        axisTick: {
          show: false
        }
      },
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#B4B4B4'
            }
          },
          axisLabel: {
            formatter: '{value} '
          }
        }
      ],
      series: [{
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          normal: {
            opacity: 1,
            barBorderRadius: 5,
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#5e69ff'
            },
            {
              offset: 1,
              color: '#ffa4f3'
            }
            ])
          }
        },
        data: []
      }

      ]
    }

    var category = this.data.category
    var data = this.data.data
    this.draw(category, data)
    setInterval(this.changeColor, 500)
  },
  methods: {
    draw (category, data) {
      // 基于准备好的dom，初始化echarts实例
      this.option.xAxis.data = category
      this.option.series[0].data = data
      this.chart.setOption(this.option)
    },
    changeColor () {
      switch (this.type) {
        case 0:
          this.option.series[0].itemStyle.normal.color = new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#5e69ff' }, { offset: 1, color: '#ffa4f3' }])
          break
        case 1:
          this.option.series[0].itemStyle.normal.color = new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#1911ff' }, { offset: 1, color: '#e653ff' }])
          break
      }
      this.type = 1 - this.type
      this.chart.setOption(this.option, true)
    }
  },
  destroyed () {
    window.onresize = null
  }
}
</script>

<style lang="scss" scoped>
	.stratop{
		display: flex;
		flex-direction: column;
		height: 100%;
		text-align: center;
		.topTitle{
			height: 10%;
			padding: 10px;

		}
		#bottomLeftChart{
			flex: 2;
		}
	}
</style>
