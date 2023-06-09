const { ethers } = require('hardhat')
const { MerkleTree } = require('merkletreejs')
const { keccak256 } = ethers.utils


const accounts = [
  '0xeD0761641dbDb3c5C6dc15fe98ef94A9ED1451d5',
  '0x00116Ca7c678eC102915c230070D3E2ce2de410E',
  '0xadE2C2938a5D42407C2855c80EB1E10EaAf9AFBE'
]

const padBuffer = (addr) => {
  return Buffer.from(addr.substr(2).padStart(32 * 2, 0), 'hex')
}

const leaves = accounts.map(account => padBuffer(account))
const tree = new MerkleTree(leaves, keccak256, { sort: true })
const merkleRoot = tree.getHexRoot()
console.log(merkleRoot);


// For each account, generate a merkle proof and test the minting function
for (const element of accounts) {
  const account = element;
  const merkleProof = tree.getHexProof(padBuffer(account))

  // Here you can test the minting function using the merkle proof
  console.log(merkleProof);
}


