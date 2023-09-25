//SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract SuperToken{

    event tokenMinted(address receiver, uint value);

    //static balance of each account address
    //! static balance not dynamic balance
    mapping(address => uint) internal balance;


    function deposit() external payable {
        require(msg.value > 0, "NOT ENOUGH TOKEN SENT");
        balance[msg.sender] += msg.value;

        emit tokenMinted(msg.sender, msg.value);
    }

    function burn(uint amount) external {
        require(balance[msg.sender] >= amount, "NOT ENOUGH BALANCE");

        balance[msg.sender] -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");

        require(success, "TRANSACTION FAILED");
    }   

    fallback() external payable{}
    receive() external payable{}
}