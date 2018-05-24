import test from 'tape'
import { EvmTxReceipt } from '../proto/loom_pb'
import { EvmContract } from '../evm-contract'
import { Address, LocalAddress } from '../address'
import { Client } from '../client'
import { generatePrivateKey, publicKeyFromPrivateKey, bufferToProtobufBytes } from '../crypto-utils'
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
      let rProto = await client.txReceiptAsync(rtv)
      if (rProto) {
        let reciept = EvmTxReceipt.deserializeBinary(bufferToProtobufBytes(rProto))
        t.deepEqual(
          Array.prototype.slice.call(reciept.getContractaddress_asU8(), 0),
          contractAddr.local.bytes,
          'Contract address should match'
        )
        t.equal(reciept.getStatus(), 1, 'Should return status 1 success')
      }
    }

    const retVal = await evmContract.staticCallAsync(inputGetArray)

    const retArr = Array.prototype.slice.call(retVal, 0)
    const expectedRtv = inputSet987Array.slice(-32)
    t.deepEqual(retArr, expectedRtv, 'Query result must match previously set')

    client.disconnect()
  } catch (err) {
    console.log(err)
  }
  t.end()
})
