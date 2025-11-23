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
            address: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
            network: "hardhat",
            startBlock: 0,
        },
        AgentServiceRegistry: {
            abi: AgentServiceRegistry.abi,
            address: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
            network: "hardhat",
            startBlock: 0,
        },
        AgentValidationRegistry: {
            abi: AgentValidationRegistry.abi,
            address: "0x0B306BF915C4d645ff596e518fAf3F9669b97016",
            network: "hardhat",
            startBlock: 0,
        },
        AgentJuryRegistry: {
            abi: AgentJuryRegistry.abi,
            address: "0x0165878A594ca255338adfa4d48449f69242Eb8F", // Keeping old address for now as it wasn't deployed in demo.js
            network: "hardhat",
            startBlock: 0,
        },
    },
});
