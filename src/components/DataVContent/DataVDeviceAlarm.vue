<template>
	<div id="buttomCenter">
		<div class="bg-color-black">
			<span style="color:#5cd9e8">
				<!-- <svg-icon icon-class="alalist"></svg-icon> -->
			</span>
			<span class="text">最近告警信息</span>
		</div>
		<div class="d-flex">
			<dv-scroll-board :config="config" ref="AlarmLogBoard" style="box-sizing:border-box;height:95%; " />
		</div>
	</div>
</template>

<script>
export default {
  data () {
    return {
      timer: null,
      pager: 1,
      page: 0,
      itemList: [],
      config: {
        header: ['设备名称', '伺服名称', '报警名称', '报警状态'],
        data: [],
        rowNum: 5, // 表格行数

        headerBGC: '#0f1325', // 表头
        oddRowBGC: '#0f1325', // 奇数行
        evenRowBGC: '#171c33', // 偶数行
        align: ['center'],
        columnWidth: [50, 250, 120, 180, 80],
        index: true
      }
    }
  },
  methods: {
    alarmAxios (page) {
      this.axios.get('/spc/homepage/dataV/alarm/', {
        params: {
          token: localStorage.getItem('token'),
          page: page,
          limit: 5
        }
      }).then(res => {
        if (res.data.code === 1000) {
          var count = res.data.count
          this.page = count / 5
          this.$refs.AlarmLogBoard.updateRows(this.setAlarmLog(res.data.data))
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.axiosCatch(err)
      })
    },
    setAlarmLog (data) {
      var tmp = []
      for (const i in data) {
        tmp.push([data[i].device_name, data[i].servoName, data[i].alarmName, data[i].alarmStatus])
      }
      return tmp
    },
    axiosCatch (err) {
      if (err.response) {
        if (err.response.status === 500) {
          this.$message('网络错误')
        } else if (err.response.status === 403) {
          if (err.response.data.code === '1001') {
            this.$message(err.response.data.msg)
            this.$router.push('/login')
          } else {
            this.$message('未知错误')
          }
        }
      } else if (err.request) {
        console.info(err.request)
      } else {
        console.info('error', err.message)
      }
    }
  },
  mounted () {
    this.alarmAxios(this.pager)
    this.timer = setInterval(() => {
      if (this.page <= 1) {
        clearInterval(this.timer)
        return
      }
      this.pager++
      if (this.pager > this.page) {
        this.pager = 1
      }
      this.alarmAxios(this.pager)
    }, 3000)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(this.timer)
      this.timer = null
    })
  }
}
</script>

<style lang="scss">
	#buttomCenter {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		width: 100%;

		.bg-color-black {
			height: 10%;
			padding-top: 25px;
		}

		.d-flex {
			width: 95%;
			flex: 2;
			padding: 0 20px 0 20px;

		}

		.dv-scroll-board .header {
			height: 30px;
		}
	}

  .text{
    font-size: 19px;
    font-weight: 800;
    color: #5cd9e8;
  }
</style>
