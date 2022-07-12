<script setup lang="ts">
import { onMounted, reactive, ref, watch, nextTick, toRaw } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { Role, AddRole, Tree } from '@/views/types'
import type { ElTree } from 'element-plus'
import { useFetch, useWindowSize } from '@vueuse/core'
const input = $ref<number>(undefined)
let isEdit = $ref<boolean>(false)
let editId = $ref<number>(undefined)
let dialogFormVisible = $ref<boolean>(false)
let thisId = $ref<number>(undefined)
let setRightDialogVisible = $ref<boolean>(false)
let formWidth = $ref<string>('30%') // 表单宽度
const tableData = reactive<Role[]>([])
const { width } = useWindowSize()
const roleId: Array<string | number> = []
const defaultCheckedKeys = reactive<number[]>([])
const treeRef = ref<InstanceType<typeof ElTree>>()

const { data: aaa } = await useFetch('/api/rights/tree', {
  beforeFetch({ options }) {
    const token = localStorage.getItem('token')
    if (token) (options.headers as Record<string, string>).Authorization = token
    return { options }
  }
}).json()
const res = aaa.value

watch(width, () => {
  width.value < 768 ? (formWidth = '100%') : (formWidth = '30%')
})
onMounted(() => {
  width.value < 768 ? (formWidth = '100%') : (formWidth = '30%')
})

const roleForm = reactive<AddRole>({
  roleName: '',
  roleDesc: ''
})

const defaultProps = {
  children: 'children',
  label: 'authName'
}

const editRole = (id: number) => {
  roleForm.roleName = ''
  roleForm.roleDesc = ''
  editId = id
  isEdit = true
  dialogFormVisible = true
}

const addRole = () => {
  roleForm.roleName = ''
  roleForm.roleDesc = ''
  dialogFormVisible = true
}

const getRoleList = async () => {
  const { data: aaa } = await useFetch('/api/roles', {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  }).json()
  const { data, meta } = aaa.value
  if (meta.status !== 200) return

  for (let i = 0; i < data.length; i++) {
    tableData[i] = {
      id: data[i].id,
      roleName: data[i].roleName,
      roleDesc: data[i].roleDesc,
      children: data[i].children
    }
  }
}

getRoleList()

const modificationSetting = async () => {
  dialogFormVisible = false
  const { data } = useFetch('/api/roles', {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  })
    .post(roleForm)
    .json()
  const meta = data.value?.meta
  if (meta.status !== 201) {
    return
  }
  getRoleList()
}

const searchId = async () => {
  if (!input) {
    getRoleList()
    return
  }
  const { data: aaa } = await useFetch('/api/roles/' + input, {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  }).json()
  const { data, meta } = aaa.value
  if (meta.status !== 200) {
    alert('查询失败,不存在')
    getRoleList()
  }
  tableData.splice(0, tableData.length)
  tableData[0] = {
    id: input,
    roleName: data.roleName,
    roleDesc: data.roleDesc,
    children: data.children
  }
}

const editRoleSubmit = async () => {
  await useFetch('/api/roles/' + editId, {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  }).put(roleForm)

  getRoleList()
  dialogFormVisible = false
  isEdit = false
}

const deleteRole = async (id: number) => {
  const { data } = await useFetch('/api/roles/' + id, {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  })
    .delete()
    .json()
  const meta = data.value?.meta

  if (meta.status !== 200) return

  for (let i = 0; i < tableData.length; i++) {
    if (tableData[i].id === id) {
      tableData.splice(i, 1)
      break
    }
  }
}

function getData(data: Tree[]): Tree[] {
  const arr: Tree[] = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].children) {
      arr.push({
        id: data[i].id,
        authName: data[i].authName,
        children: getData(data[i].children as Tree[])
      })
    } else {
      arr.push({
        id: data[i].id,
        authName: data[i].authName
      })
    }
  }
  return arr
}

const data = reactive<Tree[]>(getData(res.data))
const getLeafIds = (data: Tree, keys: number[]) => {
  if (!data.children) {
    keys.push(data.id)
  } else {
    for (let i = 0; i < data.children.length; i++) {
      getLeafIds(data.children[i], keys)
    }
  }
}

const showRightDialogVisible = async (id: number) => {
  setRightDialogVisible = true // 显示权限设置弹窗
  thisId = id
  defaultCheckedKeys.splice(0, defaultCheckedKeys.length)
  for (let i = 0; i < tableData.length; i++) {
    if (tableData[i].id === id) {
      tableData[i].children!.forEach((item) => {
        getLeafIds(item, defaultCheckedKeys)
      })
      break
    }
  }
  await nextTick(() => {
    treeRef.value!.setCheckedKeys(defaultCheckedKeys)
    roleId.splice(0, roleId.length)
    roleId.push(...treeRef.value!.getCheckedKeys())
    roleId.push(...treeRef.value!.getHalfCheckedKeys())
  })
}

const check = () => {
  roleId.splice(0, roleId.length)
  roleId.push(...treeRef.value!.getCheckedKeys())
  roleId.push(...treeRef.value!.getHalfCheckedKeys())
}
const saveRight = async () => {
  setRightDialogVisible = false
  await useFetch(`/api/roles/${thisId}/rights` + thisId, {
    beforeFetch({ options }) {
      const token = localStorage.getItem('token')
      if (token) (options.headers as Record<string, string>).Authorization = token
      return { options }
    }
  })
    .post({ rids: roleId.join(',') })
    .json()
  getRoleList()
}
</script>

<template>
  <div flex w-80 items-center>
    <el-button type="primary" @click="addRole">添加角色</el-button>
    <el-input
      v-model.number="input"
      class="w-50 m-2"
      placeholder="输入查找角色id"
      :suffix-icon="Search"
      @change="searchId"
    />
  </div>
  <el-table :data="tableData" md:w-full w-500 border mt>
    <el-table-column type="expand" width="50" select-none>
      <template #default="props">
        <el-row v-for="item1 in props.row.children" :key="item1.id" class="centerRow" mt>
          <!-- 这一列，专门渲染 一级权限 -->
          <el-col :span="5">
            <el-tag closable>{{ item1.authName }}</el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>
          <!-- 还剩余 19 列，分配给二三级权限 -->
          <el-col :span="19">
            <!-- 这里显示二三级权限 -->
            <el-row v-for="item2 in item1.children" :key="item2.id" class="centerRow" mt>
              <!-- 放二级权限 -->
              <el-col :span="6">
                <el-tag closable type="success">{{ item2.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 放三级权限 -->
              <el-col :span="18">
                <el-tag v-for="item3 in item2.children" :key="item3.id" closable type="warning">
                  {{ item3.authName }}</el-tag
                >
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column prop="id" label="#" width="50" />
    <el-table-column prop="roleName" label="角色名称" />
    <el-table-column prop="roleDesc" label="角色描述" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="success" size="small" @click="editRole(scope.row.id)">编辑</el-button>
        <el-button type="danger" size="small" @click="deleteRole(scope.row.id)">删除</el-button>
        <el-button type="primary" size="small" @click="showRightDialogVisible(scope.row.id)"
          >授权</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="dialogFormVisible"
    :width="formWidth"
    :title="isEdit ? '编辑角色' : '添加角色'"
  >
    <el-form :model="roleForm">
      <el-form-item label="角色名称：" :label-width="100">
        <el-input v-model="roleForm.roleName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色描述：" :label-width="100">
        <el-input v-model="roleForm.roleDesc" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click=";(dialogFormVisible = false), (isEdit = false)">取消</el-button>
        <el-button v-if="!isEdit" type="primary" @click="modificationSetting">添加</el-button>
        <el-button v-if="isEdit" type="primary" @click="editRoleSubmit">修改</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="setRightDialogVisible" title="分配权限" width="50%">
    <!-- 权限菜单 -->
    <el-tree
      ref="treeRef"
      :data="data"
      show-checkbox
      node-key="id"
      :props="defaultProps"
      :default-checked-keys="defaultCheckedKeys"
      @check="check"
    >
    </el-tree>

    <template #footer
      ><span class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRight">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
