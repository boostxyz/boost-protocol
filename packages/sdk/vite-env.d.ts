/// <reference types="vite/client" />

import type { AbiEvent, Address } from 'viem';

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
  readonly VITE_ERC1155_INCENTIVE_BASE: Address;
  readonly VITE_POINTS_INCENTIVE_BASE: Address;
  readonly VITE_SIGNER_VALIDATOR_BASE: Address;

  readonly BoostCoreEvents: Record<string, AbiEvent>;
  readonly ContractActionEvents: Record<string, AbiEvent>;
  readonly ERC721MintActionEvents: Record<string, AbiEvent>;
  readonly SimpleAllowListEvents: Record<string, AbiEvent>;
  readonly SimpleDenyListEvents: Record<string, AbiEvent>;
  readonly SimpleBudgetEvents: Record<string, AbiEvent>;
  readonly VestingBudgetEvents: Record<string, AbiEvent>;
  readonly AllowListIncentiveEvents: Record<string, AbiEvent>;
  readonly CGDAIncentiveEvents: Record<string, AbiEvent>;
  readonly ERC20IncentiveEvents: Record<string, AbiEvent>;
  readonly ERC1155IncentiveEvents: Record<string, AbiEvent>;
  readonly PointsIncentiveEvents: Record<string, AbiEvent>;
  readonly SignerValidatorEvents: Record<string, AbiEvent>;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
