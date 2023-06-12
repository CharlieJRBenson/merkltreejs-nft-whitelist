const { ethers } = require('hardhat')
const { MerkleTree } = require('merkletreejs')
const { keccak256 } = ethers.utils
const fs = require('fs')

// Read the file and split the addresses into an array
const accounts = fs.readFileSync('whitelisted-accounts.csv', 'utf8').split(',')

const padBuffer = (addr) => {
    return Buffer.from(addr.substr(2).padStart(32 * 2, 0), 'hex')
}

const leaves = accounts.map(account => padBuffer(account))
const tree = new MerkleTree(leaves, keccak256, { sort: true })
const merkleRoot = tree.getHexRoot()
console.log(merkleRoot)

let csvData = ""

// For each account, generate a merkle proof and add to CSV string
for (const element of accounts) {
    const account = element;
    const merkleProof = tree.getHexProof(padBuffer(account))
    const proofString = JSON.stringify(merkleProof).replace(/"/g, '""')
    csvData += `${account},"""${proofString}"""\n`
}

// Write to CSV file
fs.writeFileSync('merkleProofs.csv', csvData)
