import { useBoardStore } from '@/store/BoardStore'
import Logger from 'js-logger'
import CanvasService from '../canvas/CanvasService'

export default class BoardService {
  private logger = Logger.get('BoardService')

  public async loadLocalBoard() {
    const canvasService = new CanvasService()
    const boardStore = useBoardStore()

    canvasService.clearCanvas()
    await boardStore.createBoard()

    this.logger.debug(`Loaded local board`)
  }

  public async joinRemoteBoard(boardId: string): Promise<boolean> {
    const boardStore = useBoardStore()
    const joined = await boardStore.joinBoard(boardId)
    if (joined) this.logger.debug(`Joined the board id=${boardId}`)
    return joined
  }
}
