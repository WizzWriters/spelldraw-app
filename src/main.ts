import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import LoggerHelper from './helpers/LoggerHelper'
import IconHelper from './helpers/IconHelper'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './assets/main.scss'
LoggerHelper.initializeLogger()
IconHelper.initializeIcons()

const pinia = createPinia()
const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(pinia)
app.mount('#app')
