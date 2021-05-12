<template>
  <div class="spc-home-news">
    <div class="spc-news-pies">
      <div class="spc-news-device">
        <pie id="device"
        :pieData="devicePieData"
        label="设备在线状况"
        style="height: 100%; width: 100%;"
        :key="devicePieData.length"/>
      </div>
      <div class="spc-news-info">
        <el-table
        :data="tableData"
        height="350"
        border
        style="width: 100%; font-size: 12px"
        v-el-table-infinite-scroll="loadMore">
          <el-table-column label="设备名" show-overflow-tooltip>
            <template slot-scope="scope">
              <h3>{{scope.row.device_name}}</h3>
              <h4>{{scope.row.nick_name}}</h4>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="60"></el-table-column>
          <el-table-column prop="device_TotalOutput" label="总运行次数" width="90"></el-table-column>
          <el-table-column prop="device_TotalRunTime" label="总运行时间" width="90"></el-table-column>
          <div slot="append" style="text-align: center">
            {{ loading ? "正在加载数据，请稍后……": "数据已全部加载" }}
          </div>
        </el-table>
      </div>
    </div>
    <div class="spc-news-alarm">
      <chart id="alarm"
      label="报警次数统计"
      :chartData="alarmChartData"
      :xAxisArr="alarmXAxisArr"
      :key="alarmXAxisArr.length"
      height="100%"
      width="calc(90% - 20px)"
      style="margin-left: 10px"/>
    </div>
    <div class="spc-news-run">
      <chart id="run"
      label="昨日设备上线统计"
      :chartData="RunChartData"
      :xAxisArr="RunXAxisArr"
      :key="RunChartKey"
      height="100%"
      width="calc(90% - 20px)"
      style="margin-left: 10px"/>
    </div>
  </div>
</template>

<script>
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import pie from '@/components/SpcPie'
import chart from '@/components/SpcHomeChart'
export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  data () {
    return {
      loading: true,
      loadMoreFlag: true,
      loadPage: 2,
      pageSum: 0,
      devicePieData: [],
      tableData: [],
      alarmChartData: [{
        data: [],
        type: 'bar',
        name: '报警次数'
      }
      ],
      alarmXAxisArr: [],
      RunChartData: [
        {
          data: [],
          type: 'bar',
          name: '设备数量'
        }
      ],
      RunXAxisArr: [],
      RunChartKey: ''
    }
  },
  components: {
    chart,
    pie
  },
  methods: {
    loadMore () {
      if (this.loadMoreFlag) {
        if (this.pageSum === 0) {
          return
        }
        this.loadMoreFlag = false

        if (this.loadPage > this.pageSum) {
          this.loading = false
        } else {
          this.axios.get('/spc/homepage/info/table/', {
            params: {
              token: localStorage.getItem('token'),
              page: this.loadPage++
            }
          }).then(res => {
            this.loadMoreFlag = true
            if (res.data.code === 1000) {
              this.tableData = [...this.tableData, ...res.data.data]
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(err => {
            this.axiosCatch(err)
          })
        }
      }
    },
    setPieData (data) {
      var statusTransform = {
        disable: '禁用',
        offline: '离线',
        online: '在线',
        unactive: '未激活'
      }
      for (var i in data) {
        this.devicePieData.push({ name: statusTransform[i], value: data[i] })
      }
    },
    setAlarmChartData (data) {
      for (var i in data) {
        this.alarmXAxisArr.push(i)
        this.alarmChartData[0].data.push(data[i])
      }
    },
    setRunChartData (data) {
      for (var i in data) {
        this.RunXAxisArr.push(i)
        this.RunChartData[0].data.push(data[i])
        this.RunChartKey = String(new Date())
      }
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
    var data = {
      token: localStorage.getItem('token')
    }
    this.axios.get('/spc/homepage/info/', {
      params: data
    }).then(res => {
      if (res.data.code === 1000) {
        this.pageSum = Math.ceil(res.data.data.count / 10)
        this.setPieData(res.data.data.device)
        this.tableData = res.data.data.table
        this.setAlarmChartData(res.data.data.log.alarm)
        this.setRunChartData(res.data.data.log.run)
      } else {
        console.log(res)
        this.$message(res.data.msg)
      }
    }).catch(err => {
      this.axiosCatch(err)
    })
  }
}
</script>

<style lang="scss" scoped>
.spc-home-news{
  position: relative;
  height: 100%;
  width: 100%;
  overflow: scroll;
  -ms-overflow: scroll;

  &::-webkit-scrollbar{
    display: none;
  }

  .spc-news-pies{
    position: relative;
    width: 100%;
    height: 400px;
    .spc-news-device{
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 50%;
    }
    .spc-news-info{
      position: absolute;
      top: 0;
      left: 50%;
      height: 100%;
      width: 50%;
    }
  }

  .spc-news-alarm{
    position: absolute;
    top: 420px;
    left: 0;
    height: 400px;
    width: 100%;
  }
  .spc-news-run{
    position: absolute;
    top: 850px;
    left: 0;
    height: 400px;
    width: 100%;
  }
}

</style>
