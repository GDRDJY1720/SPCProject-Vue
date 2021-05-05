import Device from './deviceRouter'
import Detail from './detailRouter'
import Home from './homepageRouter'
import Log from './logRouter'
import Task from './taskRouter'

export default {
  path: '/main',
  component: () => import('@/views/Main'),
  children: [
    Device,
    Detail,
    Home,
    Log,
    Task,
    {
      path: '',
      redirect: '/main/home'
    }
  ]
}
