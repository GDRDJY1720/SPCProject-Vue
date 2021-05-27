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

import * as echarts from 'echarts'
import '@/common/echartsMap/china'

// 复制功能
import VueClipboard from 'vue-clipboard2'

// 适配flex
import '@/common/flexible.js'

import Moment from 'moment'

Vue.prototype.Moment = Moment

Vue.prototype.$echarts = echarts

Vue.use(VueClipboard)

Vue.use(dataV)

Vue.use(VueQriously)

Vue.config.productionTip = false
Vue.prototype.axios = axios
// Vue.use(GridManager)
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
