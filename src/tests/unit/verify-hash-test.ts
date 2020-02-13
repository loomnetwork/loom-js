import test from 'tape'
import BN from 'bn.js'

import { getEthereumTxHash, createDefaultTxMiddleware } from '../../helpers'
import { CryptoUtils, LocalAddress, LoomProvider, Address, NonceTxMiddleware, SignedEthTxMiddleware } from '../..'
import { createTestClient, createWeb3TestClient } from '../helpers'
import { deployContract } from '../evm-helpers'
import { AddressMapper } from '../../contracts'
import { getMetamaskSigner, OfflineWeb3Signer } from '../../solidity-helpers'

const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')

test('Verify hash test', async t => {
    try {
        await testWeb3Sign(t)
        await testWeb3DeploySign(t)
    } catch (err) {
        console.log(err)
    }

    async function testWeb3Sign(t: test.Test) {
        const value = parseInt('0', 10)
        const { contract, web3, client } = await newContractAndClient()
        const unsignedTx = await _generateTransaction(value, contract, web3)
        const [signedTx, txHash] = _signTransaction(unsignedTx)
        const ethTxhash = getEthereumTxHash(signedTx)
        const txSigned = '0x' + signedTx.toString('hex')

        let receipt:any
        try {
            receipt = await _sendTransaction(txSigned, web3)
        } catch (err) {
            console.log("send tx error", err)
        }

        client.disconnect()
        t.assert(ethTxhash === receipt.transactionHash, `both hashes need to be identical ethTxhash:${ethTxhash} transactionHash:${receipt.transactionHash} `)
    }

    async function testWeb3DeploySign(t: test.Test) {
        const { web3, client } = await newContractAndClient()
        const unsignedTx = await _generateDeployedContractTransaction(web3)
        const [signedTx, txHash] = _signTransaction(unsignedTx)
        const ethTxhash = getEthereumTxHash(signedTx)
        const txSigned = '0x' + signedTx.toString('hex')

        let receipt:any
        try {
            receipt = await _sendTransaction(txSigned, web3)
        } catch (err) {
            console.log("send tx error", err)
        }

        client.disconnect()
        t.assert(ethTxhash === receipt.transactionHash, `both hashes need to be identical ethTxhash:${ethTxhash} transactionHash:${receipt.transactionHash} `)
        t.end()
    }

    function _signTransaction(unsignedTx: any) {
        const privateKey = new Buffer(
            '0110000101110100011001010111001101110100011010110110010101111001',
            'hex'
        )
        const tx = new EthereumTx(unsignedTx)
        tx.sign(privateKey)
        const txHash = '0x' + tx.hash().toString('hex')
        return [tx.serialize(), txHash]
    }

    async function _generateTransaction(value: any, contract: any, web3: any) {
        const abiEncodedData = contract.methods.set(value).encodeABI()
        const nonce = await web3.eth.getTransactionCount('0x41ef0087901189bB5134De780fC6b3392C7914E6')
        return {
            nonce: nonce,
            gasPrice: 0,
            gasLimit: 0,
            to: contract.options.address,
            value: 0,
            data: abiEncodedData
        }
    }

    async function _generateDeployedContractTransaction(web3: any) {
        const contractData =
        '0x608060405234801561001057600080fd5b50600a60008190555061010e806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60d9565b6040518082815260200191505060405180910390f35b806000819055506000547fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b600080549050905600a165627a7a72305820b76f6c855a1f95260fc70490b16774074225da52ea165a58e95eb7a72a59d1700029'
        const nonce = await web3.eth.getTransactionCount('0x41ef0087901189bB5134De780fC6b3392C7914E6')

        return {
            nonce: nonce,
            gasPrice: 0,
            gasLimit: 0,
            data: contractData
        }
    }

    async function _sendTransaction(tx: any, web3: any) {
        return web3.eth.sendSignedTransaction(tx)
    }

    function loadRinkebyAccount(web3:any) {
        const privateKey = '0x0110000101110100011001010111001101110100011010110110010101111001'
        const ownerAccount = web3.eth.accounts.privateKeyToAccount(privateKey)
        web3.eth.accounts.wallet.add(ownerAccount)
        return { account: ownerAccount, web3 }
      }
      

    async function newContractAndClient() {
        const privKey = CryptoUtils.generatePrivateKey()
        const client = createTestClient()
        const from = LocalAddress.fromPublicKey(
            CryptoUtils.publicKeyFromPrivateKey(privKey)
        ).toString()
        const loomProvider = new LoomProvider(client, privKey)

        const web3 = new Web3('http://127.0.0.1:46658/eth')

        client.txMiddleware = createDefaultTxMiddleware(client, privKey)

        client.on('error', console.log)

        const rinkeby = loadRinkebyAccount(web3)
        const signer = new OfflineWeb3Signer(rinkeby.web3, rinkeby.account)

        try{
            await mapAccounts({
          client,
          signer,
          ownerRinkebyAddress: rinkeby.account.address,
          ownerExtdevAddress: from
        })
        } catch(error){
            console.log("account mapping error", error)
        }

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

        let result:any
        try{
        result = await deployContract(loomProvider, contractData)
        } catch(err){
            console.debug(err)
        }
        let contract:any
        try{
            contract = new web3.eth.Contract(ABI, result.contractAddress, { from })
        } catch(err){
            console.debug(err)
        }
        return { contract, web3, from, privKey, client}
    }

      async function mapAccounts({ client, signer, ownerRinkebyAddress, ownerExtdevAddress }:any) {
        const ownerRinkebyAddr = Address.fromString(`eth:${ownerRinkebyAddress}`)
        const ownerExtdevAddr = Address.fromString(`${client.chainId}:${ownerExtdevAddress}`)
        let mapperContract: AddressMapper
        try{
            mapperContract = await AddressMapper.createAsync(client, ownerExtdevAddr)
        }
        catch (err) {
            console.debug(err)
        }
        try {
          const mapping = await mapperContract!.getMappingAsync(ownerExtdevAddr)
          console.log(`${mapping.from.toString()} is already mapped to ${mapping.to.toString()}`)
          return
        } catch (err) {
          // assume this means there is no mapping yet, need to fix loom-js not to throw in this case
        }
        await mapperContract!.addIdentityMappingAsync(ownerExtdevAddr, ownerRinkebyAddr, signer)
        console.log(`Mapped ${ownerExtdevAddr} to ${ownerRinkebyAddr}`)
      }
})
