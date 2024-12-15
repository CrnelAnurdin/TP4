const { ethers } = require("hardhat");
const { tAAddress,tBAddress} = require('../../shared/SimpleDEXABI'); 

async function main() {    

    const SimpleDEX = await ethers.getContractFactory("SimpleDEX");

    //const options = {
      //  gasPrice: ethers.parseUnits('10', 'gwei'), 
      //  gasLimit: 1000000, 
    //};

    const simpleDex = await SimpleDEX.deploy(tAAddress, tBAddress); //se agrega ,options cuando se acaba el faucet de eth y hay que escatimar
    await simpleDex.waitForDeployment();

    console.log("SimpleDEX deployed to:", simpleDex.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });