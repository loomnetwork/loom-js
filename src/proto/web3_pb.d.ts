// package: 
// file: proto/web3.proto

import * as jspb from "google-protobuf";

export class EthTransaction extends jspb.Message {
  getVersion(): number;
  setVersion(value: number): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EthTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: EthTransaction): EthTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EthTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EthTransaction;
  static deserializeBinaryFromReader(message: EthTransaction, reader: jspb.BinaryReader): EthTransaction;
}

export namespace EthTransaction {
  export type AsObject = {
    version: number,
    data: Uint8Array | string,
  }
}

export class EthCall extends jspb.Message {
  getVersion(): number;
  setVersion(value: number): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EthCall.AsObject;
  static toObject(includeInstance: boolean, msg: EthCall): EthCall.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EthCall, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EthCall;
  static deserializeBinaryFromReader(message: EthCall, reader: jspb.BinaryReader): EthCall;
}

export namespace EthCall {
  export type AsObject = {
    version: number,
    data: Uint8Array | string,
  }
}

export class EthCallResult extends jspb.Message {
  getVersion(): number;
  setVersion(value: number): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EthCallResult.AsObject;
  static toObject(includeInstance: boolean, msg: EthCallResult): EthCallResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EthCallResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EthCallResult;
  static deserializeBinaryFromReader(message: EthCallResult, reader: jspb.BinaryReader): EthCallResult;
}

export namespace EthCallResult {
  export type AsObject = {
    version: number,
    data: Uint8Array | string,
  }
}

