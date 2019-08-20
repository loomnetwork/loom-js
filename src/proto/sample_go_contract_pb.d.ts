// package: 
// file: proto/sample_go_contract.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class SampleGoContractNestedEvmRequest2 extends jspb.Message {
  hasTestEvent(): boolean;
  clearTestEvent(): void;
  getTestEvent(): proto_loom_pb.Address | undefined;
  setTestEvent(value?: proto_loom_pb.Address): void;

  hasChainTestEvent(): boolean;
  clearChainTestEvent(): void;
  getChainTestEvent(): proto_loom_pb.Address | undefined;
  setChainTestEvent(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SampleGoContractNestedEvmRequest2.AsObject;
  static toObject(includeInstance: boolean, msg: SampleGoContractNestedEvmRequest2): SampleGoContractNestedEvmRequest2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SampleGoContractNestedEvmRequest2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SampleGoContractNestedEvmRequest2;
  static deserializeBinaryFromReader(message: SampleGoContractNestedEvmRequest2, reader: jspb.BinaryReader): SampleGoContractNestedEvmRequest2;
}

export namespace SampleGoContractNestedEvmRequest2 {
  export type AsObject = {
    testEvent?: proto_loom_pb.Address.AsObject,
    chainTestEvent?: proto_loom_pb.Address.AsObject,
  }
}

