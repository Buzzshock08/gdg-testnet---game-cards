const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying GameCardMarketplace...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const GameCardMarketplace = await hre.ethers.getContractFactory("GameCardMarketplace");
  const marketplace = await GameCardMarketplace.deploy();

  await marketplace.waitForDeployment();
  const contractAddress = await marketplace.getAddress();

  console.log(`✅ GameCardMarketplace successfully deployed to: ${contractAddress}`);
  console.log(`Network: ${hre.network.name} (Chain ID: ${(await hre.ethers.provider.getNetwork()).chainId})`);

  // Optionally export contract address and ABI for frontend
  const deploymentInfo = {
    contractAddress,
    network: hre.network.name,
    chainId: Number((await hre.ethers.provider.getNetwork()).chainId),
    deployedAt: new Date().toISOString(),
  };

  const contractsDir = path.join(__dirname, "../src/config");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "deployedAddress.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("📄 Saved deployment metadata to src/config/deployedAddress.json");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
