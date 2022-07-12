<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { init } from 'echarts'
import type { ECharts } from 'echarts'
import request from '@/api' // 这个封装的axios可能版本不对造成了跨域问题
import { useFetch } from '@vueuse/core'
import { onMounted, ref } from 'vue'
const echartsRef = ref<HTMLElement>()
const { data } = await useFetch('/api/reports/type/1', {
  beforeFetch({ options }) {
    const token = localStorage.getItem('token')
    if (token) (options.headers as Record<string, string>).Authorization = token
    return { options }
  }
}).json()
const res = data.value
res.data.series.forEach((item: any) => {
  delete item.areaStyle.normal
  return item
})
const option = {
  ...res.data,
  title: {
    text: '用户来源'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#E9EEF3'
      }
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  // xAxis: [
  // 	{
  // 		boundaryGap: false
  // 	}
  // ],
  yAxis: [
    {
      type: 'value'
    }
  ]
}
onMounted(() => {
  const charEch: ECharts = init(echartsRef.value as HTMLElement)
  charEch.setOption(option)
})
</script>

<template>
  <div h-full w-full overflow="hidden">
    <el-breadcrumb h-8 :separator-icon="ArrowRight" w-full select-none hidden md:block>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user' }">数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <div w-full bg-light-100 h="[calc(100%-2rem)]" md:p-5 p-2>
      <div ref="echartsRef" w-full h-full></div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
