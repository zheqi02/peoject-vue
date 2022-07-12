<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { defineAsyncComponent } from 'vue'
const RoleList = defineAsyncComponent(
  () => import('@/views/AuthorityManagement/Roles/RoleList.vue')
)
</script>

<template>
  <el-breadcrumb h-8 :separator-icon="ArrowRight" w-full select-none hidden md:block>
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/roles' }">权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <div w-full bg-light-100 h="[calc(100%-2rem)]" md:p-5 p-2>
    <Suspense>
      <template #default>
        <RoleList />
      </template>
      <template #fallback> loding... </template>
    </Suspense>
  </div>
</template>

<style scoped lang="scss"></style>
