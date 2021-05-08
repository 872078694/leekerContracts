pragma solidity ^0.5.16;

import "./LeekerToken.sol";

contract TokenSale {

    address payable admin;
    LeekerToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(LeekerToken _tokenContract, uint256 _tokenPrice) public {
        //assign an admin
        admin = msg.sender;
        //Token Contract
        tokenContract = _tokenContract;
        //Token Price
        tokenPrice = _tokenPrice;
    }
    //mulitiply from safe math
    function mulitiply(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }    

    function buyTokens(uint256 _numberOfTokens) public payable {
        // Require that value is equal to tokens
        require(msg.value == mulitiply(_numberOfTokens , tokenPrice));
        // Require that there are enough tokens in the contract
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        // Rquire that transfer is successful
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        // keep track of tokens sold
        tokensSold += _numberOfTokens;
        // Trigger Sell Event
        emit Sell(msg.sender, _numberOfTokens);
    }

    // End token sell
    function endSale() public {
        // Requre only admin can end sale
        require(msg.sender == admin);
        // Transfer remaining dapp tokens to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        // Destroy contract
        selfdestruct(msg.sender);

    }
}