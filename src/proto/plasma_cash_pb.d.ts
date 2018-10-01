// package: 
// file: proto/plasma_cash.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class PlasmaBlock extends jspb.Message {
  hasUid(): boolean;
  clearUid(): void;
  getUid(): proto_loom_pb.BigUInt | undefined;
  setUid(value?: proto_loom_pb.BigUInt): void;

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
    uid?: proto_loom_pb.BigUInt.AsObject,
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

  hasPreviousBlock(): boolean;
  clearPreviousBlock(): void;
  getPreviousBlock(): proto_loom_pb.BigUInt | undefined;
  setPreviousBlock(value?: proto_loom_pb.BigUInt): void;

  hasDenomination(): boolean;
  clearDenomination(): void;
  getDenomination(): proto_loom_pb.BigUInt | undefined;
  setDenomination(value?: proto_loom_pb.BigUInt): void;

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
    previousBlock?: proto_loom_pb.BigUInt.AsObject,
    denomination?: proto_loom_pb.BigUInt.AsObject,
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
  hasBlockHeight(): boolean;
  clearBlockHeight(): void;
  getBlockHeight(): proto_loom_pb.BigUInt | undefined;
  setBlockHeight(value?: proto_loom_pb.BigUInt): void;

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
    blockHeight?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class GetBlockRequest extends jspb.Message {
  hasBlockHeight(): boolean;
  clearBlockHeight(): void;
  getBlockHeight(): proto_loom_pb.BigUInt | undefined;
  setBlockHeight(value?: proto_loom_pb.BigUInt): void;

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
    blockHeight?: proto_loom_pb.BigUInt.AsObject,
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

export class SubmitBlockToMainnetRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmitBlockToMainnetRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubmitBlockToMainnetRequest): SubmitBlockToMainnetRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubmitBlockToMainnetRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmitBlockToMainnetRequest;
  static deserializeBinaryFromReader(message: SubmitBlockToMainnetRequest, reader: jspb.BinaryReader): SubmitBlockToMainnetRequest;
}

export namespace SubmitBlockToMainnetRequest {
  export type AsObject = {
  }
}

export class SubmitBlockToMainnetResponse extends jspb.Message {
  getMerkleHash(): Uint8Array | string;
  getMerkleHash_asU8(): Uint8Array;
  getMerkleHash_asB64(): string;
  setMerkleHash(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmitBlockToMainnetResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SubmitBlockToMainnetResponse): SubmitBlockToMainnetResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubmitBlockToMainnetResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmitBlockToMainnetResponse;
  static deserializeBinaryFromReader(message: SubmitBlockToMainnetResponse, reader: jspb.BinaryReader): SubmitBlockToMainnetResponse;
}

export namespace SubmitBlockToMainnetResponse {
  export type AsObject = {
    merkleHash: Uint8Array | string,
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

export class GetPlasmaTxRequest extends jspb.Message {
  getSlot(): number;
  setSlot(value: number): void;

  hasBlockHeight(): boolean;
  clearBlockHeight(): void;
  getBlockHeight(): proto_loom_pb.BigUInt | undefined;
  setBlockHeight(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPlasmaTxRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPlasmaTxRequest): GetPlasmaTxRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetPlasmaTxRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPlasmaTxRequest;
  static deserializeBinaryFromReader(message: GetPlasmaTxRequest, reader: jspb.BinaryReader): GetPlasmaTxRequest;
}

export namespace GetPlasmaTxRequest {
  export type AsObject = {
    slot: number,
    blockHeight?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class GetPlasmaTxResponse extends jspb.Message {
  hasPlasmaTx(): boolean;
  clearPlasmaTx(): void;
  getPlasmaTx(): PlasmaTx | undefined;
  setPlasmaTx(value?: PlasmaTx): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPlasmaTxResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPlasmaTxResponse): GetPlasmaTxResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetPlasmaTxResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPlasmaTxResponse;
  static deserializeBinaryFromReader(message: GetPlasmaTxResponse, reader: jspb.BinaryReader): GetPlasmaTxResponse;
}

export namespace GetPlasmaTxResponse {
  export type AsObject = {
    plasmaTx?: PlasmaTx.AsObject,
  }
}

export class GetUserSlotsRequest extends jspb.Message {
  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): proto_loom_pb.Address | undefined;
  setFrom(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserSlotsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserSlotsRequest): GetUserSlotsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetUserSlotsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserSlotsRequest;
  static deserializeBinaryFromReader(message: GetUserSlotsRequest, reader: jspb.BinaryReader): GetUserSlotsRequest;
}

export namespace GetUserSlotsRequest {
  export type AsObject = {
    from?: proto_loom_pb.Address.AsObject,
  }
}

export class GetUserSlotsResponse extends jspb.Message {
  clearSlotsList(): void;
  getSlotsList(): Array<number>;
  setSlotsList(value: Array<number>): void;
  addSlots(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserSlotsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserSlotsResponse): GetUserSlotsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetUserSlotsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserSlotsResponse;
  static deserializeBinaryFromReader(message: GetUserSlotsResponse, reader: jspb.BinaryReader): GetUserSlotsResponse;
}

export namespace GetUserSlotsResponse {
  export type AsObject = {
    slotsList: Array<number>,
  }
}

export class DepositRequest extends jspb.Message {
  getSlot(): number;
  setSlot(value: number): void;

  hasDepositBlock(): boolean;
  clearDepositBlock(): void;
  getDepositBlock(): proto_loom_pb.BigUInt | undefined;
  setDepositBlock(value?: proto_loom_pb.BigUInt): void;

  hasDenomination(): boolean;
  clearDenomination(): void;
  getDenomination(): proto_loom_pb.BigUInt | undefined;
  setDenomination(value?: proto_loom_pb.BigUInt): void;

  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): proto_loom_pb.Address | undefined;
  setFrom(value?: proto_loom_pb.Address): void;

  hasContract(): boolean;
  clearContract(): void;
  getContract(): proto_loom_pb.Address | undefined;
  setContract(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DepositRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DepositRequest): DepositRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DepositRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DepositRequest;
  static deserializeBinaryFromReader(message: DepositRequest, reader: jspb.BinaryReader): DepositRequest;
}

export namespace DepositRequest {
  export type AsObject = {
    slot: number,
    depositBlock?: proto_loom_pb.BigUInt.AsObject,
    denomination?: proto_loom_pb.BigUInt.AsObject,
    from?: proto_loom_pb.Address.AsObject,
    contract?: proto_loom_pb.Address.AsObject,
  }
}

