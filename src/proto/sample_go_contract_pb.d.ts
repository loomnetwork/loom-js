// package: 
// file: proto/sample_go_contract.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class SampleGoContractNestedEvmRequest extends jspb.Message {
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
  }
}

