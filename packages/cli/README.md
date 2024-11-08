# `@boostxyz/cli`

A command line interface simplifying Boost protocol deployment, and Boost creation.

- [Features](#features)
- [Installation](#installation)
  - [Via Package Manager](#via-package-manager)
  - [Manual Installation](#manual-installation)
- [Usage](#usage)
- [Options](#options)
- [Contributing](#contributing)
  - [Development Setup](#development-setup)

## Features

- Deploy Boost Protocol and register all valid base implementations
- Deploy and fund basic ERC20's to use with Boost budgets and incentives
- Generate Boost creation templates
- Create Boosts given JSON templates, with option to automatically mint and allocate funds to new or existing budgets
- Configurable, supports any Viem chain
- Secure, keys do not leave your machine

## Installation

### Via Package Manager

```bash
# npm
npm install -g @boostxyz/cli
npx boost --help
```

### Manual Installation

```bash
git clone https://github.com/boostxyz/boost-protocol.git
cd boost-protocol
pnpm install
turbo build --filter="./packages/cli"
npx boost seed generate
```

## Usage

Basic usage pattern:

```bash
# see the detailed help documentation
boost --help

# deploy the Boost Protocol to a local hardhat instance
boost deploy --privateKey="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" --chain="hardhat"

# generate a json template that can be used with `boost seed`
# if privateKey or mnemonic is supplied, your 0 address will be slotted into the requisite owner locations
boost seed generate --privateKey="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" --chain="hardhat"

# create boosts
boost seed PATH/TO/seed.json PATH/TO/another.json --privateKey="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" --chain="hardhat"

# deploy new erc20's that can be used with boosts and budgets
boost seed erc20 --privateKey="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" --chain="hardhat"
```

## Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--help` | `-h` | Show documentation | - |
| `--version` | `-v` | Show the current version number | - |
| `--chain` | - | Target a specific viem chain, ie hardhat, anvil, sepolia, base, etc. See https://github.com/wevm/viem/tree/main/src/chains/definitions for a list of valid names | - |
| `--privateKey` | - | Private key to derive account from to use for contract operations, see https://viem.sh/docs/accounts/local/privateKeyToAccount#generating-private-keys for more information | - |
| `--mnemonic` | - | Mnemonic to derive account from to use for contract operations, see https://viem.sh/docs/accounts/local/mnemonicToAccount#generating-private-keys for more information | - |
| `--rpcUrl` | - | Optional URL to provide to Viem http transport, will typically be specific to targeted chain | - |
| `--out` | - | Filepath to write result of command. Can be useful if used with `--format="env"` to write to a .env file | - |
| `--format` | - | Specify command output format, either env or json | env |

## Seeding

Here is an example seed template.

### Tips
- By default the owner, will be `test...junk`'s 0 account unless `--privateKey` or `--mnemonic` is provided.
- For `action` `signatures`, While you generally need to manually supply the byte selector, you have the option of supplying a plain english signature, which will be converted into the bytes selector for you when passed into the `seed` command.
- If you supply a `"shouldMintAndAllocate": true` to an ERC20 incentive, the seed command will automatically call `mint` on the referenced asset with the total amount required to allocate and fund the Boosts's budget, so make sure the `privateKey` or `mnemonic` option is correctly supplied to make this call.

```json
{
  "protocolFee": 0,
  "maxParticipants": 10,
  "budget": {
    "type": "ManagedBudget",
    "owner": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "authorized": [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    ],
    "roles": [
      1
    ]
  },
  "action": {
    "type": "EventAction",
    "actionClaimant": {
      "signatureType": 1,
      "signature": "function mint(address to, uint256 amount)", // This will be converted into a bytes selector for you
      "fieldIndex": 0,
      "targetContract": "0x0000000000000000000000000000000000000000",
      "chainid": 31337
    },
    "actionSteps": [
      {
        "signature": "event Minted(address to, uint256 amount)",
        "signatureType": 1,
        "actionType": 0,
        "targetContract": "0x0000000000000000000000000000000000000000",
        "chainid": 31337,
        "actionParameter": {
          "filterType": 0,
          "fieldType": 1,
          "fieldIndex": 0,
          "filterData": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        }
      }
    ]
  },
  "validator": {
    "type": "SignerValidator",
    "signers": [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    ],
    "validatorCaller": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  },
  "allowList": {
    "type": "SimpleDenyList",
    "owner": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "denied": []
  },
  "incentives": [
    {
      "type": "ERC20Incentive",
      "asset": "0xf3B2d0E4f2d8F453DBCc278b10e88b20d7f19f8D", // By default, this is STAGING https://sepolia.etherscan.io/token/0xf3B2d0E4f2d8F453DBCc278b10e88b20d7f19f8D
      "shouldMintAndAllocate": true, // if set to true, will call `mint` on the referenced asset with the total amount required to fund this Boosts's budget.
      "strategy": 0,
      "reward": 1,
      "limit": 1,
      "manager": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    }
  ]
}
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](../../.github/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Setup

```bash
git clone https://github.com/boostxyz/boost-protocol.git
cd boost-protocol
pnpm install
```
