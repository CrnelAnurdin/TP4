require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const localUrl = process.env.LOCALHOST_URL;
const sepoliaUrl = process.env.SEPOLIA_URL;
const prKey = process.env.PRIVATE_KEY;
const ethScanApi = process.env.ETHERSCAN_API_KEY;


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks:{
    sepolia:{
      url:sepoliaUrl,
      accounts: [prKey],
      chainId: 11155111,
    },
    localhost:{
      url:localUrl,
      accounts:[prKey], /**Agregar nodeKey si se usa alguna wallet de node y setearle en el env.*/
    },
  },
  etherscan:{
    apiKey: {
      sepolia : ethScanApi,
    }
  },
};
