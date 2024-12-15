import { ethers } from "ethers";


import { ethers } from 'ethers';
import { simpleDEXABI, addressDex } from '../../shared/SimpleDEXABI'; 


// Conectar a Ethereum
async function connectToEthereum() {
    if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        return provider.getSigner();
    } else {
        alert("Por favor, instala MetaMask!");
        throw new Error("MetaMask no está instalado");
    }
}

// Inicializar el pool
async function initializePool(amountA, amountB) {
    const signer = await connectToEthereum();
    const contract = new ethers.Contract(addressDex, simpleDEXABI, signer);
    const tx = await contract.initializePool(amountA, amountB);
    await tx.wait();
    console.log("Pool inicializado con éxito");
}

// Agregar liquidez
async function addLiquidity(amountA, amountB) {
    const signer = await connectToEthereum();
    const contract = new ethers.Contract(addressDex, simpleDEXABI, signer);
    const tx = await contract.addLiquidity(amountA, amountB);
    await tx.wait();
    console.log("Liquidez agregada con éxito");
}

// Retirar liquidez
async function removeLiquidity(amountA, amountB) {
    const signer = await connectToEthereum();
    const contract = new ethers.Contract(addressDex, simpleDEXABI, signer);
    const tx = await contract.removeLiquidity(amountA, amountB);
    await tx.wait();
    console.log("Liquidez retirada con éxito");
}

// Realizar swap de A por B
async function swapAForB(amountA) {
    const signer = await connectToEthereum();
    const contract = new ethers.Contract(addressDex, simpleDEXABI, signer);
    const tx = await contract.swapAForB(amountA);
    await tx.wait();
    console.log("Swap de A por B realizado con éxito");
}

// Realizar swap de B por A
async function swapBForA(amountB) {
    const signer = await connectToEthereum();
    const contract = new ethers.Contract(addressDex, simpleDEXABI, signer);
    const tx = await contract.swapBForA(amountB);
    await tx.wait();
    console.log("Swap de B por A realizado con éxito");
}

// Obtener precios
async function getPrice() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(addressDex, simpleDEXABI, provider);
    const prices = await contract.getPrice();
    console.log("Precios:", prices);
}

// Obtener reservas
async function getReserves() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(addressDex, simpleDEXABI, provider);
    const reserves = await contract.getReserves();
    console.log("Reservas:", reserves);
}

// Transferir propiedad
async function transferOwnership(newOwner) {
    const signer = await connectToEthereum();
    const contract = new ethers.Contract(addressDex, simpleDEXABI, signer);
    const tx = await contract.transferOwnership(newOwner);
    await tx.wait();
    console.log("Propiedad transferida con éxito");
}

// Ejemplo de uso al hacer clic en un botón
document.getElementById('initPool').onclick = async function() {
    await initializePool(ethers.parseUnits("1000", 18), ethers.parseUnits("1000", 18));
};

// Añadir eventos para otros métodos según sea necesario
document.getElementById('addLiquidity').onclick = async function() {
    await addLiquidity(ethers.parseUnits("1000", 18), ethers.parseUnits("1000", 18));
};

document.getElementById('removeLiquidity').onclick = async function() {
    await removeLiquidity(ethers.parseUnits("500", 18), ethers.parseUnits("500", 18));
};

document.getElementById('swapAForB').onclick = async function() {
    await swapAForB(ethers.parseUnits("100", 18));
};

document.getElementById('swapBForA').onclick = async function() {
    await swapBForA(ethers.parseUnits("100", 18));
};

document.getElementById('getPrice').onclick = async function() {
    await getPrice();
};

document.getElementById('getReserves').onclick = async function() {
    await getReserves();
};

document.getElementById('transferOwnership').onclick = async function() {
    const newOwner = "0x..."; // Reemplaza con la dirección del nuevo propietario
    await transferOwnership(newOwner);
};