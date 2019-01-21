// package: karma
// file: proto/karma.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class KarmaInitRequest extends jspb.Message {
  hasOracle(): boolean;
  clearOracle(): void;
  getOracle(): proto_loom_pb.Address | undefined;
  setOracle(value?: proto_loom_pb.Address): void;

  clearSourcesList(): void;
  getSourcesList(): Array<KarmaSourceReward>;
  setSourcesList(value: Array<KarmaSourceReward>): void;
  addSources(value?: KarmaSourceReward, index?: number): KarmaSourceReward;

  clearUsersList(): void;
  getUsersList(): Array<KarmaAddressSource>;
  setUsersList(value: Array<KarmaAddressSource>): void;
  addUsers(value?: KarmaAddressSource, index?: number): KarmaAddressSource;

  hasUpkeep(): boolean;
  clearUpkeep(): void;
  getUpkeep(): KarmaUpkeepParams | undefined;
  setUpkeep(value?: KarmaUpkeepParams): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KarmaInitRequest.AsObject;
  static toObject(includeInstance: boolean, msg: KarmaInitRequest): KarmaInitRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KarmaInitRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KarmaInitRequest;
  static deserializeBinaryFromReader(message: KarmaInitRequest, reader: jspb.BinaryReader): KarmaInitRequest;
}

export namespace KarmaInitRequest {
  export type AsObject = {
    oracle?: proto_loom_pb.Address.AsObject,
    sourcesList: Array<KarmaSourceReward.AsObject>,
    usersList: Array<KarmaAddressSource.AsObject>,
    upkeep?: KarmaUpkeepParams.AsObject,
  }
}

export class KarmaSources extends jspb.Message {
  clearSourcesList(): void;
  getSourcesList(): Array<KarmaSourceReward>;
  setSourcesList(value: Array<KarmaSourceReward>): void;
  addSources(value?: KarmaSourceReward, index?: number): KarmaSourceReward;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KarmaSources.AsObject;
  static toObject(includeInstance: boolean, msg: KarmaSources): KarmaSources.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KarmaSources, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KarmaSources;
  static deserializeBinaryFromReader(message: KarmaSources, reader: jspb.BinaryReader): KarmaSources;
}

export namespace KarmaSources {
  export type AsObject = {
    sourcesList: Array<KarmaSourceReward.AsObject>,
  }
}

export class KarmaNewOracle extends jspb.Message {
  hasNewOracle(): boolean;
  clearNewOracle(): void;
  getNewOracle(): proto_loom_pb.Address | undefined;
  setNewOracle(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KarmaNewOracle.AsObject;
  static toObject(includeInstance: boolean, msg: KarmaNewOracle): KarmaNewOracle.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KarmaNewOracle, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KarmaNewOracle;
  static deserializeBinaryFromReader(message: KarmaNewOracle, reader: jspb.BinaryReader): KarmaNewOracle;
}

export namespace KarmaNewOracle {
  export type AsObject = {
    newOracle?: proto_loom_pb.Address.AsObject,
  }
}

export class KarmaUserTarget extends jspb.Message {
  hasUser(): boolean;
  clearUser(): void;
  getUser(): proto_loom_pb.Address | undefined;
  setUser(value?: proto_loom_pb.Address): void;

  getTarget(): KarmaSourceTarget;
  setTarget(value: KarmaSourceTarget): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KarmaUserTarget.AsObject;
  static toObject(includeInstance: boolean, msg: KarmaUserTarget): KarmaUserTarget.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KarmaUserTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KarmaUserTarget;
  static deserializeBinaryFromReader(message: KarmaUserTarget, reader: jspb.BinaryReader): KarmaUserTarget;
}

export namespace KarmaUserTarget {
  export type AsObject = {
    user?: proto_loom_pb.Address.AsObject,
    target: KarmaSourceTarget,
  }
}

export class KarmaUserAmount extends jspb.Message {
  hasUser(): boolean;
  clearUser(): void;
  getUser(): proto_loom_pb.Address | undefined;
  setUser(value?: proto_loom_pb.Address): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KarmaUserAmount.AsObject;
  static toObject(includeInstance: boolean, msg: KarmaUserAmount): KarmaUserAmount.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KarmaUserAmount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KarmaUserAmount;
  static deserializeBinaryFromReader(message: KarmaUserAmount, reader: jspb.BinaryReader): KarmaUserAmount;
}

export namespace KarmaUserAmount {
  export type AsObject = {
    user?: proto_loom_pb.Address.AsObject,
    amount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class KarmaSourceReward extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getReward(): number;
  setReward(value: number): void;

  getTarget(): KarmaSourceTarget;
  setTarget(value: KarmaSourceTarget): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KarmaSourceReward.AsObject;
  static toObject(includeInstance: boolean, msg: KarmaSourceReward): KarmaSourceReward.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KarmaSourceReward, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KarmaSourceReward;
  static deserializeBinaryFromReader(message: KarmaSourceReward, reader: jspb.BinaryReader): KarmaSourceReward;
}

export namespace KarmaSourceReward {
  export type AsObject = {
    name: string,
    reward: number,
    target: KarmaSourceTarget,
  }
}

export class KarmaSource extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  hasCount(): boolean;
  clearCount(): void;
  getCount(): proto_loom_pb.BigUInt | undefined;
  setCount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KarmaSource.AsObject;
  static toObject(includeInstance: boolean, msg: KarmaSource): KarmaSource.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KarmaSource, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KarmaSource;
  static deserializeBinaryFromReader(message: KarmaSource, reader: jspb.BinaryReader): KarmaSource;
}

export namespace KarmaSource {
  export type AsObject = {
    name: string,
    count?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class KarmaUpkeepParams extends jspb.Message {
  getCost(): number;
  setCost(value: number): void;

  getPeriod(): number;
  setPeriod(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KarmaUpkeepParams.AsObject;
  static toObject(includeInstance: boolean, msg: KarmaUpkeepParams): KarmaUpkeepParams.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KarmaUpkeepParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KarmaUpkeepParams;
  static deserializeBinaryFromReader(message: KarmaUpkeepParams, reader: jspb.BinaryReader): KarmaUpkeepParams;
}

export namespace KarmaUpkeepParams {
  export type AsObject = {
    cost: number,
    period: number,
  }
}

export class KarmaAddressSource extends jspb.Message {
  hasUser(): boolean;
  clearUser(): void;
  getUser(): proto_loom_pb.Address | undefined;
  setUser(value?: proto_loom_pb.Address): void;

  clearSourcesList(): void;
  getSourcesList(): Array<KarmaSource>;
  setSourcesList(value: Array<KarmaSource>): void;
  addSources(value?: KarmaSource, index?: number): KarmaSource;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KarmaAddressSource.AsObject;
  static toObject(includeInstance: boolean, msg: KarmaAddressSource): KarmaAddressSource.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KarmaAddressSource, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KarmaAddressSource;
  static deserializeBinaryFromReader(message: KarmaAddressSource, reader: jspb.BinaryReader): KarmaAddressSource;
}

export namespace KarmaAddressSource {
  export type AsObject = {
    user?: proto_loom_pb.Address.AsObject,
    sourcesList: Array<KarmaSource.AsObject>,
  }
}

export class KarmaState extends jspb.Message {
  clearSourceStatesList(): void;
  getSourceStatesList(): Array<KarmaSource>;
  setSourceStatesList(value: Array<KarmaSource>): void;
  addSourceStates(value?: KarmaSource, index?: number): KarmaSource;

  hasDeployKarmaTotal(): boolean;
  clearDeployKarmaTotal(): void;
  getDeployKarmaTotal(): proto_loom_pb.BigUInt | undefined;
  setDeployKarmaTotal(value?: proto_loom_pb.BigUInt): void;

  hasCallKarmaTotal(): boolean;
  clearCallKarmaTotal(): void;
  getCallKarmaTotal(): proto_loom_pb.BigUInt | undefined;
  setCallKarmaTotal(value?: proto_loom_pb.BigUInt): void;

  getLastUpdateTime(): number;
  setLastUpdateTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KarmaState.AsObject;
  static toObject(includeInstance: boolean, msg: KarmaState): KarmaState.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KarmaState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KarmaState;
  static deserializeBinaryFromReader(message: KarmaState, reader: jspb.BinaryReader): KarmaState;
}

export namespace KarmaState {
  export type AsObject = {
    sourceStatesList: Array<KarmaSource.AsObject>,
    deployKarmaTotal?: proto_loom_pb.BigUInt.AsObject,
    callKarmaTotal?: proto_loom_pb.BigUInt.AsObject,
    lastUpdateTime: number,
  }
}

export class KarmaStateUser extends jspb.Message {
  clearSourceStatesList(): void;
  getSourceStatesList(): Array<KarmaSource>;
  setSourceStatesList(value: Array<KarmaSource>): void;
  addSourceStates(value?: KarmaSource, index?: number): KarmaSource;

  hasUser(): boolean;
  clearUser(): void;
  getUser(): proto_loom_pb.Address | undefined;
  setUser(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KarmaStateUser.AsObject;
  static toObject(includeInstance: boolean, msg: KarmaStateUser): KarmaStateUser.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KarmaStateUser, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KarmaStateUser;
  static deserializeBinaryFromReader(message: KarmaStateUser, reader: jspb.BinaryReader): KarmaStateUser;
}

export namespace KarmaStateUser {
  export type AsObject = {
    sourceStatesList: Array<KarmaSource.AsObject>,
    user?: proto_loom_pb.Address.AsObject,
  }
}

export class KarmaStateKeyUser extends jspb.Message {
  clearStateKeysList(): void;
  getStateKeysList(): Array<string>;
  setStateKeysList(value: Array<string>): void;
  addStateKeys(value: string, index?: number): string;

  hasUser(): boolean;
  clearUser(): void;
  getUser(): proto_loom_pb.Address | undefined;
  setUser(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KarmaStateKeyUser.AsObject;
  static toObject(includeInstance: boolean, msg: KarmaStateKeyUser): KarmaStateKeyUser.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KarmaStateKeyUser, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KarmaStateKeyUser;
  static deserializeBinaryFromReader(message: KarmaStateKeyUser, reader: jspb.BinaryReader): KarmaStateKeyUser;
}

export namespace KarmaStateKeyUser {
  export type AsObject = {
    stateKeysList: Array<string>,
    user?: proto_loom_pb.Address.AsObject,
  }
}

export class KarmaTotal extends jspb.Message {
  hasCount(): boolean;
  clearCount(): void;
  getCount(): proto_loom_pb.BigUInt | undefined;
  setCount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KarmaTotal.AsObject;
  static toObject(includeInstance: boolean, msg: KarmaTotal): KarmaTotal.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KarmaTotal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KarmaTotal;
  static deserializeBinaryFromReader(message: KarmaTotal, reader: jspb.BinaryReader): KarmaTotal;
}

export namespace KarmaTotal {
  export type AsObject = {
    count?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class ContractRecord extends jspb.Message {
  hasOwner(): boolean;
  clearOwner(): void;
  getOwner(): proto_loom_pb.Address | undefined;
  setOwner(value?: proto_loom_pb.Address): void;

  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  getCreationBlock(): number;
  setCreationBlock(value: number): void;

  getNonce(): number;
  setNonce(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContractRecord.AsObject;
  static toObject(includeInstance: boolean, msg: ContractRecord): ContractRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ContractRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContractRecord;
  static deserializeBinaryFromReader(message: ContractRecord, reader: jspb.BinaryReader): ContractRecord;
}

export namespace ContractRecord {
  export type AsObject = {
    owner?: proto_loom_pb.Address.AsObject,
    address?: proto_loom_pb.Address.AsObject,
    creationBlock: number,
    nonce: number,
  }
}

export enum KarmaSourceTarget {
  CALL = 0,
  DEPLOY = 1,
}

