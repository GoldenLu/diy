import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/common/Home.vue'
import Dashboard from '../components/page/Dashboard.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      meta: { title: '自述文件' },
      children: [
        {
          path: '/dashboard',
          component: Dashboard,
          meta: { title: '系统首页' }
        }
      ]
    }
  ]
})
