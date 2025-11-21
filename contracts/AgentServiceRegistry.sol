// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentServiceRegistry is Ownable {
    struct Service {
        string serviceId;
        string metadataURI;
        bool active;
    }

    // Mapping from Agent Token ID -> Service ID -> Service
    mapping(uint256 => mapping(string => Service)) public agentServices;
    // Mapping from Agent Token ID -> List of Service IDs
    mapping(uint256 => string[]) public agentServiceIds;

    event ServiceRegistered(uint256 indexed agentId, string indexed serviceId, string metadataURI);
    event ServiceUpdated(uint256 indexed agentId, string indexed serviceId, string metadataURI);
    event ServiceDeactivated(uint256 indexed agentId, string indexed serviceId);

    constructor() Ownable(msg.sender) {}

    function registerService(uint256 agentId, string memory serviceId, string memory metadataURI) public {
        // In a real implementation, we would check if msg.sender is the owner of the agentId
        // For this POC, we'll assume the caller is authorized or just allow it for simplicity
        // Ideally: require(agentIdentityRegistry.ownerOf(agentId) == msg.sender, "Not agent owner");
        
        Service storage service = agentServices[agentId][serviceId];
        require(bytes(service.serviceId).length == 0, "Service already exists");

        service.serviceId = serviceId;
        service.metadataURI = metadataURI;
        service.active = true;
        
        agentServiceIds[agentId].push(serviceId);

        emit ServiceRegistered(agentId, serviceId, metadataURI);
    }

    function updateService(uint256 agentId, string memory serviceId, string memory metadataURI) public {
        Service storage service = agentServices[agentId][serviceId];
        require(bytes(service.serviceId).length > 0, "Service does not exist");
        
        service.metadataURI = metadataURI;
        
        emit ServiceUpdated(agentId, serviceId, metadataURI);
    }
    
    function deactivateService(uint256 agentId, string memory serviceId) public {
        Service storage service = agentServices[agentId][serviceId];
        require(bytes(service.serviceId).length > 0, "Service does not exist");
        
        service.active = false;
        
        emit ServiceDeactivated(agentId, serviceId);
    }

    function getAgentServices(uint256 agentId) public view returns (string[] memory) {
        return agentServiceIds[agentId];
    }
    
    function getService(uint256 agentId, string memory serviceId) public view returns (Service memory) {
        return agentServices[agentId][serviceId];
    }
}
