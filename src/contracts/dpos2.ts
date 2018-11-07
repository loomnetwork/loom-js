import BN from 'bn.js'
import { Client } from '../client'
import { Contract } from '../contract'
import { Address } from '../address'
import {
  // RegisterCandidateRequest,
  // VoteRequest,
  // ElectRequest,
  ListCandidateRequestV2,
  ListCandidateResponseV2,
  CandidateV2,
  ListValidatorsRequestV2,
  ListValidatorsResponseV2,
  Validator,
  // UnregisterCandidateRequest,
  // ListWitnessesRequest,
  // ListWitnessesResponse,
  // Witness
} from '../proto/dposv2_pb'

export interface ICandidate {
  address: Address
  pubKey: Uint8Array
}

export interface IValidator {
  pubKey: Uint8Array
  power: number
}

export interface IWitness {
  pubKey: Uint8Array
  voteTotal: BN
  powerTotal: BN
}

export class DPOS2 extends Contract {
  static async createAsync(client: Client, callerAddr: Address): Promise<DPOS2> {
    const contractAddr = await client.getContractAddressAsync('dposv2')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address')
    }

    return new DPOS2({ contractAddr, callerAddr, client })
  }

  constructor(params: { contractAddr: Address; callerAddr: Address; client: Client }) {
    super(params)
  }

  // registerCandidateAsync(pubKey: Uint8Array): Promise<void> {
  //   const registerCandidateReq = new RegisterCandidateRequest()
  //   registerCandidateReq.setPubKey(pubKey)
  //   return this.callAsync<void>('RegisterCandidate', registerCandidateReq)
  // }

  // unregisterCandidateAsync(): Promise<void> {
  //   const unregisterCandidateReq = new UnregisterCandidateRequest()
  //   return this.callAsync<void>('UnregisterCandidate', unregisterCandidateReq)
  // }

  // voteAsync(candidateAddress: Address, amount: number): Promise<void> {
  //   const voteReq = new VoteRequest()
  //   voteReq.setCandidateAddress(candidateAddress.MarshalPB())
  //   voteReq.setAmount(amount)
  //   return this.callAsync<void>('Vote', voteReq)
  // }

  // electAsync(): Promise<void> {
  //   const electReq = new ElectRequest()
  //   return this.callAsync<void>('Elect', electReq)
  // }

  async getCandidatesAsync(): Promise<Array<ICandidate> | null> {
    const listCandidatesReq = new ListCandidateRequestV2()
    const result = await this.staticCallAsync(
      'ListCandidates',
      listCandidatesReq,
      new ListCandidateResponseV2()
    )

    return result.getCandidatesList().map((canditate: CandidateV2) => {
      return {
        address: Address.UmarshalPB(canditate.getAddress()!),
        pubKey: canditate.getPubKey_asU8()!
      }
    }) as Array<ICandidate>
  }

  async getValidatorsAsync(): Promise<Array<IValidator> | null> {
    const listValidatorReq = new ListValidatorsRequestV2()
    const result = await this.staticCallAsync(
      'ListValidators',
      listValidatorReq,
      new ListValidatorsResponseV2()
    )

    return result.getValidatorsList().map((validator: Validator) => {
      return {
        pubKey: validator.getPubKey_asU8()!,
        power: validator.getPower()
      }
    }) as Array<IValidator>
  }

  // async getWitnessesAsync(): Promise<Array<IWitness> | null> {
  //   const listWitnessesReq = new ListWitnessesRequest()
  //   const result = await this.staticCallAsync(
  //     'ListWitnesses',
  //     listWitnessesReq,
  //     new ListWitnessesResponse()
  //   )

  //   return result.getWitnessesList().map((witness: Witness) => {
  //     return {
  //       pubKey: witness.getPubKey_asU8()!,
  //       voteTotal: new BN(witness.getPowerTotal()),
  //       powerTotal: new BN(witness.getPowerTotal())
  //     }
  //   }) as Array<IWitness>
  // }
}
