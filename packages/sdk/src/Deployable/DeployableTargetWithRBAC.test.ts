import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { beforeAll, describe, expect, test } from 'vitest';
import { accounts } from '@boostxyz/test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshManagedBudget,
} from '@boostxyz/test/helpers';
import { Roles } from './DeployableTargetWithRBAC';
import { createTestClient, http, zeroAddress, publicActions, walletActions } from 'viem';
import { setupConfig } from '@boostxyz/test/viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';
import { ManagedBudget } from '../Budgets/ManagedBudget';

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
    expect(await budget.hasAllRoles(manager, Roles.MANAGER)).toBe(true);
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

  test('can transfer ownership', async () => {
    const budget = await loadFixture(freshManagedBudget(defaultOptions, fixtures));
    const oldOwner = accounts[0].account;
    const newOwner = accounts[9].account;
    expect(await budget.owner()).toBe(oldOwner);
    
    // Transfer ownership
    await budget.transferOwnership(newOwner);
    
    // Verify the new owner has admin rights
    expect(await budget.owner()).toBe(newOwner);
  });

  test('can renounce ownership', async () => {
    const budget = await loadFixture(freshManagedBudget(defaultOptions, fixtures));
    const owner = accounts[0].account;
    
    // Verify initial owner has admin rights
    expect(await budget.owner()).toBe(owner);
    
    // Renounce ownership
    await budget.renounceOwnership();
    const newOwner = await budget.owner();
    expect(newOwner).toBe(zeroAddress);
  });

  test('supports two-step ownership handover', async () => {
    const budget = await loadFixture(freshManagedBudget(defaultOptions, fixtures));
    const currentOwner = accounts[0].account;
    const newOwner = accounts[6];

    const walletClient = createTestClient({
      transport: http('http://127.0.0.1:8545', { retryCount: 0 }),
      chain: hardhat,
      mode: 'hardhat',
      account: privateKeyToAccount(newOwner.key),
      key: newOwner.key,
    })
    .extend(publicActions)
    .extend(walletActions) as any;
    
    const newOwnerOptions = {
      account: privateKeyToAccount(newOwner.key),
      config: setupConfig(walletClient)
    };

    // Create budget instance with different signer
    const sameBudgetDifferentSigner = new ManagedBudget(
      { config: newOwnerOptions.config, account: newOwnerOptions.account },
      budget.address
    );
    
    await sameBudgetDifferentSigner.requestOwnershipHandover();

    // Verify initial ownership
    expect(await budget.owner()).toBe(currentOwner);
    expect(await sameBudgetDifferentSigner.owner()).toBe(currentOwner);
    
    // Complete handover from current owner
    await budget.completeOwnershipHandover(newOwner.account);
    
    // Verify ownership has transferred
    expect(await budget.owner()).toBe(newOwner.account);
    expect(await sameBudgetDifferentSigner.owner()).toBe(newOwner.account);
  });

  test('ownership handover fails if not requested', async () => {
    const budget = await loadFixture(freshManagedBudget(defaultOptions, fixtures));
    const newOwner = accounts[7].account;
    
    // Try to complete handover without request
    await expect(
      budget.completeOwnershipHandover(newOwner)
    ).rejects.toThrowError('NoHandoverRequest');
  });

  test('can cancel ownership handover', async () => {
    const budget = await loadFixture(freshManagedBudget(defaultOptions, fixtures));
    const currentOwner = accounts[0].account;
    const newOwner = accounts[6];
    
    // Create new options with new owner's account and wallet client
    const walletClient = createTestClient({
      transport: http('http://127.0.0.1:8545', { retryCount: 0 }),
      chain: hardhat,
      mode: 'hardhat',
      account: privateKeyToAccount(newOwner.key),
      key: newOwner.key,
    })
    .extend(publicActions)
    .extend(walletActions) as any;
    
    const newOwnerOptions = {
      account: privateKeyToAccount(newOwner.key),
      config: setupConfig(walletClient)
    };
    
    // Create budget instance with different signer
    const sameBudgetDifferentSigner = new ManagedBudget(
      { config: newOwnerOptions.config, account: newOwnerOptions.account },
      budget.address
    );
    
    // Request handover from new owner account
    await sameBudgetDifferentSigner.requestOwnershipHandover();
    
    // Cancel the handover request
    await sameBudgetDifferentSigner.cancelOwnershipHandover();
    
    // Verify handover can't be completed after cancellation
    await expect(
      budget.completeOwnershipHandover(newOwner.account)
    ).rejects.toThrowError('NoHandoverRequest');
    
    // Verify ownership hasn't changed
    expect(await budget.owner()).toBe(currentOwner);
  });
});
