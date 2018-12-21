var RewardPoints = artifacts.require('RewardPoints');
var { expectThrow, expectEvent } = require('./helpers.js');

contract('RewardPoints contract Tests', async (accounts) => {
    let ownerAddr = accounts[0];
    let adminAddr = accounts[1];
    let merchantAddr = accounts[2];
    let operatorAddr = accounts[3];
    let userAddr = accounts[4];
    let contract;

    // let getMerchant = async (id) => {
    //     let merchantResult = await contract.getMerchantById.call(id);
    //     console.log( 'merchant: ' + merchant );
    //     merchantResult.then()
    //     return {id: merchantResult[0], addr: merchantResult[1], isApproved: merchantResult[2], isOperator: merchantResult[3] };
    // }
    beforeEach(async () => {
        contract = await RewardPoints.deployed();
    });
    describe('constructor() test', () => {
        it('should have one merchant', async () => {
            let merchantCount = await contract.getMerchantCount();
            assert.equal(merchantCount, 1, "merchants array should be length 1");
        });
        it('should have one user', async () => {
            let userCount = await contract.getUserCount();
            assert.equal(userCount, 1, "users array should be length 1");
        });
        it('should have a not approved zero merchant', () => {
            let merchantPromise = contract.getMerchantById.call(0);
            merchantPromise.then( merchantInfo => {
                assert.equal(merchantInfo[2], false, "Zero merchant should be not approved");
            });
        });
        // it('should have a not approved zero user', () => {
        //     let userPromise = contract.getUserById.call(0);
        //     userPromise.then( userInfo => {
        //         assert.equal(userInfo[2], false, "Zero user should not be approved");
        //     });
        // });
    });
    // describe('addCandidate() tests', () => {
    //     it('owner can add candidates', async () => {
    //         await contract.addCandidate("Jon Snow", { from: owner });
    //     });
    //     it('non owner can not add candidates', async () => {
    //         let tx = contract.addCandidate("Jane Snow", { from: voter1 });
    //         await expectThrow(tx);
    //     });
    //     it('candidate info check', async() => {
    //         let candidate = await getCandidate(0);
    //         assert.equal(candidate.name, "Jon Snow");
    //         assert.equal(candidate.votes, 0);
    //     });
    // });
    // describe('authorize() tests', () => {
    //     it('non owner can not authorize voter', async () => {
    //         let tx = contract.authorize(voter1, { from: voter2 });
    //         await expectThrow(tx);
    //     });
    //     it('owner can authorize voter', async () => {
    //         await contract.authorize(voter1, { from: owner });
    //     });
    // });
    // describe('vote() tests', () => {
    //     it('non unauthorized users can not vote', async () => {
    //         let tx = contract.vote(0, { from: owner });
    //         await expectThrow(tx);
    //     });
    //     it('authorized voters can vote', async () => {
    //         let tx = contract.vote(0, {from: voter1});
    //         await expectEvent(tx, "Vote");
    //     });
    //     it('candidate votes should be updated', async() => {
    //         let candidate = await getCandidate(0);
    //         assert.equal(candidate.votes, 1);
    //     });
    // });
});
