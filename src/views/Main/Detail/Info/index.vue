<template>
  <div>
    <div>
      <el-divider content-position="left">设备信息</el-divider>
      <stable :data="info_data" :key="info_data.length" :privilege="privilege"></stable>
    </div>

    <div>
      <el-divider content-position="left">设备二维码</el-divider>
      <el-button type="primary" v-if="!QRCreate" @click="createQRClick">生成二维码</el-button>
      <qriously v-else :value="QRData" :size="300"/>
    </div>
  </div>
</template>

<script>
import stable from '@/components/Spc_table'

export default {
  data () {
    return {
      privilege: true,
      info_data: {},
      QRData: '',
      QRCreate: false
    }
  },
  components: {
    stable
  },
  props: ['id'],
  methods: {
    createQRClick () {
      var tmpObj = {
        deviceSecret: this.info_data[0].actual_device_secret,
        deviceName: this.info_data[0].device_name,
        productId: this.info_data[0].from_product.id,
        productIdent: this.info_data[0].from_product.product_identifier,
        moduleSecret: this.info_data[0].module_secret
      }
      this.QRData = JSON.stringify(tmpObj)
      this.QRCreate = true
    }
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
        this.info_data = res.data.data
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
</style>
