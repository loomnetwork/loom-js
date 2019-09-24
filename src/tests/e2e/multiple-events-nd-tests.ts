import test from 'tape'

import { LocalAddress, CryptoUtils } from '../../index'
import { createTestClient, waitForMillisecondsAsync, createWeb3TestClient } from '../helpers'

import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'

const Web3 = require('web3')

/**
 *  pragma solidity ^0.4.24;
 *
 *  import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
 *
 *  contract CryptoCardsDappChain is ERC721Token {
 *    event CreateCard(address _user, uint256 _tokenId);
 *
 *    constructor() ERC721Token("CryptoCardsDappChain", "CRC") public { }
 *
 *    // Parent contract ER721Token should emit Transfer
 *    function mint() public {
 *      uint256 tokenId = allTokens.length;
 *
 *      // Event emitting
 *      emit CreateCard(msg.sender, tokenId);
 *
 *      // Event Transfer isn't emitted
 *      super._mint(msg.sender, tokenId);
 *    }
 *  }
 *
 */

const newContractAndClient = async (useEthEndpoint: boolean) => {
  const privKey = CryptoUtils.generatePrivateKey()
  const client = useEthEndpoint ? createWeb3TestClient() : createTestClient()
  const from = LocalAddress.fromPublicKey(CryptoUtils.publicKeyFromPrivateKey(privKey)).toString()
  const loomProvider = new LoomProvider(client, privKey)
  const web3 = new Web3(loomProvider)

  const contractData =
    '0x60806040523480156200001157600080fd5b506040805190810160405280601481526020017f43727970746f436172647344617070436861696e0000000000000000000000008152506040805190810160405280600381526020017f4352430000000000000000000000000000000000000000000000000000000000815250816004908051906020019062000096929190620000b8565b508060059080519060200190620000af929190620000b8565b50505062000167565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620000fb57805160ff19168380011785556200012c565b828001600101855582156200012c579182015b828111156200012b5782518255916020019190600101906200010e565b5b5090506200013b91906200013f565b5090565b6200016491905b808211156200016057600081600090555060010162000146565b5090565b90565b611d0580620001776000396000f3006080604052600436106100f1576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100f6578063081812fc14610186578063095ea7b3146101f35780631249c58b1461024057806318160ddd1461025757806323b872dd146102825780632f745c59146102ef57806342842e0e146103505780634f558e79146103bd5780634f6ccce7146104025780636352211e1461044357806370a08231146104b057806395d89b4114610507578063a22cb46514610597578063b88d4fde146105e6578063c87b56dd14610699578063e985e9c51461073f575b600080fd5b34801561010257600080fd5b5061010b6107ba565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561014b578082015181840152602081019050610130565b50505050905090810190601f1680156101785780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561019257600080fd5b506101b16004803603810190808035906020019092919050505061085c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101ff57600080fd5b5061023e600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610899565b005b34801561024c57600080fd5b50610255610a5f565b005b34801561026357600080fd5b5061026c610ae1565b6040518082815260200191505060405180910390f35b34801561028e57600080fd5b506102ed600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610aee565b005b3480156102fb57600080fd5b5061033a600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610c05565b6040518082815260200191505060405180910390f35b34801561035c57600080fd5b506103bb600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610c7c565b005b3480156103c957600080fd5b506103e860048036038101908080359060200190929190505050610cb4565b604051808215151515815260200191505060405180910390f35b34801561040e57600080fd5b5061042d60048036038101908080359060200190929190505050610d25565b6040518082815260200191505060405180910390f35b34801561044f57600080fd5b5061046e60048036038101908080359060200190929190505050610d5d565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156104bc57600080fd5b506104f1600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610dda565b6040518082815260200191505060405180910390f35b34801561051357600080fd5b5061051c610e5e565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561055c578082015181840152602081019050610541565b50505050905090810190601f1680156105895780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156105a357600080fd5b506105e4600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803515159060200190929190505050610f00565b005b3480156105f257600080fd5b50610697600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929050505061103c565b005b3480156106a557600080fd5b506106c46004803603810190808035906020019092919050505061107b565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156107045780820151818401526020810190506106e9565b50505050905090810190601f1680156107315780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561074b57600080fd5b506107a0600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611144565b604051808215151515815260200191505060405180910390f35b606060048054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108525780601f1061082757610100808354040283529160200191610852565b820191906000526020600020905b81548152906001019060200180831161083557829003601f168201915b5050505050905090565b60006001600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60006108a482610d5d565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141515156108e157600080fd5b8073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148061092157506109208133611144565b5b151561092c57600080fd5b600073ffffffffffffffffffffffffffffffffffffffff1661094d8361085c565b73ffffffffffffffffffffffffffffffffffffffff1614158061099d5750600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614155b15610a5a57826001600084815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a35b505050565b600060088054905090507f12b2a00a98b1c020d242fccd2fac74dd465b5e601631abd612d151d7fe74dfea3382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a1610ade33826111d8565b50565b6000600880549050905090565b80610af9338261122f565b1515610b0457600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614151515610b4057600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614151515610b7c57600080fd5b610b8684836112c4565b610b90848361142d565b610b9a8383611645565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a350505050565b6000610c1083610dda565b82101515610c1d57600080fd5b600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002082815481101515610c6957fe5b9060005260206000200154905092915050565b80610c87338261122f565b1515610c9257600080fd5b610cae848484602060405190810160405280600081525061103c565b50505050565b60008060008084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415915050919050565b6000610d2f610ae1565b82101515610d3c57600080fd5b600882815481101515610d4b57fe5b90600052602060002001549050919050565b60008060008084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515610dd157600080fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614151515610e1757600080fd5b600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b606060058054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610ef65780601f10610ecb57610100808354040283529160200191610ef6565b820191906000526020600020905b815481529060010190602001808311610ed957829003601f168201915b5050505050905090565b3373ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614151515610f3b57600080fd5b80600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051808215151515815260200191505060405180910390a35050565b81611047338261122f565b151561105257600080fd5b61105d858585610aee565b6110698585858561171c565b151561107457600080fd5b5050505050565b606061108682610cb4565b151561109157600080fd5b600a60008381526020019081526020016000208054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156111385780601f1061110d57610100808354040283529160200191611138565b820191906000526020600020905b81548152906001019060200180831161111b57829003601f168201915b50505050509050919050565b6000600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b6111e2828261190a565b600880549050600960008381526020019081526020016000208190555060088190806001815401808255809150509060018203906000526020600020016000909192909190915055505050565b60008061123b83610d5d565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614806112aa57508373ffffffffffffffffffffffffffffffffffffffff166112928461085c565b73ffffffffffffffffffffffffffffffffffffffff16145b806112bb57506112ba8185611144565b5b91505092915050565b8173ffffffffffffffffffffffffffffffffffffffff166112e482610d5d565b73ffffffffffffffffffffffffffffffffffffffff1614151561130657600080fd5b600073ffffffffffffffffffffffffffffffffffffffff166001600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156114295760006001600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040518082815260200191505060405180910390a35b5050565b600080600061143c85856119ba565b600760008581526020019081526020016000205492506114a86001600660008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080549050611ae890919063ffffffff16565b9150600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020828154811015156114f657fe5b9060005260206000200154905080600660008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208481548110151561155057fe5b90600052602060002001819055506000600660008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020838154811015156115ac57fe5b9060005260206000200181905550600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080548091906001900361160c9190611c88565b50600060076000868152602001908152602001600020819055508260076000838152602001908152602001600020819055505050505050565b60006116518383611b01565b600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805490509050600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020829080600181540180825580915050906001820390600052602060002001600090919290919091505550806007600084815260200190815260200160002081905550505050565b60008061173e8573ffffffffffffffffffffffffffffffffffffffff16611c59565b151561174d5760019150611901565b8473ffffffffffffffffffffffffffffffffffffffff1663f0b9e5ba8786866040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561180f5780820151818401526020810190506117f4565b50505050905090810190601f16801561183c5780820380516001836020036101000a031916815260200191505b50945050505050602060405180830381600087803b15801561185d57600080fd5b505af1158015611871573d6000803e3d6000fd5b505050506040513d602081101561188757600080fd5b8101908080519060200190929190505050905063f0b9e5ba7c0100000000000000000000000000000000000000000000000000000000027bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161491505b50949350505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415151561194657600080fd5b6119508282611645565b8173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35050565b8173ffffffffffffffffffffffffffffffffffffffff166119da82610d5d565b73ffffffffffffffffffffffffffffffffffffffff161415156119fc57600080fd5b611a4f6001600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611ae890919063ffffffff16565b600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600080600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b6000828211151515611af657fe5b818303905092915050565b600073ffffffffffffffffffffffffffffffffffffffff1660008083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515611b6e57600080fd5b8160008083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550611c126001600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611c6c90919063ffffffff16565b600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505050565b600080823b905060008111915050919050565b60008183019050828110151515611c7f57fe5b80905092915050565b815481835581811115611caf57818360005260206000209182019101611cae9190611cb4565b5b505050565b611cd691905b80821115611cd2576000816000905550600101611cba565b5090565b905600a165627a7a72305820640a56be705b9ad59a60a1c07599ef587b2f04a503bc6d1318f90a2fb24c03220029'

  const ABI = [
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [{ name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [{ name: '_tokenId', type: 'uint256' }],
      name: 'getApproved',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [{ name: '_to', type: 'address' }, { name: '_tokenId', type: 'uint256' }],
      name: 'approve',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        { name: '_from', type: 'address' },
        { name: '_to', type: 'address' },
        { name: '_tokenId', type: 'uint256' }
      ],
      name: 'transferFrom',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }, { name: '_index', type: 'uint256' }],
      name: 'tokenOfOwnerByIndex',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        { name: '_from', type: 'address' },
        { name: '_to', type: 'address' },
        { name: '_tokenId', type: 'uint256' }
      ],
      name: 'safeTransferFrom',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [{ name: '_tokenId', type: 'uint256' }],
      name: 'exists',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [{ name: '_index', type: 'uint256' }],
      name: 'tokenByIndex',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [{ name: '_tokenId', type: 'uint256' }],
      name: 'ownerOf',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [{ name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [{ name: '_to', type: 'address' }, { name: '_approved', type: 'bool' }],
      name: 'setApprovalForAll',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        { name: '_from', type: 'address' },
        { name: '_to', type: 'address' },
        { name: '_tokenId', type: 'uint256' },
        { name: '_data', type: 'bytes' }
      ],
      name: 'safeTransferFrom',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [{ name: '_tokenId', type: 'uint256' }],
      name: 'tokenURI',
      outputs: [{ name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }, { name: '_operator', type: 'address' }],
      name: 'isApprovedForAll',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: '_user', type: 'address' },
        { indexed: false, name: '_tokenId', type: 'uint256' }
      ],
      name: 'CreateCard',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: '_from', type: 'address' },
        { indexed: true, name: '_to', type: 'address' },
        { indexed: false, name: '_tokenId', type: 'uint256' }
      ],
      name: 'Transfer',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: '_owner', type: 'address' },
        { indexed: true, name: '_approved', type: 'address' },
        { indexed: false, name: '_tokenId', type: 'uint256' }
      ],
      name: 'Approval',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: '_owner', type: 'address' },
        { indexed: true, name: '_operator', type: 'address' },
        { indexed: false, name: '_approved', type: 'bool' }
      ],
      name: 'ApprovalForAll',
      type: 'event'
    },
    {
      constant: false,
      inputs: [],
      name: 'mint',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ]

  const result = await deployContract(loomProvider, contractData)

  const contract = new web3.eth.Contract(ABI, result.contractAddress, { from })

  return {
    contract,
    client
  }
}

async function testMultipleContractEvents(t: any, useEthEndpoint: boolean) {
  t.plan(3) // EXPECTS 3 ASSERTIONS
  const { contract, client } = await newContractAndClient(useEthEndpoint)

  try {
    contract.events.Transfer({}, (err: any, event: any) => {
      t.assert(!err)
    })

    contract.events.CreateCard({}, (err: any, event: any) => {
      t.assert(!err)
    })

    await contract.methods.mint().send()

    const totalSupply = await contract.methods.totalSupply().call()

    t.assert(totalSupply === '1', 'Total Supply eq 1')

    await waitForMillisecondsAsync(3000)
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
}

test('LoomProvider + Web3 (legacy)', (t: any) => testMultipleContractEvents(t, false))
test('LoomProvider + Web3', (t: any) => testMultipleContractEvents(t, true))
