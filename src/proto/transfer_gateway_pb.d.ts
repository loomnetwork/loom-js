// package: 
// file: proto/transfer_gateway.proto

import * as jspb from "google-protobuf";
import * as proto_loom_pb from "../proto/loom_pb";

export class TransferGatewayState extends jspb.Message {
  hasOwner(): boolean;
  clearOwner(): void;
  getOwner(): proto_loom_pb.Address | undefined;
  setOwner(value?: proto_loom_pb.Address): void;

  getLastMainnetBlockNum(): number;
  setLastMainnetBlockNum(value: number): void;

  getNextContractMappingId(): number;
  setNextContractMappingId(value: number): void;

  clearTokenWithdrawersList(): void;
  getTokenWithdrawersList(): Array<proto_loom_pb.Address>;
  setTokenWithdrawersList(value: Array<proto_loom_pb.Address>): void;
  addTokenWithdrawers(value?: proto_loom_pb.Address, index?: number): proto_loom_pb.Address;

  hasTransferFee(): boolean;
  clearTransferFee(): void;
  getTransferFee(): proto_loom_pb.BigUInt | undefined;
  setTransferFee(value?: proto_loom_pb.BigUInt): void;

  hasMainnetGatewayAddress(): boolean;
  clearMainnetGatewayAddress(): void;
  getMainnetGatewayAddress(): proto_loom_pb.Address | undefined;
  setMainnetGatewayAddress(value?: proto_loom_pb.Address): void;

  hasMainnetHotWalletAddress(): boolean;
  clearMainnetHotWalletAddress(): void;
  getMainnetHotWalletAddress(): proto_loom_pb.Address | undefined;
  setMainnetHotWalletAddress(value?: proto_loom_pb.Address): void;

  hasMaxTotalDailyWithdrawalAmount(): boolean;
  clearMaxTotalDailyWithdrawalAmount(): void;
  getMaxTotalDailyWithdrawalAmount(): proto_loom_pb.BigUInt | undefined;
  setMaxTotalDailyWithdrawalAmount(value?: proto_loom_pb.BigUInt): void;

  hasMaxPerAccountDailyWithdrawalAmount(): boolean;
  clearMaxPerAccountDailyWithdrawalAmount(): void;
  getMaxPerAccountDailyWithdrawalAmount(): proto_loom_pb.BigUInt | undefined;
  setMaxPerAccountDailyWithdrawalAmount(value?: proto_loom_pb.BigUInt): void;

  getLastWithdrawalLimitResetTime(): number;
  setLastWithdrawalLimitResetTime(value: number): void;

  hasTotalWithdrawalAmount(): boolean;
  clearTotalWithdrawalAmount(): void;
  getTotalWithdrawalAmount(): proto_loom_pb.BigUInt | undefined;
  setTotalWithdrawalAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayState.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayState): TransferGatewayState.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayState;
  static deserializeBinaryFromReader(message: TransferGatewayState, reader: jspb.BinaryReader): TransferGatewayState;
}

export namespace TransferGatewayState {
  export type AsObject = {
    owner?: proto_loom_pb.Address.AsObject,
    lastMainnetBlockNum: number,
    nextContractMappingId: number,
    tokenWithdrawersList: Array<proto_loom_pb.Address.AsObject>,
    transferFee?: proto_loom_pb.BigUInt.AsObject,
    mainnetGatewayAddress?: proto_loom_pb.Address.AsObject,
    mainnetHotWalletAddress?: proto_loom_pb.Address.AsObject,
    maxTotalDailyWithdrawalAmount?: proto_loom_pb.BigUInt.AsObject,
    maxPerAccountDailyWithdrawalAmount?: proto_loom_pb.BigUInt.AsObject,
    lastWithdrawalLimitResetTime: number,
    totalWithdrawalAmount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class TransferGatewayStateRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayStateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayStateRequest): TransferGatewayStateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayStateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayStateRequest;
  static deserializeBinaryFromReader(message: TransferGatewayStateRequest, reader: jspb.BinaryReader): TransferGatewayStateRequest;
}

export namespace TransferGatewayStateRequest {
  export type AsObject = {
  }
}

export class TransferGatewayStateResponse extends jspb.Message {
  hasState(): boolean;
  clearState(): void;
  getState(): TransferGatewayState | undefined;
  setState(value?: TransferGatewayState): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayStateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayStateResponse): TransferGatewayStateResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayStateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayStateResponse;
  static deserializeBinaryFromReader(message: TransferGatewayStateResponse, reader: jspb.BinaryReader): TransferGatewayStateResponse;
}

export namespace TransferGatewayStateResponse {
  export type AsObject = {
    state?: TransferGatewayState.AsObject,
  }
}

export class TransferGatewayWithdrawalReceipt extends jspb.Message {
  hasTokenOwner(): boolean;
  clearTokenOwner(): void;
  getTokenOwner(): proto_loom_pb.Address | undefined;
  setTokenOwner(value?: proto_loom_pb.Address): void;

  hasTokenContract(): boolean;
  clearTokenContract(): void;
  getTokenContract(): proto_loom_pb.Address | undefined;
  setTokenContract(value?: proto_loom_pb.Address): void;

  getTokenKind(): TransferGatewayTokenKind;
  setTokenKind(value: TransferGatewayTokenKind): void;

  hasTokenId(): boolean;
  clearTokenId(): void;
  getTokenId(): proto_loom_pb.BigUInt | undefined;
  setTokenId(value?: proto_loom_pb.BigUInt): void;

  hasTokenAmount(): boolean;
  clearTokenAmount(): void;
  getTokenAmount(): proto_loom_pb.BigUInt | undefined;
  setTokenAmount(value?: proto_loom_pb.BigUInt): void;

  getWithdrawalNonce(): number;
  setWithdrawalNonce(value: number): void;

  getOracleSignature(): Uint8Array | string;
  getOracleSignature_asU8(): Uint8Array;
  getOracleSignature_asB64(): string;
  setOracleSignature(value: Uint8Array | string): void;

  getTxHash(): Uint8Array | string;
  getTxHash_asU8(): Uint8Array;
  getTxHash_asB64(): string;
  setTxHash(value: Uint8Array | string): void;

  getTxStatus(): TransferGatewayTxStatus;
  setTxStatus(value: TransferGatewayTxStatus): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayWithdrawalReceipt.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayWithdrawalReceipt): TransferGatewayWithdrawalReceipt.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayWithdrawalReceipt, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayWithdrawalReceipt;
  static deserializeBinaryFromReader(message: TransferGatewayWithdrawalReceipt, reader: jspb.BinaryReader): TransferGatewayWithdrawalReceipt;
}

export namespace TransferGatewayWithdrawalReceipt {
  export type AsObject = {
    tokenOwner?: proto_loom_pb.Address.AsObject,
    tokenContract?: proto_loom_pb.Address.AsObject,
    tokenKind: TransferGatewayTokenKind,
    tokenId?: proto_loom_pb.BigUInt.AsObject,
    tokenAmount?: proto_loom_pb.BigUInt.AsObject,
    withdrawalNonce: number,
    oracleSignature: Uint8Array | string,
    txHash: Uint8Array | string,
    txStatus: TransferGatewayTxStatus,
  }
}

export class TransferGatewayContractMappingConfirmed extends jspb.Message {
  hasForeignContract(): boolean;
  clearForeignContract(): void;
  getForeignContract(): proto_loom_pb.Address | undefined;
  setForeignContract(value?: proto_loom_pb.Address): void;

  hasLocalContract(): boolean;
  clearLocalContract(): void;
  getLocalContract(): proto_loom_pb.Address | undefined;
  setLocalContract(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayContractMappingConfirmed.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayContractMappingConfirmed): TransferGatewayContractMappingConfirmed.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayContractMappingConfirmed, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayContractMappingConfirmed;
  static deserializeBinaryFromReader(message: TransferGatewayContractMappingConfirmed, reader: jspb.BinaryReader): TransferGatewayContractMappingConfirmed;
}

export namespace TransferGatewayContractMappingConfirmed {
  export type AsObject = {
    foreignContract?: proto_loom_pb.Address.AsObject,
    localContract?: proto_loom_pb.Address.AsObject,
  }
}

export class TransferGatewayTokenWithdrawalSigned extends jspb.Message {
  hasTokenOwner(): boolean;
  clearTokenOwner(): void;
  getTokenOwner(): proto_loom_pb.Address | undefined;
  setTokenOwner(value?: proto_loom_pb.Address): void;

  hasTokenContract(): boolean;
  clearTokenContract(): void;
  getTokenContract(): proto_loom_pb.Address | undefined;
  setTokenContract(value?: proto_loom_pb.Address): void;

  getTokenKind(): TransferGatewayTokenKind;
  setTokenKind(value: TransferGatewayTokenKind): void;

  hasTokenId(): boolean;
  clearTokenId(): void;
  getTokenId(): proto_loom_pb.BigUInt | undefined;
  setTokenId(value?: proto_loom_pb.BigUInt): void;

  hasTokenAmount(): boolean;
  clearTokenAmount(): void;
  getTokenAmount(): proto_loom_pb.BigUInt | undefined;
  setTokenAmount(value?: proto_loom_pb.BigUInt): void;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayTokenWithdrawalSigned.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayTokenWithdrawalSigned): TransferGatewayTokenWithdrawalSigned.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayTokenWithdrawalSigned, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayTokenWithdrawalSigned;
  static deserializeBinaryFromReader(message: TransferGatewayTokenWithdrawalSigned, reader: jspb.BinaryReader): TransferGatewayTokenWithdrawalSigned;
}

export namespace TransferGatewayTokenWithdrawalSigned {
  export type AsObject = {
    tokenOwner?: proto_loom_pb.Address.AsObject,
    tokenContract?: proto_loom_pb.Address.AsObject,
    tokenKind: TransferGatewayTokenKind,
    tokenId?: proto_loom_pb.BigUInt.AsObject,
    tokenAmount?: proto_loom_pb.BigUInt.AsObject,
    sig: Uint8Array | string,
  }
}

export class TransferGatewayAddContractMappingRequest extends jspb.Message {
  hasForeignContract(): boolean;
  clearForeignContract(): void;
  getForeignContract(): proto_loom_pb.Address | undefined;
  setForeignContract(value?: proto_loom_pb.Address): void;

  hasLocalContract(): boolean;
  clearLocalContract(): void;
  getLocalContract(): proto_loom_pb.Address | undefined;
  setLocalContract(value?: proto_loom_pb.Address): void;

  getForeignContractCreatorSig(): Uint8Array | string;
  getForeignContractCreatorSig_asU8(): Uint8Array;
  getForeignContractCreatorSig_asB64(): string;
  setForeignContractCreatorSig(value: Uint8Array | string): void;

  getForeignContractTxHash(): Uint8Array | string;
  getForeignContractTxHash_asU8(): Uint8Array;
  getForeignContractTxHash_asB64(): string;
  setForeignContractTxHash(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayAddContractMappingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayAddContractMappingRequest): TransferGatewayAddContractMappingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayAddContractMappingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayAddContractMappingRequest;
  static deserializeBinaryFromReader(message: TransferGatewayAddContractMappingRequest, reader: jspb.BinaryReader): TransferGatewayAddContractMappingRequest;
}

export namespace TransferGatewayAddContractMappingRequest {
  export type AsObject = {
    foreignContract?: proto_loom_pb.Address.AsObject,
    localContract?: proto_loom_pb.Address.AsObject,
    foreignContractCreatorSig: Uint8Array | string,
    foreignContractTxHash: Uint8Array | string,
  }
}

export class TransferGatewayReclaimDepositorTokensRequest extends jspb.Message {
  clearDepositorsList(): void;
  getDepositorsList(): Array<proto_loom_pb.Address>;
  setDepositorsList(value: Array<proto_loom_pb.Address>): void;
  addDepositors(value?: proto_loom_pb.Address, index?: number): proto_loom_pb.Address;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayReclaimDepositorTokensRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayReclaimDepositorTokensRequest): TransferGatewayReclaimDepositorTokensRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayReclaimDepositorTokensRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayReclaimDepositorTokensRequest;
  static deserializeBinaryFromReader(message: TransferGatewayReclaimDepositorTokensRequest, reader: jspb.BinaryReader): TransferGatewayReclaimDepositorTokensRequest;
}

export namespace TransferGatewayReclaimDepositorTokensRequest {
  export type AsObject = {
    depositorsList: Array<proto_loom_pb.Address.AsObject>,
  }
}

export class TransferGatewayReclaimContractTokensRequest extends jspb.Message {
  hasTokenContract(): boolean;
  clearTokenContract(): void;
  getTokenContract(): proto_loom_pb.Address | undefined;
  setTokenContract(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayReclaimContractTokensRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayReclaimContractTokensRequest): TransferGatewayReclaimContractTokensRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayReclaimContractTokensRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayReclaimContractTokensRequest;
  static deserializeBinaryFromReader(message: TransferGatewayReclaimContractTokensRequest, reader: jspb.BinaryReader): TransferGatewayReclaimContractTokensRequest;
}

export namespace TransferGatewayReclaimContractTokensRequest {
  export type AsObject = {
    tokenContract?: proto_loom_pb.Address.AsObject,
  }
}

export class TransferGatewayWithdrawTokenRequest extends jspb.Message {
  hasTokenContract(): boolean;
  clearTokenContract(): void;
  getTokenContract(): proto_loom_pb.Address | undefined;
  setTokenContract(value?: proto_loom_pb.Address): void;

  getTokenKind(): TransferGatewayTokenKind;
  setTokenKind(value: TransferGatewayTokenKind): void;

  hasTokenId(): boolean;
  clearTokenId(): void;
  getTokenId(): proto_loom_pb.BigUInt | undefined;
  setTokenId(value?: proto_loom_pb.BigUInt): void;

  hasTokenAmount(): boolean;
  clearTokenAmount(): void;
  getTokenAmount(): proto_loom_pb.BigUInt | undefined;
  setTokenAmount(value?: proto_loom_pb.BigUInt): void;

  hasRecipient(): boolean;
  clearRecipient(): void;
  getRecipient(): proto_loom_pb.Address | undefined;
  setRecipient(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayWithdrawTokenRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayWithdrawTokenRequest): TransferGatewayWithdrawTokenRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayWithdrawTokenRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayWithdrawTokenRequest;
  static deserializeBinaryFromReader(message: TransferGatewayWithdrawTokenRequest, reader: jspb.BinaryReader): TransferGatewayWithdrawTokenRequest;
}

export namespace TransferGatewayWithdrawTokenRequest {
  export type AsObject = {
    tokenContract?: proto_loom_pb.Address.AsObject,
    tokenKind: TransferGatewayTokenKind,
    tokenId?: proto_loom_pb.BigUInt.AsObject,
    tokenAmount?: proto_loom_pb.BigUInt.AsObject,
    recipient?: proto_loom_pb.Address.AsObject,
  }
}

export class TransferGatewayWithdrawETHRequest extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  hasMainnetGateway(): boolean;
  clearMainnetGateway(): void;
  getMainnetGateway(): proto_loom_pb.Address | undefined;
  setMainnetGateway(value?: proto_loom_pb.Address): void;

  hasRecipient(): boolean;
  clearRecipient(): void;
  getRecipient(): proto_loom_pb.Address | undefined;
  setRecipient(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayWithdrawETHRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayWithdrawETHRequest): TransferGatewayWithdrawETHRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayWithdrawETHRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayWithdrawETHRequest;
  static deserializeBinaryFromReader(message: TransferGatewayWithdrawETHRequest, reader: jspb.BinaryReader): TransferGatewayWithdrawETHRequest;
}

export namespace TransferGatewayWithdrawETHRequest {
  export type AsObject = {
    amount?: proto_loom_pb.BigUInt.AsObject,
    mainnetGateway?: proto_loom_pb.Address.AsObject,
    recipient?: proto_loom_pb.Address.AsObject,
  }
}

export class TransferGatewayWithdrawLoomCoinRequest extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): proto_loom_pb.BigUInt | undefined;
  setAmount(value?: proto_loom_pb.BigUInt): void;

  hasTokenContract(): boolean;
  clearTokenContract(): void;
  getTokenContract(): proto_loom_pb.Address | undefined;
  setTokenContract(value?: proto_loom_pb.Address): void;

  hasRecipient(): boolean;
  clearRecipient(): void;
  getRecipient(): proto_loom_pb.Address | undefined;
  setRecipient(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayWithdrawLoomCoinRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayWithdrawLoomCoinRequest): TransferGatewayWithdrawLoomCoinRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayWithdrawLoomCoinRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayWithdrawLoomCoinRequest;
  static deserializeBinaryFromReader(message: TransferGatewayWithdrawLoomCoinRequest, reader: jspb.BinaryReader): TransferGatewayWithdrawLoomCoinRequest;
}

export namespace TransferGatewayWithdrawLoomCoinRequest {
  export type AsObject = {
    amount?: proto_loom_pb.BigUInt.AsObject,
    tokenContract?: proto_loom_pb.Address.AsObject,
    recipient?: proto_loom_pb.Address.AsObject,
  }
}

export class TransferGatewayWithdrawalReceiptRequest extends jspb.Message {
  hasOwner(): boolean;
  clearOwner(): void;
  getOwner(): proto_loom_pb.Address | undefined;
  setOwner(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayWithdrawalReceiptRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayWithdrawalReceiptRequest): TransferGatewayWithdrawalReceiptRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayWithdrawalReceiptRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayWithdrawalReceiptRequest;
  static deserializeBinaryFromReader(message: TransferGatewayWithdrawalReceiptRequest, reader: jspb.BinaryReader): TransferGatewayWithdrawalReceiptRequest;
}

export namespace TransferGatewayWithdrawalReceiptRequest {
  export type AsObject = {
    owner?: proto_loom_pb.Address.AsObject,
  }
}

export class TransferGatewayWithdrawalReceiptResponse extends jspb.Message {
  hasReceipt(): boolean;
  clearReceipt(): void;
  getReceipt(): TransferGatewayWithdrawalReceipt | undefined;
  setReceipt(value?: TransferGatewayWithdrawalReceipt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayWithdrawalReceiptResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayWithdrawalReceiptResponse): TransferGatewayWithdrawalReceiptResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayWithdrawalReceiptResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayWithdrawalReceiptResponse;
  static deserializeBinaryFromReader(message: TransferGatewayWithdrawalReceiptResponse, reader: jspb.BinaryReader): TransferGatewayWithdrawalReceiptResponse;
}

export namespace TransferGatewayWithdrawalReceiptResponse {
  export type AsObject = {
    receipt?: TransferGatewayWithdrawalReceipt.AsObject,
  }
}

export class TransferGatewayConfirmWithdrawalReceiptRequest extends jspb.Message {
  hasTokenOwner(): boolean;
  clearTokenOwner(): void;
  getTokenOwner(): proto_loom_pb.Address | undefined;
  setTokenOwner(value?: proto_loom_pb.Address): void;

  getOracleSignature(): Uint8Array | string;
  getOracleSignature_asU8(): Uint8Array;
  getOracleSignature_asB64(): string;
  setOracleSignature(value: Uint8Array | string): void;

  getWithdrawalHash(): Uint8Array | string;
  getWithdrawalHash_asU8(): Uint8Array;
  getWithdrawalHash_asB64(): string;
  setWithdrawalHash(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayConfirmWithdrawalReceiptRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayConfirmWithdrawalReceiptRequest): TransferGatewayConfirmWithdrawalReceiptRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayConfirmWithdrawalReceiptRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayConfirmWithdrawalReceiptRequest;
  static deserializeBinaryFromReader(message: TransferGatewayConfirmWithdrawalReceiptRequest, reader: jspb.BinaryReader): TransferGatewayConfirmWithdrawalReceiptRequest;
}

export namespace TransferGatewayConfirmWithdrawalReceiptRequest {
  export type AsObject = {
    tokenOwner?: proto_loom_pb.Address.AsObject,
    oracleSignature: Uint8Array | string,
    withdrawalHash: Uint8Array | string,
  }
}

export class TransferGatewayTokenAmount extends jspb.Message {
  hasTokenId(): boolean;
  clearTokenId(): void;
  getTokenId(): proto_loom_pb.BigUInt | undefined;
  setTokenId(value?: proto_loom_pb.BigUInt): void;

  hasTokenAmount(): boolean;
  clearTokenAmount(): void;
  getTokenAmount(): proto_loom_pb.BigUInt | undefined;
  setTokenAmount(value?: proto_loom_pb.BigUInt): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayTokenAmount.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayTokenAmount): TransferGatewayTokenAmount.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayTokenAmount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayTokenAmount;
  static deserializeBinaryFromReader(message: TransferGatewayTokenAmount, reader: jspb.BinaryReader): TransferGatewayTokenAmount;
}

export namespace TransferGatewayTokenAmount {
  export type AsObject = {
    tokenId?: proto_loom_pb.BigUInt.AsObject,
    tokenAmount?: proto_loom_pb.BigUInt.AsObject,
  }
}

export class TransferGatewayUnclaimedToken extends jspb.Message {
  hasTokenContract(): boolean;
  clearTokenContract(): void;
  getTokenContract(): proto_loom_pb.Address | undefined;
  setTokenContract(value?: proto_loom_pb.Address): void;

  getTokenKind(): TransferGatewayTokenKind;
  setTokenKind(value: TransferGatewayTokenKind): void;

  clearAmountsList(): void;
  getAmountsList(): Array<TransferGatewayTokenAmount>;
  setAmountsList(value: Array<TransferGatewayTokenAmount>): void;
  addAmounts(value?: TransferGatewayTokenAmount, index?: number): TransferGatewayTokenAmount;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayUnclaimedToken.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayUnclaimedToken): TransferGatewayUnclaimedToken.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayUnclaimedToken, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayUnclaimedToken;
  static deserializeBinaryFromReader(message: TransferGatewayUnclaimedToken, reader: jspb.BinaryReader): TransferGatewayUnclaimedToken;
}

export namespace TransferGatewayUnclaimedToken {
  export type AsObject = {
    tokenContract?: proto_loom_pb.Address.AsObject,
    tokenKind: TransferGatewayTokenKind,
    amountsList: Array<TransferGatewayTokenAmount.AsObject>,
  }
}

export class TransferGatewayGetUnclaimedTokensRequest extends jspb.Message {
  hasOwner(): boolean;
  clearOwner(): void;
  getOwner(): proto_loom_pb.Address | undefined;
  setOwner(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayGetUnclaimedTokensRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayGetUnclaimedTokensRequest): TransferGatewayGetUnclaimedTokensRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayGetUnclaimedTokensRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayGetUnclaimedTokensRequest;
  static deserializeBinaryFromReader(message: TransferGatewayGetUnclaimedTokensRequest, reader: jspb.BinaryReader): TransferGatewayGetUnclaimedTokensRequest;
}

export namespace TransferGatewayGetUnclaimedTokensRequest {
  export type AsObject = {
    owner?: proto_loom_pb.Address.AsObject,
  }
}

export class TransferGatewayGetUnclaimedTokensResponse extends jspb.Message {
  clearUnclaimedTokensList(): void;
  getUnclaimedTokensList(): Array<TransferGatewayUnclaimedToken>;
  setUnclaimedTokensList(value: Array<TransferGatewayUnclaimedToken>): void;
  addUnclaimedTokens(value?: TransferGatewayUnclaimedToken, index?: number): TransferGatewayUnclaimedToken;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayGetUnclaimedTokensResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayGetUnclaimedTokensResponse): TransferGatewayGetUnclaimedTokensResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayGetUnclaimedTokensResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayGetUnclaimedTokensResponse;
  static deserializeBinaryFromReader(message: TransferGatewayGetUnclaimedTokensResponse, reader: jspb.BinaryReader): TransferGatewayGetUnclaimedTokensResponse;
}

export namespace TransferGatewayGetUnclaimedTokensResponse {
  export type AsObject = {
    unclaimedTokensList: Array<TransferGatewayUnclaimedToken.AsObject>,
  }
}

export class TransferGatewayResubmitWithdrawalRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayResubmitWithdrawalRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayResubmitWithdrawalRequest): TransferGatewayResubmitWithdrawalRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayResubmitWithdrawalRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayResubmitWithdrawalRequest;
  static deserializeBinaryFromReader(message: TransferGatewayResubmitWithdrawalRequest, reader: jspb.BinaryReader): TransferGatewayResubmitWithdrawalRequest;
}

export namespace TransferGatewayResubmitWithdrawalRequest {
  export type AsObject = {
  }
}

export class TransferGatewayGetContractMappingRequest extends jspb.Message {
  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): proto_loom_pb.Address | undefined;
  setFrom(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayGetContractMappingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayGetContractMappingRequest): TransferGatewayGetContractMappingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayGetContractMappingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayGetContractMappingRequest;
  static deserializeBinaryFromReader(message: TransferGatewayGetContractMappingRequest, reader: jspb.BinaryReader): TransferGatewayGetContractMappingRequest;
}

export namespace TransferGatewayGetContractMappingRequest {
  export type AsObject = {
    from?: proto_loom_pb.Address.AsObject,
  }
}

export class TransferGatewayGetContractMappingResponse extends jspb.Message {
  hasMappedAddress(): boolean;
  clearMappedAddress(): void;
  getMappedAddress(): proto_loom_pb.Address | undefined;
  setMappedAddress(value?: proto_loom_pb.Address): void;

  getIsPending(): boolean;
  setIsPending(value: boolean): void;

  getFound(): boolean;
  setFound(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayGetContractMappingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayGetContractMappingResponse): TransferGatewayGetContractMappingResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayGetContractMappingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayGetContractMappingResponse;
  static deserializeBinaryFromReader(message: TransferGatewayGetContractMappingResponse, reader: jspb.BinaryReader): TransferGatewayGetContractMappingResponse;
}

export namespace TransferGatewayGetContractMappingResponse {
  export type AsObject = {
    mappedAddress?: proto_loom_pb.Address.AsObject,
    isPending: boolean,
    found: boolean,
  }
}

export class TransferGatewayListContractMappingRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayListContractMappingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayListContractMappingRequest): TransferGatewayListContractMappingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayListContractMappingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayListContractMappingRequest;
  static deserializeBinaryFromReader(message: TransferGatewayListContractMappingRequest, reader: jspb.BinaryReader): TransferGatewayListContractMappingRequest;
}

export namespace TransferGatewayListContractMappingRequest {
  export type AsObject = {
  }
}

export class TransferGatewayListContractMappingResponse extends jspb.Message {
  clearConfimedMappingsList(): void;
  getConfimedMappingsList(): Array<TransferGatewayContractAddressMapping>;
  setConfimedMappingsList(value: Array<TransferGatewayContractAddressMapping>): void;
  addConfimedMappings(value?: TransferGatewayContractAddressMapping, index?: number): TransferGatewayContractAddressMapping;

  clearPendingMappingsList(): void;
  getPendingMappingsList(): Array<TransferGatewayPendingContractMapping>;
  setPendingMappingsList(value: Array<TransferGatewayPendingContractMapping>): void;
  addPendingMappings(value?: TransferGatewayPendingContractMapping, index?: number): TransferGatewayPendingContractMapping;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayListContractMappingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayListContractMappingResponse): TransferGatewayListContractMappingResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayListContractMappingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayListContractMappingResponse;
  static deserializeBinaryFromReader(message: TransferGatewayListContractMappingResponse, reader: jspb.BinaryReader): TransferGatewayListContractMappingResponse;
}

export namespace TransferGatewayListContractMappingResponse {
  export type AsObject = {
    confimedMappingsList: Array<TransferGatewayContractAddressMapping.AsObject>,
    pendingMappingsList: Array<TransferGatewayPendingContractMapping.AsObject>,
  }
}

export class TransferGatewayContractAddressMapping extends jspb.Message {
  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): proto_loom_pb.Address | undefined;
  setFrom(value?: proto_loom_pb.Address): void;

  hasTo(): boolean;
  clearTo(): void;
  getTo(): proto_loom_pb.Address | undefined;
  setTo(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayContractAddressMapping.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayContractAddressMapping): TransferGatewayContractAddressMapping.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayContractAddressMapping, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayContractAddressMapping;
  static deserializeBinaryFromReader(message: TransferGatewayContractAddressMapping, reader: jspb.BinaryReader): TransferGatewayContractAddressMapping;
}

export namespace TransferGatewayContractAddressMapping {
  export type AsObject = {
    from?: proto_loom_pb.Address.AsObject,
    to?: proto_loom_pb.Address.AsObject,
  }
}

export class TransferGatewayPendingContractMapping extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  hasForeignContract(): boolean;
  clearForeignContract(): void;
  getForeignContract(): proto_loom_pb.Address | undefined;
  setForeignContract(value?: proto_loom_pb.Address): void;

  hasLocalContract(): boolean;
  clearLocalContract(): void;
  getLocalContract(): proto_loom_pb.Address | undefined;
  setLocalContract(value?: proto_loom_pb.Address): void;

  hasForeignContractCreator(): boolean;
  clearForeignContractCreator(): void;
  getForeignContractCreator(): proto_loom_pb.Address | undefined;
  setForeignContractCreator(value?: proto_loom_pb.Address): void;

  getForeignContractTxHash(): Uint8Array | string;
  getForeignContractTxHash_asU8(): Uint8Array;
  getForeignContractTxHash_asB64(): string;
  setForeignContractTxHash(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayPendingContractMapping.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayPendingContractMapping): TransferGatewayPendingContractMapping.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayPendingContractMapping, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayPendingContractMapping;
  static deserializeBinaryFromReader(message: TransferGatewayPendingContractMapping, reader: jspb.BinaryReader): TransferGatewayPendingContractMapping;
}

export namespace TransferGatewayPendingContractMapping {
  export type AsObject = {
    id: number,
    foreignContract?: proto_loom_pb.Address.AsObject,
    localContract?: proto_loom_pb.Address.AsObject,
    foreignContractCreator?: proto_loom_pb.Address.AsObject,
    foreignContractTxHash: Uint8Array | string,
  }
}

export class TransferGatewayGetLocalAccountInfoRequest extends jspb.Message {
  hasOwner(): boolean;
  clearOwner(): void;
  getOwner(): proto_loom_pb.Address | undefined;
  setOwner(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayGetLocalAccountInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayGetLocalAccountInfoRequest): TransferGatewayGetLocalAccountInfoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayGetLocalAccountInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayGetLocalAccountInfoRequest;
  static deserializeBinaryFromReader(message: TransferGatewayGetLocalAccountInfoRequest, reader: jspb.BinaryReader): TransferGatewayGetLocalAccountInfoRequest;
}

export namespace TransferGatewayGetLocalAccountInfoRequest {
  export type AsObject = {
    owner?: proto_loom_pb.Address.AsObject,
  }
}

export class TransferGatewayGetLocalAccountInfoResponse extends jspb.Message {
  hasOwner(): boolean;
  clearOwner(): void;
  getOwner(): proto_loom_pb.Address | undefined;
  setOwner(value?: proto_loom_pb.Address): void;

  hasWithdrawalReceipt(): boolean;
  clearWithdrawalReceipt(): void;
  getWithdrawalReceipt(): TransferGatewayWithdrawalReceipt | undefined;
  setWithdrawalReceipt(value?: TransferGatewayWithdrawalReceipt): void;

  hasTotalWithdrawalAmount(): boolean;
  clearTotalWithdrawalAmount(): void;
  getTotalWithdrawalAmount(): proto_loom_pb.BigUInt | undefined;
  setTotalWithdrawalAmount(value?: proto_loom_pb.BigUInt): void;

  getLastWithdrawalLimitResetTime(): number;
  setLastWithdrawalLimitResetTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferGatewayGetLocalAccountInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransferGatewayGetLocalAccountInfoResponse): TransferGatewayGetLocalAccountInfoResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferGatewayGetLocalAccountInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferGatewayGetLocalAccountInfoResponse;
  static deserializeBinaryFromReader(message: TransferGatewayGetLocalAccountInfoResponse, reader: jspb.BinaryReader): TransferGatewayGetLocalAccountInfoResponse;
}

export namespace TransferGatewayGetLocalAccountInfoResponse {
  export type AsObject = {
    owner?: proto_loom_pb.Address.AsObject,
    withdrawalReceipt?: TransferGatewayWithdrawalReceipt.AsObject,
    totalWithdrawalAmount?: proto_loom_pb.BigUInt.AsObject,
    lastWithdrawalLimitResetTime: number,
  }
}

export enum TransferGatewayTokenKind {
  ETH = 0,
  ERC20 = 1,
  ERC721 = 2,
  ERC721X = 3,
  LOOMCOIN = 4,
  TRX = 5,
  TRC20 = 6,
  BEP2_LOOM = 7,
  BEP2 = 8,
}

export enum TransferGatewayTxStatus {
  PENDING = 0,
  PROCESSED = 1,
  CONFIRMED = 2,
  REJECTED = 3,
}

