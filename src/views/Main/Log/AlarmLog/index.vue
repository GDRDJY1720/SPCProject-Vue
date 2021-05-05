<template>
  <div>
    <el-page-header @back="goBack" content="报警日志"></el-page-header>
    <div class="spc-alarm-table">
      <div class="spc-table-search">
        <el-form :inline="true" :model="formInline" :rules="rules" ref="ruleForm" class="demo-form-inline">
          <el-form-item label="查询类型">
            <el-select v-model="formInline.region" placeholder="查询类型" @change="selectChange">
              <el-option label="设备名称" value="deviceName"></el-option>
              <el-option label="起始时间" value="startTime"></el-option>
              <el-option label="时间区间" value="section"></el-option>
              <el-option label="报警状态" value="status"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="formInline.region === 'deviceName'" prop="deviceName">
            <el-input v-model="formInline.deviceName" placeholder="请输入设备名称"></el-input>
          </el-form-item>
          <el-form-item v-else-if="formInline.region === 'startTime'" prop="startTime">
            <el-date-picker v-model="formInline.startTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item v-else-if="formInline.region === 'section'" prop="section">
            <el-date-picker
            v-model="formInline.section"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-else prop="status">
            <el-select v-model="formInline.status" placeholder="选择报警状态">
              <el-option label="正在报警" value="1"></el-option>
              <el-option label="报警解除" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="querySubmit('ruleForm')">查询</el-button>
            <el-button type="primary" @click="resetClick">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
      :data="alarmTableData"
      v-loading="loading"
       stripe
       style="width: 100%;"
       border
       height="490">
        <el-table-column type="index" width="50" fixed="left"></el-table-column>
        <el-table-column prop="device_name" label="设备名称"></el-table-column>
        <el-table-column prop="from_servo" label="报警伺服"></el-table-column>
        <el-table-column prop="from_alarm_info.alarm_name" label="报警名称"></el-table-column>
        <el-table-column prop="alarm_status" label="报警状态"></el-table-column>
        <el-table-column prop="alarm_starttime" label="报警起始时间"></el-table-column>
        <el-table-column prop="alarm_endtime" label="报警结束时间"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page.sync="tablePage.currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="tablePage.pageSize"
        layout="total, prev, pager, next, sizes"
        :total="tablePage.totalResult"
        style="margin-top: 8px">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      alarmTableData: [],
      loading: false,
      statusFilterArr: [{ label: '报警解除', value: 0 }, { label: '正在报警', value: 1 }],
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      formInline: {
        region: 'deviceName',
        deviceName: '',
        startTime: '',
        section: '',
        status: ''
      },
      rules: {
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择起始时间', trigger: 'blur' }
        ],
        section: [
          { required: true, message: '请选择时间范围', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择报警状态', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    goBack () {
      const lastUrl = this.$store.state.lastUrl
      this.$router.push(lastUrl)
    },
    querySubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          var da
          if (this.formInline.region === 'section') {
            da = [this.formInline.section[0].getTime(), this.formInline.section[1].getTime()]
          } else if (this.formInline.region === 'startTime') {
            da = this.formInline.startTime.getTime()
          } else {
            da = this.formInline[this.formInline.region]
          }
          this.axios({
            method: 'post',
            url: `/spc/log/alarm/${this.formInline.region}/`,
            data: {
              token: localStorage.getItem('token'),
              data: da
            }
          }).then(res => {
            this.loading = false
            if (res.data.code === 1000) {
              this.alarmTableData = res.data.data
              this.tablePage.totalResult = res.data.count
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(err => {
            this.loading = false
            this.axiosCatch(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    selectChange (val) {
      this.$refs.ruleForm.resetFields()
    },
    resetClick () {
      this.loading = true
      // 请求报警日志
      this.axiosSend('/spc/log/alarm/', {
        token: localStorage.getItem('token'),
        page: this.tablePage.currentPage,
        limit: this.tablePage.pageSize
      }, res => {
        this.loading = false
        if (res.data.code === 1000) {
          this.alarmTableData = res.data.data
          this.tablePage.totalResult = res.data.count
        } else {
          this.$message.error(res.data.msg)
        }
      })
      this.formInline = {
        region: 'deviceName',
        deviceName: '',
        startTime: '',
        section: '',
        status: ''
      }
    },
    handleSizeChange (val) {
      this.tablePage.currentPage = 1
      this.tablePage.pageSize = val
      this.handlePageChange(1)
    },
    handlePageChange (val) {
      this.loading = true
      var data = {
        token: localStorage.getItem('token'),
        page: val,
        limit: this.tablePage.pageSize
      }
      this.axiosSend('/spc/log/alarm/', data, res => {
        this.loading = false
        if (res.data.code === 1000) {
          this.alarmTableData = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    axiosSend (url, data, func) {
      this.axios({
        method: 'get',
        url: url,
        params: data
      }).then(func)
        .catch(err => {
          this.loading = false
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
    this.loading = true
    // 请求报警日志
    this.axiosSend('/spc/log/alarm/', { token: localStorage.getItem('token') }, res => {
      this.loading = false
      if (res.data.code === 1000) {
        this.alarmTableData = res.data.data
        this.tablePage.totalResult = res.data.count
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.el-page-header{
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: solid 1px #EBEEF5;
}
</style>
