// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

contract Lock {
	
	mapping(address => uint) public balanceOf;
	
	receive () external payable {
		balanceOf[msg.sender] += msg.value;
	}
	
	function withdraw() public {
		require(balanceOf[msg.sender] > 0);
		
		console.log("1-", msg.sender.balance);
		uint val = balanceOf[msg.sender];

		address payable sender = payable(msg.sender);
		(bool success, ) = sender.call{value: val}("");
		require(success);
		console.log("2-", msg.sender.balance);
		
		balanceOf[msg.sender] = 0;
	}
}
