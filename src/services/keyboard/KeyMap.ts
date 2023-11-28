import { InvalidArguments } from '@/utils/exceptions/InvalidArguments'

export type KeyCallback = () => void
type KeyTree = Map<string, KeyTree> | KeyCallback

export default class KeyMap {
  private keyTreeRoot: KeyTree = new Map<string, KeyTree>()

  public get(keySequence: string[]) {
    return this.getLeaf(keySequence, this.keyTreeRoot)
  }

  public set(keySequence: string[], callback: KeyCallback) {
    if (keySequence.length < 1) return
    this.keyTreeRoot = this.setLeaf(keySequence, this.keyTreeRoot, callback)
  }

  private getLeaf(keySequence: string[], keyTree: KeyTree): KeyCallback | null {
    if (keySequence.length < 1) {
      /* Reached bottom of sequence */
      if (keyTree instanceof Map) return null
      return keyTree
    }

    if (!(keyTree instanceof Map)) {
      /* Reached bottom of the tree */
      return null
    }

    const firstKey = keySequence[0]
    if (!keyTree.has(firstKey)) return null
    return this.getLeaf(keySequence.slice(1), keyTree.get(firstKey)!)
  }

  private setLeaf(
    keySequence: string[],
    keyTree: KeyTree,
    leaf: KeyCallback
  ): KeyTree {
    if (keySequence.length < 1) {
      /* Reached bottom of the sequence */
      return leaf
    }

    if (!(keyTree instanceof Map)) {
      /* Reached bottom of the tree */
      throw new InvalidArguments('KeyMap.set - conflicting shortcuts')
    }

    const firstKey = keySequence[0]
    if (keyTree.has(firstKey))
      return this.setLeaf(keySequence.slice(1), keyTree.get(firstKey)!, leaf)
    return keyTree.set(
      firstKey,
      this.setLeaf(keySequence.slice(1), new Map(), leaf)
    )
  }
}
