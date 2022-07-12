import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/HomePage.vue'),
    redirect: 'users',
    children: []
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Home/LoginPage.vue'),
    redirect: '/login-tab',
    children: [
      {
        path: '/login-tab',
        name: 'login-tab',
        component: () => import('../views/Home/LoginTab.vue')
      },
      {
        path: '/register-tab',
        name: 'register-tab',
        component: () => import('../views/Home/RegisterTab.vue')
      }
    ]
  }
]
// 遍历vite提供的接口下的所有路由文件，依次放入routes
const modules = import.meta.globEager('./modules/*.ts')
for (const path in modules) {
  routes[0].children!.push(...modules[path].default)
}

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _, next) => {
  if (to.path === '/login-tab' || to.path === '/register-tab') {
    return next()
  }
  const token = localStorage.getItem('token')
  if (!token) next('/login')
  next()
})

export default router
