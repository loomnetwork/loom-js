// package: 
// file: proto/zb.proto

import * as jspb from "google-protobuf";
import * as proto_gogo_pb from "../proto/gogo_pb";
import * as proto_loom_pb from "../proto/loom_pb";

export class Account extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  getPhoneNumberVerified(): boolean;
  setPhoneNumberVerified(value: boolean): void;

  getRewardRedeemed(): boolean;
  setRewardRedeemed(value: boolean): void;

  getIsKickstarter(): boolean;
  setIsKickstarter(value: boolean): void;

  getImage(): string;
  setImage(value: string): void;

  getEmailNotification(): boolean;
  setEmailNotification(value: boolean): void;

  getEloScore(): number;
  setEloScore(value: number): void;

  getCurrentTier(): number;
  setCurrentTier(value: number): void;

  getGameMembershipTier(): number;
  setGameMembershipTier(value: number): void;

  getOwner(): Uint8Array | string;
  getOwner_asU8(): Uint8Array;
  getOwner_asB64(): string;
  setOwner(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Account.AsObject;
  static toObject(includeInstance: boolean, msg: Account): Account.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Account, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Account;
  static deserializeBinaryFromReader(message: Account, reader: jspb.BinaryReader): Account;
}

export namespace Account {
  export type AsObject = {
    userId: string,
    phoneNumberVerified: boolean,
    rewardRedeemed: boolean,
    isKickstarter: boolean,
    image: string,
    emailNotification: boolean,
    eloScore: number,
    currentTier: number,
    gameMembershipTier: number,
    owner: Uint8Array | string,
  }
}

export class Deck extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getHeroId(): number;
  setHeroId(value: number): void;

  clearCardsList(): void;
  getCardsList(): Array<DeckCard>;
  setCardsList(value: Array<DeckCard>): void;
  addCards(value?: DeckCard, index?: number): DeckCard;

  getPrimarySkill(): number;
  setPrimarySkill(value: number): void;

  getSecondarySkill(): number;
  setSecondarySkill(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Deck.AsObject;
  static toObject(includeInstance: boolean, msg: Deck): Deck.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Deck, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Deck;
  static deserializeBinaryFromReader(message: Deck, reader: jspb.BinaryReader): Deck;
}

export namespace Deck {
  export type AsObject = {
    id: number,
    name: string,
    heroId: number,
    cardsList: Array<DeckCard.AsObject>,
    primarySkill: number,
    secondarySkill: number,
  }
}

export class Card extends jspb.Message {
  getMouldid(): number;
  setMouldid(value: number): void;

  getKind(): CardKind.Enum;
  setKind(value: CardKind.Enum): void;

  getSet(): CardSetType.Enum;
  setSet(value: CardSetType.Enum): void;

  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getFlavorText(): string;
  setFlavorText(value: string): void;

  getPicture(): string;
  setPicture(value: string): void;

  getRank(): CreatureRank.Enum;
  setRank(value: CreatureRank.Enum): void;

  getType(): CreatureType.Enum;
  setType(value: CreatureType.Enum): void;

  getFrame(): string;
  setFrame(value: string): void;

  getAttack(): number;
  setAttack(value: number): void;

  getDefense(): number;
  setDefense(value: number): void;

  getGoocost(): number;
  setGoocost(value: number): void;

  hasCardViewInfo(): boolean;
  clearCardViewInfo(): void;
  getCardViewInfo(): CardViewInfo | undefined;
  setCardViewInfo(value?: CardViewInfo): void;

  clearAbilitiesList(): void;
  getAbilitiesList(): Array<CardAbility>;
  setAbilitiesList(value: Array<CardAbility>): void;
  addAbilities(value?: CardAbility, index?: number): CardAbility;

  getUniqueAnimation(): UniqueAnimationType.Enum;
  setUniqueAnimation(value: UniqueAnimationType.Enum): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Card.AsObject;
  static toObject(includeInstance: boolean, msg: Card): Card.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Card, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Card;
  static deserializeBinaryFromReader(message: Card, reader: jspb.BinaryReader): Card;
}

export namespace Card {
  export type AsObject = {
    mouldid: number,
    kind: CardKind.Enum,
    set: CardSetType.Enum,
    name: string,
    description: string,
    flavorText: string,
    picture: string,
    rank: CreatureRank.Enum,
    type: CreatureType.Enum,
    frame: string,
    attack: number,
    defense: number,
    goocost: number,
    cardViewInfo?: CardViewInfo.AsObject,
    abilitiesList: Array<CardAbility.AsObject>,
    uniqueAnimation: UniqueAnimationType.Enum,
  }
}

export class CardViewInfo extends jspb.Message {
  hasPosition(): boolean;
  clearPosition(): void;
  getPosition(): Vector3Float | undefined;
  setPosition(value?: Vector3Float): void;

  hasScale(): boolean;
  clearScale(): void;
  getScale(): Vector3Float | undefined;
  setScale(value?: Vector3Float): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardViewInfo.AsObject;
  static toObject(includeInstance: boolean, msg: CardViewInfo): CardViewInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardViewInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardViewInfo;
  static deserializeBinaryFromReader(message: CardViewInfo, reader: jspb.BinaryReader): CardViewInfo;
}

export namespace CardViewInfo {
  export type AsObject = {
    position?: Vector3Float.AsObject,
    scale?: Vector3Float.AsObject,
  }
}

export class Vector3Float extends jspb.Message {
  getX(): number;
  setX(value: number): void;

  getY(): number;
  setY(value: number): void;

  getZ(): number;
  setZ(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Vector3Float.AsObject;
  static toObject(includeInstance: boolean, msg: Vector3Float): Vector3Float.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Vector3Float, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Vector3Float;
  static deserializeBinaryFromReader(message: Vector3Float, reader: jspb.BinaryReader): Vector3Float;
}

export namespace Vector3Float {
  export type AsObject = {
    x: number,
    y: number,
    z: number,
  }
}

export class Vector2Int extends jspb.Message {
  getX(): number;
  setX(value: number): void;

  getY(): number;
  setY(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Vector2Int.AsObject;
  static toObject(includeInstance: boolean, msg: Vector2Int): Vector2Int.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Vector2Int, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Vector2Int;
  static deserializeBinaryFromReader(message: Vector2Int, reader: jspb.BinaryReader): Vector2Int;
}

export namespace Vector2Int {
  export type AsObject = {
    x: number,
    y: number,
  }
}

export class Rect extends jspb.Message {
  hasPosition(): boolean;
  clearPosition(): void;
  getPosition(): Vector2Int | undefined;
  setPosition(value?: Vector2Int): void;

  hasSize(): boolean;
  clearSize(): void;
  getSize(): Vector2Int | undefined;
  setSize(value?: Vector2Int): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Rect.AsObject;
  static toObject(includeInstance: boolean, msg: Rect): Rect.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Rect, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Rect;
  static deserializeBinaryFromReader(message: Rect, reader: jspb.BinaryReader): Rect;
}

export namespace Rect {
  export type AsObject = {
    position?: Vector2Int.AsObject,
    size?: Vector2Int.AsObject,
  }
}

export class CardList extends jspb.Message {
  clearCardsList(): void;
  getCardsList(): Array<Card>;
  setCardsList(value: Array<Card>): void;
  addCards(value?: Card, index?: number): Card;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardList.AsObject;
  static toObject(includeInstance: boolean, msg: CardList): CardList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardList;
  static deserializeBinaryFromReader(message: CardList, reader: jspb.BinaryReader): CardList;
}

export namespace CardList {
  export type AsObject = {
    cardsList: Array<Card.AsObject>,
  }
}

export class CardCollectionCard extends jspb.Message {
  getCardName(): string;
  setCardName(value: string): void;

  getAmount(): number;
  setAmount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardCollectionCard.AsObject;
  static toObject(includeInstance: boolean, msg: CardCollectionCard): CardCollectionCard.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardCollectionCard, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardCollectionCard;
  static deserializeBinaryFromReader(message: CardCollectionCard, reader: jspb.BinaryReader): CardCollectionCard;
}

export namespace CardCollectionCard {
  export type AsObject = {
    cardName: string,
    amount: number,
  }
}

export class DeckCard extends jspb.Message {
  getCardName(): string;
  setCardName(value: string): void;

  getAmount(): number;
  setAmount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeckCard.AsObject;
  static toObject(includeInstance: boolean, msg: DeckCard): DeckCard.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeckCard, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeckCard;
  static deserializeBinaryFromReader(message: DeckCard, reader: jspb.BinaryReader): DeckCard;
}

export namespace DeckCard {
  export type AsObject = {
    cardName: string,
    amount: number,
  }
}

export class CardLibrary extends jspb.Message {
  clearCardsList(): void;
  getCardsList(): Array<Card>;
  setCardsList(value: Array<Card>): void;
  addCards(value?: Card, index?: number): Card;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardLibrary.AsObject;
  static toObject(includeInstance: boolean, msg: CardLibrary): CardLibrary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardLibrary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardLibrary;
  static deserializeBinaryFromReader(message: CardLibrary, reader: jspb.BinaryReader): CardLibrary;
}

export namespace CardLibrary {
  export type AsObject = {
    cardsList: Array<Card.AsObject>,
  }
}

export class Hero extends jspb.Message {
  getHeroId(): number;
  setHeroId(value: number): void;

  getIcon(): string;
  setIcon(value: string): void;

  getName(): string;
  setName(value: string): void;

  getShortDescription(): string;
  setShortDescription(value: string): void;

  getLongDescription(): string;
  setLongDescription(value: string): void;

  getElement(): CardSetType.Enum;
  setElement(value: CardSetType.Enum): void;

  getExperience(): number;
  setExperience(value: number): void;

  getLevel(): number;
  setLevel(value: number): void;

  clearSkillsList(): void;
  getSkillsList(): Array<Skill>;
  setSkillsList(value: Array<Skill>): void;
  addSkills(value?: Skill, index?: number): Skill;

  getPrimarySkill(): number;
  setPrimarySkill(value: number): void;

  getSecondarySkill(): number;
  setSecondarySkill(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Hero.AsObject;
  static toObject(includeInstance: boolean, msg: Hero): Hero.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Hero, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Hero;
  static deserializeBinaryFromReader(message: Hero, reader: jspb.BinaryReader): Hero;
}

export namespace Hero {
  export type AsObject = {
    heroId: number,
    icon: string,
    name: string,
    shortDescription: string,
    longDescription: string,
    element: CardSetType.Enum,
    experience: number,
    level: number,
    skillsList: Array<Skill.AsObject>,
    primarySkill: number,
    secondarySkill: number,
  }
}

export class ListHeroesRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListHeroesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListHeroesRequest): ListHeroesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListHeroesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListHeroesRequest;
  static deserializeBinaryFromReader(message: ListHeroesRequest, reader: jspb.BinaryReader): ListHeroesRequest;
}

export namespace ListHeroesRequest {
  export type AsObject = {
    userId: string,
  }
}

export class ListHeroesResponse extends jspb.Message {
  clearHeroesList(): void;
  getHeroesList(): Array<Hero>;
  setHeroesList(value: Array<Hero>): void;
  addHeroes(value?: Hero, index?: number): Hero;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListHeroesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListHeroesResponse): ListHeroesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListHeroesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListHeroesResponse;
  static deserializeBinaryFromReader(message: ListHeroesResponse, reader: jspb.BinaryReader): ListHeroesResponse;
}

export namespace ListHeroesResponse {
  export type AsObject = {
    heroesList: Array<Hero.AsObject>,
  }
}

export class AddHeroExperienceRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  getHeroId(): number;
  setHeroId(value: number): void;

  getExperience(): number;
  setExperience(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddHeroExperienceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddHeroExperienceRequest): AddHeroExperienceRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddHeroExperienceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddHeroExperienceRequest;
  static deserializeBinaryFromReader(message: AddHeroExperienceRequest, reader: jspb.BinaryReader): AddHeroExperienceRequest;
}

export namespace AddHeroExperienceRequest {
  export type AsObject = {
    userId: string,
    heroId: number,
    experience: number,
  }
}

export class AddHeroExperienceResponse extends jspb.Message {
  getHeroId(): number;
  setHeroId(value: number): void;

  getExperience(): number;
  setExperience(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddHeroExperienceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddHeroExperienceResponse): AddHeroExperienceResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddHeroExperienceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddHeroExperienceResponse;
  static deserializeBinaryFromReader(message: AddHeroExperienceResponse, reader: jspb.BinaryReader): AddHeroExperienceResponse;
}

export namespace AddHeroExperienceResponse {
  export type AsObject = {
    heroId: number,
    experience: number,
  }
}

export class GetHeroRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  getHeroId(): number;
  setHeroId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHeroRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetHeroRequest): GetHeroRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetHeroRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHeroRequest;
  static deserializeBinaryFromReader(message: GetHeroRequest, reader: jspb.BinaryReader): GetHeroRequest;
}

export namespace GetHeroRequest {
  export type AsObject = {
    userId: string,
    heroId: number,
  }
}

export class GetHeroResponse extends jspb.Message {
  hasHero(): boolean;
  clearHero(): void;
  getHero(): Hero | undefined;
  setHero(value?: Hero): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHeroResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetHeroResponse): GetHeroResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetHeroResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHeroResponse;
  static deserializeBinaryFromReader(message: GetHeroResponse, reader: jspb.BinaryReader): GetHeroResponse;
}

export namespace GetHeroResponse {
  export type AsObject = {
    hero?: Hero.AsObject,
  }
}

export class GetHeroSkillsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  getHeroId(): number;
  setHeroId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHeroSkillsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetHeroSkillsRequest): GetHeroSkillsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetHeroSkillsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHeroSkillsRequest;
  static deserializeBinaryFromReader(message: GetHeroSkillsRequest, reader: jspb.BinaryReader): GetHeroSkillsRequest;
}

export namespace GetHeroSkillsRequest {
  export type AsObject = {
    userId: string,
    heroId: number,
  }
}

export class GetHeroSkillsResponse extends jspb.Message {
  getHeroId(): number;
  setHeroId(value: number): void;

  clearSkillsList(): void;
  getSkillsList(): Array<Skill>;
  setSkillsList(value: Array<Skill>): void;
  addSkills(value?: Skill, index?: number): Skill;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHeroSkillsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetHeroSkillsResponse): GetHeroSkillsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetHeroSkillsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHeroSkillsResponse;
  static deserializeBinaryFromReader(message: GetHeroSkillsResponse, reader: jspb.BinaryReader): GetHeroSkillsResponse;
}

export namespace GetHeroSkillsResponse {
  export type AsObject = {
    heroId: number,
    skillsList: Array<Skill.AsObject>,
  }
}

export class Skill extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): void;

  getSkill(): OverlordSkillKind.Enum;
  setSkill(value: OverlordSkillKind.Enum): void;

  getIconPath(): string;
  setIconPath(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  clearSkillTargetsList(): void;
  getSkillTargetsList(): Array<OverlordAbilityTarget.Enum>;
  setSkillTargetsList(value: Array<OverlordAbilityTarget.Enum>): void;
  addSkillTargets(value: OverlordAbilityTarget.Enum, index?: number): OverlordAbilityTarget.Enum;

  getTargetunitspecialstatus(): UnitSpecialStatus.Enum;
  setTargetunitspecialstatus(value: UnitSpecialStatus.Enum): void;

  clearElementTargetsList(): void;
  getElementTargetsList(): Array<CardSetType.Enum>;
  setElementTargetsList(value: Array<CardSetType.Enum>): void;
  addElementTargets(value: CardSetType.Enum, index?: number): CardSetType.Enum;

  getValue(): number;
  setValue(value: number): void;

  getCooldown(): number;
  setCooldown(value: number): void;

  getInitialCooldown(): number;
  setInitialCooldown(value: number): void;

  getAttack(): number;
  setAttack(value: number): void;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Skill.AsObject;
  static toObject(includeInstance: boolean, msg: Skill): Skill.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Skill, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Skill;
  static deserializeBinaryFromReader(message: Skill, reader: jspb.BinaryReader): Skill;
}

export namespace Skill {
  export type AsObject = {
    title: string,
    skill: OverlordSkillKind.Enum,
    iconPath: string,
    description: string,
    skillTargetsList: Array<OverlordAbilityTarget.Enum>,
    targetunitspecialstatus: UnitSpecialStatus.Enum,
    elementTargetsList: Array<CardSetType.Enum>,
    value: number,
    cooldown: number,
    initialCooldown: number,
    attack: number,
    count: number,
  }
}

export class HeroList extends jspb.Message {
  clearHeroesList(): void;
  getHeroesList(): Array<Hero>;
  setHeroesList(value: Array<Hero>): void;
  addHeroes(value?: Hero, index?: number): Hero;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HeroList.AsObject;
  static toObject(includeInstance: boolean, msg: HeroList): HeroList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HeroList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HeroList;
  static deserializeBinaryFromReader(message: HeroList, reader: jspb.BinaryReader): HeroList;
}

export namespace HeroList {
  export type AsObject = {
    heroesList: Array<Hero.AsObject>,
  }
}

export class CardCollectionList extends jspb.Message {
  clearCardsList(): void;
  getCardsList(): Array<CardCollectionCard>;
  setCardsList(value: Array<CardCollectionCard>): void;
  addCards(value?: CardCollectionCard, index?: number): CardCollectionCard;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardCollectionList.AsObject;
  static toObject(includeInstance: boolean, msg: CardCollectionList): CardCollectionList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardCollectionList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardCollectionList;
  static deserializeBinaryFromReader(message: CardCollectionList, reader: jspb.BinaryReader): CardCollectionList;
}

export namespace CardCollectionList {
  export type AsObject = {
    cardsList: Array<CardCollectionCard.AsObject>,
  }
}

export class DeckList extends jspb.Message {
  clearDecksList(): void;
  getDecksList(): Array<Deck>;
  setDecksList(value: Array<Deck>): void;
  addDecks(value?: Deck, index?: number): Deck;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeckList.AsObject;
  static toObject(includeInstance: boolean, msg: DeckList): DeckList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeckList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeckList;
  static deserializeBinaryFromReader(message: DeckList, reader: jspb.BinaryReader): DeckList;
}

export namespace DeckList {
  export type AsObject = {
    decksList: Array<Deck.AsObject>,
  }
}

export class AIType extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AIType.AsObject;
  static toObject(includeInstance: boolean, msg: AIType): AIType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AIType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AIType;
  static deserializeBinaryFromReader(message: AIType, reader: jspb.BinaryReader): AIType;
}

export namespace AIType {
  export type AsObject = {
  }

  export enum Enum {
    UNDEFINED = 0,
    BLITZ_AI = 1,
    DEFENSE_AI = 2,
    MIXED_AI = 3,
    MIXED_BLITZ_AI = 4,
    TIME_BLITZ_AI = 5,
    MIXED_DEFENSE_AI = 6,
  }
}

export class AIDeck extends jspb.Message {
  hasDeck(): boolean;
  clearDeck(): void;
  getDeck(): Deck | undefined;
  setDeck(value?: Deck): void;

  getType(): AIType.Enum;
  setType(value: AIType.Enum): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AIDeck.AsObject;
  static toObject(includeInstance: boolean, msg: AIDeck): AIDeck.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AIDeck, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AIDeck;
  static deserializeBinaryFromReader(message: AIDeck, reader: jspb.BinaryReader): AIDeck;
}

export namespace AIDeck {
  export type AsObject = {
    deck?: Deck.AsObject,
    type: AIType.Enum,
  }
}

export class AIDeckList extends jspb.Message {
  clearDecksList(): void;
  getDecksList(): Array<AIDeck>;
  setDecksList(value: Array<AIDeck>): void;
  addDecks(value?: AIDeck, index?: number): AIDeck;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AIDeckList.AsObject;
  static toObject(includeInstance: boolean, msg: AIDeckList): AIDeckList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AIDeckList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AIDeckList;
  static deserializeBinaryFromReader(message: AIDeckList, reader: jspb.BinaryReader): AIDeckList;
}

export namespace AIDeckList {
  export type AsObject = {
    decksList: Array<AIDeck.AsObject>,
  }
}

export class InitRequest extends jspb.Message {
  clearDefaultDecksList(): void;
  getDefaultDecksList(): Array<Deck>;
  setDefaultDecksList(value: Array<Deck>): void;
  addDefaultDecks(value?: Deck, index?: number): Deck;

  clearDefaultCollectionList(): void;
  getDefaultCollectionList(): Array<CardCollectionCard>;
  setDefaultCollectionList(value: Array<CardCollectionCard>): void;
  addDefaultCollection(value?: CardCollectionCard, index?: number): CardCollectionCard;

  clearCardsList(): void;
  getCardsList(): Array<Card>;
  setCardsList(value: Array<Card>): void;
  addCards(value?: Card, index?: number): Card;

  clearHeroesList(): void;
  getHeroesList(): Array<Hero>;
  setHeroesList(value: Array<Hero>): void;
  addHeroes(value?: Hero, index?: number): Hero;

  clearAiDecksList(): void;
  getAiDecksList(): Array<AIDeck>;
  setAiDecksList(value: Array<AIDeck>): void;
  addAiDecks(value?: AIDeck, index?: number): AIDeck;

  getVersion(): string;
  setVersion(value: string): void;

  hasOracle(): boolean;
  clearOracle(): void;
  getOracle(): proto_loom_pb.Address | undefined;
  setOracle(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InitRequest): InitRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InitRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitRequest;
  static deserializeBinaryFromReader(message: InitRequest, reader: jspb.BinaryReader): InitRequest;
}

export namespace InitRequest {
  export type AsObject = {
    defaultDecksList: Array<Deck.AsObject>,
    defaultCollectionList: Array<CardCollectionCard.AsObject>,
    cardsList: Array<Card.AsObject>,
    heroesList: Array<Hero.AsObject>,
    aiDecksList: Array<AIDeck.AsObject>,
    version: string,
    oracle?: proto_loom_pb.Address.AsObject,
  }
}

export class UpdateOracle extends jspb.Message {
  hasNewOracle(): boolean;
  clearNewOracle(): void;
  getNewOracle(): proto_loom_pb.Address | undefined;
  setNewOracle(value?: proto_loom_pb.Address): void;

  hasOldOracle(): boolean;
  clearOldOracle(): void;
  getOldOracle(): proto_loom_pb.Address | undefined;
  setOldOracle(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateOracle.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateOracle): UpdateOracle.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateOracle, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateOracle;
  static deserializeBinaryFromReader(message: UpdateOracle, reader: jspb.BinaryReader): UpdateOracle;
}

export namespace UpdateOracle {
  export type AsObject = {
    newOracle?: proto_loom_pb.Address.AsObject,
    oldOracle?: proto_loom_pb.Address.AsObject,
  }
}

export class UpdateInitRequest extends jspb.Message {
  clearDefaultDecksList(): void;
  getDefaultDecksList(): Array<Deck>;
  setDefaultDecksList(value: Array<Deck>): void;
  addDefaultDecks(value?: Deck, index?: number): Deck;

  clearDefaultCollectionList(): void;
  getDefaultCollectionList(): Array<CardCollectionCard>;
  setDefaultCollectionList(value: Array<CardCollectionCard>): void;
  addDefaultCollection(value?: CardCollectionCard, index?: number): CardCollectionCard;

  clearCardsList(): void;
  getCardsList(): Array<Card>;
  setCardsList(value: Array<Card>): void;
  addCards(value?: Card, index?: number): Card;

  clearHeroesList(): void;
  getHeroesList(): Array<Hero>;
  setHeroesList(value: Array<Hero>): void;
  addHeroes(value?: Hero, index?: number): Hero;

  clearAiDecksList(): void;
  getAiDecksList(): Array<AIDeck>;
  setAiDecksList(value: Array<AIDeck>): void;
  addAiDecks(value?: AIDeck, index?: number): AIDeck;

  getVersion(): string;
  setVersion(value: string): void;

  hasOracle(): boolean;
  clearOracle(): void;
  getOracle(): proto_loom_pb.Address | undefined;
  setOracle(value?: proto_loom_pb.Address): void;

  getOldversion(): string;
  setOldversion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateInitRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateInitRequest): UpdateInitRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateInitRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateInitRequest;
  static deserializeBinaryFromReader(message: UpdateInitRequest, reader: jspb.BinaryReader): UpdateInitRequest;
}

export namespace UpdateInitRequest {
  export type AsObject = {
    defaultDecksList: Array<Deck.AsObject>,
    defaultCollectionList: Array<CardCollectionCard.AsObject>,
    cardsList: Array<Card.AsObject>,
    heroesList: Array<Hero.AsObject>,
    aiDecksList: Array<AIDeck.AsObject>,
    version: string,
    oracle?: proto_loom_pb.Address.AsObject,
    oldversion: string,
  }
}

export class GetInitRequest extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInitRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetInitRequest): GetInitRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetInitRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInitRequest;
  static deserializeBinaryFromReader(message: GetInitRequest, reader: jspb.BinaryReader): GetInitRequest;
}

export namespace GetInitRequest {
  export type AsObject = {
    version: string,
  }
}

export class GetInitResponse extends jspb.Message {
  clearDefaultDecksList(): void;
  getDefaultDecksList(): Array<Deck>;
  setDefaultDecksList(value: Array<Deck>): void;
  addDefaultDecks(value?: Deck, index?: number): Deck;

  clearDefaultCollectionList(): void;
  getDefaultCollectionList(): Array<CardCollectionCard>;
  setDefaultCollectionList(value: Array<CardCollectionCard>): void;
  addDefaultCollection(value?: CardCollectionCard, index?: number): CardCollectionCard;

  clearCardsList(): void;
  getCardsList(): Array<Card>;
  setCardsList(value: Array<Card>): void;
  addCards(value?: Card, index?: number): Card;

  clearHeroesList(): void;
  getHeroesList(): Array<Hero>;
  setHeroesList(value: Array<Hero>): void;
  addHeroes(value?: Hero, index?: number): Hero;

  clearDefaultHeroesList(): void;
  getDefaultHeroesList(): Array<Hero>;
  setDefaultHeroesList(value: Array<Hero>): void;
  addDefaultHeroes(value?: Hero, index?: number): Hero;

  clearAiDecksList(): void;
  getAiDecksList(): Array<AIDeck>;
  setAiDecksList(value: Array<AIDeck>): void;
  addAiDecks(value?: AIDeck, index?: number): AIDeck;

  getVersion(): string;
  setVersion(value: string): void;

  hasOracle(): boolean;
  clearOracle(): void;
  getOracle(): proto_loom_pb.Address | undefined;
  setOracle(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInitResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetInitResponse): GetInitResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetInitResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInitResponse;
  static deserializeBinaryFromReader(message: GetInitResponse, reader: jspb.BinaryReader): GetInitResponse;
}

export namespace GetInitResponse {
  export type AsObject = {
    defaultDecksList: Array<Deck.AsObject>,
    defaultCollectionList: Array<CardCollectionCard.AsObject>,
    cardsList: Array<Card.AsObject>,
    heroesList: Array<Hero.AsObject>,
    defaultHeroesList: Array<Hero.AsObject>,
    aiDecksList: Array<AIDeck.AsObject>,
    version: string,
    oracle?: proto_loom_pb.Address.AsObject,
  }
}

export class UpdateCardListRequest extends jspb.Message {
  clearCardsList(): void;
  getCardsList(): Array<Card>;
  setCardsList(value: Array<Card>): void;
  addCards(value?: Card, index?: number): Card;

  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateCardListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateCardListRequest): UpdateCardListRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateCardListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateCardListRequest;
  static deserializeBinaryFromReader(message: UpdateCardListRequest, reader: jspb.BinaryReader): UpdateCardListRequest;
}

export namespace UpdateCardListRequest {
  export type AsObject = {
    cardsList: Array<Card.AsObject>,
    version: string,
  }
}

export class GetCardListRequest extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCardListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCardListRequest): GetCardListRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCardListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCardListRequest;
  static deserializeBinaryFromReader(message: GetCardListRequest, reader: jspb.BinaryReader): GetCardListRequest;
}

export namespace GetCardListRequest {
  export type AsObject = {
    version: string,
  }
}

export class GetCardListResponse extends jspb.Message {
  clearCardsList(): void;
  getCardsList(): Array<Card>;
  setCardsList(value: Array<Card>): void;
  addCards(value?: Card, index?: number): Card;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCardListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCardListResponse): GetCardListResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCardListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCardListResponse;
  static deserializeBinaryFromReader(message: GetCardListResponse, reader: jspb.BinaryReader): GetCardListResponse;
}

export namespace GetCardListResponse {
  export type AsObject = {
    cardsList: Array<Card.AsObject>,
  }
}

export class UpsertAccountRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  getPhoneNumberVerified(): boolean;
  setPhoneNumberVerified(value: boolean): void;

  getRewardRedeemed(): boolean;
  setRewardRedeemed(value: boolean): void;

  getIsKickstarter(): boolean;
  setIsKickstarter(value: boolean): void;

  getImage(): string;
  setImage(value: string): void;

  getEmailNotification(): boolean;
  setEmailNotification(value: boolean): void;

  getEloScore(): number;
  setEloScore(value: number): void;

  getCurrentTier(): number;
  setCurrentTier(value: number): void;

  getGameMembershipTier(): number;
  setGameMembershipTier(value: number): void;

  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpsertAccountRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpsertAccountRequest): UpsertAccountRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpsertAccountRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpsertAccountRequest;
  static deserializeBinaryFromReader(message: UpsertAccountRequest, reader: jspb.BinaryReader): UpsertAccountRequest;
}

export namespace UpsertAccountRequest {
  export type AsObject = {
    userId: string,
    phoneNumberVerified: boolean,
    rewardRedeemed: boolean,
    isKickstarter: boolean,
    image: string,
    emailNotification: boolean,
    eloScore: number,
    currentTier: number,
    gameMembershipTier: number,
    version: string,
  }
}

export class GetAccountRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountRequest): GetAccountRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountRequest;
  static deserializeBinaryFromReader(message: GetAccountRequest, reader: jspb.BinaryReader): GetAccountRequest;
}

export namespace GetAccountRequest {
  export type AsObject = {
    userId: string,
  }
}

export class GetDeckRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  getDeckId(): number;
  setDeckId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDeckRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDeckRequest): GetDeckRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetDeckRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDeckRequest;
  static deserializeBinaryFromReader(message: GetDeckRequest, reader: jspb.BinaryReader): GetDeckRequest;
}

export namespace GetDeckRequest {
  export type AsObject = {
    userId: string,
    deckId: number,
  }
}

export class GetDeckResponse extends jspb.Message {
  hasDeck(): boolean;
  clearDeck(): void;
  getDeck(): Deck | undefined;
  setDeck(value?: Deck): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDeckResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetDeckResponse): GetDeckResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetDeckResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDeckResponse;
  static deserializeBinaryFromReader(message: GetDeckResponse, reader: jspb.BinaryReader): GetDeckResponse;
}

export namespace GetDeckResponse {
  export type AsObject = {
    deck?: Deck.AsObject,
  }
}

export class CreateDeckRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  hasDeck(): boolean;
  clearDeck(): void;
  getDeck(): Deck | undefined;
  setDeck(value?: Deck): void;

  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateDeckRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateDeckRequest): CreateDeckRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateDeckRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateDeckRequest;
  static deserializeBinaryFromReader(message: CreateDeckRequest, reader: jspb.BinaryReader): CreateDeckRequest;
}

export namespace CreateDeckRequest {
  export type AsObject = {
    userId: string,
    deck?: Deck.AsObject,
    version: string,
  }
}

export class CreateDeckResponse extends jspb.Message {
  getDeckId(): number;
  setDeckId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateDeckResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateDeckResponse): CreateDeckResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateDeckResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateDeckResponse;
  static deserializeBinaryFromReader(message: CreateDeckResponse, reader: jspb.BinaryReader): CreateDeckResponse;
}

export namespace CreateDeckResponse {
  export type AsObject = {
    deckId: number,
  }
}

export class DeleteDeckRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  getDeckId(): number;
  setDeckId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteDeckRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteDeckRequest): DeleteDeckRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteDeckRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteDeckRequest;
  static deserializeBinaryFromReader(message: DeleteDeckRequest, reader: jspb.BinaryReader): DeleteDeckRequest;
}

export namespace DeleteDeckRequest {
  export type AsObject = {
    userId: string,
    deckId: number,
  }
}

export class EditDeckRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  hasDeck(): boolean;
  clearDeck(): void;
  getDeck(): Deck | undefined;
  setDeck(value?: Deck): void;

  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EditDeckRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EditDeckRequest): EditDeckRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EditDeckRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EditDeckRequest;
  static deserializeBinaryFromReader(message: EditDeckRequest, reader: jspb.BinaryReader): EditDeckRequest;
}

export namespace EditDeckRequest {
  export type AsObject = {
    userId: string,
    deck?: Deck.AsObject,
    version: string,
  }
}

export class DecksResponse extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  clearDecksList(): void;
  getDecksList(): Array<Deck>;
  setDecksList(value: Array<Deck>): void;
  addDecks(value?: Deck, index?: number): Deck;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DecksResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DecksResponse): DecksResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DecksResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DecksResponse;
  static deserializeBinaryFromReader(message: DecksResponse, reader: jspb.BinaryReader): DecksResponse;
}

export namespace DecksResponse {
  export type AsObject = {
    userId: string,
    decksList: Array<Deck.AsObject>,
  }
}

export class ListDecksRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDecksRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListDecksRequest): ListDecksRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListDecksRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDecksRequest;
  static deserializeBinaryFromReader(message: ListDecksRequest, reader: jspb.BinaryReader): ListDecksRequest;
}

export namespace ListDecksRequest {
  export type AsObject = {
    userId: string,
  }
}

export class ListDecksResponse extends jspb.Message {
  clearDecksList(): void;
  getDecksList(): Array<Deck>;
  setDecksList(value: Array<Deck>): void;
  addDecks(value?: Deck, index?: number): Deck;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDecksResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListDecksResponse): ListDecksResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListDecksResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDecksResponse;
  static deserializeBinaryFromReader(message: ListDecksResponse, reader: jspb.BinaryReader): ListDecksResponse;
}

export namespace ListDecksResponse {
  export type AsObject = {
    decksList: Array<Deck.AsObject>,
  }
}

export class SetAIDecksRequest extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  clearDecksList(): void;
  getDecksList(): Array<AIDeck>;
  setDecksList(value: Array<AIDeck>): void;
  addDecks(value?: AIDeck, index?: number): AIDeck;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetAIDecksRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetAIDecksRequest): SetAIDecksRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetAIDecksRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetAIDecksRequest;
  static deserializeBinaryFromReader(message: SetAIDecksRequest, reader: jspb.BinaryReader): SetAIDecksRequest;
}

export namespace SetAIDecksRequest {
  export type AsObject = {
    version: string,
    decksList: Array<AIDeck.AsObject>,
  }
}

export class GetAIDecksRequest extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAIDecksRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAIDecksRequest): GetAIDecksRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAIDecksRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAIDecksRequest;
  static deserializeBinaryFromReader(message: GetAIDecksRequest, reader: jspb.BinaryReader): GetAIDecksRequest;
}

export namespace GetAIDecksRequest {
  export type AsObject = {
    version: string,
  }
}

export class GetAIDecksResponse extends jspb.Message {
  clearDecksList(): void;
  getDecksList(): Array<AIDeck>;
  setDecksList(value: Array<AIDeck>): void;
  addDecks(value?: AIDeck, index?: number): AIDeck;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAIDecksResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAIDecksResponse): GetAIDecksResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAIDecksResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAIDecksResponse;
  static deserializeBinaryFromReader(message: GetAIDecksResponse, reader: jspb.BinaryReader): GetAIDecksResponse;
}

export namespace GetAIDecksResponse {
  export type AsObject = {
    decksList: Array<AIDeck.AsObject>,
  }
}

export class ListCardLibraryRequest extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListCardLibraryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListCardLibraryRequest): ListCardLibraryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListCardLibraryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListCardLibraryRequest;
  static deserializeBinaryFromReader(message: ListCardLibraryRequest, reader: jspb.BinaryReader): ListCardLibraryRequest;
}

export namespace ListCardLibraryRequest {
  export type AsObject = {
    version: string,
  }
}

export class ListCardLibraryResponse extends jspb.Message {
  clearCardsList(): void;
  getCardsList(): Array<Card>;
  setCardsList(value: Array<Card>): void;
  addCards(value?: Card, index?: number): Card;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListCardLibraryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListCardLibraryResponse): ListCardLibraryResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListCardLibraryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListCardLibraryResponse;
  static deserializeBinaryFromReader(message: ListCardLibraryResponse, reader: jspb.BinaryReader): ListCardLibraryResponse;
}

export namespace ListCardLibraryResponse {
  export type AsObject = {
    cardsList: Array<Card.AsObject>,
  }
}

export class ListHeroLibraryRequest extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListHeroLibraryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListHeroLibraryRequest): ListHeroLibraryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListHeroLibraryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListHeroLibraryRequest;
  static deserializeBinaryFromReader(message: ListHeroLibraryRequest, reader: jspb.BinaryReader): ListHeroLibraryRequest;
}

export namespace ListHeroLibraryRequest {
  export type AsObject = {
    version: string,
  }
}

export class ListHeroLibraryResponse extends jspb.Message {
  clearHeroesList(): void;
  getHeroesList(): Array<Hero>;
  setHeroesList(value: Array<Hero>): void;
  addHeroes(value?: Hero, index?: number): Hero;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListHeroLibraryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListHeroLibraryResponse): ListHeroLibraryResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListHeroLibraryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListHeroLibraryResponse;
  static deserializeBinaryFromReader(message: ListHeroLibraryResponse, reader: jspb.BinaryReader): ListHeroLibraryResponse;
}

export namespace ListHeroLibraryResponse {
  export type AsObject = {
    heroesList: Array<Hero.AsObject>,
  }
}

export class UpdateHeroLibraryRequest extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  clearHeroesList(): void;
  getHeroesList(): Array<Hero>;
  setHeroesList(value: Array<Hero>): void;
  addHeroes(value?: Hero, index?: number): Hero;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateHeroLibraryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateHeroLibraryRequest): UpdateHeroLibraryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateHeroLibraryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateHeroLibraryRequest;
  static deserializeBinaryFromReader(message: UpdateHeroLibraryRequest, reader: jspb.BinaryReader): UpdateHeroLibraryRequest;
}

export namespace UpdateHeroLibraryRequest {
  export type AsObject = {
    version: string,
    heroesList: Array<Hero.AsObject>,
  }
}

export class UpdateHeroLibraryResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateHeroLibraryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateHeroLibraryResponse): UpdateHeroLibraryResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateHeroLibraryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateHeroLibraryResponse;
  static deserializeBinaryFromReader(message: UpdateHeroLibraryResponse, reader: jspb.BinaryReader): UpdateHeroLibraryResponse;
}

export namespace UpdateHeroLibraryResponse {
  export type AsObject = {
  }
}

export class GetCollectionRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCollectionRequest): GetCollectionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCollectionRequest;
  static deserializeBinaryFromReader(message: GetCollectionRequest, reader: jspb.BinaryReader): GetCollectionRequest;
}

export namespace GetCollectionRequest {
  export type AsObject = {
    userId: string,
  }
}

export class GetCollectionResponse extends jspb.Message {
  clearCardsList(): void;
  getCardsList(): Array<CardCollectionCard>;
  setCardsList(value: Array<CardCollectionCard>): void;
  addCards(value?: CardCollectionCard, index?: number): CardCollectionCard;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCollectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCollectionResponse): GetCollectionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCollectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCollectionResponse;
  static deserializeBinaryFromReader(message: GetCollectionResponse, reader: jspb.BinaryReader): GetCollectionResponse;
}

export namespace GetCollectionResponse {
  export type AsObject = {
    cardsList: Array<CardCollectionCard.AsObject>,
  }
}

export class PlayerState extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getCurrentaction(): PlayerActionType.Enum;
  setCurrentaction(value: PlayerActionType.Enum): void;

  hasOverlordinstance(): boolean;
  clearOverlordinstance(): void;
  getOverlordinstance(): OverlordInstance | undefined;
  setOverlordinstance(value?: OverlordInstance): void;

  clearCardsinhandList(): void;
  getCardsinhandList(): Array<CardInstance>;
  setCardsinhandList(value: Array<CardInstance>): void;
  addCardsinhand(value?: CardInstance, index?: number): CardInstance;

  clearCardsinplayList(): void;
  getCardsinplayList(): Array<CardInstance>;
  setCardsinplayList(value: Array<CardInstance>): void;
  addCardsinplay(value?: CardInstance, index?: number): CardInstance;

  clearCardsindeckList(): void;
  getCardsindeckList(): Array<CardInstance>;
  setCardsindeckList(value: Array<CardInstance>): void;
  addCardsindeck(value?: CardInstance, index?: number): CardInstance;

  hasDeck(): boolean;
  clearDeck(): void;
  getDeck(): Deck | undefined;
  setDeck(value?: Deck): void;

  getDefense(): number;
  setDefense(value: number): void;

  getCurrentgoo(): number;
  setCurrentgoo(value: number): void;

  getGoovials(): number;
  setGoovials(value: number): void;

  getHasdrawncard(): boolean;
  setHasdrawncard(value: boolean): void;

  clearCardsingraveyardList(): void;
  getCardsingraveyardList(): Array<CardInstance>;
  setCardsingraveyardList(value: Array<CardInstance>): void;
  addCardsingraveyard(value?: CardInstance, index?: number): CardInstance;

  getInitialcardsinhandcount(): number;
  setInitialcardsinhandcount(value: number): void;

  getMaxcardsinplay(): number;
  setMaxcardsinplay(value: number): void;

  getMaxcardsinhand(): number;
  setMaxcardsinhand(value: number): void;

  getMaxgoovials(): number;
  setMaxgoovials(value: number): void;

  getTurntime(): number;
  setTurntime(value: number): void;

  getMatchaccepted(): boolean;
  setMatchaccepted(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerState.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerState): PlayerState.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerState;
  static deserializeBinaryFromReader(message: PlayerState, reader: jspb.BinaryReader): PlayerState;
}

export namespace PlayerState {
  export type AsObject = {
    id: string,
    currentaction: PlayerActionType.Enum,
    overlordinstance?: OverlordInstance.AsObject,
    cardsinhandList: Array<CardInstance.AsObject>,
    cardsinplayList: Array<CardInstance.AsObject>,
    cardsindeckList: Array<CardInstance.AsObject>,
    deck?: Deck.AsObject,
    defense: number,
    currentgoo: number,
    goovials: number,
    hasdrawncard: boolean,
    cardsingraveyardList: Array<CardInstance.AsObject>,
    initialcardsinhandcount: number,
    maxcardsinplay: number,
    maxcardsinhand: number,
    maxgoovials: number,
    turntime: number,
    matchaccepted: boolean,
  }
}

export class Match extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  clearTopicsList(): void;
  getTopicsList(): Array<string>;
  setTopicsList(value: Array<string>): void;
  addTopics(value: string, index?: number): string;

  clearPlayerstatesList(): void;
  getPlayerstatesList(): Array<PlayerState>;
  setPlayerstatesList(value: Array<PlayerState>): void;
  addPlayerstates(value?: PlayerState, index?: number): PlayerState;

  getStatus(): Match.Status;
  setStatus(value: Match.Status): void;

  getVersion(): string;
  setVersion(value: string): void;

  getRandomseed(): number;
  setRandomseed(value: number): void;

  hasCustomgameaddr(): boolean;
  clearCustomgameaddr(): void;
  getCustomgameaddr(): proto_loom_pb.Address | undefined;
  setCustomgameaddr(value?: proto_loom_pb.Address): void;

  getCreatedat(): number;
  setCreatedat(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Match.AsObject;
  static toObject(includeInstance: boolean, msg: Match): Match.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Match, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Match;
  static deserializeBinaryFromReader(message: Match, reader: jspb.BinaryReader): Match;
}

export namespace Match {
  export type AsObject = {
    id: number,
    topicsList: Array<string>,
    playerstatesList: Array<PlayerState.AsObject>,
    status: Match.Status,
    version: string,
    randomseed: number,
    customgameaddr?: proto_loom_pb.Address.AsObject,
    createdat: number,
  }

  export enum Status {
    CREATED = 0,
    MATCHING = 1,
    STARTED = 2,
    PLAYING = 3,
    PLAYERLEFT = 4,
    ENDED = 5,
    TIMEDOUT = 6,
    CANCELED = 7,
  }
}

export class MatchMakingInfoList extends jspb.Message {
  clearInfosList(): void;
  getInfosList(): Array<MatchMakingInfo>;
  setInfosList(value: Array<MatchMakingInfo>): void;
  addInfos(value?: MatchMakingInfo, index?: number): MatchMakingInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchMakingInfoList.AsObject;
  static toObject(includeInstance: boolean, msg: MatchMakingInfoList): MatchMakingInfoList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchMakingInfoList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchMakingInfoList;
  static deserializeBinaryFromReader(message: MatchMakingInfoList, reader: jspb.BinaryReader): MatchMakingInfoList;
}

export namespace MatchMakingInfoList {
  export type AsObject = {
    infosList: Array<MatchMakingInfo.AsObject>,
  }
}

export class MatchMakingInfo extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): void;

  hasDeck(): boolean;
  clearDeck(): void;
  getDeck(): Deck | undefined;
  setDeck(value?: Deck): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchMakingInfo.AsObject;
  static toObject(includeInstance: boolean, msg: MatchMakingInfo): MatchMakingInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchMakingInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchMakingInfo;
  static deserializeBinaryFromReader(message: MatchMakingInfo, reader: jspb.BinaryReader): MatchMakingInfo;
}

export namespace MatchMakingInfo {
  export type AsObject = {
    userid: string,
    deck?: Deck.AsObject,
  }
}

export class PlayerActionType extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerActionType.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerActionType): PlayerActionType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerActionType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerActionType;
  static deserializeBinaryFromReader(message: PlayerActionType, reader: jspb.BinaryReader): PlayerActionType;
}

export namespace PlayerActionType {
  export type AsObject = {
  }

  export enum Enum {
    NONE = 0,
    ENDTURN = 1,
    MULLIGAN = 2,
    DRAWCARD = 3,
    CARDPLAY = 4,
    CARDATTACK = 5,
    CARDABILITYUSED = 6,
    OVERLORDSKILLUSED = 7,
    COINTOSS = 8,
    INITHANDS = 9,
    LEAVEMATCH = 10,
    RANKBUFF = 11,
  }
}

export class PlayerAction extends jspb.Message {
  getActiontype(): PlayerActionType.Enum;
  setActiontype(value: PlayerActionType.Enum): void;

  getPlayerid(): string;
  setPlayerid(value: string): void;

  hasCardattack(): boolean;
  clearCardattack(): void;
  getCardattack(): PlayerActionCardAttack | undefined;
  setCardattack(value?: PlayerActionCardAttack): void;

  hasDrawcard(): boolean;
  clearDrawcard(): void;
  getDrawcard(): PlayerActionDrawCard | undefined;
  setDrawcard(value?: PlayerActionDrawCard): void;

  hasEndturn(): boolean;
  clearEndturn(): void;
  getEndturn(): PlayerActionEndTurn | undefined;
  setEndturn(value?: PlayerActionEndTurn): void;

  hasMulligan(): boolean;
  clearMulligan(): void;
  getMulligan(): PlayerActionMulligan | undefined;
  setMulligan(value?: PlayerActionMulligan): void;

  hasCardplay(): boolean;
  clearCardplay(): void;
  getCardplay(): PlayerActionCardPlay | undefined;
  setCardplay(value?: PlayerActionCardPlay): void;

  hasCardabilityused(): boolean;
  clearCardabilityused(): void;
  getCardabilityused(): PlayerActionCardAbilityUsed | undefined;
  setCardabilityused(value?: PlayerActionCardAbilityUsed): void;

  hasOverlordskillused(): boolean;
  clearOverlordskillused(): void;
  getOverlordskillused(): PlayerActionOverlordSkillUsed | undefined;
  setOverlordskillused(value?: PlayerActionOverlordSkillUsed): void;

  hasLeavematch(): boolean;
  clearLeavematch(): void;
  getLeavematch(): PlayerActionLeaveMatch | undefined;
  setLeavematch(value?: PlayerActionLeaveMatch): void;

  hasRankbuff(): boolean;
  clearRankbuff(): void;
  getRankbuff(): PlayerActionRankBuff | undefined;
  setRankbuff(value?: PlayerActionRankBuff): void;

  getCreatedat(): number;
  setCreatedat(value: number): void;

  getActionCase(): PlayerAction.ActionCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerAction.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerAction): PlayerAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerAction;
  static deserializeBinaryFromReader(message: PlayerAction, reader: jspb.BinaryReader): PlayerAction;
}

export namespace PlayerAction {
  export type AsObject = {
    actiontype: PlayerActionType.Enum,
    playerid: string,
    cardattack?: PlayerActionCardAttack.AsObject,
    drawcard?: PlayerActionDrawCard.AsObject,
    endturn?: PlayerActionEndTurn.AsObject,
    mulligan?: PlayerActionMulligan.AsObject,
    cardplay?: PlayerActionCardPlay.AsObject,
    cardabilityused?: PlayerActionCardAbilityUsed.AsObject,
    overlordskillused?: PlayerActionOverlordSkillUsed.AsObject,
    leavematch?: PlayerActionLeaveMatch.AsObject,
    rankbuff?: PlayerActionRankBuff.AsObject,
    createdat: number,
  }

  export enum ActionCase {
    ACTION_NOT_SET = 0,
    CARDATTACK = 3,
    DRAWCARD = 4,
    ENDTURN = 5,
    MULLIGAN = 6,
    CARDPLAY = 7,
    CARDABILITYUSED = 8,
    OVERLORDSKILLUSED = 9,
    LEAVEMATCH = 12,
    RANKBUFF = 13,
  }
}

export class PlayerActionEvent extends jspb.Message {
  hasPlayeraction(): boolean;
  clearPlayeraction(): void;
  getPlayeraction(): PlayerAction | undefined;
  setPlayeraction(value?: PlayerAction): void;

  hasMatch(): boolean;
  clearMatch(): void;
  getMatch(): Match | undefined;
  setMatch(value?: Match): void;

  hasBlock(): boolean;
  clearBlock(): void;
  getBlock(): History | undefined;
  setBlock(value?: History): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerActionEvent.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerActionEvent): PlayerActionEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerActionEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerActionEvent;
  static deserializeBinaryFromReader(message: PlayerActionEvent, reader: jspb.BinaryReader): PlayerActionEvent;
}

export namespace PlayerActionEvent {
  export type AsObject = {
    playeraction?: PlayerAction.AsObject,
    match?: Match.AsObject,
    block?: History.AsObject,
  }
}

export class PlayerProfile extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): void;

  getDeckid(): number;
  setDeckid(value: number): void;

  getVersion(): string;
  setVersion(value: string): void;

  hasCustomgame(): boolean;
  clearCustomgame(): void;
  getCustomgame(): proto_loom_pb.Address | undefined;
  setCustomgame(value?: proto_loom_pb.Address): void;

  getUpdatedat(): number;
  setUpdatedat(value: number): void;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  getRandomseed(): number;
  setRandomseed(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerProfile.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerProfile): PlayerProfile.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerProfile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerProfile;
  static deserializeBinaryFromReader(message: PlayerProfile, reader: jspb.BinaryReader): PlayerProfile;
}

export namespace PlayerProfile {
  export type AsObject = {
    userid: string,
    deckid: number,
    version: string,
    customgame?: proto_loom_pb.Address.AsObject,
    updatedat: number,
    tagsList: Array<string>,
    randomseed: number,
  }
}

export class PlayerPool extends jspb.Message {
  clearPlayerprofilesList(): void;
  getPlayerprofilesList(): Array<PlayerProfile>;
  setPlayerprofilesList(value: Array<PlayerProfile>): void;
  addPlayerprofiles(value?: PlayerProfile, index?: number): PlayerProfile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerPool.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerPool): PlayerPool.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerPool, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerPool;
  static deserializeBinaryFromReader(message: PlayerPool, reader: jspb.BinaryReader): PlayerPool;
}

export namespace PlayerPool {
  export type AsObject = {
    playerprofilesList: Array<PlayerProfile.AsObject>,
  }
}

export class MatchCount extends jspb.Message {
  getCurrentid(): number;
  setCurrentid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchCount.AsObject;
  static toObject(includeInstance: boolean, msg: MatchCount): MatchCount.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchCount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchCount;
  static deserializeBinaryFromReader(message: MatchCount, reader: jspb.BinaryReader): MatchCount;
}

export namespace MatchCount {
  export type AsObject = {
    currentid: number,
  }
}

export class RegisterPlayerPoolRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): void;

  getDeckid(): number;
  setDeckid(value: number): void;

  getVersion(): string;
  setVersion(value: string): void;

  hasCustomgame(): boolean;
  clearCustomgame(): void;
  getCustomgame(): proto_loom_pb.Address | undefined;
  setCustomgame(value?: proto_loom_pb.Address): void;

  getRandomseed(): number;
  setRandomseed(value: number): void;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterPlayerPoolRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterPlayerPoolRequest): RegisterPlayerPoolRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RegisterPlayerPoolRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterPlayerPoolRequest;
  static deserializeBinaryFromReader(message: RegisterPlayerPoolRequest, reader: jspb.BinaryReader): RegisterPlayerPoolRequest;
}

export namespace RegisterPlayerPoolRequest {
  export type AsObject = {
    userid: string,
    deckid: number,
    version: string,
    customgame?: proto_loom_pb.Address.AsObject,
    randomseed: number,
    tagsList: Array<string>,
  }
}

export class RegisterPlayerPoolResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterPlayerPoolResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterPlayerPoolResponse): RegisterPlayerPoolResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RegisterPlayerPoolResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterPlayerPoolResponse;
  static deserializeBinaryFromReader(message: RegisterPlayerPoolResponse, reader: jspb.BinaryReader): RegisterPlayerPoolResponse;
}

export namespace RegisterPlayerPoolResponse {
  export type AsObject = {
  }
}

export class PlayerPoolRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerPoolRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerPoolRequest): PlayerPoolRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerPoolRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerPoolRequest;
  static deserializeBinaryFromReader(message: PlayerPoolRequest, reader: jspb.BinaryReader): PlayerPoolRequest;
}

export namespace PlayerPoolRequest {
  export type AsObject = {
  }
}

export class PlayerPoolResponse extends jspb.Message {
  hasPool(): boolean;
  clearPool(): void;
  getPool(): PlayerPool | undefined;
  setPool(value?: PlayerPool): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerPoolResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerPoolResponse): PlayerPoolResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerPoolResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerPoolResponse;
  static deserializeBinaryFromReader(message: PlayerPoolResponse, reader: jspb.BinaryReader): PlayerPoolResponse;
}

export namespace PlayerPoolResponse {
  export type AsObject = {
    pool?: PlayerPool.AsObject,
  }
}

export class FindMatchRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): void;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FindMatchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FindMatchRequest): FindMatchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FindMatchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FindMatchRequest;
  static deserializeBinaryFromReader(message: FindMatchRequest, reader: jspb.BinaryReader): FindMatchRequest;
}

export namespace FindMatchRequest {
  export type AsObject = {
    userid: string,
    tagsList: Array<string>,
  }
}

export class FindMatchResponse extends jspb.Message {
  hasMatch(): boolean;
  clearMatch(): void;
  getMatch(): Match | undefined;
  setMatch(value?: Match): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FindMatchResponse.AsObject;
  static toObject(includeInstance: boolean, msg: FindMatchResponse): FindMatchResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FindMatchResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FindMatchResponse;
  static deserializeBinaryFromReader(message: FindMatchResponse, reader: jspb.BinaryReader): FindMatchResponse;
}

export namespace FindMatchResponse {
  export type AsObject = {
    match?: Match.AsObject,
  }
}

export class AcceptMatchRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): void;

  getMatchid(): number;
  setMatchid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AcceptMatchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AcceptMatchRequest): AcceptMatchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AcceptMatchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AcceptMatchRequest;
  static deserializeBinaryFromReader(message: AcceptMatchRequest, reader: jspb.BinaryReader): AcceptMatchRequest;
}

export namespace AcceptMatchRequest {
  export type AsObject = {
    userid: string,
    matchid: number,
  }
}

export class AcceptMatchResponse extends jspb.Message {
  hasMatch(): boolean;
  clearMatch(): void;
  getMatch(): Match | undefined;
  setMatch(value?: Match): void;

  hasBlock(): boolean;
  clearBlock(): void;
  getBlock(): History | undefined;
  setBlock(value?: History): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AcceptMatchResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AcceptMatchResponse): AcceptMatchResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AcceptMatchResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AcceptMatchResponse;
  static deserializeBinaryFromReader(message: AcceptMatchResponse, reader: jspb.BinaryReader): AcceptMatchResponse;
}

export namespace AcceptMatchResponse {
  export type AsObject = {
    match?: Match.AsObject,
    block?: History.AsObject,
  }
}

export class DebugFindMatchRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): void;

  getDeckid(): number;
  setDeckid(value: number): void;

  getVersion(): string;
  setVersion(value: string): void;

  getRandomseed(): number;
  setRandomseed(value: number): void;

  hasCustomgame(): boolean;
  clearCustomgame(): void;
  getCustomgame(): proto_loom_pb.Address | undefined;
  setCustomgame(value?: proto_loom_pb.Address): void;

  hasDeck(): boolean;
  clearDeck(): void;
  getDeck(): Deck | undefined;
  setDeck(value?: Deck): void;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DebugFindMatchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DebugFindMatchRequest): DebugFindMatchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DebugFindMatchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DebugFindMatchRequest;
  static deserializeBinaryFromReader(message: DebugFindMatchRequest, reader: jspb.BinaryReader): DebugFindMatchRequest;
}

export namespace DebugFindMatchRequest {
  export type AsObject = {
    userid: string,
    deckid: number,
    version: string,
    randomseed: number,
    customgame?: proto_loom_pb.Address.AsObject,
    deck?: Deck.AsObject,
    tagsList: Array<string>,
  }
}

export class CancelFindMatchRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): void;

  getMatchid(): number;
  setMatchid(value: number): void;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CancelFindMatchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CancelFindMatchRequest): CancelFindMatchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CancelFindMatchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CancelFindMatchRequest;
  static deserializeBinaryFromReader(message: CancelFindMatchRequest, reader: jspb.BinaryReader): CancelFindMatchRequest;
}

export namespace CancelFindMatchRequest {
  export type AsObject = {
    userid: string,
    matchid: number,
    tagsList: Array<string>,
  }
}

export class CancelFindMatchResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CancelFindMatchResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CancelFindMatchResponse): CancelFindMatchResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CancelFindMatchResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CancelFindMatchResponse;
  static deserializeBinaryFromReader(message: CancelFindMatchResponse, reader: jspb.BinaryReader): CancelFindMatchResponse;
}

export namespace CancelFindMatchResponse {
  export type AsObject = {
  }
}

export class GetMatchRequest extends jspb.Message {
  getMatchid(): number;
  setMatchid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMatchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMatchRequest): GetMatchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetMatchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMatchRequest;
  static deserializeBinaryFromReader(message: GetMatchRequest, reader: jspb.BinaryReader): GetMatchRequest;
}

export namespace GetMatchRequest {
  export type AsObject = {
    matchid: number,
  }
}

export class GetMatchResponse extends jspb.Message {
  hasMatch(): boolean;
  clearMatch(): void;
  getMatch(): Match | undefined;
  setMatch(value?: Match): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMatchResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMatchResponse): GetMatchResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetMatchResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMatchResponse;
  static deserializeBinaryFromReader(message: GetMatchResponse, reader: jspb.BinaryReader): GetMatchResponse;
}

export namespace GetMatchResponse {
  export type AsObject = {
    match?: Match.AsObject,
  }
}

export class SetMatchRequest extends jspb.Message {
  hasMatch(): boolean;
  clearMatch(): void;
  getMatch(): Match | undefined;
  setMatch(value?: Match): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetMatchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetMatchRequest): SetMatchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetMatchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetMatchRequest;
  static deserializeBinaryFromReader(message: SetMatchRequest, reader: jspb.BinaryReader): SetMatchRequest;
}

export namespace SetMatchRequest {
  export type AsObject = {
    match?: Match.AsObject,
  }
}

export class GetGameStateRequest extends jspb.Message {
  getMatchid(): number;
  setMatchid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGameStateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetGameStateRequest): GetGameStateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetGameStateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGameStateRequest;
  static deserializeBinaryFromReader(message: GetGameStateRequest, reader: jspb.BinaryReader): GetGameStateRequest;
}

export namespace GetGameStateRequest {
  export type AsObject = {
    matchid: number,
  }
}

export class GetGameStateResponse extends jspb.Message {
  hasGamestate(): boolean;
  clearGamestate(): void;
  getGamestate(): GameState | undefined;
  setGamestate(value?: GameState): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGameStateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetGameStateResponse): GetGameStateResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetGameStateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGameStateResponse;
  static deserializeBinaryFromReader(message: GetGameStateResponse, reader: jspb.BinaryReader): GetGameStateResponse;
}

export namespace GetGameStateResponse {
  export type AsObject = {
    gamestate?: GameState.AsObject,
  }
}

export class SetGameStateRequest extends jspb.Message {
  hasGamestate(): boolean;
  clearGamestate(): void;
  getGamestate(): GameState | undefined;
  setGamestate(value?: GameState): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetGameStateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetGameStateRequest): SetGameStateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetGameStateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetGameStateRequest;
  static deserializeBinaryFromReader(message: SetGameStateRequest, reader: jspb.BinaryReader): SetGameStateRequest;
}

export namespace SetGameStateRequest {
  export type AsObject = {
    gamestate?: GameState.AsObject,
  }
}

export class PlayerActionRequest extends jspb.Message {
  getMatchid(): number;
  setMatchid(value: number): void;

  hasPlayeraction(): boolean;
  clearPlayeraction(): void;
  getPlayeraction(): PlayerAction | undefined;
  setPlayeraction(value?: PlayerAction): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerActionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerActionRequest): PlayerActionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerActionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerActionRequest;
  static deserializeBinaryFromReader(message: PlayerActionRequest, reader: jspb.BinaryReader): PlayerActionRequest;
}

export namespace PlayerActionRequest {
  export type AsObject = {
    matchid: number,
    playeraction?: PlayerAction.AsObject,
  }
}

export class PlayerActionResponse extends jspb.Message {
  hasGamestate(): boolean;
  clearGamestate(): void;
  getGamestate(): GameState | undefined;
  setGamestate(value?: GameState): void;

  hasMatch(): boolean;
  clearMatch(): void;
  getMatch(): Match | undefined;
  setMatch(value?: Match): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerActionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerActionResponse): PlayerActionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerActionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerActionResponse;
  static deserializeBinaryFromReader(message: PlayerActionResponse, reader: jspb.BinaryReader): PlayerActionResponse;
}

export namespace PlayerActionResponse {
  export type AsObject = {
    gamestate?: GameState.AsObject,
    match?: Match.AsObject,
  }
}

export class BundlePlayerActionRequest extends jspb.Message {
  getMatchid(): number;
  setMatchid(value: number): void;

  clearPlayeractionsList(): void;
  getPlayeractionsList(): Array<PlayerAction>;
  setPlayeractionsList(value: Array<PlayerAction>): void;
  addPlayeractions(value?: PlayerAction, index?: number): PlayerAction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BundlePlayerActionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BundlePlayerActionRequest): BundlePlayerActionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BundlePlayerActionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BundlePlayerActionRequest;
  static deserializeBinaryFromReader(message: BundlePlayerActionRequest, reader: jspb.BinaryReader): BundlePlayerActionRequest;
}

export namespace BundlePlayerActionRequest {
  export type AsObject = {
    matchid: number,
    playeractionsList: Array<PlayerAction.AsObject>,
  }
}

export class BundlePlayerActionResponse extends jspb.Message {
  hasGamestate(): boolean;
  clearGamestate(): void;
  getGamestate(): GameState | undefined;
  setGamestate(value?: GameState): void;

  hasMatch(): boolean;
  clearMatch(): void;
  getMatch(): Match | undefined;
  setMatch(value?: Match): void;

  clearHistoryList(): void;
  getHistoryList(): Array<HistoryData>;
  setHistoryList(value: Array<HistoryData>): void;
  addHistory(value?: HistoryData, index?: number): HistoryData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BundlePlayerActionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: BundlePlayerActionResponse): BundlePlayerActionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BundlePlayerActionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BundlePlayerActionResponse;
  static deserializeBinaryFromReader(message: BundlePlayerActionResponse, reader: jspb.BinaryReader): BundlePlayerActionResponse;
}

export namespace BundlePlayerActionResponse {
  export type AsObject = {
    gamestate?: GameState.AsObject,
    match?: Match.AsObject,
    historyList: Array<HistoryData.AsObject>,
  }
}

export class EndMatchRequest extends jspb.Message {
  getMatchid(): number;
  setMatchid(value: number): void;

  getUserid(): string;
  setUserid(value: string): void;

  getWinnerid(): string;
  setWinnerid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EndMatchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EndMatchRequest): EndMatchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EndMatchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EndMatchRequest;
  static deserializeBinaryFromReader(message: EndMatchRequest, reader: jspb.BinaryReader): EndMatchRequest;
}

export namespace EndMatchRequest {
  export type AsObject = {
    matchid: number,
    userid: string,
    winnerid: string,
  }
}

export class EndMatchResponse extends jspb.Message {
  hasGamestate(): boolean;
  clearGamestate(): void;
  getGamestate(): GameState | undefined;
  setGamestate(value?: GameState): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EndMatchResponse.AsObject;
  static toObject(includeInstance: boolean, msg: EndMatchResponse): EndMatchResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EndMatchResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EndMatchResponse;
  static deserializeBinaryFromReader(message: EndMatchResponse, reader: jspb.BinaryReader): EndMatchResponse;
}

export namespace EndMatchResponse {
  export type AsObject = {
    gamestate?: GameState.AsObject,
  }
}

export class CheckGameStatusRequest extends jspb.Message {
  getMatchid(): number;
  setMatchid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckGameStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CheckGameStatusRequest): CheckGameStatusRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckGameStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckGameStatusRequest;
  static deserializeBinaryFromReader(message: CheckGameStatusRequest, reader: jspb.BinaryReader): CheckGameStatusRequest;
}

export namespace CheckGameStatusRequest {
  export type AsObject = {
    matchid: number,
  }
}

export class CheckGameStatusResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckGameStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CheckGameStatusResponse): CheckGameStatusResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckGameStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckGameStatusResponse;
  static deserializeBinaryFromReader(message: CheckGameStatusResponse, reader: jspb.BinaryReader): CheckGameStatusResponse;
}

export namespace CheckGameStatusResponse {
  export type AsObject = {
  }
}

export class GameMode extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getGameModeType(): GameModeType;
  setGameModeType(value: GameModeType): void;

  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  hasOwner(): boolean;
  clearOwner(): void;
  getOwner(): proto_loom_pb.Address | undefined;
  setOwner(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GameMode.AsObject;
  static toObject(includeInstance: boolean, msg: GameMode): GameMode.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GameMode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GameMode;
  static deserializeBinaryFromReader(message: GameMode, reader: jspb.BinaryReader): GameMode;
}

export namespace GameMode {
  export type AsObject = {
    id: string,
    name: string,
    description: string,
    version: string,
    gameModeType: GameModeType,
    address?: proto_loom_pb.Address.AsObject,
    owner?: proto_loom_pb.Address.AsObject,
  }
}

export class GameModeList extends jspb.Message {
  clearGameModesList(): void;
  getGameModesList(): Array<GameMode>;
  setGameModesList(value: Array<GameMode>): void;
  addGameModes(value?: GameMode, index?: number): GameMode;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GameModeList.AsObject;
  static toObject(includeInstance: boolean, msg: GameModeList): GameModeList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GameModeList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GameModeList;
  static deserializeBinaryFromReader(message: GameModeList, reader: jspb.BinaryReader): GameModeList;
}

export namespace GameModeList {
  export type AsObject = {
    gameModesList: Array<GameMode.AsObject>,
  }
}

export class GameModeRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

  getGameModeType(): GameModeType;
  setGameModeType(value: GameModeType): void;

  getOracle(): string;
  setOracle(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GameModeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GameModeRequest): GameModeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GameModeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GameModeRequest;
  static deserializeBinaryFromReader(message: GameModeRequest, reader: jspb.BinaryReader): GameModeRequest;
}

export namespace GameModeRequest {
  export type AsObject = {
    name: string,
    description: string,
    version: string,
    address: string,
    gameModeType: GameModeType,
    oracle: string,
  }
}

export class UpdateGameModeRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

  getGameModeType(): GameModeType;
  setGameModeType(value: GameModeType): void;

  getOracle(): string;
  setOracle(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateGameModeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateGameModeRequest): UpdateGameModeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateGameModeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateGameModeRequest;
  static deserializeBinaryFromReader(message: UpdateGameModeRequest, reader: jspb.BinaryReader): UpdateGameModeRequest;
}

export namespace UpdateGameModeRequest {
  export type AsObject = {
    id: string,
    name: string,
    description: string,
    version: string,
    address: string,
    gameModeType: GameModeType,
    oracle: string,
  }
}

export class DeleteGameModeRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getOracle(): string;
  setOracle(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteGameModeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteGameModeRequest): DeleteGameModeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteGameModeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteGameModeRequest;
  static deserializeBinaryFromReader(message: DeleteGameModeRequest, reader: jspb.BinaryReader): DeleteGameModeRequest;
}

export namespace DeleteGameModeRequest {
  export type AsObject = {
    id: string,
    oracle: string,
  }
}

export class GetGameModeRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGameModeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetGameModeRequest): GetGameModeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetGameModeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGameModeRequest;
  static deserializeBinaryFromReader(message: GetGameModeRequest, reader: jspb.BinaryReader): GetGameModeRequest;
}

export namespace GetGameModeRequest {
  export type AsObject = {
    id: string,
  }
}

export class ListGameModesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListGameModesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListGameModesRequest): ListGameModesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListGameModesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListGameModesRequest;
  static deserializeBinaryFromReader(message: ListGameModesRequest, reader: jspb.BinaryReader): ListGameModesRequest;
}

export namespace ListGameModesRequest {
  export type AsObject = {
  }
}

export class GetCustomGameModeCustomUiRequest extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCustomGameModeCustomUiRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCustomGameModeCustomUiRequest): GetCustomGameModeCustomUiRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCustomGameModeCustomUiRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCustomGameModeCustomUiRequest;
  static deserializeBinaryFromReader(message: GetCustomGameModeCustomUiRequest, reader: jspb.BinaryReader): GetCustomGameModeCustomUiRequest;
}

export namespace GetCustomGameModeCustomUiRequest {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
  }
}

export class GetCustomGameModeCustomUiResponse extends jspb.Message {
  clearUielementsList(): void;
  getUielementsList(): Array<CustomGameModeCustomUiElement>;
  setUielementsList(value: Array<CustomGameModeCustomUiElement>): void;
  addUielements(value?: CustomGameModeCustomUiElement, index?: number): CustomGameModeCustomUiElement;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCustomGameModeCustomUiResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCustomGameModeCustomUiResponse): GetCustomGameModeCustomUiResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCustomGameModeCustomUiResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCustomGameModeCustomUiResponse;
  static deserializeBinaryFromReader(message: GetCustomGameModeCustomUiResponse, reader: jspb.BinaryReader): GetCustomGameModeCustomUiResponse;
}

export namespace GetCustomGameModeCustomUiResponse {
  export type AsObject = {
    uielementsList: Array<CustomGameModeCustomUiElement.AsObject>,
  }
}

export class CallCustomGameModeFunctionRequest extends jspb.Message {
  hasAddress(): boolean;
  clearAddress(): void;
  getAddress(): proto_loom_pb.Address | undefined;
  setAddress(value?: proto_loom_pb.Address): void;

  getCalldata(): Uint8Array | string;
  getCalldata_asU8(): Uint8Array;
  getCalldata_asB64(): string;
  setCalldata(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CallCustomGameModeFunctionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CallCustomGameModeFunctionRequest): CallCustomGameModeFunctionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CallCustomGameModeFunctionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CallCustomGameModeFunctionRequest;
  static deserializeBinaryFromReader(message: CallCustomGameModeFunctionRequest, reader: jspb.BinaryReader): CallCustomGameModeFunctionRequest;
}

export namespace CallCustomGameModeFunctionRequest {
  export type AsObject = {
    address?: proto_loom_pb.Address.AsObject,
    calldata: Uint8Array | string,
  }
}

export class StaticCallCustomGameModeFunctionResponse extends jspb.Message {
  getOutput(): Uint8Array | string;
  getOutput_asU8(): Uint8Array;
  getOutput_asB64(): string;
  setOutput(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StaticCallCustomGameModeFunctionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StaticCallCustomGameModeFunctionResponse): StaticCallCustomGameModeFunctionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StaticCallCustomGameModeFunctionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StaticCallCustomGameModeFunctionResponse;
  static deserializeBinaryFromReader(message: StaticCallCustomGameModeFunctionResponse, reader: jspb.BinaryReader): StaticCallCustomGameModeFunctionResponse;
}

export namespace StaticCallCustomGameModeFunctionResponse {
  export type AsObject = {
    output: Uint8Array | string,
  }
}

export class CustomGameModeCustomUiLabel extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CustomGameModeCustomUiLabel.AsObject;
  static toObject(includeInstance: boolean, msg: CustomGameModeCustomUiLabel): CustomGameModeCustomUiLabel.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CustomGameModeCustomUiLabel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CustomGameModeCustomUiLabel;
  static deserializeBinaryFromReader(message: CustomGameModeCustomUiLabel, reader: jspb.BinaryReader): CustomGameModeCustomUiLabel;
}

export namespace CustomGameModeCustomUiLabel {
  export type AsObject = {
    text: string,
  }
}

export class CustomGameModeCustomUiButton extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): void;

  getCalldata(): Uint8Array | string;
  getCalldata_asU8(): Uint8Array;
  getCalldata_asB64(): string;
  setCalldata(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CustomGameModeCustomUiButton.AsObject;
  static toObject(includeInstance: boolean, msg: CustomGameModeCustomUiButton): CustomGameModeCustomUiButton.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CustomGameModeCustomUiButton, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CustomGameModeCustomUiButton;
  static deserializeBinaryFromReader(message: CustomGameModeCustomUiButton, reader: jspb.BinaryReader): CustomGameModeCustomUiButton;
}

export namespace CustomGameModeCustomUiButton {
  export type AsObject = {
    title: string,
    calldata: Uint8Array | string,
  }
}

export class CustomGameModeCustomUiElement extends jspb.Message {
  hasRect(): boolean;
  clearRect(): void;
  getRect(): Rect | undefined;
  setRect(value?: Rect): void;

  hasLabel(): boolean;
  clearLabel(): void;
  getLabel(): CustomGameModeCustomUiLabel | undefined;
  setLabel(value?: CustomGameModeCustomUiLabel): void;

  hasButton(): boolean;
  clearButton(): void;
  getButton(): CustomGameModeCustomUiButton | undefined;
  setButton(value?: CustomGameModeCustomUiButton): void;

  getUiElementCase(): CustomGameModeCustomUiElement.UiElementCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CustomGameModeCustomUiElement.AsObject;
  static toObject(includeInstance: boolean, msg: CustomGameModeCustomUiElement): CustomGameModeCustomUiElement.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CustomGameModeCustomUiElement, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CustomGameModeCustomUiElement;
  static deserializeBinaryFromReader(message: CustomGameModeCustomUiElement, reader: jspb.BinaryReader): CustomGameModeCustomUiElement;
}

export namespace CustomGameModeCustomUiElement {
  export type AsObject = {
    rect?: Rect.AsObject,
    label?: CustomGameModeCustomUiLabel.AsObject,
    button?: CustomGameModeCustomUiButton.AsObject,
  }

  export enum UiElementCase {
    UIELEMENT_NOT_SET = 0,
    LABEL = 2,
    BUTTON = 3,
  }
}

export class UniqueAnimationType extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UniqueAnimationType.AsObject;
  static toObject(includeInstance: boolean, msg: UniqueAnimationType): UniqueAnimationType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UniqueAnimationType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UniqueAnimationType;
  static deserializeBinaryFromReader(message: UniqueAnimationType, reader: jspb.BinaryReader): UniqueAnimationType;
}

export namespace UniqueAnimationType {
  export type AsObject = {
  }

  export enum Enum {
    NONE = 0,
    SHAMMANNARRIVAL = 1,
  }
}

export class CardAbilityTarget extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardAbilityTarget.AsObject;
  static toObject(includeInstance: boolean, msg: CardAbilityTarget): CardAbilityTarget.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardAbilityTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardAbilityTarget;
  static deserializeBinaryFromReader(message: CardAbilityTarget, reader: jspb.BinaryReader): CardAbilityTarget;
}

export namespace CardAbilityTarget {
  export type AsObject = {
  }

  export enum Enum {
    NONE = 0,
    PLAYER = 1,
    PLAYER_CARD = 2,
    PLAYER_ALL_CARDS = 3,
    OPPONENT = 4,
    OPPONENT_CARD = 5,
    OPPONENT_ALL_CARDS = 6,
    ALL_CARDS = 7,
    ALL = 8,
    ITSELF = 9,
  }
}

export class OverlordAbilityTarget extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OverlordAbilityTarget.AsObject;
  static toObject(includeInstance: boolean, msg: OverlordAbilityTarget): OverlordAbilityTarget.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OverlordAbilityTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OverlordAbilityTarget;
  static deserializeBinaryFromReader(message: OverlordAbilityTarget, reader: jspb.BinaryReader): OverlordAbilityTarget;
}

export namespace OverlordAbilityTarget {
  export type AsObject = {
  }

  export enum Enum {
    NONE = 0,
    PLAYER = 1,
    PLAYER_CARD = 2,
    PLAYER_ALL_CARDS = 3,
    OPPONENT = 4,
    OPPONENT_CARD = 5,
    OPPONENT_ALL_CARDS = 6,
    ALL_CARDS = 7,
  }
}

export class GameMechanicDescriptionType extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GameMechanicDescriptionType.AsObject;
  static toObject(includeInstance: boolean, msg: GameMechanicDescriptionType): GameMechanicDescriptionType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GameMechanicDescriptionType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GameMechanicDescriptionType;
  static deserializeBinaryFromReader(message: GameMechanicDescriptionType, reader: jspb.BinaryReader): GameMechanicDescriptionType;
}

export namespace GameMechanicDescriptionType {
  export type AsObject = {
  }

  export enum Enum {
    UNDEFINED = 0,
    ATTACK = 1,
    DEATH = 2,
    DELAYED = 3,
    DESTROY = 4,
    DEVOUR = 5,
    DISTRACT = 6,
    END = 7,
    ENTRY = 8,
    FERAL = 9,
    FLASH = 10,
    FREEZE = 11,
    GUARD = 12,
    HEAVY = 13,
    OVERFLOW = 14,
    RAGE = 15,
    REANIMATE = 16,
    SHATTER = 17,
    SWING = 18,
    TURN = 19,
    GOT_DAMAGE = 20,
    AT_DEFENSE = 21,
    IN_HAND = 22,
    KILL_UNIT = 23,
    PERMANENT = 24,
  }
}

export class AttackRestriction extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AttackRestriction.AsObject;
  static toObject(includeInstance: boolean, msg: AttackRestriction): AttackRestriction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AttackRestriction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AttackRestriction;
  static deserializeBinaryFromReader(message: AttackRestriction, reader: jspb.BinaryReader): AttackRestriction;
}

export namespace AttackRestriction {
  export type AsObject = {
  }

  export enum Enum {
    ANY = 0,
    ONLY_DIFFERENT = 1,
  }
}

export class CardAbilityBuffType extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardAbilityBuffType.AsObject;
  static toObject(includeInstance: boolean, msg: CardAbilityBuffType): CardAbilityBuffType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardAbilityBuffType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardAbilityBuffType;
  static deserializeBinaryFromReader(message: CardAbilityBuffType, reader: jspb.BinaryReader): CardAbilityBuffType;
}

export namespace CardAbilityBuffType {
  export type AsObject = {
  }

  export enum Enum {
    NONE = 0,
    GUARD = 1,
    DEFENCE = 2,
    HEAVY = 3,
    WEAPON = 4,
    RUSH = 5,
    ATTACK = 6,
    FREEZE = 7,
    DAMAGE = 8,
    HEAL_ALLY = 9,
    DESTROY = 10,
    REANIMATE = 11,
  }
}

export class CardAbilityActivityType extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardAbilityActivityType.AsObject;
  static toObject(includeInstance: boolean, msg: CardAbilityActivityType): CardAbilityActivityType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardAbilityActivityType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardAbilityActivityType;
  static deserializeBinaryFromReader(message: CardAbilityActivityType, reader: jspb.BinaryReader): CardAbilityActivityType;
}

export namespace CardAbilityActivityType {
  export type AsObject = {
  }

  export enum Enum {
    UNDEFINED = 0,
    PASSIVE = 1,
    ACTIVE = 2,
  }
}

export class CardAbilityTrigger extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardAbilityTrigger.AsObject;
  static toObject(includeInstance: boolean, msg: CardAbilityTrigger): CardAbilityTrigger.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardAbilityTrigger, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardAbilityTrigger;
  static deserializeBinaryFromReader(message: CardAbilityTrigger, reader: jspb.BinaryReader): CardAbilityTrigger;
}

export namespace CardAbilityTrigger {
  export type AsObject = {
  }

  export enum Enum {
    UNDEFINED = 0,
    TURN = 1,
    ENTRY = 2,
    END = 3,
    ATTACK = 4,
    DEATH = 5,
    PERMANENT = 6,
    GOT_DAMAGE = 7,
    AT_DEFENCE = 8,
    IN_HAND = 9,
    KILL_UNIT = 10,
  }
}

export class CardAbilityEffect extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardAbilityEffect.AsObject;
  static toObject(includeInstance: boolean, msg: CardAbilityEffect): CardAbilityEffect.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardAbilityEffect, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardAbilityEffect;
  static deserializeBinaryFromReader(message: CardAbilityEffect, reader: jspb.BinaryReader): CardAbilityEffect;
}

export namespace CardAbilityEffect {
  export type AsObject = {
  }

  export enum Enum {
    NONE = 0,
    MASSIVE_WATER_WAVE = 1,
    MASSIVE_FIRE = 2,
    MASSIVE_LIGHTNING = 3,
    MASSIVE_TOXIC_ALL = 4,
    TARGET_ROCK = 5,
    TARGET_FIRE = 6,
    TARGET_LIFE = 7,
    TARGET_TOXIC = 8,
    TARGET_WATER = 9,
    TARGET_ADJUSTMENTS_BOMB = 10,
    STUN_FREEZES = 11,
    STUN_OR_DAMAGE_FREEZES = 12,
    TARGET_ADJUSTMENTS_AIR = 13,
    HEAL_DIRECTLY = 14,
    HEAL = 15,
  }
}

export class CardAbilityType extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardAbilityType.AsObject;
  static toObject(includeInstance: boolean, msg: CardAbilityType): CardAbilityType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardAbilityType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardAbilityType;
  static deserializeBinaryFromReader(message: CardAbilityType, reader: jspb.BinaryReader): CardAbilityType;
}

export namespace CardAbilityType {
  export type AsObject = {
  }

  export enum Enum {
    UNDEFINED = 0,
    HEAL = 1,
    MODIFICATOR_STATS = 2,
    CHANGE_STAT = 3,
    STUN = 4,
    STUN_OR_DAMAGE_ADJUSTMENTS = 5,
    SPURT = 6,
    ADD_GOO_VIAL = 7,
    ADD_GOO_CARRIER = 8,
    DOT = 9,
    SUMMON = 10,
    SPELL_ATTACK = 11,
    MASSIVE_DAMAGE = 12,
    DAMAGE_TARGET_ADJUSTMENTS = 13,
    DAMAGE_TARGET = 14,
    CARD_RETURN = 15,
    WEAPON = 16,
    CHANGE_STAT_OF_CREATURES_BY_TYPE = 17,
    ATTACK_NUMBER_OF_TIMES_PER_TURN = 18,
    DRAW_CARD = 19,
    DEVOUR_ZOMBIES_AND_COMBINE_STATS = 20,
    DESTROY_UNIT_BY_TYPE = 21,
    LOWER_COST_OF_CARD_IN_HAND = 22,
    OVERFLOW_GOO = 23,
    LOSE_GOO = 24,
    DISABLE_NEXT_TURN_GOO = 25,
    RAGE = 26,
    FREEZE_UNITS = 27,
    TAKE_DAMAGE_RANDOM_ENEMY = 28,
    TAKE_CONTROL_ENEMY_UNIT = 29,
    GUARD = 30,
    DESTROY_FROZEN_UNIT = 31,
    USE_ALL_GOO_TO_INCREASE_STATS = 32,
    FIRST_UNIT_IN_PLAY = 33,
    ALLY_UNITS_OF_TYPE_IN_PLAY_GET_STATS = 34,
    DAMAGE_ENEMY_UNITS_AND_FREEZE_THEM = 35,
    RETURN_UNITS_ON_BOARD_TO_OWNERS_DECKS = 36,
    TAKE_UNIT_TYPE_TO_ADJACENT_ALLY_UNITS = 37,
    ENEMY_THAT_ATTACKS_BECOME_FROZEN = 38,
    TAKE_UNIT_TYPE_TO_ALLY_UNIT = 39,
    REVIVE_DIED_UNITS_OF_TYPE_FROM_MATCH = 40,
    CHANGE_STAT_UNTILL_END_OF_TURN = 41,
    ATTACK_OVERLORD = 42,
    ADJACENT_UNITS_GET_HEAVY = 43,
    FREEZE_NUMBER_OF_RANDOM_ALLY = 44,
    ADD_CARD_BY_NAME_TO_HAND = 45,
    DEAL_DAMAGE_TO_THIS_AND_ADJACENT_UNITS = 46,
    SWING = 47,
    TAKE_DEFENSE_IF_OVERLORD_HAS_LESS_DEFENSE_THAN = 48,
    GAIN_NUMBER_OF_LIFE_FOR_EACH_DAMAGE_THIS_DEALS = 49,
    ADDITIONAL_DAMAGE_TO_HEAVY_IN_ATTACK = 50,
    UNIT_WEAPON = 51,
    TAKE_DAMAGE_AT_END_OF_TURN_TO_THIS = 52,
    DELAYED_LOSE_HEAVY_GAIN_ATTACK = 53,
    DELAYED_GAIN_ATTACK = 54,
    REANIMATE_UNIT = 55,
    PRIORITY_ATTACK = 56,
    DESTROY_TARGET_UNIT_AFTER_ATTACK = 57,
    COSTS_LESS_IF_CARD_TYPE_IN_HAND = 58,
    RETURN_UNITS_ON_BOARD_TO_OWNERS_HANDS = 59,
    REPLACE_UNITS_WITH_TYPE_ON_STRONGER_ONES = 60,
    RESTORE_DEF_RANDOMLY_SPLIT = 61,
    ADJACENT_UNITS_GET_GUARD = 62,
    SUMMON_UNIT_FROM_HAND = 63,
    DAMAGE_AND_DISTRACT_TARGET = 64,
    DRAW_CARD_IF_DAMAGED_ZOMBIE_IN_PLAY = 65,
    TAKE_STAT_IF_OVERLORD_HAS_LESS_DEFENSE_THAN = 66,
    DAMAGE_OVERLORD_ON_COUNT_ITEMS_PLAYED = 67,
    SHUFFLE_THIS_CARD_TO_DECK = 68,
    TAKE_DEFENSE_TO_OVERLORD_WITH_DEFENSE = 69,
    PUT_RANDOM_UNIT_FROM_DECK_ON_BOARD = 70,
    DISTRACT = 71,
    DAMAGE_TARGET_FREEZE_IT_IF_SURVIVES = 72,
    DESTROY_UNIT_BY_COST = 73,
    DAMAGE_ENEMY_OR_RESTORE_DEFENSE_ALLY = 74,
    TAKE_SWING_TO_UNITS = 75,
    DELAYED_PLACE_COPIES_IN_PLAY_DESTROY_UNIT = 76,
    ADJACENT_UNITS_GET_STAT = 77,
    EXTRA_GOO_IF_UNIT_IN_PLAY = 78,
    DESTROY_UNITS = 79,
    DEAL_DAMAGE_TO_UNIT_AND_SWING = 80,
    SET_ATTACK_AVAILABILITY = 81,
    CHOOSABLE_ABILITIES = 82,
    COSTS_LESS_IF_TYPE_CARD_IN_PLAY = 83,
  }
}

export class CardAbilitySubTrigger extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardAbilitySubTrigger.AsObject;
  static toObject(includeInstance: boolean, msg: CardAbilitySubTrigger): CardAbilitySubTrigger.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardAbilitySubTrigger, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardAbilitySubTrigger;
  static deserializeBinaryFromReader(message: CardAbilitySubTrigger, reader: jspb.BinaryReader): CardAbilitySubTrigger;
}

export namespace CardAbilitySubTrigger {
  export type AsObject = {
  }

  export enum Enum {
    NONE = 0,
    ONLYTHISUNITINPLAY = 1,
    ALLOTHERALLYUNITSINPLAY = 2,
    ALLALLYUNITSINPLAY = 3,
    RANDOMUNIT = 4,
    ALLENEMYUNITSINPLAY = 5,
    ALLALLYUNITSBYFACTIONINPLAY = 6,
    FOREACHFACTIONOFUNITINHAND = 7,
    IFHASUNITSWITHFACTIONINPLAY = 8,
    ALLYUNITSBYFACTIONTHATCOST = 9,
    YOUROVERLORD = 10,
  }
}

export class CardKind extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardKind.AsObject;
  static toObject(includeInstance: boolean, msg: CardKind): CardKind.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardKind, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardKind;
  static deserializeBinaryFromReader(message: CardKind, reader: jspb.BinaryReader): CardKind;
}

export namespace CardKind {
  export type AsObject = {
  }

  export enum Enum {
    UNDEFINED = 0,
    CREATURE = 1,
    SPELL = 2,
  }
}

export class AffectObjectType extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AffectObjectType.AsObject;
  static toObject(includeInstance: boolean, msg: AffectObjectType): AffectObjectType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AffectObjectType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AffectObjectType;
  static deserializeBinaryFromReader(message: AffectObjectType, reader: jspb.BinaryReader): AffectObjectType;
}

export namespace AffectObjectType {
  export type AsObject = {
  }

  export enum Enum {
    NONE = 0,
    PLAYER = 1,
    CHARACTER = 2,
    CARD = 3,
  }
}

export class CreatureRank extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreatureRank.AsObject;
  static toObject(includeInstance: boolean, msg: CreatureRank): CreatureRank.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreatureRank, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreatureRank;
  static deserializeBinaryFromReader(message: CreatureRank, reader: jspb.BinaryReader): CreatureRank;
}

export namespace CreatureRank {
  export type AsObject = {
  }

  export enum Enum {
    UNDEFINED = 0,
    MINION = 1,
    OFFICER = 2,
    COMMANDER = 3,
    GENERAL = 4,
  }
}

export class CreatureType extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreatureType.AsObject;
  static toObject(includeInstance: boolean, msg: CreatureType): CreatureType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreatureType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreatureType;
  static deserializeBinaryFromReader(message: CreatureType, reader: jspb.BinaryReader): CreatureType;
}

export namespace CreatureType {
  export type AsObject = {
  }

  export enum Enum {
    NONE = 0,
    WALKER = 1,
    FERAL = 2,
    HEAVY = 3,
  }
}

export class CardSetType extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardSetType.AsObject;
  static toObject(includeInstance: boolean, msg: CardSetType): CardSetType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardSetType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardSetType;
  static deserializeBinaryFromReader(message: CardSetType, reader: jspb.BinaryReader): CardSetType;
}

export namespace CardSetType {
  export type AsObject = {
  }

  export enum Enum {
    NONE = 0,
    FIRE = 1,
    WATER = 2,
    EARTH = 3,
    AIR = 4,
    LIFE = 5,
    TOXIC = 6,
    ITEM = 7,
    OTHERS = 8,
  }
}

export class GameState extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getIsended(): boolean;
  setIsended(value: boolean): void;

  getCurrentplayerindex(): number;
  setCurrentplayerindex(value: number): void;

  clearPlayerstatesList(): void;
  getPlayerstatesList(): Array<PlayerState>;
  setPlayerstatesList(value: Array<PlayerState>): void;
  addPlayerstates(value?: PlayerState, index?: number): PlayerState;

  getCurrentactionindex(): number;
  setCurrentactionindex(value: number): void;

  clearPlayeractionsList(): void;
  getPlayeractionsList(): Array<PlayerAction>;
  setPlayeractionsList(value: Array<PlayerAction>): void;
  addPlayeractions(value?: PlayerAction, index?: number): PlayerAction;

  getRandomseed(): number;
  setRandomseed(value: number): void;

  getWinner(): string;
  setWinner(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getCreatedat(): number;
  setCreatedat(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GameState.AsObject;
  static toObject(includeInstance: boolean, msg: GameState): GameState.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GameState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GameState;
  static deserializeBinaryFromReader(message: GameState, reader: jspb.BinaryReader): GameState;
}

export namespace GameState {
  export type AsObject = {
    id: number,
    isended: boolean,
    currentplayerindex: number,
    playerstatesList: Array<PlayerState.AsObject>,
    currentactionindex: number,
    playeractionsList: Array<PlayerAction.AsObject>,
    randomseed: number,
    winner: string,
    version: string,
    createdat: number,
  }
}

export class CardChoosableAbility extends jspb.Message {
  getDescription(): string;
  setDescription(value: string): void;

  hasAbilityData(): boolean;
  clearAbilityData(): void;
  getAbilityData(): CardAbility | undefined;
  setAbilityData(value?: CardAbility): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardChoosableAbility.AsObject;
  static toObject(includeInstance: boolean, msg: CardChoosableAbility): CardChoosableAbility.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardChoosableAbility, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardChoosableAbility;
  static deserializeBinaryFromReader(message: CardChoosableAbility, reader: jspb.BinaryReader): CardChoosableAbility;
}

export namespace CardChoosableAbility {
  export type AsObject = {
    description: string,
    abilityData?: CardAbility.AsObject,
  }
}

export class CardAbility extends jspb.Message {
  getType(): CardAbilityType.Enum;
  setType(value: CardAbilityType.Enum): void;

  getActivitytype(): CardAbilityActivityType.Enum;
  setActivitytype(value: CardAbilityActivityType.Enum): void;

  getTrigger(): CardAbilityTrigger.Enum;
  setTrigger(value: CardAbilityTrigger.Enum): void;

  clearTargettypesList(): void;
  getTargettypesList(): Array<CardAbilityTarget.Enum>;
  setTargettypesList(value: Array<CardAbilityTarget.Enum>): void;
  addTargettypes(value: CardAbilityTarget.Enum, index?: number): CardAbilityTarget.Enum;

  getStat(): StatType.Enum;
  setStat(value: StatType.Enum): void;

  getSet(): CardSetType.Enum;
  setSet(value: CardSetType.Enum): void;

  getEffect(): CardAbilityEffect.Enum;
  setEffect(value: CardAbilityEffect.Enum): void;

  getAttackrestriction(): AttackRestriction.Enum;
  setAttackrestriction(value: AttackRestriction.Enum): void;

  getTargetcardtype(): CreatureType.Enum;
  setTargetcardtype(value: CreatureType.Enum): void;

  getTargetunitspecialstatus(): UnitSpecialStatus.Enum;
  setTargetunitspecialstatus(value: UnitSpecialStatus.Enum): void;

  getTargetunittype(): CreatureType.Enum;
  setTargetunittype(value: CreatureType.Enum): void;

  getValue(): number;
  setValue(value: number): void;

  getAttack(): number;
  setAttack(value: number): void;

  getDefense(): number;
  setDefense(value: number): void;

  getName(): string;
  setName(value: string): void;

  getTurns(): number;
  setTurns(value: number): void;

  getCount(): number;
  setCount(value: number): void;

  getDelay(): number;
  setDelay(value: number): void;

  clearVisualeffectstoplayList(): void;
  getVisualeffectstoplayList(): Array<CardAbility.VisualEffectInfo>;
  setVisualeffectstoplayList(value: Array<CardAbility.VisualEffectInfo>): void;
  addVisualeffectstoplay(value?: CardAbility.VisualEffectInfo, index?: number): CardAbility.VisualEffectInfo;

  getGamemechanicdescriptiontype(): GameMechanicDescriptionType.Enum;
  setGamemechanicdescriptiontype(value: GameMechanicDescriptionType.Enum): void;

  getTargetSet(): CardSetType.Enum;
  setTargetSet(value: CardSetType.Enum): void;

  getSubTrigger(): CardAbilitySubTrigger.Enum;
  setSubTrigger(value: CardAbilitySubTrigger.Enum): void;

  clearChoosableAbilitiesList(): void;
  getChoosableAbilitiesList(): Array<CardChoosableAbility>;
  setChoosableAbilitiesList(value: Array<CardChoosableAbility>): void;
  addChoosableAbilities(value?: CardChoosableAbility, index?: number): CardChoosableAbility;

  getDefense2(): number;
  setDefense2(value: number): void;

  getCost(): number;
  setCost(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardAbility.AsObject;
  static toObject(includeInstance: boolean, msg: CardAbility): CardAbility.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardAbility, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardAbility;
  static deserializeBinaryFromReader(message: CardAbility, reader: jspb.BinaryReader): CardAbility;
}

export namespace CardAbility {
  export type AsObject = {
    type: CardAbilityType.Enum,
    activitytype: CardAbilityActivityType.Enum,
    trigger: CardAbilityTrigger.Enum,
    targettypesList: Array<CardAbilityTarget.Enum>,
    stat: StatType.Enum,
    set: CardSetType.Enum,
    effect: CardAbilityEffect.Enum,
    attackrestriction: AttackRestriction.Enum,
    targetcardtype: CreatureType.Enum,
    targetunitspecialstatus: UnitSpecialStatus.Enum,
    targetunittype: CreatureType.Enum,
    value: number,
    attack: number,
    defense: number,
    name: string,
    turns: number,
    count: number,
    delay: number,
    visualeffectstoplayList: Array<CardAbility.VisualEffectInfo.AsObject>,
    gamemechanicdescriptiontype: GameMechanicDescriptionType.Enum,
    targetSet: CardSetType.Enum,
    subTrigger: CardAbilitySubTrigger.Enum,
    choosableAbilitiesList: Array<CardChoosableAbility.AsObject>,
    defense2: number,
    cost: number,
  }

  export class VisualEffectInfo extends jspb.Message {
    getType(): CardAbility.VisualEffectInfo.VisualEffectType;
    setType(value: CardAbility.VisualEffectInfo.VisualEffectType): void;

    getPath(): string;
    setPath(value: string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): VisualEffectInfo.AsObject;
    static toObject(includeInstance: boolean, msg: VisualEffectInfo): VisualEffectInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: VisualEffectInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): VisualEffectInfo;
    static deserializeBinaryFromReader(message: VisualEffectInfo, reader: jspb.BinaryReader): VisualEffectInfo;
  }

  export namespace VisualEffectInfo {
    export type AsObject = {
      type: CardAbility.VisualEffectInfo.VisualEffectType,
      path: string,
    }

    export enum VisualEffectType {
      UNDEFINED = 0,
      IMPACT = 1,
      MOVING = 2,
    }
  }
}

export class CardInstance extends jspb.Message {
  hasPrototype(): boolean;
  clearPrototype(): void;
  getPrototype(): Card | undefined;
  setPrototype(value?: Card): void;

  getInstanceid(): number;
  setInstanceid(value: number): void;

  hasInstance(): boolean;
  clearInstance(): void;
  getInstance(): Card | undefined;
  setInstance(value?: Card): void;

  getOwner(): string;
  setOwner(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardInstance.AsObject;
  static toObject(includeInstance: boolean, msg: CardInstance): CardInstance.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardInstance, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardInstance;
  static deserializeBinaryFromReader(message: CardInstance, reader: jspb.BinaryReader): CardInstance;
}

export namespace CardInstance {
  export type AsObject = {
    prototype?: Card.AsObject,
    instanceid: number,
    instance?: Card.AsObject,
    owner: string,
  }
}

export class DataIdOwner extends jspb.Message {
  getDataid(): number;
  setDataid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DataIdOwner.AsObject;
  static toObject(includeInstance: boolean, msg: DataIdOwner): DataIdOwner.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DataIdOwner, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DataIdOwner;
  static deserializeBinaryFromReader(message: DataIdOwner, reader: jspb.BinaryReader): DataIdOwner;
}

export namespace DataIdOwner {
  export type AsObject = {
    dataid: number,
  }
}

export class CardDeck extends jspb.Message {
  clearCardsList(): void;
  getCardsList(): Array<Card>;
  setCardsList(value: Array<Card>): void;
  addCards(value?: Card, index?: number): Card;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardDeck.AsObject;
  static toObject(includeInstance: boolean, msg: CardDeck): CardDeck.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardDeck, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardDeck;
  static deserializeBinaryFromReader(message: CardDeck, reader: jspb.BinaryReader): CardDeck;
}

export namespace CardDeck {
  export type AsObject = {
    cardsList: Array<Card.AsObject>,
  }
}

export class InstanceIdOwner extends jspb.Message {
  getInstanceid(): number;
  setInstanceid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InstanceIdOwner.AsObject;
  static toObject(includeInstance: boolean, msg: InstanceIdOwner): InstanceIdOwner.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InstanceIdOwner, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InstanceIdOwner;
  static deserializeBinaryFromReader(message: InstanceIdOwner, reader: jspb.BinaryReader): InstanceIdOwner;
}

export namespace InstanceIdOwner {
  export type AsObject = {
    instanceid: number,
  }
}

export class OverlordInstance extends jspb.Message {
  getInstanceid(): number;
  setInstanceid(value: number): void;

  hasPrototype(): boolean;
  clearPrototype(): void;
  getPrototype(): OverlordPrototype | undefined;
  setPrototype(value?: OverlordPrototype): void;

  hasFirstskill(): boolean;
  clearFirstskill(): void;
  getFirstskill(): OverlordSkillInstance | undefined;
  setFirstskill(value?: OverlordSkillInstance): void;

  hasSecondskill(): boolean;
  clearSecondskill(): void;
  getSecondskill(): OverlordSkillInstance | undefined;
  setSecondskill(value?: OverlordSkillInstance): void;

  getDefense(): number;
  setDefense(value: number): void;

  getGoo(): number;
  setGoo(value: number): void;

  getMaxgoo(): number;
  setMaxgoo(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OverlordInstance.AsObject;
  static toObject(includeInstance: boolean, msg: OverlordInstance): OverlordInstance.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OverlordInstance, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OverlordInstance;
  static deserializeBinaryFromReader(message: OverlordInstance, reader: jspb.BinaryReader): OverlordInstance;
}

export namespace OverlordInstance {
  export type AsObject = {
    instanceid: number,
    prototype?: OverlordPrototype.AsObject,
    firstskill?: OverlordSkillInstance.AsObject,
    secondskill?: OverlordSkillInstance.AsObject,
    defense: number,
    goo: number,
    maxgoo: number,
  }
}

export class OverlordPrototype extends jspb.Message {
  getHeroid(): number;
  setHeroid(value: number): void;

  getIcon(): string;
  setIcon(value: string): void;

  getName(): string;
  setName(value: string): void;

  getShortdescription(): string;
  setShortdescription(value: string): void;

  getLongdescription(): string;
  setLongdescription(value: string): void;

  getExperience(): number;
  setExperience(value: number): void;

  getLevel(): number;
  setLevel(value: number): void;

  getElement(): CardSetType.Enum;
  setElement(value: CardSetType.Enum): void;

  clearSkillsList(): void;
  getSkillsList(): Array<OverlordSkillPrototype>;
  setSkillsList(value: Array<OverlordSkillPrototype>): void;
  addSkills(value?: OverlordSkillPrototype, index?: number): OverlordSkillPrototype;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OverlordPrototype.AsObject;
  static toObject(includeInstance: boolean, msg: OverlordPrototype): OverlordPrototype.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OverlordPrototype, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OverlordPrototype;
  static deserializeBinaryFromReader(message: OverlordPrototype, reader: jspb.BinaryReader): OverlordPrototype;
}

export namespace OverlordPrototype {
  export type AsObject = {
    heroid: number,
    icon: string,
    name: string,
    shortdescription: string,
    longdescription: string,
    experience: number,
    level: number,
    element: CardSetType.Enum,
    skillsList: Array<OverlordSkillPrototype.AsObject>,
  }
}

export class OverlordSkillInstance extends jspb.Message {
  hasPrototype(): boolean;
  clearPrototype(): void;
  getPrototype(): OverlordSkillPrototype | undefined;
  setPrototype(value?: OverlordSkillPrototype): void;

  getCooldown(): number;
  setCooldown(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OverlordSkillInstance.AsObject;
  static toObject(includeInstance: boolean, msg: OverlordSkillInstance): OverlordSkillInstance.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OverlordSkillInstance, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OverlordSkillInstance;
  static deserializeBinaryFromReader(message: OverlordSkillInstance, reader: jspb.BinaryReader): OverlordSkillInstance;
}

export namespace OverlordSkillInstance {
  export type AsObject = {
    prototype?: OverlordSkillPrototype.AsObject,
    cooldown: number,
  }
}

export class OverlordSkillPrototype extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): void;

  getSkill(): string;
  setSkill(value: string): void;

  getIconpath(): string;
  setIconpath(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getCooldown(): number;
  setCooldown(value: number): void;

  getInitialcooldown(): number;
  setInitialcooldown(value: number): void;

  getParameter(): number;
  setParameter(value: number): void;

  getAttack(): number;
  setAttack(value: number): void;

  getOverlordskillkind(): OverlordSkillKind.Enum;
  setOverlordskillkind(value: OverlordSkillKind.Enum): void;

  clearSkilltargettypesList(): void;
  getSkilltargettypesList(): Array<OverlordAbilityTarget.Enum>;
  setSkilltargettypesList(value: Array<OverlordAbilityTarget.Enum>): void;
  addSkilltargettypes(value: OverlordAbilityTarget.Enum, index?: number): OverlordAbilityTarget.Enum;

  clearElementtargettypesList(): void;
  getElementtargettypesList(): Array<CardSetType.Enum>;
  setElementtargettypesList(value: Array<CardSetType.Enum>): void;
  addElementtargettypes(value: CardSetType.Enum, index?: number): CardSetType.Enum;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OverlordSkillPrototype.AsObject;
  static toObject(includeInstance: boolean, msg: OverlordSkillPrototype): OverlordSkillPrototype.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OverlordSkillPrototype, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OverlordSkillPrototype;
  static deserializeBinaryFromReader(message: OverlordSkillPrototype, reader: jspb.BinaryReader): OverlordSkillPrototype;
}

export namespace OverlordSkillPrototype {
  export type AsObject = {
    title: string,
    skill: string,
    iconpath: string,
    description: string,
    cooldown: number,
    initialcooldown: number,
    parameter: number,
    attack: number,
    overlordskillkind: OverlordSkillKind.Enum,
    skilltargettypesList: Array<OverlordAbilityTarget.Enum>,
    elementtargettypesList: Array<CardSetType.Enum>,
  }
}

export class PlayerActionLeaveMatch extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerActionLeaveMatch.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerActionLeaveMatch): PlayerActionLeaveMatch.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerActionLeaveMatch, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerActionLeaveMatch;
  static deserializeBinaryFromReader(message: PlayerActionLeaveMatch, reader: jspb.BinaryReader): PlayerActionLeaveMatch;
}

export namespace PlayerActionLeaveMatch {
  export type AsObject = {
  }
}

export class PlayerActionCardPlay extends jspb.Message {
  hasCard(): boolean;
  clearCard(): void;
  getCard(): CardInstance | undefined;
  setCard(value?: CardInstance): void;

  getPosition(): number;
  setPosition(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerActionCardPlay.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerActionCardPlay): PlayerActionCardPlay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerActionCardPlay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerActionCardPlay;
  static deserializeBinaryFromReader(message: PlayerActionCardPlay, reader: jspb.BinaryReader): PlayerActionCardPlay;
}

export namespace PlayerActionCardPlay {
  export type AsObject = {
    card?: CardInstance.AsObject,
    position: number,
  }
}

export class PlayerActionRankBuff extends jspb.Message {
  hasCard(): boolean;
  clearCard(): void;
  getCard(): CardInstance | undefined;
  setCard(value?: CardInstance): void;

  clearTargetsList(): void;
  getTargetsList(): Array<Unit>;
  setTargetsList(value: Array<Unit>): void;
  addTargets(value?: Unit, index?: number): Unit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerActionRankBuff.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerActionRankBuff): PlayerActionRankBuff.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerActionRankBuff, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerActionRankBuff;
  static deserializeBinaryFromReader(message: PlayerActionRankBuff, reader: jspb.BinaryReader): PlayerActionRankBuff;
}

export namespace PlayerActionRankBuff {
  export type AsObject = {
    card?: CardInstance.AsObject,
    targetsList: Array<Unit.AsObject>,
  }
}

export class PlayerActionCardAttack extends jspb.Message {
  hasAttacker(): boolean;
  clearAttacker(): void;
  getAttacker(): CardInstance | undefined;
  setAttacker(value?: CardInstance): void;

  getAffectobjecttype(): AffectObjectType.Enum;
  setAffectobjecttype(value: AffectObjectType.Enum): void;

  hasTarget(): boolean;
  clearTarget(): void;
  getTarget(): Unit | undefined;
  setTarget(value?: Unit): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerActionCardAttack.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerActionCardAttack): PlayerActionCardAttack.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerActionCardAttack, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerActionCardAttack;
  static deserializeBinaryFromReader(message: PlayerActionCardAttack, reader: jspb.BinaryReader): PlayerActionCardAttack;
}

export namespace PlayerActionCardAttack {
  export type AsObject = {
    attacker?: CardInstance.AsObject,
    affectobjecttype: AffectObjectType.Enum,
    target?: Unit.AsObject,
  }
}

export class PlayerActionCardAbilityUsed extends jspb.Message {
  hasCard(): boolean;
  clearCard(): void;
  getCard(): CardInstance | undefined;
  setCard(value?: CardInstance): void;

  getCardkind(): CardKind.Enum;
  setCardkind(value: CardKind.Enum): void;

  clearTargetsList(): void;
  getTargetsList(): Array<Unit>;
  setTargetsList(value: Array<Unit>): void;
  addTargets(value?: Unit, index?: number): Unit;

  getAbilitytype(): string;
  setAbilitytype(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerActionCardAbilityUsed.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerActionCardAbilityUsed): PlayerActionCardAbilityUsed.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerActionCardAbilityUsed, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerActionCardAbilityUsed;
  static deserializeBinaryFromReader(message: PlayerActionCardAbilityUsed, reader: jspb.BinaryReader): PlayerActionCardAbilityUsed;
}

export namespace PlayerActionCardAbilityUsed {
  export type AsObject = {
    card?: CardInstance.AsObject,
    cardkind: CardKind.Enum,
    targetsList: Array<Unit.AsObject>,
    abilitytype: string,
  }
}

export class PlayerActionOverlordSkillUsed extends jspb.Message {
  getSkillid(): number;
  setSkillid(value: number): void;

  getAffectobjecttype(): AffectObjectType.Enum;
  setAffectobjecttype(value: AffectObjectType.Enum): void;

  hasTarget(): boolean;
  clearTarget(): void;
  getTarget(): Unit | undefined;
  setTarget(value?: Unit): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerActionOverlordSkillUsed.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerActionOverlordSkillUsed): PlayerActionOverlordSkillUsed.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerActionOverlordSkillUsed, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerActionOverlordSkillUsed;
  static deserializeBinaryFromReader(message: PlayerActionOverlordSkillUsed, reader: jspb.BinaryReader): PlayerActionOverlordSkillUsed;
}

export namespace PlayerActionOverlordSkillUsed {
  export type AsObject = {
    skillid: number,
    affectobjecttype: AffectObjectType.Enum,
    target?: Unit.AsObject,
  }
}

export class PlayerActionDrawCard extends jspb.Message {
  hasCardinstance(): boolean;
  clearCardinstance(): void;
  getCardinstance(): CardInstance | undefined;
  setCardinstance(value?: CardInstance): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerActionDrawCard.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerActionDrawCard): PlayerActionDrawCard.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerActionDrawCard, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerActionDrawCard;
  static deserializeBinaryFromReader(message: PlayerActionDrawCard, reader: jspb.BinaryReader): PlayerActionDrawCard;
}

export namespace PlayerActionDrawCard {
  export type AsObject = {
    cardinstance?: CardInstance.AsObject,
  }
}

export class PlayerActionEndTurn extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerActionEndTurn.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerActionEndTurn): PlayerActionEndTurn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerActionEndTurn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerActionEndTurn;
  static deserializeBinaryFromReader(message: PlayerActionEndTurn, reader: jspb.BinaryReader): PlayerActionEndTurn;
}

export namespace PlayerActionEndTurn {
  export type AsObject = {
  }
}

export class PlayerActionMulligan extends jspb.Message {
  clearMulliganedcardsList(): void;
  getMulliganedcardsList(): Array<CardInstance>;
  setMulliganedcardsList(value: Array<CardInstance>): void;
  addMulliganedcards(value?: CardInstance, index?: number): CardInstance;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerActionMulligan.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerActionMulligan): PlayerActionMulligan.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerActionMulligan, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerActionMulligan;
  static deserializeBinaryFromReader(message: PlayerActionMulligan, reader: jspb.BinaryReader): PlayerActionMulligan;
}

export namespace PlayerActionMulligan {
  export type AsObject = {
    mulliganedcardsList: Array<CardInstance.AsObject>,
  }
}

export class PlayerActionOutcome extends jspb.Message {
  getPlayerid(): string;
  setPlayerid(value: string): void;

  hasGamestate(): boolean;
  clearGamestate(): void;
  getGamestate(): GameState | undefined;
  setGamestate(value?: GameState): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerActionOutcome.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerActionOutcome): PlayerActionOutcome.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerActionOutcome, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerActionOutcome;
  static deserializeBinaryFromReader(message: PlayerActionOutcome, reader: jspb.BinaryReader): PlayerActionOutcome;
}

export namespace PlayerActionOutcome {
  export type AsObject = {
    playerid: string,
    gamestate?: GameState.AsObject,
  }
}

export class StartGameAction extends jspb.Message {
  clearPlayerstatesList(): void;
  getPlayerstatesList(): Array<PlayerState>;
  setPlayerstatesList(value: Array<PlayerState>): void;
  addPlayerstates(value?: PlayerState, index?: number): PlayerState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StartGameAction.AsObject;
  static toObject(includeInstance: boolean, msg: StartGameAction): StartGameAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StartGameAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StartGameAction;
  static deserializeBinaryFromReader(message: StartGameAction, reader: jspb.BinaryReader): StartGameAction;
}

export namespace StartGameAction {
  export type AsObject = {
    playerstatesList: Array<PlayerState.AsObject>,
  }
}

export class Unit extends jspb.Message {
  getInstanceid(): number;
  setInstanceid(value: number): void;

  getAffectobjecttype(): AffectObjectType.Enum;
  setAffectobjecttype(value: AffectObjectType.Enum): void;

  hasParameter(): boolean;
  clearParameter(): void;
  getParameter(): Parameter | undefined;
  setParameter(value?: Parameter): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Unit.AsObject;
  static toObject(includeInstance: boolean, msg: Unit): Unit.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Unit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Unit;
  static deserializeBinaryFromReader(message: Unit, reader: jspb.BinaryReader): Unit;
}

export namespace Unit {
  export type AsObject = {
    instanceid: number,
    affectobjecttype: AffectObjectType.Enum,
    parameter?: Parameter.AsObject,
  }
}

export class Parameter extends jspb.Message {
  getAttack(): number;
  setAttack(value: number): void;

  getDefense(): number;
  setDefense(value: number): void;

  getCardname(): string;
  setCardname(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Parameter.AsObject;
  static toObject(includeInstance: boolean, msg: Parameter): Parameter.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Parameter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Parameter;
  static deserializeBinaryFromReader(message: Parameter, reader: jspb.BinaryReader): Parameter;
}

export namespace Parameter {
  export type AsObject = {
    attack: number,
    defense: number,
    cardname: string,
  }
}

export class OverlordSkillKind extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OverlordSkillKind.AsObject;
  static toObject(includeInstance: boolean, msg: OverlordSkillKind): OverlordSkillKind.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OverlordSkillKind, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OverlordSkillKind;
  static deserializeBinaryFromReader(message: OverlordSkillKind, reader: jspb.BinaryReader): OverlordSkillKind;
}

export namespace OverlordSkillKind {
  export type AsObject = {
  }

  export enum Enum {
    NONE = 0,
    PUSH = 1,
    DRAW = 2,
    WIND_SHIELD = 3,
    LEVITATE = 4,
    RETREAT = 5,
    HARDEN = 6,
    STONE_SKIN = 7,
    FORTIFY = 8,
    PHALANX = 9,
    FORTRESS = 10,
    FIRE_BOLT = 11,
    RABIES = 12,
    FIREBALL = 13,
    MASS_RABIES = 14,
    METEOR_SHOWER = 15,
    HEALING_TOUCH = 16,
    MEND = 17,
    RESSURECT = 18,
    ENHANCE = 19,
    REANIMATE = 20,
    POISON_DART = 21,
    TOXIC_POWER = 22,
    BREAKOUT = 23,
    INFECT = 24,
    EPIDEMIC = 25,
    FREEZE = 26,
    ICE_BOLT = 27,
    ICE_WALL = 28,
    SHATTER = 29,
    BLIZZARD = 30,
  }
}

export class StatType extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StatType.AsObject;
  static toObject(includeInstance: boolean, msg: StatType): StatType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StatType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StatType;
  static deserializeBinaryFromReader(message: StatType, reader: jspb.BinaryReader): StatType;
}

export namespace StatType {
  export type AsObject = {
  }

  export enum Enum {
    UNDEFINED = 0,
    HEALTH = 1,
    DAMAGE = 2,
  }
}

export class UnitSpecialStatus extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnitSpecialStatus.AsObject;
  static toObject(includeInstance: boolean, msg: UnitSpecialStatus): UnitSpecialStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnitSpecialStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnitSpecialStatus;
  static deserializeBinaryFromReader(message: UnitSpecialStatus, reader: jspb.BinaryReader): UnitSpecialStatus;
}

export namespace UnitSpecialStatus {
  export type AsObject = {
  }

  export enum Enum {
    NONE = 0,
    FROZEN = 1,
  }
}

export class GameReplay extends jspb.Message {
  clearActionsList(): void;
  getActionsList(): Array<PlayerAction>;
  setActionsList(value: Array<PlayerAction>): void;
  addActions(value?: PlayerAction, index?: number): PlayerAction;

  clearBlocksList(): void;
  getBlocksList(): Array<HistoryData>;
  setBlocksList(value: Array<HistoryData>): void;
  addBlocks(value?: HistoryData, index?: number): HistoryData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GameReplay.AsObject;
  static toObject(includeInstance: boolean, msg: GameReplay): GameReplay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GameReplay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GameReplay;
  static deserializeBinaryFromReader(message: GameReplay, reader: jspb.BinaryReader): GameReplay;
}

export namespace GameReplay {
  export type AsObject = {
    actionsList: Array<PlayerAction.AsObject>,
    blocksList: Array<HistoryData.AsObject>,
  }
}

export class Player extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasDeck(): boolean;
  clearDeck(): void;
  getDeck(): Deck | undefined;
  setDeck(value?: Deck): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Player.AsObject;
  static toObject(includeInstance: boolean, msg: Player): Player.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Player, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Player;
  static deserializeBinaryFromReader(message: Player, reader: jspb.BinaryReader): Player;
}

export namespace Player {
  export type AsObject = {
    id: string,
    deck?: Deck.AsObject,
  }
}

export class Zone extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Zone.AsObject;
  static toObject(includeInstance: boolean, msg: Zone): Zone.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Zone, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Zone;
  static deserializeBinaryFromReader(message: Zone, reader: jspb.BinaryReader): Zone;
}

export namespace Zone {
  export type AsObject = {
  }

  export enum type {
    PLAY = 0,
    DECK = 1,
    HAND = 2,
    GRAVEYARD = 3,
    REMOVEFROMGAME = 4,
    SETASIDE = 5,
    SECRET = 6,
  }
}

export class History extends jspb.Message {
  clearListList(): void;
  getListList(): Array<HistoryData>;
  setListList(value: Array<HistoryData>): void;
  addList(value?: HistoryData, index?: number): HistoryData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): History.AsObject;
  static toObject(includeInstance: boolean, msg: History): History.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: History, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): History;
  static deserializeBinaryFromReader(message: History, reader: jspb.BinaryReader): History;
}

export namespace History {
  export type AsObject = {
    listList: Array<HistoryData.AsObject>,
  }
}

export class HistoryData extends jspb.Message {
  hasCreategame(): boolean;
  clearCreategame(): void;
  getCreategame(): HistoryCreateGame | undefined;
  setCreategame(value?: HistoryCreateGame): void;

  hasFullinstance(): boolean;
  clearFullinstance(): void;
  getFullinstance(): HistoryFullInstance | undefined;
  setFullinstance(value?: HistoryFullInstance): void;

  hasShowinstance(): boolean;
  clearShowinstance(): void;
  getShowinstance(): HistoryInstance | undefined;
  setShowinstance(value?: HistoryInstance): void;

  hasHideinstance(): boolean;
  clearHideinstance(): void;
  getHideinstance(): HistoryHide | undefined;
  setHideinstance(value?: HistoryHide): void;

  hasChangeinstance(): boolean;
  clearChangeinstance(): void;
  getChangeinstance(): HistoryInstance | undefined;
  setChangeinstance(value?: HistoryInstance): void;

  hasEndgame(): boolean;
  clearEndgame(): void;
  getEndgame(): HistoryEndGame | undefined;
  setEndgame(value?: HistoryEndGame): void;

  getDataCase(): HistoryData.DataCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HistoryData.AsObject;
  static toObject(includeInstance: boolean, msg: HistoryData): HistoryData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HistoryData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HistoryData;
  static deserializeBinaryFromReader(message: HistoryData, reader: jspb.BinaryReader): HistoryData;
}

export namespace HistoryData {
  export type AsObject = {
    creategame?: HistoryCreateGame.AsObject,
    fullinstance?: HistoryFullInstance.AsObject,
    showinstance?: HistoryInstance.AsObject,
    hideinstance?: HistoryHide.AsObject,
    changeinstance?: HistoryInstance.AsObject,
    endgame?: HistoryEndGame.AsObject,
  }

  export enum DataCase {
    DATA_NOT_SET = 0,
    CREATEGAME = 1,
    FULLINSTANCE = 2,
    SHOWINSTANCE = 3,
    HIDEINSTANCE = 4,
    CHANGEINSTANCE = 5,
    ENDGAME = 6,
  }
}

export class HistoryCreateGame extends jspb.Message {
  getGameid(): number;
  setGameid(value: number): void;

  clearPlayersList(): void;
  getPlayersList(): Array<Player>;
  setPlayersList(value: Array<Player>): void;
  addPlayers(value?: Player, index?: number): Player;

  getRandomseed(): number;
  setRandomseed(value: number): void;

  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HistoryCreateGame.AsObject;
  static toObject(includeInstance: boolean, msg: HistoryCreateGame): HistoryCreateGame.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HistoryCreateGame, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HistoryCreateGame;
  static deserializeBinaryFromReader(message: HistoryCreateGame, reader: jspb.BinaryReader): HistoryCreateGame;
}

export namespace HistoryCreateGame {
  export type AsObject = {
    gameid: number,
    playersList: Array<Player.AsObject>,
    randomseed: number,
    version: string,
  }
}

export class HistoryFullInstance extends jspb.Message {
  getInstanceid(): number;
  setInstanceid(value: number): void;

  getAttack(): number;
  setAttack(value: number): void;

  getDefense(): number;
  setDefense(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HistoryFullInstance.AsObject;
  static toObject(includeInstance: boolean, msg: HistoryFullInstance): HistoryFullInstance.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HistoryFullInstance, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HistoryFullInstance;
  static deserializeBinaryFromReader(message: HistoryFullInstance, reader: jspb.BinaryReader): HistoryFullInstance;
}

export namespace HistoryFullInstance {
  export type AsObject = {
    instanceid: number,
    attack: number,
    defense: number,
  }
}

export class HistoryInstance extends jspb.Message {
  getInstanceid(): number;
  setInstanceid(value: number): void;

  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HistoryInstance.AsObject;
  static toObject(includeInstance: boolean, msg: HistoryInstance): HistoryInstance.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HistoryInstance, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HistoryInstance;
  static deserializeBinaryFromReader(message: HistoryInstance, reader: jspb.BinaryReader): HistoryInstance;
}

export namespace HistoryInstance {
  export type AsObject = {
    instanceid: number,
    value: number,
  }

  export enum change {
    ATTACK = 0,
    DEFENSE = 1,
  }
}

export class HistoryHide extends jspb.Message {
  getInstanceid(): number;
  setInstanceid(value: number): void;

  hasZone(): boolean;
  clearZone(): void;
  getZone(): Zone | undefined;
  setZone(value?: Zone): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HistoryHide.AsObject;
  static toObject(includeInstance: boolean, msg: HistoryHide): HistoryHide.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HistoryHide, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HistoryHide;
  static deserializeBinaryFromReader(message: HistoryHide, reader: jspb.BinaryReader): HistoryHide;
}

export namespace HistoryHide {
  export type AsObject = {
    instanceid: number,
    zone?: Zone.AsObject,
  }
}

export class HistoryEndGame extends jspb.Message {
  getMatchid(): number;
  setMatchid(value: number): void;

  getUserid(): string;
  setUserid(value: string): void;

  getWinnerid(): string;
  setWinnerid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HistoryEndGame.AsObject;
  static toObject(includeInstance: boolean, msg: HistoryEndGame): HistoryEndGame.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HistoryEndGame, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HistoryEndGame;
  static deserializeBinaryFromReader(message: HistoryEndGame, reader: jspb.BinaryReader): HistoryEndGame;
}

export namespace HistoryEndGame {
  export type AsObject = {
    matchid: number,
    userid: string,
    winnerid: string,
  }
}

export enum GameModeType {
  COMMUNITY = 0,
  LOOM = 1,
}

export enum OverlordSkillSelectionType {
  PRIMARY = 0,
  SECONDARY = 1,
}

