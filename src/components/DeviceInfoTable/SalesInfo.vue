<template>
  <div>
    <el-card class="box-card" >
      <div slot="header" class="clearfix" style="text-align: left">
        <span class="span-title">销售信息</span>
        <span v-if="privilege === '1' || privilege === '4'">
          <el-button class="card-header-btn" type="text" v-if="saleInfoFlag" @click="saleDeleteClick">删除</el-button>
          <el-button class="card-header-btn" type="text" v-if="saleInfoFlag" @click="saleUpdateClick">修改</el-button>
          <el-button class="card-header-btn" type="text" v-else @click="drawer = true">添加</el-button>
        </span>
      </div>
          <table class="gridtable info-font-16" v-if="saleInfoFlag">
            <tr>
              <th>客户代码</th>
              <td>{{ data.customer_code }}</td>
              <th>公司名称</th>
              <td>{{ data.company_name }}</td>
              <th>销售订单号</th>
              <td>{{ data.sell_code }}</td>
              <th>销售时间</th>
              <td>{{ data.sell_time }}</td>
              <th>销售地点</th>
              <td>{{ data.sell_site }}</td>
            </tr>
          </table>
          <div v-else style="font-size: 16px; font-weight: 800;">无订单消息，请添加！</div>
    </el-card>

    <el-drawer
      ref="saleDrawer"
      title="添加销售信息"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
      size="40%">
        <div class="demo-drawer__content">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item label="添加方式" :label-width="labelWidth" v-if="updateFlag">
              <el-radio-group v-model="ruleForm.resource">
                <el-radio label="添加新订单"></el-radio>
                <el-radio label="添加已有订单"></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="客户代码" :label-width="labelWidth" prop="customer_code">
              <el-input v-model="ruleForm.customer_code" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="公司名称" :label-width="labelWidth" prop="company_name" v-if="ruleForm.resource === '添加新订单'">
              <el-input v-model="ruleForm.company_name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="销售订单号" 
            :label-width="labelWidth" 
            prop="sell_code" 
            v-if="ruleForm.resource === '添加新订单'">
              <el-input v-model="ruleForm.sell_code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="销售时间" :label-width="labelWidth" 
            prop="sell_time" v-if="ruleForm.resource === '添加新订单'">
              <el-date-picker
                v-model="ruleForm.sell_time"
                type="date"
                placeholder="选择日期"
                style="width: 100%">
              </el-date-picker>
              <!-- <el-date-picker
                v-model="ruleForm.sell_time"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 100%">
              </el-date-picker> -->
            </el-form-item>
            <el-form-item label="销售地点" :label-width="labelWidth" 
            prop="sell_site" v-if="ruleForm.resource === '添加新订单'">
              <el-input v-model="ruleForm.sell_site" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>

            <el-table
              ref="singleTable"
              :data="saleInfoData"
              highlight-current-row
              @current-change="handleCurrentChange"
              v-if="quertSaleInfoFlag && ruleForm.resource === '添加已有订单'"
              style="width: 100%; font-size: 12px; margin-left: 8px;">
              <el-table-column property="company_name" label="公司名称" width="150"></el-table-column>
              <el-table-column property="sell_code" label="订单号" width="120"></el-table-column>
              <el-table-column property="sell_time" label="销售时间" width="150"></el-table-column>
              <el-table-column property="sell_site" label="销售地点" min-width="120"></el-table-column>
            </el-table>
        </div>

        <div class="demo-drawer__footer" style="margin-top: 12px">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addSaleInfoClick" 
          :loading="loading" v-if="ruleForm.resource === '添加新订单' && updateFlag">{{ loading ? '提交中 ...' : '添加销售信息' }}</el-button>
          <el-button type="primary" @click="quertSaleInfoClick" 
          :loading="loading" v-else-if="ruleForm.resource === '添加已有订单'">{{ loading ? '查询中 ...' : '查询订单' }}</el-button>
          <el-button type="primary" @click="updateDeviceClick" :disabled="addisableFalg" v-if="quertSaleInfoFlag">添加销售信息</el-button>
          <el-button type="primary" @click="updateSaleInfoClick" v-if="updateFlag === false">修改销售信息</el-button>
        </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "SalesInfo",

  props: {
    data: Object,
    id: Number
  },

  data () {
    return {
      privilege: '',
      saleInfoFlag: false,
      drawer: false,
      loading: false,
      labelWidth: '120px',
      ruleForm: {
        resource: '添加新订单',
        company_name: '',
        customer_code: '',
        sell_time: '',
        sell_code: '',
        sell_site: ''
      },
      rules: {
        customer_code: [
          { required: true, message: '请输入客户代码', trigger: 'blur' }
        ],
        sell_time: [
          { required: true, message: '请输入销售时间', trigger: 'blur' }
        ],
        sell_code: [
          { required: true, message: '请输入销售订单号', trigger: 'blur' }
        ],
        sell_site: [
          { required: true, message: '请输入销售地点', trigger: 'blur' }
        ],
      },
      quertSaleInfoFlag: false,
      addisableFalg: true,
      saleInfoData: [],
      currentRow: null,
      updateFlag: true
    }
  },

  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
      .then(_ => {
        this.$refs.ruleForm.resetFields()
        this.$refs.saleDrawer.hide()
      })
      .catch(_ => {});
    },
    addSaleInfoClick () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          var data = {
            token: localStorage.getItem('token'),
            deviceId: this.id,
            customer_code: this.ruleForm.customer_code,
            company_name: this.ruleForm.company_name,
            sell_time: this.ruleForm.sell_time.getTime(),
            sell_code: this.ruleForm.sell_code,
            sell_site: this.ruleForm.sell_site
          }
          this.addAxios(data);
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addAxios (data) {
      this.axios.post('/spc/sale/info/', data).then(res => {
        if (res.data.code === 1000) {
          this.$emit('updateData', this.ruleForm)
          this.saleInfoFlag = true
          this.$refs.saleDrawer.hide()
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.axiosCatch(err)
      })
    },
    quertSaleInfoClick () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.quertAxios();
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    quertAxios () {
      this.axios.get('/spc/sale/info/code/', {
        params: {
          token: localStorage.getItem('token'),
          data: this.ruleForm.customer_code
        }
      }).then(res => {
        if (res.data.code === 1000) {
          this.saleInfoData = res.data.data
          this.quertSaleInfoFlag = true
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.axiosCatch(err)
      })
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.addisableFalg = false;
    },
    updateDeviceClick () {
      this.axios({
        method: 'put',
        url: '/spc/sale/info/',
        data: {
          token: localStorage.getItem('token'),
          sellId: this.currentRow.id,
          deviceId: this.id
        }
      }).then(res => {
        if (res.data.code === 1000) {
          this.$emit('updateData', this.currentRow)
          this.saleInfoFlag = true
          this.$refs.saleDrawer.hide()
        }
      }).catch(err => {
        this.axiosCatch(err)
      })
    },
    saleDeleteClick () {
      this.$confirm('确认删除该设备的订单信息？')
      .then(_ => {
        this.saleDeleteAxios()
      })
      .catch(_ => {});
    },
    saleDeleteAxios () {
      this.axios({
        method: 'delete',
        url: '/spc/sale/info/',
        data: {
          token: localStorage.getItem('token'),
          deviceId: this.id
        }
      }).then(res => {
        if (res.data.code === 1000) {
          this.updateFlag = true
          this.saleInfoFlag = false
          this.quertSaleInfoFlag = false
          this.ruleForm = {
            resource: '添加新订单',
            customer_code: '',
            company_name: '',
            sell_time: '',
            sell_code: '',
            sell_site: ''
          }
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.axiosCatch(err)
      })
    },
    saleUpdateClick () {
      this.drawer = true
      this.updateFlag = false
      this.ruleForm = this.data
      this.ruleForm.resource = '添加新订单'
    },
    updateSaleInfoClick () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          var tmp_time = this.ruleForm.sell_time
          if (typeof tmp_time === 'string') {
            tmp_time = this.strToTimestamp(tmp_time)
          } else {
            tmp_time = tmp_time.getTime()
          }
          var data = {
            token: localStorage.getItem('token'),
            customer_code: this.ruleForm.customer_code,
            company_name: this.ruleForm.company_name,
            sell_time: tmp_time,
            sell_code: this.ruleForm.sell_code,
            sell_site: this.ruleForm.sell_site
          }
          // console.log(data)
          this.updateAxios(data);
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateAxios (data) {
      this.axios({
        method: 'put',
        url: `/spc/sale/info/${this.id}/`,
        data
      }).then(res => {
        if (res.data.code === 1000) {
          this.updateFlag = true
          this.$emit('updateData', this.ruleForm)
          this.$refs.saleDrawer.hide()
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
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
    },
    strToTimestamp (date) {
      var tmp = date.substring(0,19);  
      tmp = tmp.replace(/-/g,'/'); //必须把日期'-'转为'/'
      return new Date(date).getTime();
    }
  },

  mounted () {
    this.privilege = localStorage.getItem('privilege')

    if (this.data.customer_code !== null) {
      this.saleInfoFlag = true
    }
  }

}
</script>

<style lang="scss" scoped>
table.gridtable {
  font-family: verdana,arial,sans-serif;
  color:#333333;
  border-width: 1px;
  border-color: #666666;
  border-collapse: collapse;
  text-align: left;
  th {
      border-width: 1px;
      padding: 8px;
      border-style: solid;
      border-color: #666666;
      background-color: #dedede;
  }
  td {
    min-width: 100px;
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    background-color: #ffffff;
  }
}
.info-font-10{
  font-size: 10px;
}

.info-font-16{
  font-size: 16px;
}

.card-header-btn{
  float: right;
  padding: 3px 0;
  margin-right: 5px
}

.demo-drawer__content{
  margin-right: 16px;
}

.span-title{
  font-size: 19px;
  font-weight: 800;
  color: #409EFF;
}
</style>
