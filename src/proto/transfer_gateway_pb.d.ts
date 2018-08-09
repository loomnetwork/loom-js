// package: 
// file: proto/transfer_gateway.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class TransferGatewayContractMappingConfirmed extends jspb.Message {
  hasForeignContract(): boolean;
  clearForeignContract(): void;
  getForeignContract(): proto_loom_pb.Address | undefined;
  setForeignContract(value?: proto_loom_pb.Address): void;

  hasLocalContract(): boolean;
  clearLocalContract(): void;
  getLocalContract(): proto_loom_pb.Address | undefined;
  setLocalContract(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayContractMappingConfirmed.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayContractMappingConfirmed): TransferGatewayContractMappingConfirmed.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayContractMappingConfirmed, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayContractMappingConfirmed;
  static deserializeBinaryFromReader(message: TransferGatewayContractMappingConfirmed, reader: jspb.BinaryReader): TransferGatewayContractMappingConfirmed;
}

export namespace TransferGatewayContractMappingConfirmed {
  export type AsObject = {
    foreignContract?: proto_loom_pb.Address.AsObject,
    localContract?: proto_loom_pb.Address.AsObject,
  }
}

export class TransferGatewayTokenWithdrawalSigned extends jspb.Message {
  hasTokenOwner(): boolean;
  clearTokenOwner(): void;
  getTokenOwner(): proto_loom_pb.Address | undefined;
  setTokenOwner(value?: proto_loom_pb.Address): void;

  hasTokenContract(): boolean;
  clearTokenContract(): void;
  getTokenContract(): proto_loom_pb.Address | undefined;
  setTokenContract(value?: proto_loom_pb.Address): void;

  getTokenKind(): TransferGatewayTokenKind;
  setTokenKind(value: TransferGatewayTokenKind): void;

  hasValue(): boolean;
  clearValue(): void;
  getValue(): proto_loom_pb.BigUInt | undefined;
  setValue(value?: proto_loom_pb.BigUInt): void;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayTokenWithdrawalSigned.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayTokenWithdrawalSigned): TransferGatewayTokenWithdrawalSigned.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayTokenWithdrawalSigned, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayTokenWithdrawalSigned;
  static deserializeBinaryFromReader(message: TransferGatewayTokenWithdrawalSigned, reader: jspb.BinaryReader): TransferGatewayTokenWithdrawalSigned;
}

export namespace TransferGatewayTokenWithdrawalSigned {
  export type AsObject = {
    tokenOwner?: proto_loom_pb.Address.AsObject,
    tokenContract?: proto_loom_pb.Address.AsObject,
    tokenKind: TransferGatewayTokenKind,
    value?: proto_loom_pb.BigUInt.AsObject,
    sig: Uint8Array | string,
  }
}

export class TransferGatewayWithdrawalReceipt extends jspb.Message {
  hasTokenOwner(): boolean;
  clearTokenOwner(): void;
  getTokenOwner(): proto_loom_pb.Address | undefined;
  setTokenOwner(value?: proto_loom_pb.Address): void;

  hasTokenContract(): boolean;
  clearTokenContract(): void;
  getTokenContract(): proto_loom_pb.Address | undefined;
  setTokenContract(value?: proto_loom_pb.Address): void;

  getTokenKind(): TransferGatewayTokenKind;
  setTokenKind(value: TransferGatewayTokenKind): void;

  hasValue(): boolean;
  clearValue(): void;
  getValue(): proto_loom_pb.BigUInt | undefined;
  setValue(value?: proto_loom_pb.BigUInt): void;

  getWithdrawalNonce(): number;
  setWithdrawalNonce(value: number): void;

  getOracleSignature(): Uint8Array | string;
  getOracleSignature_asU8(): Uint8Array;
  getOracleSignature_asB64(): string;
  setOracleSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayWithdrawalReceipt.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayWithdrawalReceipt): TransferGatewayWithdrawalReceipt.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayWithdrawalReceipt, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayWithdrawalReceipt;
  static deserializeBinaryFromReader(message: TransferGatewayWithdrawalReceipt, reader: jspb.BinaryReader): TransferGatewayWithdrawalReceipt;
}

export namespace TransferGatewayWithdrawalReceipt {
  export type AsObject = {
    tokenOwner?: proto_loom_pb.Address.AsObject,
    tokenContract?: proto_loom_pb.Address.AsObject,
    tokenKind: TransferGatewayTokenKind,
    value?: proto_loom_pb.BigUInt.AsObject,
    withdrawalNonce: number,
    oracleSignature: Uint8Array | string,
  }
}

export class TransferGatewayWithdrawERC721Request extends jspb.Message {
  hasTokenId(): boolean;
  clearTokenId(): void;
  getTokenId(): proto_loom_pb.BigUInt | undefined;
  setTokenId(value?: proto_loom_pb.BigUInt): void;

  hasTokenContract(): boolean;
  clearTokenContract(): void;
  getTokenContract(): proto_loom_pb.Address | undefined;
  setTokenContract(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayWithdrawERC721Request.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayWithdrawERC721Request): TransferGatewayWithdrawERC721Request.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayWithdrawERC721Request, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayWithdrawERC721Request;
  static deserializeBinaryFromReader(message: TransferGatewayWithdrawERC721Request, reader: jspb.BinaryReader): TransferGatewayWithdrawERC721Request;
}

export namespace TransferGatewayWithdrawERC721Request {
  export type AsObject = {
    tokenId?: proto_loom_pb.BigUInt.AsObject,
    tokenContract?: proto_loom_pb.Address.AsObject,
  }
}

export class TransferGatewayWithdrawalReceiptRequest extends jspb.Message {
  hasOwner(): boolean;
  clearOwner(): void;
  getOwner(): proto_loom_pb.Address | undefined;
  setOwner(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayWithdrawalReceiptRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayWithdrawalReceiptRequest): TransferGatewayWithdrawalReceiptRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayWithdrawalReceiptRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayWithdrawalReceiptRequest;
  static deserializeBinaryFromReader(message: TransferGatewayWithdrawalReceiptRequest, reader: jspb.BinaryReader): TransferGatewayWithdrawalReceiptRequest;
}

export namespace TransferGatewayWithdrawalReceiptRequest {
  export type AsObject = {
    owner?: proto_loom_pb.Address.AsObject,
  }
}

export class TransferGatewayWithdrawalReceiptResponse extends jspb.Message {
  hasReceipt(): boolean;
  clearReceipt(): void;
  getReceipt(): TransferGatewayWithdrawalReceipt | undefined;
  setReceipt(value?: TransferGatewayWithdrawalReceipt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayWithdrawalReceiptResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayWithdrawalReceiptResponse): TransferGatewayWithdrawalReceiptResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayWithdrawalReceiptResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayWithdrawalReceiptResponse;
  static deserializeBinaryFromReader(message: TransferGatewayWithdrawalReceiptResponse, reader: jspb.BinaryReader): TransferGatewayWithdrawalReceiptResponse;
}

export namespace TransferGatewayWithdrawalReceiptResponse {
  export type AsObject = {
    receipt?: TransferGatewayWithdrawalReceipt.AsObject,
  }
}

export class TransferGatewayConfirmWithdrawalReceiptRequest extends jspb.Message {
  hasTokenOwner(): boolean;
  clearTokenOwner(): void;
  getTokenOwner(): proto_loom_pb.Address | undefined;
  setTokenOwner(value?: proto_loom_pb.Address): void;

  getOracleSignature(): Uint8Array | string;
  getOracleSignature_asU8(): Uint8Array;
  getOracleSignature_asB64(): string;
  setOracleSignature(value: Uint8Array | string): void;

  getWithdrawalHash(): Uint8Array | string;
  getWithdrawalHash_asU8(): Uint8Array;
  getWithdrawalHash_asB64(): string;
  setWithdrawalHash(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayConfirmWithdrawalReceiptRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayConfirmWithdrawalReceiptRequest): TransferGatewayConfirmWithdrawalReceiptRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayConfirmWithdrawalReceiptRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayConfirmWithdrawalReceiptRequest;
  static deserializeBinaryFromReader(message: TransferGatewayConfirmWithdrawalReceiptRequest, reader: jspb.BinaryReader): TransferGatewayConfirmWithdrawalReceiptRequest;
}

export namespace TransferGatewayConfirmWithdrawalReceiptRequest {
  export type AsObject = {
    tokenOwner?: proto_loom_pb.Address.AsObject,
    oracleSignature: Uint8Array | string,
    withdrawalHash: Uint8Array | string,
  }
}

export class TransferGatewayAddContractMappingRequest extends jspb.Message {
  hasForeignContract(): boolean;
  clearForeignContract(): void;
  getForeignContract(): proto_loom_pb.Address | undefined;
  setForeignContract(value?: proto_loom_pb.Address): void;

  hasLocalContract(): boolean;
  clearLocalContract(): void;
  getLocalContract(): proto_loom_pb.Address | undefined;
  setLocalContract(value?: proto_loom_pb.Address): void;

  getForeignContractCreatorSig(): Uint8Array | string;
  getForeignContractCreatorSig_asU8(): Uint8Array;
  getForeignContractCreatorSig_asB64(): string;
  setForeignContractCreatorSig(value: Uint8Array | string): void;

  getForeignContractTxHash(): Uint8Array | string;
  getForeignContractTxHash_asU8(): Uint8Array;
  getForeignContractTxHash_asB64(): string;
  setForeignContractTxHash(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayAddContractMappingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayAddContractMappingRequest): TransferGatewayAddContractMappingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayAddContractMappingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayAddContractMappingRequest;
  static deserializeBinaryFromReader(message: TransferGatewayAddContractMappingRequest, reader: jspb.BinaryReader): TransferGatewayAddContractMappingRequest;
}

export namespace TransferGatewayAddContractMappingRequest {
  export type AsObject = {
    foreignContract?: proto_loom_pb.Address.AsObject,
    localContract?: proto_loom_pb.Address.AsObject,
    foreignContractCreatorSig: Uint8Array | string,
    foreignContractTxHash: Uint8Array | string,
  }
}

export enum TransferGatewayTokenKind {
  ETH = 0,
  ERC20 = 1,
  ERC721 = 2,
}

