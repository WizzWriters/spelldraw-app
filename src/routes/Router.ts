import { createRouter, createWebHistory } from 'vue-router'
import TheWhiteboard from '@/components/whiteboard/TheWhiteboard.vue'
import NotFound from '@/views/NotFound.vue'
import PageLoading from '@/views/PageLoading.vue'

const routes = [
  { path: '/', name: 'root', component: PageLoading },
  { path: '/board/:id', name: 'board', component: TheWhiteboard },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
