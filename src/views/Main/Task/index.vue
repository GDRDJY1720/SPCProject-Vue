<template>
  <div class="spc-task">
    <el-page-header @back="goBack" content="设备任务" class="header"></el-page-header>
    <div class="spc-task-main">
      <div class="spc-task-input">
        <div class="spc-device-search">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="任务类型">
              <el-select v-model="formInline.taskType" placeholder="请选择任务类型">
                <el-option v-for="item in productArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="createTaskClick">创建任务</el-button>
              <!-- <el-button type="primary" @click="canvasClick">绘图</el-button> -->
            </el-form-item>
          </el-form>
        </div>
        <div v-show="isShow">
          <el-tabs type="border-card" style="height: calc(100% - 48px);">
            <el-tab-pane v-for="item in propertyNameArr" :key="item" :label="item">
              <el-table :data="propertyArr[item]" height="406" style="width: 100%;">
                <el-table-column prop="name" label="名称" width="80"></el-table-column>
                <el-table-column label="数据">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.value" type="number" placeholder="请输入数据" size="mini" @change="tableInputBlur"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="unit" label="单位" width="60"></el-table-column>
                <el-table-column prop="scoped" label="范围"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <div style="height: 40px; margin-top: 8px">
            <el-button type="primary" @click="deviceSelectClick">设备选择</el-button>
            <el-button type="primary" @click="createQRClick">生成二维码</el-button>
          </div>
        </div>
      </div>
      <div style="flex: 1">
        <div class="spc-task-show" v-show="isShow">
          <el-card class="box-card" style="width: 500px; margin: 0 auto">
            <canvas id="canvas"></canvas>
          </el-card>

          <el-card class="box-card" style="height: 300px; width: 500px; margin: 14px auto; text-align: center">
            <qriously :value="QRData" :size="250" v-if="QRCreate"/>
            <h3 v-else>无二维码，请生成</h3>
          </el-card>
        </div>
      </div>
    </div>
    <div class="spc-task-drawer">
      <el-drawer
      title="请选择要下载任务的设备"
      :visible.sync="dialog"
      direction="rtl"
      size="40%">
        <div class="demo-drawer__content">
          <el-form :model="form">
            <el-form-item label="选择设备" label-width="120px">
              <el-select v-model="form.region" placeholder="请选择设备">
                <el-option v-for="item in form.device" :key="item.id" :label="item.device_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="taskOutputClick" :disabled="form.region === ''" :loading="loading">{{ loading ? '提交中 ...' : '任务下发' }}</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShow: false,
      loading: false,

      formInline: {
        taskType: ''
      },
      productKey: '',
      productArr: [],

      propertyArr: {},
      propertyNameArr: [],

      context: {},
      coordinate: [],

      QRData: {},
      QRCreate: false,

      form: {
        region: '',
        device: []
      },
      dialog: false
    }
  },
  methods: {
    goBack () {
      const lastUrl = this.$store.state.lastUrl
      this.$router.push(lastUrl)
    },
    createTaskClick () {
      this.axios.get('/spc/device/setProperty/', {
        params: {
          token: localStorage.getItem('token'),
          productID: this.formInline.taskType
        }
      }).then(res => {
        if (res.data.code === 1000) {
          var tmp = res.data.data.properties
          var nameArr = []
          for (var i in tmp) {
            nameArr.push(i)
            for (var j in tmp[i]) {
              tmp[i][j].scoped = tmp[i][j].min + '-' + tmp[i][j].max
              tmp[i][j].value = ''
            }
          }
          this.productKey = res.data.data.productkey
          this.propertyNameArr = nameArr
          this.propertyArr = tmp
          this.isShow = true
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.axiosCatch(err)
      })
    },
    // 动态生成图形
    canvasClick (val) {
      console.log(val)
      this.context.moveTo(0, 100)
      this.context.lineTo(100, 100)
      this.context.lineTo(300, 100)
      this.context.stroke()
    },
    tableInputBlur (e) {
      this.coordinateDataFormat(e)
      console.log(e)
    },
    taskOutputClick () {
      this.loading = true
      var items = this.taskDataFormat()
      this.axios.post('/spc/device/setProperty/', {
        token: localStorage.getItem('token'),
        deviceID: this.form.region,
        items: items
      }).then(res => {
        if (res.data.code === 1000) {
          this.$message({
            message: '任务下发成功',
            type: 'success'
          })
        }
        this.handleClose()
      }).catch(err => {
        this.axiosCatch(err)
      })
    },
    deviceSelectClick () {
      this.axios.get('/spc/device/data/', {
        params: {
          token: localStorage.getItem('token'),
          productID: this.formInline.taskType
        }
      }).then(res => {
        if (res.data.code === 1000) {
          this.form.device = res.data.data
          console.log(this.form)
          this.dialog = true
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.axiosCatch(err)
      })
    },
    handleClose () {
      this.loading = false
      this.dialog = false
    },
    createQRClick () {
      // 需要增加数据校验，防止生成错误任务
      this.QRData = JSON.stringify(this.QRDataFormat())
      console.log(this.QRData)
      this.QRCreate = true
    },
    // 数据格式化方法
    coordinateDataFormat (val) {
      try {
        var len = Math.ceil(Number(val) / 100)
      } catch {
        console.log('数据错误')
        return
      }
      if (len > 300) {
        len /= 10
      }
      console.log(len)
      this.coordinate.push({ x: 150 - len / 2, y: 75 })
    },
    taskDataFormat () {
      var items = {}
      for (var i in this.propertyArr) {
        var tmp = this.propertyArr[i]
        for (var j in tmp) {
          if (tmp[j].value !== '') {
            items[tmp[j].identifier] = Number(tmp[j].value)
          }
        }
      }
      return items
    },
    QRDataFormat () {
      var ident = {
        长度: 'l',
        角度: 'a',
        左长度: 'll',
        左角度: 'la',
        右长度: 'rl',
        右角度: 'ra'
      }
      var tmp = {
        t: this.productKey,
        d: {}
      }
      for (var i in this.propertyArr) {
        const tmpArr = this.propertyArr[i]
        tmp.d[ident[i]] = {}
        for (var j in tmpArr) {
          if (Number(tmpArr[j].value)) {
            tmp.d[ident[i]][tmpArr[j].identifier] = Number(tmpArr[j].value)
          }
        }
      }
      return tmp
    },
    // axios数据错误方法
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
    if (!this.$store.state.productInfoData.length) {
      this.axios.get('/spc/product/info/', {
        params: {
          token: localStorage.getItem('token')
        }
      }).then(res => {
        if (res.data.code === 1000) {
          for (var i = 0; i < res.data.data.length; i++) {
            this.productArr.push({ label: res.data.data[i].product_name, value: res.data.data[i].id })
          }
          this.$store.commit('productInfoDataChange', res.data.data)
        } else {
          this.$message(res.data.msg)
        }
      }).catch(err => {
        this.axiosCatch(err)
      })
    } else if (this.$store.state.productInfoData.length) {
      for (var j in this.$store.state.productInfoData) {
        this.productArr.push({ label: this.$store.state.productInfoData[j].product_name, value: this.$store.state.productInfoData[j].id })
      }
    }

    // 绘制画布，这里使用了v-show，如果用v-if的话，就会有可能出现标签未创建，找不到的情况
    const canvas = document.querySelector('#canvas')
    this.context = canvas.getContext('2d')
  }
}
</script>

<style lang="scss" scoped>
.spc-task {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .el-page-header{
      padding-bottom: 8px;
      margin-bottom: 8px;
      border-bottom: solid 1px #EBEEF5;
  }

  .spc-task-main{
    height: calc(100% - 41px);
    width: 100%;
    display: flex;

    .spc-task-input {
      flex: 1;
      padding: 10px;

      .spc-device-search{
        height: 50px;
      }
    }
    .spc-task-show{
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
}

#canvas {
  height: 200px;
}
</style>
