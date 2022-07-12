<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { useFetch } from '@vueuse/core'
import { reactive } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type { DropType, TreeKey } from 'element-plus/es/components/tree/src/tree.type'
import type { Categories } from '@/views/types'

const prop = reactive({
  label: 'cat_name',
  children: 'children'
})

const { data: aaa } = await useFetch('/api/categories', {
  beforeFetch({ options }) {
    const token = localStorage.getItem('token')
    if (token) (options.headers as Record<string, string>).Authorization = token
    return { options }
  }
}).json()

const res = aaa.value

const data: Categories[] = res.data

const defaultOpen: TreeKey[] = data.flatMap((item) => {
  return item.children![0].children?.flatMap((child) => [child.cat_id])
}) as TreeKey[]

let cat_level = 0
let cat_name = ''
let deleteId = 0
const allowDrag = (draggingNode: Node) => {
  ;[cat_name, cat_level, deleteId] = [
    draggingNode.data.cat_name,
    draggingNode.data.cat_level,
    draggingNode.data.cat_id
  ]
  return true
}

const handleDrop = async (
  draggingNode: Node,
  dropNode: Node,
  dropType: DropType,
  ev: DragEvents
) => {
  await useFetch('/api/categories/' + deleteId, {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  }).delete()
  await useFetch('/api/categories', {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  })
    .post({
      cat_pid: dropNode.data.cat_id,
      cat_name: cat_name,
      cat_level: cat_level
    })
    .json()
}
</script>

<template>
  <div flex>
    <el-breadcrumb h-8 :separator-icon="ArrowRight" w-full select-none hidden md:block>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/roles' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div whitespace-nowrap>拖放实现分类</div>
  </div>
  <div w-full bg-light-100 h="[calc(100%-2rem)]" md:p-5 p-2 overflow-hidden>
    <el-tabs tab-position="left" h-full class="demo-tabs">
      <el-tab-pane v-for="item in data" :key="item.cat_id" :label="item.cat_name">
        <el-tree
          :allow-drag="allowDrag"
          :data="item.children"
          draggable
          accordion
          node-key="cat_id"
          :default-expanded-keys="defaultOpen"
          :props="prop"
          @node-drop="handleDrop"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss"></style>
