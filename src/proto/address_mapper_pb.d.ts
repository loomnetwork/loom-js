// package: 
// file: proto/address_mapper.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class AddressMapperMapping extends jspb.Message {
  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): proto_loom_pb.Address | undefined;
  setFrom(value?: proto_loom_pb.Address): void;

  hasTo(): boolean;
  clearTo(): void;
  getTo(): proto_loom_pb.Address | undefined;
  setTo(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddressMapperMapping.AsObject;
  static toObject(includeInstance: boolean, msg: AddressMapperMapping): AddressMapperMapping.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddressMapperMapping, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddressMapperMapping;
  static deserializeBinaryFromReader(message: AddressMapperMapping, reader: jspb.BinaryReader): AddressMapperMapping;
}

export namespace AddressMapperMapping {
  export type AsObject = {
    from?: proto_loom_pb.Address.AsObject,
    to?: proto_loom_pb.Address.AsObject,
  }
}

export class AddressMapperInitRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddressMapperInitRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddressMapperInitRequest): AddressMapperInitRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddressMapperInitRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddressMapperInitRequest;
  static deserializeBinaryFromReader(message: AddressMapperInitRequest, reader: jspb.BinaryReader): AddressMapperInitRequest;
}

export namespace AddressMapperInitRequest {
  export type AsObject = {
  }
}

export class AddressMapperAddIdentityMappingRequest extends jspb.Message {
  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): proto_loom_pb.Address | undefined;
  setFrom(value?: proto_loom_pb.Address): void;

  hasTo(): boolean;
  clearTo(): void;
  getTo(): proto_loom_pb.Address | undefined;
  setTo(value?: proto_loom_pb.Address): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddressMapperAddIdentityMappingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddressMapperAddIdentityMappingRequest): AddressMapperAddIdentityMappingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddressMapperAddIdentityMappingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddressMapperAddIdentityMappingRequest;
  static deserializeBinaryFromReader(message: AddressMapperAddIdentityMappingRequest, reader: jspb.BinaryReader): AddressMapperAddIdentityMappingRequest;
}

export namespace AddressMapperAddIdentityMappingRequest {
  export type AsObject = {
    from?: proto_loom_pb.Address.AsObject,
    to?: proto_loom_pb.Address.AsObject,
    signature: Uint8Array | string,
  }
}

export class AddressMapperRemoveMappingRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddressMapperRemoveMappingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddressMapperRemoveMappingRequest): AddressMapperRemoveMappingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddressMapperRemoveMappingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddressMapperRemoveMappingRequest;
  static deserializeBinaryFromReader(message: AddressMapperRemoveMappingRequest, reader: jspb.BinaryReader): AddressMapperRemoveMappingRequest;
}

export namespace AddressMapperRemoveMappingRequest {
  export type AsObject = {
  }
}

export class AddressMapperGetMappingRequest extends jspb.Message {
  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): proto_loom_pb.Address | undefined;
  setFrom(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddressMapperGetMappingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddressMapperGetMappingRequest): AddressMapperGetMappingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddressMapperGetMappingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddressMapperGetMappingRequest;
  static deserializeBinaryFromReader(message: AddressMapperGetMappingRequest, reader: jspb.BinaryReader): AddressMapperGetMappingRequest;
}

export namespace AddressMapperGetMappingRequest {
  export type AsObject = {
    from?: proto_loom_pb.Address.AsObject,
  }
}

export class AddressMapperGetMappingResponse extends jspb.Message {
  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): proto_loom_pb.Address | undefined;
  setFrom(value?: proto_loom_pb.Address): void;

  hasTo(): boolean;
  clearTo(): void;
  getTo(): proto_loom_pb.Address | undefined;
  setTo(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddressMapperGetMappingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddressMapperGetMappingResponse): AddressMapperGetMappingResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddressMapperGetMappingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddressMapperGetMappingResponse;
  static deserializeBinaryFromReader(message: AddressMapperGetMappingResponse, reader: jspb.BinaryReader): AddressMapperGetMappingResponse;
}

export namespace AddressMapperGetMappingResponse {
  export type AsObject = {
    from?: proto_loom_pb.Address.AsObject,
    to?: proto_loom_pb.Address.AsObject,
  }
}

export class AddressMapperHasMappingRequest extends jspb.Message {
  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): proto_loom_pb.Address | undefined;
  setFrom(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddressMapperHasMappingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddressMapperHasMappingRequest): AddressMapperHasMappingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddressMapperHasMappingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddressMapperHasMappingRequest;
  static deserializeBinaryFromReader(message: AddressMapperHasMappingRequest, reader: jspb.BinaryReader): AddressMapperHasMappingRequest;
}

export namespace AddressMapperHasMappingRequest {
  export type AsObject = {
    from?: proto_loom_pb.Address.AsObject,
  }
}

export class AddressMapperHasMappingResponse extends jspb.Message {
  getHasMapping(): boolean;
  setHasMapping(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddressMapperHasMappingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddressMapperHasMappingResponse): AddressMapperHasMappingResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddressMapperHasMappingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddressMapperHasMappingResponse;
  static deserializeBinaryFromReader(message: AddressMapperHasMappingResponse, reader: jspb.BinaryReader): AddressMapperHasMappingResponse;
}

export namespace AddressMapperHasMappingResponse {
  export type AsObject = {
    hasMapping: boolean,
  }
}

