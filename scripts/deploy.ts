import { ethers } from "hardhat";

async function main() {

  const lock = await (
    await ethers.getContractFactory("Lock")
  ).deploy()
  await lock.deployed()

  const stealer = await (
    await ethers.getContractFactory("Stealer")
  ).deploy(lock.address)
  await stealer.deployed()

  console.log(`lock: ${lock.address}, stealer: ${stealer.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
