export default {
  path: 'log',
  component: () => import('@/views/Main/Log'),
  children: [
    {
      path: 'alarm',
      component: () => import('@/views/Main/Log/AlarmLog')
    },
    {
      path: 'run',
      component: () => import('@/views/Main/Log/RunLog')
    }
  ]
}
