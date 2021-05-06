<template>
  <div class="spc-main">
    <el-container style="height: 100%">
      <el-header style="padding-left: 0">
        <div class="demo-type">
          <!-- <el-image style="width: 200px; height: 100%" src="require('../../assets/拭擦.jpg')"></el-image> -->
          <img src="../../assets/拭擦.jpg" style="width: 200px; height: 100%">
        </div>
        <div>
          <el-dropdown style="margin-right: 10px; line-height: 20px" @command="handleCommand">
            <el-avatar :size="50" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class="el-dropdown-link">
            </el-avatar>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item icon="el-icon-plus" command="userInfo">个人信息</el-dropdown-item> -->
              <el-dropdown-item icon="el-icon-circle-plus" command="logout">账号注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="asideWidth + 'px'">
          <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" router style="border-right: 0">
            <el-menu-item @click="menuState" style="height: 30px; line-height: 30px">
              <i v-if="isCollapse" class="el-icon-d-arrow-right"></i>
              <i v-else class="el-icon-d-arrow-left"></i>
            </el-menu-item>
            <el-menu-item index="/main/home">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">设备</span>
              </template>
              <el-menu-item index="/main/device">
                <i class="el-icon-menu"></i>
                <span slot="title">设备信息</span>
              </el-menu-item>
              <el-menu-item index="/main/task">
                <i class="el-icon-menu"></i>
                <span slot="title">设备任务</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">日志</span>
              </template>
              <el-menu-item index="/main/log/alarm">
                <i class="el-icon-menu"></i>
                <span slot="title">伺服报警日志</span>
              </el-menu-item>
              <el-menu-item index="/main/log/run">
                <i class="el-icon-menu"></i>
                <span slot="title">设备运行日志</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TweenLite from 'gsap'

export default {
  data () {
    return {
      asideWidth: 65,
      isCollapse: true
    }
  },
  methods: {
    handleCommand (command) {
      if (command === 'logout') {
        this.handleLogout()
      }
    },
    handleLogout () {
      console.log('logout')
      localStorage.removeItem('userId')
      localStorage.removeItem('token')
      localStorage.removeItem('userRight')
      this.$router.push('/login')
    },
    menuState () {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.newAsideWidth(65)
      } else {
        this.newAsideWidth(201)
      }
    },
    errorHandler () {
      // 用于图片加载失败时使用
      return true
    },
    newAsideWidth (newValue) {
      const diff = this.asideWidth - newValue
      if (diff) {
        TweenLite.to(this.$data, { duration: 0.5, asideWidth: newValue })
      }
    }
  }
}
</script>

<style lang="scss">
.spc-main{
  height: 100%;
}

.el-header{
  div:nth-child(1){
    float: left;
  }
  div:nth-child(2){
    float: right;
    span{
      margin-top: 5px;
    }
  }
}

.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #FFFFFF;
    border-right: solid 1px #e6e6e6;
    color: #333;
    text-align: center;
  }

  .el-main {
    background-color: #FFFFFF;
    color: #333;
    text-align: center;
    // line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

</style>
