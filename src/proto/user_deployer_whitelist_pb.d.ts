// package: 
// file: proto/user_deployer_whitelist.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class Tier extends jspb.Message {
  getTierId(): TierID;
  setTierId(value: TierID): void;

  hasFee(): boolean;
  clearFee(): void;
  getFee(): proto_loom_pb.BigUInt | undefined;
  setFee(value?: proto_loom_pb.BigUInt): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Tier.AsObject;
  static toObject(includeInstance: boolean, msg: Tier): Tier.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Tier, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Tier;
  static deserializeBinaryFromReader(message: Tier, reader: jspb.BinaryReader): Tier;
}

export namespace Tier {
  export type AsObject = {
    tierId: TierID,
    fee?: proto_loom_pb.BigUInt.AsObject,
    name: string,
  }
}

export class TierInfo extends jspb.Message {
  getTierId(): TierID;
  setTierId(value: TierID): void;

  getFee(): number;
  setFee(value: number): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TierInfo.AsObject;
  static toObject(includeInstance: boolean, msg: TierInfo): TierInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TierInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TierInfo;
  static deserializeBinaryFromReader(message: TierInfo, reader: jspb.BinaryReader): TierInfo;
}

export namespace TierInfo {
  export type AsObject = {
    tierId: TierID,
    fee: number,
    name: string,
  }
}

export class InitRequest extends jspb.Message {
  hasOwner(): boolean;
  clearOwner(): void;
  getOwner(): proto_loom_pb.Address | undefined;
  setOwner(value?: proto_loom_pb.Address): void;

  clearTierInfoList(): void;
  getTierInfoList(): Array<TierInfo>;
  setTierInfoList(value: Array<TierInfo>): void;
  addTierInfo(value?: TierInfo, index?: number): TierInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InitRequest): InitRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InitRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitRequest;
  static deserializeBinaryFromReader(message: InitRequest, reader: jspb.BinaryReader): InitRequest;
}

export namespace InitRequest {
  export type AsObject = {
    owner?: proto_loom_pb.Address.AsObject,
    tierInfoList: Array<TierInfo.AsObject>,
  }
}

export class DeployerContract extends jspb.Message {
  hasContractAddress(): boolean;
  clearContractAddress(): void;
  getContractAddress(): proto_loom_pb.Address | undefined;
  setContractAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeployerContract.AsObject;
  static toObject(includeInstance: boolean, msg: DeployerContract): DeployerContract.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeployerContract, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeployerContract;
  static deserializeBinaryFromReader(message: DeployerContract, reader: jspb.BinaryReader): DeployerContract;
}

export namespace DeployerContract {
  export type AsObject = {
    contractAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class WhitelistUserDeployerRequest extends jspb.Message {
  hasDeployerAddr(): boolean;
  clearDeployerAddr(): void;
  getDeployerAddr(): proto_loom_pb.Address | undefined;
  setDeployerAddr(value?: proto_loom_pb.Address): void;

  getTierId(): TierID;
  setTierId(value: TierID): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WhitelistUserDeployerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WhitelistUserDeployerRequest): WhitelistUserDeployerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WhitelistUserDeployerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WhitelistUserDeployerRequest;
  static deserializeBinaryFromReader(message: WhitelistUserDeployerRequest, reader: jspb.BinaryReader): WhitelistUserDeployerRequest;
}

export namespace WhitelistUserDeployerRequest {
  export type AsObject = {
    deployerAddr?: proto_loom_pb.Address.AsObject,
    tierId: TierID,
  }
}

export class UserState extends jspb.Message {
  hasUserAddr(): boolean;
  clearUserAddr(): void;
  getUserAddr(): proto_loom_pb.Address | undefined;
  setUserAddr(value?: proto_loom_pb.Address): void;

  clearDeployersList(): void;
  getDeployersList(): Array<proto_loom_pb.Address>;
  setDeployersList(value: Array<proto_loom_pb.Address>): void;
  addDeployers(value?: proto_loom_pb.Address, index?: number): proto_loom_pb.Address;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserState.AsObject;
  static toObject(includeInstance: boolean, msg: UserState): UserState.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserState;
  static deserializeBinaryFromReader(message: UserState, reader: jspb.BinaryReader): UserState;
}

export namespace UserState {
  export type AsObject = {
    userAddr?: proto_loom_pb.Address.AsObject,
    deployersList: Array<proto_loom_pb.Address.AsObject>,
  }
}

export class UserDeployerState extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  clearContractsList(): void;
  getContractsList(): Array<DeployerContract>;
  setContractsList(value: Array<DeployerContract>): void;
  addContracts(value?: DeployerContract, index?: number): DeployerContract;

  getTierId(): TierID;
  setTierId(value: TierID): void;

  getInactive(): boolean;
  setInactive(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserDeployerState.AsObject;
  static toObject(includeInstance: boolean, msg: UserDeployerState): UserDeployerState.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserDeployerState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserDeployerState;
  static deserializeBinaryFromReader(message: UserDeployerState, reader: jspb.BinaryReader): UserDeployerState;
}

export namespace UserDeployerState {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
    contractsList: Array<DeployerContract.AsObject>,
    tierId: TierID,
    inactive: boolean,
  }
}

export class GetUserDeployersRequest extends jspb.Message {
  hasUserAddr(): boolean;
  clearUserAddr(): void;
  getUserAddr(): proto_loom_pb.Address | undefined;
  setUserAddr(value?: proto_loom_pb.Address): void;

  getIncludeInactive(): boolean;
  setIncludeInactive(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserDeployersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserDeployersRequest): GetUserDeployersRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetUserDeployersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserDeployersRequest;
  static deserializeBinaryFromReader(message: GetUserDeployersRequest, reader: jspb.BinaryReader): GetUserDeployersRequest;
}

export namespace GetUserDeployersRequest {
  export type AsObject = {
    userAddr?: proto_loom_pb.Address.AsObject,
    includeInactive: boolean,
  }
}

export class GetUserDeployersResponse extends jspb.Message {
  clearDeployersList(): void;
  getDeployersList(): Array<UserDeployerState>;
  setDeployersList(value: Array<UserDeployerState>): void;
  addDeployers(value?: UserDeployerState, index?: number): UserDeployerState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserDeployersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserDeployersResponse): GetUserDeployersResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetUserDeployersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserDeployersResponse;
  static deserializeBinaryFromReader(message: GetUserDeployersResponse, reader: jspb.BinaryReader): GetUserDeployersResponse;
}

export namespace GetUserDeployersResponse {
  export type AsObject = {
    deployersList: Array<UserDeployerState.AsObject>,
  }
}

export class GetDeployedContractsRequest extends jspb.Message {
  hasDeployerAddr(): boolean;
  clearDeployerAddr(): void;
  getDeployerAddr(): proto_loom_pb.Address | undefined;
  setDeployerAddr(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDeployedContractsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDeployedContractsRequest): GetDeployedContractsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetDeployedContractsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDeployedContractsRequest;
  static deserializeBinaryFromReader(message: GetDeployedContractsRequest, reader: jspb.BinaryReader): GetDeployedContractsRequest;
}

export namespace GetDeployedContractsRequest {
  export type AsObject = {
    deployerAddr?: proto_loom_pb.Address.AsObject,
  }
}

export class GetDeployedContractsResponse extends jspb.Message {
  clearContractAddressesList(): void;
  getContractAddressesList(): Array<DeployerContract>;
  setContractAddressesList(value: Array<DeployerContract>): void;
  addContractAddresses(value?: DeployerContract, index?: number): DeployerContract;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDeployedContractsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetDeployedContractsResponse): GetDeployedContractsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetDeployedContractsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDeployedContractsResponse;
  static deserializeBinaryFromReader(message: GetDeployedContractsResponse, reader: jspb.BinaryReader): GetDeployedContractsResponse;
}

export namespace GetDeployedContractsResponse {
  export type AsObject = {
    contractAddressesList: Array<DeployerContract.AsObject>,
  }
}

export class GetTierInfoRequest extends jspb.Message {
  getId(): TierID;
  setId(value: TierID): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTierInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTierInfoRequest): GetTierInfoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTierInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTierInfoRequest;
  static deserializeBinaryFromReader(message: GetTierInfoRequest, reader: jspb.BinaryReader): GetTierInfoRequest;
}

export namespace GetTierInfoRequest {
  export type AsObject = {
    id: TierID,
  }
}

export class GetTierInfoResponse extends jspb.Message {
  hasTier(): boolean;
  clearTier(): void;
  getTier(): Tier | undefined;
  setTier(value?: Tier): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTierInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTierInfoResponse): GetTierInfoResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTierInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTierInfoResponse;
  static deserializeBinaryFromReader(message: GetTierInfoResponse, reader: jspb.BinaryReader): GetTierInfoResponse;
}

export namespace GetTierInfoResponse {
  export type AsObject = {
    tier?: Tier.AsObject,
  }
}

export class SetTierInfoRequest extends jspb.Message {
  getId(): TierID;
  setId(value: TierID): void;

  hasFee(): boolean;
  clearFee(): void;
  getFee(): proto_loom_pb.BigUInt | undefined;
  setFee(value?: proto_loom_pb.BigUInt): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetTierInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetTierInfoRequest): SetTierInfoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetTierInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetTierInfoRequest;
  static deserializeBinaryFromReader(message: SetTierInfoRequest, reader: jspb.BinaryReader): SetTierInfoRequest;
}

export namespace SetTierInfoRequest {
  export type AsObject = {
    id: TierID,
    fee?: proto_loom_pb.BigUInt.AsObject,
    name: string,
  }
}

export class RemoveUserDeployerRequest extends jspb.Message {
  hasDeployerAddr(): boolean;
  clearDeployerAddr(): void;
  getDeployerAddr(): proto_loom_pb.Address | undefined;
  setDeployerAddr(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveUserDeployerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveUserDeployerRequest): RemoveUserDeployerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveUserDeployerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveUserDeployerRequest;
  static deserializeBinaryFromReader(message: RemoveUserDeployerRequest, reader: jspb.BinaryReader): RemoveUserDeployerRequest;
}

export namespace RemoveUserDeployerRequest {
  export type AsObject = {
    deployerAddr?: proto_loom_pb.Address.AsObject,
  }
}

export enum TierID {
  DEFAULT = 0,
}

