import { createApp } from 'vue'
import App from './App.vue'
import LoggerService from './services/LoggerService'

import './assets/main.scss'
LoggerService.initializeLogger()

createApp(App).mount('#app')
