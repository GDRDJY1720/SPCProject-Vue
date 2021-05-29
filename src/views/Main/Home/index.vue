<template>
    <div style="height: 100%; overflow: hidden;">
      <el-page-header @back="goBack" content="首页"></el-page-header>
      <el-tabs v-model="activeName" :tab-position="tabPosition" style="height: calc(100% - 40px)">
          <el-tab-pane name="0" label="设备概况">
              <router-view v-if="activeName === '0'"/>
          </el-tab-pane>
          <el-tab-pane name="1" label="设备位置">
              <router-view v-if="activeName === '1'"/>
          </el-tab-pane>
          <el-tab-pane name="2" label="信息总览">
              <router-view v-if="activeName === '2'"/>
          </el-tab-pane>
          <!-- <el-tab-pane name="3" label="测试页面" v-if="privilege">
              <router-view v-if="activeName === '3'"/>
          </el-tab-pane> -->
      </el-tabs>
    </div>
</template>

<script>
export default {
  data () {
    return {
      tabPosition: 'left',
      activeName: '0',
    }
  },
  watch: {
    activeName: function (val) {
      switch (Number(val)) {
        case 0: {
          this.$router.push('/main/home/news')
          break
        }
        case 1: {
          this.$router.push('/main/home/map')
          break
        }
        case 2: {
          this.$router.push('/main/home/datav')
          break
        }
        case 3: {
          this.$router.push('/main/home/test')
          break
        }
      }
    }
  },
  methods: {
    goBack () {
      const lastUrl = this.$store.state.lastUrl
      if (lastUrl.indexOf('/main/home') && lastUrl !== '/') {
        this.$router.push(lastUrl)
      }
    }
  },
  beforeMount () {
    const nowUrl = this.$store.state.nowUrl
    if (nowUrl === '/main/home/news' || nowUrl === '/') {
      this.activeName = '0'
    } else if (nowUrl === '/main/home/map') {
      this.activeName = '1'
    } else if (nowUrl === '/main/home/datav') {
      this.activeName = '2'
    } else {
      this.activeName = '3'
    }
  },
  updated () {
    var nowUrl = this.$store.state.nowUrl
    if (nowUrl === '/main/home/news' || nowUrl === '/') {
      this.activeName = '0'
    } else if (nowUrl === '/main/home/map') {
      this.activeName = '1'
    } else if (nowUrl === '/main/home/datav') {
      this.activeName = '2'
    } else {
      this.activeName = '3'
    }
  }
}
</script>

<style lang="scss">
.el-page-header{
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: solid 1px #EBEEF5;
}
.el-tabs__content{
  height: 100%;
  .el-tab-pane{
    height: 100%;
  }
}
</style>
