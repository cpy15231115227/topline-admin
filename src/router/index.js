import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   // 在整个项目中，模块路径中的 @ 表示的是 src 目录
    //   // 无论你当前模块在哪里，@ 都可以直接定位到 src
    //   // 加载一个目录可以默认加载它的 index.js index.vue index.json
    //   // component: () => import('@views/home/index.vue')
    //   component: () => import('@/views/home')
    // },
    { // layout 显示到 App 根组件的路由出口
      // 这个路由名没有意义，他调用时也会从它的默认子路由调
      // name: 'layout', // 使用 JavaScript 命名路由导航不会渲染默认子路由
      path: '/',
      component: () => import('@/views/layout'),
      // 嵌套路由
      // 子路由
      // 所有 children 路由都显示到父路由的 router-view 中
      children: [
        {
          name: 'home',
          path: '', // 父路由的默认内容
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})

/*
  全局前置守卫
  当访问到页面的时候，会先进入这里
*/
router.beforeEach((to, from, next) => {
  // 路由导航前开启进度条
  nprogress.start()

  next() // 往后走
  const userInfo = window.localStorage.getItem('user_info')
  if (to.path !== '/login') {
    // 非登陆页面
    if (!userInfo) {
      // 没有登陆，跳转到登录页
      next({ name: 'login' })
    } else {
      // 登陆了，允许通过
      next()
    }
  } else {
    // 登陆页面
    if (!userInfo) {
      // 没有登陆，允许通过
      next()
    } else {
      // 登陆了，不允许通过
      // next(false) // 中断当前导航  在某个页面时
      window.location.href = '/#/'
      window.location.reload()
    }
  }
})

router.afterEach((to, from) => {
  // 路由导航完成关闭进度条
  nprogress.done()
})

export default router
