/**
 * A dictionary with key as the leaf's slot and value the leaf's hash.
 */
export interface ISparseMerkleTreeLevel {
    [slot: string]: string;
}
export declare class SparseMerkleTree {
    /**
     * Number of levels in the tree.
     */
    depth: number;
    leaves: ISparseMerkleTreeLevel;
    tree: ISparseMerkleTreeLevel[];
    root: string;
    /**
     *
     * @param depth Number of levels in the tree.
     * @param leaves A dictionary with key as the leaf's slot and value the leaf's hash.
     */
    constructor(depth: number, leaves: ISparseMerkleTreeLevel);
    private _createDefaultNodes;
    private _createTree;
    createMerkleProof(slot: string): string;
}
