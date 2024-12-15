const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenA = "0xEdC61EA4185562Fd037cc1Ac38A25182c43A0555";
const TokenB = "0x0E5A68A51Fd33dDb8f2b17078b2138c96495c400";

module.exports = buildModule("SimpleDexModule", (m) => {
  const simpledex = m.contract("SimpleDEX", [TokenA, TokenB]);
  return { simpledex };
});
