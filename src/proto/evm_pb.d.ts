// package: 
// file: proto/evm.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

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
  getCaller(): proto_loom_pb.Address | undefined;
  setCaller(value?: proto_loom_pb.Address): void;

  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

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

  getTransactionIndex(): number;
  setTransactionIndex(value: number): void;

  getBlockHash(): Uint8Array | string;
  getBlockHash_asU8(): Uint8Array;
  getBlockHash_asB64(): string;
  setBlockHash(value: Uint8Array | string): void;

  getBlockTime(): number;
  setBlockTime(value: number): void;

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
    caller?: proto_loom_pb.Address.AsObject,
    address?: proto_loom_pb.Address.AsObject,
    pluginName: string,
    blockHeight: number,
    encodedBody: Uint8Array | string,
    originalRequest: Uint8Array | string,
    txHash: Uint8Array | string,
    transactionIndex: number,
    blockHash: Uint8Array | string,
    blockTime: number,
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

  getBlockTime(): number;
  setBlockTime(value: number): void;

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
    blockTime: number,
  }
}

