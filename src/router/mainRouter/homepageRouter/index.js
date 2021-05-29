export default {
  path: 'home',
  component: () => import('@/views/Main/Home'),
  children: [
    {
      path: 'news',
      component: () => import('@/views/Main/Home/DeviceNews')
    },
    {
      path: 'map',
      component: () => import('@/views/Main/Home/BaiduMap')
    },
    {
      path: 'datav',
      component: () => import('@/views/Main/Home/DataV')
    },
    {
      path: 'test',
      component: () => import('@/views/Main/Home/Test')
    },
    {
      path: '',
      redirect: '/main/home/news'
    }
  ]
}
