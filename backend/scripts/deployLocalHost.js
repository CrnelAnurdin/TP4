const { ethers } = require("hardhat");
const fs = require('fs');

    async function main() {
        const [deployer] = await ethers.getSigners();
    
        // Deploy TokenA
        const TokenA = await ethers.getContractFactory("TokenA");
        const tokenA = await TokenA.deploy(deployer.address);
        await tokenA.waitForDeployment();
        console.log("TokenA deployed to:", tokenA.target);
    
        // Deploy TokenB
        const TokenB = await ethers.getContractFactory("TokenB");
        const tokenB = await TokenB.deploy(deployer.address);
        await tokenB.waitForDeployment();
        console.log("TokenB deployed to:", tokenB.target);
    
        // Deploy SimpleDEX
        const SimpleDEX = await ethers.getContractFactory("SimpleDEX");
        const simpleDEX = await SimpleDEX.deploy(tokenA.target, tokenB.target);
        await simpleDEX.waitForDeployment();
        console.log("SimpleDEX deployed to:", simpleDEX.target);
    
        // Save addresses to a JSON file
        const addresses = {
            TokenA: tokenA.target,
            TokenB: tokenB.target,
            SimpleDEX: simpleDEX.target,
        };
        
        fs.writeFileSync('../json/deployedAddresses.json', JSON.stringify(addresses, null, 2));
    }
    
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });    