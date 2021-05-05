<template>
  <div>
    <el-page-header @back="goBack" content="运行日志"></el-page-header>
    <div class="spc-run-main">
      <div class="spc-table-search">
        <el-form :inline="true" :model="formInline" :rules="rules" ref="ruleForm" class="demo-form-inline">
          <el-form-item label="查询类型">
            <el-select v-model="formInline.region" placeholder="查询类型" @change="selectChange">
              <el-option label="设备名称" value="deviceName"></el-option>
              <el-option label="起始时间" value="startTime"></el-option>
              <el-option label="时间区间" value="section"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="formInline.region === 'deviceName'" prop="deviceName">
            <el-input v-model="formInline.deviceName" placeholder="请输入设备名称"></el-input>
          </el-form-item>
          <el-form-item v-else-if="formInline.region === 'startTime'" prop="startTime">
            <el-date-picker v-model="formInline.startTime" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-else prop="section">
            <el-date-picker
            v-model="formInline.section"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="querySubmit('ruleForm')">查询</el-button>
            <el-button type="primary" @click="resetClick">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="runLogArr" v-loading="loading" stripe style="width: 100%;" border height="490">
        <el-table-column type="index" width="50" fixed="left"></el-table-column>
        <el-table-column prop="device_name" label="设备名称"></el-table-column>
        <el-table-column prop="run_starttime" label="起始时间"></el-table-column>
        <el-table-column prop="run_endtime" label="结束时间"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pagesize"
        layout="total, prev, pager, next, sizes"
        :total="rowCount"
        style="margin-top: 8px">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      runLogArr: [],
      pagesize: 10,
      currentPage: 1,
      rowCount: 0,
      formInline: {
        region: 'deviceName',
        deviceName: '',
        startTime: '',
        section: ''
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
            url: `/spc/log/run/${this.formInline.region}/`,
            data: {
              token: localStorage.getItem('token'),
              data: da
            }
          }).then(res => {
            this.loading = false
            if (res.data.code === 1000) {
              this.runLogArr = res.data.data
              this.rowCount = res.data.count
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
      var data = {
        token: localStorage.getItem('token'),
        page: this.currentPage,
        limit: this.pagesize
      }

      this.axiosSend(data)
      this.formInline = {
        region: 'deviceName',
        deviceName: '',
        startTime: '',
        section: ''
      }
    },
    handleCurrentChange (val) {
      this.loading = true
      console.log('handleCurrentChange')
      var data = {
        token: localStorage.getItem('token'),
        page: val,
        limit: this.pagesize
      }
      this.axiosSend(data)
      this.currentPage = val
    },
    handleSizeChange (val) {
      console.log('handleSizeChange')
      this.pagesize = val
      this.currentPage = 1
      this.handleCurrentChange(1)
    },
    axiosSend (data) {
      this.axios.get('/spc/log/run/', {
        params: data
      }).then(res => {
        this.loading = false
        if (res.data.code === 1000) {
          this.runLogArr = res.data.data
          this.rowCount = res.data.count
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.loading = false
        this.axiosCatch(err)
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
    var data = {
      token: localStorage.getItem('token')
    }

    this.axiosSend(data)
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
