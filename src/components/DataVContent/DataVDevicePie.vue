<template>
	<div class="bottom-left-chart-1">
		<div>
			<!-- <svg-icon icon-class="alanum" style="color:#5cd9e8"></svg-icon> -->
			<span>设备总量及状态统计</span>
		</div>
    <div style="margin-top: 20px">
      <span>设备总量: </span>
      <span style="margin-left: 5px;">{{ count }}</span>
    </div>

		<div class="content">
			<dv-charts :option="option" style="height: 100%;" />
		</div>
	</div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array
    },
    count: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      devcieCount: 0,
      devicePieData: [],
      option: {
        series: [
          {
            type: 'pie',
            data: this.data,
            radius: ['40%', '50%'],
            insideLabel: {
              show: false,
              formatter: '{name}:\n{percent}%'
            },
            outsideLabel: {
              show: true,
              formatter: '{name}-{value}',
              style: {
                fontSize: 16
              }
            }
          }
        ],
        color: ['#00c0ff', '#3de7c9', '#7c74ec', '#f1f34b', '#72d0ac']
      }
    }
  }
}
</script>

<style lang="scss" scoped>
	.bottom-left-chart-1 {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
    width: 100%;

		.content {
			flex: 2;
		}
	}

  span{
    font-size: 19px;
    font-weight: 800;
    color: #5cd9e8;
  }
</style>
