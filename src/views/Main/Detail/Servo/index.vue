<template>
  <div class="spc-servo-main">
    <div class="spc-servo-div">
      <div class="spc-servo-button">
        <el-button type="primary" round size="mini"  @click="getChecked">实时信息</el-button>
        <el-button type="primary" round size="mini" @click="drawer = true">历史信息</el-button>
      </div>
      <el-tree
        class="spc-servo-tree"
        :data="data"
        :props="defaultProps"
        node-key="identifier"
        accordion
        show-checkbox
      ref="tree">
      </el-tree>
    </div>
    <div class="spc-servo-chart" :key="$store.state.chartFlag" v-loading="loading">
      <schart v-if="$store.state.chartData.Voltage.length" :id="id" :history="history" flag="Voltage"/>
      <schart v-if="$store.state.chartData.Current.length" :id="id" :history="history" flag="Current"/>
      <schart v-if="$store.state.chartData.Torque.length" :id="id" :history="history" flag="Torque"/>
      <schart v-if="$store.state.chartData.Speed.length" :id="id" :history="history" flag="Speed"/>
    </div>
    <div>
      <el-drawer
        :visible.sync="drawer"
        direction="rtl"
        size="40%">
        <div>
          <el-alert title="请选择要查询的时间段" type="info" center show-icon :closable="false"></el-alert>
        </div>
        <div class="block">
          <el-date-picker
            :editable="false"
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="spc-drawer-button">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" :disabled="value1 === null" @click="getCheckedHis">确 定</el-button>
        </div>
      </el-drawer>
    </div>
  </div>

</template>

<script>
import schart from '@/components/Spc_chart'

export default {
  props: ['id'],
  data () {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      identifier: [],
      idArr: [],
      timer: '',
      history: false,
      drawer: false,
      loading: false,
      value1: []
    }
  },
  components: {
    schart
  },
  methods: {
    getChecked () {
      this.loading = true
      this.history = false
      clearInterval(this.timer)
      this.timer = ''
      this.getIdentifier()
      this.axiosData(undefined, true)
      this.timer = setInterval(this.axiosData, 3000)
      this.$once('hook:beforeDestroy', () => {
        clearInterval(this.timer)
        this.timer = ''
        this.$store.commit('chartDataChange', [])
      })
    },
    getCheckedHis () {
      clearInterval(this.timer)
      this.cancelForm()
      var startTime = this.value1[0].getTime()
      var endTime = this.value1[1].getTime()
      this.history = true
      this.getIdentifier()
      var tmpData = {
        token: localStorage.getItem('token'),
        identifier: this.idArr,
        startTime: startTime,
        endTime: endTime,
        history: this.history
      }
      console.log(tmpData)
      this.axiosData(tmpData, true)
    },
    getIdentifier () {
      const tmp = this.$refs.tree.getCheckedNodes()
      const tmpId = []
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].identifier === undefined) {
          tmp.splice(i, 1)
          i--
        } else {
          tmpId.push(tmp[i].identifier)
        }
      }
      this.identifier = tmp
      this.idArr = tmpId
    },
    jsonKey (jsnoStr) {
      const keys = []
      for (var k in jsnoStr) {
        keys.push(k)
      }
      return keys
    },
    axiosData (axiosData, flag = false) {
      if (!axiosData) {
        axiosData = {
          token: localStorage.getItem('token'),
          identifier: this.idArr
        }
      }

      this.axios({
        method: 'post',
        url: `/spc/device/property/${this.id}/`,
        data: axiosData
      }).then(res => {
        this.loading = false
        if (res.data.code !== 1000) {
          this.$message(res.data.msg)
          return
        } else if (!res.data.data.length) {
          this.$message('当前查询数据为空')
          if (!this.history) clearInterval(this.timer)
          this.$store.commit('chartDataChange', [])
          return
        }
        const proArr = res.data.data
        for (let i = 0; i < proArr.length; i++) {
          const t = proArr[i].Identifier
          for (let j = 0; j < this.identifier.length; j++) {
            if (this.identifier[j].identifier === t) {
              proArr[i].name = this.identifier[j].label
              break
            }
          }
        }
        if (flag) this.$store.commit('chartFlagChange')
        this.$store.commit('chartDataChange', proArr)
      }).catch(err => {
        this.loading = false
        this.axiosErr(err)
      })
    },
    cancelForm () {
      this.drawer = false
    },
    axiosErr (err) {
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
    this.axios({
      method: 'get',
      url: `/spc/device/property/${this.id}/`,
      params: {
        token: localStorage.getItem('token')
      }
    }).then(res => {
      if (res.data.code === 1000) {
        const servo = res.data.data.servo_info
        const keys = this.jsonKey(servo)
        for (var i = 0; i < keys.length; i++) {
          const tmp = {
            label: keys[i],
            children: []
          }
          const servoAr = servo[keys[i]]
          for (let j = 0; j < servoAr.length; j++) {
            tmp.children.push({
              identifier: servoAr[j].identifier,
              label: servoAr[j].name
            })
          }
          this.data.push(tmp)
        }
      } else {
        this.$message(res.data.msg)
      }
    }).catch(error => {
      this.axiosErr(error)
    })
  },
  beforeDestroy () {
    this.$store.commit('chartDataChange', [])
  }
}
</script>

<style lang="scss" scoped>
.spc-servo-div{
  float: left;
  width: 200px;
  height: 400px;
  border-right: 2px solid #E4E7ED;
  position: relative;
}
.spc-servo-tree{
  width: 100%;
  height: 300px;
  position: absolute;
  top: 0;
  left: 0;
}
.spc-servo-button{
  position: absolute;
  top: 300px;
  left: 15px;
}

.spc-servo-chart{
float: right;
width: calc(100% - 202px);
height: 100%;
}

.block{
  margin-top: 25px;
}
.spc-drawer-button{
  display: flex;
  margin: 100px 10px 0 10px;
  button{
    flex: 1 1 0%;
  }
}
</style>
