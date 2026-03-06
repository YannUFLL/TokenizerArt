// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC721} from "./IERC721.sol";
import {IERC165} from "./IERC165.sol";
import {IERC721Receiver} from "./IERC721Receiver.sol";

contract YannArt42 is IERC721 {

    mapping(uint256 => address) _owners;
    mapping(address => uint256) _balances;
    mapping(uint256 => address) _approval;
    mapping(address => mapping (address => bool)) _approvalsAll;

    function balanceOf(address owner) external view returns (uint256 balance) {
        return (_balances[owner]);
    }

    function ownerOf(uint256 tokenId) external view returns (address owner) {
        address current_owner = _owners[tokenId];
        require(current_owner != address(0), "This token doesn't exist");
        return current_owner;
    }    

    function _checkTransferAllowed(address from, address to, uint256 tokenId) internal view {
        require(from != address(0), "from adress can't be 0");
        require(to != address(0), "to adress can't be 0");
        address owner = _owners[tokenId];
        require(owner != address(0), "This token doesn't exist");
        require(owner == from, "You are not the propritary of the token");
        if (msg.sender != from)
        {
            require((_approvalsAll[from][msg.sender] == true 
            || _approval[tokenId] == msg.sender), 
            "You're not allowed to move this token");
        }
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external
    {
        _checkTransferAllowed(from, to, tokenId);
        _owners[tokenId] = to;
        delete _approval[tokenId];
        if (to.code.length > 0)
        {
            try 
                IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) returns (bytes4 hash) {
                    require (hash == IERC721Receiver.onERC721Received.selector);
                }
             catch {
                revert("SmartContract doesn't handle nft");
             }
        }
        emit Transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external
    {
        _checkTransferAllowed(from, to, tokenId);
        _owners[tokenId] = to;
        delete _approval[tokenId];
        if (to.code.length > 0)
        {
            try 
                IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, "") returns (bytes4 hash) {
                    require (hash == IERC721Receiver.onERC721Received.selector);
                }
             catch {
                revert("SmartContract doesn't handle nft");
             }
        }
        emit Transfer(from, to, tokenId);
    }

    function approve(address to, uint256 tokenId) external {
        address owner = _owners[tokenId];
        require(owner != address(0), "This token doesn't exist");
        require(owner == msg.sender, "You are not the proprietary of the token");
        _approval[tokenId] = to;
        emit Approval(msg.sender, to, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) external {
        _checkTransferAllowed(from, to, tokenId);
        _owners[tokenId] = to;
        delete _approval[tokenId];
        emit Transfer(from, to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) external {
        require(operator != address(0), "to adress can't be 0");
        _approvalsAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function getApproved(uint256 tokenId) external view returns (address operator)
    {
        address owner = _owners[tokenId];
        require(owner != address(0), "This token doesn't exist");
        return _approval[tokenId];
    }

    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return (_approvalsAll[owner][operator]);
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return type(IERC721).interfaceId == interfaceId ||
               type(IERC165).interfaceId == interfaceId;
    }

    }