const LeekerToken = artifacts.require("./LeekerToken.sol");

module.exports = function (deployer) {
  deployer.deploy(LeekerToken);
};
