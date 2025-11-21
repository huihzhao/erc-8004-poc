// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentReputationRegistry is Ownable {
    struct Review {
        address reviewer;
        uint8 score; // 0-100
        string comment;
        uint256 timestamp;
    }

    // Mapping from Agent Token ID to list of reviews
    mapping(uint256 => Review[]) public agentReviews;

    event ReputationAdded(uint256 indexed agentId, address indexed reviewer, uint8 score);

    constructor() Ownable(msg.sender) {}

    function addReputation(uint256 agentId, uint8 score, string memory comment) public {
        require(score <= 100, "Score must be between 0 and 100");
        
        Review memory newReview = Review({
            reviewer: msg.sender,
            score: score,
            comment: comment,
            timestamp: block.timestamp
        });

        agentReviews[agentId].push(newReview);

        emit ReputationAdded(agentId, msg.sender, score);
    }

    function getReputation(uint256 agentId) public view returns (Review[] memory) {
        return agentReviews[agentId];
    }

    function getAverageScore(uint256 agentId) public view returns (uint256) {
        Review[] memory reviews = agentReviews[agentId];
        if (reviews.length == 0) return 0;

        uint256 totalScore = 0;
        for (uint256 i = 0; i < reviews.length; i++) {
            totalScore += reviews[i].score;
        }

        return totalScore / reviews.length;
    }
}
