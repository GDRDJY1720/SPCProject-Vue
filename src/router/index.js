import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'
import Main from './mainRouter'
import Login from './loginRouter'

Vue.use(VueRouter)

// 获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
// 修改原型对象中的push方法
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  Login,
  Main,
  {
    path: '/*',
    redirect: '/main/home'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  var t = localStorage.getItem('t')
  if (to.path !== '/login' && from.path !== '/login') {
    store.commit('lastUrlChange', from.path)
    store.commit('nowUrlChange', to.path)
  }
  if (to.path === '/login') {
    next()
  } else if (t === null) {
    next('/login')
  } else if (t !== null) {
    var now = new Date()
    var end = new Date(parseInt(t))
    if (now >= end) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
