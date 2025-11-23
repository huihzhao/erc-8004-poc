import { createConfig } from "@ponder/core";
import { http } from "viem";

import AgentIdentityRegistry from "../artifacts/contracts/AgentIdentityRegistry.sol/AgentIdentityRegistry.json";
import AgentServiceRegistry from "../artifacts/contracts/AgentServiceRegistry.sol/AgentServiceRegistry.json";
import AgentValidationRegistry from "../artifacts/contracts/AgentValidationRegistry.sol/AgentValidationRegistry.json";
import AgentJuryRegistry from "../artifacts/contracts/AgentJuryRegistry.sol/AgentJuryRegistry.json";

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
            address: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
            network: "hardhat",
            startBlock: 0,
        },
        AgentServiceRegistry: {
            abi: AgentServiceRegistry.abi,
            address: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
            network: "hardhat",
            startBlock: 0,
        },
        AgentValidationRegistry: {
            abi: AgentValidationRegistry.abi,
            address: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
            network: "hardhat",
            startBlock: 0,
        },
        AgentJuryRegistry: {
            abi: AgentJuryRegistry.abi,
            address: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
            network: "hardhat",
            startBlock: 0,
        },
    },
});
