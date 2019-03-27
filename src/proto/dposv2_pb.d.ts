// package: 
// file: proto/dposv2.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class Validator extends jspb.Message {
  getPubKey(): Uint8Array | string;
  getPubKey_asU8(): Uint8Array;
  getPubKey_asB64(): string;
  setPubKey(value: Uint8Array | string): void;

  getPower(): number;
  setPower(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Validator.AsObject;
  static toObject(includeInstance: boolean, msg: Validator): Validator.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Validator, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Validator;
  static deserializeBinaryFromReader(message: Validator, reader: jspb.BinaryReader): Validator;
}

export namespace Validator {
  export type AsObject = {
    pubKey: Uint8Array | string,
    power: number,
  }
}

export class ParamsV2 extends jspb.Message {
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

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParamsV2.AsObject;
  static toObject(includeInstance: boolean, msg: ParamsV2): ParamsV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParamsV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParamsV2;
  static deserializeBinaryFromReader(message: ParamsV2, reader: jspb.BinaryReader): ParamsV2;
}

export namespace ParamsV2 {
  export type AsObject = {
    validatorCount: number,
    electionCycleLength: number,
    coinContractAddress?: proto_loom_pb.Address.AsObject,
    oracleAddress?: proto_loom_pb.Address.AsObject,
    maxYearlyReward?: proto_loom_pb.BigUInt.AsObject,
    registrationRequirement?: proto_loom_pb.BigUInt.AsObject,
    crashSlashingPercentage?: proto_loom_pb.BigUInt.AsObject,
    byzantineSlashingPercentage?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class StateV2 extends jspb.Message {
  hasParams(): boolean;
  clearParams(): void;
  getParams(): ParamsV2 | undefined;
  setParams(value?: ParamsV2): void;

  clearValidatorsList(): void;
  getValidatorsList(): Array<Validator>;
  setValidatorsList(value: Array<Validator>): void;
  addValidators(value?: Validator, index?: number): Validator;

  getLastElectionTime(): number;
  setLastElectionTime(value: number): void;

  hasTotalValidatorDelegations(): boolean;
  clearTotalValidatorDelegations(): void;
  getTotalValidatorDelegations(): proto_loom_pb.BigUInt | undefined;
  setTotalValidatorDelegations(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StateV2.AsObject;
  static toObject(includeInstance: boolean, msg: StateV2): StateV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StateV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StateV2;
  static deserializeBinaryFromReader(message: StateV2, reader: jspb.BinaryReader): StateV2;
}

export namespace StateV2 {
  export type AsObject = {
    params?: ParamsV2.AsObject,
    validatorsList: Array<Validator.AsObject>,
    lastElectionTime: number,
    totalValidatorDelegations?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class ValidatorStatisticV2 extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  getPubKey(): Uint8Array | string;
  getPubKey_asU8(): Uint8Array;
  getPubKey_asB64(): string;
  setPubKey(value: Uint8Array | string): void;

  getUpblockCount(): number;
  setUpblockCount(value: number): void;

  getBlockCount(): number;
  setBlockCount(value: number): void;

  hasSlashPercentage(): boolean;
  clearSlashPercentage(): void;
  getSlashPercentage(): proto_loom_pb.BigUInt | undefined;
  setSlashPercentage(value?: proto_loom_pb.BigUInt): void;

  hasDistributionTotal(): boolean;
  clearDistributionTotal(): void;
  getDistributionTotal(): proto_loom_pb.BigUInt | undefined;
  setDistributionTotal(value?: proto_loom_pb.BigUInt): void;

  hasDelegationTotal(): boolean;
  clearDelegationTotal(): void;
  getDelegationTotal(): proto_loom_pb.BigUInt | undefined;
  setDelegationTotal(value?: proto_loom_pb.BigUInt): void;

  hasWhitelistAmount(): boolean;
  clearWhitelistAmount(): void;
  getWhitelistAmount(): proto_loom_pb.BigUInt | undefined;
  setWhitelistAmount(value?: proto_loom_pb.BigUInt): void;

  getWhitelistLocktime(): number;
  setWhitelistLocktime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidatorStatisticV2.AsObject;
  static toObject(includeInstance: boolean, msg: ValidatorStatisticV2): ValidatorStatisticV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidatorStatisticV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidatorStatisticV2;
  static deserializeBinaryFromReader(message: ValidatorStatisticV2, reader: jspb.BinaryReader): ValidatorStatisticV2;
}

export namespace ValidatorStatisticV2 {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
    pubKey: Uint8Array | string,
    upblockCount: number,
    blockCount: number,
    slashPercentage?: proto_loom_pb.BigUInt.AsObject,
    distributionTotal?: proto_loom_pb.BigUInt.AsObject,
    delegationTotal?: proto_loom_pb.BigUInt.AsObject,
    whitelistAmount?: proto_loom_pb.BigUInt.AsObject,
    whitelistLocktime: number,
  }
}

export class ValidatorStatisticListV2 extends jspb.Message {
  clearStatisticsList(): void;
  getStatisticsList(): Array<ValidatorStatisticV2>;
  setStatisticsList(value: Array<ValidatorStatisticV2>): void;
  addStatistics(value?: ValidatorStatisticV2, index?: number): ValidatorStatisticV2;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidatorStatisticListV2.AsObject;
  static toObject(includeInstance: boolean, msg: ValidatorStatisticListV2): ValidatorStatisticListV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidatorStatisticListV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidatorStatisticListV2;
  static deserializeBinaryFromReader(message: ValidatorStatisticListV2, reader: jspb.BinaryReader): ValidatorStatisticListV2;
}

export namespace ValidatorStatisticListV2 {
  export type AsObject = {
    statisticsList: Array<ValidatorStatisticV2.AsObject>,
  }
}

export class CandidateV2 extends jspb.Message {
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

  getNewfee(): number;
  setNewfee(value: number): void;

  getFeedelaycounter(): number;
  setFeedelaycounter(value: number): void;

  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getWebsite(): string;
  setWebsite(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CandidateV2.AsObject;
  static toObject(includeInstance: boolean, msg: CandidateV2): CandidateV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CandidateV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CandidateV2;
  static deserializeBinaryFromReader(message: CandidateV2, reader: jspb.BinaryReader): CandidateV2;
}

export namespace CandidateV2 {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
    pubKey: Uint8Array | string,
    fee: number,
    newfee: number,
    feedelaycounter: number,
    name: string,
    description: string,
    website: string,
  }
}

export class CandidateListV2 extends jspb.Message {
  clearCandidatesList(): void;
  getCandidatesList(): Array<CandidateV2>;
  setCandidatesList(value: Array<CandidateV2>): void;
  addCandidates(value?: CandidateV2, index?: number): CandidateV2;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CandidateListV2.AsObject;
  static toObject(includeInstance: boolean, msg: CandidateListV2): CandidateListV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CandidateListV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CandidateListV2;
  static deserializeBinaryFromReader(message: CandidateListV2, reader: jspb.BinaryReader): CandidateListV2;
}

export namespace CandidateListV2 {
  export type AsObject = {
    candidatesList: Array<CandidateV2.AsObject>,
  }
}

export class DelegationV2 extends jspb.Message {
  hasValidator(): boolean;
  clearValidator(): void;
  getValidator(): proto_loom_pb.Address | undefined;
  setValidator(value?: proto_loom_pb.Address): void;

  hasDelegator(): boolean;
  clearDelegator(): void;
  getDelegator(): proto_loom_pb.Address | undefined;
  setDelegator(value?: proto_loom_pb.Address): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  hasUpdateAmount(): boolean;
  clearUpdateAmount(): void;
  getUpdateAmount(): proto_loom_pb.BigUInt | undefined;
  setUpdateAmount(value?: proto_loom_pb.BigUInt): void;

  getHeight(): number;
  setHeight(value: number): void;

  getLockTime(): number;
  setLockTime(value: number): void;

  getLocktimeTier(): DelegationV2.LocktimeTier;
  setLocktimeTier(value: DelegationV2.LocktimeTier): void;

  getState(): DelegationV2.DelegationState;
  setState(value: DelegationV2.DelegationState): void;

  hasUpdateValidator(): boolean;
  clearUpdateValidator(): void;
  getUpdateValidator(): proto_loom_pb.Address | undefined;
  setUpdateValidator(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DelegationV2.AsObject;
  static toObject(includeInstance: boolean, msg: DelegationV2): DelegationV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DelegationV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DelegationV2;
  static deserializeBinaryFromReader(message: DelegationV2, reader: jspb.BinaryReader): DelegationV2;
}

export namespace DelegationV2 {
  export type AsObject = {
    validator?: proto_loom_pb.Address.AsObject,
    delegator?: proto_loom_pb.Address.AsObject,
    amount?: proto_loom_pb.BigUInt.AsObject,
    updateAmount?: proto_loom_pb.BigUInt.AsObject,
    height: number,
    lockTime: number,
    locktimeTier: DelegationV2.LocktimeTier,
    state: DelegationV2.DelegationState,
    updateValidator?: proto_loom_pb.Address.AsObject,
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
}

export class DelegationListV2 extends jspb.Message {
  clearDelegationsList(): void;
  getDelegationsList(): Array<DelegationV2>;
  setDelegationsList(value: Array<DelegationV2>): void;
  addDelegations(value?: DelegationV2, index?: number): DelegationV2;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DelegationListV2.AsObject;
  static toObject(includeInstance: boolean, msg: DelegationListV2): DelegationListV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DelegationListV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DelegationListV2;
  static deserializeBinaryFromReader(message: DelegationListV2, reader: jspb.BinaryReader): DelegationListV2;
}

export namespace DelegationListV2 {
  export type AsObject = {
    delegationsList: Array<DelegationV2.AsObject>,
  }
}

export class DistributionV2 extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DistributionV2.AsObject;
  static toObject(includeInstance: boolean, msg: DistributionV2): DistributionV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DistributionV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DistributionV2;
  static deserializeBinaryFromReader(message: DistributionV2, reader: jspb.BinaryReader): DistributionV2;
}

export namespace DistributionV2 {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
    amount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class DistributionListV2 extends jspb.Message {
  clearDistributionsList(): void;
  getDistributionsList(): Array<DistributionV2>;
  setDistributionsList(value: Array<DistributionV2>): void;
  addDistributions(value?: DistributionV2, index?: number): DistributionV2;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DistributionListV2.AsObject;
  static toObject(includeInstance: boolean, msg: DistributionListV2): DistributionListV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DistributionListV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DistributionListV2;
  static deserializeBinaryFromReader(message: DistributionListV2, reader: jspb.BinaryReader): DistributionListV2;
}

export namespace DistributionListV2 {
  export type AsObject = {
    distributionsList: Array<DistributionV2.AsObject>,
  }
}

export class DPOSInitRequestV2 extends jspb.Message {
  hasParams(): boolean;
  clearParams(): void;
  getParams(): ParamsV2 | undefined;
  setParams(value?: ParamsV2): void;

  clearValidatorsList(): void;
  getValidatorsList(): Array<Validator>;
  setValidatorsList(value: Array<Validator>): void;
  addValidators(value?: Validator, index?: number): Validator;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DPOSInitRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: DPOSInitRequestV2): DPOSInitRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DPOSInitRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DPOSInitRequestV2;
  static deserializeBinaryFromReader(message: DPOSInitRequestV2, reader: jspb.BinaryReader): DPOSInitRequestV2;
}

export namespace DPOSInitRequestV2 {
  export type AsObject = {
    params?: ParamsV2.AsObject,
    validatorsList: Array<Validator.AsObject>,
  }
}

export class DelegateRequestV2 extends jspb.Message {
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
  toObject(includeInstance?: boolean): DelegateRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: DelegateRequestV2): DelegateRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DelegateRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DelegateRequestV2;
  static deserializeBinaryFromReader(message: DelegateRequestV2, reader: jspb.BinaryReader): DelegateRequestV2;
}

export namespace DelegateRequestV2 {
  export type AsObject = {
    validatorAddress?: proto_loom_pb.Address.AsObject,
    amount?: proto_loom_pb.BigUInt.AsObject,
    locktimeTier: number,
    referrer: string,
  }
}

export class RedelegateRequestV2 extends jspb.Message {
  hasValidatorAddress(): boolean;
  clearValidatorAddress(): void;
  getValidatorAddress(): proto_loom_pb.Address | undefined;
  setValidatorAddress(value?: proto_loom_pb.Address): void;

  hasFormerValidatorAddress(): boolean;
  clearFormerValidatorAddress(): void;
  getFormerValidatorAddress(): proto_loom_pb.Address | undefined;
  setFormerValidatorAddress(value?: proto_loom_pb.Address): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  getReferrer(): string;
  setReferrer(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RedelegateRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: RedelegateRequestV2): RedelegateRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RedelegateRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RedelegateRequestV2;
  static deserializeBinaryFromReader(message: RedelegateRequestV2, reader: jspb.BinaryReader): RedelegateRequestV2;
}

export namespace RedelegateRequestV2 {
  export type AsObject = {
    validatorAddress?: proto_loom_pb.Address.AsObject,
    formerValidatorAddress?: proto_loom_pb.Address.AsObject,
    amount?: proto_loom_pb.BigUInt.AsObject,
    referrer: string,
  }
}

export class CheckDelegationRequestV2 extends jspb.Message {
  hasValidatorAddress(): boolean;
  clearValidatorAddress(): void;
  getValidatorAddress(): proto_loom_pb.Address | undefined;
  setValidatorAddress(value?: proto_loom_pb.Address): void;

  hasDelegatorAddress(): boolean;
  clearDelegatorAddress(): void;
  getDelegatorAddress(): proto_loom_pb.Address | undefined;
  setDelegatorAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckDelegationRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: CheckDelegationRequestV2): CheckDelegationRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckDelegationRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckDelegationRequestV2;
  static deserializeBinaryFromReader(message: CheckDelegationRequestV2, reader: jspb.BinaryReader): CheckDelegationRequestV2;
}

export namespace CheckDelegationRequestV2 {
  export type AsObject = {
    validatorAddress?: proto_loom_pb.Address.AsObject,
    delegatorAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class CheckDelegationResponseV2 extends jspb.Message {
  hasDelegation(): boolean;
  clearDelegation(): void;
  getDelegation(): DelegationV2 | undefined;
  setDelegation(value?: DelegationV2): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckDelegationResponseV2.AsObject;
  static toObject(includeInstance: boolean, msg: CheckDelegationResponseV2): CheckDelegationResponseV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckDelegationResponseV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckDelegationResponseV2;
  static deserializeBinaryFromReader(message: CheckDelegationResponseV2, reader: jspb.BinaryReader): CheckDelegationResponseV2;
}

export namespace CheckDelegationResponseV2 {
  export type AsObject = {
    delegation?: DelegationV2.AsObject,
  }
}

export class ClaimDistributionRequestV2 extends jspb.Message {
  hasWithdrawalAddress(): boolean;
  clearWithdrawalAddress(): void;
  getWithdrawalAddress(): proto_loom_pb.Address | undefined;
  setWithdrawalAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimDistributionRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimDistributionRequestV2): ClaimDistributionRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClaimDistributionRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimDistributionRequestV2;
  static deserializeBinaryFromReader(message: ClaimDistributionRequestV2, reader: jspb.BinaryReader): ClaimDistributionRequestV2;
}

export namespace ClaimDistributionRequestV2 {
  export type AsObject = {
    withdrawalAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class ClaimDistributionResponseV2 extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimDistributionResponseV2.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimDistributionResponseV2): ClaimDistributionResponseV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClaimDistributionResponseV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimDistributionResponseV2;
  static deserializeBinaryFromReader(message: ClaimDistributionResponseV2, reader: jspb.BinaryReader): ClaimDistributionResponseV2;
}

export namespace ClaimDistributionResponseV2 {
  export type AsObject = {
    amount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class UnbondRequestV2 extends jspb.Message {
  hasValidatorAddress(): boolean;
  clearValidatorAddress(): void;
  getValidatorAddress(): proto_loom_pb.Address | undefined;
  setValidatorAddress(value?: proto_loom_pb.Address): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnbondRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: UnbondRequestV2): UnbondRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnbondRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnbondRequestV2;
  static deserializeBinaryFromReader(message: UnbondRequestV2, reader: jspb.BinaryReader): UnbondRequestV2;
}

export namespace UnbondRequestV2 {
  export type AsObject = {
    validatorAddress?: proto_loom_pb.Address.AsObject,
    amount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class WhitelistCandidateRequestV2 extends jspb.Message {
  hasCandidateAddress(): boolean;
  clearCandidateAddress(): void;
  getCandidateAddress(): proto_loom_pb.Address | undefined;
  setCandidateAddress(value?: proto_loom_pb.Address): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  getLockTime(): number;
  setLockTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WhitelistCandidateRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: WhitelistCandidateRequestV2): WhitelistCandidateRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WhitelistCandidateRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WhitelistCandidateRequestV2;
  static deserializeBinaryFromReader(message: WhitelistCandidateRequestV2, reader: jspb.BinaryReader): WhitelistCandidateRequestV2;
}

export namespace WhitelistCandidateRequestV2 {
  export type AsObject = {
    candidateAddress?: proto_loom_pb.Address.AsObject,
    amount?: proto_loom_pb.BigUInt.AsObject,
    lockTime: number,
  }
}

export class RemoveWhitelistedCandidateRequestV2 extends jspb.Message {
  hasCandidateAddress(): boolean;
  clearCandidateAddress(): void;
  getCandidateAddress(): proto_loom_pb.Address | undefined;
  setCandidateAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveWhitelistedCandidateRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveWhitelistedCandidateRequestV2): RemoveWhitelistedCandidateRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveWhitelistedCandidateRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveWhitelistedCandidateRequestV2;
  static deserializeBinaryFromReader(message: RemoveWhitelistedCandidateRequestV2, reader: jspb.BinaryReader): RemoveWhitelistedCandidateRequestV2;
}

export namespace RemoveWhitelistedCandidateRequestV2 {
  export type AsObject = {
    candidateAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class RegisterCandidateRequestV2 extends jspb.Message {
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

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterCandidateRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterCandidateRequestV2): RegisterCandidateRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RegisterCandidateRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterCandidateRequestV2;
  static deserializeBinaryFromReader(message: RegisterCandidateRequestV2, reader: jspb.BinaryReader): RegisterCandidateRequestV2;
}

export namespace RegisterCandidateRequestV2 {
  export type AsObject = {
    pubKey: Uint8Array | string,
    fee: number,
    name: string,
    description: string,
    website: string,
    locktimeTier: number,
  }
}

export class ChangeCandidateFeeRequest extends jspb.Message {
  getFee(): number;
  setFee(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeCandidateFeeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ChangeCandidateFeeRequest): ChangeCandidateFeeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChangeCandidateFeeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChangeCandidateFeeRequest;
  static deserializeBinaryFromReader(message: ChangeCandidateFeeRequest, reader: jspb.BinaryReader): ChangeCandidateFeeRequest;
}

export namespace ChangeCandidateFeeRequest {
  export type AsObject = {
    fee: number,
  }
}

export class UnregisterCandidateRequestV2 extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnregisterCandidateRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: UnregisterCandidateRequestV2): UnregisterCandidateRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnregisterCandidateRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnregisterCandidateRequestV2;
  static deserializeBinaryFromReader(message: UnregisterCandidateRequestV2, reader: jspb.BinaryReader): UnregisterCandidateRequestV2;
}

export namespace UnregisterCandidateRequestV2 {
  export type AsObject = {
  }
}

export class ElectDelegationRequestV2 extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ElectDelegationRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: ElectDelegationRequestV2): ElectDelegationRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ElectDelegationRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ElectDelegationRequestV2;
  static deserializeBinaryFromReader(message: ElectDelegationRequestV2, reader: jspb.BinaryReader): ElectDelegationRequestV2;
}

export namespace ElectDelegationRequestV2 {
  export type AsObject = {
  }
}

export class ListValidatorsRequestV2 extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListValidatorsRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: ListValidatorsRequestV2): ListValidatorsRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListValidatorsRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListValidatorsRequestV2;
  static deserializeBinaryFromReader(message: ListValidatorsRequestV2, reader: jspb.BinaryReader): ListValidatorsRequestV2;
}

export namespace ListValidatorsRequestV2 {
  export type AsObject = {
  }
}

export class ListValidatorsResponseV2 extends jspb.Message {
  clearStatisticsList(): void;
  getStatisticsList(): Array<ValidatorStatisticV2>;
  setStatisticsList(value: Array<ValidatorStatisticV2>): void;
  addStatistics(value?: ValidatorStatisticV2, index?: number): ValidatorStatisticV2;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListValidatorsResponseV2.AsObject;
  static toObject(includeInstance: boolean, msg: ListValidatorsResponseV2): ListValidatorsResponseV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListValidatorsResponseV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListValidatorsResponseV2;
  static deserializeBinaryFromReader(message: ListValidatorsResponseV2, reader: jspb.BinaryReader): ListValidatorsResponseV2;
}

export namespace ListValidatorsResponseV2 {
  export type AsObject = {
    statisticsList: Array<ValidatorStatisticV2.AsObject>,
  }
}

export class ListCandidateRequestV2 extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListCandidateRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: ListCandidateRequestV2): ListCandidateRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListCandidateRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListCandidateRequestV2;
  static deserializeBinaryFromReader(message: ListCandidateRequestV2, reader: jspb.BinaryReader): ListCandidateRequestV2;
}

export namespace ListCandidateRequestV2 {
  export type AsObject = {
  }
}

export class ListCandidateResponseV2 extends jspb.Message {
  clearCandidatesList(): void;
  getCandidatesList(): Array<CandidateV2>;
  setCandidatesList(value: Array<CandidateV2>): void;
  addCandidates(value?: CandidateV2, index?: number): CandidateV2;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListCandidateResponseV2.AsObject;
  static toObject(includeInstance: boolean, msg: ListCandidateResponseV2): ListCandidateResponseV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListCandidateResponseV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListCandidateResponseV2;
  static deserializeBinaryFromReader(message: ListCandidateResponseV2, reader: jspb.BinaryReader): ListCandidateResponseV2;
}

export namespace ListCandidateResponseV2 {
  export type AsObject = {
    candidatesList: Array<CandidateV2.AsObject>,
  }
}

export class SetElectionCycleRequestV2 extends jspb.Message {
  getElectionCycle(): number;
  setElectionCycle(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetElectionCycleRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: SetElectionCycleRequestV2): SetElectionCycleRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetElectionCycleRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetElectionCycleRequestV2;
  static deserializeBinaryFromReader(message: SetElectionCycleRequestV2, reader: jspb.BinaryReader): SetElectionCycleRequestV2;
}

export namespace SetElectionCycleRequestV2 {
  export type AsObject = {
    electionCycle: number,
  }
}

export class SetMaxYearlyRewardRequestV2 extends jspb.Message {
  hasMaxYearlyReward(): boolean;
  clearMaxYearlyReward(): void;
  getMaxYearlyReward(): proto_loom_pb.BigUInt | undefined;
  setMaxYearlyReward(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetMaxYearlyRewardRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: SetMaxYearlyRewardRequestV2): SetMaxYearlyRewardRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetMaxYearlyRewardRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetMaxYearlyRewardRequestV2;
  static deserializeBinaryFromReader(message: SetMaxYearlyRewardRequestV2, reader: jspb.BinaryReader): SetMaxYearlyRewardRequestV2;
}

export namespace SetMaxYearlyRewardRequestV2 {
  export type AsObject = {
    maxYearlyReward?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class SetRegistrationRequirementRequestV2 extends jspb.Message {
  hasRegistrationRequirement(): boolean;
  clearRegistrationRequirement(): void;
  getRegistrationRequirement(): proto_loom_pb.BigUInt | undefined;
  setRegistrationRequirement(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetRegistrationRequirementRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: SetRegistrationRequirementRequestV2): SetRegistrationRequirementRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetRegistrationRequirementRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetRegistrationRequirementRequestV2;
  static deserializeBinaryFromReader(message: SetRegistrationRequirementRequestV2, reader: jspb.BinaryReader): SetRegistrationRequirementRequestV2;
}

export namespace SetRegistrationRequirementRequestV2 {
  export type AsObject = {
    registrationRequirement?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class SetValidatorCountRequestV2 extends jspb.Message {
  getValidatorCount(): number;
  setValidatorCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetValidatorCountRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: SetValidatorCountRequestV2): SetValidatorCountRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetValidatorCountRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetValidatorCountRequestV2;
  static deserializeBinaryFromReader(message: SetValidatorCountRequestV2, reader: jspb.BinaryReader): SetValidatorCountRequestV2;
}

export namespace SetValidatorCountRequestV2 {
  export type AsObject = {
    validatorCount: number,
  }
}

export class SetOracleAddressRequestV2 extends jspb.Message {
  hasOracleAddress(): boolean;
  clearOracleAddress(): void;
  getOracleAddress(): proto_loom_pb.Address | undefined;
  setOracleAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetOracleAddressRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: SetOracleAddressRequestV2): SetOracleAddressRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetOracleAddressRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetOracleAddressRequestV2;
  static deserializeBinaryFromReader(message: SetOracleAddressRequestV2, reader: jspb.BinaryReader): SetOracleAddressRequestV2;
}

export namespace SetOracleAddressRequestV2 {
  export type AsObject = {
    oracleAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class SetSlashingPercentagesRequestV2 extends jspb.Message {
  hasCrashSlashingPercentage(): boolean;
  clearCrashSlashingPercentage(): void;
  getCrashSlashingPercentage(): proto_loom_pb.BigUInt | undefined;
  setCrashSlashingPercentage(value?: proto_loom_pb.BigUInt): void;

  hasByzantineSlashingPercentage(): boolean;
  clearByzantineSlashingPercentage(): void;
  getByzantineSlashingPercentage(): proto_loom_pb.BigUInt | undefined;
  setByzantineSlashingPercentage(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetSlashingPercentagesRequestV2.AsObject;
  static toObject(includeInstance: boolean, msg: SetSlashingPercentagesRequestV2): SetSlashingPercentagesRequestV2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetSlashingPercentagesRequestV2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetSlashingPercentagesRequestV2;
  static deserializeBinaryFromReader(message: SetSlashingPercentagesRequestV2, reader: jspb.BinaryReader): SetSlashingPercentagesRequestV2;
}

export namespace SetSlashingPercentagesRequestV2 {
  export type AsObject = {
    crashSlashingPercentage?: proto_loom_pb.BigUInt.AsObject,
    byzantineSlashingPercentage?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class TotalDelegationRequest extends jspb.Message {
  hasDelegatorAddress(): boolean;
  clearDelegatorAddress(): void;
  getDelegatorAddress(): proto_loom_pb.Address | undefined;
  setDelegatorAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TotalDelegationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TotalDelegationRequest): TotalDelegationRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TotalDelegationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TotalDelegationRequest;
  static deserializeBinaryFromReader(message: TotalDelegationRequest, reader: jspb.BinaryReader): TotalDelegationRequest;
}

export namespace TotalDelegationRequest {
  export type AsObject = {
    delegatorAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class TotalDelegationResponse extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  hasWeightedAmount(): boolean;
  clearWeightedAmount(): void;
  getWeightedAmount(): proto_loom_pb.BigUInt | undefined;
  setWeightedAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TotalDelegationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TotalDelegationResponse): TotalDelegationResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TotalDelegationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TotalDelegationResponse;
  static deserializeBinaryFromReader(message: TotalDelegationResponse, reader: jspb.BinaryReader): TotalDelegationResponse;
}

export namespace TotalDelegationResponse {
  export type AsObject = {
    amount?: proto_loom_pb.BigUInt.AsObject,
    weightedAmount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class CheckDistributionRequest extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckDistributionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CheckDistributionRequest): CheckDistributionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckDistributionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckDistributionRequest;
  static deserializeBinaryFromReader(message: CheckDistributionRequest, reader: jspb.BinaryReader): CheckDistributionRequest;
}

export namespace CheckDistributionRequest {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
  }
}

export class CheckDistributionResponse extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckDistributionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CheckDistributionResponse): CheckDistributionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckDistributionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckDistributionResponse;
  static deserializeBinaryFromReader(message: CheckDistributionResponse, reader: jspb.BinaryReader): CheckDistributionResponse;
}

export namespace CheckDistributionResponse {
  export type AsObject = {
    amount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class TimeUntilElectionRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeUntilElectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TimeUntilElectionRequest): TimeUntilElectionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeUntilElectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeUntilElectionRequest;
  static deserializeBinaryFromReader(message: TimeUntilElectionRequest, reader: jspb.BinaryReader): TimeUntilElectionRequest;
}

export namespace TimeUntilElectionRequest {
  export type AsObject = {
  }
}

export class TimeUntilElectionResponse extends jspb.Message {
  getTimeUntilElection(): number;
  setTimeUntilElection(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeUntilElectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TimeUntilElectionResponse): TimeUntilElectionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeUntilElectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeUntilElectionResponse;
  static deserializeBinaryFromReader(message: TimeUntilElectionResponse, reader: jspb.BinaryReader): TimeUntilElectionResponse;
}

export namespace TimeUntilElectionResponse {
  export type AsObject = {
    timeUntilElection: number,
  }
}

export class ListDelegationsRequest extends jspb.Message {
  hasCandidate(): boolean;
  clearCandidate(): void;
  getCandidate(): proto_loom_pb.Address | undefined;
  setCandidate(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDelegationsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListDelegationsRequest): ListDelegationsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListDelegationsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDelegationsRequest;
  static deserializeBinaryFromReader(message: ListDelegationsRequest, reader: jspb.BinaryReader): ListDelegationsRequest;
}

export namespace ListDelegationsRequest {
  export type AsObject = {
    candidate?: proto_loom_pb.Address.AsObject,
  }
}

export class ListDelegationsResponse extends jspb.Message {
  clearDelegationsList(): void;
  getDelegationsList(): Array<DelegationV2>;
  setDelegationsList(value: Array<DelegationV2>): void;
  addDelegations(value?: DelegationV2, index?: number): DelegationV2;

  hasDelegationTotal(): boolean;
  clearDelegationTotal(): void;
  getDelegationTotal(): proto_loom_pb.BigUInt | undefined;
  setDelegationTotal(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDelegationsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListDelegationsResponse): ListDelegationsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListDelegationsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDelegationsResponse;
  static deserializeBinaryFromReader(message: ListDelegationsResponse, reader: jspb.BinaryReader): ListDelegationsResponse;
}

export namespace ListDelegationsResponse {
  export type AsObject = {
    delegationsList: Array<DelegationV2.AsObject>,
    delegationTotal?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class ListAllDelegationsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAllDelegationsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListAllDelegationsRequest): ListAllDelegationsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListAllDelegationsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAllDelegationsRequest;
  static deserializeBinaryFromReader(message: ListAllDelegationsRequest, reader: jspb.BinaryReader): ListAllDelegationsRequest;
}

export namespace ListAllDelegationsRequest {
  export type AsObject = {
  }
}

export class ListAllDelegationsResponse extends jspb.Message {
  clearListresponsesList(): void;
  getListresponsesList(): Array<ListDelegationsResponse>;
  setListresponsesList(value: Array<ListDelegationsResponse>): void;
  addListresponses(value?: ListDelegationsResponse, index?: number): ListDelegationsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAllDelegationsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListAllDelegationsResponse): ListAllDelegationsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListAllDelegationsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAllDelegationsResponse;
  static deserializeBinaryFromReader(message: ListAllDelegationsResponse, reader: jspb.BinaryReader): ListAllDelegationsResponse;
}

export namespace ListAllDelegationsResponse {
  export type AsObject = {
    listresponsesList: Array<ListDelegationsResponse.AsObject>,
  }
}

export class CheckAllDelegationsRequest extends jspb.Message {
  hasDelegatorAddress(): boolean;
  clearDelegatorAddress(): void;
  getDelegatorAddress(): proto_loom_pb.Address | undefined;
  setDelegatorAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckAllDelegationsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CheckAllDelegationsRequest): CheckAllDelegationsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckAllDelegationsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckAllDelegationsRequest;
  static deserializeBinaryFromReader(message: CheckAllDelegationsRequest, reader: jspb.BinaryReader): CheckAllDelegationsRequest;
}

export namespace CheckAllDelegationsRequest {
  export type AsObject = {
    delegatorAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class CheckAllDelegationsResponse extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  hasWeightedAmount(): boolean;
  clearWeightedAmount(): void;
  getWeightedAmount(): proto_loom_pb.BigUInt | undefined;
  setWeightedAmount(value?: proto_loom_pb.BigUInt): void;

  clearDelegationsList(): void;
  getDelegationsList(): Array<DelegationV2>;
  setDelegationsList(value: Array<DelegationV2>): void;
  addDelegations(value?: DelegationV2, index?: number): DelegationV2;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckAllDelegationsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CheckAllDelegationsResponse): CheckAllDelegationsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckAllDelegationsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckAllDelegationsResponse;
  static deserializeBinaryFromReader(message: CheckAllDelegationsResponse, reader: jspb.BinaryReader): CheckAllDelegationsResponse;
}

export namespace CheckAllDelegationsResponse {
  export type AsObject = {
    amount?: proto_loom_pb.BigUInt.AsObject,
    weightedAmount?: proto_loom_pb.BigUInt.AsObject,
    delegationsList: Array<DelegationV2.AsObject>,
  }
}

