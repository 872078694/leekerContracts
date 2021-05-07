pragma solidity ^0.5.16;

contract LeekerToken {
    // constructer
    // set the total number of tokens
    // Read the total number of tokens

  string public name = 'LeekerSwap';
  string public symbol = 'LKS';
  string public standard = 'LeekerSwap v1.0';
  uint256 public totalSupply;

  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  mapping(address => uint256) public balanceOf;


  constructor(uint256 _initialSupply) public {
   balanceOf[msg.sender] = _initialSupply;
   totalSupply = _initialSupply;
   // allocate the initial supply
  }

  // Transfer
  // Exception if account doesn't have enough
  // return a boolean
  // transfer event
  function transfer(address _to, uint256 _value)public returns(bool success){
    require(balanceOf[msg.sender] >= _value);

    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;

    emit Transfer(msg.sender, _to, _value);

    return true;

  }


}