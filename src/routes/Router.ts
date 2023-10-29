import { createRouter, createWebHistory } from 'vue-router'
import TheBoard from '@/views/TheBoard.vue'
import NotFound from '@/views/NotFound.vue'
import BoardInit from '@/views/BoardInit.vue'

const routes = [
  { path: '/', name: 'root', component: BoardInit },
  { path: '/board/:id', name: 'board', component: TheBoard },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
