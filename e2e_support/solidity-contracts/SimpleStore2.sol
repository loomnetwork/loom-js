pragma solidity ^0.4.25;

contract SimpleStore {
  uint value;

  constructor() public {
      value = 10;
  }

  event NewValueSet(uint indexed _value);
  event NewValueSetAgain(uint indexed _value);

  function set(uint _value) public {
    value = _value;
    emit NewValueSet(value);
  }

  function setAgain(uint _value) public {
    value = _value;
    emit NewValueSetAgain(value);
  }
  
  function get() public view returns (uint) {
    return value;
  }
}