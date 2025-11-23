import { createConfig } from "@ponder/core";
import { http } from "viem";

import AgentIdentityRegistry from "../artifacts/contracts/AgentIdentityRegistry.sol/AgentIdentityRegistry.json";
import AgentServiceRegistry from "../artifacts/contracts/AgentServiceRegistry.sol/AgentServiceRegistry.json";
import AgentValidationRegistry from "../artifacts/contracts/AgentValidationRegistry.sol/AgentValidationRegistry.json";
import AgentJuryRegistry from "../artifacts/contracts/AgentJuryRegistry.sol/AgentJuryRegistry.json";
import AgentReputationRegistry from "../artifacts/contracts/AgentReputationRegistry.sol/AgentReputationRegistry.json";

export default createConfig({
    networks: {
        hardhat: {
            chainId: 31337,
            transport: http("http://127.0.0.1:8545"),
        },
    },
    contracts: {
        AgentIdentityRegistry: {
            abi: AgentIdentityRegistry.abi,
            address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
            network: "hardhat",
            startBlock: 0,
        },
        AgentReputationRegistry: {
            abi: AgentReputationRegistry.abi,
            address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            network: "hardhat",
            startBlock: 0,
        },
        AgentServiceRegistry: {
            abi: AgentServiceRegistry.abi,
            address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
            network: "hardhat",
            startBlock: 0,
        },
        AgentValidationRegistry: {
            abi: AgentValidationRegistry.abi,
            address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            network: "hardhat",
            startBlock: 0,
        },
        AgentJuryRegistry: {
            abi: AgentJuryRegistry.abi,
            address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
            network: "hardhat",
            startBlock: 0,
        },
    },
});
