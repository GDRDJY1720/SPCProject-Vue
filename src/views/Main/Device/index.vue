<template>
  <div class="spc-device">
    <el-page-header @back="goBack" content="设备信息"></el-page-header>
    <div class="spc-device-tool">
      <el-form :inline="true" :model="formInline" :rules="rules" ref="ruleForm" class="demo-form-inline">
        <el-form-item v-if="privilege">
          <el-button type="primary" plain @click="isShowDialog = true" 
          style="margin: 0 10px" v-if="privilege === '1' || privilege === '2'">添加设备</el-button>
        </el-form-item>
        <el-form-item label="查询类型">
          <el-select v-model="formInline.region" placeholder="查询类型" @change="selectChange">
            <el-option label="设备名称" value="deviceName"></el-option>
            <el-option label="产品列表" value="productID"></el-option>
            <el-option label="设备编号" value="deviceSecret"></el-option>
            <el-option label="网关编号" value="moduleSecret"></el-option>
            <el-option label="客户代码" value="customerCode"></el-option>
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
        <el-form-item v-if="formInline.region === 'customerCode'" prop="customerCode">
          <el-input v-model="formInline.customerCode" placeholder="请输入客户代码"></el-input>
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
        <el-table-column label="锁定时间" v-if="privilege === '1' || privilege === '3'" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.device_date }}</span>
            <el-button slot="reference" size="mini" type="text" @click="delayTimeChange(scope.$index, scope.row)" v-if="scope.row.device_lock_status">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column label="设备锁定" width="160" v-if="privilege === '1' || privilege === '3'" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.device_lock_status" active-text="锁定" inactive-text="解锁" @change="lockSwich(scope.$index, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClickView(scope.row)" type="text" size="small">
              <el-tooltip class="item icon-text" effect="dark" content="查看设备详情" placement="top">
                <i class="el-icon-view"></i>
              </el-tooltip>
            </el-button>
            <el-button @click="handleClickDelete(scope.row)" type="text" size="small" v-if="privilege === '1'">
              <el-tooltip class="item icon-text" effect="dark" content="删除设备" placement="top">
                <i class="el-icon-delete" style="color: red"></i>
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

    <!-- 用于设备锁定的对话框 -->
    <el-dialog title="添加设备" :visible.sync="lockDialog" :show-close="false">
      <el-form :model="lockForm" :rules="rules" ref="lockForm">
        <el-form-item label="锁定方式" :label-width="formLabelWidth">
          <el-radio-group v-model="lockForm.lockType">
            <el-radio label="立即锁定"></el-radio>
            <el-radio label="延时锁定"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="锁定时间" :label-width="formLabelWidth" v-if="lockForm.lockType === '延时锁定'" prop="delayDate">
          <el-date-picker
            v-model="lockForm.delayDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lockCancel">取 消</el-button>
        <el-button type="primary" @click="lockCertain">确 定</el-button>
      </div>
    </el-dialog>
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
        moduleSecret: '',
        customerCode: ''
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
        ],
        customerCode: [
          { required: true, message: '请输入客户代码', trigger: 'blur' }
        ],
        delayDate: [
          { required: true, message: '请输入锁机时间', trigger: 'blur' }
        ]
      },
      lockDialog: false,
      lockForm: {
        editDate: false,
        ind: NaN,
        lockType: '立即锁定',
        delayDate: ''
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
    delayTimeChange (ind, data) {
      this.lockDialog = true
      this.lockForm.editDate = true
      this.lockForm.ind = ind
      this.lockForm.lockType = '延时锁定'
      this.lockForm.delayDate = new Date(data.device_date)
    },
    lockSwich (ind, data) {
      if (data.device_lock_status) {
        this.lockDialog = true
        this.lockForm.ind = ind
      } else {
        this.handleClickLock(ind, true)
      }
    },
    lockCancel () {
      this.lockDialog = false
      if (!this.lockForm.editDate) {
        var tmp = this.deviceTableData
        tmp[this.lockForm.ind].device_lock_status = false
        this.$store.commit('deviceDataChange', tmp)
      }
    },
    lockCertain () {
      if (this.lockForm.lockType === '立即锁定') {
        this.handleClickLock(this.lockForm.ind, false)
      } else {
        this.$refs.lockForm.validate((valid) => {
          if (valid) {
            this.$confirm(`设备将于${this.dateFormet(this.lockForm.delayDate, 'yyyy-MM-dd')}锁定, 是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var data = {
                token: localStorage.getItem('token'),
                time: this.lockForm.delayDate.getTime()
              }
              if (this.deviceTableData[this.lockForm.ind].status.status === '在线') {
                this.delayLockAxios('post', data)
              } else {
                this.delayLockAxios('put', data)
              }
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消延时锁定'
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    handleClickLock (ind, lockFlag) {
      var tmp = this.deviceTableData
      var flag = typeof lockFlag === 'undefined' ? tmp[ind].device_lock_status: lockFlag
      this.$confirm(`此操作将${flag ? '解锁': '锁定'}该设备, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.lockAxios(ind, flag)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${flag ? '解锁': '锁定'}`
        })
      })
    },
    lockAxios (ind, lockFlag) {
      var tmp = this.deviceTableData
      var val = tmp[ind]
      var flag = typeof lockFlag === 'undefined' ? val.device_lock_status: lockFlag
      this.axios.post('/spc/device/lock/', {
        token: localStorage.getItem('token'),
        data: val.id,
        lockFlag: flag ? 0: 1
      }).then(res => {
        this.lockDialog = false
        if (res.data.code === 1000) {
          this.$message({
            type: 'success',
            message: `${flag ? '解锁': '锁定'}成功！`
          })
        } else {
          tmp[this.lockForm.ind].device_lock_status = !flag
          this.$store.commit('deviceDataChange', tmp)
          this.$message(res.data.msg)
        }
      }).catch(err => {
        this.lockDialog = false
        tmp[this.lockForm.ind].device_lock_status = !flag
        this.$store.commit('deviceDataChange', tmp)
        this.axiosErr(err)
      })
    },
    // 用于延时锁定的接口调用
    delayLockAxios (method, data) {
      var tmp = this.deviceTableData
      this.axios({
        method: method,
        url: `/spc/device/lock/${tmp[this.lockForm.ind].id}/`,
        data: data
      }).then(res => {
        this.lockDialog = false
        if (res.data.code === 1000) {
          this.$message({
            type: 'success',
            message: '延时锁定成功'
          })
          tmp[this.lockForm.ind].device_date = this.dateFormet(this.lockForm.delayDate, 'yyyy-MM-dd')
          this.$store.commit('deviceDataChange', tmp)
        } else {
          this.$message(res.data.msg)
        }
      }).catch(err => {
        this.axiosErr(err)
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
    },
    dateFormet (date, format) {
      var o = {
      "M+" : date.getMonth()+1, //month
      "d+" : date.getDate(),    //day
      "h+" : date.getHours(),   //hour
      "m+" : date.getMinutes(), //minute
      "s+" : date.getSeconds(), //second
      "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
      "S" : date.getMilliseconds() //millisecond
      }
      if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
      (date.getFullYear()+"").substr(4 - RegExp.$1.length));
      for(var k in o)if(new RegExp("("+ k +")").test(format))
      format = format.replace(RegExp.$1,
      RegExp.$1.length==1 ? o[k] :
      ("00"+ o[k]).substr((""+ o[k]).length));
      return format;
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
