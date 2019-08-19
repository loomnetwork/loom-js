import BN from 'bn.js';
import { Contracts } from '.';
import { GatewayUser, GatewayUserConstructorParams, GatewayUserParams } from './gateway-user';
import { IValidator, ICandidate, ICandidateDelegations, IDelegatorDelegations } from './contracts/dpos3';
import { LocktimeTier } from './proto/dposv3_pb';
export interface DPOSUserV3ConstructorParams extends GatewayUserConstructorParams {
    dappchainDPOS: Contracts.DPOS3;
}
export declare class DPOSUserV3 extends GatewayUser {
    private _dappchainDPOS;
    static createOfflineUserAsync(params: GatewayUserParams): Promise<DPOSUserV3>;
    static createMetamaskUserAsync(params: GatewayUserParams): Promise<DPOSUserV3>;
    static createEthSignMetamaskUserAsync(params: GatewayUserParams): Promise<DPOSUserV3>;
    static createUserAsync(params: GatewayUserParams): Promise<DPOSUserV3>;
    constructor(params: DPOSUserV3ConstructorParams);
    readonly dappchainDPOS: Contracts.DPOS3;
    listValidatorsAsync(): Promise<IValidator[]>;
    listCandidatesAsync(): Promise<ICandidate[]>;
    listAllDelegationsAsync(): Promise<Array<ICandidateDelegations>>;
    listDelegationsAsync(candidate: string): Promise<ICandidateDelegations>;
    checkAllDelegationsAsync(delegator?: string): Promise<IDelegatorDelegations>;
    getTimeUntilElectionsAsync(): Promise<BN>;
    /**
     * Delegates an amount of LOOM tokens to a candidate/validator
     *
     * @param candidate The candidate's hex address
     * @param amount The amount delegated
     */
    delegateAsync(candidate: string, amount: BN, tier: LocktimeTier, referrer?: string): Promise<void>;
    /**
     * Redelegates an amount of LOOM tokens from a validator to another
     *
     * @param formerValidator The candidate's hex address
     * @param newValidator The candidate's hex address
     * @param amount The amount delegated
     */
    redelegateAsync(formerValidator: string, validator: string, amount: BN, index: number): Promise<void>;
    /**
     * Undelegates an amount of LOOM tokens from a candidate/validator
     *
     * @param candidate The candidate's hex address
     * @param amount The amount to undelegate
     */
    undelegateAsync(candidate: string, amount: BN, index: number): Promise<void>;
    /**
     * Returns the stake a delegator has delegated to a candidate/validator
     *
     * @param validator The validator's hex address
     * @param delegator The delegator's hex address
     */
    checkDelegationsAsync(validator: string, delegator?: string): Promise<IDelegatorDelegations | null>;
    claimDelegatorRewardsAsync(): Promise<BN>;
    checkDelegatorRewardsAsync(owner?: string): Promise<BN>;
}
