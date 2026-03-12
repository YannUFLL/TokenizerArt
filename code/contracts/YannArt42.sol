// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC721} from "./IERC721.sol";
import {IERC165} from "./IERC165.sol";
import {IERC721Receiver} from "./IERC721Receiver.sol";
import {IERC721Metadata} from "./IERC721Metadata.sol";

contract YannArt42 is IERC721, IERC721Metadata {

    string private constant NAME = "YannArt42";
    string private constant SYMBOL = "YA42";

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    error NotTokenOwner(address caller, uint256 tokenId);
    error NonexistentToken(uint256 tokenId);
    error TransferFromZeroAddress();
    error TransferToZeroAddress();
    error CallerNotOwnerOrApproved(address caller, uint256 tokenId);
    error NoNFTSupport();
    error InvalidZeroAddress();

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping (address => bool)) private _operatorApprovals;
    mapping(uint256 => string) private _tokenURIs;

    string private _baseURI;
    uint256 private _nextTokenId;
    address private _contractOwner;

    modifier onlyOwner() {
        require(msg.sender == _contractOwner);
        _;
    }

    constructor() {
        _contractOwner = msg.sender;
    }

    function name() external pure returns (string memory){
        return NAME;
    }

    function symbol() external pure returns (string memory) {
        return SYMBOL;
    }

    function TransferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) {
            revert TransferToZeroAddress();
        }
        emit OwnershipTransferred(_contractOwner, newOwner);
        _contractOwner = newOwner;
    }

    function tokenURI(uint256 tokenId) external view returns (string memory){
        address current_owner = _owners[tokenId];
        if (current_owner == address(0)) {
            revert NonexistentToken(tokenId);
        }
        string storage uri = _tokenURIs[tokenId];
        return string.concat(_baseURI, uri);
    }

    function mint(address to, string calldata uri) onlyOwner external {
        if (to == address(0)) 
            revert InvalidZeroAddress();
        _owners[_nextTokenId] = to;
        _balances[to] += 1;
        _tokenURIs[_nextTokenId] = uri;
        emit Transfer(address(0), to, _nextTokenId);
        _nextTokenId++;
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseURI = newBaseURI;
    }

    function balanceOf(address owner) external view returns (uint256 balance) {
        return (_balances[owner]);
    }

    function ownerOf(uint256 tokenId) external view returns (address owner) {
        address current_owner = _owners[tokenId];
        if (current_owner == address(0)) {
            revert NonexistentToken(tokenId);
        }
        return current_owner;
    }    

    function _checkTransferAllowed(address from, address to, uint256 tokenId) internal view {
        if (from == address(0)) {
            revert TransferFromZeroAddress();
        }
        if (to == address(0)) {
            revert TransferToZeroAddress();
        }
        address owner = _owners[tokenId];
        if (owner == address(0)) {
            revert NonexistentToken(tokenId);
        }
        if (owner != from) {
            revert NotTokenOwner(from, tokenId);
        }
        if (msg.sender != from)
        {
            if (_operatorApprovals[from][msg.sender] != true 
            && _tokenApprovals[tokenId] != msg.sender) {
                revert CallerNotOwnerOrApproved(msg.sender, tokenId);
            }
        }
    }

    function _transfer(address from, address to, uint256 tokenId) internal {
        _owners[tokenId] = to;
        delete _tokenApprovals[tokenId];
        _balances[from] -= 1;
        _balances[to] += 1;
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external {
        _checkTransferAllowed(from, to, tokenId);
        _transfer(from, to, tokenId);
        emit Transfer(from, to, tokenId);
        if (to.code.length > 0)
        {
            try 
                IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) returns (bytes4 hash) {
                    require (hash == IERC721Receiver.onERC721Received.selector);
                }
             catch {
                revert NoNFTSupport();
             }
        }
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        _checkTransferAllowed(from, to, tokenId);
        _transfer(from, to, tokenId);
        emit Transfer(from, to, tokenId);
        if (to.code.length > 0)
        {
            try 
                IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, "") returns (bytes4 hash) {
                    require (hash == IERC721Receiver.onERC721Received.selector);
                }
             catch {
                revert NoNFTSupport();
             }
        }
    }

    function approve(address to, uint256 tokenId) external {
        address owner = _owners[tokenId];
        if (owner == address(0)) {
            revert NonexistentToken(tokenId);
        }
        if (owner !=  msg.sender  && _operatorApprovals[owner][msg.sender] != true) {
            revert CallerNotOwnerOrApproved(msg.sender, tokenId);
        }
        _tokenApprovals[tokenId] = to;
        emit Approval(msg.sender, to, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) external {
        _checkTransferAllowed(from, to, tokenId);
        _transfer(from, to, tokenId);
        emit Transfer(from, to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) external {
        if (operator == address(0)) {
            revert InvalidZeroAddress();
        }
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function getApproved(uint256 tokenId) external view returns (address operator) {
        address owner = _owners[tokenId];
        if (owner == address(0)) {
            revert NonexistentToken(tokenId);
        }
        return _tokenApprovals[tokenId];
    }

    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return (_operatorApprovals[owner][operator]);
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return type(IERC721).interfaceId == interfaceId ||
               type(IERC165).interfaceId == interfaceId ||
               type(IERC721Metadata).interfaceId == interfaceId;
    }

}