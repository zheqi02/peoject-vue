import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/rights',
    name: 'rights',
    component: () => import('@/views/AuthorityManagement/Rights/index.vue')
  },
  {
    path: '/roles',
    name: 'roles',
    component: () => import('@/views/AuthorityManagement/Roles/index.vue')
  }
]

export default routes
