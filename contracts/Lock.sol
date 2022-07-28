// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

contract Lock {
	
	mapping(address => uint) public balanceOf;
	
	receive() external payable {
		balanceOf[msg.sender] += msg.value;
	}
	
	/**
	* WARNING: this function is vulnerable (Reentrency)
	*/
	function withdraw() public {
		require(balanceOf[msg.sender] > 0);
		
		uint senderBalance = balanceOf[msg.sender];
		console.log(
			"[Lock] withdraw: LockBalance: %s, SenderBalance: %s",
			address(this).balance,
			senderBalance
		);

		// uncomment the next line to secure contract funds
		// balanceOf[msg.sender] = 0;
		address payable sender = payable(msg.sender);
		(bool success, ) = sender.call{value: senderBalance}("");
		require(success, "could not send eth");
		
		// problem: the next line should be before sending
		balanceOf[msg.sender] = 0;
	}
}
