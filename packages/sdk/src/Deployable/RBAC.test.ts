import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { beforeAll, describe, expect, test } from 'vitest';
import { accounts } from '@boostxyz/test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshManagedBudget,
} from '@boostxyz/test/helpers';
import { Roles } from '../Deployable/DeployableTargetWithRBAC';

let fixtures: Fixtures;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures(defaultOptions));
});

describe('RBAC', () => {
  test('can grant roles', async () => {
    const budget = await loadFixture(freshManagedBudget(defaultOptions, fixtures));
    const manager = accounts[0].account;
    expect(await budget.rolesOf(manager)).not.toContain(Roles.MANAGER);
    await budget.grantRoles(manager, Roles.MANAGER);
    expect(await budget.rolesOf(manager)).toContain(Roles.MANAGER);
  });

  test('can revoke roles', async () => {
    const budget = await loadFixture(freshManagedBudget(defaultOptions, fixtures));
    const admin = accounts[1].account;
    await budget.grantRoles(admin, Roles.ADMIN);
    expect(await budget.rolesOf(admin)).toContain(Roles.ADMIN);
    await budget.revokeRoles(admin, Roles.ADMIN);
    expect(await budget.rolesOf(admin)).not.toContain(Roles.ADMIN);
  });

  test('can grant many roles', async () => {
    const budget = await loadFixture(freshManagedBudget(defaultOptions, fixtures));
    const admin = accounts[2].account;
    const manager = accounts[3].account;
    await budget.grantManyRoles(
      [admin, manager],
      [Roles.ADMIN, Roles.MANAGER],
    );
    expect(await budget.hasAllRoles(admin, Roles.ADMIN)).toBe(true);
    expect(await budget.hasAllRoles(manager, Roles.MANAGER & Roles.ADMIN)).toBe(true);
  });

  test('can revoke many roles', async () => {
    const budget = await loadFixture(freshManagedBudget(defaultOptions, fixtures));
    const admin = accounts[4].account;
    const manager = accounts[5].account;
    await budget.grantManyRoles(
      [admin, manager],
      [Roles.ADMIN, Roles.MANAGER],
    );
    expect(await budget.hasAllRoles(admin, Roles.ADMIN)).toBe(true);
    expect(await budget.hasAllRoles(manager, Roles.MANAGER)).toBe(true);
    await budget.revokeManyRoles(
      [admin, manager],
      [Roles.ADMIN, Roles.MANAGER],
    );
    expect(await budget.hasAllRoles(admin, Roles.ADMIN)).toBe(false);
    expect(await budget.hasAllRoles(manager, Roles.MANAGER)).toBe(false);
  });

  test('can check for any role', async () => {
    const budget = await loadFixture(freshManagedBudget(defaultOptions, fixtures));
    const user = accounts[6].account;
    expect(await budget.hasAnyRole(user, Roles.MANAGER | Roles.ADMIN)).toBe(false);
    await budget.grantRoles(user, Roles.MANAGER);
    expect(await budget.hasAnyRole(user, Roles.MANAGER | Roles.ADMIN)).toBe(true);
  });

  test('can check for all roles', async () => {
    const budget = await loadFixture(freshManagedBudget(defaultOptions, fixtures));
    const user = accounts[7].account;
    await budget.grantRoles(user, Roles.MANAGER);
    expect(await budget.hasAllRoles(user, Roles.MANAGER | Roles.ADMIN)).toBe(false);
    await budget.grantRoles(user, Roles.ADMIN);
    expect(await budget.hasAllRoles(user, Roles.MANAGER | Roles.ADMIN)).toBe(true);
  });

  test('can get roles of an account', async () => {
    const budget = await loadFixture(freshManagedBudget(defaultOptions, fixtures));
    const user = accounts[8].account;
    await budget.grantRoles(user, Roles.MANAGER | Roles.ADMIN);
    const roles = await budget.rolesOf(user);
    expect(roles).toContain(Roles.MANAGER);
    expect(roles).toContain(Roles.ADMIN);
  });

  test('can set and check authorization', async () => {
    const budget = await loadFixture(freshManagedBudget(defaultOptions, fixtures));
    const user = accounts[9].account;
    expect(await budget.rolesOf(user)).not.toContain(Roles.MANAGER);
    await budget.setAuthorized([user], [true]);
    expect(await budget.isAuthorized(user)).toBe(true);
    expect(await budget.rolesOf(user)).toContain(Roles.MANAGER);
    await budget.setAuthorized([user], [false]);
    expect(await budget.isAuthorized(user)).toBe(false);
    expect(await budget.rolesOf(user)).not.toContain(Roles.MANAGER);
  });
});
