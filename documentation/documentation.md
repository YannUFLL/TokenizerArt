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

## YannArt42 api Layer

contract.nextTokenID();

## Minting: 

the minting is generate by the owner of the contract, it is his responsibilty to generate all the 