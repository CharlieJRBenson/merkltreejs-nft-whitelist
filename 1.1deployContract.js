// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
//wallet address stored in dotenv
require('dotenv').config();


async function main() {

    const WLNFT = await hre.ethers.getContractFactory("DigitalPunk");
    const instance = await WLNFT.deploy(
        "DIGITAL PUNK",
        "WLDP",
        "ipfs://QmbFQ6rXDeg95wMS1uofj1zfnPcBa5XQa1vBju5YWBkA1e/",
        "99900000000000000",
        "0x815c61f7c845b9ae4d06a2093700281813acc0b05988e14ce6b9d02cabda74bb"
    );

    await instance.deployed();

    console.log(
        `Token successfully deployed to ${instance.address}`
    );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
