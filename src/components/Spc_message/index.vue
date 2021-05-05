<template>
  <div class="message-box" v-show="msgBoxShow">
    <div class="mask" @click="cancel"></div>
    <div class="message-box-content">
      <div class="message-header">
        <label class="title">{{ label }}</label>
      </div>
      <div class="message-content">
          <slot/>
      </div>
      <div class="message-btn">
        <button class="btn-default" @click="cancel">取 消</button>
        <button class="btn-primary btn-confirm">确 定</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      msgBoxShow: this.show
    }
  },
  methods: {
    cancel () {
      console.log('message cancel')
      this.msgBoxShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .message-box {
    position: relative;
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 50000;
      background: rgba(0, 0, 0, 0.5);
    }

    .message-box-content {
      position: fixed;
      box-sizing: border-box;
      padding: 10px;
      min-width: 40%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 0.4em;
      background: #fff;
      z-index: 50001;

      .message-header{
        min-height: 36px;
        .title {
          font-size: 36px;
          line-height: 36px;
          font-weight: 600;
        }
      }
      .message-content{
        min-height: 100px;
      }
      .message-btn {
          margin-top: 10px;
          overflow: hidden;
          .btn-default {
              padding: 6px 12px;
              font-size: 1em;
              color: #555;
              border: 1px solid #d8dce5;
              border-radius: 0.2em;
              cursor: pointer;
              background-color: #fff;
              outline: none;
              &:hover {
              color: #2d8cf0;
              border-color: #c6e2ff;
              background-color: #ecf5ff;
              }
          }
          .btn-primary {
              padding: 6px 12px;
              font-size: 1em;
              color: #fff;
              border-radius: 0.2em;
              cursor: pointer;
              border: 1px solid #2d8cf0;
              background-color: #2d8cf0;
              outline: none;
              &:hover {
              opacity: .8;
              }
          }
          .btn-confirm {
              margin-left: 1em;
          }
      }
    }
    //   input {
    //     width: 100%;
    //     margin: 1em 0;
    //     background-color: #fff;
    //     border-radius: 0.4em;
    //     border: 1px solid #d8dce5;
    //     box-sizing: border-box;
    //     color: #5a5e66;
    //     display: inline-block;
    //     font-size: 14px;
    //     height: 3em;
    //     line-height: 1;
    //     outline: none;
    //     padding: 0 1em;
    //     &:focus {
    //       border-color: #2d8cf0;
    //     }
    //   }
  }
</style>
