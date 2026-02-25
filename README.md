# Sample Polkadot Hardhat Project

This project demonstrates how to use Hardhat with Polkadot. It includes a cross-vm example.
The deployed EVM contract can be called from PVM contract, and vice versa.

There are two simple contracts.

- Counter.sol: store a counter and can increase via inc function
- CallCounter.sol: call Counter's inc via address of deployed Counter

## create a polkadot hardhat project

Following the steps in polkadot doc website https://docs.polkadot.com/smart-contracts/dev-environments/hardhat/#pvm.
Make sure the contract compilation is OK.
Set the PRIVATE_KEY in hardhat config vars.

## update the config in hardhat.config.ts

We use the hardhat config for EVM compilation, and hub for PVM compilation.

- hardhat network for EVM

```shell
hardhat: {
            polkadot: {
                target: "evm",
            },
            nodeConfig: {
                nodeBinaryPath: "./bin/dev-node",
                rpcPort: 8000,
                dev: true,
            },
            adapterConfig: {
                adapterBinaryPath: "./bin/eth-rpc",
                dev: true,
            },
        },
```

- hub network for PVM

```shell
hub: {
            polkadot: {
                target: "pvm",
            },
            url: "https://services.polkadothub-rpc.com/testnet",
            chainId: 420420417,
            accounts: [vars.get("PRIVATE_KEY")],
        },
```

## run scripts to show everything

It will deploy both contracts for both EVM and PVM.
Then do cross VM call. Run it via the command as follows:

```shell
npx hardhat run scripts/cross-vm.ts --network hub
```

Check the code for details.

