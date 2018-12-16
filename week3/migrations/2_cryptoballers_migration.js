var CryptoBallers = artifacts.require("CryptoBallers");

module.exports = function (deployer) {
    deployer.deploy(CryptoBallers, "CryptoBallers");
};
