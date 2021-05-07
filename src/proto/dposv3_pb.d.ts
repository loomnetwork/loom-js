// package: 
// file: proto/dposv3.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class ValidatorV3 extends jspb.Message {
  getPubKey(): Uint8Array | string;
  getPubKey_asU8(): Uint8Array;
  getPubKey_asB64(): string;
  setPubKey(value: Uint8Array | string): void;

  getPower(): number;
  setPower(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidatorV3.AsObject;
  static toObject(includeInstance: boolean, msg: ValidatorV3): ValidatorV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidatorV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidatorV3;
  static deserializeBinaryFromReader(message: ValidatorV3, reader: jspb.BinaryReader): ValidatorV3;
}

export namespace ValidatorV3 {
  export type AsObject = {
    pubKey: Uint8Array | string,
    power: number,
  }
}

export class Params extends jspb.Message {
  getValidatorCount(): number;
  setValidatorCount(value: number): void;

  getElectionCycleLength(): number;
  setElectionCycleLength(value: number): void;

  hasCoinContractAddress(): boolean;
  clearCoinContractAddress(): void;
  getCoinContractAddress(): proto_loom_pb.Address | undefined;
  setCoinContractAddress(value?: proto_loom_pb.Address): void;

  hasOracleAddress(): boolean;
  clearOracleAddress(): void;
  getOracleAddress(): proto_loom_pb.Address | undefined;
  setOracleAddress(value?: proto_loom_pb.Address): void;

  hasMaxYearlyReward(): boolean;
  clearMaxYearlyReward(): void;
  getMaxYearlyReward(): proto_loom_pb.BigUInt | undefined;
  setMaxYearlyReward(value?: proto_loom_pb.BigUInt): void;

  hasRegistrationRequirement(): boolean;
  clearRegistrationRequirement(): void;
  getRegistrationRequirement(): proto_loom_pb.BigUInt | undefined;
  setRegistrationRequirement(value?: proto_loom_pb.BigUInt): void;

  hasCrashSlashingPercentage(): boolean;
  clearCrashSlashingPercentage(): void;
  getCrashSlashingPercentage(): proto_loom_pb.BigUInt | undefined;
  setCrashSlashingPercentage(value?: proto_loom_pb.BigUInt): void;

  hasByzantineSlashingPercentage(): boolean;
  clearByzantineSlashingPercentage(): void;
  getByzantineSlashingPercentage(): proto_loom_pb.BigUInt | undefined;
  setByzantineSlashingPercentage(value?: proto_loom_pb.BigUInt): void;

  getMinCandidateFee(): number;
  setMinCandidateFee(value: number): void;

  getDowntimePeriod(): number;
  setDowntimePeriod(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Params.AsObject;
  static toObject(includeInstance: boolean, msg: Params): Params.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Params, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Params;
  static deserializeBinaryFromReader(message: Params, reader: jspb.BinaryReader): Params;
}

export namespace Params {
  export type AsObject = {
    validatorCount: number,
    electionCycleLength: number,
    coinContractAddress?: proto_loom_pb.Address.AsObject,
    oracleAddress?: proto_loom_pb.Address.AsObject,
    maxYearlyReward?: proto_loom_pb.BigUInt.AsObject,
    registrationRequirement?: proto_loom_pb.BigUInt.AsObject,
    crashSlashingPercentage?: proto_loom_pb.BigUInt.AsObject,
    byzantineSlashingPercentage?: proto_loom_pb.BigUInt.AsObject,
    minCandidateFee: number,
    downtimePeriod: number,
  }
}

export class State extends jspb.Message {
  hasParams(): boolean;
  clearParams(): void;
  getParams(): Params | undefined;
  setParams(value?: Params): void;

  clearValidatorsList(): void;
  getValidatorsList(): Array<ValidatorV3>;
  setValidatorsList(value: Array<ValidatorV3>): void;
  addValidators(value?: ValidatorV3, index?: number): ValidatorV3;

  getLastElectionTime(): number;
  setLastElectionTime(value: number): void;

  hasTotalValidatorDelegations(): boolean;
  clearTotalValidatorDelegations(): void;
  getTotalValidatorDelegations(): proto_loom_pb.BigUInt | undefined;
  setTotalValidatorDelegations(value?: proto_loom_pb.BigUInt): void;

  hasTotalRewardDistribution(): boolean;
  clearTotalRewardDistribution(): void;
  getTotalRewardDistribution(): proto_loom_pb.BigUInt | undefined;
  setTotalRewardDistribution(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): State.AsObject;
  static toObject(includeInstance: boolean, msg: State): State.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: State, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): State;
  static deserializeBinaryFromReader(message: State, reader: jspb.BinaryReader): State;
}

export namespace State {
  export type AsObject = {
    params?: Params.AsObject,
    validatorsList: Array<ValidatorV3.AsObject>,
    lastElectionTime: number,
    totalValidatorDelegations?: proto_loom_pb.BigUInt.AsObject,
    totalRewardDistribution?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class InitializationState extends jspb.Message {
  hasState(): boolean;
  clearState(): void;
  getState(): State | undefined;
  setState(value?: State): void;

  clearCandidatesList(): void;
  getCandidatesList(): Array<CandidateV3>;
  setCandidatesList(value: Array<CandidateV3>): void;
  addCandidates(value?: CandidateV3, index?: number): CandidateV3;

  clearDelegationsList(): void;
  getDelegationsList(): Array<Delegation>;
  setDelegationsList(value: Array<Delegation>): void;
  addDelegations(value?: Delegation, index?: number): Delegation;

  clearStatisticsList(): void;
  getStatisticsList(): Array<ValidatorStatistic>;
  setStatisticsList(value: Array<ValidatorStatistic>): void;
  addStatistics(value?: ValidatorStatistic, index?: number): ValidatorStatistic;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitializationState.AsObject;
  static toObject(includeInstance: boolean, msg: InitializationState): InitializationState.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InitializationState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitializationState;
  static deserializeBinaryFromReader(message: InitializationState, reader: jspb.BinaryReader): InitializationState;
}

export namespace InitializationState {
  export type AsObject = {
    state?: State.AsObject,
    candidatesList: Array<CandidateV3.AsObject>,
    delegationsList: Array<Delegation.AsObject>,
    statisticsList: Array<ValidatorStatistic.AsObject>,
  }
}

export class ValidatorStatistic extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  hasWhitelistAmount(): boolean;
  clearWhitelistAmount(): void;
  getWhitelistAmount(): proto_loom_pb.BigUInt | undefined;
  setWhitelistAmount(value?: proto_loom_pb.BigUInt): void;

  getLocktimeTier(): LocktimeTier;
  setLocktimeTier(value: LocktimeTier): void;

  hasDelegationTotal(): boolean;
  clearDelegationTotal(): void;
  getDelegationTotal(): proto_loom_pb.BigUInt | undefined;
  setDelegationTotal(value?: proto_loom_pb.BigUInt): void;

  hasSlashPercentage(): boolean;
  clearSlashPercentage(): void;
  getSlashPercentage(): proto_loom_pb.BigUInt | undefined;
  setSlashPercentage(value?: proto_loom_pb.BigUInt): void;

  getRecentlyMissedBlocks(): number;
  setRecentlyMissedBlocks(value: number): void;

  hasUpdateWhitelistAmount(): boolean;
  clearUpdateWhitelistAmount(): void;
  getUpdateWhitelistAmount(): proto_loom_pb.BigUInt | undefined;
  setUpdateWhitelistAmount(value?: proto_loom_pb.BigUInt): void;

  getUpdateLocktimeTier(): LocktimeTier;
  setUpdateLocktimeTier(value: LocktimeTier): void;

  getJailed(): boolean;
  setJailed(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidatorStatistic.AsObject;
  static toObject(includeInstance: boolean, msg: ValidatorStatistic): ValidatorStatistic.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidatorStatistic, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidatorStatistic;
  static deserializeBinaryFromReader(message: ValidatorStatistic, reader: jspb.BinaryReader): ValidatorStatistic;
}

export namespace ValidatorStatistic {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
    whitelistAmount?: proto_loom_pb.BigUInt.AsObject,
    locktimeTier: LocktimeTier,
    delegationTotal?: proto_loom_pb.BigUInt.AsObject,
    slashPercentage?: proto_loom_pb.BigUInt.AsObject,
    recentlyMissedBlocks: number,
    updateWhitelistAmount?: proto_loom_pb.BigUInt.AsObject,
    updateLocktimeTier: LocktimeTier,
    jailed: boolean,
  }
}

export class CandidateV3 extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  getPubKey(): Uint8Array | string;
  getPubKey_asU8(): Uint8Array;
  getPubKey_asB64(): string;
  setPubKey(value: Uint8Array | string): void;

  getFee(): number;
  setFee(value: number): void;

  getNewFee(): number;
  setNewFee(value: number): void;

  getState(): CandidateState;
  setState(value: CandidateState): void;

  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getWebsite(): string;
  setWebsite(value: string): void;

  getMaxReferralPercentage(): number;
  setMaxReferralPercentage(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CandidateV3.AsObject;
  static toObject(includeInstance: boolean, msg: CandidateV3): CandidateV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CandidateV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CandidateV3;
  static deserializeBinaryFromReader(message: CandidateV3, reader: jspb.BinaryReader): CandidateV3;
}

export namespace CandidateV3 {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
    pubKey: Uint8Array | string,
    fee: number,
    newFee: number,
    state: CandidateState,
    name: string,
    description: string,
    website: string,
    maxReferralPercentage: number,
  }
}

export class CandidateStatistic extends jspb.Message {
  hasStatistic(): boolean;
  clearStatistic(): void;
  getStatistic(): ValidatorStatistic | undefined;
  setStatistic(value?: ValidatorStatistic): void;

  hasCandidate(): boolean;
  clearCandidate(): void;
  getCandidate(): CandidateV3 | undefined;
  setCandidate(value?: CandidateV3): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CandidateStatistic.AsObject;
  static toObject(includeInstance: boolean, msg: CandidateStatistic): CandidateStatistic.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CandidateStatistic, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CandidateStatistic;
  static deserializeBinaryFromReader(message: CandidateStatistic, reader: jspb.BinaryReader): CandidateStatistic;
}

export namespace CandidateStatistic {
  export type AsObject = {
    statistic?: ValidatorStatistic.AsObject,
    candidate?: CandidateV3.AsObject,
  }
}

export class CandidateListV3 extends jspb.Message {
  clearCandidatesList(): void;
  getCandidatesList(): Array<CandidateV3>;
  setCandidatesList(value: Array<CandidateV3>): void;
  addCandidates(value?: CandidateV3, index?: number): CandidateV3;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CandidateListV3.AsObject;
  static toObject(includeInstance: boolean, msg: CandidateListV3): CandidateListV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CandidateListV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CandidateListV3;
  static deserializeBinaryFromReader(message: CandidateListV3, reader: jspb.BinaryReader): CandidateListV3;
}

export namespace CandidateListV3 {
  export type AsObject = {
    candidatesList: Array<CandidateV3.AsObject>,
  }
}

export class Delegation extends jspb.Message {
  hasDelegator(): boolean;
  clearDelegator(): void;
  getDelegator(): proto_loom_pb.Address | undefined;
  setDelegator(value?: proto_loom_pb.Address): void;

  hasValidator(): boolean;
  clearValidator(): void;
  getValidator(): proto_loom_pb.Address | undefined;
  setValidator(value?: proto_loom_pb.Address): void;

  hasUpdateValidator(): boolean;
  clearUpdateValidator(): void;
  getUpdateValidator(): proto_loom_pb.Address | undefined;
  setUpdateValidator(value?: proto_loom_pb.Address): void;

  getIndex(): number;
  setIndex(value: number): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  hasUpdateAmount(): boolean;
  clearUpdateAmount(): void;
  getUpdateAmount(): proto_loom_pb.BigUInt | undefined;
  setUpdateAmount(value?: proto_loom_pb.BigUInt): void;

  getLocktimeTier(): LocktimeTier;
  setLocktimeTier(value: LocktimeTier): void;

  getUpdateLocktimeTier(): LocktimeTier;
  setUpdateLocktimeTier(value: LocktimeTier): void;

  getLockTime(): number;
  setLockTime(value: number): void;

  getState(): DelegationState;
  setState(value: DelegationState): void;

  getReferrer(): string;
  setReferrer(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Delegation.AsObject;
  static toObject(includeInstance: boolean, msg: Delegation): Delegation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Delegation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Delegation;
  static deserializeBinaryFromReader(message: Delegation, reader: jspb.BinaryReader): Delegation;
}

export namespace Delegation {
  export type AsObject = {
    delegator?: proto_loom_pb.Address.AsObject,
    validator?: proto_loom_pb.Address.AsObject,
    updateValidator?: proto_loom_pb.Address.AsObject,
    index: number,
    amount?: proto_loom_pb.BigUInt.AsObject,
    updateAmount?: proto_loom_pb.BigUInt.AsObject,
    locktimeTier: LocktimeTier,
    updateLocktimeTier: LocktimeTier,
    lockTime: number,
    state: DelegationState,
    referrer: string,
  }
}

export class DelegationIndex extends jspb.Message {
  hasValidator(): boolean;
  clearValidator(): void;
  getValidator(): proto_loom_pb.Address | undefined;
  setValidator(value?: proto_loom_pb.Address): void;

  hasDelegator(): boolean;
  clearDelegator(): void;
  getDelegator(): proto_loom_pb.Address | undefined;
  setDelegator(value?: proto_loom_pb.Address): void;

  getIndex(): number;
  setIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DelegationIndex.AsObject;
  static toObject(includeInstance: boolean, msg: DelegationIndex): DelegationIndex.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DelegationIndex, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DelegationIndex;
  static deserializeBinaryFromReader(message: DelegationIndex, reader: jspb.BinaryReader): DelegationIndex;
}

export namespace DelegationIndex {
  export type AsObject = {
    validator?: proto_loom_pb.Address.AsObject,
    delegator?: proto_loom_pb.Address.AsObject,
    index: number,
  }
}

export class DelegationList extends jspb.Message {
  clearDelegationsList(): void;
  getDelegationsList(): Array<DelegationIndex>;
  setDelegationsList(value: Array<DelegationIndex>): void;
  addDelegations(value?: DelegationIndex, index?: number): DelegationIndex;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DelegationList.AsObject;
  static toObject(includeInstance: boolean, msg: DelegationList): DelegationList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DelegationList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DelegationList;
  static deserializeBinaryFromReader(message: DelegationList, reader: jspb.BinaryReader): DelegationList;
}

export namespace DelegationList {
  export type AsObject = {
    delegationsList: Array<DelegationIndex.AsObject>,
  }
}

export class DPOSInitRequest extends jspb.Message {
  hasParams(): boolean;
  clearParams(): void;
  getParams(): Params | undefined;
  setParams(value?: Params): void;

  clearValidatorsList(): void;
  getValidatorsList(): Array<ValidatorV3>;
  setValidatorsList(value: Array<ValidatorV3>): void;
  addValidators(value?: ValidatorV3, index?: number): ValidatorV3;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DPOSInitRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DPOSInitRequest): DPOSInitRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DPOSInitRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DPOSInitRequest;
  static deserializeBinaryFromReader(message: DPOSInitRequest, reader: jspb.BinaryReader): DPOSInitRequest;
}

export namespace DPOSInitRequest {
  export type AsObject = {
    params?: Params.AsObject,
    validatorsList: Array<ValidatorV3.AsObject>,
  }
}

export class DelegateRequest extends jspb.Message {
  hasValidatorAddress(): boolean;
  clearValidatorAddress(): void;
  getValidatorAddress(): proto_loom_pb.Address | undefined;
  setValidatorAddress(value?: proto_loom_pb.Address): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  getLocktimeTier(): number;
  setLocktimeTier(value: number): void;

  getReferrer(): string;
  setReferrer(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DelegateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DelegateRequest): DelegateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DelegateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DelegateRequest;
  static deserializeBinaryFromReader(message: DelegateRequest, reader: jspb.BinaryReader): DelegateRequest;
}

export namespace DelegateRequest {
  export type AsObject = {
    validatorAddress?: proto_loom_pb.Address.AsObject,
    amount?: proto_loom_pb.BigUInt.AsObject,
    locktimeTier: number,
    referrer: string,
  }
}

export class RedelegateRequest extends jspb.Message {
  hasValidatorAddress(): boolean;
  clearValidatorAddress(): void;
  getValidatorAddress(): proto_loom_pb.Address | undefined;
  setValidatorAddress(value?: proto_loom_pb.Address): void;

  hasFormerValidatorAddress(): boolean;
  clearFormerValidatorAddress(): void;
  getFormerValidatorAddress(): proto_loom_pb.Address | undefined;
  setFormerValidatorAddress(value?: proto_loom_pb.Address): void;

  getIndex(): number;
  setIndex(value: number): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  getNewLocktimeTier(): number;
  setNewLocktimeTier(value: number): void;

  getReferrer(): string;
  setReferrer(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RedelegateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RedelegateRequest): RedelegateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RedelegateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RedelegateRequest;
  static deserializeBinaryFromReader(message: RedelegateRequest, reader: jspb.BinaryReader): RedelegateRequest;
}

export namespace RedelegateRequest {
  export type AsObject = {
    validatorAddress?: proto_loom_pb.Address.AsObject,
    formerValidatorAddress?: proto_loom_pb.Address.AsObject,
    index: number,
    amount?: proto_loom_pb.BigUInt.AsObject,
    newLocktimeTier: number,
    referrer: string,
  }
}

export class ConsolidateDelegationsRequest extends jspb.Message {
  hasValidatorAddress(): boolean;
  clearValidatorAddress(): void;
  getValidatorAddress(): proto_loom_pb.Address | undefined;
  setValidatorAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConsolidateDelegationsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ConsolidateDelegationsRequest): ConsolidateDelegationsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConsolidateDelegationsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConsolidateDelegationsRequest;
  static deserializeBinaryFromReader(message: ConsolidateDelegationsRequest, reader: jspb.BinaryReader): ConsolidateDelegationsRequest;
}

export namespace ConsolidateDelegationsRequest {
  export type AsObject = {
    validatorAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class UnbondRequest extends jspb.Message {
  hasValidatorAddress(): boolean;
  clearValidatorAddress(): void;
  getValidatorAddress(): proto_loom_pb.Address | undefined;
  setValidatorAddress(value?: proto_loom_pb.Address): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  getIndex(): number;
  setIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnbondRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnbondRequest): UnbondRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnbondRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnbondRequest;
  static deserializeBinaryFromReader(message: UnbondRequest, reader: jspb.BinaryReader): UnbondRequest;
}

export namespace UnbondRequest {
  export type AsObject = {
    validatorAddress?: proto_loom_pb.Address.AsObject,
    amount?: proto_loom_pb.BigUInt.AsObject,
    index: number,
  }
}

export class WhitelistCandidateRequest extends jspb.Message {
  hasCandidateAddress(): boolean;
  clearCandidateAddress(): void;
  getCandidateAddress(): proto_loom_pb.Address | undefined;
  setCandidateAddress(value?: proto_loom_pb.Address): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  getLockTimeTier(): LocktimeTier;
  setLockTimeTier(value: LocktimeTier): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WhitelistCandidateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WhitelistCandidateRequest): WhitelistCandidateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WhitelistCandidateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WhitelistCandidateRequest;
  static deserializeBinaryFromReader(message: WhitelistCandidateRequest, reader: jspb.BinaryReader): WhitelistCandidateRequest;
}

export namespace WhitelistCandidateRequest {
  export type AsObject = {
    candidateAddress?: proto_loom_pb.Address.AsObject,
    amount?: proto_loom_pb.BigUInt.AsObject,
    lockTimeTier: LocktimeTier,
  }
}

export class RemoveWhitelistedCandidateRequest extends jspb.Message {
  hasCandidateAddress(): boolean;
  clearCandidateAddress(): void;
  getCandidateAddress(): proto_loom_pb.Address | undefined;
  setCandidateAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveWhitelistedCandidateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveWhitelistedCandidateRequest): RemoveWhitelistedCandidateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveWhitelistedCandidateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveWhitelistedCandidateRequest;
  static deserializeBinaryFromReader(message: RemoveWhitelistedCandidateRequest, reader: jspb.BinaryReader): RemoveWhitelistedCandidateRequest;
}

export namespace RemoveWhitelistedCandidateRequest {
  export type AsObject = {
    candidateAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class ChangeWhitelistInfoRequest extends jspb.Message {
  hasCandidateAddress(): boolean;
  clearCandidateAddress(): void;
  getCandidateAddress(): proto_loom_pb.Address | undefined;
  setCandidateAddress(value?: proto_loom_pb.Address): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  getLockTimeTier(): LocktimeTier;
  setLockTimeTier(value: LocktimeTier): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeWhitelistInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ChangeWhitelistInfoRequest): ChangeWhitelistInfoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChangeWhitelistInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChangeWhitelistInfoRequest;
  static deserializeBinaryFromReader(message: ChangeWhitelistInfoRequest, reader: jspb.BinaryReader): ChangeWhitelistInfoRequest;
}

export namespace ChangeWhitelistInfoRequest {
  export type AsObject = {
    candidateAddress?: proto_loom_pb.Address.AsObject,
    amount?: proto_loom_pb.BigUInt.AsObject,
    lockTimeTier: LocktimeTier,
  }
}

export class CheckDelegationRequest extends jspb.Message {
  hasValidatorAddress(): boolean;
  clearValidatorAddress(): void;
  getValidatorAddress(): proto_loom_pb.Address | undefined;
  setValidatorAddress(value?: proto_loom_pb.Address): void;

  hasDelegatorAddress(): boolean;
  clearDelegatorAddress(): void;
  getDelegatorAddress(): proto_loom_pb.Address | undefined;
  setDelegatorAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckDelegationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CheckDelegationRequest): CheckDelegationRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckDelegationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckDelegationRequest;
  static deserializeBinaryFromReader(message: CheckDelegationRequest, reader: jspb.BinaryReader): CheckDelegationRequest;
}

export namespace CheckDelegationRequest {
  export type AsObject = {
    validatorAddress?: proto_loom_pb.Address.AsObject,
    delegatorAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class CheckDelegationResponse extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  hasWeightedAmount(): boolean;
  clearWeightedAmount(): void;
  getWeightedAmount(): proto_loom_pb.BigUInt | undefined;
  setWeightedAmount(value?: proto_loom_pb.BigUInt): void;

  clearDelegationsList(): void;
  getDelegationsList(): Array<Delegation>;
  setDelegationsList(value: Array<Delegation>): void;
  addDelegations(value?: Delegation, index?: number): Delegation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckDelegationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CheckDelegationResponse): CheckDelegationResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckDelegationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckDelegationResponse;
  static deserializeBinaryFromReader(message: CheckDelegationResponse, reader: jspb.BinaryReader): CheckDelegationResponse;
}

export namespace CheckDelegationResponse {
  export type AsObject = {
    amount?: proto_loom_pb.BigUInt.AsObject,
    weightedAmount?: proto_loom_pb.BigUInt.AsObject,
    delegationsList: Array<Delegation.AsObject>,
  }
}

export class CheckRewardsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckRewardsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CheckRewardsRequest): CheckRewardsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckRewardsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckRewardsRequest;
  static deserializeBinaryFromReader(message: CheckRewardsRequest, reader: jspb.BinaryReader): CheckRewardsRequest;
}

export namespace CheckRewardsRequest {
  export type AsObject = {
  }
}

export class CheckRewardsResponse extends jspb.Message {
  hasTotalRewardDistribution(): boolean;
  clearTotalRewardDistribution(): void;
  getTotalRewardDistribution(): proto_loom_pb.BigUInt | undefined;
  setTotalRewardDistribution(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckRewardsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CheckRewardsResponse): CheckRewardsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckRewardsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckRewardsResponse;
  static deserializeBinaryFromReader(message: CheckRewardsResponse, reader: jspb.BinaryReader): CheckRewardsResponse;
}

export namespace CheckRewardsResponse {
  export type AsObject = {
    totalRewardDistribution?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class TotalDelegationRequestV3 extends jspb.Message {
  hasDelegatorAddress(): boolean;
  clearDelegatorAddress(): void;
  getDelegatorAddress(): proto_loom_pb.Address | undefined;
  setDelegatorAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TotalDelegationRequestV3.AsObject;
  static toObject(includeInstance: boolean, msg: TotalDelegationRequestV3): TotalDelegationRequestV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TotalDelegationRequestV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TotalDelegationRequestV3;
  static deserializeBinaryFromReader(message: TotalDelegationRequestV3, reader: jspb.BinaryReader): TotalDelegationRequestV3;
}

export namespace TotalDelegationRequestV3 {
  export type AsObject = {
    delegatorAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class TotalDelegationResponseV3 extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  hasWeightedAmount(): boolean;
  clearWeightedAmount(): void;
  getWeightedAmount(): proto_loom_pb.BigUInt | undefined;
  setWeightedAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TotalDelegationResponseV3.AsObject;
  static toObject(includeInstance: boolean, msg: TotalDelegationResponseV3): TotalDelegationResponseV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TotalDelegationResponseV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TotalDelegationResponseV3;
  static deserializeBinaryFromReader(message: TotalDelegationResponseV3, reader: jspb.BinaryReader): TotalDelegationResponseV3;
}

export namespace TotalDelegationResponseV3 {
  export type AsObject = {
    amount?: proto_loom_pb.BigUInt.AsObject,
    weightedAmount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class CheckAllDelegationsRequestV3 extends jspb.Message {
  hasDelegatorAddress(): boolean;
  clearDelegatorAddress(): void;
  getDelegatorAddress(): proto_loom_pb.Address | undefined;
  setDelegatorAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckAllDelegationsRequestV3.AsObject;
  static toObject(includeInstance: boolean, msg: CheckAllDelegationsRequestV3): CheckAllDelegationsRequestV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckAllDelegationsRequestV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckAllDelegationsRequestV3;
  static deserializeBinaryFromReader(message: CheckAllDelegationsRequestV3, reader: jspb.BinaryReader): CheckAllDelegationsRequestV3;
}

export namespace CheckAllDelegationsRequestV3 {
  export type AsObject = {
    delegatorAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class CheckAllDelegationsResponseV3 extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  hasWeightedAmount(): boolean;
  clearWeightedAmount(): void;
  getWeightedAmount(): proto_loom_pb.BigUInt | undefined;
  setWeightedAmount(value?: proto_loom_pb.BigUInt): void;

  clearDelegationsList(): void;
  getDelegationsList(): Array<Delegation>;
  setDelegationsList(value: Array<Delegation>): void;
  addDelegations(value?: Delegation, index?: number): Delegation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckAllDelegationsResponseV3.AsObject;
  static toObject(includeInstance: boolean, msg: CheckAllDelegationsResponseV3): CheckAllDelegationsResponseV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckAllDelegationsResponseV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckAllDelegationsResponseV3;
  static deserializeBinaryFromReader(message: CheckAllDelegationsResponseV3, reader: jspb.BinaryReader): CheckAllDelegationsResponseV3;
}

export namespace CheckAllDelegationsResponseV3 {
  export type AsObject = {
    amount?: proto_loom_pb.BigUInt.AsObject,
    weightedAmount?: proto_loom_pb.BigUInt.AsObject,
    delegationsList: Array<Delegation.AsObject>,
  }
}

export class CheckRewardDelegationRequest extends jspb.Message {
  hasValidatorAddress(): boolean;
  clearValidatorAddress(): void;
  getValidatorAddress(): proto_loom_pb.Address | undefined;
  setValidatorAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckRewardDelegationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CheckRewardDelegationRequest): CheckRewardDelegationRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckRewardDelegationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckRewardDelegationRequest;
  static deserializeBinaryFromReader(message: CheckRewardDelegationRequest, reader: jspb.BinaryReader): CheckRewardDelegationRequest;
}

export namespace CheckRewardDelegationRequest {
  export type AsObject = {
    validatorAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class CheckRewardDelegationResponse extends jspb.Message {
  hasDelegation(): boolean;
  clearDelegation(): void;
  getDelegation(): Delegation | undefined;
  setDelegation(value?: Delegation): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckRewardDelegationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CheckRewardDelegationResponse): CheckRewardDelegationResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckRewardDelegationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckRewardDelegationResponse;
  static deserializeBinaryFromReader(message: CheckRewardDelegationResponse, reader: jspb.BinaryReader): CheckRewardDelegationResponse;
}

export namespace CheckRewardDelegationResponse {
  export type AsObject = {
    delegation?: Delegation.AsObject,
  }
}

export class DowntimeRecordRequest extends jspb.Message {
  hasValidator(): boolean;
  clearValidator(): void;
  getValidator(): proto_loom_pb.Address | undefined;
  setValidator(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DowntimeRecordRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DowntimeRecordRequest): DowntimeRecordRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DowntimeRecordRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DowntimeRecordRequest;
  static deserializeBinaryFromReader(message: DowntimeRecordRequest, reader: jspb.BinaryReader): DowntimeRecordRequest;
}

export namespace DowntimeRecordRequest {
  export type AsObject = {
    validator?: proto_loom_pb.Address.AsObject,
  }
}

export class DowntimeRecordResponse extends jspb.Message {
  clearDowntimeRecordsList(): void;
  getDowntimeRecordsList(): Array<DowntimeRecord>;
  setDowntimeRecordsList(value: Array<DowntimeRecord>): void;
  addDowntimeRecords(value?: DowntimeRecord, index?: number): DowntimeRecord;

  getPeriodLength(): number;
  setPeriodLength(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DowntimeRecordResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DowntimeRecordResponse): DowntimeRecordResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DowntimeRecordResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DowntimeRecordResponse;
  static deserializeBinaryFromReader(message: DowntimeRecordResponse, reader: jspb.BinaryReader): DowntimeRecordResponse;
}

export namespace DowntimeRecordResponse {
  export type AsObject = {
    downtimeRecordsList: Array<DowntimeRecord.AsObject>,
    periodLength: number,
  }
}

export class DowntimeRecord extends jspb.Message {
  hasValidator(): boolean;
  clearValidator(): void;
  getValidator(): proto_loom_pb.Address | undefined;
  setValidator(value?: proto_loom_pb.Address): void;

  clearPeriodsList(): void;
  getPeriodsList(): Array<number>;
  setPeriodsList(value: Array<number>): void;
  addPeriods(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DowntimeRecord.AsObject;
  static toObject(includeInstance: boolean, msg: DowntimeRecord): DowntimeRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DowntimeRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DowntimeRecord;
  static deserializeBinaryFromReader(message: DowntimeRecord, reader: jspb.BinaryReader): DowntimeRecord;
}

export namespace DowntimeRecord {
  export type AsObject = {
    validator?: proto_loom_pb.Address.AsObject,
    periodsList: Array<number>,
  }
}

export class RegisterCandidateRequestV3 extends jspb.Message {
  getPubKey(): Uint8Array | string;
  getPubKey_asU8(): Uint8Array;
  getPubKey_asB64(): string;
  setPubKey(value: Uint8Array | string): void;

  getFee(): number;
  setFee(value: number): void;

  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getWebsite(): string;
  setWebsite(value: string): void;

  getLocktimeTier(): number;
  setLocktimeTier(value: number): void;

  getMaxReferralPercentage(): number;
  setMaxReferralPercentage(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterCandidateRequestV3.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterCandidateRequestV3): RegisterCandidateRequestV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RegisterCandidateRequestV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterCandidateRequestV3;
  static deserializeBinaryFromReader(message: RegisterCandidateRequestV3, reader: jspb.BinaryReader): RegisterCandidateRequestV3;
}

export namespace RegisterCandidateRequestV3 {
  export type AsObject = {
    pubKey: Uint8Array | string,
    fee: number,
    name: string,
    description: string,
    website: string,
    locktimeTier: number,
    maxReferralPercentage: number,
  }
}

export class UpdateCandidateInfoRequestV3 extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getWebsite(): string;
  setWebsite(value: string): void;

  getMaxReferralPercentage(): number;
  setMaxReferralPercentage(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateCandidateInfoRequestV3.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateCandidateInfoRequestV3): UpdateCandidateInfoRequestV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateCandidateInfoRequestV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateCandidateInfoRequestV3;
  static deserializeBinaryFromReader(message: UpdateCandidateInfoRequestV3, reader: jspb.BinaryReader): UpdateCandidateInfoRequestV3;
}

export namespace UpdateCandidateInfoRequestV3 {
  export type AsObject = {
    name: string,
    description: string,
    website: string,
    maxReferralPercentage: number,
  }
}

export class ChangeCandidateFeeRequestV3 extends jspb.Message {
  getFee(): number;
  setFee(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeCandidateFeeRequestV3.AsObject;
  static toObject(includeInstance: boolean, msg: ChangeCandidateFeeRequestV3): ChangeCandidateFeeRequestV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChangeCandidateFeeRequestV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChangeCandidateFeeRequestV3;
  static deserializeBinaryFromReader(message: ChangeCandidateFeeRequestV3, reader: jspb.BinaryReader): ChangeCandidateFeeRequestV3;
}

export namespace ChangeCandidateFeeRequestV3 {
  export type AsObject = {
    fee: number,
  }
}

export class SetMinCandidateFeeRequest extends jspb.Message {
  getMinCandidateFee(): number;
  setMinCandidateFee(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetMinCandidateFeeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetMinCandidateFeeRequest): SetMinCandidateFeeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetMinCandidateFeeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetMinCandidateFeeRequest;
  static deserializeBinaryFromReader(message: SetMinCandidateFeeRequest, reader: jspb.BinaryReader): SetMinCandidateFeeRequest;
}

export namespace SetMinCandidateFeeRequest {
  export type AsObject = {
    minCandidateFee: number,
  }
}

export class UpdateCandidateInfoRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getWebsite(): string;
  setWebsite(value: string): void;

  getMaxReferralPercentage(): number;
  setMaxReferralPercentage(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateCandidateInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateCandidateInfoRequest): UpdateCandidateInfoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateCandidateInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateCandidateInfoRequest;
  static deserializeBinaryFromReader(message: UpdateCandidateInfoRequest, reader: jspb.BinaryReader): UpdateCandidateInfoRequest;
}

export namespace UpdateCandidateInfoRequest {
  export type AsObject = {
    name: string,
    description: string,
    website: string,
    maxReferralPercentage: number,
  }
}

export class UnjailRequest extends jspb.Message {
  hasValidator(): boolean;
  clearValidator(): void;
  getValidator(): proto_loom_pb.Address | undefined;
  setValidator(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnjailRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnjailRequest): UnjailRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnjailRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnjailRequest;
  static deserializeBinaryFromReader(message: UnjailRequest, reader: jspb.BinaryReader): UnjailRequest;
}

export namespace UnjailRequest {
  export type AsObject = {
    validator?: proto_loom_pb.Address.AsObject,
  }
}

export class UnregisterCandidateRequestV3 extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnregisterCandidateRequestV3.AsObject;
  static toObject(includeInstance: boolean, msg: UnregisterCandidateRequestV3): UnregisterCandidateRequestV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnregisterCandidateRequestV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnregisterCandidateRequestV3;
  static deserializeBinaryFromReader(message: UnregisterCandidateRequestV3, reader: jspb.BinaryReader): UnregisterCandidateRequestV3;
}

export namespace UnregisterCandidateRequestV3 {
  export type AsObject = {
  }
}

export class TimeUntilElectionRequestV3 extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeUntilElectionRequestV3.AsObject;
  static toObject(includeInstance: boolean, msg: TimeUntilElectionRequestV3): TimeUntilElectionRequestV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeUntilElectionRequestV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeUntilElectionRequestV3;
  static deserializeBinaryFromReader(message: TimeUntilElectionRequestV3, reader: jspb.BinaryReader): TimeUntilElectionRequestV3;
}

export namespace TimeUntilElectionRequestV3 {
  export type AsObject = {
  }
}

export class TimeUntilElectionResponseV3 extends jspb.Message {
  getTimeUntilElection(): number;
  setTimeUntilElection(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeUntilElectionResponseV3.AsObject;
  static toObject(includeInstance: boolean, msg: TimeUntilElectionResponseV3): TimeUntilElectionResponseV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeUntilElectionResponseV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeUntilElectionResponseV3;
  static deserializeBinaryFromReader(message: TimeUntilElectionResponseV3, reader: jspb.BinaryReader): TimeUntilElectionResponseV3;
}

export namespace TimeUntilElectionResponseV3 {
  export type AsObject = {
    timeUntilElection: number,
  }
}

export class ListValidatorsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListValidatorsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListValidatorsRequest): ListValidatorsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListValidatorsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListValidatorsRequest;
  static deserializeBinaryFromReader(message: ListValidatorsRequest, reader: jspb.BinaryReader): ListValidatorsRequest;
}

export namespace ListValidatorsRequest {
  export type AsObject = {
  }
}

export class ListValidatorsResponse extends jspb.Message {
  clearStatisticsList(): void;
  getStatisticsList(): Array<ValidatorStatistic>;
  setStatisticsList(value: Array<ValidatorStatistic>): void;
  addStatistics(value?: ValidatorStatistic, index?: number): ValidatorStatistic;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListValidatorsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListValidatorsResponse): ListValidatorsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListValidatorsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListValidatorsResponse;
  static deserializeBinaryFromReader(message: ListValidatorsResponse, reader: jspb.BinaryReader): ListValidatorsResponse;
}

export namespace ListValidatorsResponse {
  export type AsObject = {
    statisticsList: Array<ValidatorStatistic.AsObject>,
  }
}

export class ListCandidatesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListCandidatesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListCandidatesRequest): ListCandidatesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListCandidatesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListCandidatesRequest;
  static deserializeBinaryFromReader(message: ListCandidatesRequest, reader: jspb.BinaryReader): ListCandidatesRequest;
}

export namespace ListCandidatesRequest {
  export type AsObject = {
  }
}

export class ListCandidatesResponse extends jspb.Message {
  clearCandidatesList(): void;
  getCandidatesList(): Array<CandidateStatistic>;
  setCandidatesList(value: Array<CandidateStatistic>): void;
  addCandidates(value?: CandidateStatistic, index?: number): CandidateStatistic;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListCandidatesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListCandidatesResponse): ListCandidatesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListCandidatesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListCandidatesResponse;
  static deserializeBinaryFromReader(message: ListCandidatesResponse, reader: jspb.BinaryReader): ListCandidatesResponse;
}

export namespace ListCandidatesResponse {
  export type AsObject = {
    candidatesList: Array<CandidateStatistic.AsObject>,
  }
}

export class ListDelegationsRequestV3 extends jspb.Message {
  hasCandidate(): boolean;
  clearCandidate(): void;
  getCandidate(): proto_loom_pb.Address | undefined;
  setCandidate(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDelegationsRequestV3.AsObject;
  static toObject(includeInstance: boolean, msg: ListDelegationsRequestV3): ListDelegationsRequestV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListDelegationsRequestV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDelegationsRequestV3;
  static deserializeBinaryFromReader(message: ListDelegationsRequestV3, reader: jspb.BinaryReader): ListDelegationsRequestV3;
}

export namespace ListDelegationsRequestV3 {
  export type AsObject = {
    candidate?: proto_loom_pb.Address.AsObject,
  }
}

export class ListDelegationsResponseV3 extends jspb.Message {
  clearDelegationsList(): void;
  getDelegationsList(): Array<Delegation>;
  setDelegationsList(value: Array<Delegation>): void;
  addDelegations(value?: Delegation, index?: number): Delegation;

  hasDelegationTotal(): boolean;
  clearDelegationTotal(): void;
  getDelegationTotal(): proto_loom_pb.BigUInt | undefined;
  setDelegationTotal(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDelegationsResponseV3.AsObject;
  static toObject(includeInstance: boolean, msg: ListDelegationsResponseV3): ListDelegationsResponseV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListDelegationsResponseV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDelegationsResponseV3;
  static deserializeBinaryFromReader(message: ListDelegationsResponseV3, reader: jspb.BinaryReader): ListDelegationsResponseV3;
}

export namespace ListDelegationsResponseV3 {
  export type AsObject = {
    delegationsList: Array<Delegation.AsObject>,
    delegationTotal?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class ListAllDelegationsRequestV3 extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAllDelegationsRequestV3.AsObject;
  static toObject(includeInstance: boolean, msg: ListAllDelegationsRequestV3): ListAllDelegationsRequestV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListAllDelegationsRequestV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAllDelegationsRequestV3;
  static deserializeBinaryFromReader(message: ListAllDelegationsRequestV3, reader: jspb.BinaryReader): ListAllDelegationsRequestV3;
}

export namespace ListAllDelegationsRequestV3 {
  export type AsObject = {
  }
}

export class ListAllDelegationsResponseV3 extends jspb.Message {
  clearListResponsesList(): void;
  getListResponsesList(): Array<ListDelegationsResponseV3>;
  setListResponsesList(value: Array<ListDelegationsResponseV3>): void;
  addListResponses(value?: ListDelegationsResponseV3, index?: number): ListDelegationsResponseV3;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAllDelegationsResponseV3.AsObject;
  static toObject(includeInstance: boolean, msg: ListAllDelegationsResponseV3): ListAllDelegationsResponseV3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListAllDelegationsResponseV3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAllDelegationsResponseV3;
  static deserializeBinaryFromReader(message: ListAllDelegationsResponseV3, reader: jspb.BinaryReader): ListAllDelegationsResponseV3;
}

export namespace ListAllDelegationsResponseV3 {
  export type AsObject = {
    listResponsesList: Array<ListDelegationsResponseV3.AsObject>,
  }
}

export class BatchRequest extends jspb.Message {
  hasWhitelistCandidate(): boolean;
  clearWhitelistCandidate(): void;
  getWhitelistCandidate(): WhitelistCandidateRequest | undefined;
  setWhitelistCandidate(value?: WhitelistCandidateRequest): void;

  hasMeta(): boolean;
  clearMeta(): void;
  getMeta(): BatchRequestMeta | undefined;
  setMeta(value?: BatchRequestMeta): void;

  getPayloadCase(): BatchRequest.PayloadCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BatchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BatchRequest): BatchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BatchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BatchRequest;
  static deserializeBinaryFromReader(message: BatchRequest, reader: jspb.BinaryReader): BatchRequest;
}

export namespace BatchRequest {
  export type AsObject = {
    whitelistCandidate?: WhitelistCandidateRequest.AsObject,
    meta?: BatchRequestMeta.AsObject,
  }

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    WHITELIST_CANDIDATE = 1,
  }
}

export class BatchRequestMeta extends jspb.Message {
  getBlockNumber(): number;
  setBlockNumber(value: number): void;

  getTxIndex(): number;
  setTxIndex(value: number): void;

  getLogIndex(): number;
  setLogIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BatchRequestMeta.AsObject;
  static toObject(includeInstance: boolean, msg: BatchRequestMeta): BatchRequestMeta.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BatchRequestMeta, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BatchRequestMeta;
  static deserializeBinaryFromReader(message: BatchRequestMeta, reader: jspb.BinaryReader): BatchRequestMeta;
}

export namespace BatchRequestMeta {
  export type AsObject = {
    blockNumber: number,
    txIndex: number,
    logIndex: number,
  }
}

export class RequestBatchTally extends jspb.Message {
  getLastSeenBlockNumber(): number;
  setLastSeenBlockNumber(value: number): void;

  getLastSeenTxIndex(): number;
  setLastSeenTxIndex(value: number): void;

  getLastSeenLogIndex(): number;
  setLastSeenLogIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RequestBatchTally.AsObject;
  static toObject(includeInstance: boolean, msg: RequestBatchTally): RequestBatchTally.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RequestBatchTally, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RequestBatchTally;
  static deserializeBinaryFromReader(message: RequestBatchTally, reader: jspb.BinaryReader): RequestBatchTally;
}

export namespace RequestBatchTally {
  export type AsObject = {
    lastSeenBlockNumber: number,
    lastSeenTxIndex: number,
    lastSeenLogIndex: number,
  }
}

export class RequestBatch extends jspb.Message {
  clearBatchList(): void;
  getBatchList(): Array<BatchRequest>;
  setBatchList(value: Array<BatchRequest>): void;
  addBatch(value?: BatchRequest, index?: number): BatchRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RequestBatch.AsObject;
  static toObject(includeInstance: boolean, msg: RequestBatch): RequestBatch.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RequestBatch, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RequestBatch;
  static deserializeBinaryFromReader(message: RequestBatch, reader: jspb.BinaryReader): RequestBatch;
}

export namespace RequestBatch {
  export type AsObject = {
    batchList: Array<BatchRequest.AsObject>,
  }
}

export class GetRequestBatchTallyRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRequestBatchTallyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetRequestBatchTallyRequest): GetRequestBatchTallyRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetRequestBatchTallyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRequestBatchTallyRequest;
  static deserializeBinaryFromReader(message: GetRequestBatchTallyRequest, reader: jspb.BinaryReader): GetRequestBatchTallyRequest;
}

export namespace GetRequestBatchTallyRequest {
  export type AsObject = {
  }
}

export class RegisterReferrerRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterReferrerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterReferrerRequest): RegisterReferrerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RegisterReferrerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterReferrerRequest;
  static deserializeBinaryFromReader(message: RegisterReferrerRequest, reader: jspb.BinaryReader): RegisterReferrerRequest;
}

export namespace RegisterReferrerRequest {
  export type AsObject = {
    name: string,
    address?: proto_loom_pb.Address.AsObject,
  }
}

export class SetElectionCycleRequest extends jspb.Message {
  getElectionCycle(): number;
  setElectionCycle(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetElectionCycleRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetElectionCycleRequest): SetElectionCycleRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetElectionCycleRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetElectionCycleRequest;
  static deserializeBinaryFromReader(message: SetElectionCycleRequest, reader: jspb.BinaryReader): SetElectionCycleRequest;
}

export namespace SetElectionCycleRequest {
  export type AsObject = {
    electionCycle: number,
  }
}

export class SetDowntimePeriodRequest extends jspb.Message {
  getDowntimePeriod(): number;
  setDowntimePeriod(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetDowntimePeriodRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetDowntimePeriodRequest): SetDowntimePeriodRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetDowntimePeriodRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetDowntimePeriodRequest;
  static deserializeBinaryFromReader(message: SetDowntimePeriodRequest, reader: jspb.BinaryReader): SetDowntimePeriodRequest;
}

export namespace SetDowntimePeriodRequest {
  export type AsObject = {
    downtimePeriod: number,
  }
}

export class SetMaxYearlyRewardRequest extends jspb.Message {
  hasMaxYearlyReward(): boolean;
  clearMaxYearlyReward(): void;
  getMaxYearlyReward(): proto_loom_pb.BigUInt | undefined;
  setMaxYearlyReward(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetMaxYearlyRewardRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetMaxYearlyRewardRequest): SetMaxYearlyRewardRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetMaxYearlyRewardRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetMaxYearlyRewardRequest;
  static deserializeBinaryFromReader(message: SetMaxYearlyRewardRequest, reader: jspb.BinaryReader): SetMaxYearlyRewardRequest;
}

export namespace SetMaxYearlyRewardRequest {
  export type AsObject = {
    maxYearlyReward?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class SetRegistrationRequirementRequest extends jspb.Message {
  hasRegistrationRequirement(): boolean;
  clearRegistrationRequirement(): void;
  getRegistrationRequirement(): proto_loom_pb.BigUInt | undefined;
  setRegistrationRequirement(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetRegistrationRequirementRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetRegistrationRequirementRequest): SetRegistrationRequirementRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetRegistrationRequirementRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetRegistrationRequirementRequest;
  static deserializeBinaryFromReader(message: SetRegistrationRequirementRequest, reader: jspb.BinaryReader): SetRegistrationRequirementRequest;
}

export namespace SetRegistrationRequirementRequest {
  export type AsObject = {
    registrationRequirement?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class SetValidatorCountRequest extends jspb.Message {
  getValidatorCount(): number;
  setValidatorCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetValidatorCountRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetValidatorCountRequest): SetValidatorCountRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetValidatorCountRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetValidatorCountRequest;
  static deserializeBinaryFromReader(message: SetValidatorCountRequest, reader: jspb.BinaryReader): SetValidatorCountRequest;
}

export namespace SetValidatorCountRequest {
  export type AsObject = {
    validatorCount: number,
  }
}

export class SetOracleAddressRequest extends jspb.Message {
  hasOracleAddress(): boolean;
  clearOracleAddress(): void;
  getOracleAddress(): proto_loom_pb.Address | undefined;
  setOracleAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetOracleAddressRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetOracleAddressRequest): SetOracleAddressRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetOracleAddressRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetOracleAddressRequest;
  static deserializeBinaryFromReader(message: SetOracleAddressRequest, reader: jspb.BinaryReader): SetOracleAddressRequest;
}

export namespace SetOracleAddressRequest {
  export type AsObject = {
    oracleAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class SetSlashingPercentagesRequest extends jspb.Message {
  hasCrashSlashingPercentage(): boolean;
  clearCrashSlashingPercentage(): void;
  getCrashSlashingPercentage(): proto_loom_pb.BigUInt | undefined;
  setCrashSlashingPercentage(value?: proto_loom_pb.BigUInt): void;

  hasByzantineSlashingPercentage(): boolean;
  clearByzantineSlashingPercentage(): void;
  getByzantineSlashingPercentage(): proto_loom_pb.BigUInt | undefined;
  setByzantineSlashingPercentage(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetSlashingPercentagesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetSlashingPercentagesRequest): SetSlashingPercentagesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetSlashingPercentagesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetSlashingPercentagesRequest;
  static deserializeBinaryFromReader(message: SetSlashingPercentagesRequest, reader: jspb.BinaryReader): SetSlashingPercentagesRequest;
}

export namespace SetSlashingPercentagesRequest {
  export type AsObject = {
    crashSlashingPercentage?: proto_loom_pb.BigUInt.AsObject,
    byzantineSlashingPercentage?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class GetStateRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetStateRequest): GetStateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetStateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStateRequest;
  static deserializeBinaryFromReader(message: GetStateRequest, reader: jspb.BinaryReader): GetStateRequest;
}

export namespace GetStateRequest {
  export type AsObject = {
  }
}

export class GetStateResponse extends jspb.Message {
  hasState(): boolean;
  clearState(): void;
  getState(): State | undefined;
  setState(value?: State): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetStateResponse): GetStateResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetStateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStateResponse;
  static deserializeBinaryFromReader(message: GetStateResponse, reader: jspb.BinaryReader): GetStateResponse;
}

export namespace GetStateResponse {
  export type AsObject = {
    state?: State.AsObject,
  }
}

export class ClaimDelegatorRewardsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimDelegatorRewardsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimDelegatorRewardsRequest): ClaimDelegatorRewardsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClaimDelegatorRewardsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimDelegatorRewardsRequest;
  static deserializeBinaryFromReader(message: ClaimDelegatorRewardsRequest, reader: jspb.BinaryReader): ClaimDelegatorRewardsRequest;
}

export namespace ClaimDelegatorRewardsRequest {
  export type AsObject = {
  }
}

export class ClaimDelegatorRewardsResponse extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimDelegatorRewardsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimDelegatorRewardsResponse): ClaimDelegatorRewardsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClaimDelegatorRewardsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimDelegatorRewardsResponse;
  static deserializeBinaryFromReader(message: ClaimDelegatorRewardsResponse, reader: jspb.BinaryReader): ClaimDelegatorRewardsResponse;
}

export namespace ClaimDelegatorRewardsResponse {
  export type AsObject = {
    amount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class CheckDelegatorRewardsRequest extends jspb.Message {
  hasDelegator(): boolean;
  clearDelegator(): void;
  getDelegator(): proto_loom_pb.Address | undefined;
  setDelegator(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckDelegatorRewardsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CheckDelegatorRewardsRequest): CheckDelegatorRewardsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckDelegatorRewardsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckDelegatorRewardsRequest;
  static deserializeBinaryFromReader(message: CheckDelegatorRewardsRequest, reader: jspb.BinaryReader): CheckDelegatorRewardsRequest;
}

export namespace CheckDelegatorRewardsRequest {
  export type AsObject = {
    delegator?: proto_loom_pb.Address.AsObject,
  }
}

export class CheckDelegatorRewardsResponse extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckDelegatorRewardsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CheckDelegatorRewardsResponse): CheckDelegatorRewardsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckDelegatorRewardsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckDelegatorRewardsResponse;
  static deserializeBinaryFromReader(message: CheckDelegatorRewardsResponse, reader: jspb.BinaryReader): CheckDelegatorRewardsResponse;
}

export namespace CheckDelegatorRewardsResponse {
  export type AsObject = {
    amount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class DposElectionEvent extends jspb.Message {
  getBlockNumber(): number;
  setBlockNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DposElectionEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DposElectionEvent): DposElectionEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DposElectionEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DposElectionEvent;
  static deserializeBinaryFromReader(message: DposElectionEvent, reader: jspb.BinaryReader): DposElectionEvent;
}

export namespace DposElectionEvent {
  export type AsObject = {
    blockNumber: number,
  }
}

export class DposSlashEvent extends jspb.Message {
  hasValidator(): boolean;
  clearValidator(): void;
  getValidator(): proto_loom_pb.Address | undefined;
  setValidator(value?: proto_loom_pb.Address): void;

  hasSlashPercentage(): boolean;
  clearSlashPercentage(): void;
  getSlashPercentage(): proto_loom_pb.BigUInt | undefined;
  setSlashPercentage(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DposSlashEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DposSlashEvent): DposSlashEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DposSlashEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DposSlashEvent;
  static deserializeBinaryFromReader(message: DposSlashEvent, reader: jspb.BinaryReader): DposSlashEvent;
}

export namespace DposSlashEvent {
  export type AsObject = {
    validator?: proto_loom_pb.Address.AsObject,
    slashPercentage?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class DposUnjailEvent extends jspb.Message {
  hasValidator(): boolean;
  clearValidator(): void;
  getValidator(): proto_loom_pb.Address | undefined;
  setValidator(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DposUnjailEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DposUnjailEvent): DposUnjailEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DposUnjailEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DposUnjailEvent;
  static deserializeBinaryFromReader(message: DposUnjailEvent, reader: jspb.BinaryReader): DposUnjailEvent;
}

export namespace DposUnjailEvent {
  export type AsObject = {
    validator?: proto_loom_pb.Address.AsObject,
  }
}

export class DposCandidateRegistersEvent extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  getFee(): number;
  setFee(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DposCandidateRegistersEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DposCandidateRegistersEvent): DposCandidateRegistersEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DposCandidateRegistersEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DposCandidateRegistersEvent;
  static deserializeBinaryFromReader(message: DposCandidateRegistersEvent, reader: jspb.BinaryReader): DposCandidateRegistersEvent;
}

export namespace DposCandidateRegistersEvent {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
    fee: number,
  }
}

export class DposCandidateUnregistersEvent extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DposCandidateUnregistersEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DposCandidateUnregistersEvent): DposCandidateUnregistersEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DposCandidateUnregistersEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DposCandidateUnregistersEvent;
  static deserializeBinaryFromReader(message: DposCandidateUnregistersEvent, reader: jspb.BinaryReader): DposCandidateUnregistersEvent;
}

export namespace DposCandidateUnregistersEvent {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
  }
}

export class DposCandidateFeeChangeEvent extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  getNewFee(): number;
  setNewFee(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DposCandidateFeeChangeEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DposCandidateFeeChangeEvent): DposCandidateFeeChangeEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DposCandidateFeeChangeEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DposCandidateFeeChangeEvent;
  static deserializeBinaryFromReader(message: DposCandidateFeeChangeEvent, reader: jspb.BinaryReader): DposCandidateFeeChangeEvent;
}

export namespace DposCandidateFeeChangeEvent {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
    newFee: number,
  }
}

export class DposUpdateCandidateInfoEvent extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DposUpdateCandidateInfoEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DposUpdateCandidateInfoEvent): DposUpdateCandidateInfoEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DposUpdateCandidateInfoEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DposUpdateCandidateInfoEvent;
  static deserializeBinaryFromReader(message: DposUpdateCandidateInfoEvent, reader: jspb.BinaryReader): DposUpdateCandidateInfoEvent;
}

export namespace DposUpdateCandidateInfoEvent {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
  }
}

export class DposDelegatorDelegatesEvent extends jspb.Message {
  hasDelegation(): boolean;
  clearDelegation(): void;
  getDelegation(): Delegation | undefined;
  setDelegation(value?: Delegation): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DposDelegatorDelegatesEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DposDelegatorDelegatesEvent): DposDelegatorDelegatesEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DposDelegatorDelegatesEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DposDelegatorDelegatesEvent;
  static deserializeBinaryFromReader(message: DposDelegatorDelegatesEvent, reader: jspb.BinaryReader): DposDelegatorDelegatesEvent;
}

export namespace DposDelegatorDelegatesEvent {
  export type AsObject = {
    delegation?: Delegation.AsObject,
  }
}

export class DposDelegatorRedelegatesEvent extends jspb.Message {
  hasDelegation(): boolean;
  clearDelegation(): void;
  getDelegation(): Delegation | undefined;
  setDelegation(value?: Delegation): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DposDelegatorRedelegatesEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DposDelegatorRedelegatesEvent): DposDelegatorRedelegatesEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DposDelegatorRedelegatesEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DposDelegatorRedelegatesEvent;
  static deserializeBinaryFromReader(message: DposDelegatorRedelegatesEvent, reader: jspb.BinaryReader): DposDelegatorRedelegatesEvent;
}

export namespace DposDelegatorRedelegatesEvent {
  export type AsObject = {
    delegation?: Delegation.AsObject,
  }
}

export class DposDelegatorConsolidatesEvent extends jspb.Message {
  hasNewDelegation(): boolean;
  clearNewDelegation(): void;
  getNewDelegation(): Delegation | undefined;
  setNewDelegation(value?: Delegation): void;

  clearConsolidatedDelegationsList(): void;
  getConsolidatedDelegationsList(): Array<Delegation>;
  setConsolidatedDelegationsList(value: Array<Delegation>): void;
  addConsolidatedDelegations(value?: Delegation, index?: number): Delegation;

  getUnconsolidatedDelegationsCount(): number;
  setUnconsolidatedDelegationsCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DposDelegatorConsolidatesEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DposDelegatorConsolidatesEvent): DposDelegatorConsolidatesEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DposDelegatorConsolidatesEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DposDelegatorConsolidatesEvent;
  static deserializeBinaryFromReader(message: DposDelegatorConsolidatesEvent, reader: jspb.BinaryReader): DposDelegatorConsolidatesEvent;
}

export namespace DposDelegatorConsolidatesEvent {
  export type AsObject = {
    newDelegation?: Delegation.AsObject,
    consolidatedDelegationsList: Array<Delegation.AsObject>,
    unconsolidatedDelegationsCount: number,
  }
}

export class DposDelegatorUnbondsEvent extends jspb.Message {
  hasDelegation(): boolean;
  clearDelegation(): void;
  getDelegation(): Delegation | undefined;
  setDelegation(value?: Delegation): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DposDelegatorUnbondsEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DposDelegatorUnbondsEvent): DposDelegatorUnbondsEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DposDelegatorUnbondsEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DposDelegatorUnbondsEvent;
  static deserializeBinaryFromReader(message: DposDelegatorUnbondsEvent, reader: jspb.BinaryReader): DposDelegatorUnbondsEvent;
}

export namespace DposDelegatorUnbondsEvent {
  export type AsObject = {
    delegation?: Delegation.AsObject,
  }
}

export class DposReferrerRegistersEvent extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DposReferrerRegistersEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DposReferrerRegistersEvent): DposReferrerRegistersEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DposReferrerRegistersEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DposReferrerRegistersEvent;
  static deserializeBinaryFromReader(message: DposReferrerRegistersEvent, reader: jspb.BinaryReader): DposReferrerRegistersEvent;
}

export namespace DposReferrerRegistersEvent {
  export type AsObject = {
    name: string,
    address?: proto_loom_pb.Address.AsObject,
  }
}

export class DposDelegatorClaimsRewardsEvent extends jspb.Message {
  hasDelegator(): boolean;
  clearDelegator(): void;
  getDelegator(): proto_loom_pb.Address | undefined;
  setDelegator(value?: proto_loom_pb.Address): void;

  clearValidatorsList(): void;
  getValidatorsList(): Array<proto_loom_pb.Address>;
  setValidatorsList(value: Array<proto_loom_pb.Address>): void;
  addValidators(value?: proto_loom_pb.Address, index?: number): proto_loom_pb.Address;

  clearAmountsList(): void;
  getAmountsList(): Array<proto_loom_pb.BigUInt>;
  setAmountsList(value: Array<proto_loom_pb.BigUInt>): void;
  addAmounts(value?: proto_loom_pb.BigUInt, index?: number): proto_loom_pb.BigUInt;

  hasTotalRewardsClaimed(): boolean;
  clearTotalRewardsClaimed(): void;
  getTotalRewardsClaimed(): proto_loom_pb.BigUInt | undefined;
  setTotalRewardsClaimed(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DposDelegatorClaimsRewardsEvent.AsObject;
  static toObject(includeInstance: boolean, msg: DposDelegatorClaimsRewardsEvent): DposDelegatorClaimsRewardsEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DposDelegatorClaimsRewardsEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DposDelegatorClaimsRewardsEvent;
  static deserializeBinaryFromReader(message: DposDelegatorClaimsRewardsEvent, reader: jspb.BinaryReader): DposDelegatorClaimsRewardsEvent;
}

export namespace DposDelegatorClaimsRewardsEvent {
  export type AsObject = {
    delegator?: proto_loom_pb.Address.AsObject,
    validatorsList: Array<proto_loom_pb.Address.AsObject>,
    amountsList: Array<proto_loom_pb.BigUInt.AsObject>,
    totalRewardsClaimed?: proto_loom_pb.BigUInt.AsObject,
  }
}

export enum LocktimeTier {
  TIER_ZERO = 0,
  TIER_ONE = 1,
  TIER_TWO = 2,
  TIER_THREE = 3,
}

export enum DelegationState {
  BONDING = 0,
  BONDED = 1,
  UNBONDING = 2,
  REDELEGATING = 3,
}

export enum CandidateState {
  REGISTERED = 0,
  UNREGISTERING = 1,
  ABOUT_TO_CHANGE_FEE = 2,
  CHANGING_FEE = 3,
}

