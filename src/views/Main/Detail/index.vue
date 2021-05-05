<template>
  <div style="height: 100%">
      <el-page-header @back="goBack" content="设备详情"></el-page-header>
      <el-tabs v-model="activeName" :tab-position="tabPosition">
          <el-tab-pane name="0" label="设备信息">
              <info :id="$route.params.id"/>
          </el-tab-pane>
          <el-tab-pane name="1" label="设备伺服属性">
              <servo :id="$route.params.id"/>
          </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import info from './Info'
import servo from './Servo'

export default {
  data () {
    return {
      tabPosition: 'left',
      activeName: '0'
    }
  },
  components: {
    info,
    servo
  },
  methods: {
    goBack () {
      const lastUrl = this.$store.state.lastUrl
      if (lastUrl.indexOf('/detail')) {
        this.$router.push(lastUrl)
      }
    }
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
