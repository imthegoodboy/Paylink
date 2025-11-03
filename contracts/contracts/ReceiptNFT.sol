// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ReceiptNFT
 * @notice Minimal ERC721 for payment receipt tokens. Token URIs point to IPFS JSON.
 */
contract ReceiptNFT is ERC721, Ownable {
    using Strings for uint256;

    string public baseURI;
    uint256 public nextTokenId = 1;

    constructor(string memory name_, string memory symbol_, string memory baseURI_, address initialOwner)
        ERC721(name_, symbol_)
        Ownable(initialOwner)
    {
        baseURI = baseURI_;
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
    }

    function mint(address to) external onlyOwner returns (uint256 tokenId) {
        tokenId = nextTokenId++;
        _mint(to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "NOT_MINTED");
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }
}


