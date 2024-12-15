// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleDEX is Ownable {
    IERC20 public tokenA;
    IERC20 public tokenB; 

    event LiquidityAdded(uint256 amountA, uint256 amountB);
    event LiquidityRemoved(uint256 amountA, uint256 amountB);
    event PoolInitialized(uint256 amountA, uint256 amountB);    
    event Swap(address indexed user, bool indexed isAToB, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);


    constructor(address _tokenA, address _tokenB) Ownable(msg.sender) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);                    
    }

    function initializePool(uint256 amountA, uint256 amountB) external onlyOwner {
        require(amountB == amountA * 4, "Bad ratio:B=4xA");
        uint256 scaledAmountA = amountA * 1e18;
        uint256 scaledAmountB = amountB * 1e18;
        
        require(tokenA.transferFrom(msg.sender, address(this), scaledAmountA), "A transfer failed");
        require(tokenB.transferFrom(msg.sender, address(this), scaledAmountB), "B transfer failed");
        
        emit PoolInitialized(scaledAmountA, scaledAmountB);
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(amountA > 0 && amountB > 0, "Bad amounts");   
        uint256 balanceA = tokenA.balanceOf(address(this));
        uint256 balanceB = tokenB.balanceOf(address(this));
        require(balanceA > 0 || balanceB > 0, "Pool not ready");  

        uint256 scaledAmountA = amountA * 1e18;
        uint256 scaledAmountB = amountB * 1e18;
        uint256 ratioA = (balanceA * 1e18) / balanceB;
        uint256 ratioB = (balanceB * 1e18) / balanceA;

        require(scaledAmountA / scaledAmountB == ratioA || scaledAmountB / scaledAmountA == ratioB, "Bad liquidity ratio");

        require(tokenA.transferFrom(msg.sender, address(this), scaledAmountA), "A transfer failed");
        require(tokenB.transferFrom(msg.sender, address(this), scaledAmountB), "B transfer failed");

        emit LiquidityAdded(scaledAmountA, scaledAmountB);              
    }

    function swapAForB(uint256 amountA) external {
        require(amountA > 0, "Bad amount");
        uint256 scaledAmountA = amountA * 1e18;
        uint256 reserveA = tokenA.balanceOf(address(this));
        uint256 reserveB = tokenB.balanceOf(address(this));
        uint256 amountB = getAmountOut(scaledAmountA, reserveA, reserveB);

        require(tokenA.transferFrom(msg.sender, address(this), scaledAmountA), "A transfer failed");                
        require(tokenB.transfer(msg.sender, amountB), "B transfer failed");

        emit Swap(msg.sender, true, address(tokenA), address(tokenB), scaledAmountA, amountB);
    }

    function swapBForA(uint256 amountB) external {
        require(amountB > 0, "Bad amount");
        uint256 scaledAmountB = amountB * 1e18;
        uint256 reserveA = tokenA.balanceOf(address(this));
        uint256 reserveB = tokenB.balanceOf(address(this));
        uint256 amountA = getAmountOut(scaledAmountB, reserveB, reserveA);

        require(tokenB.transferFrom(msg.sender, address(this), scaledAmountB), "B transfer failed");
        require(tokenA.transfer(msg.sender, amountA), "A transfer failed");

        emit Swap(msg.sender, false, address(tokenB), address(tokenA), scaledAmountB, amountA);
    }

    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) internal pure returns (uint256) {
        require(reserveIn > 0 && reserveOut > 0, "Bad reserves");
        return (amountIn * reserveOut) / (reserveIn + amountIn);
    }

    function removeLiquidity(uint256 amountA, uint256 amountB) external onlyOwner { 
        uint256 scaledAmountA = amountA * 1e18;
        uint256 scaledAmountB = amountB * 1e18;

        require(tokenA.transfer(msg.sender, scaledAmountA), "A transfer failed");
        require(tokenB.transfer(msg.sender, scaledAmountB), "B transfer failed");

        emit LiquidityRemoved(scaledAmountA, scaledAmountB);
    }

    function getReserves() external view returns (uint256, uint256) {
        return (
            tokenA.balanceOf(address(this)) / 1e18,
            tokenB.balanceOf(address(this)) / 1e18
        );
    }

    function getPrice() external view returns (uint256 tokenAEquivalent, uint256 tokenBEquivalent) {
        uint256 reserveA = tokenA.balanceOf(address(this));
        uint256 reserveB = tokenB.balanceOf(address(this));
        require(reserveA > 0 && reserveB > 0, "Insufficient reserves");

        tokenAEquivalent = (reserveA * 100) / reserveB;
        tokenBEquivalent = (reserveB * 100) / reserveA;
    }
}