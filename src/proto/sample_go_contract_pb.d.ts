// package: 
// file: proto/sample_go_contract.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class SampleGoContractNestedEvmRequest extends jspb.Message {
  hasInnerEmitter(): boolean;
  clearInnerEmitter(): void;
  getInnerEmitter(): proto_loom_pb.Address | undefined;
  setInnerEmitter(value?: proto_loom_pb.Address): void;

  hasOuterEmitter(): boolean;
  clearOuterEmitter(): void;
  getOuterEmitter(): proto_loom_pb.Address | undefined;
  setOuterEmitter(value?: proto_loom_pb.Address): void;

  getInnerEmitterValue(): number;
  setInnerEmitterValue(value: number): void;

  getOuterEmitterValue(): number;
  setOuterEmitterValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SampleGoContractNestedEvmRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SampleGoContractNestedEvmRequest): SampleGoContractNestedEvmRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SampleGoContractNestedEvmRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SampleGoContractNestedEvmRequest;
  static deserializeBinaryFromReader(message: SampleGoContractNestedEvmRequest, reader: jspb.BinaryReader): SampleGoContractNestedEvmRequest;
}

export namespace SampleGoContractNestedEvmRequest {
  export type AsObject = {
    innerEmitter?: proto_loom_pb.Address.AsObject,
    outerEmitter?: proto_loom_pb.Address.AsObject,
    innerEmitterValue: number,
    outerEmitterValue: number,
  }
}

