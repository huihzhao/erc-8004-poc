// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IAgentValidationRegistry {
    function resolveDispute(uint256 taskId, bool ruling) external;
}

contract AgentJuryRegistry is Ownable {
    struct Juror {
        uint256 stakedAmount;
        bool isRegistered;
    }

    struct Dispute {
        uint256 taskId;
        address challenger;
        uint256 disputeFee;
        uint256 votesFor; // Votes for "Valid"
        uint256 votesAgainst; // Votes for "Invalid"
        address[] votersFor;
        address[] votersAgainst;
        bool resolved;
        bool ruling; // Final ruling: true = Valid, false = Invalid
        mapping(address => bool) hasVoted;
    }

    mapping(address => Juror) public jurors;
    mapping(uint256 => Dispute) public disputes; // disputeId -> Dispute
    uint256 public nextDisputeId;
    
    address public validationRegistry;
    uint256 public minStake = 0.1 ether;

    event JurorRegistered(address indexed juror, uint256 stakedAmount);
    event DisputeCreated(uint256 indexed disputeId, uint256 indexed taskId, address indexed challenger);
    event VoteCast(uint256 indexed disputeId, address indexed juror, bool support);
    event RulingExecuted(uint256 indexed disputeId, bool ruling, uint256 rewardPerJuror);

    constructor() Ownable(msg.sender) {}

    // Allow contract to receive ETH (from ValidationRegistry slashing)
    receive() external payable {}

    function setValidationRegistry(address _validationRegistry) external onlyOwner {
        validationRegistry = _validationRegistry;
    }

    function registerJuror() external payable {
        require(msg.value >= minStake, "Insufficient stake");
        require(!jurors[msg.sender].isRegistered, "Already registered");

        jurors[msg.sender] = Juror({
            stakedAmount: msg.value,
            isRegistered: true
        });

        emit JurorRegistered(msg.sender, msg.value);
    }

    function createDispute(uint256 taskId) external payable returns (uint256) {
        // In a real system, we'd check if the task exists and is in the challenge period
        // For POC, we assume the caller knows what they are doing or the ValidationRegistry handles checks
        
        uint256 disputeId = ++nextDisputeId;
        Dispute storage dispute = disputes[disputeId];
        dispute.taskId = taskId;
        dispute.challenger = msg.sender;
        dispute.disputeFee = msg.value;
        
        emit DisputeCreated(disputeId, taskId, msg.sender);
        return disputeId;
    }

    function vote(uint256 disputeId, bool support) external {
        require(jurors[msg.sender].isRegistered, "Not a juror");
        Dispute storage dispute = disputes[disputeId];
        require(!dispute.resolved, "Dispute already resolved");
        require(!dispute.hasVoted[msg.sender], "Already voted");

        dispute.hasVoted[msg.sender] = true;
        
        if (support) {
            dispute.votesFor++;
            dispute.votersFor.push(msg.sender);
        } else {
            dispute.votesAgainst++;
            dispute.votersAgainst.push(msg.sender);
        }

        emit VoteCast(disputeId, msg.sender, support);
    }

    function executeRuling(uint256 disputeId) external {
        Dispute storage dispute = disputes[disputeId];
        require(!dispute.resolved, "Dispute already resolved");

        bool ruling = dispute.votesFor > dispute.votesAgainst;
        dispute.ruling = ruling;
        dispute.resolved = true;

        // Call back to ValidationRegistry to finalize
        // If ruling is FALSE (Invalid), ValidationRegistry should send the Agent's fee here
        if (validationRegistry != address(0)) {
            IAgentValidationRegistry(validationRegistry).resolveDispute(dispute.taskId, ruling);
        }

        uint256 totalPot = dispute.disputeFee + address(this).balance; // Simplified: assumes balance is only from this dispute context
        // In a real contract, we would track balances per dispute or use return values
        
        uint256 rewardPerJuror = 0;

        if (ruling) {
            // Agent WON (Valid)
            // Challenger loses disputeFee.
            // Jurors who voted TRUE share the disputeFee.
            if (dispute.votesFor > 0) {
                rewardPerJuror = dispute.disputeFee / dispute.votesFor;
                for (uint256 i = 0; i < dispute.votersFor.length; i++) {
                    payable(dispute.votersFor[i]).transfer(rewardPerJuror);
                }
            }
            // Agent gets their fee back (handled in ValidationRegistry)
        } else {
            // Agent LOST (Invalid)
            // Agent's fee was sent here.
            // Challenger gets their fee back + reward (e.g. half of agent's fee).
            // Jurors who voted FALSE share the rest.
            
            uint256 agentFee = address(this).balance - dispute.disputeFee; // The amount sent by ValidationRegistry
            
            // 1. Refund Challenger
            payable(dispute.challenger).transfer(dispute.disputeFee);
            
            // 2. Reward Challenger (e.g. 50% of Agent's fee)
            uint256 challengerReward = agentFee / 2;
            payable(dispute.challenger).transfer(challengerReward);
            
            // 3. Reward Jurors (Remaining 50%)
            uint256 jurorPot = agentFee - challengerReward;
            if (dispute.votesAgainst > 0) {
                rewardPerJuror = jurorPot / dispute.votesAgainst;
                for (uint256 i = 0; i < dispute.votersAgainst.length; i++) {
                    payable(dispute.votersAgainst[i]).transfer(rewardPerJuror);
                }
            }
        }

        emit RulingExecuted(disputeId, ruling, rewardPerJuror);
    }
}
