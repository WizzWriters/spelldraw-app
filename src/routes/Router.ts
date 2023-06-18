import { createRouter, createWebHistory } from 'vue-router'
import TheWhiteboard from '@/components/whiteboard/TheWhiteboard.vue'
import NotFound from '@/views/NotFound.vue'
import { useBoardStore } from '@/store/BoardStore'

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: () => {
      return { name: 'board-create' }
    }
  },
  {
    path: '/board/create',
    name: 'board-create',
    beforeEnter: async () => {
      const boardStore = useBoardStore()
      await boardStore.createBoard()
      return { name: 'board', params: { id: boardStore.boardId } }
    },
    component: NotFound
  },
  { path: '/board/:id', name: 'board', component: TheWhiteboard },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
