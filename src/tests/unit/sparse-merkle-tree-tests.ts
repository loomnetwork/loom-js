import test from 'tape'
import BN from 'bn.js'

import { SparseMerkleTree } from '../../plasma-cash/sparse-merkle-tree'

test('SparseMerkleTree', t => {
  try {
    //t.comment('Size limits')
    //testSizeLimits(t)

    t.comment('Empty tree')
    testEmptySMT(t)
    /*
        t.comment('All leaves with values')
        testAllLeavesWithVal(t)
    
        t.comment('Empty leaves')
        testEmptyLeaves(t)
    
        t.comment('Empty Left Leaf')
        testEmptyLeftLeaf(t)

        t.comment('Empty Right Leaf')
        testEmptyRightLeaf(t)

        t.comment('Create Merkle Proof')
        testCreateMerkleProof(t)
        */
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
/*
const empty_val = bytes.Repeat([]byte{0x00}, 32)
const default_hash = _keccak(empty_val)
const dummy_val = _keccakInt64(2)
const dummy_val_2 = _keccakInt64(3)
*/
/*
function testSizeLimits(t: test.Test) {
    with pytest.raises(SparseMerkleTree.TreeSizeExceededException):
        SparseMerkleTree(depth=0, leaves={0: '0', 1: '1'})
    with pytest.raises(SparseMerkleTree.TreeSizeExceededException):
        SparseMerkleTree(
            depth=1, leaves={0: empty_val, 1: empty_val, 2: empty_val}
        )
}
*/

function testEmptySMT(t: test.Test) {
  const emptyTree = new SparseMerkleTree(64, {})
  t.deepEqual(emptyTree.leaves, {}, 'Should have no leaves')
}
/*
function testAllLeavesWithVal(t: test.Test) {
    const leaves = {'0': dummy_val, '1': dummy_val, '2': dummy_val, '3': dummy_val}
    const tree = new SparseMerkleTree(2, leaves)
    const mid_level_val = keccak(dummy_val * 2)
    t.equal(tree.root, keccak(mid_level_val + mid_level_val))
}

function testEmptyLeaves(t: test.Test) {
    const tree = new SparseMerkleTree(2)
    const mid_level_val = keccak(default_hash * 2)
    t.equal(tree.root, keccak(mid_level_val * 2))
}

function testEmptyLeftLeaf(t: test.Test) {
    const leaves = {'1': dummy_val, '2': dummy_val, '3': dummy_val}
    const tree = new SparseMerkleTree(2, leaves)
    const mid_left_val = keccak(default_hash + dummy_val)
    const mid_right_val = keccak(dummy_val * 2)
    t.equal(tree.root, keccak(mid_left_val + mid_right_val))
}

function testEmptyRightLeaf(t: test.Test) {
    const leaves = {'0': dummy_val, '2': dummy_val, '3': dummy_val}
    const tree = new SparseMerkleTree(2, leaves)
    const mid_left_val = keccak(dummy_val + default_hash)
    const mid_right_val = keccak(dummy_val * 2)
    t.equal(tree.root, keccak(mid_left_val + mid_right_val))
}

function testCreateMerkleProof(t: test.Test) {
    const leaves = {'0': dummy_val, '2': dummy_val, '3': dummy_val_2}
    const tree = new SparseMerkleTree(2, leaves)
    const mid_left_val = keccak(dummy_val + default_hash)
    const mid_right_val = keccak(dummy_val + dummy_val_2)
    t.equal(tree.createMerkleProof('0'), new BN(2).toBuffer('be', 8) + mid_right_val)
    t.equal(tree.createMerkleProof('1'), new BN(3).toBuffer('be', 8) + dummy_val + mid_right_val)
    t.equal(tree.createMerkleProof('2'), new BN(3).toBuffer('be', 8) + dummy_val_2 + mid_left_val)
    t.equal(tree.createMerkleProof('3'), new BN(3).toBuffer('be', 8) + dummy_val + mid_left_val)
}
*/
