import { ethers } from "hardhat"
import { execSync } from 'child_process';
import { readFileSync } from "fs";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import path from "path";

async function getContractJson(contractName: string) {
    const content = readFileSync(path.join(__dirname, "..", "artifacts/contracts", `${contractName}.sol`, `${contractName}.json`))
    const json = JSON.parse(content.toString())
    return json;
}

async function deployContract(name: string, owner: HardhatEthersSigner): Promise<[string, any[]]> {
    const json = await getContractJson(name)
    const factory = new ethers.ContractFactory(json.abi, json.bytecode, owner);
    const deploy = await factory.deploy();
    await deploy.waitForDeployment();
    const address = await deploy.getAddress();
    return [address, json.abi];
}

async function main() {
    const [owner] = await ethers.getSigners()
    const balance = await ethers.provider.getBalance(owner.address)
    console.log(`Balance: ${balance}`)

    // compile the contracts with EVM format
    execSync("npx hardhat compile --network hardhat", {
        encoding: 'utf-8'
    });

    const [evmCounterAddress, counterAbi] = await deployContract("Counter", owner)
    const [evmCallCounterAddress, callCounterAbi] = await deployContract("CallCounter", owner)
    const evmCounterContract = new ethers.Contract(evmCounterAddress, counterAbi, owner)
    const evmCallCounterContract = new ethers.Contract(evmCallCounterAddress, callCounterAbi, owner)

    // compile the contracts with PVM format
    execSync("npx hardhat compile --network hub", {
        encoding: 'utf-8'
    });

    const [pvmCounterAddress,] = await deployContract("Counter", owner)
    const [pvmCallCounterAddress,] = await deployContract("CallCounter", owner)
    const pvmCounterContract = new ethers.Contract(pvmCounterAddress, counterAbi, owner)
    const pvmCallCounterContract = new ethers.Contract(pvmCallCounterAddress, callCounterAbi, owner)

    // call evm contract from pvm contract
    console.log("EVM counter value before calling inc: ", await evmCounterContract.count())
    const pvmCallEvmTx = await pvmCallCounterContract.callInc(evmCounterContract)
    await pvmCallEvmTx.wait()
    console.log("EVM counter value after calling inc: ", await evmCounterContract.count())

    // call pvm contract from evm contract
    console.log("PVM counter value before calling inc: ", await pvmCounterContract.count())
    const evmCallPvmTx = await evmCallCounterContract.callInc(pvmCounterContract)
    await evmCallPvmTx.wait()
    console.log("PVM counter value after calling inc: ", await pvmCounterContract.count())

}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})

