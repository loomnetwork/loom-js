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

export class BigUInt extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BigUInt.AsObject;
  static toObject(includeInstance: boolean, msg: BigUInt): BigUInt.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BigUInt, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BigUInt;
  static deserializeBinaryFromReader(message: BigUInt, reader: jspb.BinaryReader): BigUInt;
}

export namespace BigUInt {
  export type AsObject = {
    value: Uint8Array | string,
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

  getName(): string;
  setName(value: string): void;

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
    name: string,
  }
}

export class DeployResponse extends jspb.Message {
  hasContract(): boolean;
  clearContract(): void;
  getContract(): Address | undefined;
  setContract(value?: Address): void;

  getOutput(): Uint8Array | string;
  getOutput_asU8(): Uint8Array;
  getOutput_asB64(): string;
  setOutput(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeployResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeployResponse): DeployResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeployResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeployResponse;
  static deserializeBinaryFromReader(message: DeployResponse, reader: jspb.BinaryReader): DeployResponse;
}

export namespace DeployResponse {
  export type AsObject = {
    contract?: Address.AsObject,
    output: Uint8Array | string,
  }
}

export class DeployResponseData extends jspb.Message {
  getTxHash(): Uint8Array | string;
  getTxHash_asU8(): Uint8Array;
  getTxHash_asB64(): string;
  setTxHash(value: Uint8Array | string): void;

  getBytecode(): Uint8Array | string;
  getBytecode_asU8(): Uint8Array;
  getBytecode_asB64(): string;
  setBytecode(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeployResponseData.AsObject;
  static toObject(includeInstance: boolean, msg: DeployResponseData): DeployResponseData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeployResponseData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeployResponseData;
  static deserializeBinaryFromReader(message: DeployResponseData, reader: jspb.BinaryReader): DeployResponseData;
}

export namespace DeployResponseData {
  export type AsObject = {
    txHash: Uint8Array | string,
    bytecode: Uint8Array | string,
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

export class EthFilterEnvelope extends jspb.Message {
  hasEthBlockHashList(): boolean;
  clearEthBlockHashList(): void;
  getEthBlockHashList(): EthBlockHashList | undefined;
  setEthBlockHashList(value?: EthBlockHashList): void;

  hasEthFilterLogList(): boolean;
  clearEthFilterLogList(): void;
  getEthFilterLogList(): EthFilterLogList | undefined;
  setEthFilterLogList(value?: EthFilterLogList): void;

  hasEthTxHashList(): boolean;
  clearEthTxHashList(): void;
  getEthTxHashList(): EthTxHashList | undefined;
  setEthTxHashList(value?: EthTxHashList): void;

  getMessageCase(): EthFilterEnvelope.MessageCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EthFilterEnvelope.AsObject;
  static toObject(includeInstance: boolean, msg: EthFilterEnvelope): EthFilterEnvelope.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EthFilterEnvelope, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EthFilterEnvelope;
  static deserializeBinaryFromReader(message: EthFilterEnvelope, reader: jspb.BinaryReader): EthFilterEnvelope;
}

export namespace EthFilterEnvelope {
  export type AsObject = {
    ethBlockHashList?: EthBlockHashList.AsObject,
    ethFilterLogList?: EthFilterLogList.AsObject,
    ethTxHashList?: EthTxHashList.AsObject,
  }

  export enum MessageCase {
    MESSAGE_NOT_SET = 0,
    ETH_BLOCK_HASH_LIST = 1,
    ETH_FILTER_LOG_LIST = 2,
    ETH_TX_HASH_LIST = 3,
  }
}

export class EthBlockHashList extends jspb.Message {
  clearEthBlockHashList(): void;
  getEthBlockHashList(): Array<Uint8Array | string>;
  getEthBlockHashList_asU8(): Array<Uint8Array>;
  getEthBlockHashList_asB64(): Array<string>;
  setEthBlockHashList(value: Array<Uint8Array | string>): void;
  addEthBlockHash(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EthBlockHashList.AsObject;
  static toObject(includeInstance: boolean, msg: EthBlockHashList): EthBlockHashList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EthBlockHashList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EthBlockHashList;
  static deserializeBinaryFromReader(message: EthBlockHashList, reader: jspb.BinaryReader): EthBlockHashList;
}

export namespace EthBlockHashList {
  export type AsObject = {
    ethBlockHashList: Array<Uint8Array | string>,
  }
}

export class EthTxHashList extends jspb.Message {
  clearEthTxHashList(): void;
  getEthTxHashList(): Array<Uint8Array | string>;
  getEthTxHashList_asU8(): Array<Uint8Array>;
  getEthTxHashList_asB64(): Array<string>;
  setEthTxHashList(value: Array<Uint8Array | string>): void;
  addEthTxHash(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EthTxHashList.AsObject;
  static toObject(includeInstance: boolean, msg: EthTxHashList): EthTxHashList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EthTxHashList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EthTxHashList;
  static deserializeBinaryFromReader(message: EthTxHashList, reader: jspb.BinaryReader): EthTxHashList;
}

export namespace EthTxHashList {
  export type AsObject = {
    ethTxHashList: Array<Uint8Array | string>,
  }
}

export class EventDataList extends jspb.Message {
  clearEventsList(): void;
  getEventsList(): Array<EventData>;
  setEventsList(value: Array<EventData>): void;
  addEvents(value?: EventData, index?: number): EventData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventDataList.AsObject;
  static toObject(includeInstance: boolean, msg: EventDataList): EventDataList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EventDataList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventDataList;
  static deserializeBinaryFromReader(message: EventDataList, reader: jspb.BinaryReader): EventDataList;
}

export namespace EventDataList {
  export type AsObject = {
    eventsList: Array<EventData.AsObject>,
  }
}

export class EventData extends jspb.Message {
  clearTopicsList(): void;
  getTopicsList(): Array<string>;
  setTopicsList(value: Array<string>): void;
  addTopics(value: string, index?: number): string;

  hasCaller(): boolean;
  clearCaller(): void;
  getCaller(): Address | undefined;
  setCaller(value?: Address): void;

  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): Address | undefined;
  setAddress(value?: Address): void;

  getPluginName(): string;
  setPluginName(value: string): void;

  getBlockHeight(): number;
  setBlockHeight(value: number): void;

  getEncodedBody(): Uint8Array | string;
  getEncodedBody_asU8(): Uint8Array;
  getEncodedBody_asB64(): string;
  setEncodedBody(value: Uint8Array | string): void;

  getOriginalRequest(): Uint8Array | string;
  getOriginalRequest_asU8(): Uint8Array;
  getOriginalRequest_asB64(): string;
  setOriginalRequest(value: Uint8Array | string): void;

  getTxHash(): Uint8Array | string;
  getTxHash_asU8(): Uint8Array;
  getTxHash_asB64(): string;
  setTxHash(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventData.AsObject;
  static toObject(includeInstance: boolean, msg: EventData): EventData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EventData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventData;
  static deserializeBinaryFromReader(message: EventData, reader: jspb.BinaryReader): EventData;
}

export namespace EventData {
  export type AsObject = {
    topicsList: Array<string>,
    caller?: Address.AsObject,
    address?: Address.AsObject,
    pluginName: string,
    blockHeight: number,
    encodedBody: Uint8Array | string,
    originalRequest: Uint8Array | string,
    txHash: Uint8Array | string,
  }
}

export class TxReceiptList extends jspb.Message {
  clearTxReceiptsList(): void;
  getTxReceiptsList(): Array<EvmTxReceipt>;
  setTxReceiptsList(value: Array<EvmTxReceipt>): void;
  addTxReceipts(value?: EvmTxReceipt, index?: number): EvmTxReceipt;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxReceiptList.AsObject;
  static toObject(includeInstance: boolean, msg: TxReceiptList): TxReceiptList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TxReceiptList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TxReceiptList;
  static deserializeBinaryFromReader(message: TxReceiptList, reader: jspb.BinaryReader): TxReceiptList;
}

export namespace TxReceiptList {
  export type AsObject = {
    txReceiptsList: Array<EvmTxReceipt.AsObject>,
  }
}

export class EvmTxReceipt extends jspb.Message {
  getTransactionIndex(): number;
  setTransactionIndex(value: number): void;

  getBlockHash(): Uint8Array | string;
  getBlockHash_asU8(): Uint8Array;
  getBlockHash_asB64(): string;
  setBlockHash(value: Uint8Array | string): void;

  getBlockNumber(): number;
  setBlockNumber(value: number): void;

  getCumulativeGasUsed(): number;
  setCumulativeGasUsed(value: number): void;

  getGasUsed(): number;
  setGasUsed(value: number): void;

  getContractAddress(): Uint8Array | string;
  getContractAddress_asU8(): Uint8Array;
  getContractAddress_asB64(): string;
  setContractAddress(value: Uint8Array | string): void;

  clearLogsList(): void;
  getLogsList(): Array<EventData>;
  setLogsList(value: Array<EventData>): void;
  addLogs(value?: EventData, index?: number): EventData;

  getLogsBloom(): Uint8Array | string;
  getLogsBloom_asU8(): Uint8Array;
  getLogsBloom_asB64(): string;
  setLogsBloom(value: Uint8Array | string): void;

  getStatus(): number;
  setStatus(value: number): void;

  getTxHash(): Uint8Array | string;
  getTxHash_asU8(): Uint8Array;
  getTxHash_asB64(): string;
  setTxHash(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvmTxReceipt.AsObject;
  static toObject(includeInstance: boolean, msg: EvmTxReceipt): EvmTxReceipt.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EvmTxReceipt, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EvmTxReceipt;
  static deserializeBinaryFromReader(message: EvmTxReceipt, reader: jspb.BinaryReader): EvmTxReceipt;
}

export namespace EvmTxReceipt {
  export type AsObject = {
    transactionIndex: number,
    blockHash: Uint8Array | string,
    blockNumber: number,
    cumulativeGasUsed: number,
    gasUsed: number,
    contractAddress: Uint8Array | string,
    logsList: Array<EventData.AsObject>,
    logsBloom: Uint8Array | string,
    status: number,
    txHash: Uint8Array | string,
  }
}

export class EvmTxObject extends jspb.Message {
  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  getNonce(): number;
  setNonce(value: number): void;

  getBlockHash(): Uint8Array | string;
  getBlockHash_asU8(): Uint8Array;
  getBlockHash_asB64(): string;
  setBlockHash(value: Uint8Array | string): void;

  getBlockNumber(): number;
  setBlockNumber(value: number): void;

  getTransactionIndex(): number;
  setTransactionIndex(value: number): void;

  getFrom(): Uint8Array | string;
  getFrom_asU8(): Uint8Array;
  getFrom_asB64(): string;
  setFrom(value: Uint8Array | string): void;

  getTo(): Uint8Array | string;
  getTo_asU8(): Uint8Array;
  getTo_asB64(): string;
  setTo(value: Uint8Array | string): void;

  getValue(): number;
  setValue(value: number): void;

  getGasPrice(): number;
  setGasPrice(value: number): void;

  getGas(): number;
  setGas(value: number): void;

  getInput(): Uint8Array | string;
  getInput_asU8(): Uint8Array;
  getInput_asB64(): string;
  setInput(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvmTxObject.AsObject;
  static toObject(includeInstance: boolean, msg: EvmTxObject): EvmTxObject.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EvmTxObject, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EvmTxObject;
  static deserializeBinaryFromReader(message: EvmTxObject, reader: jspb.BinaryReader): EvmTxObject;
}

export namespace EvmTxObject {
  export type AsObject = {
    hash: Uint8Array | string,
    nonce: number,
    blockHash: Uint8Array | string,
    blockNumber: number,
    transactionIndex: number,
    from: Uint8Array | string,
    to: Uint8Array | string,
    value: number,
    gasPrice: number,
    gas: number,
    input: Uint8Array | string,
  }
}

export class EthBlockInfo extends jspb.Message {
  getNumber(): number;
  setNumber(value: number): void;

  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  getParentHash(): Uint8Array | string;
  getParentHash_asU8(): Uint8Array;
  getParentHash_asB64(): string;
  setParentHash(value: Uint8Array | string): void;

  getNonce(): Uint8Array | string;
  getNonce_asU8(): Uint8Array;
  getNonce_asB64(): string;
  setNonce(value: Uint8Array | string): void;

  getSha3Uncles(): Uint8Array | string;
  getSha3Uncles_asU8(): Uint8Array;
  getSha3Uncles_asB64(): string;
  setSha3Uncles(value: Uint8Array | string): void;

  getLogsBloom(): Uint8Array | string;
  getLogsBloom_asU8(): Uint8Array;
  getLogsBloom_asB64(): string;
  setLogsBloom(value: Uint8Array | string): void;

  getTransactionsRoot(): Uint8Array | string;
  getTransactionsRoot_asU8(): Uint8Array;
  getTransactionsRoot_asB64(): string;
  setTransactionsRoot(value: Uint8Array | string): void;

  getStateRoot(): Uint8Array | string;
  getStateRoot_asU8(): Uint8Array;
  getStateRoot_asB64(): string;
  setStateRoot(value: Uint8Array | string): void;

  getReceiptsRoot(): Uint8Array | string;
  getReceiptsRoot_asU8(): Uint8Array;
  getReceiptsRoot_asB64(): string;
  setReceiptsRoot(value: Uint8Array | string): void;

  getMiner(): Uint8Array | string;
  getMiner_asU8(): Uint8Array;
  getMiner_asB64(): string;
  setMiner(value: Uint8Array | string): void;

  getDifficulty(): number;
  setDifficulty(value: number): void;

  getTotalDifficulty(): number;
  setTotalDifficulty(value: number): void;

  getExtraData(): Uint8Array | string;
  getExtraData_asU8(): Uint8Array;
  getExtraData_asB64(): string;
  setExtraData(value: Uint8Array | string): void;

  getSize(): number;
  setSize(value: number): void;

  getGaslimit(): number;
  setGaslimit(value: number): void;

  getGasused(): number;
  setGasused(value: number): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  clearTransactionsList(): void;
  getTransactionsList(): Array<Uint8Array | string>;
  getTransactionsList_asU8(): Array<Uint8Array>;
  getTransactionsList_asB64(): Array<string>;
  setTransactionsList(value: Array<Uint8Array | string>): void;
  addTransactions(value: Uint8Array | string, index?: number): Uint8Array | string;

  clearUnclesList(): void;
  getUnclesList(): Array<Uint8Array | string>;
  getUnclesList_asU8(): Array<Uint8Array>;
  getUnclesList_asB64(): Array<string>;
  setUnclesList(value: Array<Uint8Array | string>): void;
  addUncles(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EthBlockInfo.AsObject;
  static toObject(includeInstance: boolean, msg: EthBlockInfo): EthBlockInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EthBlockInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EthBlockInfo;
  static deserializeBinaryFromReader(message: EthBlockInfo, reader: jspb.BinaryReader): EthBlockInfo;
}

export namespace EthBlockInfo {
  export type AsObject = {
    number: number,
    hash: Uint8Array | string,
    parentHash: Uint8Array | string,
    nonce: Uint8Array | string,
    sha3Uncles: Uint8Array | string,
    logsBloom: Uint8Array | string,
    transactionsRoot: Uint8Array | string,
    stateRoot: Uint8Array | string,
    receiptsRoot: Uint8Array | string,
    miner: Uint8Array | string,
    difficulty: number,
    totalDifficulty: number,
    extraData: Uint8Array | string,
    size: number,
    gaslimit: number,
    gasused: number,
    timestamp: number,
    transactionsList: Array<Uint8Array | string>,
    unclesList: Array<Uint8Array | string>,
  }
}

export class EthFilterLogList extends jspb.Message {
  clearEthBlockLogsList(): void;
  getEthBlockLogsList(): Array<EthFilterLog>;
  setEthBlockLogsList(value: Array<EthFilterLog>): void;
  addEthBlockLogs(value?: EthFilterLog, index?: number): EthFilterLog;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EthFilterLogList.AsObject;
  static toObject(includeInstance: boolean, msg: EthFilterLogList): EthFilterLogList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EthFilterLogList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EthFilterLogList;
  static deserializeBinaryFromReader(message: EthFilterLogList, reader: jspb.BinaryReader): EthFilterLogList;
}

export namespace EthFilterLogList {
  export type AsObject = {
    ethBlockLogsList: Array<EthFilterLog.AsObject>,
  }
}

export class EthFilterLog extends jspb.Message {
  getRemoved(): boolean;
  setRemoved(value: boolean): void;

  getLogIndex(): number;
  setLogIndex(value: number): void;

  getTransactionIndex(): number;
  setTransactionIndex(value: number): void;

  getTransactionHash(): Uint8Array | string;
  getTransactionHash_asU8(): Uint8Array;
  getTransactionHash_asB64(): string;
  setTransactionHash(value: Uint8Array | string): void;

  getBlockHash(): Uint8Array | string;
  getBlockHash_asU8(): Uint8Array;
  getBlockHash_asB64(): string;
  setBlockHash(value: Uint8Array | string): void;

  getBlockNumber(): number;
  setBlockNumber(value: number): void;

  getAddress(): Uint8Array | string;
  getAddress_asU8(): Uint8Array;
  getAddress_asB64(): string;
  setAddress(value: Uint8Array | string): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  clearTopicsList(): void;
  getTopicsList(): Array<Uint8Array | string>;
  getTopicsList_asU8(): Array<Uint8Array>;
  getTopicsList_asB64(): Array<string>;
  setTopicsList(value: Array<Uint8Array | string>): void;
  addTopics(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EthFilterLog.AsObject;
  static toObject(includeInstance: boolean, msg: EthFilterLog): EthFilterLog.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EthFilterLog, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EthFilterLog;
  static deserializeBinaryFromReader(message: EthFilterLog, reader: jspb.BinaryReader): EthFilterLog;
}

export namespace EthFilterLog {
  export type AsObject = {
    removed: boolean,
    logIndex: number,
    transactionIndex: number,
    transactionHash: Uint8Array | string,
    blockHash: Uint8Array | string,
    blockNumber: number,
    address: Uint8Array | string,
    data: Uint8Array | string,
    topicsList: Array<Uint8Array | string>,
  }
}

export class AddressMapperMapping extends jspb.Message {
  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): Address | undefined;
  setFrom(value?: Address): void;

  hasTo(): boolean;
  clearTo(): void;
  getTo(): Address | undefined;
  setTo(value?: Address): void;

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
    from?: Address.AsObject,
    to?: Address.AsObject,
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
  getFrom(): Address | undefined;
  setFrom(value?: Address): void;

  hasTo(): boolean;
  clearTo(): void;
  getTo(): Address | undefined;
  setTo(value?: Address): void;

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
    from?: Address.AsObject,
    to?: Address.AsObject,
    signature: Uint8Array | string,
  }
}

export class AddressMapperAddContractMappingRequest extends jspb.Message {
  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): Address | undefined;
  setFrom(value?: Address): void;

  hasTo(): boolean;
  clearTo(): void;
  getTo(): Address | undefined;
  setTo(value?: Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddressMapperAddContractMappingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddressMapperAddContractMappingRequest): AddressMapperAddContractMappingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddressMapperAddContractMappingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddressMapperAddContractMappingRequest;
  static deserializeBinaryFromReader(message: AddressMapperAddContractMappingRequest, reader: jspb.BinaryReader): AddressMapperAddContractMappingRequest;
}

export namespace AddressMapperAddContractMappingRequest {
  export type AsObject = {
    from?: Address.AsObject,
    to?: Address.AsObject,
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
  getFrom(): Address | undefined;
  setFrom(value?: Address): void;

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
    from?: Address.AsObject,
  }
}

export class AddressMapperGetMappingResponse extends jspb.Message {
  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): Address | undefined;
  setFrom(value?: Address): void;

  hasTo(): boolean;
  clearTo(): void;
  getTo(): Address | undefined;
  setTo(value?: Address): void;

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
    from?: Address.AsObject,
    to?: Address.AsObject,
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

