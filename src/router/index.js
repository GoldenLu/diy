import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/common/Home.vue'
import Dashboard from '../components/page/Dashboard.vue'
import Table from '../components/page/BaseTable'

Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

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
        }, {
          path: '/table',
          component: Table,
          meta: { title: '基础表格' }
        }
      ]
    }
  ]
})
