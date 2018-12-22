var RewardPoints = artifacts.require('RewardPoints');
var { expectThrow, expectEvent } = require('./helpers.js');

contract('RewardPoints contract Tests', async (accounts) => {
    let ownerAddr = accounts[0];
    let adminAddr = accounts[1];
    let merchantAddr = accounts[2];
    let operatorAddr = accounts[3];
    let userAddr = accounts[4];
    let merchant2Addr = accounts[5];
    let contract;

    let getMerchant = async (id) => {
        let merchantResult = await contract.getMerchantById.call(id);
        console.log( 'merchant: ' + merchant );
        merchantResult.then( result => {
            return {id: merchantResult[0], addr: merchantResult[1],
                isApproved: merchantResult[2], isOperator: merchantResult[3]
            };
        });
    }
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
        //  TODO - cannot check the zero merchant and user because merchantExist and userExist require() won't let us
    });
    describe('addAdmin() tests', () => {
        it('should allow owner to add admins', async () => {
            let result = await contract.addAdmin(adminAddr, { from: ownerAddr });
            // console.log( 'result ' + JSON.stringify(result) );
            assert.equal( result.logs[0].event, "AddedAdmin", "AddedAdmin event not fired" );
        });
        it('shoud not allow non owner to add admins', async () => {
            let tx = contract.addAdmin(userAddr, { from: merchantAddr });
            await expectThrow(tx);
        });
    });
    describe('removeAdmin() tests', () => {
        it('should allow owner to remove admins', async () => {
            let result = await contract.removeAdmin(adminAddr, { from: ownerAddr });
            assert.equal( result.logs[0].event, "RemovedAdmin", "RemovedAdmin event not fired" );
        });
        it('shoud not allow non owner to remove admins', async () => {
            await contract.addAdmin(adminAddr, { from: ownerAddr });    // admin must be added back in
            let tx = contract.removeAdmin(adminAddr, { from: merchantAddr });
            await expectThrow(tx);
        });
    });

    describe('addMerchant() tests', () => {
        it('should allow admin to add merchants', async () => {
            let result = await contract.addMerchant(merchantAddr, { from: adminAddr });
            assert.equal( result.logs[0].event, "AddedMerchant", "AddedMerchant event not fired" );
        });
        it('shoud not allow non admin to add merchants', async () => {
            let tx = contract.addMerchant(merchantAddr, { from: merchantAddr });
            await expectThrow(tx);
        });
    });
    describe('approveMerchant() tests', () => {
        it('should allow admin to approve merchants', async () => {
            let result = await contract.approveMerchant(1, { from: adminAddr });
            assert.equal( result.logs[0].event, "ApprovedMerchant", "AddedMerchant event not fired" );
        });
        it('shoud not allow non admin to approve merchants', async () => {
            let tx = contract.approveMerchant(1, { from: merchantAddr });
            await expectThrow(tx);
        });
    });
    describe('banMerchant() tests', () => {
        it('should allow admin to remove merchants', async () => {
            let result = await contract.banMerchant(1, { from: adminAddr });
            assert.equal( result.logs[0].event, "BannedMerchant", "BannedMerchant event not fired" );
        });
        it('shoud not allow non admin to remove merchants', async () => {
            await contract.approveMerchant(1, { from: adminAddr });     // merchant must be approved again first
            let tx = contract.banMerchant(merchantAddr, { from: merchantAddr });
            await expectThrow(tx);
        });
    });

    describe('addUser() tests', () => {
        it('should allow admin to add users', async () => {
            let result = await contract.addUser(userAddr, { from: adminAddr });
            assert.equal( result.logs[0].event, "AddedUser", "AddedUser event not fired" );
        });
        it('shoud not allow non admin to add users', async () => {
            let tx = contract.addUser(userAddr, { from: userAddr });
            await expectThrow(tx);
        });
    });
    describe('approveUser() tests', () => {
        it('should allow admin to approve users', async () => {
            let result = await contract.approveUser(userAddr, { from: adminAddr });
            assert.equal( result.logs[0].event, "ApprovedUser", "AddedUser event not fired" );
        });
        it('shoud not allow non admin to approve users', async () => {
            let tx = contract.approveUser(userAddr, { from: userAddr });
            await expectThrow(tx);
        });
    });
    describe('banUser() tests', () => {
        it('should allow admin to remove users', async () => {
            let result = await contract.banUser(userAddr, { from: adminAddr });
            assert.equal( result.logs[0].event, "BannedUser", "BannedUser event not fired" );
        });
        it('shoud not allow non admin to remove users', async () => {
            await contract.approveUser(userAddr, { from: adminAddr });     // user must be approved again first
            let tx = contract.banUser(userAddr, { from: userAddr });
            await expectThrow(tx);
        });
    });

    describe('addOperator() tests', () => {
        it('should allow merchant to add operators', async () => {
            let result = await contract.addOperator(operatorAddr, { from: merchantAddr });
            assert.equal( result.logs[0].event, "AddedOperator", "AddedOperator event not fired" );
        });
        it('shoud not allow non merchant to add operators', async () => {
            let tx = contract.addOperator(operatorAddr, { from: operatorAddr });
            await expectThrow(tx);
        });
    });
    describe('removeOperator() tests', () => {
        it('should allow merchant to remove operators', async () => {
            let result = await contract.removeOperator(operatorAddr, { from: merchantAddr });
            assert.equal( result.logs[0].event, "RemovedOperator", "RemovedOperator event not fired" );
        });
        it('shoud not allow non merchant to remove operators', async () => {
            await contract.addOperator(operatorAddr, { from: merchantAddr });    // operator must be added back in
            let tx = contract.removeOperator(operatorAddr, { from: operatorAddr });
            await expectThrow(tx);
        });
    });
    describe('transferMerchantOwnership() tests', () => {
        it('should allow merchant to transfer merchant ownership', async () => {
            let result = await contract.transferMerchantOwnership(merchant2Addr, { from: merchantAddr });
            assert.equal( result.logs[0].event, "TransferredMerchantOwnership", "TransferredMerchantOwnership event not fired" );
        });
        it('shoud not allow non merchant to transfer merchant ownership', async () => {
            await contract.addMerchant(merchantAddr, { from: adminAddr });    // merchant 1 must be added back in
            let tx = contract.transferMerchantOwnership(operatorAddr, { from: operatorAddr });
            await expectThrow(tx);
        });
    });

    describe('rewardUser() tests', () => {
        it('should allow merchant to reward users', async () => {
            let result = await contract.rewardUser(userAddr, 100, { from: operatorAddr });
            assert.equal( result.logs[0].event, "RewardedUser", "RewardedUser event not fired" );
        });
        it('User should have correct rewarded points', async () => {
            let userInfo = await contract.getUserById(1);
            assert.equal( userInfo[3], 100, "Total earned points not equal to 100")
            let earnedPoints = await contract.getUserEarnedPointsAtMerchant(userAddr, 1, { from: userAddr });
            assert.equal( earnedPoints, 100, "Merchant earned points not equal to 100" );
        });
        it('shoud not allow non merchant to reward users', async () => {
            let tx = contract.rewardUser(userAddr, { from: userAddr });
            await expectThrow(tx);
        });
    });
    describe('redeemPoints() tests', () => {
        it('should allow user to redeem points with a merchant', async () => {
            let result = await contract.redeemPoints(1, 60, { from: userAddr });
            assert.equal( result.logs[0].event, "RedeemedPoints", "RedeemedPoints event not fired" );
        });
        it('User should have correct redeemed points', async () => {
            let userInfo = await contract.getUserById(1);
            assert.equal( userInfo[4], 60, "Total redeemed points not equal to 60")
            let redeemedPoints = await contract.getUserRedeemedPointsAtMerchant(userAddr, 1, { from: userAddr });
            assert.equal( redeemedPoints, 60, "Merchant earned points not equal to 60" );
        });
        it('shoud not allow non user to redeem points with a merchant', async () => {
            let tx = contract.redeemPoints(1, 20, { from: operatorAddr });
            await expectThrow(tx);
        });
        it('shoud not allow user to over redeem points with a merchant', async () => {
            let tx = contract.redeemPoints(1, 60, { from: userAddr });
            await expectThrow(tx);
        });
    });
});
