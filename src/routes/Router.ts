import { createRouter, createWebHistory } from 'vue-router'
import TheWhiteboard from '@/components/whiteboard/TheWhiteboard.vue'

const routes = [{ path: '/', component: TheWhiteboard }]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
