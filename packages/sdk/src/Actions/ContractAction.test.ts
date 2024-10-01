import { mockErc20Abi, readMockErc20BalanceOf } from '@boostxyz/evm';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import {
  ContractFunctionExecutionError,
  encodeAbiParameters,
  encodeFunctionData,
  isAddress,
  parseEther,
  toFunctionSelector,
  zeroAddress,
} from 'viem';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import type { MockERC20 } from '@boostxyz/test/MockERC20';
import { accounts } from '@boostxyz/test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  fundErc20,
} from '@boostxyz/test/helpers';
import { ContractAction } from './ContractAction';

let fixtures: Fixtures, erc20: MockERC20;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures(defaultOptions));
});

const mintPayableSelector = toFunctionSelector(
  'function mintPayable(address to, uint256 amount)',
);

const mintSelector = toFunctionSelector(
  'function mint(address to, uint256 amount)',
);

function payableContractAction(fixtures: Fixtures, erc20: MockERC20) {
  return function payableContractAction() {
    return fixtures.registry.initialize(
      crypto.randomUUID(),
      fixtures.core.ContractAction({
        chainId: BigInt(31_337),
        target: erc20.assertValidAddress(),
        selector: mintPayableSelector,
        value: parseEther('0.1'),
      }),
    );
  };
}

function nonPayableAction(fixtures: Fixtures, erc20: MockERC20) {
  return function nonPayableAction() {
    return fixtures.registry.initialize(
      crypto.randomUUID(),
      fixtures.core.ContractAction({
        chainId: BigInt(31_337),
        target: erc20.assertValidAddress(),
        selector: mintSelector,
        value: 0n,
      }),
    );
  };
}

function otherAction(fixtures: Fixtures, erc20: MockERC20) {
  return function nonPayableAction() {
    return fixtures.registry.initialize(
      crypto.randomUUID(),
      fixtures.core.ContractAction({
        chainId: BigInt(31_337) + 1n,
        target: erc20.assertValidAddress(),
        selector: mintSelector,
        value: parseEther('0.1'),
      }),
    );
  };
}

describe.skip('ContractAction', () => {
  beforeEach(async () => {
    erc20 = await loadFixture(fundErc20(defaultOptions));
  });

  test('can successfully be deployed', async () => {
    const action = new ContractAction(defaultOptions, {
      chainId: BigInt(31_337),
      target: zeroAddress,
      selector: '0xdeadbeef',
      value: 2n,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test('can read chain id', async () => {
    const action = await loadFixture(payableContractAction(fixtures, erc20));
    expect(await action.chainId()).toBe(BigInt(31_337));
  });

  test('can read target', async () => {
    const action = await loadFixture(payableContractAction(fixtures, erc20));
    expect((await action.target()).toLowerCase()).toBe(
      erc20.assertValidAddress().toLowerCase(),
    );
  });

  test('can read selector', async () => {
    const action = await loadFixture(payableContractAction(fixtures, erc20));
    expect(await action.selector()).toBe(mintPayableSelector);
  });

  test('can read value', async () => {
    const action = await loadFixture(payableContractAction(fixtures, erc20));
    expect(await action.value()).toBe(parseEther('0.1'));
  });

  test('prepare will properly encode execution payload', async () => {
    const action = await loadFixture(payableContractAction(fixtures, erc20));
    const { account } = accounts[1];
    const payload = await action.prepare(
      encodeAbiParameters(
        [
          { type: 'address', name: 'address' },
          { type: 'uint256', name: 'value' },
        ],
        [account, parseEther('100')],
      ),
    );
    expect(payload).toBe(
      encodeFunctionData({
        abi: mockErc20Abi,
        functionName: 'mintPayable',
        args: [account, parseEther('100')],
      }),
    );
  });

  test('payable execute', async () => {
    const action = await loadFixture(payableContractAction(fixtures, erc20));
    const { account } = accounts[1];
    await action.execute(
      encodeAbiParameters(
        [
          { type: 'address', name: 'to' },
          { type: 'uint256', name: 'amount' },
        ],
        [account, parseEther('0.1')],
      ),
      { value: parseEther('0.1') },
    );
    expect(
      await readMockErc20BalanceOf(defaultOptions.config, {
        address: erc20.assertValidAddress(),
        args: [account],
      }),
    ).toBe(parseEther('0.1'));
  });

  test('nonpayable execute', async () => {
    const action = await loadFixture(nonPayableAction(fixtures, erc20));
    const { account } = accounts[1];
    const [success] = await action.execute(
      encodeAbiParameters(
        [
          { type: 'address', name: 'to' },
          { type: 'uint256', name: 'amount' },
        ],
        [account, parseEther('100')],
      ),
    );
    expect(success).toBe(true);
    expect(
      await readMockErc20BalanceOf(defaultOptions.config, {
        address: erc20.assertValidAddress(),
        args: [account],
      }),
    ).toBe(parseEther('100'));
  });

  test('different chain id should throw', async () => {
    const action = await loadFixture(otherAction(fixtures, erc20));
    const { account } = accounts[1];
    try {
      await action.execute(
        encodeAbiParameters(
          [
            { type: 'address', name: 'to' },
            { type: 'uint256', name: 'amount' },
          ],
          [account, parseEther('100')],
        ),
      );
    } catch (e) {
      expect(e).toBeInstanceOf(ContractFunctionExecutionError);
    }
  });
});
