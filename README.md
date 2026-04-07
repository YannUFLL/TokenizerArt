# TokenizerArt

TokenizerArt is a 42 School NFT project. Unlike fungible tokens (such as ERC-20) where every unit is identical, each NFT handled by this contract is unique and non-interchangeable. The project is built on the Ethereum blockchain and implements the **ERC-721 specification** to manage these distinct digital assets.

## Prerequisites

### Smart Contract Deployment
- **Node.js 22+**
- **A private wallet** (with Sepolia ETH for gas)
- **An Infura or Alchemy API Key** (for Sepolia network access)
- **An Etherscan API Key** (to verify the contract source code)

### Administration & Web App
- **An IPFS Access Point** (e.g., Pinata API Key & Secret)
- **A Gemini API Key** (for AI-powered features)


## Deployment

The project is configured for the **Sepolia testnet** using Infura, though any provider can be used. 

To deploy the smart contract, navigate to the `deployment` folder and run:

1. `chmod +x deployment.sh` (if needed)
2. `./deployment.sh`

## Usage

This project includes a web application to simplify interactions with the smart contract.

To use the **admin panel**, navigate to `deployment/admin-panel`, configure your `.env` file, and run:

1. `npm install`
2. `npm run dev`