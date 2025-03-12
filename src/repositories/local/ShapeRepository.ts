import type { IShapePlainObject } from '@/common/serializers/ShapeSerializer'
import db from './Database'

export default class LocalShapeRepository {
  public async insert(
    localBoardId: number,
    shape: IShapePlainObject
  ): Promise<number> {
    return await db.shapes.add({ local_board_id: localBoardId, shape: shape })
  }
}
