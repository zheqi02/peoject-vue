<script setup lang="ts">
import { ArrowRight, Search } from '@element-plus/icons-vue'
import { reactive, onMounted, watch } from 'vue'
import { useWindowSize, useFetch } from '@vueuse/core'
import type { TableData, AddUserForm } from '@/views/types'

const { width } = useWindowSize() // 获取窗口宽度
const currentPage4 = $ref(1) // 当前页
const small = $ref(false) // 当前是否是小屏幕
const background = $ref(false) // 是否显示背景色
const disabled = $ref(false) // 是否禁用
const input = $ref<string>('') // 输入框内容
const tableData = reactive<TableData[]>([]) // 表格数据
const showData = reactive<TableData[]>([]) // 显示数据

let dialogFormVisible = $ref<boolean>(false) // 是否显示添加用户弹窗
let pageSize4 = $ref(10) // 每页显示条数
let isEdit = $ref(false) // 是否编辑状态
let formWidth = $ref<string>('30%') // 表单宽度
let defineId = $ref<number>(0) // 当前编辑的id
let isSetting = $ref<boolean>(false) // 是否是设置状态

const getTableData = async () => {
  const { data } = await useFetch('/api/users?pagenum=1&pagesize=10', {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  }).json()
  return data
}

const getData = async () => {
  const data = await getTableData()
  const res = data.value
  if (res.meta.status === 200) {
    for (let i = 0; i < res.data.users.length; i++) {
      tableData[i] = {
        id: res.data.users[i].id,
        username: res.data.users[i].username,
        email: res.data.users[i].email,
        create_time: res.data.users[i].create_time,
        mg_state: res.data.users[i].mg_state,
        role_name: res.data.users[i].role_name,
        mobile: res.data.users[i].mobile
      }
      showData[i] = {
        id: res.data.users[i].id,
        username: res.data.users[i].username,
        email: res.data.users[i].email,
        create_time: res.data.users[i].create_time,
        mg_state: res.data.users[i].mg_state,
        role_name: res.data.users[i].role_name,
        mobile: res.data.users[i].mobile
      }
    }
  }
}

getData() // 获取数据

const isChangeState = reactive<{
  isTrue: boolean
  isFalse: boolean
  error: string
}>({
  isTrue: false,
  isFalse: false,
  error: ''
})

const stateChanged = async (id: number, state: string) => {
  const { data } = await useFetch(`/api/users/${id}/state/${state}`, {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  })
    .put()
    .json()
  const res = data.value
  if (res.meta.status === 200) {
    isChangeState.isTrue = true
    setTimeout(() => {
      isChangeState.isTrue = false
    }, 1000)
  } else {
    isChangeState.isFalse = true
    setTimeout(() => {
      isChangeState.isFalse = false
    }, 1000)
  }
}

const addUserForm = reactive<AddUserForm>({
  username: '',
  email: '',
  password: '',
  mobile: '',
  rid: ''
})

const addUser = () => {
  dialogFormVisible = true
  addUserForm.email = ''
  addUserForm.username = ''
  addUserForm.password = ''
  addUserForm.mobile = ''
}

// 搜索树逻辑，这段代码还行
const getUserList = () => {
  let arr = JSON.parse(JSON.stringify(tableData)) as TableData[]
  arr = arr.filter((item) => {
    switch (true) {
      case item.id.toString().includes(input):
        return true
      case item.username.includes(input):
        return true
      case item.email.includes(input):
        return true
      case item.mobile.includes(input):
        return true
      case item.mg_state.toString().includes(input):
        return true
      default:
        return false
    }
  })
  showData.length = 0
  for (let i = 0; i < arr.length; i++) {
    showData[i] = arr[i]
  }
}

const add = async () => {
  dialogFormVisible = false
  const { data } = await useFetch('/api/users', {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  })
    .post({
      username: addUserForm.username,
      email: addUserForm.email,
      mobile: addUserForm.mobile,
      password: addUserForm.password
    })
    .json()
  const meta = data.value?.meta
  if (meta.status === 201) {
    const data = await getTableData()
    const res = data.value as any
    if (res.meta.status === 200) {
      tableData.push({
        id: res.data.users[res.data.users.length - 1].id,
        username: res.data.users[res.data.users.length - 1].username,
        email: res.data.users[res.data.users.length - 1].email,
        create_time: res.data.users[res.data.users.length - 1].create_time,
        mg_state: res.data.users[res.data.users.length - 1].mg_state,
        role_name: res.data.users[res.data.users.length - 1].role_name,
        mobile: res.data.users[res.data.users.length - 1].mobile
      })
      getUserList()
    }
    isChangeState.isTrue = true
    setTimeout(() => {
      isChangeState.isTrue = false
    }, 1000)
  } else {
    isChangeState.isFalse = true
    isChangeState.error = meta.msg
    setTimeout(() => {
      isChangeState.isFalse = false
      isChangeState.error = ''
    }, 1000)
  }
}

// 如果屏幕宽度小于 768px，则把表单宽度设置为 100%，否则设置为 30%
watch(width, () => {
  width.value < 768 ? (formWidth = '100%') : (formWidth = '30%')
})
onMounted(() => {
  width.value < 768 ? (formWidth = '100%') : (formWidth = '30%')
})

// 分页以后有时间再写，因为数据要手动输入，如果我还记得的话
const handleSizeChange = (val: number) => (pageSize4 = val)

const handleCurrentChange = (val: number) =>
  //eslint-disable-next-line no-console
  console.log(`current page: ${val}`)

const editForm = (id: number) => {
  defineId = id
  dialogFormVisible = true
  isEdit = true
}

// 编辑用户
const modification = async () => {
  const { data } = useFetch(`/api/users/${defineId}`, {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  })
    .put({
      email: addUserForm.email,
      mobile: addUserForm.mobile
    })
    .json()
  const res = data.value
  if (res.meta.status === 200) {
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].id === defineId) {
        tableData[i].email = addUserForm.email || ''
        tableData[i].mobile = addUserForm.mobile || ''
      }
    }
    getUserList()
    isChangeState.isTrue = true
    setTimeout(() => {
      isChangeState.isTrue = false
    }, 1000)
  } else {
    isChangeState.isFalse = true
    isChangeState.error = res.meta.msg
    setTimeout(() => {
      isChangeState.isFalse = false
      isChangeState.error = ''
    }, 1000)
  }
  dialogFormVisible = false
  isEdit = false
}

// 删除用户
const deleteForm = async (id: number) => {
  const { data } = await useFetch(`/api/users/${id}`, {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  })
    .delete()
    .json()
  const res = data.value
  if (res.meta.status === 200) {
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].id === id) {
        tableData.splice(i, 1)
      }
    }
    getUserList()
    isChangeState.isTrue = true
    setTimeout(() => {
      isChangeState.isTrue = false
    }, 1000)
  } else {
    isChangeState.isFalse = true
    isChangeState.error = res.meta.msg
    setTimeout(() => {
      isChangeState.isFalse = false
      isChangeState.error = ''
    }, 1000)
  }
}

const settingForm = (id: number) => {
  defineId = id
  isSetting = true
}
const modificationSetting = async () => {
  const { data } = useFetch(`/api/users/${defineId}`, {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  })
    .put({
      rid: addUserForm.rid
    })
    .json()
  const res = data.value
  if (res.meta.status === 200) {
    getData() // 获取数据
    getUserList() // 更新数据
    isSetting = false
    isChangeState.isTrue = true
    setTimeout(() => {
      isChangeState.isTrue = false
    }, 1000)
  } else {
    isChangeState.isFalse = true
    isChangeState.error = res.meta.msg
    setTimeout(() => {
      isChangeState.isFalse = false
      isChangeState.error = ''
    }, 1000)
  }
}
</script>

<template>
  <div h-full w-full overflow="hidden">
    <el-breadcrumb h-8 :separator-icon="ArrowRight" w-full select-none hidden md:block>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div w-full bg-light-100 h="[calc(100%-2rem)]" md:p-5 p-2>
      <Teleport to="body">
        <div>
          <div
            v-show="isChangeState.isTrue"
            absolute
            top-10
            md:left-150
            left-15
            md:w-180
            w="50%"
            h-15
            rounded
            border
            border-light-500
            bg-blue-50
            text-center
            leading-15
            text-2xl
          >
            操作成功！
          </div>
          <div
            v-show="isChangeState.isFalse"
            absolute
            top-10
            md:left-150
            left-15
            md:w-180
            w="50%"
            h-15
            rounded
            border
            border-light-500
            bg-red-50
            text-center
            leading-15
            text-2xl
          >
            操作失败！
            {{ isChangeState.error.length > 0 ? isChangeState.error : '请检查网络' }}
          </div>
        </div>
      </Teleport>
      <div md:w-100 w="100%" h-12 flex items-center>
        <el-input
          v-model="input"
          placeholder="请输入搜索的内容"
          :suffix-icon="Search"
          h-10
          @change="getUserList"
        />
        <el-button ml-10 type="primary" @click="addUser">添加用户</el-button>
        <Teleport to="body">
          <el-dialog
            v-model="dialogFormVisible"
            :width="formWidth"
            :title="isEdit ? '编辑用户' : '添加用户'"
          >
            <el-form :model="addUserForm">
              <el-form-item v-if="!isEdit" label="账号：" :label-width="80">
                <el-input v-model="addUserForm.username" autocomplete="off" />
              </el-form-item>
              <el-form-item v-if="!isEdit" label="密码：" :label-width="80">
                <el-input v-model="addUserForm.password" autocomplete="off" />
              </el-form-item>
              <el-form-item label="邮箱：" :label-width="80">
                <el-input v-model="addUserForm.email" autocomplete="off" />
              </el-form-item>
              <el-form-item label="手机号：" :label-width="80">
                <el-input v-model="addUserForm.mobile" autocomplete="off" />
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click=";(dialogFormVisible = false), (isEdit = false)">取消</el-button>
                <el-button v-if="!isEdit" type="primary" @click="add">添加</el-button>
                <el-button v-else type="primary" @click="modification">修改</el-button>
              </span>
            </template>
          </el-dialog>
        </Teleport>
        <Teleport to="body">
          <el-dialog v-model="isSetting" :width="formWidth" title="编辑用户rid">
            <el-form :model="addUserForm">
              <el-form-item label="rid：" :label-width="80">
                <el-input v-model="addUserForm.rid" autocomplete="off" />
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click=";(isSetting = false), (isEdit = false)">取消</el-button>
                <el-button type="primary" @click="modificationSetting">修改</el-button>
              </span>
            </template>
          </el-dialog>
        </Teleport>
      </div>
      <el-table :data="showData" border h-full style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="role_name" label="角色" />
        <el-table-column prop="mg_state" label="状态">
          <template #default="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChanged(scope.row.id, scope.row.mg_state)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="265" label="操作">
          <template #default="scope">
            <el-button type="primary" w-18 @click="editForm(scope.row.id)">
              <div i-ic-round-edit></div>
            </el-button>
            <el-button w-18 type="danger" @click="deleteForm(scope.row.id)">
              <div i-ic-round-delete></div
            ></el-button>
            <el-button w-18 type="warning" @click="settingForm(scope.row.id)">
              <div i-ic-round-settings></div
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="demo-pagination-block" mt-2>
        <el-pagination
          v-model:currentPage="currentPage4"
          v-model:page-size="pageSize4"
          :page-sizes="
            showData.length > 0
              ? Array.from({ length: Math.ceil(showData.length / 10) }, () => 10)
              : [0]
          "
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="showData.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
