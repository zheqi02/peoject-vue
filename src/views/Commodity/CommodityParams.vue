<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import type { Categories } from '@/views/types'
import { reactive, ref, computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { ElTreeV2 } from 'element-plus'
import { useFetch } from '@vueuse/core'

const { data: aaa } = await useFetch('/api/categories', {
  beforeFetch({ options }) {
    const token = localStorage.getItem('token')
    if (token) (options.headers as Record<string, string>).Authorization = token
    return { options }
  }
}).json()
const res = aaa.value

let dialogFormVisible = $ref<boolean>(false)
interface DataForm {
  attr_name: string
  attr_sel: ComputedRef<string>
  attr_vals: string
  isDynamicCondition?: boolean
  id: number
}

const dataForm = reactive<DataForm>({
  attr_name: '',
  attr_sel: computed((): string => {
    return dataForm.isDynamicCondition ? 'many' : 'only'
  }),
  attr_vals: '',
  isDynamicCondition: false,
  id: 0
})

const query = ref('')
const treeRef = ref<InstanceType<typeof ElTreeV2>>()
const data: Categories[] = res.data

const props = {
  value: 'cat_id',
  label: 'cat_name',
  children: 'children'
}

const onQueryChanged = (query: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  treeRef.value!.filter(query)
}

const filterMethod = (query: string, node: Categories) => {
  return node.cat_name.includes(query)
}

const setParams = (data: Categories) => {
  if (data.cat_level === 2) {
    dataForm.id = data.cat_id
    dataForm.attr_name = data.cat_name
    dialogFormVisible = true
  }
}

const add = async () => {
  dialogFormVisible = false
  await useFetch('/api/categories/' + dataForm.id + '/attributes', {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  })
    .post({
      attr_name: dataForm.attr_name,
      attr_sel: dataForm.attr_sel,
      attr_vals: dataForm.attr_vals
    })
    .json()
  dataForm.attr_name = ''
  dataForm.attr_vals = ''
  dataForm.isDynamicCondition = false
  dataForm.id = 0
}
</script>

<template>
  <el-dialog v-model="dialogFormVisible" :width="300" title="">
    <el-form :model="dataForm">
      <el-form-item label="参数名字：" :label-width="100">
        <el-input v-model="dataForm.attr_name" autocomplete="off" />
      </el-form-item>
      <el-checkbox v-model="dataForm.isDynamicCondition" label="是否添加动态参数" border ml />
      <el-input
        v-if="dataForm.isDynamicCondition"
        v-model="dataForm.attr_vals"
        :rows="2"
        type="textarea"
        placeholder="输入正确参数，逗号分隔"
        mt
        ml
      />
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="add">添加</el-button>
      </span>
    </template>
  </el-dialog>
  <el-breadcrumb h-8 :separator-icon="ArrowRight" w-full select-none hidden md:block>
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/roles' }">商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>分类参数</el-breadcrumb-item>
  </el-breadcrumb>
  <div w-full bg-light-100 h="[calc(100%-2rem)]" md:px-5 md:pt-5 px-2 pt-2 overflow-hidden>
    <el-input v-model="query" placeholder="Please enter keyword" @input="onQueryChanged" />
    <el-tree-v2
      ref="treeRef"
      :data="data"
      :props="props"
      :filter-method="(filterMethod as any)"
      :height="850"
      mt
      @node-click="setParams as any"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-virtual-scrollbar) {
  display: none;
}
</style>
