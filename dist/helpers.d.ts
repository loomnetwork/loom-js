import { Client, ITxMiddlewareHandler } from './client';
/**
 * Creates the default set of tx middleware required to successfully commit a tx to a Loom DAppChain.
 * @param client The client the middleware is being created for.
 * @param privateKey Private key that should be used to sign txs.
 * @returns Set of middleware.
 */
export declare function createDefaultTxMiddleware(client: Client, privateKey: Uint8Array): ITxMiddlewareHandler[];
export declare function sleep(ms: any): Promise<{}>;
