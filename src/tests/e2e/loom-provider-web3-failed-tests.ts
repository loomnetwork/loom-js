import test from 'tape'
import BN from 'bn.js'

import { LocalAddress, CryptoUtils } from '../../index'
import { createTestClient, waitForMillisecondsAsync } from '../helpers'

import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { ecrecover, privateToPublic, fromRpcSig } from 'ethereumjs-util'
import { soliditySha3 } from '../../solidity-helpers'
import { bytesToHexAddr } from '../../crypto-utils'

// import Web3 from 'web3'
const Web3 = require('web3')

/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * contract SimpleStore {
 *   uint256 public value;
 *
 *   function set(uint256 v) public {
 *     value = v;
 *   }
 *
 *   function err() public {
 *     revert("Revert");
 *   }
 * }
 *
 */

const newContractAndClient = async () => {
  const privKey = CryptoUtils.generatePrivateKey()
  const client = createTestClient()
  const from = LocalAddress.fromPublicKey(CryptoUtils.publicKeyFromPrivateKey(privKey)).toString()
  const loomProvider = new LoomProvider(client, privKey)
  const web3 = new Web3(loomProvider)

  client.on('error', console.log)

  const contractData =
    '0x608060405234801561001057600080fd5b50610183806100206000396000f3fe608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806338df76771461005c5780633fa4f2451461007357806360fe47b11461009e575b600080fd5b34801561006857600080fd5b506100716100d9565b005b34801561007f57600080fd5b50610088610147565b6040518082815260200191505060405180910390f35b3480156100aa57600080fd5b506100d7600480360360208110156100c157600080fd5b810190808035906020019092919050505061014d565b005b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260068152602001807f526576657274000000000000000000000000000000000000000000000000000081525060200191505060405180910390fd5b60005481565b806000819055505056fea165627a7a7230582096044210a4428c0d0fbc0d047c02beceeb862f2017233c4f68ead346c47030de0029'

  const ABI = [
    {
      constant: false,
      inputs: [],
      name: 'err',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'v',
          type: 'uint256'
        }
      ],
      name: 'set',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'value',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    }
  ]

  const result = await deployContract(loomProvider, contractData)

  const contract = new web3.eth.Contract(ABI, result.contractAddress, { from })

  return { contract, client, web3, from, privKey }
}

test.only('LoomProvider + Web3 + Tx Fail', async t => {
  const { contract, client } = await newContractAndClient()

  try {
    const newValue = 10
    const txSet = await contract.methods.set(newValue).send()
    t.equal(txSet.status, '0x1', 'SimpleStore.set should return correct status')

    const txErr = await contract.methods.err().send()
    t.equal(txErr.status, '0x0', 'SimpleStore.err should return corrent status')

    await waitForMillisecondsAsync(1000)
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }
})
