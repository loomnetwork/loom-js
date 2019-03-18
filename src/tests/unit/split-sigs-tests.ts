import test from 'tape'
import { ethers } from 'ethers'

import { parseSigs } from '../../helpers'

test('Split sigs', t => {
  try {
    const singleSigWithMode =
      '0x00cd7f07b4f35d2d2dee86bde44d765aef81673745aab5d5aaf4422dc73938237d2cbc5105bc0ceddbf4037b62003159903d35b834496a622ba4d9117008c164401c'

    const singleSig =
      '0xcd7f07b4f35d2d2dee86bde44d765aef81673745aab5d5aaf4422dc73938237d2cbc5105bc0ceddbf4037b62003159903d35b834496a622ba4d9117008c164401c'

    const serializedSigs =
      '0xcd7f07b4f35d2d2dee86bde44d765aef81673745aab5d5aaf4422dc73938237d2cbc5105bc0ceddbf4037b62003159903d35b834496a622ba4d9117008c164401c6b86642dc24d77f9dcb8da9ced39bd83bbc9c5d536879b377a15cd158296377b3b82da79ba147325977ec82307326fbb33764ac849b57fa4d0b0e7b6d10a762b1bd5574ca4729ee8ee8567b7cb4f13725d8f5143b82d609a66795253b57ec541b454960a8c7aff544c7cf20105fc85dbdc23aa3f8640bd17615dabf606eb2f2cfe1bf7d6a8480464a2323138470e068c031b39e4f3a96e177df800f8b50e9a460c1b6a4ceb40bb337e5932196c011cbbe268dd6786c94d2a669c8d4b0fd0dbc9ce6f1c3bb1bfa61a7c9a632e4bdd8eace611a9ea6b9ddafff53d109f2da16fc2cf14963650f4abe5811621b3a8f44cc99b0084d3c2c90d40e1ea68b1a456bcb368c4331b0817bfea874076384a41d1638d6a5dfae1ab0e05e8e32acf6d1d00ac71dea0fd5abef247260e79512601feb770cd4c85a5061da7db2c1937970b5de0e308ccfc1c'

    const validators = [
      '0x0C0eaEC5552C93a22fB628De3bd18406E1e74989',
      '0xB84B25a63BCEEB318FBC412203D6d70Fef8E8883',
      '0x58e28D2cE00886dfd03Ec47543c15EA185922242',
      '0x45c6971A31C15D8B4E11e22901014b2E5e37c1a8',
      '0xce67056aD7C12bF52A1659FC9a474881ef17ab85',
      '0xe5ac31f6890b4571F0acbE019d24F13E17Db428c'
    ]

    // Use parth's successful testnet tx as a test
    // https://rinkeby.etherscan.io/tx/0x61a06a380d7dcf0826629d889a378ff081647b713e2236b8f8a8ad9122947063
    let amount = '1000000000000000000'
    let gatewayAddress = '0xe0c7a9dd2c644f0d2c79aa9ba28b442d163d0113'
    let ethAddress = new ethers.Wallet(
      'd8f5e8dd68cb2209e3faff2641cf72bc8c8987e4190eda67c4f48a88a1a05657'
    ).address
    let nonce = 0

    // Hash just the amount since it was an ether withdrawal
    let amountHashed = ethers.utils.solidityKeccak256(['uint256'], [amount.toString()])

    const withdrawalHash = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'address', 'bytes32'],
      [ethAddress, nonce, gatewayAddress, amountHashed]
    )

    const recHash = ethers.utils.arrayify(
      ethers.utils.hashMessage(ethers.utils.arrayify(withdrawalHash))
    )

    /////////////////

    // Test that it works with 1 sig with mode
    let ret = parseSigs(singleSigWithMode, withdrawalHash, validators)
    let sig = ret.rs[0] + ret.ss[0].slice(2) + ret.vs[0].toString(16)
    t.equals(ret.ss.length, 1)
    t.equals(ret.rs.length, 1)
    t.equals(ret.vs.length, 1)
    t.equals(ret.valIndexes.length, 1)
    t.equals(sig, singleSig, 'v,r,s values were parsed correctly')

    let recAddress = ethers.utils.recoverAddress(recHash, sig)
    t.equals(validators[ret.valIndexes[0]], recAddress)

    // Test that it works with 1 signature (should break the v/r/s correctly)
    ret = parseSigs(singleSig, withdrawalHash, validators)
    sig = ret.rs[0] + ret.ss[0].slice(2) + ret.vs[0].toString(16)
    t.equals(ret.ss.length, 1)
    t.equals(ret.rs.length, 1)
    t.equals(ret.vs.length, 1)
    t.equals(ret.valIndexes.length, 1)
    t.equals(sig, singleSig, 'v,r,s values were parsed correctly')

    recAddress = ethers.utils.recoverAddress(recHash, sig)
    t.equals(validators[ret.valIndexes[0]], recAddress)

    // Test that works with 6 validators
    const { vs, rs, ss, valIndexes } = parseSigs(serializedSigs, withdrawalHash, validators)
    t.equals(ss.length, 6)
    t.equals(rs.length, 6)
    t.equals(vs.length, 6)
    t.equals(valIndexes.length, 6)

    // Split signature in v,r,s arrays
    // Store the ordering of the validators' signatures in `indexes`
    for (let i in valIndexes) {
      console.log(i)
      const v = vs[i]
      const r = rs[i]
      const s = ss[i]
      // Check that they were sorted correctly
      const ind = parseInt(i) // valIndexes[i]

      // reconstruct the signature from its pieces (we need to break into v,r,s for solidity)
      let sig = r + s.slice(2) + v.toString(16)
      let recAddress = ethers.utils.recoverAddress(recHash, sig)
      t.equals(
        validators[ind],
        recAddress,
        `Recovered index ${ind} matches validator ${validators[ind]}`
      )
    }
  } catch (err) {
    console.log(err)
  }
  t.end()
})
