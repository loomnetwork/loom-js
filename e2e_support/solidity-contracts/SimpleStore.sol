pragma solidity ^0.4.25;

contract SimpleStore {
  uint256 value;

  constructor() public {
      value = 10;
  }

  event NewValueSet(uint indexed _value, address sender);

  function set(uint _value) public {
    value = _value;
    emit NewValueSet(value, msg.sender);
  }

  function get() public view returns (uint) {
    return value;
  }
}