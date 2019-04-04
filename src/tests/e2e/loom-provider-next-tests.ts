import test from 'tape'
import { LoomProviderNext } from '../../loom-provider-next'
import { CryptoUtils, LocalAddress, LoomProvider } from '../..'
import Web3 from 'web3'

const contractData =
  '0x608060405234801561001057600080fd5b50600a60008190555061010e806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60d9565b6040518082815260200191505060405180910390f35b806000819055506000547fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b600080549050905600a165627a7a72305820b76f6c855a1f95260fc70490b16774074225da52ea165a58e95eb7a72a59d1700029'

const ABI = [
  {
    constant: false,
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'set',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'get',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: '_value', type: 'uint256' }],
    name: 'NewValueSet',
    type: 'event'
  }
]

test('LoomProviderNext', async t => {
  const host = 'http://localhost:46658/eth'
  const privKey = CryptoUtils.generatePrivateKey()

  const loomProviderNext = new LoomProviderNext(host, privKey)
  const web3 = new Web3(loomProviderNext)
  // const web3 = new Web3(host)

  const [account] = await web3.eth.getAccounts()
  console.log('account', [account])

  const ethSendTransactionDeployResult = await loomProviderNext.send('eth_sendTransaction', [
    {
      from: account,
      data: contractData,
      gas: '0x0',
      gasPrice: '0x0',
      value: '0x0'
    }
  ])

  console.log('ethSendTransactionDeployResult', ethSendTransactionDeployResult)

  t.end()
})
