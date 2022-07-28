/**
 * @author Rami Majdoub (http://github.com/Rami-Majdoub)
 */

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

// tasks
import { task, types } from "hardhat/config";

task("abi", "prints the ABI of a contract")
  .addParam("contract", "contract path", undefined, types.inputFile, false)
  .setAction(async ({ contract }, { ethers, artifacts }) => {

    // get contract fully qualified name
    const allContracts = await artifacts.getAllFullyQualifiedNames()
    const contractName = allContracts.find((e) => e.startsWith(contract)) || contract
    
    // read contract
    const contractArtifact = await artifacts.readArtifact(contractName)
    const contractFactory = await ethers.getContractFactoryFromArtifact(contractArtifact) as any

    const format = ethers.utils.FormatTypes.full // full minimal json
    const abi = contractFactory.interface.format(format)
    
    console.log(abi);
});

task("deploy", "deploys a contract")
.addParam("contract", "contract path", undefined, types.inputFile, false)
//  .addParam("contract", "contract name") // v0
  .setAction(async ({ contract }, { ethers, artifacts }) => {
    // v1
    // get contract fully qualified name
    const allContracts = await artifacts.getAllFullyQualifiedNames()
    const contractName = allContracts.find((e) => e.startsWith(contract)) || ""
    
    // read contract
    const contractArtifact = await artifacts.readArtifact(contractName)
    const contractFactory = await ethers.getContractFactoryFromArtifact(contractArtifact) as any

    // v0
    //const contractFactory = await ethers.getContractFactory(contract) as any

    // deploy
    const contractDeployed = await contractFactory.deploy()
    
    console.log(`Contract ${contract} deployed at address: `, contractDeployed.address)
});

task("mnemonic", "Prints a new valid mnemonic to use instead of default one")
  .setAction(async (_, { ethers }) => {
    const { mnemonic: { phrase: mnemonicPhrase } } = ethers.Wallet.createRandom()
    console.log(mnemonicPhrase);
  }
)

// if config.networks.hardhat.accounts is set
// the private keys are not shown by the hardhat node
task("hardhat-account-infos", "Prints more informations about the accounts used by hardhat",
  async ( _, hre) => {
    const { accounts } = hre.config.networks.hardhat;
    await hre.run("account-info", accounts)
});

// general use purpose
// you have a mnemonic and you want to get the accounts infos
task("account-info", "Prints the accounts informations from a mnemonic")
  .addParam("mnemonic", "should be valid")
  .addOptionalParam("count", "number of addresses to print", 20, types.int)
  .addOptionalParam("path", "", "m/44'/60'/0'/0/")
  .addOptionalParam("initialIndex", "first account index", 0, types.int)
  .setAction(async ({ mnemonic, count, path, initialIndex, passphrase }, { ethers } ) => {
    
    Array(count).fill(0).map((_, i) => {
      const PATH = path + (i + initialIndex).toString()
      const wallet = ethers.Wallet.fromMnemonic(mnemonic, PATH)

      console.log("Mnemonic: ", wallet.mnemonic.phrase);
      console.log("Address: ", wallet.address);
      console.log("privateKey: ", wallet.privateKey);
      console.log("publicKey: ", wallet.publicKey);
      console.log("----------")
    })
  })

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: process.env.API_KEY_PROVIDER_RINKEBY,
      accounts: [ process.env.ACCOUNT_PRIVATE_KEY || "" ]
    },
    // used by hardhat test & node
    // when using hardhat node deploy with option --network localhost
    hardhat: {
      chainId: 1337, // fixes metamask (default 31337)
      accounts: { // don't use public accounts
        mnemonic: process.env.MNEMONIC_FOR_LOCAL_DEV,
        count: 10,
       },
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.API_KEY_ETHERSCAN,
  }
};

export default config;
