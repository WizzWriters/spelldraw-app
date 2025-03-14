import db, { type IBoardDbEntry } from './Database'

export default class LocalBoardRepository {
  public async fetchById(boardId: number): Promise<IBoardDbEntry | undefined> {
    return await db.boards.get(boardId)
  }

  public async insert(name: string): Promise<number> {
    return await db.boards.add({ name })
  }
}
