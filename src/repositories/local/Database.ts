import type { IShapePlainObject } from '@/common/serializers/ShapeSerializer'
import Dexie, { type EntityTable } from 'dexie'

export interface IBoardDbEntry {
  id: number
  name: string
}

export interface IShapeDbEntry {
  id: number
  local_board_id: number
  shape: IShapePlainObject
}

const db = new Dexie('SpelldrawDb') as Dexie & {
  boards: EntityTable<IBoardDbEntry, 'id'>
  shapes: EntityTable<IShapeDbEntry, 'id'>
}

db.version(1).stores({
  boards: 'id++, name',
  shapes: 'id++, board_id'
})

export default db
