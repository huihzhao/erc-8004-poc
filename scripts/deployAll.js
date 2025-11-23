import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy contracts sequentially
    const IdentityRegistryFactory = await hre.ethers.getContractFactory("AgentIdentityRegistry");
    const identityRegistry = await IdentityRegistryFactory.deploy();
    await identityRegistry.waitForDeployment();
    const identityRegistryAddress = await identityRegistry.getAddress();
    console.log("AgentIdentityRegistry deployed to:", identityRegistryAddress);

    const ReputationRegistryFactory = await hre.ethers.getContractFactory("AgentReputationRegistry");
    const reputationRegistry = await ReputationRegistryFactory.deploy();
    await reputationRegistry.waitForDeployment();
    const reputationRegistryAddress = await reputationRegistry.getAddress();
    console.log("AgentReputationRegistry deployed to:", reputationRegistryAddress);

    const ValidationRegistryFactory = await hre.ethers.getContractFactory("AgentValidationRegistry");
    const validationRegistry = await ValidationRegistryFactory.deploy();
    await validationRegistry.waitForDeployment();
    const validationRegistryAddress = await validationRegistry.getAddress();
    console.log("AgentValidationRegistry deployed to:", validationRegistryAddress);

    const ServiceRegistryFactory = await hre.ethers.getContractFactory("AgentServiceRegistry");
    const serviceRegistry = await ServiceRegistryFactory.deploy();
    await serviceRegistry.waitForDeployment();
    const serviceRegistryAddress = await serviceRegistry.getAddress();
    console.log("AgentServiceRegistry deployed to:", serviceRegistryAddress);

    const JuryRegistryFactory = await hre.ethers.getContractFactory("AgentJuryRegistry");
    const juryRegistry = await JuryRegistryFactory.deploy();
    await juryRegistry.waitForDeployment();
    const juryRegistryAddress = await juryRegistry.getAddress();
    console.log("AgentJuryRegistry deployed to:", juryRegistryAddress);

    // Wire Validation Registry to Jury Registry
    await validationRegistry.setJuryRegistry(juryRegistryAddress);
    console.log("Validation Registry wired to Jury Registry");

    // Save addresses to a JSON file for later scripts
    const deploymentInfo = {
        identityRegistry: identityRegistryAddress,
        reputationRegistry: reputationRegistryAddress,
        validationRegistry: validationRegistryAddress,
        serviceRegistry: serviceRegistryAddress,
        juryRegistry: juryRegistryAddress,
    };
    const outputPath = path.resolve(__dirname, "deployment.json");
    fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
    console.log("Deployment addresses written to", outputPath);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
