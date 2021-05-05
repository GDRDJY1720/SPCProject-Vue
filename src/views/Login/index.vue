<template>
  <div>
    <div style="display: flex;justify-content: center;margin-top: 150px">
      <el-card style="width: 400px; text-align: center;">
        <div slot="header" class="clearfix">
          <span>登录</span>
        </div>
        <table>
          <tr>
            <td>用户名</td>
            <td>
              <el-input v-model="user.phoneNum" placeholder="请输入电话"></el-input>
            </td>
          </tr>
          <tr>
            <td>密码</td>
            <td>
              <el-input type="password" v-model="user.password" placeholder="请输入密码" @keydown.enter.native="doLogin"></el-input>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-button style="width: 300px" type="primary" @click="doLogin">登录</el-button>
            </td>
          </tr>
        </table>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      user: {
        phoneNum: '',
        password: ''
      }
    }
  },
  methods: {
    doLogin () {
      this.axios({
        method: 'post',
        url: '/spc/account/login/',
        data: {
          phoneNum: this.user.phoneNum,
          password: this.user.password
        }
      }).then(res => {
        if (res.data.code === 1000) {
          localStorage.setItem('t', res.data.data.end_time)
          localStorage.setItem('token', res.data.data.token)
          localStorage.setItem('privilege', res.data.data.privilege)
          localStorage.setItem('username', res.data.data.user_name)
          this.$router.push(this.$store.state.nowUrl)
        } else {
          this.$message(res.data.msg)
        }
      }).catch(err => {
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
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
