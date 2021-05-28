<template>
  <div>
    <table class="gridtable info-font-16" v-if="data.length">
      <tr>  
        <th>设备编号</th>
        <td>
          {{data[0].actual_device_secret}}
          <el-button slot="reference" size="mini" type="text" 
          @click="handleClickEdit('actual_device_secret')" v-if="privilege === '1' || privilege === '2'">编辑</el-button>
        </td>
        <th>网络模块编号</th>
        <td>
          {{ data[0].module_secret }} 
          <el-button slot="reference" size="mini" type="text" 
          @click="handleClickEdit('module_secret')" v-if="privilege === '1' || privilege === '2'">编辑</el-button>
        </td>
        <th>其他链接信息</th>
        <td v-if="privilege === '1' || privilege === '2'">
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
                <td>{{ data[0].fk_product.product_key }}</td>
              </tr>
            </table>
            <el-button slot="reference" size="mini" type="text">查看</el-button>
          </el-popover>
        </td>
      </tr>
    </table>
    <info-dialog 
    :label="form.label"
    :ordLabel="form.ordLabel"
    :id="id" 
    :title="form.name" 
    :editVisible.sync="dialogEditVisible" 
    @editData="editData"
    :ident="form.ident"/>
  </div>
</template>

<script>
import InfoDialog from 'components/EditDialog'

export default {
  name: 'deviceLink',

  props: {
    data: Array,
    id: Number
  },

  components: {
    InfoDialog
  },

  data () {
    return {
      privilege: '',
      dialogEditVisible: false,
      form: {
        name: '',
        ident: '',
        oldLabel: '',
        label: ''
      },
    }
  },
  computed: {
    testCopy () {
      return `{
  "ProductKey": "${this.data[0].fk_product.product_key}",
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
    editData (val) {
      this.data[0][val.ident] = val.label
    }
  },

  mounted () {
    this.privilege = localStorage.getItem('privilege')
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