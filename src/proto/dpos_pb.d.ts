// package: 
// file: proto/dpos.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class Witness extends jspb.Message {
  getPubKey(): Uint8Array | string;
  getPubKey_asU8(): Uint8Array;
  getPubKey_asB64(): string;
  setPubKey(value: Uint8Array | string): void;

  getVoteTotal(): number;
  setVoteTotal(value: number): void;

  getPowerTotal(): number;
  setPowerTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Witness.AsObject;
  static toObject(includeInstance: boolean, msg: Witness): Witness.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Witness, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Witness;
  static deserializeBinaryFromReader(message: Witness, reader: jspb.BinaryReader): Witness;
}

export namespace Witness {
  export type AsObject = {
    pubKey: Uint8Array | string,
    voteTotal: number,
    powerTotal: number,
  }
}

export class Candidate extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  getPubKey(): Uint8Array | string;
  getPubKey_asU8(): Uint8Array;
  getPubKey_asB64(): string;
  setPubKey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Candidate.AsObject;
  static toObject(includeInstance: boolean, msg: Candidate): Candidate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Candidate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Candidate;
  static deserializeBinaryFromReader(message: Candidate, reader: jspb.BinaryReader): Candidate;
}

export namespace Candidate {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
    pubKey: Uint8Array | string,
  }
}

export class CandidateList extends jspb.Message {
  clearCandidatesList(): void;
  getCandidatesList(): Array<Candidate>;
  setCandidatesList(value: Array<Candidate>): void;
  addCandidates(value?: Candidate, index?: number): Candidate;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CandidateList.AsObject;
  static toObject(includeInstance: boolean, msg: CandidateList): CandidateList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CandidateList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CandidateList;
  static deserializeBinaryFromReader(message: CandidateList, reader: jspb.BinaryReader): CandidateList;
}

export namespace CandidateList {
  export type AsObject = {
    candidatesList: Array<Candidate.AsObject>,
  }
}

export class Vote extends jspb.Message {
  hasVoterAddress(): boolean;
  clearVoterAddress(): void;
  getVoterAddress(): proto_loom_pb.Address | undefined;
  setVoterAddress(value?: proto_loom_pb.Address): void;

  hasCandidateAddress(): boolean;
  clearCandidateAddress(): void;
  getCandidateAddress(): proto_loom_pb.Address | undefined;
  setCandidateAddress(value?: proto_loom_pb.Address): void;

  getAmount(): number;
  setAmount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Vote.AsObject;
  static toObject(includeInstance: boolean, msg: Vote): Vote.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Vote, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Vote;
  static deserializeBinaryFromReader(message: Vote, reader: jspb.BinaryReader): Vote;
}

export namespace Vote {
  export type AsObject = {
    voterAddress?: proto_loom_pb.Address.AsObject,
    candidateAddress?: proto_loom_pb.Address.AsObject,
    amount: number,
  }
}

export class VoteList extends jspb.Message {
  clearVotesList(): void;
  getVotesList(): Array<Vote>;
  setVotesList(value: Array<Vote>): void;
  addVotes(value?: Vote, index?: number): Vote;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VoteList.AsObject;
  static toObject(includeInstance: boolean, msg: VoteList): VoteList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VoteList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VoteList;
  static deserializeBinaryFromReader(message: VoteList, reader: jspb.BinaryReader): VoteList;
}

export namespace VoteList {
  export type AsObject = {
    votesList: Array<Vote.AsObject>,
  }
}

export class RegisterCandidateRequest extends jspb.Message {
  getPubKey(): Uint8Array | string;
  getPubKey_asU8(): Uint8Array;
  getPubKey_asB64(): string;
  setPubKey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterCandidateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterCandidateRequest): RegisterCandidateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RegisterCandidateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterCandidateRequest;
  static deserializeBinaryFromReader(message: RegisterCandidateRequest, reader: jspb.BinaryReader): RegisterCandidateRequest;
}

export namespace RegisterCandidateRequest {
  export type AsObject = {
    pubKey: Uint8Array | string,
  }
}

export class RegisterCandidateResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterCandidateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterCandidateResponse): RegisterCandidateResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RegisterCandidateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterCandidateResponse;
  static deserializeBinaryFromReader(message: RegisterCandidateResponse, reader: jspb.BinaryReader): RegisterCandidateResponse;
}

export namespace RegisterCandidateResponse {
  export type AsObject = {
  }
}

export class UnregisterCandidateRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnregisterCandidateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnregisterCandidateRequest): UnregisterCandidateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnregisterCandidateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnregisterCandidateRequest;
  static deserializeBinaryFromReader(message: UnregisterCandidateRequest, reader: jspb.BinaryReader): UnregisterCandidateRequest;
}

export namespace UnregisterCandidateRequest {
  export type AsObject = {
  }
}

export class UnregisterCandidateResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnregisterCandidateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UnregisterCandidateResponse): UnregisterCandidateResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnregisterCandidateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnregisterCandidateResponse;
  static deserializeBinaryFromReader(message: UnregisterCandidateResponse, reader: jspb.BinaryReader): UnregisterCandidateResponse;
}

export namespace UnregisterCandidateResponse {
  export type AsObject = {
  }
}

export class VoteRequest extends jspb.Message {
  hasCandidateAddress(): boolean;
  clearCandidateAddress(): void;
  getCandidateAddress(): proto_loom_pb.Address | undefined;
  setCandidateAddress(value?: proto_loom_pb.Address): void;

  getAmount(): number;
  setAmount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VoteRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VoteRequest): VoteRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VoteRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VoteRequest;
  static deserializeBinaryFromReader(message: VoteRequest, reader: jspb.BinaryReader): VoteRequest;
}

export namespace VoteRequest {
  export type AsObject = {
    candidateAddress?: proto_loom_pb.Address.AsObject,
    amount: number,
  }
}

export class VoteResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VoteResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VoteResponse): VoteResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VoteResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VoteResponse;
  static deserializeBinaryFromReader(message: VoteResponse, reader: jspb.BinaryReader): VoteResponse;
}

export namespace VoteResponse {
  export type AsObject = {
  }
}

export class ProxyVoteRequest extends jspb.Message {
  hasProxyAddress(): boolean;
  clearProxyAddress(): void;
  getProxyAddress(): proto_loom_pb.Address | undefined;
  setProxyAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProxyVoteRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ProxyVoteRequest): ProxyVoteRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProxyVoteRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProxyVoteRequest;
  static deserializeBinaryFromReader(message: ProxyVoteRequest, reader: jspb.BinaryReader): ProxyVoteRequest;
}

export namespace ProxyVoteRequest {
  export type AsObject = {
    proxyAddress?: proto_loom_pb.Address.AsObject,
  }
}

export class ProxyVoteResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProxyVoteResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ProxyVoteResponse): ProxyVoteResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProxyVoteResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProxyVoteResponse;
  static deserializeBinaryFromReader(message: ProxyVoteResponse, reader: jspb.BinaryReader): ProxyVoteResponse;
}

export namespace ProxyVoteResponse {
  export type AsObject = {
  }
}

export class UnproxyVoteRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnproxyVoteRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnproxyVoteRequest): UnproxyVoteRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnproxyVoteRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnproxyVoteRequest;
  static deserializeBinaryFromReader(message: UnproxyVoteRequest, reader: jspb.BinaryReader): UnproxyVoteRequest;
}

export namespace UnproxyVoteRequest {
  export type AsObject = {
  }
}

export class UnproxyVoteResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnproxyVoteResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UnproxyVoteResponse): UnproxyVoteResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnproxyVoteResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnproxyVoteResponse;
  static deserializeBinaryFromReader(message: UnproxyVoteResponse, reader: jspb.BinaryReader): UnproxyVoteResponse;
}

export namespace UnproxyVoteResponse {
  export type AsObject = {
  }
}

export class ElectRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ElectRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ElectRequest): ElectRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ElectRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ElectRequest;
  static deserializeBinaryFromReader(message: ElectRequest, reader: jspb.BinaryReader): ElectRequest;
}

export namespace ElectRequest {
  export type AsObject = {
  }
}

export class ElectResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ElectResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ElectResponse): ElectResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ElectResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ElectResponse;
  static deserializeBinaryFromReader(message: ElectResponse, reader: jspb.BinaryReader): ElectResponse;
}

export namespace ElectResponse {
  export type AsObject = {
  }
}

export class ListWitnessesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListWitnessesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListWitnessesRequest): ListWitnessesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListWitnessesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListWitnessesRequest;
  static deserializeBinaryFromReader(message: ListWitnessesRequest, reader: jspb.BinaryReader): ListWitnessesRequest;
}

export namespace ListWitnessesRequest {
  export type AsObject = {
  }
}

export class ListWitnessesResponse extends jspb.Message {
  clearWitnessesList(): void;
  getWitnessesList(): Array<Witness>;
  setWitnessesList(value: Array<Witness>): void;
  addWitnesses(value?: Witness, index?: number): Witness;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListWitnessesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListWitnessesResponse): ListWitnessesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListWitnessesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListWitnessesResponse;
  static deserializeBinaryFromReader(message: ListWitnessesResponse, reader: jspb.BinaryReader): ListWitnessesResponse;
}

export namespace ListWitnessesResponse {
  export type AsObject = {
    witnessesList: Array<Witness.AsObject>,
  }
}

export class ListCandidateRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListCandidateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListCandidateRequest): ListCandidateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListCandidateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListCandidateRequest;
  static deserializeBinaryFromReader(message: ListCandidateRequest, reader: jspb.BinaryReader): ListCandidateRequest;
}

export namespace ListCandidateRequest {
  export type AsObject = {
  }
}

export class ListCandidateResponse extends jspb.Message {
  clearCandidatesList(): void;
  getCandidatesList(): Array<Candidate>;
  setCandidatesList(value: Array<Candidate>): void;
  addCandidates(value?: Candidate, index?: number): Candidate;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListCandidateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListCandidateResponse): ListCandidateResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListCandidateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListCandidateResponse;
  static deserializeBinaryFromReader(message: ListCandidateResponse, reader: jspb.BinaryReader): ListCandidateResponse;
}

export namespace ListCandidateResponse {
  export type AsObject = {
    candidatesList: Array<Candidate.AsObject>,
  }
}

