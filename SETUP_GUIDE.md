# Local Environment Setup Guide

This document explains how the local development environment for the ERC-8004 POC was established and configured.

## 1. Project Initialization
The project was initialized as a standard Node.js project:
```bash
npm init -y
```

## 2. Hardhat Framework
We chose **Hardhat** as the Ethereum development environment because of its flexibility and extensive plugin ecosystem.

### Dependencies
The following key dependencies were installed:
*   `hardhat`: The core development environment.
*   `@nomicfoundation/hardhat-toolbox`: A bundle of commonly used plugins (Ethers.js, Chai, etc.).
*   `@openzeppelin/contracts`: Standard, secure smart contract implementations (used for ERC-721).

## 3. Configuration Decisions

### ESM (ECMAScript Modules)
The project is configured to use **ESM** (`"type": "module"` in `package.json`).
*   **Why?**: Modern JavaScript development is moving towards ESM. It allows the use of `import` / `export` syntax instead of `require`.
*   **Impact**:
    *   `hardhat.config.js` uses `export default`.
    *   Scripts use `import` statements.

### Hardhat Version
We are currently using **Hardhat v2** (specifically `^2.22.0`).
*   **Why?**: During setup, we encountered compatibility issues between the latest Hardhat v3 and the `hardhat-toolbox` plugins when running on the user's Node.js version. Downgrading to a stable v2 release resolved these plugin conflicts.

## 4. Directory Structure
*   `contracts/`: Solidity source files.
*   `scripts/`: Automation scripts (deployment, demo).
*   `test/`: (Placeholder) for automated tests.
*   `hardhat.config.js`: Configuration entry point.

## 5. Node.js Version Note
The environment is sensitive to the Node.js version.
*   **Issue**: Node.js v25+ introduced changes that caused issues with the Hardhat internal runner.
*   **Recommendation**: Use Node.js v20 (LTS) or v22 (LTS) for the most stable experience.
