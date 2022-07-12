<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import request from '@/api'
import { useDateFormat, useFetch } from '@vueuse/core'
import { reactive } from 'vue'
import type { EditForm2, Order } from '@/views/types'

let dialogFormVisible = $ref<boolean>(false)
let dialogFormVisible2 = $ref<boolean>(false)
const editForm = reactive<EditForm2 & any>({
  is_send: null,
  order_pay: null,
  order_price: null,
  order_number: null,
  pay_status: null
})

const { data } = await useFetch('/api/orders?pagenum=1&pagesize=10', {
  beforeFetch({ options }) {
    const token = localStorage.getItem('token')
    if (token) (options.headers as Record<string, string>).Authorization = token
    return { options }
  }
}).json()
const total = data.value.total
const dataList = async (pagenum: number, pagesize: number) => {
  const { data } = await useFetch(`/api/orders?pagenum=${pagenum}&pagesize=${pagesize}`, {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  }).json()
  const res = data.value
  return res.data.goods.map((item: any) => {
    return {
      ...item,
      pay_status: item.status ? '已支付' : '未支付',
      create_time: useDateFormat(item.create_time, 'hh:mm:ss')
    }
  })
}
const goods: Order[] = await dataList(1, 10)
const tableData = reactive<Order[]>(goods)
let EditId = $ref<number | null>(null)
const editData = (id: number) => {
  EditId = id
  dialogFormVisible = true
}
const sendEdit = async () => {
  dialogFormVisible = false
  if (EditId) {
    await useFetch('/api/orders/' + EditId, {
      beforeFetch({ options }) {
        const token = localStorage.getItem('token')
        if (token) (options.headers as Record<string, string>).Authorization = token
        return { options }
      }
    })
      .put({
        is_send: editForm.is_send,
        order_pay: editForm.order_pay,
        order_price: editForm.order_price,
        order_number: editForm.order_number,
        pay_status: editForm.pay_status // 不知道为什么传过去值没改变
      })
      .json()
    editForm.is_send = null
    editForm.order_pay = null
    editForm.order_price = null
    editForm.order_number = null
    editForm.pay_status = null
  }
}
const activities: Array<{
  time: string
  content: string
  ftime: string
  location: string
}> = [
  {
    time: '2018-05-10 09:39:00',
    ftime: '2018-05-10 09:39:00',
    content: '已签收,感谢使用顺丰,期待再次为您服务',
    location: ''
  },
  {
    time: '2018-05-10 08:23:00',
    ftime: '2018-05-10 08:23:00',
    content: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
    location: ''
  },
  {
    time: '2018-05-10 07:32:00',
    ftime: '2018-05-10 07:32:00',
    content: '快件到达 [北京海淀育新小区营业点]',
    location: ''
  },
  {
    time: '2018-05-10 02:03:00',
    ftime: '2018-05-10 02:03:00',
    content: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
    location: ''
  },
  {
    time: '2018-05-09 23:05:00',
    ftime: '2018-05-09 23:05:00',
    content: '快件到达 [北京顺义集散中心]',
    location: ''
  },
  {
    time: '2018-05-09 21:21:00',
    ftime: '2018-05-09 21:21:00',
    content: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
    location: ''
  },
  {
    time: '2018-05-09 13:07:00',
    ftime: '2018-05-09 13:07:00',
    content: '顺丰速运 已收取快件',
    location: ''
  },
  {
    time: '2018-05-09 12:25:03',
    ftime: '2018-05-09 12:25:03',
    content: '卖家发货',
    location: ''
  },
  {
    time: '2018-05-09 12:22:24',
    ftime: '2018-05-09 12:22:24',
    content: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
    location: ''
  },
  {
    time: '2018-05-08 21:36:04',
    ftime: '2018-05-08 21:36:04',
    content: '商品已经下单',
    location: ''
  }
]
const setData = async (id: number) => {
  dialogFormVisible2 = true
  // 这个接口有点问题, 数据先mock一下
  // const result = await request({
  // 	url: 'kuaidi/' + id,
  // 	method: 'get'
  // })
}
const prev = async (n: number) => {
  tableData.splice(0, tableData.length, ...(await dataList(n, 10)))
}
const next = async (n: number) => {
  tableData.splice(0, tableData.length, ...(await dataList(n, 10)))
}
</script>

<template>
  <div h-full w-full overflow="hidden">
    <el-breadcrumb h-8 :separator-icon="ArrowRight" w-full select-none hidden md:block>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user' }">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div w-full bg-light-100 h="[calc(100%-2rem)]" md:p-5 p-2>
      <el-table :data="tableData" w-full border mt>
        <el-table-column prop="order_id" label="#" width="50" />
        <el-table-column prop="order_number" label="订单编号" />
        <el-table-column prop="order_price" label="订单价格" />
        <el-table-column prop="pay_status" label="是否付款" />
        <el-table-column prop="is_send" label="是否发货" />
        <el-table-column prop="create_time" label="下单时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="success" size="small" @click="editData(scope.row.order_id)"
              >编辑</el-button
            >
            <el-button type="info" size="small" @click="setData(scope.row.order_id)"
              >物流信息</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        @prev-click="prev"
        @next-click="next"
      />
    </div>
  </div>
  <el-dialog v-model="dialogFormVisible2" width="500px" title="添加商品">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.time"
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>
  </el-dialog>
  <el-dialog v-model="dialogFormVisible" width="500px" title="添加商品">
    <el-form :model="editForm">
      <el-form-item label="订单数量" prop="order_number">
        <el-input v-model="editForm.order_number" placeholder="请输入订单数量" />
      </el-form-item>
      <el-form-item label="订单价格" prop="order_price">
        <el-input v-model="editForm.order_price" placeholder="请输入订单价格" />
      </el-form-item>
      <el-form-item label="是否付款" prop="pay_status">
        <el-radio-group v-model="editForm.pay_status">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否发货" prop="is_send">
        <el-radio-group v-model="editForm.is_send">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支付方式" prop="is_send">
        <el-radio-group v-model="editForm.order_pay">
          <el-radio label="0">未支付</el-radio>
          <el-radio label="1">支付宝</el-radio>
          <el-radio label="2">微信</el-radio>
          <el-radio label="3">银联</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="sendEdit">添加</el-button>
      </span>
    </template>
  </el-dialog>
</template>
