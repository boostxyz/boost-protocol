import { zeroAddress, zeroHash } from 'viem';
import { beforeAll, test } from 'vitest';
import { type Fixtures, deployFixtures } from '../test/helpers';
import { setupConfig, testAccount } from '../test/viem';
import { ContractAction } from './Actions/ContractAction';
import { SimpleAllowList } from './AllowLists/SimpleAllowList';
import { BoostCore } from './BoostCore';
import { SimpleBudget } from './Budgets/Budget';
import { SignerValidator } from './Validators/SignerValidator';

let fixtures: Fixtures,
  config = setupConfig();

beforeAll(async () => {
  fixtures = await deployFixtures();
});

test('expect true', async () => {
  console.log(fixtures);
  const { core, bases } = fixtures;
  const client = new BoostCore({
    config: config,
    address: core,
    account: testAccount,
  });
  await client.createBoost({
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
});
