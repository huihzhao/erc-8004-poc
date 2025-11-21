# ERC-8004 POC: Ethereum AI Agent Registration

This project is a Proof of Concept (POC) for **ERC-8004**, a standard for registering AI Agents on the Ethereum blockchain. It demonstrates the core concepts of Agent Identity, Incentivized Validation, Reputation, and Indexing.

## Features

*   **Agent Identity Registry**: ERC-721 contract to register AI Agents with unique IDs and metadata.
*   **Agent Validation Registry**: System for agents to submit tasks with a **validation fee**, paid to validators upon verification.
*   **Agent Reputation Registry**: System to record and retrieve reputation scores and reviews.
*   **Agent Service Registry**: Registry for agents to list their available services/resources.
*   **Indexer (Ponder)**: A local-first indexer that aggregates on-chain events into a queryable GraphQL API.

## Prerequisites

*   **Node.js**: v18 or higher (Recommended: v20 LTS or v22 LTS).
    *   *Note*: Avoid Node.js v25+ due to potential Hardhat compatibility issues.
*   **npm**: Installed with Node.js.
*   **Git**: For cloning the repository.

## Quick Start

Follow these steps to get the entire system (Blockchain + Indexer) running locally.

### 1. Install Dependencies
```bash
npm install
cd ponder && npm install && cd ..
```

### 2. Start Local Blockchain
Open a terminal and start the Hardhat node. This mimics the Ethereum blockchain locally.
```bash
npx hardhat node
```
*Keep this terminal open.*

### 3. Deploy Contracts & Run Demo
Open a **second terminal**. This script deploys all contracts and simulates an agent registration, task submission, and validation flow.
```bash
npx hardhat run scripts/demo.js --network localhost
```
You should see output confirming deployment addresses and the demo flow completion.

### 4. Start the Indexer
Open a **third terminal**. Start Ponder to index the events from your local blockchain.
```bash
cd ponder
npm run dev
```
Ponder will start indexing from block 0. You should see logs indicating it is processing blocks.

### 5. Query the Data
Open your browser to **http://localhost:42069**. This is the GraphQL playground.

Try this query to see the full state of your agents and their history:
```graphql
{
  agents {
    id
    address
    uri
    services {
      id
      metadataURI
      active
    }
    validations {
      taskId
      isValid
      validator
    }
  }
}
```

## The ERC-8004 Workflow

### 1. Registration
Agents mint an NFT ID via `AgentIdentityRegistry`. This establishes their on-chain identity.

### 2. Service Discovery
Agents register their capabilities (services) in the `AgentServiceRegistry`. This allows users to find agents based on what they can do.

### 3. Task Submission (Commitment)
Agents perform work off-chain and submit a **hash** of the result to `AgentValidationRegistry` along with a fee.
*   `submitTask(agentId, taskHash) payable`

### 4. Validation
Validators verify the off-chain work against the committed hash. If correct, they validate it on-chain and claim the fee.
*   `validateTask(taskId, isValid)`

### 5. Reputation
Users leave reviews for agents in `AgentReputationRegistry`, building a trust score over time.

## Project Structure

*   `contracts/`: Solidity smart contracts.
*   `scripts/`: Deployment and demo scripts.
*   `ponder/`: The Ponder indexer project.
    *   `ponder.config.ts`: Network and contract configuration.
    *   `ponder.schema.ts`: Database schema definition.
    *   `src/index.ts`: Event indexing logic.
*   `hardhat.config.js`: Hardhat configuration.

## Troubleshooting

*   **Indexer not picking up events?**
    *   Ensure `ponder.config.ts` has the correct contract addresses. If you restarted the Hardhat node, addresses might have changed (though Hardhat is deterministic, so they usually stay the same if deployment order is constant).
    *   Ensure the Hardhat node is running (`npx hardhat node`).
*   **"Class extends value undefined" error?**
    *   This is a known issue with Node.js v25+. Please downgrade to Node.js v20 or v22.

## License

MIT
