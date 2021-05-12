<template>
	<div style="width: 100%; height: 100%; display: flex; flex-direction: row;">
			<div style="height: 100%; width:20% ; display: flex; flex-direction: column;align-items: center;">
				<div style="height: 10%; padding: 10px">
					<!-- <svg-icon icon-class="scrtime" style="color:#5cd9e8;width: 20px; height: 20px;"></svg-icon> -->
					<span @click="goBack"><dv-decoration-11 style="height: 15px; width: 150px">返回</dv-decoration-11></span>
				</div>
				<dv-decoration-8  style="height: 50%;" :color="['#3f7ff5', '#633cf1']" />
			</div>

		<dv-decoration-1 style="width:200px;height:50px;" />

			<div style="width:40%; overflow: hidden">
				<!-- <span style="float: left; margin: 10px 0 auto 5px">返回</span> -->
				<h2 style="margin: 10px !important; text-align: left; margin-left: 15px">SPC设备管理系统</h2>
				<dv-decoration-6 style="width:60%;height:30%; margin:10px 0 0 90px;" :color="['#5e69ff', '#827fec']" />
			</div>
		<dv-decoration-1 style="width:200px;height:50px;" />
		<div style="height: 100%; width:20% ; display: flex; flex-direction: column;align-items: center;">
			<div style="height: 10%; padding: 10px">
				<span >{{date}}</span>
				<span style="margin-left: 10px;">{{week}}</span>
				<span style="margin-left: 8px">{{time}}</span>
			</div>
				<dv-decoration-8 :reverse="true" style="height: 50%;" :color="['#3f7ff5', '#633cf1']" />
		</div>
	</div>
</template>

<script>
import {
  getDate,
  getWeekDate,
  getTime
} from '@/common/dataV/datetime'
export default {
  data () {
    return {
      time: '',
      date: '',
      week: ''
    }
  },
  mounted () {
    this.setNowTime()
  },
  methods: {
    goBack () {
	  this.$router.push('/main/home/news')
    },
    setNowTime () {
      this.date = getTime()
      this.week = getWeekDate()
      setInterval(() => {
        this.time = getDate()
      }, 1000)
    }

  }
}
</script>

<style scoped lang="scss">
	span{
		font-size: 16px;
		font-weight: 800;
		color: #5cd9e8;
	}
	h2 {
		transform: translate(35%);
	}
</style>
