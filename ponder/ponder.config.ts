import { createConfig } from "@ponder/core";
import { http } from "viem";

import AgentIdentityRegistry from "../artifacts/contracts/AgentIdentityRegistry.sol/AgentIdentityRegistry.json";
import AgentServiceRegistry from "../artifacts/contracts/AgentServiceRegistry.sol/AgentServiceRegistry.json";
import AgentValidationRegistry from "../artifacts/contracts/AgentValidationRegistry.sol/AgentValidationRegistry.json";

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
            address: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Default Hardhat address 1
            network: "hardhat",
            startBlock: 0,
        },
        AgentServiceRegistry: {
            abi: AgentServiceRegistry.abi,
            address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", // Default Hardhat address 4 (Check deployment order!)
            network: "hardhat",
            startBlock: 0,
        },
        AgentValidationRegistry: {
            abi: AgentValidationRegistry.abi,
            address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // Default Hardhat address 3
            network: "hardhat",
            startBlock: 0,
        },
    },
});
