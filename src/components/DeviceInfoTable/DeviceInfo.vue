<template>
  <table class="gridtable info-font-16" v-if="data.length">
    <tr>
        <th>所属产品</th>
        <td>{{ data[0].fk_product.product_name }}</td>
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
</template>

<script>
export default {
  name: 'deviceInfo',
  
  props: ['data'],
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