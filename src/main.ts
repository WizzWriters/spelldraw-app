import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import LoggerHelper from './helpers/LoggerHelper'

import './assets/main.scss'
LoggerHelper.initializeLogger()

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
