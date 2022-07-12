<script setup lang="ts">
import { onMounted, watch, reactive } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useFetch } from '@vueuse/core'
import type { AsideList } from '@/views/types'

const { width } = useWindowSize()
const router = useRouter()

let asideWidth = $ref('200px')
let isCollapse = $ref<boolean>(false)

// 监听屏幕宽度，如果小于768px，则折叠侧边栏
watch(
  width,
  () => {
    width.value < 768 ? (isCollapse = true) : (isCollapse = false)
    isCollapse ? (asideWidth = '60px') : (asideWidth = '200px')
  },
  { immediate: true }
)

const changeData = (data: boolean) => {
  isCollapse = data
  data ? (asideWidth = '60px') : (asideWidth = '200px')
}

// 存放数据
const asideList = reactive<AsideList[]>([])
const asideListIcons = reactive<string[]>([
  'i-ic-baseline-people-outline',
  'i-ic-outline-align-vertical-top',
  'i-ic-round-shopify',
  'i-ic-sharp-border-color',
  'i-ic-round-query-stats'
])

// 异步获取数据
onMounted(async () => {
  const { data } = await useFetch('/api/menus', {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  }).json()
  const res = data?.value?.data
  for (let i = 0; i < res?.length; i++) asideList[i] = res[i]
})

// 判断点击的是哪个菜单
const toPage = (index: string) => {
  switch (index) {
    case '/users':
      router.push({
        name: 'users'
      })
      break
    case '/roles':
      router.push({
        name: 'roles'
      })
      break
    case '/rights':
      router.push({
        name: 'rights'
      })
      break
    case '/goods':
      router.push({
        name: 'goods'
      })
      break
    case '/params':
      router.push({
        name: 'params'
      })
      break
    case '/categories':
      router.push({
        name: 'categories'
      })
      break
    case '/reports':
      router.push({
        name: 'reports'
      })
      break
    case '/orders':
      router.push({
        name: 'orders'
      })
      break
    default:
      break
  }
}

// 退出登录
const quit = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <div class="common-layout" w-full h="[calc(100%-1.25rem)]">
    <el-container w-full h-full>
      <el-header w-full h-60px p="!0">
        <div
          w-full
          h-full
          bg-gradient-to-r
          from-gray-400
          via-zinc-300
          to-light-500
          flex
          items-center
          border-b-1
          justify="between"
          border-light-500
        >
          <div h-full flex items-center>
            <img ml-6 h="2/5" md:h="3/5" mt-2 rotate-40 src="@/assets/logo.svg" alt="" />
            <div text-lg md:text-2xl ml-6 whitespace-nowrap>电商后台管理系统</div>
          </div>
          <div>
            <el-button type="primary" mr-5 color="#626aef" @click="quit">退出登录</el-button>
          </div>
        </div>
      </el-header>
      <el-container overflow-hidden>
        <el-aside :width="asideWidth" h-full overflow-hidden>
          <div w-full h-full overflow-hidden>
            <div
              h-8
              w-full
              bg-gray-100
              border-b-1
              border-light-500
              hidden
              md:block
              overflow-hidden
              cursor-pointer
              rounded
              @click="changeData(!isCollapse)"
            >
              <div v-show="isCollapse" mt-1 text-xl mx-auto i-ic-twotone-format-list-bulleted></div>
              <div v-show="!isCollapse" mt-1 text-xl mx-auto i-ic-round-collections-bookmark></div>
            </div>
            <el-scrollbar
              md:w-202px
              w-60px
              h-full
              scroll-smooth
              select-none
              overflow-x-hidden
              box-border
            >
              <el-menu
                class="el-menu-vertical-demo"
                h-full
                :default-active="router.currentRoute.value.path"
                :collapse="isCollapse"
                :collapse-transition="false"
                @select="toPage"
              >
                <el-sub-menu
                  v-for="(c1, index) in asideList"
                  :key="c1.id"
                  :index="c1.id + ''"
                  w-full
                >
                  <template #title>
                    <div mr-1 text-2xl :class="{ [asideListIcons[index]]: true }"></div>
                    <span>{{ c1.authName }}</span>
                  </template>
                  <el-menu-item v-for="c2 in c1?.children" :key="c2.id" :index="'/' + c2.path">
                    <div mr-2 class="i-ic-round-send"></div>
                    {{ c2.authName }}
                  </el-menu-item>
                </el-sub-menu>
              </el-menu>
            </el-scrollbar>
          </div>
        </el-aside>
        <el-main bg-zinc-200 h-full p="!0" md:px="!3" md:pt="!3" rounded>
          <Suspense>
            <template #default>
              <RouterView />
            </template>
            <template #fallback> loading... </template>
          </Suspense>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="scss"></style>
