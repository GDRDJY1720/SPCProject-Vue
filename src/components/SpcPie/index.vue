<template>
  <div :id="id" class="spc-chart"></div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      require: true
    },
    pieData: {
      type: Array,
      require: true
    },
    label: {
      type: String,
      default: '饼图'
    },
    subhead: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      charts: ''
    }
  },
  methods: {
    drawLine (id) {
      this.charts = this.$echarts.init(document.querySelector('#' + id))
      this.charts.setOption({
        title: {
          text: this.label,
          subtext: this.subhead,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: this.pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  },
  mounted () {
    this.drawLine(this.id)
  }
}
</script>

<style lang="scss" scoped>
.spc-chart{
    width: 600px;
    height: 400px;
}
</style>
