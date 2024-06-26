import { isAddress } from 'viem';
import { beforeAll, expect, test } from 'vitest';
import { type Fixtures, deployFixtures } from '../test/helpers';

let fixtures: Fixtures;

beforeAll(async () => {
  fixtures = await deployFixtures();
});

test('expect true', async () => {
  console.log(fixtures);
  expect(isAddress(fixtures.core)).toBe(true);
});
