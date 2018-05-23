// package: 
// file: proto/loom.proto

import * as jspb from "google-protobuf";

export class SignedTx extends jspb.Message {
  getInner(): Uint8Array | string;
  getInner_asU8(): Uint8Array;
  getInner_asB64(): string;
  setInner(value: Uint8Array | string): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  getPublicKey(): Uint8Array | string;
  getPublicKey_asU8(): Uint8Array;
  getPublicKey_asB64(): string;
  setPublicKey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignedTx.AsObject;
  static toObject(includeInstance: boolean, msg: SignedTx): SignedTx.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignedTx, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignedTx;
  static deserializeBinaryFromReader(message: SignedTx, reader: jspb.BinaryReader): SignedTx;
}

export namespace SignedTx {
  export type AsObject = {
    inner: Uint8Array | string,
    signature: Uint8Array | string,
    publicKey: Uint8Array | string,
  }
}

export class NonceTx extends jspb.Message {
  getInner(): Uint8Array | string;
  getInner_asU8(): Uint8Array;
  getInner_asB64(): string;
  setInner(value: Uint8Array | string): void;

  getSequence(): number;
  setSequence(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NonceTx.AsObject;
  static toObject(includeInstance: boolean, msg: NonceTx): NonceTx.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NonceTx, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NonceTx;
  static deserializeBinaryFromReader(message: NonceTx, reader: jspb.BinaryReader): NonceTx;
}

export namespace NonceTx {
  export type AsObject = {
    inner: Uint8Array | string,
    sequence: number,
  }
}

export class Address extends jspb.Message {
  getChainId(): string;
  setChainId(value: string): void;

  getLocal(): Uint8Array | string;
  getLocal_asU8(): Uint8Array;
  getLocal_asB64(): string;
  setLocal(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Address.AsObject;
  static toObject(includeInstance: boolean, msg: Address): Address.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Address, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Address;
  static deserializeBinaryFromReader(message: Address, reader: jspb.BinaryReader): Address;
}

export namespace Address {
  export type AsObject = {
    chainId: string,
    local: Uint8Array | string,
  }
}

export class Transaction extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transaction.AsObject;
  static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transaction;
  static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
  export type AsObject = {
    id: number,
    data: Uint8Array | string,
  }
}

export class MessageTx extends jspb.Message {
  hasTo(): boolean;
  clearTo(): void;
  getTo(): Address | undefined;
  setTo(value?: Address): void;

  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): Address | undefined;
  setFrom(value?: Address): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageTx.AsObject;
  static toObject(includeInstance: boolean, msg: MessageTx): MessageTx.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageTx, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageTx;
  static deserializeBinaryFromReader(message: MessageTx, reader: jspb.BinaryReader): MessageTx;
}

export namespace MessageTx {
  export type AsObject = {
    to?: Address.AsObject,
    from?: Address.AsObject,
    data: Uint8Array | string,
  }
}

export class DeployTx extends jspb.Message {
  getVmType(): VMType;
  setVmType(value: VMType): void;

  getCode(): Uint8Array | string;
  getCode_asU8(): Uint8Array;
  getCode_asB64(): string;
  setCode(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeployTx.AsObject;
  static toObject(includeInstance: boolean, msg: DeployTx): DeployTx.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeployTx, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeployTx;
  static deserializeBinaryFromReader(message: DeployTx, reader: jspb.BinaryReader): DeployTx;
}

export namespace DeployTx {
  export type AsObject = {
    vmType: VMType,
    code: Uint8Array | string,
  }
}

export class CallTx extends jspb.Message {
  getVmType(): VMType;
  setVmType(value: VMType): void;

  getInput(): Uint8Array | string;
  getInput_asU8(): Uint8Array;
  getInput_asB64(): string;
  setInput(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CallTx.AsObject;
  static toObject(includeInstance: boolean, msg: CallTx): CallTx.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CallTx, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CallTx;
  static deserializeBinaryFromReader(message: CallTx, reader: jspb.BinaryReader): CallTx;
}

export namespace CallTx {
  export type AsObject = {
    vmType: VMType,
    input: Uint8Array | string,
  }
}

export class PluginCode extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getInput(): Uint8Array | string;
  getInput_asU8(): Uint8Array;
  getInput_asB64(): string;
  setInput(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PluginCode.AsObject;
  static toObject(includeInstance: boolean, msg: PluginCode): PluginCode.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PluginCode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PluginCode;
  static deserializeBinaryFromReader(message: PluginCode, reader: jspb.BinaryReader): PluginCode;
}

export namespace PluginCode {
  export type AsObject = {
    name: string,
    input: Uint8Array | string,
  }
}

export class Request extends jspb.Message {
  getContentType(): EncodingType;
  setContentType(value: EncodingType): void;

  getAccept(): EncodingType;
  setAccept(value: EncodingType): void;

  getBody(): Uint8Array | string;
  getBody_asU8(): Uint8Array;
  getBody_asB64(): string;
  setBody(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Request.AsObject;
  static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Request;
  static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
}

export namespace Request {
  export type AsObject = {
    contentType: EncodingType,
    accept: EncodingType,
    body: Uint8Array | string,
  }
}

export class Response extends jspb.Message {
  getContentType(): EncodingType;
  setContentType(value: EncodingType): void;

  getBody(): Uint8Array | string;
  getBody_asU8(): Uint8Array;
  getBody_asB64(): string;
  setBody(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Response.AsObject;
  static toObject(includeInstance: boolean, msg: Response): Response.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Response, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Response;
  static deserializeBinaryFromReader(message: Response, reader: jspb.BinaryReader): Response;
}

export namespace Response {
  export type AsObject = {
    contentType: EncodingType,
    body: Uint8Array | string,
  }
}

export class ContractMethodCall extends jspb.Message {
  getMethod(): string;
  setMethod(value: string): void;

  getArgs(): Uint8Array | string;
  getArgs_asU8(): Uint8Array;
  getArgs_asB64(): string;
  setArgs(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContractMethodCall.AsObject;
  static toObject(includeInstance: boolean, msg: ContractMethodCall): ContractMethodCall.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ContractMethodCall, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContractMethodCall;
  static deserializeBinaryFromReader(message: ContractMethodCall, reader: jspb.BinaryReader): ContractMethodCall;
}

export namespace ContractMethodCall {
  export type AsObject = {
    method: string,
    args: Uint8Array | string,
  }
}

export class Event extends jspb.Message {
  hasContract(): boolean;
  clearContract(): void;
  getContract(): Address | undefined;
  setContract(value?: Address): void;

  clearTopicsList(): void;
  getTopicsList(): Array<Uint8Array | string>;
  getTopicsList_asU8(): Array<Uint8Array>;
  getTopicsList_asB64(): Array<string>;
  setTopicsList(value: Array<Uint8Array | string>): void;
  addTopics(value: Uint8Array | string, index?: number): Uint8Array | string;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Event.AsObject;
  static toObject(includeInstance: boolean, msg: Event): Event.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Event, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Event;
  static deserializeBinaryFromReader(message: Event, reader: jspb.BinaryReader): Event;
}

export namespace Event {
  export type AsObject = {
    contract?: Address.AsObject,
    topicsList: Array<Uint8Array | string>,
    data: Uint8Array | string,
  }
}

export class EvmTxReciept extends jspb.Message {
  getTransactionindex(): number;
  setTransactionindex(value: number): void;

  getBlockhash(): Uint8Array | string;
  getBlockhash_asU8(): Uint8Array;
  getBlockhash_asB64(): string;
  setBlockhash(value: Uint8Array | string): void;

  getBlocknumber(): number;
  setBlocknumber(value: number): void;

  getCumulativegasused(): number;
  setCumulativegasused(value: number): void;

  getGasused(): number;
  setGasused(value: number): void;

  getContractaddress(): Uint8Array | string;
  getContractaddress_asU8(): Uint8Array;
  getContractaddress_asB64(): string;
  setContractaddress(value: Uint8Array | string): void;

  clearLogsList(): void;
  getLogsList(): Array<Event>;
  setLogsList(value: Array<Event>): void;
  addLogs(value?: Event, index?: number): Event;

  getLogsbloom(): Uint8Array | string;
  getLogsbloom_asU8(): Uint8Array;
  getLogsbloom_asB64(): string;
  setLogsbloom(value: Uint8Array | string): void;

  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvmTxReciept.AsObject;
  static toObject(includeInstance: boolean, msg: EvmTxReciept): EvmTxReciept.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EvmTxReciept, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EvmTxReciept;
  static deserializeBinaryFromReader(message: EvmTxReciept, reader: jspb.BinaryReader): EvmTxReciept;
}

export namespace EvmTxReciept {
  export type AsObject = {
    transactionindex: number,
    blockhash: Uint8Array | string,
    blocknumber: number,
    cumulativegasused: number,
    gasused: number,
    contractaddress: Uint8Array | string,
    logsList: Array<Event.AsObject>,
    logsbloom: Uint8Array | string,
    status: number,
  }
}

export enum VMType {
  PLUGIN = 0,
  EVM = 1,
}

export enum EncodingType {
  JSON = 0,
  PROTOBUF3 = 1,
}

