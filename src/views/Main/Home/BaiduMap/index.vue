<template>
  <div style="height: 100%">
    <baidu-map class="bm-view" ak="kLpwGtvGNbbezemSXCMbExMIqtNz9kSr" :zoom="map.zoom" :center="{lng: map.center.lng, lat: map.center.lat}"
 :scroll-wheel-zoom="true">
    <!--比例尺控件-->
    <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
    <!--缩放控件-->
    <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" ></bm-navigation>
    <!--聚合动态添加的点坐标-->
    <bml-marker-clusterer :averageCenter="true">
        <bm-marker v-for="marker of markers" :key="marker.id" :position="{lng: marker.lng, lat: marker.lat}" @click="lookDetail(marker)"></bm-marker>
    </bml-marker-clusterer>
    <!--信息窗体-->
    <bm-info-window
    :position="{lng: infoWindow.info.device_longitude, lat: infoWindow.info.device_latitude}"
    :show="infoWindow.show"
    @close="infoWindowClose"
    @open="infoWindowOpen"
    v-if="infoFlag">
        <p><span class="left">设备名称：</span><span class="right">{{infoWindow.info.device_name}}</span></p>
        <p><span class="left">设备备注名称：</span><span class="right">{{infoWindow.info.nick_name}}</span></p>
        <p><span class="left">设备类型：</span><span class="right">{{infoWindow.info.from_product.productname}}</span></p>
        <p><span class="left">设备状态：</span><span class="right">{{infoWindow.info.status.status}}</span></p>
        <p><span class="left">最后上线时间：</span><span class="right">{{infoWindow.info.status.last_line}}</span></p>
    </bm-info-window>
</baidu-map>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmScale from 'vue-baidu-map/components/controls/Scale'
import BmNavigation from 'vue-baidu-map/components/controls/Navigation'
import { BmlMarkerClusterer } from 'vue-baidu-map'
import BmMarker from 'vue-baidu-map/components/overlays/Marker'
import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow'
export default {
  name: 'pm-distribution',
  components: {
    BaiduMap,
    BmScale,
    BmNavigation,
    BmlMarkerClusterer,
    BmMarker,
    BmInfoWindow
  },
  data () {
    return {
      map: {
        center: {
          lng: 103.984727,
          lat: 30.969819
        },
        zoom: 10
      },
      markers: [],
      infoWindow: {
        show: false,
        info: {}
      },
      infoFlag: false,
      axiosFlag: false
    }
  },
  methods: {
    lookDetail (marker) {
      if (this.infoWindow.info.id !== marker.id) {
        this.axios.get('/spc/device/info/id/', {
          params: {
            token: localStorage.getItem('token'),
            data: marker.id
          }
        }).then(res => {
          if (res.data.code === 1000) {
            this.infoWindow.info = res.data.data[0]
            this.infoFlag = true
            this.infoWindow.show = true
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.axiosCatch(err)
        })
      } else {
        this.infoWindow.show = true
      }
    },
    infoWindowClose () {
      this.infoWindow.show = false
    },
    infoWindowOpen () {
      this.infoWindow.show = true
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
    this.axios.get('/spc/homepage/map/', {
      params: {
        token: localStorage.getItem('token')
      }
    }).then(res => {
      if (res.data.code === 1000) {
        this.markers = res.data.data
      } else {
        this.$message.error(res.data.msg)
      }
    }).catch(err => {
      this.axiosCatch(err)
    })
  }
}
</script>

<style lang="scss" scoped>
.bm-view {
  width: 100%;
  height: 100%;
}
</style>
