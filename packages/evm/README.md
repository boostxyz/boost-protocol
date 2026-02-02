## Deployment

### Protocol V2 Deployment

1. Update foundry using `foundryup`
2. Make sure you have all `.env` variables added:

    ```jsx
    BOOST_FEE_RECIPIENT=
    BOOST_DEPLOYMENT_SALT=
    ETHERSCAN_API_KEY=
    MAIN_ETHERSCAN_API_KEY=
    ```

3. Note the current deployed addresses in `packages/evm/deploys`

    The currently deployed addresses will be ordered based on network ID.

    If there is a file representing a deployment on the network you’ll be deploying to take note of the current address.

    If there is **not** a file representing a deployment on that network you have to create one inside the `pacakges/evm/deploys`  with `touch <networkid>.json` for example:

    `cd packages/evm/deploys`

    `touch 31337.json`

4. [OPTIONAL] Deploy Core Contracts

    We use `--watch` to ensure contracts are verified and `--slow` to make sure transactions complete before starting the next broadcast. This helps avoid nonce issues.

    <aside>
    💡

    In the vast majority of cases you WILL NOT want to redeploy core and registry. Make absolutely sure you know what you’re doing before doing this step.

    </aside>

    To deploy the core contracts to the `Sepolia testnet`, use the following command:

    ```solidity
    forge script script/solidity/Deploy.s.sol:CoreDeployer -f https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY --broadcast --verify --private-key "YOUR_PRIVATE_KEY" --watch --slow
    ```

    In order to deploy to another network simply switch the RPC you're broadcasting against.

5. Deploy Module Contracts
We use `--watch` to ensure contracts are verified and `--slow` to make sure transactions complete before starting the next broadcast. This helps avoid nonce issues.

    To deploy the module contracts to the `Sepolia testnet`, use the following command:

    ```solidity
    forge script script/solidity/Deploy_Modules.s.sol:ModuleBaseDeployer -f https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY --broadcast --verify --private-key "YOUR_PRIVATE_KEY"` --watch --slow
    ```

    It may be necessary to set the verifier URL and some verifiers may require a different API key:

    ```solidity

    forge script script/solidity/Deploy.s.sol:CoreDeployer -f https://base-sepolia.g.alchemy.com/v2/KEY--broadcast --verify --private-key “KEY” —watch  --etherscan-api-key **KEY** --verifier-url https://api-sepolia.basescan.org/api

    ```

    **see the end of these steps for a table of known verifier URLs**


We use `--watch` to ensure contracts are verified and `--slow` to make sure transactions complete before starting the next broadcast. This helps avoid nonce issues.

1. Confirm that the addresses have changed for any module with new byte code. Any contract with any changes should have new byte code, and as a result be redeployed on a new deployment. Any contracts that *have not* changed should not be redeployed.
2. Confirm all addresses have been verified - manually verify any that have failed verification. Verification should occur automatically but it’s best to double check

<aside>
💡

If you run into a partial broadcast use the —resume tag to continue

https://book.getfoundry.sh/reference/forge/forge-script#options

</aside>

| Scanner | Verifier URL |
| --- | --- |
| base-sepolia | [`https://api-sepolia.basescan.org/api`](https://api-sepolia.basescan.org/api) |
| arb-mainnet | [`https://api.arbiscan.io/api`](https://api.arbiscan.io/api) |
| op-mainnet | [`https://api-optimistic.etherscan.io/api`](https://api-optimistic.etherscan.io/api) |
| base-mainnet | [`https://api.basescan.org/api`](https://api.basescan.org/api) |

## Security Model

`SignerValidator` limits claims on individual claim data, which can allow for multiple
claims of the same incentive by a given address, as long as a unique action is signed off
by the Signer.

`LimitedSignerValidator` hard caps the claim quantity for a given incentive
regardless of the validity of individual action requests presented to the signer.

Most incentives hard-cap each address to one claim, but `ERC20PeggedVariableCriteriaIncentiveV2`
and `ERC20VariableIncentive` do not, by design. `ERC1155Incentive` catalogs
individual claims by transaction hash, as opposed to claimant.


## Deploying PayableLimitedSignerValidator

When deploying the PayableLimitedSignerValidator, you will need to add a `DEPLOYER_PRIVATE_KEY` to the env file. This should be the same key you use to deploy the contracts with. Once set, you can also use it in commands like so: `--private-key $DEPLOYER_PRIVATE_KEY` instead of pasting it directly in the command. Make sure to run `source .env` before running the command to load the env variables into your environment. You can also add an optional `CLAIM_FEE` env variable if you want to set an initial claim fee. If you do not add this, the claim fee will be set to zero, and you will need to update it manually on the base PayableLimitedSignerValidator contract using the deployer address.

To verify the PayableLimitedSignerValidator, you can run this command: 

```bash
forge verify-contract {contractAddress} contracts/validators/PayableLimitedSignerValidator.sol:PayableLimitedSignerValidator --chain {chain} --constructor-args $(cast abi-encode "constructor(address,uint256)" {deployerAddress} {claimFee}) --etherscan-api-key {etherscanApiKey} --watch
```
The items in brackets are variables
- {contractAddress}: Deployed address of the base PayableLimitedSignerValidator (see *deploys* folder)
- {chain}: Forge chain name (base, optimism, sepolia, etc.)
- {deployerAddress}: Address that deployed the contract
- {claimFee}: Initial `CLAIM_FEE` used during deployment
- {etherscanApiKey}: Your Etherscan API key

## Deploying Streaming Contracts

Deploy StreamingManager and StreamingCampaign for streaming incentives.

1. Add env variables:

    ```bash
    DEPLOYER_PRIVATE_KEY=<deployer-key>
    BOOST_DEPLOYMENT_SALT=<deterministic-salt>
    STREAMING_OWNER=<owner-address>
    STREAMING_PROTOCOL_FEE=500              # basis points (500 = 5%)
    STREAMING_FEE_RECEIVER=<fee-recipient>
    STREAMING_OPERATOR=<engine-hot-wallet>  # optional
    ```

2. Deploy:

    ```bash
    forge script script/solidity/Deploy_Streaming.s.sol:DeployStreaming \
      --rpc-url <RPC_URL> \
      --private-key $DEPLOYER_PRIVATE_KEY \
      --broadcast \
      --verify \
      --etherscan-api-key <API_KEY>
    ```

Addresses are saved to `deploys/<chainId>.json`.