import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import axios from 'axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import VueQriously from 'vue-qriously'

import dataV from '@jiaminghi/data-view'

import * as echarts  from 'echarts'
import '@/common/echartsMap/china'

Vue.prototype.$echarts = echarts

// 适配flex
import '@/common/flexible.js'

Vue.use(dataV)

Vue.use(VueQriously)

Vue.config.productionTip = false
Vue.prototype.axios = axios
// Vue.use(GridManager)
Vue.use(ElementUI)

Vue.directive('loadmore', {
  bind(el, binding) {
    const selectWrap = el.querySelector('.el-table__body-wrapper')
    selectWrap.addEventListener('scroll', function() {
      let sign = 0
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      if (scrollDistance <= sign) {
        binding.value()
      }
    })
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
