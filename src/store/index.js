import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lastUrl: '/',
    nowUrl: '/',
    formInline: {
      region: 'deviceName',
      deviceName: '',
      product: ''
    },
    currentPage: 1,
    deviceTableData: [],
    rowCount: 0,
    deviceTableDataAll: false,
    productInfoData: [],
    chartData: {
      Speed: [],
      Torque: [],
      Voltage: [],
      Current: []
    },
    chartFlag: 0,
    mapInfo: {}
  },
  mutations: {
    lastUrlChange (state, url) {
      state.lastUrl = url
    },
    nowUrlChange (state, url) {
      state.nowUrl = url
    },
    deviceFormInlineChange (state, formInline) {
      state.formInline = formInline
    },
    pageChange (state, page) {
      state.currentPage = page
    },
    deviceDataChange (state, data) {
      state.deviceTableData = data
    },
    deviceDataAddChange (state, data) {
      state.deviceTableData.unshift(data)
      if (state.deviceTableData.length > 10) {
        state.deviceTableData.pop()
      }
    },
    deviceDataFlagChange (state, flag) {
      state.deviceTableDataAll = flag
    },
    deviceDataDetele (state, id) {
      var tmpArr = state.deviceTableData
      for (var i in tmpArr) {
        if (tmpArr[i].id === id) {
          state.deviceTableData.splice(i, 1)
          state.rowCount--
        }
      }
    },
    deviceCountChange (state, count) {
      state.rowCount = count
    },
    productInfoDataChange (state, data) {
      state.productInfoData = data
    },
    chartDataChange (state, data) {
      if (!(data instanceof Array)) {
        return
      }

      state.chartData = {
        Speed: [],
        Torque: [],
        Voltage: [],
        Current: []
      }

      if (!data.length) {
        return
      }

      for (let i = 0; i < data.length; i++) {
        const t = data[i].Identifier
        state.chartData[t.split('_')[0]].push(data[i])
      }
    },
    chartFlagChange (state) {
      state.chartFlag = new Date().getTime()
    },
    mapInfoChange (state, data) {
      state.mapInfo = data
    }
  },
  actions: {
  },
  modules: {
  }
})
