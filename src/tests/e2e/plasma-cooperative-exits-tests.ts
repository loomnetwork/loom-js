import test from 'tape'

async function setupContracts() {
  /*
    const vmc = await ValidatorManagerContract.new({from: authority});
    const plasma = await RootChain.new(vmc.address, {from: authority});
    const cards = await CryptoCards.new(plasma.address);
    await vmc.toggleToken(cards.address);
    */
}

// Alice registers and has 5 coins, and she deposits 3 of them.
const ALICE_INITIAL_COINS = 5
const ALICE_DEPOSITED_COINS = 3
const COINS = [1, 2, 3]

async function setupAccounts() {
  /*
    await cards.register({from: alice});
    assert.equal(await cards.balanceOf.call(alice), 5);

    let ret;
    for (let i = 0; i < ALICE_DEPOSITED_COINS; i ++) {
        await cards.depositToPlasma(COINS[i], {from: alice});
    }

    assert.equal((await cards.balanceOf.call(alice)).toNumber(), ALICE_INITIAL_COINS - ALICE_DEPOSITED_COINS);
    assert.equal((await cards.balanceOf.call(plasma.address)).toNumber(), ALICE_DEPOSITED_COINS);

        const depositEvent = plasma.Deposit({}, {fromBlock: 0, toBlock: 'latest'});
        events = await txlib.Promisify(cb => depositEvent.get(cb));

        // Check that events were emitted properly
        let coin;
        for (let i = 0; i < events.length; i++) {
            coin = events[i].args;
            // assert.equal(coin.slot.toNumber(), i);
            assert.equal(coin.blockNumber.toNumber(), i+1);
            assert.equal(coin.denomination.toNumber(), 1);
            assert.equal(coin.from, alice);
        }
    */
}

test('Exit of UTXO 2 (Coin 3) Directly after its deposit', t => {
  t.plan(1)
  t.end()
})
