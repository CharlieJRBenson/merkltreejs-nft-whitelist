// const { expect, use } = require('chai')
// const { ethers } = require('hardhat')
// const { MerkleTree } = require('merkletreejs')
// const { keccak256 } = ethers.utils

// use(require('chai-as-promised'))

// describe('WhitelistSale', function () {
//   it('allow only whitelisted accounts to mint', async () => {
//     // const accounts = [
//     //   '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
//     //   '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
//     //   '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
//     //   '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
//     //   '0x617F2E2fD72FD9D5503197092aC168c91465E7f2',
//     //   '0x17F6AD8Ef982297579C203069C1DbfFE4348c372',
//     //   '0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678',
//     //   '0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7',
//     //   '0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C'
//     // ]


//     const accounts = await hre.ethers.getSigners()

//     const whitelisted = accounts.slice(0, 2)
//     const notWhitelisted = accounts.slice(2, 8)

//     const padBuffer = (addr) => {
//       return Buffer.from(addr.substr(2).padStart(32 * 2, 0), 'hex')
//     }

//     const leaves = whitelisted.map(account => padBuffer(account.address))
//     const tree = new MerkleTree(leaves, keccak256, { sort: true })
//     const merkleRoot = tree.getHexRoot()

//     const WhitelistSale = await ethers.getContractFactory('WhitelightNFT')
//     const whitelistSale = await WhitelistSale.deploy("MERKLETEST", "MKL", "MERKLEURI", ethers.utils.parseEther("0.5").toString(), merkleRoot)
//     await whitelistSale.deployed()


//     const merkleProof = tree.getHexProof(padBuffer(whitelisted[0].address))
//     console.log(merkleProof);
//     const invalidMerkleProof = tree.getHexProof(padBuffer(notWhitelisted[0].address))

//     console.log("asdasd", await whitelistSale.name())


//     await expect(whitelistSale.mint(1, merkleProof, { value: ethers.utils.parseEther("1") })).to.not.be.rejected
//     await expect(whitelistSale.connect(notWhitelisted[0]).mint(1, invalidMerkleProof, { value: ethers.utils.parseEther("1") })).to.be.rejectedWith("invalid merkle proof for whitelist")

//     expect(await whitelistSale.balanceOf(whitelisted[0].address)).to.equal(1);


//   })
// })
