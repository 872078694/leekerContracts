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
  event Approve(address indexed _owner, address indexed _spender, uint256 _value);

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;
  

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
  // approve
  function approve(address _spender, uint256 _value) public returns(bool success) {
    // Allowance
    allowance[msg.sender][_spender] = _value;

    emit Approve(msg.sender, _spender, _value);
    // Approvment event
    return true;
  }

  // Delegated transfer
    function transferFrom(address _from, address _to, uint256 _value)public returns(bool success) {
      // Require _from has enough tokens
      require(_value <= balanceOf[_from]);
      require(_value <= allowance[_from][msg.sender]);

      // change the balance 
      balanceOf[_from] -= _value;
      balanceOf[_to] += _value;
      // update the allowance
      allowance[_from][msg.sender] -= _value;
      // Transfer event
      emit Transfer(_from, _to, _value);
      return true;
    }


}