<template>
  <div>
    <div style="overflow: hidden; text-align: left;">
      <h1 style="font-size: 26px; margin-left: 16px; margin-top: 12px">
        {{ deviceName }}
        <br/>
        <small style="color: #777777; font-size: 16px; ">
          {{ nickName }}
          <el-button slot="reference" size="mini" type="text" @click="handleClickEdit">编辑</el-button>  
        </small>
      </h1>
    </div>
    <info-dialog 
    :label="nickName" 
    :oldLabel="nickName" 
    :id="id" title="设备备注名称" 
    :editVisible.sync="dialogEditVisible" 
    @editData="test2" 
    ident="nick_name">
    </info-dialog>
  </div>
</template>

<script>
import InfoDialog from 'components/EditDialog'

export default {
  name: 'deviceHeared',
  
  props: {
    id: {
      type: Number,
      default: -1
    },
    deviceName: {
      type: String,
      default: ''
    },
    nickName: {
      type: String,
      default: ""
    }
  },
  components: {
    InfoDialog
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
      dialogEditVisible: false,
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

  methods: {
    handleClickEdit () {
      this.dialogEditVisible = true
    },
    test2 (val) {
      this.$emit('update:nickName', val.label)
    }
  }
}
</script>

<style>

</style>