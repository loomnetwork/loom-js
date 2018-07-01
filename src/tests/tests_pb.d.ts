// package: 
// file: tests/tests.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class MapEntry extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MapEntry.AsObject;
  static toObject(includeInstance: boolean, msg: MapEntry): MapEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MapEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MapEntry;
  static deserializeBinaryFromReader(message: MapEntry, reader: jspb.BinaryReader): MapEntry;
}

export namespace MapEntry {
  export type AsObject = {
    key: string,
    value: string,
  }
}

export class HelloRequest extends jspb.Message {
  getIn(): string;
  setIn(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HelloRequest.AsObject;
  static toObject(includeInstance: boolean, msg: HelloRequest): HelloRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HelloRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HelloRequest;
  static deserializeBinaryFromReader(message: HelloRequest, reader: jspb.BinaryReader): HelloRequest;
}

export namespace HelloRequest {
  export type AsObject = {
    pb_in: string,
  }
}

export class HelloResponse extends jspb.Message {
  getOut(): string;
  setOut(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HelloResponse.AsObject;
  static toObject(includeInstance: boolean, msg: HelloResponse): HelloResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HelloResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HelloResponse;
  static deserializeBinaryFromReader(message: HelloResponse, reader: jspb.BinaryReader): HelloResponse;
}

export namespace HelloResponse {
  export type AsObject = {
    out: string,
  }
}

export class EmbeddedBigUInt extends jspb.Message {
  hasTestVal(): boolean;
  clearTestVal(): void;
  getTestVal(): proto_loom_pb.BigUInt | undefined;
  setTestVal(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EmbeddedBigUInt.AsObject;
  static toObject(includeInstance: boolean, msg: EmbeddedBigUInt): EmbeddedBigUInt.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EmbeddedBigUInt, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EmbeddedBigUInt;
  static deserializeBinaryFromReader(message: EmbeddedBigUInt, reader: jspb.BinaryReader): EmbeddedBigUInt;
}

export namespace EmbeddedBigUInt {
  export type AsObject = {
    testVal?: proto_loom_pb.BigUInt.AsObject,
  }
}

