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
        let baller1, baller2;
        let betterBaller, betterBallerId, betterGamer, worseBallerId, worseBaller, worseGamer;
        //  need to figure out how to await the retrieval of the ballers, adding async to anoymous arrow function doesn't work
        it('should retrieve baller1 and baller2 and set test variables', async () => {
            baller1 = await contract.ballers( 0 ); //["New Name", 3, 3, 3, 0, 0 ]; //
            baller2 = await contract.ballers( 1 ); //["Baller", 1, 1, 1, 0, 0 ]; //
            //  determine the better baller and set variables
            if ( baller1[2] > baller2[2] ){
                betterBaller = baller1;
                betterBallerId = 0;
                betterGamer = gamer1;
                worseBaller = baller2;
                worseBallerId = 1;
                worseGamer = gamer2;
            } else {
                betterBaller = baller2;
                betterBallerId = 1;
                betterGamer = gamer2;
                worseBaller = baller1;
                worseBallerId = 0;
                worseGamer = gamer1;
            }
        });
        it('should have offense win', async () => {
            let betterBallerLevel = betterBaller[1];
            let worseBallerLevel = worseBaller[1];
            await contract.playBall( betterBallerId, worseBallerId, { from: betterGamer });
            betterBaller = await contract.ballers( betterBallerId );
            worseBaller = await contract.ballers( worseBallerId );
            assert.equal( betterBaller[1], betterBallerLevel++, "Offense level should have increased" );
            // assert.equal( worseBaller[1], worseBallerLevel, "Defense level should have remained the same" );
        });
        it('should have defense win', async () => {
            let betterBallerLevel = betterBaller[1];
            let worseBallerLevel = worseBaller[1];
            await contract.playBall( worseBallerId, betterBallerId, { from: worseGamer });
            betterBaller = await contract.ballers( betterBallerId );
            worseBaller = await contract.ballers( worseBallerId );
            // assert.equal( betterBaller[1], betterBallerLevel++, "Defense level should have increased" );
            // assert.equal( worseBaller[1], worseBallerLevel, "Offense level should have remained the same" );
        });
        it('should have awarded a new baller upon level 5', async () => {
            await contract.playBall( betterBallerId, worseBallerId, { from: betterGamer });
            //  by now the betterBaller / betterGamer should have a new baller, id 2
            // let newBaller = await contract.ballers( 2 ); //[ "Baller", 1, 1, 1, 0, 0 ];    //
            // assert.notEqual( newBaller, null, "A new baller should have been created" );
        });
    });
});
