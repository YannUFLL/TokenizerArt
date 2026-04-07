# Documentation

## Technical choices

### Blockchain: Ethereum (Sepolia testnet)

Ethereum is the pioneering and most **renowned blockchain** for smart contract deployment. Consequently, there is a vast amount of documentation and community support available.

Furthermore, Ethereum uses Solidity for smart contract development, which is generally more **accessible and easier** to learn than languages like Rust (used by Solana).

Ethereum also offers one of the most proven and reliable networks, being **fully decentralized**.

While it can be **slower or more expensive** for NFT transfers compared to alternatives like Solana, its security and ecosystem remain unmatched for a project like this.

### Development tools: Hardhat

Hardhat is a powerful smart contract deployment framework that provides useful features such as local node testing with test accounts, Solidity compilation, smart deployment tools (Ignition), and test/script functionalities, all integrated in a seamless and configurable environment.

### Storage: IPFS

Because on-chain storage on Ethereum is prohibitively expensive, our objective is to minimize the amount of data stored directly on the blockchain. Storing a high-resolution image on-chain would lead to exorbitant gas costs. Instead, we use an external file system and a CID (Content Identifier), which is generated when a file is published to IPFS.

IPFS (InterPlanetary File System) is a decentralized file system that uses peer-to-peer technology to distribute files globally. The two main advantages of IPFS are **immutability**, because the CID is generated directly from the image data, and **persistence**, because the data remains available as long as it is pinned by at least one node in the network.

This CID stored in the smart contract does not point directly to the image file. To ensure compatibility with marketplaces and external tools, it points to a metadata JSON file. This file follows the ERC721 Metadata Standard, acting as a bridge that provides the image URI.

#### The 3-step linkage

1. **On-chain (Ethereum): The pointer**  
    The smart contract stores a **tokenURI** for each NFT. This is a unique **IPFS CID**.  
    *Example:* `QmXasf...`
2. **Off-chain (IPFS): The metadata JSON**  
    The CID points to a `metadata.json` file. This file acts as the "ID card" of the NFT and can contain the base attributes defined in ERC721, such as name, description, and the **image link**. Some public platforms like OpenSea enrich metadata files with properties like traits and rarity levels.
3. **Off-chain (IPFS): The visual asset**  
    The final link leads to the high-resolution image (`.png` or `.jpg`).


## ERC721 Specification

This specification provides a common interface across all NFTs, allowing wallets and marketplaces to work natively with any ERC721 token without further configuration once the token is deployed.

Below is part of the ERC721 interface:

```solidity
event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
```

Events are emitted during specific actions, allowing external tools to monitor and index transactions.

```solidity
function balanceOf(address owner) external view returns (uint256 balance);
```

Returns the number of tokens owned by an address.

```solidity
function ownerOf(uint256 tokenId) external view returns (address owner);
```

Returns the owner of a token.

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
```

Transfers a token to the specified address. When a token is transferred to a smart contract (and not a user), the receiving contract must implement the appropriate interface to confirm ERC721 compatibility. `data` is forwarded with the call.

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) external;
```

Overloaded version of the above, but without additional data.

```solidity
function transferFrom(address from, address to, uint256 tokenId) external;
```

Transfers a token without checking whether the receiver contract is compatible with the ERC721 standard.

```solidity
function approve(address to, uint256 tokenId) external;
```

Allows one address to manage the transfer of a token on behalf of the owner.

```solidity
function setApprovalForAll(address operator, bool approved) external;
```

Enables or disables an operator to manage all tokens of the caller.

```solidity
function getApproved(uint256 tokenId) external view returns (address operator);
```

Returns the address approved for this specific token.

```solidity
function isApprovedForAll(address owner, address operator) external view returns (bool);
```

Returns `true` if an address is an operator for all NFTs of the owner; otherwise returns `false`.

## Twingo42 Contract API

### Contract Address
- **Network**: Ethereum Sepolia Testnet
- **Address**: `0xE644D6ca5437E74b4e2a444b6e980132695A9033`

### Public Functions

```solidity
function nextTokenId() external view returns (uint256);
```
Returns the next token ID to be minted.

```solidity
function name() external pure returns (string memory);
```
Returns the token collection name: "Twingo42".

```solidity
function symbol() external pure returns (string memory);
```
Returns the token collection symbol: "T42".

```solidity
function mint(address to, string calldata uri) external onlyOwner;
```
Mints a new NFT to the specified address. Only callable by the contract owner.

```solidity
function tokenURI(uint256 tokenId) external view returns (string memory);
```
Returns the metadata URI (IPFS CID) for a specific token.

```solidity
function ownerOf(uint256 tokenId) external view returns (address owner);
```
Returns the owner of a specific token.

```solidity
function balanceOf(address owner) external view returns (uint256 balance);
```
Returns the number of NFTs owned by an address.

```solidity
function setBaseURI(string calldata newBaseURI) external onlyOwner;
```
Updates the base URI for all tokens. Only callable by the contract owner.

```solidity
function TransferOwnership(address newOwner) external onlyOwner;
```
Transfers contract ownership to a new address.

## How to Use the NFT

### Prerequisites
1. A Web3 wallet (MetaMask, Rabby, etc.)
2. Sepolia ETH for gas fees
3. Connect to Sepolia network

### Viewing Your NFT
1. Open a blockchain explorer like [Etherscan](https://sepolia.etherscan.io/)
2. Enter the contract address: `0xE644D6ca5437E74b4e2a444b6e980132695A9033`
3. Navigate to the "Contract" tab to read/write the contract

### Checking Ownership
Use the `ownerOf` function on Etherscan:
1. Go to the contract page
2. Click "Read Contract"
3. Find "ownerOf" and enter a token ID
4. The function returns the wallet address owning that NFT

### Minting Process
The minting is managed by the contract owner. To mint a new NFT:
1. Connect to the admin panel (see README)
2. Generate an NFT using AI or upload your own image
3. The system uploads the image and metadata to IPFS
4. The contract owner calls the `mint` function with the recipient address and IPFS URI

### Metadata Structure
Each NFT follows the ERC721 Metadata standard:
```json
{
  "name": "42 Twingo #001",
  "description": "Description of the NFT",
  "artist": "ydumaine",
  "image": "ipfs://<image_cid>",
  "attributes": [
    { "trait_type": "Background", "value": "..." },
    { "trait_type": "Decals", "value": "..." }
  ]
}
```

## Security Features
- **OnlyOwner Modifier**: Minting and administrative functions are restricted to the contract owner
- **Input Validation**: All functions check for zero addresses and non-existent tokens
- **Approval System**: Token owners can approve specific addresses or operators to transfer their NFTs 