import type { IShapePlainObject } from '@/common/serializers/ShapeSerializer'
import db, { type IShapeDbEntry } from './Database'

export default class LocalShapeRepository {
  public async insert(
    localBoardId: number,
    shape: IShapePlainObject
  ): Promise<string> {
    return await db.shapes.add({ id: shape.id, board_id: localBoardId, shape })
  }

  public async delete(shapeId: string) {
    await db.shapes.delete(shapeId)
  }

  public async update(shapeId: string, shape: IShapePlainObject) {
    await db.shapes.update(shapeId, { shape: shape })
  }

  public async fetchBoardShapes(
    localBoardId: number
  ): Promise<IShapeDbEntry[]> {
    return await db.shapes.where('board_id').equals(localBoardId).toArray()
  }
}
