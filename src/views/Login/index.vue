<template>
  <div style="overflow: hidden">
    <div style="display: flex; justify-content: center; margin-top: 150px">
      <el-card style="width: 400px; text-align: center">
        <div slot="header" class="clearfix">
          <span class="login-title">欢迎登录固特SPC智能物联管理系统</span>
        </div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="0px"
          class="demo-ruleForm"
        >
          <el-form-item prop="username" :error="ruleForm.usernameErr">
            <el-input v-model="ruleForm.username" placeholder="请输入用户名/手机号/邮箱">
              <i slot="prepend" class="el-icon-s-custom" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password" :error="ruleForm.passwordErr">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="ruleForm.password"
              show-password
              @keyup.enter.native="doLogin()"
            >
              <i slot="prepend" class="el-icon-lock" />
            </el-input>
          </el-form-item>
          <el-form-item prop="code" v-if="codeFalg >= 2" :error="codeError">
            <el-row :span="24">
              <el-col :span="12">
                <el-input
                  v-model="ruleForm.code"
                  auto-complete="off"
                  placeholder="请输入验证码"
                  size=""
                  @keyup.enter.native="doLogin()"
                ></el-input>
              </el-col>
              <el-col :span="12">
                <div class="login-code" @click="refreshCode">
                  <!--验证码组件-->
                  <s-identify :identifyCode="identifyCode"></s-identify>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item style="margin-bottom: 5px">
            <div class="login-btn">
              <el-button size="medium" type="primary" style="width: 100%" @click="doLogin()">登录</el-button>
            </div>
          </el-form-item>
        </el-form>
        <!-- <div class="registered">
          <el-button class="registered-btn" type="text">立即注册</el-button>
        </div> -->
        <div>
          <p style="font-size: 12px; line-height: 30px; color: #eaeaea">
            Tips : 请输入账号密码登陆
          </p>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import SIdentify from 'components/SIdentify'

export default {
  components: {
    SIdentify
  },
  data() {
    var verCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'));
      } else {
        if (this.ruleForm.code !== this.identifyCode) {
          console.log(this.identifyCode)
          this.refreshCode()
          callback(new Error('验证码错误，请重新输入'));
        }
        callback();
      }
    };
    return {
      codeFalg: 0,
      codeError: '',
      identifyCode: "",
      identifyCodes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      ruleForm: {
        username: "",
        password: "",
        code: "",
        usernameErr: "",
        passwordErr: ""
      },
      rules: {
        username: [
          { required: true, message: "手机号或邮箱不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        code: [
          { validator: verCode, trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
    doLogin() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.ruleForm.usernameErr = null
          this.ruleForm.passwordErr = null
          this.axios.post("/spc/account/login/", {
            username: this.ruleForm.username,
            password: this.ruleForm.password
          }).then((res) => {
            if (res.data.code === 1000) {
              localStorage.setItem("t", res.data.data.end_time);
              localStorage.setItem("token", res.data.data.token);
              localStorage.setItem("privilege", res.data.data.privilege);
              localStorage.setItem("username", res.data.data.user_name);
              // 用于识别是否是外来访问，100为内部，其余为外部
              localStorage.setItem("c", res.data.data.customer);
              this.$router.push(this.$store.state.nowUrl);
            } else {
              if (res.data.code === 1001) {
                this.ruleForm.usernameErr = res.data.msg;
              } else if (res.data.code === 1002) {
                this.ruleForm.passwordErr = res.data.msg;
              }
              this.codeFalg++
              if (this.codeFalg >= 2) {
                this.refreshCode();
              }
              console.log(this.codeFalg)
            }
          }).catch((err) => {
            this.codeFalg++
            if (this.codeFalg >= 2) {
              this.refreshCode();
            }
            this.axiosCatch(err);
          })
        } else {
          this.codeFalg++
          if (this.codeFalg >= 2) {
            this.refreshCode();
          }
          console.log('error submit!!')
          return false
        }
      })

    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    },
    axiosCatch (err) {
      if (err.response) {
        if (err.response.status === 500) {
          this.$message.error("网络错误");
        } else if (err.response.status === 403) {
          if (err.response.data.code === "1001") {
            this.$message.error(err.response.data.msg);
            this.$router.push("/login");
          } else {
            this.$message.error("未知错误");
          }
        }
      } else if (err.request) {
        console.info(err.request);
      } else {
        console.info("error", err.message);
      }
    }
  },

  beforeRouteEnter(to, from, next) {
    // 获取本地存储的结束时间
    var t = localStorage.getItem('t')
    // 如果结束时间为空的时候，继续访问页面，如果时间不为空，但是当前时间大于了此时间，继续访问
    // 如果当前时间小于此时间，则直接跳转到主页面
    if (t === null) {
      next()
    } else {
      var now = new Date()
      var end = new Date(parseInt(t))
      console.log(now, end)
      if (now >= end) {
        next()
      } else {
        next('/')
      }
    }
    // next()
  }
};
</script>

<style lang="scss" scoped>
	.login-title {
		color: black;
		font-size: 16px !important;
		font-weight: 800;
		margin-left: 10px;
	}
  
  .registered {
    margin-bottom: 15px;
    overflow: hidden;

    .registered-btn {
      float: right;
      margin-right: 8px;
      font-size: 12px;
    }
  }
</style>
