import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/goods',
    name: 'goods',
    component: () => import('@/views/Commodity/CommodityGoods.vue')
  },
  {
    path: '/params',
    name: 'params',
    component: () => import('@/views/Commodity/CommodityParams.vue')
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/views/Commodity/CommodityCategories.vue')
  }
]

export default routes
