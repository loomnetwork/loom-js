// package: 
// file: proto/plasma_cash.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class PlasmaBlock extends jspb.Message {
  getSlot(): Uint8Array | string;
  getSlot_asU8(): Uint8Array;
  getSlot_asB64(): string;
  setSlot(value: Uint8Array | string): void;

  clearTransactionsList(): void;
  getTransactionsList(): Array<PlasmaTx>;
  setTransactionsList(value: Array<PlasmaTx>): void;
  addTransactions(value?: PlasmaTx, index?: number): PlasmaTx;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  getMerkleHash(): Uint8Array | string;
  getMerkleHash_asU8(): Uint8Array;
  getMerkleHash_asB64(): string;
  setMerkleHash(value: Uint8Array | string): void;

  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  getProof(): Uint8Array | string;
  getProof_asU8(): Uint8Array;
  getProof_asB64(): string;
  setProof(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlasmaBlock.AsObject;
  static toObject(includeInstance: boolean, msg: PlasmaBlock): PlasmaBlock.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlasmaBlock, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlasmaBlock;
  static deserializeBinaryFromReader(message: PlasmaBlock, reader: jspb.BinaryReader): PlasmaBlock;
}

export namespace PlasmaBlock {
  export type AsObject = {
    slot: Uint8Array | string,
    transactionsList: Array<PlasmaTx.AsObject>,
    signature: Uint8Array | string,
    merkleHash: Uint8Array | string,
    hash: Uint8Array | string,
    proof: Uint8Array | string,
  }
}

export class PlasmaTx extends jspb.Message {
  getSlot(): number;
  setSlot(value: number): void;

  getPreviousBlock(): Uint8Array | string;
  getPreviousBlock_asU8(): Uint8Array;
  getPreviousBlock_asB64(): string;
  setPreviousBlock(value: Uint8Array | string): void;

  getDenomination(): Uint8Array | string;
  getDenomination_asU8(): Uint8Array;
  getDenomination_asB64(): string;
  setDenomination(value: Uint8Array | string): void;

  hasNewOwner(): boolean;
  clearNewOwner(): void;
  getNewOwner(): proto_loom_pb.Address | undefined;
  setNewOwner(value?: proto_loom_pb.Address): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  getMerkleHash(): Uint8Array | string;
  getMerkleHash_asU8(): Uint8Array;
  getMerkleHash_asB64(): string;
  setMerkleHash(value: Uint8Array | string): void;

  hasSender(): boolean;
  clearSender(): void;
  getSender(): proto_loom_pb.Address | undefined;
  setSender(value?: proto_loom_pb.Address): void;

  getProof(): Uint8Array | string;
  getProof_asU8(): Uint8Array;
  getProof_asB64(): string;
  setProof(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlasmaTx.AsObject;
  static toObject(includeInstance: boolean, msg: PlasmaTx): PlasmaTx.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlasmaTx, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlasmaTx;
  static deserializeBinaryFromReader(message: PlasmaTx, reader: jspb.BinaryReader): PlasmaTx;
}

export namespace PlasmaTx {
  export type AsObject = {
    slot: number,
    previousBlock: Uint8Array | string,
    denomination: Uint8Array | string,
    newOwner?: proto_loom_pb.Address.AsObject,
    signature: Uint8Array | string,
    hash: Uint8Array | string,
    merkleHash: Uint8Array | string,
    sender?: proto_loom_pb.Address.AsObject,
    proof: Uint8Array | string,
  }
}

export class GetCurrentBlockRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCurrentBlockRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCurrentBlockRequest): GetCurrentBlockRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCurrentBlockRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCurrentBlockRequest;
  static deserializeBinaryFromReader(message: GetCurrentBlockRequest, reader: jspb.BinaryReader): GetCurrentBlockRequest;
}

export namespace GetCurrentBlockRequest {
  export type AsObject = {
  }
}

export class GetCurrentBlockResponse extends jspb.Message {
  getBlockHeight(): Uint8Array | string;
  getBlockHeight_asU8(): Uint8Array;
  getBlockHeight_asB64(): string;
  setBlockHeight(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCurrentBlockResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCurrentBlockResponse): GetCurrentBlockResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCurrentBlockResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCurrentBlockResponse;
  static deserializeBinaryFromReader(message: GetCurrentBlockResponse, reader: jspb.BinaryReader): GetCurrentBlockResponse;
}

export namespace GetCurrentBlockResponse {
  export type AsObject = {
    blockHeight: Uint8Array | string,
  }
}

export class GetBlockRequest extends jspb.Message {
  getBlockHeight(): Uint8Array | string;
  getBlockHeight_asU8(): Uint8Array;
  getBlockHeight_asB64(): string;
  setBlockHeight(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlockRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlockRequest): GetBlockRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlockRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlockRequest;
  static deserializeBinaryFromReader(message: GetBlockRequest, reader: jspb.BinaryReader): GetBlockRequest;
}

export namespace GetBlockRequest {
  export type AsObject = {
    blockHeight: Uint8Array | string,
  }
}

export class GetBlockResponse extends jspb.Message {
  hasBlock(): boolean;
  clearBlock(): void;
  getBlock(): PlasmaBlock | undefined;
  setBlock(value?: PlasmaBlock): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlockResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlockResponse): GetBlockResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlockResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlockResponse;
  static deserializeBinaryFromReader(message: GetBlockResponse, reader: jspb.BinaryReader): GetBlockResponse;
}

export namespace GetBlockResponse {
  export type AsObject = {
    block?: PlasmaBlock.AsObject,
  }
}

export class PlasmaTxRequest extends jspb.Message {
  hasPlasmatx(): boolean;
  clearPlasmatx(): void;
  getPlasmatx(): PlasmaTx | undefined;
  setPlasmatx(value?: PlasmaTx): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlasmaTxRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PlasmaTxRequest): PlasmaTxRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlasmaTxRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlasmaTxRequest;
  static deserializeBinaryFromReader(message: PlasmaTxRequest, reader: jspb.BinaryReader): PlasmaTxRequest;
}

export namespace PlasmaTxRequest {
  export type AsObject = {
    plasmatx?: PlasmaTx.AsObject,
  }
}

export class PlasmaTxResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlasmaTxResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PlasmaTxResponse): PlasmaTxResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlasmaTxResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlasmaTxResponse;
  static deserializeBinaryFromReader(message: PlasmaTxResponse, reader: jspb.BinaryReader): PlasmaTxResponse;
}

export namespace PlasmaTxResponse {
  export type AsObject = {
  }
}

