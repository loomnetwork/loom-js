// package: 
// file: proto/coin.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class TotalSupplyRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TotalSupplyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TotalSupplyRequest): TotalSupplyRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TotalSupplyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TotalSupplyRequest;
  static deserializeBinaryFromReader(message: TotalSupplyRequest, reader: jspb.BinaryReader): TotalSupplyRequest;
}

export namespace TotalSupplyRequest {
  export type AsObject = {
  }
}

export class TotalSupplyResponse extends jspb.Message {
  hasTotalSupply(): boolean;
  clearTotalSupply(): void;
  getTotalSupply(): proto_loom_pb.BigUInt | undefined;
  setTotalSupply(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TotalSupplyResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TotalSupplyResponse): TotalSupplyResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TotalSupplyResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TotalSupplyResponse;
  static deserializeBinaryFromReader(message: TotalSupplyResponse, reader: jspb.BinaryReader): TotalSupplyResponse;
}

export namespace TotalSupplyResponse {
  export type AsObject = {
    totalSupply?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class BalanceOfRequest extends jspb.Message {
  hasOwner(): boolean;
  clearOwner(): void;
  getOwner(): proto_loom_pb.Address | undefined;
  setOwner(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BalanceOfRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BalanceOfRequest): BalanceOfRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BalanceOfRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BalanceOfRequest;
  static deserializeBinaryFromReader(message: BalanceOfRequest, reader: jspb.BinaryReader): BalanceOfRequest;
}

export namespace BalanceOfRequest {
  export type AsObject = {
    owner?: proto_loom_pb.Address.AsObject,
  }
}

export class BalanceOfResponse extends jspb.Message {
  hasBalance(): boolean;
  clearBalance(): void;
  getBalance(): proto_loom_pb.BigUInt | undefined;
  setBalance(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BalanceOfResponse.AsObject;
  static toObject(includeInstance: boolean, msg: BalanceOfResponse): BalanceOfResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BalanceOfResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BalanceOfResponse;
  static deserializeBinaryFromReader(message: BalanceOfResponse, reader: jspb.BinaryReader): BalanceOfResponse;
}

export namespace BalanceOfResponse {
  export type AsObject = {
    balance?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class AllowanceRequest extends jspb.Message {
  hasOwner(): boolean;
  clearOwner(): void;
  getOwner(): proto_loom_pb.Address | undefined;
  setOwner(value?: proto_loom_pb.Address): void;

  hasSpender(): boolean;
  clearSpender(): void;
  getSpender(): proto_loom_pb.Address | undefined;
  setSpender(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AllowanceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AllowanceRequest): AllowanceRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AllowanceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AllowanceRequest;
  static deserializeBinaryFromReader(message: AllowanceRequest, reader: jspb.BinaryReader): AllowanceRequest;
}

export namespace AllowanceRequest {
  export type AsObject = {
    owner?: proto_loom_pb.Address.AsObject,
    spender?: proto_loom_pb.Address.AsObject,
  }
}

export class AllowanceResponse extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AllowanceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AllowanceResponse): AllowanceResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AllowanceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AllowanceResponse;
  static deserializeBinaryFromReader(message: AllowanceResponse, reader: jspb.BinaryReader): AllowanceResponse;
}

export namespace AllowanceResponse {
  export type AsObject = {
    amount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class ApproveRequest extends jspb.Message {
  hasSpender(): boolean;
  clearSpender(): void;
  getSpender(): proto_loom_pb.Address | undefined;
  setSpender(value?: proto_loom_pb.Address): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApproveRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ApproveRequest): ApproveRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApproveRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApproveRequest;
  static deserializeBinaryFromReader(message: ApproveRequest, reader: jspb.BinaryReader): ApproveRequest;
}

export namespace ApproveRequest {
  export type AsObject = {
    spender?: proto_loom_pb.Address.AsObject,
    amount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class ApproveResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApproveResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ApproveResponse): ApproveResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ApproveResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApproveResponse;
  static deserializeBinaryFromReader(message: ApproveResponse, reader: jspb.BinaryReader): ApproveResponse;
}

export namespace ApproveResponse {
  export type AsObject = {
  }
}

export class TransferRequest extends jspb.Message {
  hasTo(): boolean;
  clearTo(): void;
  getTo(): proto_loom_pb.Address | undefined;
  setTo(value?: proto_loom_pb.Address): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferRequest): TransferRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferRequest;
  static deserializeBinaryFromReader(message: TransferRequest, reader: jspb.BinaryReader): TransferRequest;
}

export namespace TransferRequest {
  export type AsObject = {
    to?: proto_loom_pb.Address.AsObject,
    amount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class TransferResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransferResponse): TransferResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferResponse;
  static deserializeBinaryFromReader(message: TransferResponse, reader: jspb.BinaryReader): TransferResponse;
}

export namespace TransferResponse {
  export type AsObject = {
  }
}

export class TransferFromRequest extends jspb.Message {
  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): proto_loom_pb.Address | undefined;
  setFrom(value?: proto_loom_pb.Address): void;

  hasTo(): boolean;
  clearTo(): void;
  getTo(): proto_loom_pb.Address | undefined;
  setTo(value?: proto_loom_pb.Address): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferFromRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferFromRequest): TransferFromRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferFromRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferFromRequest;
  static deserializeBinaryFromReader(message: TransferFromRequest, reader: jspb.BinaryReader): TransferFromRequest;
}

export namespace TransferFromRequest {
  export type AsObject = {
    from?: proto_loom_pb.Address.AsObject,
    to?: proto_loom_pb.Address.AsObject,
    amount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class TransferFromResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferFromResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransferFromResponse): TransferFromResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferFromResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferFromResponse;
  static deserializeBinaryFromReader(message: TransferFromResponse, reader: jspb.BinaryReader): TransferFromResponse;
}

export namespace TransferFromResponse {
  export type AsObject = {
  }
}

