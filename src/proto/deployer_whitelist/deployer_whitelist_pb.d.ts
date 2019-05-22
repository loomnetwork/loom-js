// package: deployer_whitelist
// file: proto/deployer_whitelist/deployer_whitelist.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../../proto/loom_pb";

export class InitRequest extends jspb.Message {
  hasOwner(): boolean;
  clearOwner(): void;
  getOwner(): proto_loom_pb.Address | undefined;
  setOwner(value?: proto_loom_pb.Address): void;

  clearDeployersList(): void;
  getDeployersList(): Array<Deployer>;
  setDeployersList(value: Array<Deployer>): void;
  addDeployers(value?: Deployer, index?: number): Deployer;

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
    deployersList: Array<Deployer.AsObject>,
  }
}

export class Deployer extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  getFlags(): number;
  setFlags(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Deployer.AsObject;
  static toObject(includeInstance: boolean, msg: Deployer): Deployer.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Deployer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Deployer;
  static deserializeBinaryFromReader(message: Deployer, reader: jspb.BinaryReader): Deployer;
}

export namespace Deployer {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
    flags: number,
  }
}

export class AddDeployerRequest extends jspb.Message {
  hasDeployeraddr(): boolean;
  clearDeployeraddr(): void;
  getDeployeraddr(): proto_loom_pb.Address | undefined;
  setDeployeraddr(value?: proto_loom_pb.Address): void;

  getFlags(): number;
  setFlags(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddDeployerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddDeployerRequest): AddDeployerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddDeployerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddDeployerRequest;
  static deserializeBinaryFromReader(message: AddDeployerRequest, reader: jspb.BinaryReader): AddDeployerRequest;
}

export namespace AddDeployerRequest {
  export type AsObject = {
    deployeraddr?: proto_loom_pb.Address.AsObject,
    flags: number,
  }
}

export class AddUserDeployerRequest extends jspb.Message {
  hasDeployeraddr(): boolean;
  clearDeployeraddr(): void;
  getDeployeraddr(): proto_loom_pb.Address | undefined;
  setDeployeraddr(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddUserDeployerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddUserDeployerRequest): AddUserDeployerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddUserDeployerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddUserDeployerRequest;
  static deserializeBinaryFromReader(message: AddUserDeployerRequest, reader: jspb.BinaryReader): AddUserDeployerRequest;
}

export namespace AddUserDeployerRequest {
  export type AsObject = {
    deployeraddr?: proto_loom_pb.Address.AsObject,
  }
}

export class AddDeployerResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddDeployerResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddDeployerResponse): AddDeployerResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddDeployerResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddDeployerResponse;
  static deserializeBinaryFromReader(message: AddDeployerResponse, reader: jspb.BinaryReader): AddDeployerResponse;
}

export namespace AddDeployerResponse {
  export type AsObject = {
  }
}

export class GetDeployerRequest extends jspb.Message {
  hasDeployeraddr(): boolean;
  clearDeployeraddr(): void;
  getDeployeraddr(): proto_loom_pb.Address | undefined;
  setDeployeraddr(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDeployerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDeployerRequest): GetDeployerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetDeployerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDeployerRequest;
  static deserializeBinaryFromReader(message: GetDeployerRequest, reader: jspb.BinaryReader): GetDeployerRequest;
}

export namespace GetDeployerRequest {
  export type AsObject = {
    deployeraddr?: proto_loom_pb.Address.AsObject,
  }
}

export class GetDeployerResponse extends jspb.Message {
  hasDeployer(): boolean;
  clearDeployer(): void;
  getDeployer(): Deployer | undefined;
  setDeployer(value?: Deployer): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDeployerResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetDeployerResponse): GetDeployerResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetDeployerResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDeployerResponse;
  static deserializeBinaryFromReader(message: GetDeployerResponse, reader: jspb.BinaryReader): GetDeployerResponse;
}

export namespace GetDeployerResponse {
  export type AsObject = {
    deployer?: Deployer.AsObject,
  }
}

export class RemoveDeployerRequest extends jspb.Message {
  hasDeployeraddr(): boolean;
  clearDeployeraddr(): void;
  getDeployeraddr(): proto_loom_pb.Address | undefined;
  setDeployeraddr(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveDeployerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveDeployerRequest): RemoveDeployerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveDeployerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveDeployerRequest;
  static deserializeBinaryFromReader(message: RemoveDeployerRequest, reader: jspb.BinaryReader): RemoveDeployerRequest;
}

export namespace RemoveDeployerRequest {
  export type AsObject = {
    deployeraddr?: proto_loom_pb.Address.AsObject,
  }
}

export class RemoveDeployerResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveDeployerResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveDeployerResponse): RemoveDeployerResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoveDeployerResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveDeployerResponse;
  static deserializeBinaryFromReader(message: RemoveDeployerResponse, reader: jspb.BinaryReader): RemoveDeployerResponse;
}

export namespace RemoveDeployerResponse {
  export type AsObject = {
  }
}

export class ListDeployersRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDeployersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListDeployersRequest): ListDeployersRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListDeployersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDeployersRequest;
  static deserializeBinaryFromReader(message: ListDeployersRequest, reader: jspb.BinaryReader): ListDeployersRequest;
}

export namespace ListDeployersRequest {
  export type AsObject = {
  }
}

export class ListDeployersResponse extends jspb.Message {
  clearDeployersList(): void;
  getDeployersList(): Array<Deployer>;
  setDeployersList(value: Array<Deployer>): void;
  addDeployers(value?: Deployer, index?: number): Deployer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDeployersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListDeployersResponse): ListDeployersResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListDeployersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDeployersResponse;
  static deserializeBinaryFromReader(message: ListDeployersResponse, reader: jspb.BinaryReader): ListDeployersResponse;
}

export namespace ListDeployersResponse {
  export type AsObject = {
    deployersList: Array<Deployer.AsObject>,
  }
}

export enum Flags {
  NONE = 0,
  GO = 1,
  EVM = 2,
  MIGRATION = 4,
}

