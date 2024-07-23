import { mockErc721Abi } from '@boostxyz/evm';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import {
  encodeAbiParameters,
  encodeFunctionData,
  isAddress,
  parseEther,
  toFunctionSelector,
  zeroAddress,
} from 'viem';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import type { MockERC721 } from '../../test/MockERC721';
import { accounts } from '../../test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  fundErc721,
} from '../../test/helpers';
import { ERC721MintAction } from './ERC721MintAction';

let fixtures: Fixtures, erc721: MockERC721;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures);
});

const mintSelector = toFunctionSelector('function mint(address to)');

function nonPayableAction(fixtures: Fixtures, erc721: MockERC721) {
  return function nonPayableAction() {
    return fixtures.registry.clone(
      crypto.randomUUID(),
      new fixtures.bases.ERC721MintAction(defaultOptions, {
        chainId: BigInt(31_337),
        target: erc721.assertValidAddress(),
        selector: mintSelector,
        value: 0n,
      }),
    );
  };
}

describe('ERC721MintAction', () => {
  beforeEach(async () => {
    erc721 = await loadFixture(fundErc721(defaultOptions));
  });

  test('can successfully be deployed', async () => {
    const action = new ERC721MintAction(defaultOptions, {
      chainId: BigInt(31_337),
      target: zeroAddress,
      selector: '0xdeadbeef',
      value: 2n,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test('can read chain id', async () => {
    const action = await loadFixture(nonPayableAction(fixtures, erc721));
    expect(await action.chainId()).toBe(BigInt(31_337));
  });

  test('can read target', async () => {
    const action = await loadFixture(nonPayableAction(fixtures, erc721));
    expect((await action.target()).toLowerCase()).toBe(
      erc721.assertValidAddress().toLowerCase(),
    );
  });

  test('can read selector', async () => {
    const action = await loadFixture(nonPayableAction(fixtures, erc721));
    expect(await action.selector()).toBe(mintSelector);
  });

  test('can read value', async () => {
    const action = await loadFixture(nonPayableAction(fixtures, erc721));
    expect(await action.value()).toBe(0n);
  });

  test('prepare will properly encode execution payload', async () => {
    const action = await loadFixture(nonPayableAction(fixtures, erc721));
    const { account } = accounts.at(1)!;
    const payload = await action.prepare(
      encodeAbiParameters([{ type: 'address', name: 'address' }], [account]),
    );
    expect(payload).toBe(
      encodeFunctionData({
        abi: mockErc721Abi,
        functionName: 'mint',
        args: [account],
      }),
    );
  });

  // TODO implement execute
  test.skip('nonpayable execute', async () => {
    const action = await loadFixture(nonPayableAction(fixtures, erc721));
    const { account } = accounts.at(1)!;
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
  });
});
