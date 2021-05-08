const LeekerToken = artifacts.require("./LeekerToken.sol");
const TokenSale = artifacts.require("./TokenSale.sol");

contract('TokenSale',(accounts)=>{
    let tokenInstance;
    let tokenSaleInstance;
    // the price is in wei
    let tokenPrice = 10000000000000000n;
    let numberOfTokens;
    let admin = accounts[0];
    let buyer = accounts[1];
    let tokenAvaiable = 7500000
    it('initializes the contract with the correct values',()=>{
        return TokenSale.deployed().then((instance)=>{
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then((address)=>{
            assert.notEqual(address, 0x0,'has contract address');
            return tokenSaleInstance.tokenContract();
        }).then((address)=>{
            assert.notEqual(address, 0x0,'has token contract address');
            return tokenSaleInstance.tokenPrice();
        }).then((price)=>{
            assert.equal(price, tokenPrice, 'token price is correct')
        })
    });

    it('facilitates token buying',()=>{
        return LeekerToken.deployed().then(async(instance)=>{
            // Grab token instance first
            tokenInstance = instance
            // For here I just rewrite the promise chain to async await for code structure
            tokenSaleInstance = await TokenSale.deployed();
            // Provision 75% of all tokens to the token sale
            await tokenInstance.transfer(tokenSaleInstance.address, tokenAvaiable,{from: admin});

            numberOfTokens = 10;
            let value = BigInt(numberOfTokens) * tokenPrice;
            return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: Number(value)});
        }).then((receipt)=>{
            assert.equal(receipt.logs.length,1,'triggers one event');
            assert.equal(receipt.logs[0].event, 'Sell' ,'should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account the account that purchased the token');
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
            return tokenSaleInstance.tokensSold();
        }).then((amount)=>{
            assert.equal(amount.toNumber(),numberOfTokens,'increments the number of tokens sold');
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then((balance)=>{
            assert.equal(balance.toNumber(),tokenAvaiable - numberOfTokens)
             // Try to buy tokens different from ether value
             return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer,value: 1});
        })    
        .then(assert.fail).catch((error)=>{
            assert(error.message.toString().indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
            return tokenSaleInstance.buyTokens(8000000, {from: buyer,value: 1});
        })
        .then(assert.fail).catch((error)=>{
            assert(error.message.toString().indexOf('revert') >= 0, 'cannot purchase more token than avaiable');
        })
    });

    it('end token sale',async ()=>{
        tokenInstance = await LeekerToken.deployed();
        tokenSaleInstance = await TokenSale.deployed();

        // Try to end the sale from another other than admin
        return tokenSaleInstance.endSale({from: buyer})
        .then(assert.fail).catch((error)=>{
            assert(error.message.toString().indexOf('revert') >= 0, 'must be admin to end sale');
            return tokenSaleInstance.endSale({from: admin})
        })
        .then((receipt)=>{
            // recipt
            return tokenInstance.balanceOf(admin);
        })
        .then((balance)=>{
            assert.equal(balance.toNumber(),9999990,'returns all unsold to admin');
            // check self destroy
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        })
        .then((balance)=>{
            assert.equal(balance.toNumber(),0,'token sale contract is destructed');
        })

    })
})
