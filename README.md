# Vulnerable Smart Contracts

```shell
# local
npx hardhat test

# deploy to goerli
npx hardhat run scripts/deploy.ts --network goerli

# lock address: <LOCK_ADDRESS>
# stealer address: <STEALER_ADDRESS>

npx hardhat verify <LOCK_ADDRESS> --network goerli --contract contracts/Lock.sol:Lock

npx hardhat verify <STEALER_ADDRESS> --network goerli --contract contracts/Stealer.sol:Stealer <LOCK_ADDRESS>

```
