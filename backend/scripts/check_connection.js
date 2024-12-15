require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const balance = await wallet.getBalance();
  console.log("Balance:", ethers.utils.formatEther(balance), "ETH");

  const blockNumber = await provider.getBlockNumber();
  console.log("Número de bloque actual:", blockNumber);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});