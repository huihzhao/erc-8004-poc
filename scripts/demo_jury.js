import hre from "hardhat";

async function main() {
    const [deployer, agent, challenger, juror1, juror2, juror3] = await hre.ethers.getSigners();

    console.log("Deploying contracts...");

    // Deploy Identity Registry
    const IdentityRegistry = await hre.ethers.getContractFactory("AgentIdentityRegistry");
    const identityRegistry = await IdentityRegistry.deploy();
    await identityRegistry.waitForDeployment();
    const identityRegistryAddress = await identityRegistry.getAddress();
    console.log("AgentIdentityRegistry deployed to:", identityRegistryAddress);

    // Deploy Validation Registry
    const ValidationRegistry = await hre.ethers.getContractFactory("AgentValidationRegistry");
    const validationRegistry = await ValidationRegistry.deploy();
    await validationRegistry.waitForDeployment();
    const validationRegistryAddress = await validationRegistry.getAddress();
    console.log("AgentValidationRegistry deployed to:", validationRegistryAddress);

    // Deploy Jury Registry
    const JuryRegistry = await hre.ethers.getContractFactory("AgentJuryRegistry");
    const juryRegistry = await JuryRegistry.deploy();
    await juryRegistry.waitForDeployment();
    const juryRegistryAddress = await juryRegistry.getAddress();
    console.log("AgentJuryRegistry deployed to:", juryRegistryAddress);

    // Wire up Validation Registry to use Jury Registry
    await validationRegistry.setJuryRegistry(juryRegistryAddress);
    // Wire up Jury Registry to use Validation Registry
    await juryRegistry.setValidationRegistry(validationRegistryAddress);
    console.log("Registries wired up.");

    // 1. Register Agent
    console.log("\n--- 1. Registering Agent ---");
    const tx = await identityRegistry.registerAgent(agent.address, "https://agent.com/metadata");
    await tx.wait();
    const tokenId = await identityRegistry.getAgentTokenId(agent.address);
    console.log(`Agent registered with Token ID: ${tokenId}`);

    // 2. Register Jurors
    console.log("\n--- 2. Registering Jurors ---");
    const stake = hre.ethers.parseEther("0.1");

    await juryRegistry.connect(juror1).registerJuror({ value: stake });
    console.log("Juror 1 registered");

    await juryRegistry.connect(juror2).registerJuror({ value: stake });
    console.log("Juror 2 registered");

    await juryRegistry.connect(juror3).registerJuror({ value: stake });
    console.log("Juror 3 registered");

    // 3. Submit Task
    console.log("\n--- 3. Agent Submits Task ---");
    const taskHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("Controversial Result"));
    const fee = hre.ethers.parseEther("1.0");

    const submitTx = await validationRegistry.connect(agent).submitTask(tokenId, taskHash, { value: fee });
    const receipt = await submitTx.wait();
    // Assuming taskId is 1 because it's the first task
    const taskId = 1;
    console.log(`Task submitted. ID: ${taskId}`);

    // 4. Raise Dispute
    console.log("\n--- 4. Challenger Raises Dispute ---");
    const disputeFee = hre.ethers.parseEther("0.05");
    // Create dispute in Jury Registry
    const disputeTx = await juryRegistry.connect(challenger).createDispute(taskId, { value: disputeFee });
    await disputeTx.wait();
    // Assuming disputeId is 1
    const disputeId = 1;
    console.log(`Dispute raised. ID: ${disputeId}`);

    // 5. Jurors Vote
    console.log("\n--- 5. Jurors Vote ---");
    // Juror 1 votes FALSE (Invalid)
    await juryRegistry.connect(juror1).vote(disputeId, false);
    console.log("Juror 1 voted: FALSE");

    // Juror 2 votes FALSE (Invalid)
    await juryRegistry.connect(juror2).vote(disputeId, false);
    console.log("Juror 2 voted: FALSE");

    // Juror 3 votes TRUE (Valid)
    await juryRegistry.connect(juror3).vote(disputeId, true);
    console.log("Juror 3 voted: TRUE");

    // 6. Execute Ruling
    console.log("\n--- 6. Execute Ruling ---");

    // Check balances before
    const balanceJuror1Before = await hre.ethers.provider.getBalance(juror1.address);
    const balanceChallengerBefore = await hre.ethers.provider.getBalance(challenger.address);

    console.log("Juror 1 Balance Before:", hre.ethers.formatEther(balanceJuror1Before));
    console.log("Challenger Balance Before:", hre.ethers.formatEther(balanceChallengerBefore));

    const rulingTx = await juryRegistry.executeRuling(disputeId);
    await rulingTx.wait();
    console.log("Ruling executed!");

    // Check balances after
    const balanceJuror1After = await hre.ethers.provider.getBalance(juror1.address);
    const balanceChallengerAfter = await hre.ethers.provider.getBalance(challenger.address);

    console.log("Juror 1 Balance After:", hre.ethers.formatEther(balanceJuror1After));
    console.log("Challenger Balance After:", hre.ethers.formatEther(balanceChallengerAfter));

    // Expected: Juror 1 (who voted FALSE) should have more ETH. Challenger should have more ETH (refund + reward).
    if (balanceJuror1After > balanceJuror1Before) {
        console.log("SUCCESS: Juror 1 rewarded.");
    } else {
        console.log("FAILURE: Juror 1 not rewarded.");
    }

    if (balanceChallengerAfter > balanceChallengerBefore) {
        console.log("SUCCESS: Challenger rewarded.");
    } else {
        console.log("FAILURE: Challenger not rewarded.");
    }

    // 7. Verify Result
    console.log("\n--- 7. Verification ---");
    const task = await validationRegistry.getTask(taskId);
    console.log(`Task Validated: ${task.isValidated}`);
    console.log(`Task Valid: ${task.isValid}`);
    console.log(`Task Disputed: ${task.isDisputed}`);

    if (!task.isValid && !task.isDisputed) {
        console.log("SUCCESS: Dispute resolved against Agent (Invalid).");
    } else {
        console.log("FAILURE: Unexpected state.");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
