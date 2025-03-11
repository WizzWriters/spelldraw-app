import Dexie, { type EntityTable } from 'dexie'

interface IBoardPlainObject {
  id: number
  name: string
}

const localDatabase = new Dexie('SpelldrawDb') as Dexie & {
  boards: EntityTable<IBoardPlainObject, 'id'>
}

localDatabase.version(1).stores({
  boards: '++id, name'
})

export class LocalRepository {}
