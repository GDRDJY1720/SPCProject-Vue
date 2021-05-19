<template>
	<div id="index">
		<dv-full-screen-container class="bg">
			<dv-loading v-if="loading">Loading...</dv-loading>
			<div v-else class="host-body">
				<div class="header">
					<screen-header></screen-header>
				</div>
				<div class="content">
					<el-row style="height: 100%">
						<el-col style="height: 100%;" :span="6">
							<el-row style="height: 40%">
								<dv-border-box-1>
									<data-v-device-pie :data="deviceInfo" :count="count"/>
								</dv-border-box-1>
							</el-row>
							<el-row style="height: 56%;">
								<dv-border-box-8>
									<data-v-product-num :data="productInfo"/>
								</dv-border-box-8>
							</el-row>
						</el-col>
						<el-col style="height: 100%; padding-right: 15px" :span="18">
							<el-row style="height: 58%">
								<el-col style="height: 100%; padding: 0 5px" :span="16">
									<dv-border-box-10>
										<data-v-map :data="mapInfo"/>
									</dv-border-box-10>
								</el-col>
								<el-col style="height: 100%;" :span="8">
									<dv-border-box-8>
										<data-v-device-run/>
									</dv-border-box-8>
								</el-col>
							</el-row>
							<el-row style="height: 38%; padding-top: 5px; padding-right: 5px">
								<el-col style="height: 100%" :span="16">
									<dv-border-box-9>
										<data-v-device-alarm/>
									</dv-border-box-9>
								</el-col>
								<el-col style="height: 100%" :span="8">
                  <dv-border-box-1>
                    <data-v-use-device :data="runInfo"/>
                  </dv-border-box-1>
								</el-col>
							</el-row>
						</el-col>
					</el-row>
				</div>
			</div>
		</dv-full-screen-container>
	</div>
</template>

<script>
import ScreenHeader from 'components/DataVHeader'
import DataVDevicePie from 'components/DataVContent/DataVDevicePie'
import DataVProductNum from 'components/DataVContent/DataVProductNum.vue'
import DataVMap from 'components/DataVContent/DataVMap.vue'
import DataVDeviceRun from 'components/DataVContent/DataVDeviceRun.vue'
import DataVUseDevice from 'components/DataVContent/DataVUseDevice.vue'
import DataVDeviceAlarm from 'components/DataVContent/DataVDeviceAlarm.vue'

export default {
  components: {
    ScreenHeader,
	  DataVDevicePie,
    DataVProductNum,
    DataVMap,
    DataVDeviceRun,
    DataVUseDevice,
    DataVDeviceAlarm
  },
  data () {
    return {
      loading: true,
      count: 0,
      deviceInfo: null,
      mapInfo: null,
      productInfo: null,
      runInfo: null
    }
  },
  methods: {
    setPieData (data) {
      var tmp = []
      var statusTransform = {
        disable: '禁用',
        offline: '离线',
        online: '在线',
        unActive: '未激活'
      }
      for (var i in data) {
        tmp.push({ name: statusTransform[i], value: data[i] })
      }
      return tmp
    },
    setProductNum (data) {
      var tmp = []
      for (const i in data) {
        tmp.push({ name: data[i].productname, value: data[i].count })
      }
      return tmp
    },
    setMapData (data) {
      var tmp = [
        { name: '北京', value: 0 }, { name: '天津', value: 0 }, { name: '上海', value: 0 }, { name: '重庆', value: 0 },
        { name: '河北', value: 0 }, { name: '河南', value: 0 }, { name: '云南', value: 0 }, { name: '辽宁', value: 0 },
        { name: '黑龙江', value: 0 }, { name: '湖南', value: 0 }, { name: '安徽', value: 0 }, { name: '山东', value: 0 },
        { name: '新疆', value: 0 }, { name: '江苏', value: 0 }, { name: '浙江', value: 0 }, { name: '江西', value: 0 },
        { name: '湖北', value: 0 }, { name: '广西', value: 0 }, { name: '甘肃', value: 0 }, { name: '山西', value: 0 },
        { name: '内蒙古', value: 0 }, { name: '陕西', value: 0 }, { name: '吉林', value: 0 }, { name: '福建', value: 0 },
        { name: '贵州', value: 0 }, { name: '广东', value: 0 }, { name: '青海', value: 0 }, { name: '西藏', value: 0 },
        { name: '四川', value: 0 }, { name: '宁夏', value: 0 }, { name: '海南', value: 0 }, { name: '台湾', value: 0 },
        { name: '香港', value: 0 }, { name: '澳门', value: 0 }, { name: '南海诸岛', value: 0 }
      ]

      for (const i in data) {
        tmp.forEach(item => {
          if (item.name === data[i].deviceProvince) {
            item.value = data[i].count
          }
        })
      }
      return tmp
    },
    setUseDevice (data) {
      var tmp = {
        category: [],
        data: []
      }
      for (const i in data) {
        tmp.category.push(i)
        tmp.data.push(data[i])
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
    },
    getDataVData () {
      this.axios.get('/spc/homepage/dataV/', {
        params: {
          token: localStorage.getItem('token'),
          page: 1,
          limit: 5
        }
      }).then(res => {
        this.loading = false
        if (res.data.code === 1000) {
          this.count = res.data.data.count
          this.deviceInfo = this.setPieData(res.data.data.device)
          this.mapInfo = this.setMapData(res.data.data.map)
          this.productInfo = this.setProductNum(res.data.data.product)
          this.runInfo = this.setUseDevice(res.data.data.run)
        }
      }).catch(err => {
        this.loading = false
        this.axiosCatch(err)
      })
    }
  },
  mounted () {
    this.getDataVData()
    this.timer = setInterval(() => {
      this.getDataVData()
    }, 10000)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(this.timer)
      this.timer = null
    })
  }
}
</script>

<style lang="scss" scope>
	/* @import "../assets/scss/index.scss"; */

	.bg {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: 0.2rem 0.2rem 0 0.2rem;
		background-image: url("~assets/pageBg.png");
		background-size: cover;
		background-position: center center;
		color: white;
		text-align: left;
	}

	.host-body {
		flex: 1;
		flex-direction: column;
		justify-content: space-around;

		.header {
			width: 100%;
			height: 80px;
			flex: 2;
		}

		.content {
			flex: 2;
			width: 100%;
			height: calc(100% - 80px);
		}

	}

	.systime {
		color: #5cd9e8;
		font-size: 16px !important;
		font-weight: 800;
		margin-left: 10px;
	}
</style>
