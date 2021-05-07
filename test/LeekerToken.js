const LeekerToken = artifacts.require("./LeekerToken.sol");

contract('LeekerToken', (accounts)=>{
    it('set the total supply upon deployment', ()=>{
        return LeekerToken.deployed().then((instance)=>{
            const tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then((totalSupply)=>{
            assert.equal(totalSupply.toNumber(),10000000,'sets the total supply to 10,000,000')
        })
    })
})