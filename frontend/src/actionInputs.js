import React from 'react';

const ActionInputs = ({ selectedAction, tokenAAmount, tokenBAmount, setTokenAAmount, setTokenBAmount, initializePool, removeLiquidity, addLiquidity, swapTokens, isTokenA, handleSwapToggle }) => {
    const renderInputs = () => {
        switch (selectedAction) {
            case 'initializePool':
                return (
                    <div className="action-inputs">
                        <input 
                            type="number" 
                            placeholder="Cantidad de Token A" 
                            value={tokenAAmount} 
                            onChange={(e) => setTokenAAmount(e.target.value)} 
                        />
                        <input 
                            type="number" 
                            placeholder="Cantidad de Token B" 
                            value={tokenBAmount} 
                            onChange={(e) => setTokenBAmount(e.target.value)} 
                        />
                        <p>Nota: Debe ser 1B = 4A (ratio)</p>
                        <button onClick={initializePool}>Inicializar</button>
                    </div>
                );
            case 'removeLiquidity':
                return (
                    <div className="action-inputs">
                        <input type="number" placeholder="Cantidad de Token A a retirar" />
                        <input type="number" placeholder="Cantidad de Token B a retirar" />
                        <p>Nota: Debe mantener el ratio</p>
                        <button onClick={removeLiquidity}>Retirar</button>
                    </div>
                );
            case 'addLiquidity':
                return (
                    <div className="action-inputs">
                        <input 
                            type="number" 
                            placeholder="Cantidad de Token A a agregar" 
                            value={tokenAAmount} 
                            onChange={(e) => setTokenAAmount(e.target.value)} 
                        />
                        <input 
                            type="number" 
                            placeholder="Cantidad de Token B a agregar" 
                            value={tokenBAmount} 
                            onChange={(e) => setTokenBAmount(e.target.value)} 
                        />
                        <br></br>
                        <button onClick={addLiquidity}>Agregar</button>
                    </div>
                );
            case 'swap':
                return (
                    <div className="action-inputs">
                        <label>{isTokenA ? "Dar Token A" : "Dar Token B"}</label>
                        <input 
                            type="number" 
                            placeholder="Cantidad" 
                            value={isTokenA ? tokenAAmount : tokenBAmount} 
                            onChange={(e) => isTokenA ? setTokenAAmount(e.target.value) : setTokenBAmount(e.target.value)} 
                        />
                        <button className="swap-arrow" onClick={handleSwapToggle}>↔️</button>
                        <label>{isTokenA ? "Recibir Token B" : "Recibir Token A"}</label>
                        <input 
                            type="number" 
                            placeholder="Cantidad" 
                            value={isTokenA ? tokenBAmount : tokenAAmount} 
                            onChange={(e) => isTokenA ? setTokenBAmount(e.target.value) : setTokenAAmount(e.target.value)} 
                        />
                        <br></br>
                        <button onClick={swapTokens}>Aceptar</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return <>{renderInputs()}</>;
};

export default ActionInputs;