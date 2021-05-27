<template>
  <div>
      <el-table
      v-loading="loading"
      :data="userTableData"
      stripe
      border
      height="100%"
      style="width: 100%; max-height: 490px">
        <el-table-column type="index" width="50" fixed="left"></el-table-column>
        <el-table-column prop="device_name" label="设备名"></el-table-column>
        <el-table-column prop="nick_name" label="设备备注名称"></el-table-column>
        <el-table-column prop="from_product.productname" label="所属产品"></el-table-column>
        <el-table-column prop="from_user" label="所属人" width="86"></el-table-column>
        <el-table-column prop="status.status" label="设备状态" width="79"></el-table-column>
        <el-table-column prop="status.last_line" label="最后上线时间" width="165"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="handleClickView(scope.row)" type="text" size="small">
              <el-tooltip class="item" effect="dark" content="查看用户详情" placement="top">
                <i class="el-icon-view"></i>
              </el-tooltip>
            </el-button>
            <el-button @click="handleClickDelete(scope.row)" type="text" size="small" v-if="privilege === 1">
              <el-tooltip class="item" effect="dark" content="删除用户" placement="top">
                <i class="el-icon-delete"></i>
              </el-tooltip>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      privilege: 0,
      loading: false,
      userTableData: []
    }
  },
  methods: {
    handleClickView (val) {
      console.log('handleClickView' + val);
    },
    handleClickDelete (val) {
      console.log('handleClickDelete' + val);
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
    this.privilege = Number(localStorage.getItem('privilege'));


  }
}
</script>

<style>

</style>