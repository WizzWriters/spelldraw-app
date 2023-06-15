import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import connection from '@/services/connection/IoConnection'
import Logger from 'js-logger'
import type { IPointerPosition } from '@/common/definitions/Pointer'
import { usePointerStore } from './PointerStore'

const logger = Logger.get('BoardStore')

export class ConnectedUser {
  public position: IPointerPosition = { xCoordinate: 0, yCoordinate: 0 }

  constructor(public id: string) {}
}

export const useBoardStore = defineStore('board', () => {
  const boardId: Ref<string | null> = ref(null)
  const boardUserId: Ref<string | null> = ref(null)
  const connectedUsers: Ref<Array<ConnectedUser>> = ref([])

  async function createBoard() {
    const response = await connection.request('create_board', undefined)
    boardId.value = response.data.id
  }

  async function joinBoard(id: string): Promise<Boolean> {
    const response = await connection.request('join_board', { board_id: id })
    if (response.status != 0) return false
    boardId.value = response.data.board_id
    boardUserId.value = response.data.board_user_id
    return true
  }

  function addConnectedUser(user: ConnectedUser) {
    connectedUsers.value.push(user)
  }

  function removeConnectedUser(userId: string) {
    const index = connectedUsers.value.findIndex((user) => user.id == userId)
    if (index < 0) return
    connectedUsers.value.splice(index, 1)
  }

  connection.onEvent('user_joined', (data) => {
    const userId = data.board_user_id
    logger.debug(`User ${userId} just joined!`)
    addConnectedUser(new ConnectedUser(userId))
    /* Inform the new user about us */
    const pointerStore = usePointerStore()
    pointerStore.broadcastPosition()
  })

  connection.onEvent('user_left', (data) => {
    const userId = data.board_user_id
    logger.debug(`User ${userId} left`)
    removeConnectedUser(userId)
  })

  connection.onEvent('user_position_updated', (data) => {
    const userId = data.board_user_id
    let index = connectedUsers.value.findIndex((user) => (user.id = userId))
    if (index < 0) {
      index = connectedUsers.value.push(new ConnectedUser(userId))
      index--
    }
    connectedUsers.value[index].position = data.position
  })

  return {
    boardId,
    boardUserId,
    connectedUsers,
    createBoard,
    joinBoard
  }
})
