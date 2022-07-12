import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/Orders/index.vue')
  }
]

export default routes
