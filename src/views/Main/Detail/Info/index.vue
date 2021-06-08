<template>
  <div>
    <div v-if="isShow">
      <device-heared :id="Number(id)" :device-name="info_data[0].device_name" :nick-name.sync="info_data[0].nick_name"/>
      <el-divider></el-divider>
      <div style="margin-top: 8px">
        <el-card class="box-card" style="text-align: left">
          <div slot="header" class="clearfix">
            <span class="span-title">基础信息</span>
          </div>
          <device-info :data="info_data" :id="Number(id)"/>
        </el-card>
      </div>

      <div style="margin-top: 8px">
        <el-card class="box-card" style="text-align: left">
          <div slot="header" class="clearfix">
            <span class="span-title">链接信息</span>
          </div>
          <device-link :id="Number(id)" :data="info_data"/>
        </el-card>
      </div>

      <div style="margin-top: 8px">
        <sales-info :data="info_data[0].fk_sales" :id="info_data[0].id" @updateData="updateSaleData"/>
      </div>
    </div>

    <!-- <div>
      <el-divider content-position="left">设备二维码</el-divider>
      <el-button type="primary" v-if="!QRCreate" @click="createQRClick">生成二维码</el-button>
      <qriously v-else :value="QRData" :size="300"/>
    </div> -->
  </div>
</template>

<script>
import DeviceHeared from 'components/DeviceInfoTable/DeviceHeared'
import DeviceInfo from 'components/DeviceInfoTable/DeviceInfo'
import DeviceLink from 'components/DeviceInfoTable/DeviceLink.vue'
import SalesInfo from 'components/DeviceInfoTable/SalesInfo.vue'

export default {
  data () {
    return {
      privilege: true,
      info_data: {},
      QRData: '',
      QRCreate: false,
      isShow: false
    }
  },
  components: {
    DeviceHeared,
    DeviceInfo,
    DeviceLink,
    SalesInfo
  },
  props: ['id'],
  methods: {
    updateSaleData (val) {
      var tmpData = val;
      if (typeof tmpData.sell_time !== 'string')
        tmpData.sell_time = this.Moment(val.sell_time).format("YYYY-MM-DD HH:mm:ss");
      this.info_data[0].fk_sales = tmpData
    }
    // createQRClick () {
    //   var tmpObj = {
    //     deviceSecret: this.info_data[0].actual_device_secret,
    //     deviceName: this.info_data[0].device_name,
    //     productId: this.info_data[0].from_product.id,
    //     productIdent: this.info_data[0].from_product.product_identifier,
    //     moduleSecret: this.info_data[0].module_secret
    //   }
    //   this.QRData = JSON.stringify(tmpObj)
    //   this.QRCreate = true
    // },
  },
  mounted () {
    if (localStorage.getItem('privilege') === '3') {
      this.privilege = false
    }

    this.axios({
      method: 'get',
      url: '/spc/device/info/id/',
      params: {
        token: localStorage.getItem('token'),
        data: this.id
      }
    }).then(res => {
      if (res.data.code === 1000) {
        this.info_data = res.data.data;
        this.isShow = true
      } else {
        this.$message(res.data.msg)
      }
    }).catch(err => {
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
    })
  }
}
</script>

<style lang="scss" scoped>
  .demo-table-expand {
    font-size: 0;
    border: solid;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
    border-left: 1px solid #EBEEF5;
    span{
      height: 40px;
      border-right: 1px solid #000;

    }
  }
  .span-title{
    font-size: 19px;
    font-weight: 800;
    color: #409EFF;
  }
</style>
