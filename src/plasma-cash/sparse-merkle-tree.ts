import BN from 'bn.js'
import Web3 from 'web3'

// TODO: web3 type defs aren't very good, need to clean them up
const web3 = new Web3()

function soliditySha3(...values: any[]): string {
  return (web3.utils.soliditySha3 as any)(...values)
}

function toBigNumber(value: any): BN {
  return web3.utils.toBN(value)
}

/**
 * A dictionary with key as the leaf's slot and value the leaf's hash.
 */
export interface ISparseMerkleTreeLevel {
  // slot is actually a string representation of an unsigned 64-bit integer
  [slot: string]: string
}

export class SparseMerkleTree {
  /**
   * Number of levels in the tree.
   */
  public depth: number
  public leaves: ISparseMerkleTreeLevel
  public tree: ISparseMerkleTreeLevel[]
  public root: string
  /**
   *
   * @param depth Number of levels in the tree.
   * @param leaves A dictionary with key as the leaf's slot and value the leaf's hash.
   */
  constructor(depth: number, leaves: ISparseMerkleTreeLevel) {
    this.depth = depth
    this.leaves = leaves
    // Initialize defaults
    const defaultNodes = this._createDefaultNodes(depth)

    if (leaves && Object.keys(leaves).length !== 0) {
      this.tree = this._createTree(this.leaves, this.depth, defaultNodes)
      this.root = this.tree[this.depth]['0']
    } else {
      this.tree = []
      this.root = defaultNodes[this.depth]
    }
  }

  private _createDefaultNodes(depth: number): string[] {
    const defaultNodes: string[] = new Array(depth + 1)
    defaultNodes[0] = soliditySha3(0)
    for (let i = 1; i < depth + 1; i++) {
      defaultNodes[i] = soliditySha3(defaultNodes[i - 1], defaultNodes[i - 1])
    }
    return defaultNodes
  }

  private _createTree(
    orderedLeaves: ISparseMerkleTreeLevel,
    depth: number,
    defaultNodes: string[]
  ): ISparseMerkleTreeLevel[] {
    const tree = [orderedLeaves]
    let treeLevel = orderedLeaves

    let nextLevel: ISparseMerkleTreeLevel = {}
    let halfIndex: string
    let value: string

    for (let level = 0; level < depth; level++) {
      nextLevel = {}
      for (let index in treeLevel) {
        halfIndex = toBigNumber(index)
          .div(new BN(2))
          .toString()
        value = treeLevel[index]
        if (
          toBigNumber(index)
            .mod(new BN(2))
            .isZero()
        ) {
          let coIndex = toBigNumber(index)
            .add(new BN(1))
            .toString()
          nextLevel[halfIndex] = soliditySha3(value, treeLevel[coIndex] || defaultNodes[level])
        } else {
          let coIndex = toBigNumber(index)
            .sub(new BN(1))
            .toString()
          if (treeLevel[coIndex] === undefined) {
            nextLevel[halfIndex] = soliditySha3(defaultNodes[level], value)
          }
        }
      }
      treeLevel = nextLevel
      tree.push(treeLevel)
    }
    return tree
  }

  createMerkleProof(slot: string): string {
    let index = toBigNumber(slot)
    let proof = ''
    let proofbits = new BN(0)

    for (let level = 0; level < this.depth; level++) {
      const siblingIndex = index.mod(new BN(2)).eq(new BN(0))
        ? index.add(new BN(1))
        : index.sub(new BN(1))
      index = index.div(new BN(2))

      const siblingHash = this.tree[level][siblingIndex.toString()]
      if (siblingHash) {
        proof += siblingHash.replace('0x', '')
        proofbits = proofbits.bincn(level)
      }
    }

    const buf = proofbits.toBuffer('be', 8)
    const total = Buffer.concat([buf, Buffer.from(proof, 'hex')])
    return '0x' + total.toString('hex')
  }
}
