const LeekerToken = artifacts.require("./LeekerToken.sol");
const TokenSale = artifacts.require("./TokenSale.sol")

module.exports = function (deployer) {
  deployer.deploy(LeekerToken, 10000000).then(()=>{
    let tokenPrice = 10000000000000000n;
    return deployer.deploy(TokenSale,LeekerToken.address, tokenPrice);
  });
  
};
