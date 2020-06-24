import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/common/Home.vue'
import Dashboard from '../components/page/Dashboard.vue'
import Table from '../components/page/BaseTable'
import Tabs from '../components/page/Tabs'
import Icon from '../components/page/Icon'
import Form from '../components/page/BaseForm'
import Editor from '../components/page/VueEditor'
import Markdown from '../components/page/Markdown'
import Upload from '../components/page/Upload'
import Charts from '../components/page/BaseCharts'
import Drag from '../components/page/DragList'
import DragDialog from '../components/page/DragDialog'
import I18n from '../components/page/I18n'

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
      redirect: '/dashboard'
    },
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
        }, {
          path: '/tabs',
          component: Tabs,
          meta: { title: 'tab选项卡' }
        }, {
          path: '/form',
          component: Form,
          meta: { title: '基本表单' }
        },
        {
          path: '/icon',
          component: Icon,
          meta: { title: '自定义图标' }
        },
        {
          path: '/editor',
          component: Editor,
          meta: { title: '富文本编辑器' }

        },
        {
          path: '/markdown',
          component: Markdown,
          meta: { title: 'markdown编辑器' }
        },
        {
          // 图片上传组件
          path: '/upload',
          component: Upload,
          meta: { title: '文件上传' }
        },
        {
          // vue-schart组件
          path: '/charts',
          component: Charts,
          meta: { title: 'schart图表' }
        },
        {
          // 拖拽列表组件
          path: '/drag',
          component: Drag,
          meta: { title: '拖拽列表' }
        },
        {
          // 拖拽Dialog组件
          path: '/dialog',
          component: DragDialog,
          meta: { title: '拖拽弹框' }
        },
        {
          // 国际化组件
          path: '/i18n',
          component: I18n,
          meta: { title: '国际化' }
        },
        {
          // 权限页面
          path: '/permission',
          component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
          meta: { title: '权限测试', permission: true }
        },
        {
          path: '/404',
          component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
          meta: { title: '404' }
        },
        {
          path: '/403',
          component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
          meta: { title: '403' }
        },
        {
          path: '/donate',
          component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
          meta: { title: '支持作者' }
        }

      ]
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
