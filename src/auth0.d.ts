// Partial extract from:
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/auth0-js/index.d.ts
declare module 'auth0' {
    export interface Auth0Error {
        error?: any;
        errorDescription?: string;
        code?: string;
        description?: string;
        name?: string;
        policy?: string;
        original?: any;
        statusCode?: number;
        statusText?: string;
    }

    export type Auth0Callback<T> = (error: null | Auth0Error, result: T) => void;

    export interface Auth0UserProfile {
        email?: string;
    }

    export class Authentication {
        constructor()
        /** Makes a call to the `/userinfo` endpoint and returns the user profile. */
        userInfo(accessToken: string, callback: Auth0Callback<Auth0UserProfile>): void;
    }
}