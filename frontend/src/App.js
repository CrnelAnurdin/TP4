import './App.css';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import LiquidityChart from './liquidityChart';
import ActionInputs from './actionInputs';
import { simpleDEXABI, addressDex, REACT_APP_NETWORK } from './shared/SimpleDEXABI'; // Import from shared file

function App() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
    const [tokenAAmount, setTokenAAmount] = useState('');
    const [tokenBAmount, setTokenBAmount] = useState('');
    const [liquidityData, setLiquidityData] = useState({ tokenA: 0, tokenB: 0 });
    const [errorMessage, setErrorMessage] = useState('');
    const [isTokenA, setIsTokenA] = useState(true);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(provider);                
            } else {
                setErrorMessage("Por favor, instala una billetera como MetaMask.");
            }
        };
        init();
    }, []);

    const loadConfigurations = async () => {
        try {
            if (REACT_APP_NETWORK === 'sepolia') {
                // Use shared import for Sepolia
                setContract(new ethers.Contract(addressDex, simpleDEXABI, provider.getSigner()));
            } else {
                // Use JSON import for localhost
                const localAddresses = (await import('./json/deployedAddresses.json')).default;
                setContract(new ethers.Contract(localAddresses.SimpleDEX, simpleDEXABI, provider.getSigner()));
            }
        } catch (error) {
            console.error("Error loading configurations:", error);
            setErrorMessage("Error al cargar la configuración del contrato.");
        }
    };

    const connectWallet = async () => {
        if (provider) {
            try {
                const accounts = await provider.send("eth_requestAccounts", []);
                setAccount(accounts[0]);
                await loadConfigurations();
                fetchLiquidityData();
                setWalletConnected(true);
            } catch (error) {
                console.error("Error al conectar la billetera:", error);
                setErrorMessage("Error al conectar la billetera. Asegúrate de que MetaMask esté configurado correctamente.");
            }
        } else {
            alert("Por favor, instala una billetera como MetaMask.");
            window.location.href = '/';
        }
    };

    const fetchLiquidityData = async () => {
        if (!contract) {
            console.error("El contrato no está inicializado.");
            setErrorMessage("Contrato no inicializado.");
            return;
        }
        try {
            const reserves = await contract.getReserves();
            setLiquidityData({ tokenA: reserves[0], tokenB: reserves[1] });
        } catch (error) {
            console.error("Error al obtener los datos de liquidez:", error);
            setErrorMessage("Error al obtener los datos de liquidez.");
        }
    };

    const initializePool = async () => {
        if (!contract) {
            setErrorMessage("Contrato no inicializado.");
            return;
        }
        try {
            const amountA = ethers.utils.parseUnits(tokenAAmount, 18);
            const amountB = ethers.utils.parseUnits(tokenBAmount, 18);
            const tx = await contract.initializePool(amountA, amountB);
            await tx.wait();
            console.log("Pool inicializado exitosamente", tx);
            await fetchLiquidityData();
            resetInputs();
        } catch (error) {
            console.error("Error al inicializar la pool:", error);
            setErrorMessage("Error al inicializar la pool.");
        }
    };

    const removeLiquidity = async () => {
        try {
            console.log("Retirar liquidez");
            const amountA = ethers.utils.parseUnits(tokenAAmount, 18);
            const amountB = ethers.utils.parseUnits(tokenBAmount, 18);
            const tx = await contract.removeLiquidity(amountA, amountB);
            resetInputs();
        } catch (error) {
            console.error("Error al retirar liquidez:", error);
            setErrorMessage("Error al retirar liquidez.");
        }
    };

    const addLiquidity = async () => {
        try {
            console.log("Agregar liquidez");
            const amountA = ethers.utils.parseUnits(tokenAAmount, 18);
            const amountB = ethers.utils.parseUnits(tokenBAmount, 18);
            const tx = await contract.addLiquidity(amountA, amountB);
            resetInputs();
        } catch (error) {
            console.error("Error al agregar liquidez:", error);
            setErrorMessage("Error al agregar liquidez.");
        }
    };

    const swapTokens = async () => {
        try {
            const amount = ethers.utils.parseUnits(isTokenA ? tokenAAmount : tokenBAmount, 18);
            const tx = isTokenA
                ? await contract.swapAtoB(amount)
                : await contract.swapBtoA(amount);
            await tx.wait();
            console.log("Intercambio exitoso", tx);
            await fetchLiquidityData();
            resetInputs();
        } catch (error) {
            console.error("Error al intercambiar tokens:", error);
            setErrorMessage("Error al intercambiar tokens.");
        }
    };

    const handleSwapToggle = () => {
        setIsTokenA(!isTokenA);
        const temp = tokenAAmount;
        setTokenAAmount(tokenBAmount);
        setTokenBAmount(temp);
    };

    const resetInputs = () => {
        setTokenAAmount('');
        setTokenBAmount('');
    };

    const handleActionChange = (action) => {
        setSelectedAction(action);
        resetInputs();
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Mi DEX</h1>
                {!walletConnected ? (
                    <button className="button" onClick={connectWallet}>Conectar Billetera</button>
                ) : (
                    <div>
                        <span>{account}</span>
                        <button className="button" onClick={() => navigator.clipboard.writeText(account)}>Copiar</button>
                    </div>
                )}
            </header>
            <div className="content">
                <div className="sidebar">
                    {walletConnected && <h2>Acciones</h2>} 
                    {walletConnected && (
                        <>
                            <button onClick={() => handleActionChange('initializePool')}>Inicializar Pool</button>
                            <button onClick={() => handleActionChange('removeLiquidity')}>Quitar Liquidez</button>
                            <button onClick={() => handleActionChange('addLiquidity')}>Agregar Liquidez</button>
                            <button onClick={() => handleActionChange('swap')}>Intercambiar</button>
                        </>
                    )}
                    <ActionInputs 
                        selectedAction={selectedAction}
                        tokenAAmount={tokenAAmount}
                        tokenBAmount={tokenBAmount}
                        setTokenAAmount={setTokenAAmount}
                        setTokenBAmount={setTokenBAmount}
                        initializePool={initializePool}
                        removeLiquidity={removeLiquidity}
                        addLiquidity={addLiquidity}
                        swapTokens={swapTokens}
                        isTokenA={isTokenA}
                        handleSwapToggle={handleSwapToggle}
                    />
                </div>
                <div className="main" style={{ textAlign: 'right' }}>
                    <h2>Gráfico de Liquidez</h2>
                    {liquidityData.tokenA > 0 || liquidityData.tokenB > 0 ? (
                        <LiquidityChart liquidityData={liquidityData} />
                    ) : (
                        <div style={{ fontSize: '24px', color: '#f00', textAlign: 'right', marginTop: '10px' }}>
                            Pool Inactivo
                        </div>
                    )}
                </div>
            </div>
            {errorMessage && (
                <div className="error-message">
                    <p>{errorMessage}</p>
                </div>
            )}
            <footer className="footer">
                <p>© 2023 Mi DEX. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}

export default App;