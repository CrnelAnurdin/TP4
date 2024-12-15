const { ethers } = require("hardhat");
//ABI contrato , Dirección del contrato desplegado
const { simpleDEXABI, addressDex } = require('../../shared/SimpleDEXABI'); 

async function main() {
           
    
    // Crea una instancia del contrato
    const contract = await ethers.getContractAt(simpleDEXABI, addressDex);
    // Llama a una función del contrato
    const reserves = await contract.getReserves();
    console.log("Reservas:", reserves);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });