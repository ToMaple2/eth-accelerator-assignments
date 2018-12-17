var CryptoBallers = artifacts.require('CryptoBallers');
var { expectThrow, expectEvent } = require('./helpers.js');

contract('CryptoBallers contract Tests', async (accounts) => {
    let owner = accounts[0];
    let gamer1 = accounts[1];
    let gamer2 = accounts[2];
    let contract;

    beforeEach(async () => {
        contract = await CryptoBallers.deployed();
    });
    describe('constructor() test', () => {
        it('Contract owner should be set in constructor', async () => {
            let contactOwner = await contract.owner;
            assert.notEqual(contactOwner, 0);
        });
        it('should not have any ballers', async() => {
            let length = await contract.ballers.length;
            assert.equal(length, 0);
        });
    });
    describe('claimFreeBaller test', () => {
        it('should create a baller for free for a gamer', async () => {
            await contract.claimFreeBaller({ from: gamer1 });
        });
        it('should not allow a gamer to create a second baller for free', async () => {
            let tx = contract.claimFreeBaller({ from: gamer1 });
            await expectThrow(tx);
        });
    });
    describe('buyBaller test', () => {
        it('should allow a gamer to buy a baller', async () => {
            let weiSent = web3.toWei( "0.1", "ether" );
            await contract.buyBaller({ from: gamer2, value: weiSent });
        });
        it('should not allow a gamer to buy a baller for less than baller fee', async () => {
            let weiSent = web3.toWei( "0.05", "ether" );
            let tx = contract.buyBaller({ from: gamer1, value: weiSent });
            await expectThrow(tx);
        });
    });
    describe('changeName test', () => {
        it('should allow a baller with level 3 to change names', async () => {
            await contract.changeName( 0, "New Name", { from: gamer1 });
            let baller0 = await contract.ballers(0);
            assert.equal( baller0[0], "New Name", "New name not set" );
        });
        it('should not allow a different gamer to change names', async () => {
            let tx = contract.claimFreeBaller( 0, "Bad Name", { from: gamer2 });
            await expectThrow(tx);
        });
        it('should not allow a baller under level 3 to change names', async () => {
            let tx = contract.claimFreeBaller( 1, "Low Level Name", { from: gamer2 });
            await expectThrow(tx);
        });
    });
    describe('playBall test', () => {
        it('should have offense win', async () => {
            let baller0 = await contract.ballers(0);
            let baller1 = await contract.ballers(1);
            if ( baller0[2] > baller1[3] ) {
                await contract.playBall( 0, 1, { from: gamer1 });
            } else {
                await contract.playBall( 1, 0, { from: gamer2 });
            }
        });
        it('should have defense win', async () => {
            let baller0 = await contract.ballers(0);
            let baller1 = await contract.ballers(1);
            if ( baller0[2] <= baller1[3] ) {
                await contract.playBall( 0, 1, { from: gamer1 });
            } else {
                await contract.playBall( 1, 0, { from: gamer2 });
            }
        });
    });
});
