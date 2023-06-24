const { ethers } = require('hardhat');
const { MerkleTree } = require('merkletreejs');
const { keccak256 } = ethers.utils;
const fs = require('fs');

// Read the file and split the addresses into an array
const csvData = fs.readFileSync('whitelisted-accounts.csv', 'utf8');
const accounts = csvData.trim().split('\n');

const padBuffer = (addr) => {
    return Buffer.from(addr.substr(2).padStart(32 * 2, '0'), 'hex');
};

const leaves = accounts.map((account) => padBuffer(account));
const tree = new MerkleTree(leaves, keccak256, { sort: true });
const merkleRoot = tree.getHexRoot();
console.log(merkleRoot);

let outputCsvData = '';

// For each account, generate a merkle proof and add to CSV string
for (const account of accounts) {
    const paddedAccount = padBuffer(account);
    const merkleProof = tree.getHexProof(paddedAccount);

    const proofString = JSON.stringify(merkleProof).replace(/"/g, '""');
    outputCsvData += `${account},"""${proofString}"""\n`;
}

// Write to CSV file
fs.writeFileSync('merkleProofs.csv', outputCsvData);