// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');

// Returns the Ether balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`
    );
  }
}

async function main() {
  // Get the example accounts we'll be working with.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // We get the contract to deploy.
  const GetSponsor = await hre.ethers.getContractFactory('GetSponsor');
  const getSponsor = await GetSponsor.deploy();

  // Deploy the contract.
  await getSponsor.deployed();
  console.log('GetSponsor deployed to:', getSponsor.address);

  // Check balances before the Sponsor purchase.
  const addresses = [owner.address, tipper.address, getSponsor.address];
  console.log('== start ==');
  await printBalances(addresses);

  // Give the owner a few tips.
  const tip = { value: hre.ethers.utils.parseEther('1') };
  await getSponsor.connect(tipper).sponsor('Carolina', "You're the best!", tip);
  await getSponsor.connect(tipper2).sponsor('Vitto', 'Amazing teacher', tip);
  await getSponsor
    .connect(tipper3)
    .sponsor('Kay', 'I love my Proof of Knowledge', tip);

  // Check balances after the sponsor.
  console.log('== sponsored ==');
  await printBalances(addresses);

  // Withdraw.
  await getSponsor.connect(owner).withdrawSponsorship();

  // Check balances after withdrawal.
  console.log('== withdrawTips ==');
  await printBalances(addresses);

  // Check out the memos.
  console.log('== memos ==');
  const memos = await getSponsor.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
