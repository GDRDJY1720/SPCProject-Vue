<template>
  <div class="spc-device">
    <el-page-header @back="goBack" content="设备信息"></el-page-header>
    <div class="spc-device-tool">
      <el-form :inline="true" :model="formInline" :rules="rules" ref="ruleForm" class="demo-form-inline">
        <el-form-item v-if="privilege">
          <el-button type="primary" plain @click="isShowDialog = true" style="margin: 0 10px">添加设备</el-button>
        </el-form-item>
        <el-form-item label="查询类型">
          <el-select v-model="formInline.region" placeholder="查询类型" @change="selectChange">
            <el-option label="设备名称" value="deviceName"></el-option>
            <el-option label="产品列表" value="productID"></el-option>
            <el-option label="设备编号" value="deviceSecret"></el-option>
            <el-option label="网关编号" value="moduleSecret"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formInline.region === 'deviceName'" prop="deviceName">
          <el-input v-model="formInline.deviceName" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item v-else-if="formInline.region === 'productID'" prop="productID">
          <el-select v-model="formInline.productID" placeholder="请选择产品">
            <el-option
              v-for="item in productArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formInline.region === 'deviceSecret'" prop="deviceSecret">
          <el-input v-model="formInline.deviceSecret" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item v-if="formInline.region === 'moduleSecret'" prop="moduleSecret">
          <el-input v-model="formInline.moduleSecret" placeholder="请输入网关编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="querySubmit('ruleForm')">查询</el-button>
          <el-button type="primary" @click="resetClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-dialog title="添加设备" :visible.sync="isShowDialog">
        <el-form :model="form">
          <el-form-item label="所属产品" :label-width="formLabelWidth">
            <el-select v-model="form.productId" placeholder="请选择产品" style="width: 100%">
              <el-option
                v-for="item in productArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-alert v-show="productErr" title="产品不能为空" type="error" show-icon :closable="false" style="height: 26px"></el-alert>
          </el-form-item>
          <el-form-item label="设备备注名称" :label-width="formLabelWidth">
            <el-input placeholder="请输入设备备注名称，可为空" v-model="form.nickName" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowDialog = false">取 消</el-button>
          <el-button type="primary" @click="handleClickAddCertain">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="spc-device-table">
      <el-table
      v-loading="loading"
      :data="deviceTableData"
      :row-class-name="rowClassName"
      stripe
      border
      height="100%"
      style="width: 100%; max-height: 490px">
        <el-table-column type="index" width="50" fixed="left"></el-table-column>
        <el-table-column prop="device_name" label="设备名"></el-table-column>
        <el-table-column prop="nick_name" label="设备备注名称"></el-table-column>
        <el-table-column prop="fk_product.product_name" label="所属产品"></el-table-column>
        <!-- <el-table-column prop="from_user" label="所属人" width="86"></el-table-column> -->
        <el-table-column prop="status.status" label="设备状态" width="79"></el-table-column>
        <el-table-column prop="status.last_line" label="最后上线时间" width="165"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="handleClickLock(scope.$index, scope.row)" type="text" size="small">
              <el-tooltip class="item icon-text" effect="dark" :content="`${scope.row.deviceOnLock ? '解锁': '锁定'}设备`" placement="top">
                <i class="el-icon-lock" v-if="scope.row.deviceOnLock"></i>
                <i class="el-icon-unlock" v-else></i>
              </el-tooltip>
            </el-button>
            <el-button @click="handleClickView(scope.row)" type="text" size="small">
              <el-tooltip class="item icon-text" effect="dark" content="查看设备详情" placement="top">
                <i class="el-icon-view"></i>
              </el-tooltip>
            </el-button>
            <el-button @click="handleClickDelete(scope.row)" type="text" size="small" v-if="privilege === '1'">
              <el-tooltip class="item icon-text" effect="dark" content="删除设备" placement="top">
                <i class="el-icon-delete"></i>
              </el-tooltip>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="$store.state.currentPage"
      :page-size="pagesize"
      layout="total, prev, pager, next"
      :total="rowCount">
    </el-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      privilege: '',
      productArr: [],
      productErr: false,
      pagesize: 10,
      loading: true,
      dialogTableVisible: false,
      isShowDialog: false,
      form: {
        productId: '',
        nickName: ''
      },
      formLabelWidth: '120px',
      formInline: {
        region: 'deviceName',
        deviceName: '',
        productID: '',
        deviceSecret: '',
        moduleSecret: ''
      },
      rules: {
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        productID: [
          { required: true, message: '请选择产品类型', trigger: 'blur' }
        ],
        deviceSecret: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        moduleSecret: [
          { required: true, message: '请输入网关编号', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['deviceTableData', 'rowCount'])
  },
  methods: {
    goBack () {
      const lastUrl = this.$store.state.lastUrl
      if (lastUrl.indexOf('/main/device')) {
        this.$router.push(lastUrl)
      }
    },
    //获取当前的行数
    rowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    querySubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          var da = this.formInline[this.formInline.region]
          this.axiosSend(`/spc/device/info/${this.formInline.region}/`, {
            token: localStorage.getItem('token'),
            data: da
          }, res => {
            this.loading = false
            this.$store.commit('deviceDataChange', res.data.data)
            this.$store.commit('deviceCountChange', res.data.count)
            this.$store.commit('pageChange', 1)
            this.$store.commit('deviceDataFlagChange', false)
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
      if (!this.$store.state.deviceTableDataAll) {
        var allData = {
          token: localStorage.getItem('token'),
          page: this.$store.state.currentPage,
          limit: this.pagesize
        }
        this.axiosSend('/spc/device/info/', allData, res => {
          this.loading = false
          if (res.data.code === 1000) {
            this.$store.commit('deviceDataChange', res.data.data)
            this.$store.commit('deviceCountChange', res.data.count)
            this.$store.commit('pageChange', 1)
            this.$store.commit('deviceDataFlagChange', true)
          } else {
            this.$message(res.data.msg)
          }
        })
      } else {
        this.loading = false
      }
      this.formInline = {
        region: 'deviceName',
        deviceName: '',
        product: ''
      }
    },
    handleClickLock (ind, val) {
      this.$confirm(`此操作将${val.deviceOnLock ? '解锁': '锁定'}该设备, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/spc/device/lock/', {
          token: localStorage.getItem('token'),
          data: val.id,
          lockFlag: val.deviceOnLock ? 0: 1
        }).then(res => {
          if (res.data.code === 1000) {
            this.$message({
              type: 'success',
              message: `${val.deviceOnLock ? '解锁': '锁定'}成功！`
            })
            var tmp = this.deviceTableData
            tmp[ind].deviceOnLock = !tmp[ind].deviceOnLock
            this.$store.commit('deviceDataChange', tmp)
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.axiosErr(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${val.deviceOnLock ? '解锁': '锁定'}`
        })
      })
    },
    handleClickView (row) {
      this.$router.push({ name: 'detail', params: { id: row.id } })
    },
    handleClickDelete (row) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'delete',
          url: `/spc/device/info/${row.id}/`,
          data: {
            token: localStorage.getItem('token')
          }
        }).then(res => {
          if (res.data.code === 1000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message(res.data.msg)
          }
          this.$store.commit('deviceDataDetele', row.id)
        }).catch(err => {
          this.axiosErr(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      console.log(row)
    },
    handleClickAddCertain () {
      if (!this.form.productId) {
        this.productErr = true
        return
      }
      this.productErr = false
      this.axios({
        method: 'post',
        url: '/spc/device/info/',
        data: {
          token: localStorage.getItem('token'),
          productID: this.form.productId,
          nickName: this.form.nickName
        }
      }).then(res => {
        this.isShowDialog = false
        if (this.formInline.productID === this.form.productId || this.formInline.productID === undefined) {
          var tmp = res.data.data
          tmp.status = {
            status: '未激活'
          }
          this.$store.commit('deviceDataAddChange', tmp)
          this.$store.commit('deviceCountChange', this.$store.state.rowCount + 1)
        }
      }).catch(err => {
        this.isShowDialog = false
        this.axiosErr(err)
      })
    },
    handleCurrentChange (val) {
      this.loading = true
      if (this.$store.state.deviceTableDataAll) {
        var allData = {
          token: localStorage.getItem('token'),
          page: val
        }
        this.axiosSend('/spc/device/info/', allData, res => {
          this.loading = false
          if (res.data.code === 1000) {
            this.$store.commit('deviceDataChange', res.data.data)
            this.$store.commit('deviceCountChange', res.data.count)
            this.$store.commit('pageChange', val)
          } else {
            this.$message(res.data.msg)
          }
        })
      } else {
        var localData = {
          token: localStorage.getItem('token'),
          data: this.formInline[this.formInline.region],
          page: val
        }
        this.axiosSend(`/spc/device/info/${this.formInline.region}/`, localData, res => {
          this.loading = false
          if (res.data.code === 1000) {
            this.$store.commit('deviceDataChange', res.data.data)
            this.$store.commit('deviceCountChange', res.data.count)
            this.$store.commit('pageChange', val)
          } else {
            this.$message(res.data.msg)
          }
        })
      }
    },
    axiosSend (url, data, func) {
      this.axios({
        method: 'get',
        url: url,
        params: data
      }).then(func)
        .catch(err => {
          this.loading = false
          this.axiosErr(err)
        })
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
            this.$message(err.response.data.detail)
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
    this.privilege = localStorage.getItem('privilege')

    this.formInline = this.$store.state.formInline
    if (!this.$store.state.productInfoData.length) {
      var da = {
        token: localStorage.getItem('token')
      }
      this.axiosSend('/spc/product/info/', da, res => {
        if (res.data.code === 1000) {
          for (var i = 0; i < res.data.data.length; i++) {
            this.productArr.push({ label: res.data.data[i].product_name, value: res.data.data[i].id })
          }
          this.$store.commit('productInfoDataChange', res.data.data)
        } else {
          this.$message(res.data.msg)
        }
      })
    } else if (this.$store.state.productInfoData.length) {
      for (var j in this.$store.state.productInfoData) {
        this.productArr.push({ label: this.$store.state.productInfoData[j].product_name, value: this.$store.state.productInfoData[j].id })
      }
    }

    if (!this.$store.state.deviceTableData.length) {
      var data = {
        token: localStorage.getItem('token')
      }
      this.axiosSend('/spc/device/info/', data, res => {
        this.loading = false
        if (res.data.code === 1000) {
          this.$store.commit('deviceDataChange', res.data.data)
          this.$store.commit('deviceCountChange', res.data.count)
          this.$store.commit('deviceDataFlagChange', true)
        } else {
          console.log(res)
          this.$message(res.data.msg)
        }
      })
    } else {
      this.loading = false
    }
  },
  destroyed () {
    this.$store.commit('deviceFormInlineChange', this.formInline)
  }
}
</script>

<style lang="scss" scoped>
.spc-device{
  height: 100%;
  .spc-device-tool{
    text-align: left;
  }
  .spc-device-table{
    height: calc(100% - 41px - 40px - 4px - 48px);
  }
}
.el-page-header{
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: solid 1px #EBEEF5;
}
.el-pagination{
  margin-top: 10px;
}

.icon-text{
  font-size: 16px;
}
</style>
