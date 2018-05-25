import test from 'tape'
import { EvmContract } from '../evm-contract'
import { Address, LocalAddress } from '../address'
import { Client } from '../client'
import { generatePrivateKey, publicKeyFromPrivateKey } from '../crypto-utils'
import { NonceTxMiddleware, SignedTxMiddleware } from '../middleware'

/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.18;
 * contract SimpleStore {
 *  function set(uint _value) public {
 *   value = _value;
 *  }
 * function get() public constant returns (uint) {
 *   return value;
 * }
 *  uint value;
 * }
 *
 */

test('EVM Contract Calls', async t => {
  try {
    const privKey = generatePrivateKey()
    const pubKey = publicKeyFromPrivateKey(privKey)
    const client = new Client(
      'default',
      'ws://127.0.0.1:46657/websocket',
      'ws://127.0.0.1:9999/queryws'
    )
    client.txMiddleware = [new NonceTxMiddleware(pubKey, client), new SignedTxMiddleware(privKey)]

    const contractAddr = await client.getContractAddressAsync('SimpleStore')
    if (!contractAddr) {
      t.fail('Failed to resolve contract address')
      return
    }

    const callerAddr = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
    const evmContract = new EvmContract({
      contractAddr,
      callerAddr,
      client
    })

    const inputSet987Array: number[] = [
      96,
      254,
      71,
      177,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      219
    ]
    const inputGetArray: number[] = [109, 76, 230, 60]
    const numRepeats = 10
    let results: Uint8Array[] = []
    let rtv
    for (let i = 0; i < numRepeats; i++) {
      rtv = await evmContract.callAsync(inputSet987Array)
      if (rtv) {
        for (let result of results) {
          t.notDeepEqual(result, rtv, 'A different tx hash sould be returned' + ' each time')
        }
        results.push(rtv)
      } else {
        t.fail('Should return a tx hash, check loomchain is running')
      }
    }

    if (rtv) {
      let receipt = await client.getTxReceiptAsync(rtv)
      if (receipt) {
        t.deepEqual(
          receipt.getContractAddress_asU8().slice(),
          contractAddr.local.bytes,
          'Contract address should match'
        )
        t.equal(receipt.getStatus(), 1, 'Should return status 1 success')
      } else {
        t.fail('getTxReceiptAsync should return a result')
      }
    }

    const staticCallRtv = await evmContract.staticCallAsync(inputGetArray)
    if (staticCallRtv) {
      t.deepEqual(
        staticCallRtv,
        Buffer.from(inputSet987Array.slice(-32)),
        'Query result must match the value previously set'
      )
    } else {
      t.fail('staticCallAsync should return a result')
    }

    client.disconnect()
  } catch (err) {
    console.log(err)
  }
  t.end()
})
