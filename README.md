# TokenizerART

TokenizerArt is a 42 School NFT project. An NFT, or **"non-fungible token"**, differs from standard tokens because each unit is unique and not interchangeable. While fungible tokens (like ERC20) have identical values, each NFT handled by this smart contract is distinct. The project uses the Ethereum blockchain and implements the **ERC721 specification** to manage these unique digital assets.


## Prerequisites

- Node.js 22+

## Deployment

The project is set up to use the Sepolia network and the Infura node provider.

1. `git clone git@github.com:YannUFLL/TokenizerArt.git`
2. `cd code && npm install`
3. Set the required variables:
    - `npx hardhat vars set OWNER_PRIVATE_KEY`
    - `npx hardhat vars set ETHERSCAN_API_KEY`
    - `npx hardhat vars set INFURA_API_KEY`
4. `npx hardhat compile`
5. `npx hardhat ignition deploy ignition/modules/YannArt42.ts --network [sepolia/localhost] [--verify]`

or used the deployement.sh script

