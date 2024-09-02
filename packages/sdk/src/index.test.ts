import { describe, expect, test } from 'vitest';
import * as SDK from './index';

describe('sdk exports', () => {
  test(`should export all public API`, () => {
    expect(SDK.BoostRegistry).toBeDefined();
    expect(SDK.BoostCore).toBeDefined();
    expect(SDK.Boost).toBeDefined();

    // interfaces
    expect(SDK.PassthroughAuth).toBeDefined();
    expect(SDK.ContractAction).toBeDefined();
    expect(SDK.ERC721MintAction).toBeDefined();
    expect(SDK.SimpleAllowList).toBeDefined();
    expect(SDK.SimpleDenyList).toBeDefined();
    expect(SDK.SimpleBudget).toBeDefined();
    expect(SDK.VestingBudget).toBeDefined();
    expect(SDK.AllowListIncentive).toBeDefined();
    expect(SDK.CGDAIncentive).toBeDefined();
    expect(SDK.ERC20Incentive).toBeDefined();
    expect(SDK.ERC1155Incentive).toBeDefined();
    expect(SDK.PointsIncentive).toBeDefined();
    expect(SDK.SignerValidator).toBeDefined();

    // errors
    expect(SDK.BoostCoreNoIdentifierEmitted).toBeDefined();
    expect(SDK.ContractAddressRequiredError).toBeDefined();
    expect(SDK.DeployableAlreadyDeployedError).toBeDefined();
    expect(SDK.DeployableBuildParametersUnspecifiedError).toBeDefined();
    expect(SDK.DeployableUnknownOwnerProvidedError).toBeDefined();
    expect(SDK.DeployableWagmiConfigurationRequiredError).toBeDefined();
    expect(SDK.DeployableMissingPayloadError).toBeDefined();
    expect(SDK.NoContractAddressUponReceiptError).toBeDefined();
    expect(SDK.InvalidComponentInterfaceError).toBeDefined();
    expect(SDK.UnknownTransferPayloadSupplied).toBeDefined();
    expect(SDK.BudgetMustAuthorizeBoostCore).toBeDefined();
    expect(SDK.IncentiveNotCloneableError).toBeDefined();
  });
});
