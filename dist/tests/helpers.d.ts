import { Client } from '../index';
export declare function getTestUrls(): {
    wsWriteUrl: string;
    wsReadUrl: string;
    httpWriteUrl: string;
    httpReadUrl: string;
};
/**
 * Creates a client for tests, the default read/write URLs can be overridden by setting the env vars
 * TEST_LOOM_DAPP_WRITE_URL and TEST_LOOM_DAPP_READ_URL. These env vars can be set by modifying
 * the .env.test (see .env.test.example for default values).
 */
export declare function createTestClient(): Client;
export declare function createTestHttpClient(): Client;
export declare function createTestWSClient(): Client;
export declare function createTestHttpWSClient(): Client;
export declare function waitForMillisecondsAsync(ms: number): Promise<{}>;
export declare function execAndWaitForMillisecondsAsync(fn: Promise<any>, ms?: number): Promise<any>;
