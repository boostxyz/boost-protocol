import {
  boostCoreAbi,
  prepareBoostPayload,
  prepareContractActionPayload,
  prepareSignerValidatorPayload,
  prepareSimpleAllowListPayload,
  simulateBoostCoreCreateBoost,
} from '@boostxyz/evm';
import { writeContract } from '@wagmi/core';
import { beforeAll, describe, expect, test } from 'vitest';
import { type Fixtures, deployFixtures } from '../test/helpers';
import { setupConfig, testAccount } from '../test/viem';
import { BoostCore } from './BoostCore';
import { awaitResult } from './utils';

let fixtures: Fixtures;

beforeAll(async () => {
  fixtures = await deployFixtures();
});

describe('BoostCore', () => {
  test('can successfully create a boost', async () => {
    const config = setupConfig();
    const { core, bases } = fixtures;
    const client = new BoostCore({
      config: config,
      address: core,
      account: testAccount,
    });
    const boost = await client.createBoost({
      budget: client
        .SimpleBudget({
          owner: testAccount.address,
          authorized: [],
        })
        .at(bases.SimpleBudget.base),
      action: client
        .ContractAction(
          {
            chainId: BigInt(31_337),
            target: core,
            selector: '0xdeadbeef',
            value: 0n,
          },
          true,
        )
        .at(bases.ContractAction.base),
      validator: client
        .SignerValidator(
          {
            signers: [testAccount.address],
          },
          true,
        )
        .at(bases.SignerValidator.base),
      allowList: client
        .SimpleAllowList(
          {
            owner: testAccount.address,
            allowed: [],
          },
          true,
        )
        .at(bases.SimpleAllowList.base),
      incentives: [],
    });
    expect(await client.getBoostCount()).toBe(1n);
    const onChainBoost = await client.getBoost(0n);
    expect(boost.id).toBe(0n);
    expect(boost.action.address).toBe(onChainBoost.action);
    expect(boost.validator.address).toBe(onChainBoost.validator);
    expect(boost.allowList.address).toBe(onChainBoost.allowList);
    expect(boost.budget.address).toBe(onChainBoost.budget);
    expect(boost.protocolFee).toBe(onChainBoost.protocolFee);
    expect(boost.referralFee).toBe(onChainBoost.referralFee);
    expect(boost.maxParticipants).toBe(onChainBoost.maxParticipants);
    expect(boost.owner).toBe(onChainBoost.owner);
    expect(boost.incentives.length).toBe(onChainBoost.incentives.length);
  });

  // TODO is this worth including?
  test.skip('can successfully handle multiple boosts created in parallel', async () => {
    const config = setupConfig();
    const { core, bases } = fixtures;
    const client = new BoostCore({
      config: config,
      address: core,
      account: testAccount,
    });

    const simulatedA = await simulateBoostCoreCreateBoost(config, {
      address: core,
      account: testAccount,
      args: [
        prepareBoostPayload({
          budget: bases.SimpleBudget.base,
          action: {
            instance: bases.ContractAction.base,
            parameters: prepareContractActionPayload({
              chainId: BigInt(31_337),
              target: core,
              selector: '0xdeadbeef',
              value: 0n,
            }),
            isBase: true,
          },
          validator: {
            instance: bases.SignerValidator.base,
            parameters: prepareSignerValidatorPayload({
              signers: [testAccount.address],
            }),
            isBase: true,
          },
          allowList: {
            instance: bases.SimpleAllowList.base,
            parameters: prepareSimpleAllowListPayload({
              owner: testAccount.address,
              allowed: [],
            }),
            isBase: true,
          },
          incentives: [],
          protocolFee: 1n,
          referralFee: 1n,
          maxParticipants: 1n,
          owner: testAccount.address,
        }),
      ],
    });

    console.log(simulatedA);

    const simulatedB = await simulateBoostCoreCreateBoost(config, {
      address: core,
      account: testAccount,
      args: [
        prepareBoostPayload({
          budget: bases.SimpleBudget.base,
          action: {
            instance: bases.ContractAction.base,
            parameters: prepareContractActionPayload({
              chainId: BigInt(31_337),
              target: core,
              selector: '0xdeadbeef',
              value: 0n,
            }),
            isBase: true,
          },
          validator: {
            instance: bases.SignerValidator.base,
            parameters: prepareSignerValidatorPayload({
              signers: [testAccount.address],
            }),
            isBase: true,
          },
          allowList: {
            instance: bases.SimpleAllowList.base,
            parameters: prepareSimpleAllowListPayload({
              owner: testAccount.address,
              allowed: [],
            }),
            isBase: true,
          },
          incentives: [],
          protocolFee: 2n,
          referralFee: 2n,
          maxParticipants: 2n,
          owner: testAccount.address,
        }),
      ],
    });

    console.log(simulatedB);

    const txB = await writeContract(config, simulatedB.request);
    const txA = await writeContract(config, simulatedA.request);

    const bResult = await awaitResult(
      config,
      Promise.resolve(txB),
      boostCoreAbi,
      simulateBoostCoreCreateBoost,
    );
    console.log(bResult);
    const aResult = await awaitResult(
      config,
      Promise.resolve(txA),
      boostCoreAbi,
      simulateBoostCoreCreateBoost,
    );
    console.log(aResult);

    console.log(await client.getBoost(0n));
    console.log(await client.getBoost(1n));
  });
});
