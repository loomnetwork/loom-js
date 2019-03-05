import BN from 'bn.js'
import { Client } from '../client'
import { Contract } from '../contract'
import { Address } from '../address'
import {
  RegisterCandidateRequest,
  VoteRequest,
  ElectRequest,
  ListCandidateRequest,
  ListCandidateResponse,
  Candidate,
  UnregisterCandidateRequest,
  ListWitnessesRequest,
  ListWitnessesResponse,
  Witness
} from '../proto/dpos_pb'

export interface ICandidate {
  address: Address
  pubKey: Uint8Array
}

export interface IWitness {
  pubKey: Uint8Array
  voteTotal: BN
  powerTotal: BN
}

export class DPOS extends Contract {
  static async createAsync(client: Client, callerAddr: Address): Promise<DPOS> {
    const contractAddr = await client.getContractAddressAsync('dpos')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address')
    }

    return new DPOS({ contractAddr, callerAddr, client })
  }

  constructor(params: { contractAddr: Address; callerAddr: Address; client: Client }) {
    super(params)
  }

  registerCandidateAsync(pubKey: Uint8Array): Promise<void> {
    const registerCandidateReq = new RegisterCandidateRequest()
    registerCandidateReq.setPubKey(pubKey)
    return this.callAsync<void>('RegisterCandidate', registerCandidateReq)
  }

  unregisterCandidateAsync(): Promise<void> {
    const unregisterCandidateReq = new UnregisterCandidateRequest()
    return this.callAsync<void>('UnregisterCandidate', unregisterCandidateReq)
  }

  voteAsync(candidateAddress: Address, amount: number): Promise<void> {
    const voteReq = new VoteRequest()
    voteReq.setCandidateAddress(candidateAddress.MarshalPB())
    voteReq.setAmount(amount)
    return this.callAsync<void>('Vote', voteReq)
  }

  electAsync(): Promise<void> {
    const electReq = new ElectRequest()
    return this.callAsync<void>('Elect', electReq)
  }

  async getCandidatesAsync(): Promise<Array<ICandidate> | null> {
    const listCandidatesReq = new ListCandidateRequest()
    const result = await this.staticCallAsync(
      'ListCandidates',
      listCandidatesReq,
      new ListCandidateResponse()
    )

    return result.getCandidatesList().map((canditate: Candidate) => {
      return {
        address: Address.UnmarshalPB(canditate.getAddress()!),
        pubKey: canditate.getPubKey_asU8()!
      }
    }) as Array<ICandidate>
  }

  async getWitnessesAsync(): Promise<Array<IWitness> | null> {
    const listWitnessesReq = new ListWitnessesRequest()
    const result = await this.staticCallAsync(
      'ListWitnesses',
      listWitnessesReq,
      new ListWitnessesResponse()
    )

    return result.getWitnessesList().map((witness: Witness) => {
      return {
        pubKey: witness.getPubKey_asU8()!,
        voteTotal: new BN(witness.getPowerTotal()),
        powerTotal: new BN(witness.getPowerTotal())
      }
    }) as Array<IWitness>
  }
}
