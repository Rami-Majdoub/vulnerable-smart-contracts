# Vulnerable Smart Contracts

```shell
# local
npx hardhat test

# deploy to rinkeby
npx hardhat run scripts/deploy.ts --network rinkeby

npx hardhat verify 0x1EE4AA2Ad03B759F5a72869dD032aC32Ed4007ae --network rinkeby --contract contracts/Lock.sol:Lock

npx hardhat verify 0x6C937577f8FDB6804908738E165AEf5B60bd513b --network rinkeby --contract contracts/Stealer.sol:Stealer 0x1EE4AA2Ad03B759F5a72869dD032aC32Ed4007ae

```
