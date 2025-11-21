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
    }

    uint256 private _nextTaskId;
    mapping(uint256 => Task) public tasks;

    event TaskSubmitted(uint256 indexed taskId, uint256 indexed agentId, bytes32 taskHash, uint256 fee);
    event TaskValidated(uint256 indexed taskId, address indexed validator, bool isValid);

    constructor() Ownable(msg.sender) {}

    function submitTask(uint256 agentId, bytes32 taskHash) public payable returns (uint256) {
        uint256 taskId = ++_nextTaskId;
        
        tasks[taskId] = Task({
            agentId: agentId,
            taskHash: taskHash,
            validator: address(0),
            isValidated: false,
            isValid: false,
            timestamp: block.timestamp,
            validationFee: msg.value
        });

        emit TaskSubmitted(taskId, agentId, taskHash, msg.value);
        return taskId;
    }

    function validateTask(uint256 taskId, bool isValid) public {
        Task storage task = tasks[taskId];
        require(!task.isValidated, "Task already validated");
        
        task.validator = msg.sender;
        task.isValidated = true;
        task.isValid = isValid;

        if (task.validationFee > 0) {
            payable(msg.sender).transfer(task.validationFee);
        }

        emit TaskValidated(taskId, msg.sender, isValid);
    }

    function getTask(uint256 taskId) public view returns (Task memory) {
        return tasks[taskId];
    }
}
