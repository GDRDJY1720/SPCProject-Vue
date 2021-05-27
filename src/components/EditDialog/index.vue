<template>
  <el-dialog :title="'编辑' + title" :visible.sync="editVisible" :before-close="handleClose">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item :label="title" :label-width="labelWidth" :prop="ident">
        <el-input v-model="ruleForm.label" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClickCertain" :loading="clickLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    id: Number,
    title: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    ident: String,
    label: String,
    oldLabel: String,
    editVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    var validatePass = (rule, value, callback) => {
      if (this.ruleForm.label === '') {
        callback()
      } else {
        var l = this.ruleForm.label.replace(/[\u0391-\uFFE5]/g, 'aa').length
        if (l >= 4 && l <= 64) {
          callback()
        } else {
          callback(new Error('请输入 4 ~ 64 个字符，中文及日文算 2 个字符'))
        }
      }
    }
    return {
      clickLoading: false,
      ruleForm: {
        label: this.label,
        oldLabel: this.oldLabel
      },
      rules: {
        nick_name: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },

  watch: {
    // 监听标识符是否改变，如果改变了，就重新获取一遍值
    ident: function() {
      this.ruleForm = {
        label: this.label,
        oldLabel: this.oldLabel
      }
    }
  },

  methods: {
    handleClose () {
      this.$refs.ruleForm.resetFields()
      this.$emit('update:editVisible', false)
    },
    handleClickCertain () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.clickLoading = true
          if (this.ruleForm.oldLabel === this.ruleForm.label) {
            this.clickLoading = false
            this.$emit('update:editVisible', false)
          } else {
            const data = {
              token: localStorage.getItem('token'),
              sign: this.ident,
              data: this.ruleForm.label
            }
            this.axiosSend(data)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    axiosSend (data) {
      this.axios({
        method: 'patch',
        url: `/spc/device/info/${this.id}/`,
        data: data
      }).then(res => {
        if (res.data.code === 1000) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.clickLoading = false
          this.ruleForm.oldLabel = this.ruleForm.label
          this.$emit('update:editVisible', false)
          this.$emit('editData', {
            label: this.ruleForm.label,
            ident: this.ident
          })
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
  },

  // updated () {
  //   console.log('updated')
  //   this.ruleForm.label = this.label;
  //   this.ruleForm.oldLabel = this.oldLabel;
  // }
}
</script>

<style>

</style>