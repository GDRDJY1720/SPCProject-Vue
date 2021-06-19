<template>
  <div>
    <table class="gridtable info-font-16" v-if="data.length">
      <tr>
          <th>产品类型</th>
          <td>
            {{ data[0].device_product_name }}
            <el-button slot="reference" size="mini" type="text" 
            @click="handleClickEdit('device_product_name')" v-if="privilege === '1' || privilege === '2'">编辑</el-button>
          </td>
          <th>伺服数量</th>
          <td>{{ data[0].fk_product.product_servo_num }}</td>
      </tr>
      <tr>
        <th>设备状态</th>
        <td>{{data[0].status.status}}</td>
        <th>设备最后上线时间</th>
        <td>{{ data[0].status.last_line }}</td>
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
  name: 'deviceInfo',
  
  props: ['data', 'id'],

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

  components: {
    InfoDialog
  },

  methods: {
    editData (val) {
      this.data[0][val.ident] = val.label
    },

    handleClickEdit (clickTypy) {
      this.dialogEditVisible = true
      this.form.ident = clickTypy
      this.form.name = '产品名称'
      this.form.label = this.data[0].device_product_name
      this.form.oldLabel = this.data[0].device_product_name
    },
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