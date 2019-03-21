import Web3 from 'web3';
import BN from 'bn.js';
/**
 * @returns The time of the last mined block in seconds.
 */
export declare function latestBlockTime(web3: Web3): Promise<number>;
export declare function increaseTime(web3: Web3, duration: number): Promise<void>;
/**
 * Beware that due to the need of calling two separate ganache methods and rpc calls overhead
 * it's hard to increase time precisely to a target point so design your test to tolerate
 * small fluctuations from time to time.
 *
 * @param target Time in seconds
 */
export declare function increaseTimeTo(web3: Web3, target: number): Promise<void>;
/**
 * Retrieves the ETH balance of a particular Ethereum address.
 *
 * @param address Hex-encoded Ethereum address.
 */
export declare function getEthBalanceAtAddress(web3: Web3, address: string): Promise<BN>;
