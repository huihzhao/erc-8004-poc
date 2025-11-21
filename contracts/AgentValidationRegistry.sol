// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentValidationRegistry is Ownable {
    struct Task {
        uint256 agentId;
        bytes32 taskHash;
        address validator;
        bool isValidated;
        bool isValid;
        uint256 timestamp;
        uint256 validationFee;
        bool isDisputed;
    }

    uint256 private _nextTaskId;
    mapping(uint256 => Task) public tasks;
    address public juryRegistry;

    event TaskSubmitted(uint256 indexed taskId, uint256 indexed agentId, bytes32 taskHash, uint256 fee);
    event TaskValidated(uint256 indexed taskId, address indexed validator, bool isValid);
    event DisputeResolved(uint256 indexed taskId, bool ruling);

    constructor() Ownable(msg.sender) {}

    function setJuryRegistry(address _juryRegistry) external onlyOwner {
        juryRegistry = _juryRegistry;
    }

    function submitTask(uint256 agentId, bytes32 taskHash) public payable returns (uint256) {
        uint256 taskId = ++_nextTaskId;
        
        tasks[taskId] = Task({
            agentId: agentId,
            taskHash: taskHash,
            validator: address(0),
            isValidated: false,
            isValid: false,
            timestamp: block.timestamp,
            validationFee: msg.value,
            isDisputed: false
        });

        emit TaskSubmitted(taskId, agentId, taskHash, msg.value);
        return taskId;
    }

    function validateTask(uint256 taskId, bool isValid) public {
        Task storage task = tasks[taskId];
        require(!task.isValidated, "Task already validated");
        require(!task.isDisputed, "Task is disputed");
        
        task.validator = msg.sender;
        task.isValidated = true;
        task.isValid = isValid;

        if (task.validationFee > 0) {
            payable(msg.sender).transfer(task.validationFee);
        }

        emit TaskValidated(taskId, msg.sender, isValid);
    }

    function resolveDispute(uint256 taskId, bool ruling) external {
        require(msg.sender == juryRegistry, "Only jury registry");
        Task storage task = tasks[taskId];
        
        task.isValidated = true;
        task.isValid = ruling;
        task.isDisputed = false; // Resolved
        
        // If ruling is TRUE (Valid), agent wins. If FALSE (Invalid), agent loses.
        // In a real system, we'd handle fee distribution here (e.g. give to challenger or agent)
        
        if (ruling == false) {
            // Agent lost. Send validationFee to JuryRegistry for distribution.
            payable(juryRegistry).transfer(task.validationFee);
        }
        // If ruling == true, the fee remains here (or could be unlocked for agent withdrawal)
        
        emit DisputeResolved(taskId, ruling);
    }

    function getTask(uint256 taskId) public view returns (Task memory) {
        return tasks[taskId];
    }
}
