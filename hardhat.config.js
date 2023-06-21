require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    TN: {
      url: process.env.TN_RPC,
      accounts: [process.env.PRIVATE_KEY]
    },
    MN: {
      url: process.env.MN_RPC,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
