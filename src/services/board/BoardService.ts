import { useBoardStore } from '@/store/BoardStore'
import Logger from 'js-logger'
import CanvasService from '../canvas/CanvasService'
import BoardRepository from '@/repositories/local/BoardRepository'

export default class BoardService {
  private logger = Logger.get('BoardService')

  public async loadLocalBoard(localBoardId: number) {
    const canvasService = new CanvasService()
    const boardStore = useBoardStore()
    const boardRepository = new BoardRepository()

    const localBoard = await boardRepository.fetchById(localBoardId)
    if (!localBoard) {
      this.logger.debug('Local board not present. Creating new one')
      await boardRepository.insert('Local')
    } else {
      this.logger.debug(`Local board will be loaded from memory`)
    }

    await canvasService.loadCanvasFromMemory(localBoardId)
    boardStore.setLocalBoard()
  }

  public async joinRemoteBoard(boardId: string): Promise<boolean> {
    const boardStore = useBoardStore()
    const joined = await boardStore.joinBoard(boardId)
    if (joined) this.logger.debug(`Joined the board id=${boardId}`)
    return joined
  }
}
