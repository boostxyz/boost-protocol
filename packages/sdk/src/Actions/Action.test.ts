import { selectors } from '@boostxyz/signatures/events';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import type { Hex } from 'viem';
import { beforeAll, beforeEach, describe, test } from 'vitest';
import type { MockERC721 } from '../../test/MockERC721';
import { accounts } from '../../test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  fundErc721,
} from '../../test/helpers';
import {
  type EventActionPayloadSimple,
  FilterType,
  PrimitiveType,
  SignatureType,
} from '../utils';
import { actionFromAddress } from './Action';

let fixtures: Fixtures, erc721: MockERC721;

export function basicErc721TransferAction(
  erc721: MockERC721,
): EventActionPayloadSimple {
  return {
    actionClaimant: {
      signatureType: SignatureType.EVENT,
      signature: selectors['Transfer(address,address,uint256)'] as Hex,
      fieldIndex: 2,
      targetContract: erc721.assertValidAddress(),
    },
    actionSteps: [
      {
        signature: selectors['Transfer(address,address,uint256)'] as Hex,
        signatureType: SignatureType.EVENT,
        actionType: 0,
        targetContract: erc721.assertValidAddress(),
        actionParameter: {
          filterType: FilterType.EQUAL,
          fieldType: PrimitiveType.ADDRESS,
          fieldIndex: 2,
          filterData: accounts.at(1)!.account,
        },
      },
    ],
  };
}

export function cloneEventAction(fixtures: Fixtures, erc721: MockERC721) {
  return function cloneEventAction() {
    return fixtures.registry.clone(
      crypto.randomUUID(),
      new fixtures.bases.EventAction(
        defaultOptions,
        basicErc721TransferAction(erc721),
      ),
    );
  };
}

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures);
});

describe('Action', () => {
  beforeEach(async () => {
    erc721 = await loadFixture(fundErc721(defaultOptions));
  });

  test('can automatically instantiate EventAction given an action address', async () => {
    const _action = await loadFixture(cloneEventAction(fixtures, erc721));
    const action = await actionFromAddress(
      defaultOptions,
      _action.assertValidAddress(),
    );
    console.log(action);
  });
});
