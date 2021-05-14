<template>
  <div class="spc_table">
    <table class="gridtable info-font-16" v-if="data.length">
        <tr>
            <th>设备名称</th>
            <td>{{data[0].device_name}}</td>
            <th>
              设备备注名称
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="content">
                <i class="el-icon-info" slot="reference" style="margin-left: 3px"></i>
              </el-popover>
            </th>
            <td>{{data[0].nick_name}} <el-button slot="reference" size="mini" type="text" @click="handleClickEdit('nick_name')">编辑</el-button></td>
            <th>拥有者</th>
            <td>{{ data[0].from_user }}</td>
        </tr>
        <tr>
            <th>所属产品</th>
            <td>{{ data[0].from_product.productname }}</td>
            <th>伺服数量</th>
            <td>{{ data[0].from_product.product_servo_num }}</td>
        </tr>
        <tr v-if="privilege">
            <th>设备编号</th>
            <td>{{data[0].actual_device_secret}} <el-button slot="reference" size="mini" type="text" @click="handleClickEdit('actual_device_secret')">编辑</el-button></td>
            <th>网络模块编号</th>
            <td>{{ data[0].module_secret }} <el-button slot="reference" size="mini" type="text" @click="handleClickEdit('module_secret')">编辑</el-button></td>
            <th>其他链接信息</th>
            <td>
              <el-popover
              placement="top-start"
              width="312">
                <el-button size="mini" type="text" v-clipboard:copy="testCopy" v-clipboard:success="onCopy">一键复制</el-button>
                <table class="gridtable info-font-10">
                  <tr>
                    <th>设备名称</th>
                    <td>{{data[0].device_name}}</td>
                  </tr>
                  <tr>
                    <th>设备标识</th>
                    <td>{{data[0].device_secret}}</td>
                  </tr>
                  <tr>
                    <th>产品标识</th>
                    <td>{{ data[0].from_product.productkey }}</td>
                  </tr>
                </table>
                <el-button slot="reference" size="mini" type="text">查看</el-button>
              </el-popover>
            </td>
        </tr>
        <tr>
            <th>设备状态</th>
            <td>{{data[0].status.status}}</td>
            <th>设备最后上线时间</th>
            <td>{{ data[0].status.last_line }}</td>
        </tr>
    </table>
    <el-dialog :title="'编辑' + form.name" :visible.sync="dialogEditVisible" :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item :label="form.name" :label-width="formLabelWidth" :prop="form.ident">
          <el-input v-model="form.label" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClickCertain" :loading="clickLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['data', 'privilege'],
  data () {
    var validatePass = (rule, value, callback) => {
      var l = this.form.label.replace(/[\u0391-\uFFE5]/g, 'aa').length
      if (l >= 4 && l <= 64) {
        callback()
      } else {
        callback(new Error('请输入 4 ~ 64 个字符，中文及日文算 2 个字符'))
      }
    }
    return {
      dialogEditVisible: false,
      formLabelWidth: '120px',
      form: {
        name: '',
        ident: '',
        oldLabel: '',
        label: ''
      },
      clickLoading: false,
      content: '支持中文、英文字母、日文、数字和下划线（_），长度限制为 4 ~ 64 个字符，中文及日文算 2 个字符',
      rules: {
        nick_name: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    testCopy () {
      return `{
  "ProductKey": "${this.data[0].from_product.productkey}",
  "DeviceName": "${this.data[0].device_name}",
  "DeviceSecret": "${this.data[0].device_secret}"
}`
    }
  },
  methods: {
    onCopy (e) {
      this.$message({
        message: '复制成功！',
        type: 'success'
      })
    },
    handleClickEdit (clickTypy) {
      this.dialogEditVisible = true
      this.form.ident = clickTypy
      switch (clickTypy) {
        case 'nick_name': {
          this.form.name = '设备备注名称'
          this.form.label = this.data[0].nick_name
          this.form.oldLabel = this.data[0].nick_name
          break
        }
        case 'actual_device_secret': {
          this.form.name = '实际设备编号'
          this.form.label = this.data[0].actual_device_secret
          this.form.oldLabel = this.data[0].actual_device_secret
          break
        }
        case 'module_secret': {
          this.form.name = '网络模块编号'
          this.form.label = this.data[0].module_secret
          this.form.oldLabel = this.data[0].module_secret
          break
        }
        default: {
          this.$message('error')
        }
      }
    },
    handleClickCertain () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.clickLoading = true
          if (this.form.oldLabel === this.form.label) {
            this.clickLoading = false
            this.dialogEditVisible = false
          } else {
            const data = {
              token: localStorage.getItem('token'),
              sign: this.form.ident,
              data: this.form.label
            }
            this.axiosSend(data)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClose () {
      this.$refs.ruleForm.resetFields()
      this.dialogEditVisible = false
    },
    axiosSend (data) {
      this.axios({
        method: 'patch',
        url: `/spc/device/info/${this.data[0].id}/`,
        data: data
      }).then(res => {
        if (res.data.code === 1000) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.data[0][this.form.ident] = this.form.label
          this.clickLoading = false
          this.dialogEditVisible = false
        } else {
          this.clickLoading = false
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.clickLoading = false
        if (err.response) {
          if (err.response.status === 500) {
            this.$message.error('网络错误')
          } else if (err.response.status === 403) {
            if (err.response.data.code === '1001') {
              this.$message.error(err.response.data.msg)
              this.$router.push('/login')
            } else {
              this.$message.error('未知错误')
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
}
</script>

<style lang='scss' scoped>
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

</style>
