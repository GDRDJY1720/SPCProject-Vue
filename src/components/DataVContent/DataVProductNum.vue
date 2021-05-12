<template>
  <div style="height: 100%; width: 100%; margin: 5px 5px; overflow: hidden">
    <div style="text-align: center; overflow: hidden; height: 10%">
      <span style="margin-top: 10px; display: block">各产品设备数量统计</span>
    </div>
    <div style="height: 90%">
      <dv-capsule-chart :config="config" style="height: 100%"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array
    }
  },
  data () {
    return {
      config: {
        data: this.data,
        unit: '台',
        showValue: true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  span{
    font-size: 19px;
    font-weight: 800;
    color: #5cd9e8;
  }
</style>
