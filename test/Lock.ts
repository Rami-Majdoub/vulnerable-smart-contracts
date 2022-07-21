import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  
  async function deployFixture() {
    const [owner, ...otherAccounts] = await ethers.getSigners();
	
    const contractFactory = await ethers.getContractFactory("Lock");
    const contract = await contractFactory.deploy();
    
    await contract.deployTransaction.wait()
    
    // send ether to receive function
    await owner.sendTransaction({
    	to: contract.address,
    	value: ethers.utils.parseEther("1000"),
    });
    
    return { contract, owner, otherAccounts };
  }

  describe("deployment", function () {
    it("should have recieved ether", async function () {
      const { contract, owner } = await loadFixture(deployFixture);
      
      expect(await contract.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("1000"));
    })
  })
  
  describe("normal use case", () => {
  	it("should update balance locked", async () => {
  	  const { contract, otherAccounts: accounts } = await loadFixture(deployFixture)
  	  
  	  const [ account ] = accounts
      await account.sendTransaction({
    	  to: contract.address,
    	  value: ethers.utils.parseEther("1000"),
      });
      
      expect(await contract.balanceOf(account.address)).to.equal(ethers.utils.parseEther("1000"));
  	})
  	
  	it("should withdraw after sending", async () => {
  	  const { contract, otherAccounts: accounts } = await loadFixture(deployFixture)
  	  
  	  const [ account ] = accounts
  	  
  	  const balanceBeforeSend = await account.getBalance()
      await account.sendTransaction({
    	  to: contract.address,
    	  value: ethers.utils.parseEther("1000"),
      });
      
  	  const balanceBeforeWithdraw = await account.getBalance()
      await contract.withdraw()
      
      const balanceAfterWithdraw = await account.getBalance()
      
      console.log({ balanceBeforeSend, balanceBeforeWithdraw, balanceAfterWithdraw })
      
      expect(balanceAfterWithdraw).to.be.above(0)
  	})
  })
})
