import Web3 from 'web3';
import { EthCardsContract } from './cards-contract';
import { PlasmaUser } from '../../..';
export declare const DEFAULT_GAS = "3141592";
export declare const CHILD_BLOCK_INTERVAL = 1000;
export declare const web3Endpoint = "http://127.0.0.1:8545";
export declare const eventsEndpoint = "ws://127.0.0.1:8545";
export declare const dappchainEndpoint = "http://localhost:46658";
export declare const ADDRESSES: {
    validator_manager: string;
    root_chain: string;
    token_contract: string;
    loom_token: string;
};
export declare const ACCOUNTS: {
    authority: string;
    alice: string;
    bob: string;
    charlie: string;
    dan: string;
    mallory: string;
    eve: string;
    trudy: string;
    fred: string;
    greg: string;
    harry: string;
};
export declare const DAPPCHAIN_ACCOUNTS: {
    alice: string;
    bob: string;
    charlie: string;
    dan: string;
    mallory: string;
    eve: string;
    trudy: string;
    fred: string;
    greg: string;
    harry: string;
};
export declare function sleep(ms: any): Promise<{}>;
export declare function getTestUrls(): {
    wsWriteUrl: string;
    wsReadUrl: string;
    httpWriteUrl: string;
    httpReadUrl: string;
};
export declare function setupContracts(web3: Web3): {
    cards: EthCardsContract;
};
interface Accounts {
    alice: PlasmaUser;
    bob: PlasmaUser;
    charlie: PlasmaUser;
    dan: PlasmaUser;
    eve: PlasmaUser;
    trudy: PlasmaUser;
    mallory: PlasmaUser;
    greg: PlasmaUser;
    fred: PlasmaUser;
    harry: PlasmaUser;
}
export declare function disconnectAccounts(accounts: Accounts): void;
export declare function setupAccounts(): Promise<Accounts>;
export {};
