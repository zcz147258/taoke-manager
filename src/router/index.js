/*
 * @Descripttion:
 * @Author: mikasa
 * @Date: 2020-08-19 10:56:53
 */
/*
 * @Descripttion:
 * @Author: mikasa
 * @Date: 2020-08-19 10:56:53
 */
import Vue from 'vue'
import Router from 'vue-router'
import Accountlist from '@/views/account/accountlist'
import Rebate from '@/views/rebate/rebate'
import AllRebate from '@/views/allRebate/allRebate'
import Withdraws from '@/views/withdraws/withdraws'
import Sumwithdraws from '@/views/withdrawssum/sumwithdraws'
import Config from '@/views/config/config'
import Orderlist from '@/views/order/orderlist'
import Permission from '@/views/permission/permiss'
import Account from '@/views/account/accountlist'
import dividendDetails from '@/views/dividend/dividend'

Vue.use(Router)
var mapper = {
  '/account/accountlist': Accountlist,
  '/rebate/rebate': Rebate,
  '/allRebate/allRebate': AllRebate,
  '/withdraws/withdraws': Withdraws,
  '/withdrawssum/sumwithdraws': Sumwithdraws,
  '/order/orderlist': Orderlist,
  '/config/config': Config,
  '/sys/permission': Permission,
  '/account/accountlist': Account,
  '/dividend/details':dividendDetails
}
/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  // {
  //   path: '/account',
  //   component: Layout,
  //   redirect: '/account/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/account/accountlist'),
  //       name: 'accountlist',
  //       meta: { title: '账户', icon: 'user', noCache: true, affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/rebate',
  //   component: Layout,
  //   redirect: '/rebate/index',
  //   meta: { title: '用户返利明细', icon: 'dashboard', noCache: true, affix: true },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/rebate/rebate'),
  //       name: 'rebate',
  //       meta: { title: '用户返利明细', icon: 'dashboard', noCache: true, affix: true }
  //     },
  //     {
  //       path: 'index2',
  //       component: () => import('@/views/rebate/rebate'),
  //       name: 'rebate',
  //       meta: { title: '明细', icon: 'dashboard', noCache: true, affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/allRebate',
  //   component: Layout,
  //   redirect: '/allRebate/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/allRebate/allRebate'),
  //       name: 'allRebate',
  //       meta: { title: '用户返利汇总', icon: 'user', noCache: true, affix: true }
  //     }
  //   ]
  // },
  // {

  //   path: '/withdraws',
  //   component: Layout,
  //   redirect: '/withdraws/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/withdraws/withdraws'),
  //       name: 'withdraws',
  //       meta: { title: '提现记录', icon: 'user', noCache: true, affix: true }
  //     }
  //   ]
  // },
  // {

  //   path: '/withdrawssum',
  //   component: Layout,
  //   redirect: '/withdrawssum/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/withdrawssum/sumwithdraws'),
  //       name: 'withdrawssum',
  //       meta: { title: '提现汇总', icon: 'dashboard', noCache: true, affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/config',
  //   component: Layout,
  //   redirect: '/config/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/config/config'),
  //       name: 'config',
  //       meta: { title: '配置', icon: 'user', noCache: true, affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/order',
  //   component: Layout,
  //   redirect: '/order/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/order/orderlist'),
  //       name: 'orderlist',
  //       meta: { title: '订单', icon: 'dashboard', noCache: true, affix: true }
  //     }
  //   ]
  // },
  { path: '*', redirect: '/404' }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export var asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404' }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function addRoutes(arr) {
  // 获取当前的路由
  const currentRoute = router.options.routes
  const RoleList = arr
  RoleList.forEach(item => {
    // 如果有二级权限需要进行再次循环遍历
    //  const temp = ruleMappming[item.routerpath]
    if (item.children) {
      item.children.forEach(item1 => {
        console.log(mapper[item1.componentUrl])
        item1.component = mapper[item1.componentUrl]
      })
      currentRoute.push(item)
    } else {
      // 没有的情况
      currentRoute.push(item)
    }
  })
  router.addRoutes(currentRoute)
  //  console.log(router)
}
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
