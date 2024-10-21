import {
  rbacAbi,
  readRbacHasAllRoles,
  readRbacHasAnyRole,
  readRbacIsAuthorized,
  readRbacRolesOf,
  simulateRbacGrantManyRoles,
  simulateRbacGrantRoles,
  simulateRbacRevokeManyRoles,
  simulateRbacRevokeRoles,
  simulateRbacSetAuthorized,
  writeRbacGrantManyRoles,
  writeRbacGrantRoles,
  writeRbacRevokeManyRoles,
  writeRbacRevokeRoles,
  writeRbacSetAuthorized,
} from '@boostxyz/evm';
import type { Abi, Address, ContractEventName } from 'viem';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { GenericLog, ReadParams, WriteParams } from '../utils';
export { rbacAbi };

/**
 *  Enum representing available roles for use with the `RBAC` authorization scheme.
 * `MANAGER` has lowest level of write permissions, for specific implementations, see Budgets and ALlowLists
 * `ADMIN` can additionally manage authorized users on the contract.
 *
 * @export
 * @type {{ readonly MANAGER: 1n; readonly ADMIN_ROLE: 2n; }}
 * @enum {bigint}
 */
export enum Roles {
  //@ts-expect-error ts doesn't like bigint enum values
  MANAGER = 1n,
  //@ts-expect-error ts doesn't like bigint enum values
  ADMIN = 2n,
}

/**
 * A generic `viem.Log` event with support for `Rbac` event types.
 *
 * @export
 * @typedef {RBACLog}
 * @template {ContractEventName<typeof rbacAbi>} [event=ContractEventName<
 *     typeof rbacAbi
 *   >]
 */
export type RBACLog<
  event extends ContractEventName<typeof rbacAbi> = ContractEventName<
    typeof rbacAbi
  >,
> = GenericLog<typeof rbacAbi, event>;

/**
 * A minimal RBAC implementation that offers MANAGER and ADMIN roles, and
 * Budgets and allowlists support this auth scheme
 *
 * @export
 * @class DeployableTargetWithRBAC
 * @typedef {DeployableTargetWithRBAC}
 * @extends {DeployableTarget<RbacPayload>}
 */
export class DeployableTargetWithRBAC<
  Payload,
  ABI extends Abi,
> extends DeployableTarget<Payload, ABI> {
  /**
   * Set the authorized status of the given accounts
   * The mechanism for managing authorization is left to the implementing contract
   *
   * @public
   * @async
   * @param {Address[]} addresses - The accounts to authorize or deauthorize
   * @param {boolean[]} allowed - The authorization status for the given accounts
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof rbacAbi, 'setAuthorized'>,
  ) {
    return await this.awaitResult(
      this.setAuthorizedRaw(addresses, allowed, params),
    );
  }

  /**
   * Set the authorized status of the given accounts
   * The mechanism for managing authorization is left to the implementing contract
   *
   * @public
   * @async
   * @param {Address[]} addresses - The accounts to authorize or deauthorize
   * @param {boolean[]} allowed - The authorization status for the given accounts
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async setAuthorizedRaw(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof rbacAbi, 'setAuthorized'>,
  ) {
    const { request, result } = await simulateRbacSetAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [addresses, allowed],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    const hash = await writeRbacSetAuthorized(this._config, request);
    return { hash, result };
  }

  /**
   * Grant permissions for a user on the rbac.
   *
   * @example
   * ```ts
   * await rbac.grantRoles('0xfoo', RbacRoles.MANAGER)
   * ```
   * @public
   * @async
   * @param {Address} address
   * @param {Roles} role
   * @param {?WriteParams<typeof rbacAbi, 'grantRoles'>} [params]
   * @returns {Promise<void>}
   */
  public async grantRoles(
    address: Address,
    role: Roles,
    params?: WriteParams<typeof rbacAbi, 'grantRoles'>,
  ) {
    return await this.awaitResult(this.grantRolesRaw(address, role, params));
  }

  /**
   * Grant permissions for a user on the rbac.
   *
   * @example
   * ```ts
   * await rbac.grantRoles('0xfoo', Roles.MANAGER)
   *
   * @public
   * @async
   * @param {Address} address
   * @param {Roles} role
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async grantRolesRaw(
    address: Address,
    role: Roles,
    params?: WriteParams<typeof rbacAbi, 'grantRoles'>,
  ) {
    const { request, result } = await simulateRbacGrantRoles(this._config, {
      address: this.assertValidAddress(),
      args: [address, role],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    const hash = await writeRbacGrantRoles(
      this._config,
      // biome-ignore lint/suspicious/noExplicitAny: negligible low level lack of type intersection
      request as any,
    );
    return { hash, result };
  }

  /**
   * Revoke permissions for a user on the rbac.
   *
   * @example
   * ```ts
   * await rbac.revokeRoles('0xfoo', Roles.MANAGER)
   *
   * @public
   * @async
   * @param {Address} address
   * @param {Roles} role
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async revokeRoles(
    address: Address,
    role: Roles,
    params?: WriteParams<typeof rbacAbi, 'revokeRoles'>,
  ) {
    return await this.awaitResult(this.revokeRolesRaw(address, role, params));
  }

  /**
   * Revoke permissions for a user on the rbac.
   *
   * @example
   * ```ts
   * await rbac.revokeRoles('0xfoo', Roles.MANAGER)
   * @public
   * @async
   * @param {Address} address
   * @param {Roles} role
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async revokeRolesRaw(
    address: Address,
    role: Roles,
    params?: WriteParams<typeof rbacAbi, 'revokeRoles'>,
  ) {
    const { request, result } = await simulateRbacRevokeRoles(this._config, {
      address: this.assertValidAddress(),
      args: [address, role],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    const hash = await writeRbacRevokeRoles(
      this._config,
      // biome-ignore lint/suspicious/noExplicitAny: negligible low level lack of type intersection
      request as any,
    );
    return { hash, result };
  }

  /**
   * Grant many accounts permissions on the rbac.
   *
   * @example
   * ```ts
   * await rbac.grantManyRoles(['0xfoo', '0xbar], [Roles.MANAGER, Roles.ADMIN])
   * ```
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {Roles[]} roles
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async grantManyRoles(
    addresses: Address[],
    roles: Roles[],
    params?: WriteParams<typeof rbacAbi, 'grantManyRoles'>,
  ) {
    return await this.awaitResult(
      this.grantManyRolesRaw(addresses, roles, params),
    );
  }

  /**
   * Grant many accounts permissions on the rbac.
   *
   * @example
   * ```ts
   * await rbac.grantManyRoles(['0xfoo', '0xbar], [Roles.MANAGER, Roles.ADMIN])
   *
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {Roles[]} roles
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async grantManyRolesRaw(
    addresses: Address[],
    roles: Roles[],
    params?: WriteParams<typeof rbacAbi, 'grantManyRoles'>,
  ) {
    const { request, result } = await simulateRbacGrantManyRoles(this._config, {
      address: this.assertValidAddress(),
      args: [addresses, roles],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    const hash = await writeRbacGrantManyRoles(
      this._config,
      // biome-ignore lint/suspicious/noExplicitAny: negligible low level lack of type intersection
      request as any,
    );
    return { hash, result };
  }

  /**
   * Revoke many accounts' permissions on the rbac.
   *
   * @example
   * ```ts
   * await rbac.revokeManyRoles(['0xfoo', '0xbar], [Roles.MANAGER, Roles.ADMIN])
   *
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {Roles[]} roles
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async revokeManyRoles(
    addresses: Address[],
    roles: Roles[],
    params?: WriteParams<typeof rbacAbi, 'revokeManyRoles'>,
  ) {
    return await this.awaitResult(
      this.revokeManyRolesRaw(addresses, roles, params),
    );
  }

  /**
   * Revoke many accounts' permissions on the rbac.
   *
   * @example
   * ```ts
   * await rbac.revokeManyRoles(['0xfoo', '0xbar], [Roles.MANAGER, Roles.ADMIN])
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {Roles[]} roles
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async revokeManyRolesRaw(
    addresses: Address[],
    roles: Roles[],
    params?: WriteParams<typeof rbacAbi, 'revokeManyRoles'>,
  ) {
    const { request, result } = await simulateRbacRevokeManyRoles(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [addresses, roles],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeRbacRevokeManyRoles(
      this._config,
      // biome-ignore lint/suspicious/noExplicitAny: negligible low level lack of type intersection
      request as any,
    );
    return { hash, result };
  }

  /**
   * Return an array of the roles assigned to the given account.
   * @example
   * ```ts
   * (await rbac.rolesOf(0xfoo)).includes(Roles.ADMIN)
   * @public
   * @param {Address} account
   * @param {?ReadParams} [params]
   * @returns {Promise<Array<Roles>>}
   */
  public async rolesOf(
    account: Address,
    params?: ReadParams<typeof rbacAbi, 'rolesOf'>,
  ) {
    const roles = await readRbacRolesOf(this._config, {
      address: this.assertValidAddress(),
      args: [account],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    return ([Roles.MANAGER, Roles.ADMIN] as unknown as Array<bigint>).filter(
      (role) => (roles & role) === role,
    ) as unknown as Roles[];
  }

  /**
   * Returns whether given account has any of the provided roles bitmap.
   *
   * @example
   * ```ts
   * await rbac.hasAnyRole(0xfoo, Roles.ADMIN | Roles.MANAGER)
   * @public
   * @param {Address} account
   * @param {Roles} roles
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>}
   */
  public hasAnyRole(
    account: Address,
    roles: Roles,
    params?: ReadParams<typeof rbacAbi, 'hasAnyRole'>,
  ) {
    return readRbacHasAnyRole(this._config, {
      address: this.assertValidAddress(),
      args: [account, roles],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Returns whether given account has all of the provided roles bitmap.
   *
   * @example
   * ```ts
   * await rbac.hasAllRoles(0xfoo, Roles.ADMIN & Roles.MANAGER)
   *
   * @public
   * @param {Address} account
   * @param {Roles} roles
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>}
   */
  public hasAllRoles(
    account: Address,
    roles: Roles,
    params?: ReadParams<typeof rbacAbi, 'hasAllRoles'>,
  ) {
    return readRbacHasAllRoles(this._config, {
      address: this.assertValidAddress(),
      args: [account, roles],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Check if the given account is authorized to use the rbac
   *
   * @public
   * @param {Address} account
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} - True if the account is authorized
   */
  public isAuthorized(
    account: Address,
    params?: ReadParams<typeof rbacAbi, 'isAuthorized'>,
  ) {
    return readRbacIsAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [account],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }
}
