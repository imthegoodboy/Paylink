import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const PaymentGateway = await ethers.getContractFactory("PaymentGateway");
  const gateway = await PaymentGateway.deploy(deployer.address);
  await gateway.waitForDeployment();
  const gatewayAddr = await gateway.getAddress();
  console.log("PaymentGateway:", gatewayAddr);

  const ReceiptNFT = await ethers.getContractFactory("ReceiptNFT");
  const receipt = await ReceiptNFT.deploy("PayLink Receipt", "RECEIPT", "ipfs://", deployer.address);
  await receipt.waitForDeployment();
  const receiptAddr = await receipt.getAddress();
  console.log("ReceiptNFT:", receiptAddr);

  // Optionally allow USDC test token later via setAllowedToken
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


