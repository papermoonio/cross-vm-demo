import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@parity/hardhat-polkadot"
import { vars } from "hardhat/config"

const config: HardhatUserConfig = {
    solidity: "0.8.28",
    networks: {
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
        localNode: {
            polkadot: {
                target: "evm",
            },
            url: `http://127.0.0.1:8545`,
        },
        hub: {
            polkadot: {
                target: "pvm",
            },
            url: "https://services.polkadothub-rpc.com/testnet",
            chainId: 420420417,
            accounts: [vars.get("PRIVATE_KEY")],
        },
    },
}

export default config
