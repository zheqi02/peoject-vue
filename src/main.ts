import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'daisyui/dist/full.css'
import 'uno.css'
// 样式重置库需要时打开
import '@unocss/reset/tailwind.css'

import 'element-plus/theme-chalk/src/message.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
