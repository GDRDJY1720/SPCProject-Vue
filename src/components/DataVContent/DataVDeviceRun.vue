<template>
	<div id="centreRight1">
		<div class="bg-color-black">
			<span style="color:#5cd9e8">
				<!-- <svg-icon icon-class="alalist"></svg-icon> -->
			</span>
			<span class="text">设备运行信息</span>
		</div>
		<div class="d-flex">
			<dv-scroll-board :config="config" ref="runLogBoard" style="box-sizing:border-box;height:95%; " />
		</div>
	</div>
</template>

<script>
export default {
  data () {
    return {
      page: 0,
      pager: 1,
      timer: null,
      itemList: [],
      config: {
        header: ['设备名称', '次数', '时间/h'],
        data: [],
        rowNum: 5, // 表格行数

        headerBGC: '#0f1325', // 表头
        oddRowBGC: '#0f1325', // 奇数行
        evenRowBGC: '#171c33', // 偶数行
        align: ['center'],
        columnWidth: [20, 300, 100, 100],
        carousel: 'page',
        index: true
      }
    }
  },
  watch: {
    data: function () {
      console.log(this.data)
    }
  },
  methods: {
    runAxios (page) {
      this.axios.get('/spc/homepage/dataV/run/', {
        params: {
          token: localStorage.getItem('token'),
          page: page,
          limit: 5
        }
      }).then(res => {
        if (res.data.code === 1000) {
          var count = res.data.count
          this.page = count / 5
          this.$refs.runLogBoard.updateRows(this.setRunLog(res.data.data))
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.axiosCatch(err)
      })
    },
    setRunLog (data) {
      var tmp = []
      for (const i in data) {
        tmp.push([data[i].device_name, data[i].device_TotalOutput, data[i].device_TotalRunTime])
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
    this.runAxios(this.pager)
    this.timer = setInterval(() => {
      if (this.page <= 1) {
        clearInterval(this.timer)
        return
      }
      this.pager++
      if (this.pager > this.page) {
        this.pager = 1
      }
      this.runAxios(this.pager)
    }, 10000)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(this.timer)
      this.timer = null
    })
  }
}
</script>

<style lang="scss">
	#centreRight1 {
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
