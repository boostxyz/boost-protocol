/// <reference types="vite/client" />

import type { Address } from 'viem';

interface ImportMetaEnv {
  readonly VITE_BOOST_REGISTRY_ADDRESS: Address;
  readonly VITE_BOOST_CORE_ADDRESS: Address;
  readonly VITE_CONTRACT_ACTION_BASE: Address;
  readonly VITE_ERC721_MINT_ACTION_BASE: Address;
  readonly VITE_SIMPLE_ALLOWLIST_BASE: Address;
  readonly VITE_SIMPLE_DENYLIST_BASE: Address;
  readonly VITE_SIMPLE_BUDGET_BASE: Address;
  readonly VITE_VESTING_BUDGET_BASE: Address;
  readonly VITE_ALLOWLIST_INCENTIVE_BASE: Address;
  readonly VITE_CGDA_INCENTIVE_BASE: Address;
  readonly VITE_ERC20_INCENTIVE_BASE: Address;
  readonly VITE_ERC20_VARIABLE_INCENTIVE_BASE: Address;
  readonly VITE_ERC1155_INCENTIVE_BASE: Address;
  readonly VITE_POINTS_INCENTIVE_BASE: Address;
  readonly VITE_SIGNER_VALIDATOR_BASE: Address;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
