<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const ruleFormRef = ref<FormInstance>()

// 用户名验证
const validateUsername = (rule: any, value: any, callback: any) => {
  const reg = /^[a-zA-Z0-9_-]{4,16}$/
  if (value === '') {
    callback(new Error('不能为空'))
  } else if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('4到16位（字母，数字，下划线，减号）'))
  }
}

// 密码验证
const validatePassword = (rule: any, value: any, callback: any) => {
  const reg = /^(?=.*\d).{1,9}$/
  if (value === '') {
    callback(new Error('不能为空'))
  } else if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('至少包含数字，1-9位'))
  }
}

// 邮箱验证
const validateEmail = (rule: any, value: any, callback: any) => {
  const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  if (value === '') {
    callback(new Error('不能为空'))
  } else if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的邮箱地址'))
  }
}

// 存放表单数据
const ruleForm = reactive({
  username: '',
  password: '',
  email: ''
})

// 规则校验
const rules = reactive({
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }]
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      alert('接口问题，暂时注册不了')
    } else {
      return false
    }
  })
}

const toLogin = () => {
  router.push({
    name: 'login-tab'
  })
}
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
    relative
  >
    账号注册
    <div
      text-sm
      hover:text-blue-300
      inline-block
      float-right
      mt-2
      clear-both
      cursor-pointer
      @click="toLogin"
    >
      &lt; 返回登录
    </div>
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
      <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="邮箱：" prop="email">
      <el-input v-model="ruleForm.email" type="email" autocomplete="off" />
    </el-form-item>
    <el-button w-full mt-3 type="primary" @click="submitForm(ruleFormRef)">注册</el-button>
  </el-form>
</template>

<style scoped lang="scss">
.txfc {
  -webkit-text-fill-color: transparent;
}
</style>
