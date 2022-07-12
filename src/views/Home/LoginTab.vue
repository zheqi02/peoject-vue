<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import { useFetch } from '@vueuse/core'

const router = useRouter()
const ruleFormRef = ref<FormInstance>()

// 验证账号密码是否正确
const validateUsername = (_: any, value: any, callback: any) => {
  const reg = /^[a-zA-Z0-9_-]{4,16}$/
  if (value === '') {
    callback(new Error('不能为空'))
  } else if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('4到16位（字母，数字，下划线，减号）'))
  }
}
const validatePassword = (_: any, value: any, callback: any) => {
  const reg = /^(?=.*\d).{1,9}$/
  if (value === '') {
    callback(new Error('不能为空'))
  } else if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('至少包含数字，1-9位'))
  }
}

// 响应式登录表单数据和验证规则
const ruleForm = reactive({
  username: '',
  password: ''
})
const rules = reactive({
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }]
})

// 请求登录提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const { data } = await useFetch('/api/login').post(ruleForm).json()
      const res = data.value
      if (res?.meta?.status === 200) {
        // 登录成功，跳转到首页，并将token存入localStorage
        localStorage.setItem('token', res.data.token)
        router.push('/')
      } else ElMessage.error('登录失败')
    } else return false
  })
}

// 跳转到注册页面
const toRegister = () => router.push({ name: 'register-tab' })
</script>

<template>
  <div
    class="txfc"
    bg-clip-text
    text-2xl
    text-center
    mb-8
    mt-4
    font-sans
    bg-gradient-to-r
    from-purple-500
    via-pink-400
    to-blue-500
  >
    电商后台管理系统
  </div>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="80px"
    class="demo-ruleForm"
    label-position="left"
  >
    <el-form-item label="用户名：" prop="username">
      <el-input v-model="ruleForm.username" type="username" autocomplete="off" />
    </el-form-item>
    <el-form-item label="密码：" prop="password">
      <el-input
        v-model="ruleForm.password"
        type="password"
        autocomplete="off"
        @keyup.enter="submitForm(ruleFormRef)"
      />
    </el-form-item>
    <el-button w-full mt-3 type="primary" @click="submitForm(ruleFormRef)"> 登录</el-button>
    <div flex justify-between mt-5>
      <a text-sm cursor="pointer" hover:text-gray-200>忘记密码</a>
      <el-link type="primary" @click="toRegister">注册账号</el-link>
    </div>
  </el-form>
</template>

<style scoped lang="scss">
.txfc {
  -webkit-text-fill-color: transparent;
}
</style>
