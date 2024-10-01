import { selectors } from '@boostxyz/signatures/events';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import type { Hex } from 'viem';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import type { MockERC721 } from '@boostxyz/test/MockERC721';
import { accounts } from '@boostxyz/test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  fundErc721,
} from '@boostxyz/test/helpers';
import { EventAction, actionFromAddress } from './Action';
import {
  type EventActionPayloadSimple,
  FilterType,
  PrimitiveType,
  SignatureType,
} from './EventAction';

let fixtures: Fixtures, erc721: MockERC721;

export function basicErc721TransferAction(
  erc721: MockERC721,
): EventActionPayloadSimple {
  return {
    actionClaimant: {
      chainid: 31337,
      signatureType: SignatureType.EVENT,
      signature: selectors[
        'Transfer(address indexed,address indexed,uint256 indexed)'
      ] as Hex,
      fieldIndex: 1,
      targetContract: erc721.assertValidAddress(),
    },
    actionSteps: [
      {
        chainid: 31337,
        signature: selectors[
          'Transfer(address indexed,address indexed,uint256 indexed)'
        ] as Hex,
        signatureType: SignatureType.EVENT,
        targetContract: erc721.assertValidAddress(),
        actionParameter: {
          filterType: FilterType.EQUAL,
          fieldType: PrimitiveType.ADDRESS,
          fieldIndex: 1,
          filterData: accounts[1].account,
        },
      },
    ],
  };
}

export function cloneEventAction(fixtures: Fixtures, erc721: MockERC721) {
  return function cloneEventAction() {
    return fixtures.registry.initialize(
      crypto.randomUUID(),
      fixtures.core.EventAction(basicErc721TransferAction(erc721)),
    );
  };
}

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures(defaultOptions));
});

describe('Action', () => {
  beforeEach(async () => {
    erc721 = await loadFixture(fundErc721(defaultOptions));
  });

  test('can automatically instantiate EventAction given an address', async () => {
    const _action = await loadFixture(cloneEventAction(fixtures, erc721));
    expect(
      await actionFromAddress(defaultOptions, _action.assertValidAddress()),
    ).toBeInstanceOf(EventAction);
  });
});
