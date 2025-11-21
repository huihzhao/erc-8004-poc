// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentIdentityRegistry is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    struct AgentInfo {
        address agentAddress;
        uint256 tokenId;
    }

    mapping(uint256 => address) public agentAddresses;
    mapping(address => uint256) public addressToTokenId;

    event AgentRegistered(uint256 indexed tokenId, address indexed agentAddress, string uri);

    constructor() ERC721("AgentIdentity", "AGID") Ownable(msg.sender) {}

    function registerAgent(address agentAddress, string memory uri) public onlyOwner returns (uint256) {
        require(addressToTokenId[agentAddress] == 0, "Agent already registered");
        
        uint256 tokenId = ++_nextTokenId;
        _mint(agentAddress, tokenId);
        _setTokenURI(tokenId, uri);

        agentAddresses[tokenId] = agentAddress;
        addressToTokenId[agentAddress] = tokenId;

        emit AgentRegistered(tokenId, agentAddress, uri);

        return tokenId;
    }

    function getAgentAddress(uint256 tokenId) public view returns (address) {
        return agentAddresses[tokenId];
    }

    function getAgentTokenId(address agentAddress) public view returns (uint256) {
        return addressToTokenId[agentAddress];
    }
}
