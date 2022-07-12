<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { useFetch } from '@vueuse/core'
import { reactive } from 'vue'
import type { Rights } from '@/views/types'

const { data } = await useFetch('/api/rights/list', {
  beforeFetch({ options }) {
    const token = localStorage.getItem('token')
    if (token) (options.headers as Record<string, string>).Authorization = token
    return { options }
  }
}).json()

const tableData = reactive<Rights[]>(data.value?.data)
</script>

<template>
  <el-breadcrumb h-8 :separator-icon="ArrowRight" w-full select-none hidden md:block>
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/roles' }">权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <div w-full bg-light-100 h="[calc(100%-2rem)]" md:p-5 p-2 overflow-hidden>
    <el-table :data="tableData" height="100%" md:w-full w-500>
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="authName" label="权限说明" width="180" />
      <el-table-column prop="level" label="权限层级" />
      <el-table-column prop="pid" label="权限父ID" />
      <el-table-column prop="path" label="访问路径" />
    </el-table>
  </div>
</template>

<style scoped lang="scss"></style>
