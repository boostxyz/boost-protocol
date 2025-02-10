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
| base-sepolia | `https://api-sepolia.basescan.org/api` |
| arb-mainnet | [`https://api.arbiscan.io/api`](https://api.arbiscan.io/api) |
| opt-mainnet | [`https://api-optimistic.etherscan.io/api`](https://api-optimistic.etherscan.io/api) |
| base-mainnet | [`https://api.basescan.org/api`](https://api.basescan.org/api) |

## Security Model

`SignerValidator` limits claims on individual claim data, which can allow for multiple
claims of the same incentive by a given address, as long as a unique action is signed off
by the Signer.

`LimitedSignerValidator` hard caps the claim quantity for a given incentive
regardless of the validity of individual action requests presented to the signer.

Most incentives hard-cap each address to one claim, but `ERC20PeggedVariableCriteriaIncentive`
does not, by design.
