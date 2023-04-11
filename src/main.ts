import { createApp } from 'vue'
import App from './App.vue'
import LoggerHelper from './helpers/LoggerHelper'

import './assets/main.scss'
import './services/magic/ShapeWizard'
import './services/magic/TextWizard'
LoggerHelper.initializeLogger()

createApp(App).mount('#app')
