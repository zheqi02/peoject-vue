<script setup lang="ts">
import { ArrowRight, Search } from '@element-plus/icons-vue'
import { reactive, watch } from 'vue'
import { useDateFormat, useFetch } from '@vueuse/core'
import type { CreateForm } from '@/views/types'

const input = $ref<string>('')
let dialogFormVisible = $ref<boolean>(false)
let dialogFormVisible2 = $ref<boolean>(false)

const createForm = reactive<CreateForm>({
  goods_name: '',
  goods_price: null,
  goods_number: null,
  goods_cat: '',
  goods_weight: null
})

const editForm = reactive<CreateForm>({
  goods_name: '',
  goods_price: null,
  goods_number: null,
  goods_weight: null,
  goods_cat: ''
})

const getCommodityList = async () => {
  const { data } = await useFetch('/api/goods?pagenum=1&pagesize=15', {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  }).json()
  const res = data.value
  return res.data.goods.map((item: any) => {
    item.add_time = useDateFormat(item.add_time, 'MM-DD HH:mm:ss')
    item.goods_price = item.goods_price.toFixed(2) + '元'
    return item
  })
}
const res = await getCommodityList()
const tableData = reactive(res)

watch(
  () => input,
  async (ne) => {
    if (!ne) {
      const data = await getCommodityList()
      tableData.splice(0, tableData.length, ...data)
      return
    }
    const { data: aaa } = await useFetch('/api/goods/' + input, {
      beforeFetch({ options }) {
        const token = localStorage.getItem('token')
        if (token) (options.headers as Record<string, string>).Authorization = token
        return { options }
      }
    }).json()
    const data = aaa.value.data
    tableData.splice(0, tableData.length)
    tableData.push(data)
  }
)

let EditId = 0
const editRole = (id: number) => {
  dialogFormVisible2 = true
  EditId = id
}

const add = () => {
  dialogFormVisible = true
}

const sendAdd = async () => {
  dialogFormVisible = false
  const { data: aaa } = await useFetch('/api/goods', {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  })
    .post(createForm)
    .json()
  const resu = aaa.value
  createForm.goods_cat = ''
  createForm.goods_name = ''
  createForm.goods_price = null
  createForm.goods_number = null
  createForm.goods_weight = null
  if (resu.meta.status === 400) {
    alert(resu.meta.msg)
    return
  }
  const data = await getCommodityList()
  tableData.splice(0, tableData.length, ...data)
}

const sendModification = async () => {
  dialogFormVisible2 = false
  const { data: aaa } = await useFetch('/api/goods/' + EditId, {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  })
    .put(editForm)
    .json()
  const resu = aaa.value
  createForm.goods_cat = ''
  editForm.goods_name = ''
  editForm.goods_price = null
  editForm.goods_number = null
  editForm.goods_weight = null
  editForm.goods_cat = ''
  if (resu.meta.status === 400) {
    alert(resu.meta.msg)
    return
  }
  const data = await getCommodityList()
  tableData.splice(0, tableData.length, ...data)
}

const deleteData = async (id: number) => {
  EditId = id
  const { data: aaa } = useFetch('/api/goods' + id, {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  })
    .delete()
    .json()
  const resu = aaa.value
  if (resu.meta.status === 400) {
    alert(resu.meta.msg)
    return
  }
  const data = await getCommodityList()
  tableData.splice(0, tableData.length, ...data)
}
</script>

<template>
  <el-breadcrumb h-8 :separator-icon="ArrowRight" w-full select-none hidden md:block>
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/roles' }">商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
  <div md:w-full w-500 bg-light-100 h="[calc(100%-2rem)]" md:p-5 p-2 overflow-hidden>
    <div flex w-80 items-center>
      <el-input
        v-model.number="input"
        class="w-50 m-2"
        placeholder="请输入商品ID"
        :suffix-icon="Search"
      />
      <el-button type="primary" @click="add">添加</el-button>
    </div>
    <el-table :data="tableData" w-full border mt>
      <el-table-column prop="goods_id" label="#" width="50" />
      <el-table-column prop="goods_name" label="商品名称" width="800" />
      <el-table-column prop="goods_price" label="商品价格" />
      <el-table-column prop="add_time" label="创建时间" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="success" size="small" @click="editRole(scope.row.goods_id)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="deleteData(scope.row.goods_id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="dialogFormVisible" width="500px" title="添加商品">
    <el-form :model="createForm">
      <el-form-item label="商品名称：" :label-width="100">
        <el-input v-model="createForm.goods_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品价格：" :label-width="100">
        <el-input v-model.number="createForm.goods_price" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品数量：" :label-width="100">
        <el-input v-model.number="createForm.goods_number" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品重量：" :label-width="100">
        <el-input v-model.number="createForm.goods_weight" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品分类：" :label-width="100">
        <el-input
          v-model="createForm.goods_cat"
          placeholder="例如: 1, 2, 3, 逗号隔开，或者单个数字啥的"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="sendAdd">添加</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogFormVisible2" width="500px" title="编辑商品">
    <el-form :model="editForm">
      <el-form-item label="商品名称：" :label-width="100">
        <el-input v-model="editForm.goods_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品价格：" :label-width="100">
        <el-input v-model.number="editForm.goods_price" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品数量：" :label-width="100">
        <el-input v-model.number="editForm.goods_number" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品重量：" :label-width="100">
        <el-input v-model.number="editForm.goods_weight" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品分类：" :label-width="100">
        <el-input
          v-model="editForm.goods_cat"
          placeholder="例如: 1, 2, 3, 逗号隔开，或者单个数字啥的"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="sendModification">修改</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
