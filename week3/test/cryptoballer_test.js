var CryptoBallers = artifacts.require('CryptoBallers');
var { expectThrow, expectEvent } = require('./helpers.js');

contract('CryptoBallers contract Tests', async (accounts) => {
    let owner = accounts[0];
    let voter1 = accounts[1];
    let voter2 = accounts[2];
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
});
