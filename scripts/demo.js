import hre from "hardhat";

async function main() {
    const [deployer, agent, reviewer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy Identity Registry
    const IdentityRegistry = await hre.ethers.getContractFactory("AgentIdentityRegistry");
    const identityRegistry = await IdentityRegistry.deploy();
    await identityRegistry.waitForDeployment();
    const identityRegistryAddress = await identityRegistry.getAddress();
    console.log("AgentIdentityRegistry deployed to:", identityRegistryAddress);

    // Deploy Reputation Registry
    const ReputationRegistry = await hre.ethers.getContractFactory("AgentReputationRegistry");
    const reputationRegistry = await ReputationRegistry.deploy();
    await reputationRegistry.waitForDeployment();
    const reputationRegistryAddress = await reputationRegistry.getAddress();
    console.log("AgentReputationRegistry deployed to:", reputationRegistryAddress);

    // Deploy Validation Registry
    const ValidationRegistry = await hre.ethers.getContractFactory("AgentValidationRegistry");
    const validationRegistry = await ValidationRegistry.deploy();
    await validationRegistry.waitForDeployment();
    const validationRegistryAddress = await validationRegistry.getAddress();
    console.log("AgentValidationRegistry deployed to:", validationRegistryAddress);

    // Deploy Service Registry
    const ServiceRegistry = await hre.ethers.getContractFactory("AgentServiceRegistry");
    const serviceRegistry = await ServiceRegistry.deploy();
    await serviceRegistry.waitForDeployment();
    const serviceRegistryAddress = await serviceRegistry.getAddress();
    console.log("AgentServiceRegistry deployed to:", serviceRegistryAddress);

    // Register an Agent
    console.log("\nRegistering an Agent...");
    const agentUri = "https://example.com/agent-metadata.json";
    const tx = await identityRegistry.registerAgent(agent.address, agentUri);
    await tx.wait();

    const tokenId = await identityRegistry.getAgentTokenId(agent.address);
    console.log(`Agent registered! Token ID: ${tokenId}, Address: ${agent.address}`);

    // Register a Service
    console.log("\nRegistering a Service...");
    const serviceId = "service-1";
    const serviceMetadata = "https://example.com/service-metadata.json";
    const serviceTx = await serviceRegistry.registerService(tokenId, serviceId, serviceMetadata);
    await serviceTx.wait();
    console.log(`Service registered! Service ID: ${serviceId}`);

    // Submit and Validate Task with Fee
    console.log("\nSubmitting Task with 1 ETH fee...");
    const taskHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("Task Result Data"));
    const fee = hre.ethers.parseEther("1.0");

    const taskTx = await validationRegistry.connect(agent).submitTask(tokenId, taskHash, { value: fee });
    await taskTx.wait();

    // Get taskId from event (simplified for demo, assuming ID 1)
    const taskId = 1;
    console.log(`Task submitted! Task ID: ${taskId}, Hash: ${taskHash}, Fee: ${hre.ethers.formatEther(fee)} ETH`);

    console.log("Validating Task...");
    const validatorInitialBalance = await hre.ethers.provider.getBalance(reviewer.address);

    const validateTx = await validationRegistry.connect(reviewer).validateTask(taskId, true);
    const validateReceipt = await validateTx.wait();

    const validatorFinalBalance = await hre.ethers.provider.getBalance(reviewer.address);
    console.log("Task validated!");
    // Note: This calculation is approximate because we need to account for gas costs paid by the validator
    // But since we are running on Hardhat network, we can see the balance increase
    console.log(`Validator balance change: ${hre.ethers.formatEther(validatorFinalBalance - validatorInitialBalance)} ETH`);

    // Add Reputation
    console.log("\nAdding Reputation...");
    const score = 95;
    const comment = "Great service, very fast!";
    const repTx = await reputationRegistry.connect(reviewer).addReputation(tokenId, score, comment);
    await repTx.wait();
    console.log("Reputation added!");

    // Verify Data
    console.log("\nVerifying Data...");

    const task = await validationRegistry.getTask(taskId);
    console.log(`Task ${taskId} Status:`);
    console.log(`  Validated: ${task.isValidated}`);
    console.log(`  Valid: ${task.isValid}`);
    console.log(`  Validator: ${task.validator}`);

    const reviews = await reputationRegistry.getReputation(tokenId);
    console.log("Reviews for Agent:", tokenId.toString());
    reviews.forEach((review, index) => {
        console.log(`Review #${index + 1}:`);
        console.log(`  Reviewer: ${review.reviewer}`);
        console.log(`  Score: ${review.score}`);
        console.log(`  Comment: ${review.comment}`);
    });

    const avgScore = await reputationRegistry.getAverageScore(tokenId);
    console.log(`Average Score: ${avgScore}`);

    const services = await serviceRegistry.getAgentServices(tokenId);
    console.log(`\nServices for Agent ${tokenId}:`, services);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
