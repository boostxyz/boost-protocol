import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from '@wagmi/core/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const actionAbi = [
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'ExecuteNotImplemented' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'executor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'success', internalType: 'bool', type: 'bool', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ActionExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'isValidated',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ActionValidated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VALIDATOR',
    outputs: [
      { name: '', internalType: 'contract Validator', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'execute',
    outputs: [
      { name: '', internalType: 'bool', type: 'bool' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'prepare',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AllowList
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const allowListAbi = [
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user_', internalType: 'address', type: 'address' },
      { name: 'data_', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'isAllowed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AllowListIncentive
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const allowListIncentiveAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'ClaimFailed' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotClaimable' },
  { type: 'error', inputs: [], name: 'NotImplemented' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'Reentrancy' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allowList',
    outputs: [
      { name: '', internalType: 'contract SimpleAllowList', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'claim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'claimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claims',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'isClaimable',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'limit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'preflight',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'reclaim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BasePaymaster
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const basePaymasterAbi = [
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unstakeDelaySec', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'addStake',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'entryPoint',
    outputs: [
      { name: '', internalType: 'contract IEntryPoint', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'mode',
        internalType: 'enum IPaymaster.PostOpMode',
        type: 'uint8',
      },
      { name: 'context', internalType: 'bytes', type: 'bytes' },
      { name: 'actualGasCost', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'postOp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unlockStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'userOp',
        internalType: 'struct UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verificationGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'preVerificationGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxPriorityFeePerGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'userOpHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'maxCost', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'validatePaymasterUserOp',
    outputs: [
      { name: 'context', internalType: 'bytes', type: 'bytes' },
      { name: 'validationData', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'withdrawAddress',
        internalType: 'address payable',
        type: 'address',
      },
    ],
    name: 'withdrawStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'withdrawAddress',
        internalType: 'address payable',
        type: 'address',
      },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BoostAccount
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const boostAccountAbi = [
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  { type: 'error', inputs: [], name: 'UnauthorizedCallContext' },
  { type: 'error', inputs: [], name: 'UpgradeFailed' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'roles',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'RolesUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'OWNER_ROLE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'addDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegate', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'delegateExecute',
    outputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'entryPoint',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'execute',
    outputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct ERC4337.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'executeBatch',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDeposit',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'grantRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasAllRoles',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasAnyRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner_', internalType: 'address', type: 'address' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'isValidSignature',
    outputs: [{ name: 'result', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'roles', internalType: 'uint256', type: 'uint256' }],
    name: 'renounceRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'revokeRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'rolesOf',
    outputs: [{ name: 'roles', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'storageSlot', internalType: 'bytes32', type: 'bytes32' }],
    name: 'storageLoad',
    outputs: [{ name: 'result', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'storageSlot', internalType: 'bytes32', type: 'bytes32' },
      { name: 'storageValue', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'storageStore',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'userOp',
        internalType: 'struct ERC4337.UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verificationGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'preVerificationGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxPriorityFeePerGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'userOpHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'missingAccountFunds', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'validateUserOp',
    outputs: [
      { name: 'validationData', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawDepositTo',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BoostCore
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const boostCoreAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'registry_',
        internalType: 'contract BoostRegistry',
        type: 'address',
      },
      {
        name: 'protocolFeeReceiver_',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  {
    type: 'error',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'ClaimFailed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientFunds',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedInterface', internalType: 'bytes4', type: 'bytes4' },
      { name: 'instance', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidInstance',
  },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'Reentrancy' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claimFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'boostId_', internalType: 'uint256', type: 'uint256' },
      { name: 'incentiveId_', internalType: 'uint256', type: 'uint256' },
      { name: 'referrer_', internalType: 'address', type: 'address' },
      { name: 'data_', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'claimIncentive',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'createBoost',
    outputs: [
      {
        name: '',
        internalType: 'struct BoostLib.Boost',
        type: 'tuple',
        components: [
          { name: 'action', internalType: 'contract Action', type: 'address' },
          {
            name: 'validator',
            internalType: 'contract Validator',
            type: 'address',
          },
          {
            name: 'allowList',
            internalType: 'contract AllowList',
            type: 'address',
          },
          { name: 'budget', internalType: 'contract Budget', type: 'address' },
          {
            name: 'incentives',
            internalType: 'contract Incentive[]',
            type: 'address[]',
          },
          { name: 'protocolFee', internalType: 'uint64', type: 'uint64' },
          { name: 'referralFee', internalType: 'uint64', type: 'uint64' },
          { name: 'maxParticipants', internalType: 'uint256', type: 'uint256' },
          { name: 'owner', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'getBoost',
    outputs: [
      {
        name: '',
        internalType: 'struct BoostLib.Boost',
        type: 'tuple',
        components: [
          { name: 'action', internalType: 'contract Action', type: 'address' },
          {
            name: 'validator',
            internalType: 'contract Validator',
            type: 'address',
          },
          {
            name: 'allowList',
            internalType: 'contract AllowList',
            type: 'address',
          },
          { name: 'budget', internalType: 'contract Budget', type: 'address' },
          {
            name: 'incentives',
            internalType: 'contract Incentive[]',
            type: 'address[]',
          },
          { name: 'protocolFee', internalType: 'uint64', type: 'uint64' },
          { name: 'referralFee', internalType: 'uint64', type: 'uint64' },
          { name: 'maxParticipants', internalType: 'uint256', type: 'uint256' },
          { name: 'owner', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBoostCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolFee',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolFeeReceiver',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'referralFee',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'registry',
    outputs: [
      { name: '', internalType: 'contract BoostRegistry', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'claimFee_', internalType: 'uint256', type: 'uint256' }],
    name: 'setClaimFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'protocolFeeReceiver_',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setProtocolFeeReceiver',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BoostError
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const boostErrorAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'ClaimFailed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientFunds',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  {
    type: 'error',
    inputs: [
      { name: 'expectedInterface', internalType: 'bytes4', type: 'bytes4' },
      { name: 'instance', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidInstance',
  },
  { type: 'error', inputs: [], name: 'LengthMismatch' },
  { type: 'error', inputs: [], name: 'NotImplemented' },
  {
    type: 'error',
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address' },
      { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'Replayed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TransferFailed',
  },
  { type: 'error', inputs: [], name: 'Unauthorized' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BoostPaymaster
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const boostPaymasterAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_entryPoint',
        internalType: 'contract IEntryPoint',
        type: 'address',
      },
      { name: '_signers', internalType: 'address[]', type: 'address[]' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InvalidSignature' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'roles',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'RolesUpdated',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unstakeDelaySec', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'addStake',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'entryPoint',
    outputs: [
      { name: '', internalType: 'contract IEntryPoint', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'userOp',
        internalType: 'struct UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verificationGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'preVerificationGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxPriorityFeePerGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'validUntil', internalType: 'uint48', type: 'uint48' },
      { name: 'validAfter', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'getHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'grantRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasAllRoles',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasAnyRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isSigner',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'parsePaymasterAndData',
    outputs: [
      { name: 'validUntil', internalType: 'uint48', type: 'uint48' },
      { name: 'validAfter', internalType: 'uint48', type: 'uint48' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'mode',
        internalType: 'enum IPaymaster.PostOpMode',
        type: 'uint8',
      },
      { name: 'context', internalType: 'bytes', type: 'bytes' },
      { name: 'actualGasCost', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'postOp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'roles', internalType: 'uint256', type: 'uint256' }],
    name: 'renounceRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'revokeRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'rolesOf',
    outputs: [{ name: 'roles', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'senderNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unlockStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'userOp',
        internalType: 'struct UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verificationGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'preVerificationGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxPriorityFeePerGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'validatePaymasterUserOp',
    outputs: [
      { name: 'context', internalType: 'bytes', type: 'bytes' },
      { name: 'validationData', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'withdrawAddress',
        internalType: 'address payable',
        type: 'address',
      },
    ],
    name: 'withdrawStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'withdrawAddress',
        internalType: 'address payable',
        type: 'address',
      },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BoostProxy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const boostProxyAbi = [
  {
    type: 'function',
    inputs: [{ name: 'owner_', internalType: 'address', type: 'address' }],
    name: 'createProxy',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BoostRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const boostRegistryAbi = [
  {
    type: 'error',
    inputs: [
      {
        name: 'registryType',
        internalType: 'enum BoostRegistry.RegistryType',
        type: 'uint8',
      },
      { name: 'identifier', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AlreadyRegistered',
  },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'NotCloneable',
  },
  {
    type: 'error',
    inputs: [{ name: 'identifier', internalType: 'bytes32', type: 'bytes32' }],
    name: 'NotRegistered',
  },
  { type: 'error', inputs: [], name: 'Reentrancy' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'registryType',
        internalType: 'enum BoostRegistry.RegistryType',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'identifier',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'baseImplementation',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'deployedInstance',
        internalType: 'contract Cloneable',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Deployed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'registryType',
        internalType: 'enum BoostRegistry.RegistryType',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'identifier',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Registered',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'type_',
        internalType: 'enum BoostRegistry.RegistryType',
        type: 'uint8',
      },
      { name: 'base_', internalType: 'address', type: 'address' },
      { name: 'name_', internalType: 'string', type: 'string' },
      { name: 'data_', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'deployClone',
    outputs: [
      { name: 'instance', internalType: 'contract Cloneable', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'identifier_', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getBaseImplementation',
    outputs: [
      {
        name: 'implementation',
        internalType: 'contract Cloneable',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'identifier_', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getClone',
    outputs: [
      {
        name: 'clone',
        internalType: 'struct BoostRegistry.Clone',
        type: 'tuple',
        components: [
          {
            name: 'baseType',
            internalType: 'enum BoostRegistry.RegistryType',
            type: 'uint8',
          },
          {
            name: 'instance',
            internalType: 'contract Cloneable',
            type: 'address',
          },
          { name: 'deployer', internalType: 'address', type: 'address' },
          { name: 'name', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'type_',
        internalType: 'enum BoostRegistry.RegistryType',
        type: 'uint8',
      },
      { name: 'base_', internalType: 'address', type: 'address' },
      { name: 'deployer_', internalType: 'address', type: 'address' },
      { name: 'name_', internalType: 'string', type: 'string' },
    ],
    name: 'getCloneIdentifier',
    outputs: [{ name: 'identifier', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'deployer_', internalType: 'address', type: 'address' }],
    name: 'getClones',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'type_',
        internalType: 'enum BoostRegistry.RegistryType',
        type: 'uint8',
      },
      { name: 'name_', internalType: 'string', type: 'string' },
    ],
    name: 'getIdentifier',
    outputs: [{ name: 'identifier', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'type_',
        internalType: 'enum BoostRegistry.RegistryType',
        type: 'uint8',
      },
      { name: 'name_', internalType: 'string', type: 'string' },
      { name: 'implementation_', internalType: 'address', type: 'address' },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Budget
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const budgetAbi = [
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientFunds',
  },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAllocation',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'LengthMismatch' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TransferFailed',
  },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'isAuthorized',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'Authorized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'asset',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Distributed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'allocate',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'asset_', internalType: 'address', type: 'address' }],
    name: 'available',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'disburse',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'disburseBatch',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'asset_', internalType: 'address', type: 'address' }],
    name: 'distributed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account_', internalType: 'address', type: 'address' }],
    name: 'isAuthorized',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'reclaim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'reconcile',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts_', internalType: 'address[]', type: 'address[]' },
      { name: 'isAuthorized_', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'setAuthorized',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'asset_', internalType: 'address', type: 'address' }],
    name: 'total',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CGDAIncentive
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const cgdaIncentiveAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'ClaimFailed' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientFunds',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotClaimable' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'Reentrancy' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'asset',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cgdaParams',
    outputs: [
      { name: 'rewardDecay', internalType: 'uint256', type: 'uint256' },
      { name: 'rewardBoost', internalType: 'uint256', type: 'uint256' },
      { name: 'lastClaimTime', internalType: 'uint256', type: 'uint256' },
      { name: 'currentReward', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'claim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'claimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claims',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'isClaimable',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'preflight',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'reclaim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalBudget',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Cloneable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const cloneableAbi = [
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ContractAction
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const contractActionAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'ExecuteNotImplemented' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [
      { name: 'targetChainId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TargetChainUnsupported',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'executor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'success', internalType: 'bool', type: 'bool', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ActionExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'isValidated',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ActionValidated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VALIDATOR',
    outputs: [
      { name: '', internalType: 'contract Validator', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'chainId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'execute',
    outputs: [
      { name: '', internalType: 'bool', type: 'bool' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'prepare',
    outputs: [{ name: 'bytes_', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'selector',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'target',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'value',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ECDSA
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ecdsaAbi = [
  { type: 'error', inputs: [], name: 'InvalidSignature' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EIP712
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const eip712Abi = [
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC1155
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc1155Abi = [
  { type: 'error', inputs: [], name: 'AccountBalanceOverflow' },
  { type: 'error', inputs: [], name: 'ArrayLengthsMismatch' },
  { type: 'error', inputs: [], name: 'InsufficientBalance' },
  { type: 'error', inputs: [], name: 'NotOwnerNorApproved' },
  {
    type: 'error',
    inputs: [],
    name: 'TransferToNonERC1155ReceiverImplementer',
  },
  { type: 'error', inputs: [], name: 'TransferToZeroAddress' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'isApproved',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'amounts',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owners', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'isApproved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC1155Incentive
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc1155IncentiveAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'ClaimFailed' },
  {
    type: 'error',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'ClaimFailed',
  },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientFunds',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotClaimable' },
  { type: 'error', inputs: [], name: 'NotImplemented' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'Reentrancy' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'asset',
    outputs: [{ name: '', internalType: 'contract IERC1155', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'claim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'claimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claims',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'extraData',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'isClaimable',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'limit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'preflight',
    outputs: [{ name: 'budgetData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'reclaim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'strategy',
    outputs: [
      {
        name: '',
        internalType: 'enum ERC1155Incentive.Strategy',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC1271
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc1271Abi = [
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'isValidSignature',
    outputs: [{ name: 'result', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC165
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc165Abi = [
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
  { type: 'error', inputs: [], name: 'AllowanceOverflow' },
  { type: 'error', inputs: [], name: 'AllowanceUnderflow' },
  { type: 'error', inputs: [], name: 'InsufficientAllowance' },
  { type: 'error', inputs: [], name: 'InsufficientBalance' },
  { type: 'error', inputs: [], name: 'InvalidPermit' },
  { type: 'error', inputs: [], name: 'PermitExpired' },
  { type: 'error', inputs: [], name: 'TotalSupplyOverflow' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: 'result', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20Incentive
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20IncentiveAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'ClaimFailed' },
  {
    type: 'error',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'ClaimFailed',
  },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientFunds',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotClaimable' },
  { type: 'error', inputs: [], name: 'NotImplemented' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'Reentrancy' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'entry',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Entry',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'asset',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'claim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'claimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claims',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'drawRaffle',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'entries',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'isClaimable',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'limit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'preflight',
    outputs: [{ name: 'budgetData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'reclaim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'strategy',
    outputs: [
      { name: '', internalType: 'enum ERC20Incentive.Strategy', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC4337
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc4337Abi = [
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  { type: 'error', inputs: [], name: 'UnauthorizedCallContext' },
  { type: 'error', inputs: [], name: 'UpgradeFailed' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'addDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegate', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'delegateExecute',
    outputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'entryPoint',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'execute',
    outputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct ERC4337.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'executeBatch',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDeposit',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'isValidSignature',
    outputs: [{ name: 'result', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'storageSlot', internalType: 'bytes32', type: 'bytes32' }],
    name: 'storageLoad',
    outputs: [{ name: 'result', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'storageSlot', internalType: 'bytes32', type: 'bytes32' },
      { name: 'storageValue', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'storageStore',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'userOp',
        internalType: 'struct ERC4337.UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verificationGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'preVerificationGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxPriorityFeePerGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'userOpHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'missingAccountFunds', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'validateUserOp',
    outputs: [
      { name: 'validationData', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawDepositTo',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC721
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc721Abi = [
  { type: 'error', inputs: [], name: 'AccountBalanceOverflow' },
  { type: 'error', inputs: [], name: 'BalanceQueryForZeroAddress' },
  { type: 'error', inputs: [], name: 'NotOwnerNorApproved' },
  { type: 'error', inputs: [], name: 'TokenAlreadyExists' },
  { type: 'error', inputs: [], name: 'TokenDoesNotExist' },
  { type: 'error', inputs: [], name: 'TransferFromIncorrectOwner' },
  { type: 'error', inputs: [], name: 'TransferToNonERC721ReceiverImplementer' },
  { type: 'error', inputs: [], name: 'TransferToZeroAddress' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'isApproved',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'isApproved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC721MintAction
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc721MintActionAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'ExecuteNotImplemented' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [
      { name: 'targetChainId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TargetChainUnsupported',
  },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'executor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'success', internalType: 'bool', type: 'bool', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ActionExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'isValidated',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ActionValidated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VALIDATOR',
    outputs: [
      { name: '', internalType: 'contract Validator', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'chainId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'execute',
    outputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'returnData', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'prepare',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'selector',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'target',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'validate',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'validated',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'value',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IAggregator
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iAggregatorAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'userOps',
        internalType: 'struct UserOperation[]',
        type: 'tuple[]',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verificationGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'preVerificationGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxPriorityFeePerGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregateSignatures',
    outputs: [
      { name: 'aggregatedSignature', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'userOps',
        internalType: 'struct UserOperation[]',
        type: 'tuple[]',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verificationGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'preVerificationGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxPriorityFeePerGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'validateSignatures',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'userOp',
        internalType: 'struct UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verificationGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'preVerificationGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxPriorityFeePerGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'validateUserOpSignature',
    outputs: [{ name: 'sigForUserOp', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155Abi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155Receiver
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155ReceiverAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1271
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1271Abi = [
  {
    type: 'function',
    inputs: [
      { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'isValidSignature',
    outputs: [{ name: 'magicValue', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC165
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc165Abi = [
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IEntryPoint
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iEntryPointAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'preOpGas', internalType: 'uint256', type: 'uint256' },
      { name: 'paid', internalType: 'uint256', type: 'uint256' },
      { name: 'validAfter', internalType: 'uint48', type: 'uint48' },
      { name: 'validUntil', internalType: 'uint48', type: 'uint48' },
      { name: 'targetSuccess', internalType: 'bool', type: 'bool' },
      { name: 'targetResult', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'ExecutionResult',
  },
  {
    type: 'error',
    inputs: [
      { name: 'opIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'FailedOp',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'SenderAddressResult',
  },
  {
    type: 'error',
    inputs: [{ name: 'aggregator', internalType: 'address', type: 'address' }],
    name: 'SignatureValidationFailed',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'returnInfo',
        internalType: 'struct IEntryPoint.ReturnInfo',
        type: 'tuple',
        components: [
          { name: 'preOpGas', internalType: 'uint256', type: 'uint256' },
          { name: 'prefund', internalType: 'uint256', type: 'uint256' },
          { name: 'sigFailed', internalType: 'bool', type: 'bool' },
          { name: 'validAfter', internalType: 'uint48', type: 'uint48' },
          { name: 'validUntil', internalType: 'uint48', type: 'uint48' },
          { name: 'paymasterContext', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: 'senderInfo',
        internalType: 'struct IStakeManager.StakeInfo',
        type: 'tuple',
        components: [
          { name: 'stake', internalType: 'uint256', type: 'uint256' },
          { name: 'unstakeDelaySec', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'factoryInfo',
        internalType: 'struct IStakeManager.StakeInfo',
        type: 'tuple',
        components: [
          { name: 'stake', internalType: 'uint256', type: 'uint256' },
          { name: 'unstakeDelaySec', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'paymasterInfo',
        internalType: 'struct IStakeManager.StakeInfo',
        type: 'tuple',
        components: [
          { name: 'stake', internalType: 'uint256', type: 'uint256' },
          { name: 'unstakeDelaySec', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'ValidationResult',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'returnInfo',
        internalType: 'struct IEntryPoint.ReturnInfo',
        type: 'tuple',
        components: [
          { name: 'preOpGas', internalType: 'uint256', type: 'uint256' },
          { name: 'prefund', internalType: 'uint256', type: 'uint256' },
          { name: 'sigFailed', internalType: 'bool', type: 'bool' },
          { name: 'validAfter', internalType: 'uint48', type: 'uint48' },
          { name: 'validUntil', internalType: 'uint48', type: 'uint48' },
          { name: 'paymasterContext', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: 'senderInfo',
        internalType: 'struct IStakeManager.StakeInfo',
        type: 'tuple',
        components: [
          { name: 'stake', internalType: 'uint256', type: 'uint256' },
          { name: 'unstakeDelaySec', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'factoryInfo',
        internalType: 'struct IStakeManager.StakeInfo',
        type: 'tuple',
        components: [
          { name: 'stake', internalType: 'uint256', type: 'uint256' },
          { name: 'unstakeDelaySec', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'paymasterInfo',
        internalType: 'struct IStakeManager.StakeInfo',
        type: 'tuple',
        components: [
          { name: 'stake', internalType: 'uint256', type: 'uint256' },
          { name: 'unstakeDelaySec', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'aggregatorInfo',
        internalType: 'struct IEntryPoint.AggregatorStakeInfo',
        type: 'tuple',
        components: [
          { name: 'aggregator', internalType: 'address', type: 'address' },
          {
            name: 'stakeInfo',
            internalType: 'struct IStakeManager.StakeInfo',
            type: 'tuple',
            components: [
              { name: 'stake', internalType: 'uint256', type: 'uint256' },
              {
                name: 'unstakeDelaySec',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
        ],
      },
    ],
    name: 'ValidationResultWithAggregation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'userOpHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'factory',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'paymaster',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AccountDeployed',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'BeforeExecution' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'totalDeposit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Deposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'aggregator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'SignatureAggregatorChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'totalStaked',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'unstakeDelaySec',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StakeLocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'withdrawTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StakeUnlocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'withdrawAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StakeWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'userOpHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'paymaster',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'nonce',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'success', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: 'actualGasCost',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'actualGasUsed',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UserOperationEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'userOpHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'nonce',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'revertReason',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'UserOperationRevertReason',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'withdrawAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Withdrawn',
  },
  {
    type: 'function',
    inputs: [
      { name: '_unstakeDelaySec', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'addStake',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'depositTo',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getDepositInfo',
    outputs: [
      {
        name: 'info',
        internalType: 'struct IStakeManager.DepositInfo',
        type: 'tuple',
        components: [
          { name: 'deposit', internalType: 'uint112', type: 'uint112' },
          { name: 'staked', internalType: 'bool', type: 'bool' },
          { name: 'stake', internalType: 'uint112', type: 'uint112' },
          { name: 'unstakeDelaySec', internalType: 'uint32', type: 'uint32' },
          { name: 'withdrawTime', internalType: 'uint48', type: 'uint48' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'key', internalType: 'uint192', type: 'uint192' },
    ],
    name: 'getNonce',
    outputs: [{ name: 'nonce', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'initCode', internalType: 'bytes', type: 'bytes' }],
    name: 'getSenderAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'userOp',
        internalType: 'struct UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verificationGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'preVerificationGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxPriorityFeePerGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'getUserOpHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'opsPerAggregator',
        internalType: 'struct IEntryPoint.UserOpsPerAggregator[]',
        type: 'tuple[]',
        components: [
          {
            name: 'userOps',
            internalType: 'struct UserOperation[]',
            type: 'tuple[]',
            components: [
              { name: 'sender', internalType: 'address', type: 'address' },
              { name: 'nonce', internalType: 'uint256', type: 'uint256' },
              { name: 'initCode', internalType: 'bytes', type: 'bytes' },
              { name: 'callData', internalType: 'bytes', type: 'bytes' },
              {
                name: 'callGasLimit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'verificationGasLimit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'preVerificationGas',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxFeePerGas',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxPriorityFeePerGas',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'paymasterAndData',
                internalType: 'bytes',
                type: 'bytes',
              },
              { name: 'signature', internalType: 'bytes', type: 'bytes' },
            ],
          },
          {
            name: 'aggregator',
            internalType: 'contract IAggregator',
            type: 'address',
          },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'beneficiary', internalType: 'address payable', type: 'address' },
    ],
    name: 'handleAggregatedOps',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'ops',
        internalType: 'struct UserOperation[]',
        type: 'tuple[]',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verificationGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'preVerificationGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxPriorityFeePerGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'beneficiary', internalType: 'address payable', type: 'address' },
    ],
    name: 'handleOps',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'uint192', type: 'uint192' }],
    name: 'incrementNonce',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'op',
        internalType: 'struct UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verificationGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'preVerificationGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxPriorityFeePerGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'targetCallData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'simulateHandleOp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'userOp',
        internalType: 'struct UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verificationGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'preVerificationGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxPriorityFeePerGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'simulateValidation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unlockStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'withdrawAddress',
        internalType: 'address payable',
        type: 'address',
      },
    ],
    name: 'withdrawStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'withdrawAddress',
        internalType: 'address payable',
        type: 'address',
      },
      { name: 'withdrawAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// INonceManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iNonceManagerAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'key', internalType: 'uint192', type: 'uint192' },
    ],
    name: 'getNonce',
    outputs: [{ name: 'nonce', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'uint192', type: 'uint192' }],
    name: 'incrementNonce',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IPaymaster
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iPaymasterAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'mode',
        internalType: 'enum IPaymaster.PostOpMode',
        type: 'uint8',
      },
      { name: 'context', internalType: 'bytes', type: 'bytes' },
      { name: 'actualGasCost', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'postOp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'userOp',
        internalType: 'struct UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'verificationGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'preVerificationGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxPriorityFeePerGas',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'userOpHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'maxCost', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'validatePaymasterUserOp',
    outputs: [
      { name: 'context', internalType: 'bytes', type: 'bytes' },
      { name: 'validationData', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IStakeManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iStakeManagerAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'totalDeposit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Deposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'totalStaked',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'unstakeDelaySec',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StakeLocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'withdrawTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StakeUnlocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'withdrawAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StakeWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'withdrawAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Withdrawn',
  },
  {
    type: 'function',
    inputs: [
      { name: '_unstakeDelaySec', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'addStake',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'depositTo',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getDepositInfo',
    outputs: [
      {
        name: 'info',
        internalType: 'struct IStakeManager.DepositInfo',
        type: 'tuple',
        components: [
          { name: 'deposit', internalType: 'uint112', type: 'uint112' },
          { name: 'staked', internalType: 'bool', type: 'bool' },
          { name: 'stake', internalType: 'uint112', type: 'uint112' },
          { name: 'unstakeDelaySec', internalType: 'uint32', type: 'uint32' },
          { name: 'withdrawTime', internalType: 'uint48', type: 'uint48' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unlockStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'withdrawAddress',
        internalType: 'address payable',
        type: 'address',
      },
    ],
    name: 'withdrawStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'withdrawAddress',
        internalType: 'address payable',
        type: 'address',
      },
      { name: 'withdrawAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Incentive
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const incentiveAbi = [
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'ClaimFailed' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotClaimable' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'Reentrancy' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'claim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'claimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claims',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'isClaimable',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'preflight',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'reclaim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Initializable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const initializableAbi = [
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LibClone
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const libCloneAbi = [
  { type: 'error', inputs: [], name: 'DeploymentFailed' },
  { type: 'error', inputs: [], name: 'ETHTransferFailed' },
  { type: 'error', inputs: [], name: 'SaltDoesNotStartWith' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LibString
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const libStringAbi = [
  { type: 'error', inputs: [], name: 'HexLengthInsufficient' },
  { type: 'error', inputs: [], name: 'TooBigForSmallString' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockERC1155
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockErc1155Abi = [
  { type: 'error', inputs: [], name: 'AccountBalanceOverflow' },
  { type: 'error', inputs: [], name: 'ArrayLengthsMismatch' },
  { type: 'error', inputs: [], name: 'InsufficientBalance' },
  { type: 'error', inputs: [], name: 'NotOwnerNorApproved' },
  {
    type: 'error',
    inputs: [],
    name: 'TransferToNonERC1155ReceiverImplementer',
  },
  { type: 'error', inputs: [], name: 'TransferToZeroAddress' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'isApproved',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'amounts',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owners', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'isApproved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockErc20Abi = [
  { type: 'error', inputs: [], name: 'AllowanceOverflow' },
  { type: 'error', inputs: [], name: 'AllowanceUnderflow' },
  { type: 'error', inputs: [], name: 'InsufficientAllowance' },
  { type: 'error', inputs: [], name: 'InsufficientBalance' },
  { type: 'error', inputs: [], name: 'InvalidPermit' },
  { type: 'error', inputs: [], name: 'PermitExpired' },
  { type: 'error', inputs: [], name: 'TotalSupplyOverflow' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: 'result', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mintPayable',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockERC721
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockErc721Abi = [
  { type: 'error', inputs: [], name: 'AccountBalanceOverflow' },
  { type: 'error', inputs: [], name: 'BalanceQueryForZeroAddress' },
  { type: 'error', inputs: [], name: 'NotOwnerNorApproved' },
  { type: 'error', inputs: [], name: 'TokenAlreadyExists' },
  { type: 'error', inputs: [], name: 'TokenDoesNotExist' },
  { type: 'error', inputs: [], name: 'TransferFromIncorrectOwner' },
  { type: 'error', inputs: [], name: 'TransferToNonERC721ReceiverImplementer' },
  { type: 'error', inputs: [], name: 'TransferToZeroAddress' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'isApproved',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'mintPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'isApproved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OwnableRoles
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ownableRolesAbi = [
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'roles',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'RolesUpdated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'grantRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasAllRoles',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasAnyRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'roles', internalType: 'uint256', type: 'uint256' }],
    name: 'renounceRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'revokeRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'rolesOf',
    outputs: [{ name: 'roles', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Points
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const pointsAbi = [
  { type: 'error', inputs: [], name: 'AllowanceOverflow' },
  { type: 'error', inputs: [], name: 'AllowanceUnderflow' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InsufficientAllowance' },
  { type: 'error', inputs: [], name: 'InsufficientBalance' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidPermit' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NonTransferable' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'PermitExpired' },
  { type: 'error', inputs: [], name: 'TotalSupplyOverflow' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'roles',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'RolesUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: 'result', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ISSUER_ROLE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'grantRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasAllRoles',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasAnyRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name_', internalType: 'string', type: 'string' },
      { name: 'symbol_', internalType: 'string', type: 'string' },
      { name: 'minter_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'issue',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'roles', internalType: 'uint256', type: 'uint256' }],
    name: 'renounceRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'revokeRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'rolesOf',
    outputs: [{ name: 'roles', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PointsIncentive
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const pointsIncentiveAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'ClaimFailed' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotClaimable' },
  { type: 'error', inputs: [], name: 'NotImplemented' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'Reentrancy' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Claimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'claim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'claimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claims',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'isClaimable',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'limit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'preflight',
    outputs: [{ name: 'budgetData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'quantity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'reclaim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'selector',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'venue',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Receiver
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const receiverAbi = [
  { type: 'fallback', stateMutability: 'payable' },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ReentrancyGuard
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const reentrancyGuardAbi = [
  { type: 'error', inputs: [], name: 'Reentrancy' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SafeTransferLib
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const safeTransferLibAbi = [
  { type: 'error', inputs: [], name: 'ApproveFailed' },
  { type: 'error', inputs: [], name: 'ETHTransferFailed' },
  { type: 'error', inputs: [], name: 'TransferFailed' },
  { type: 'error', inputs: [], name: 'TransferFromFailed' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SignerValidator
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const signerValidatorAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'LengthMismatch' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address' },
      { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'Replayed',
  },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signers_', internalType: 'address[]', type: 'address[]' },
      { name: 'authorized_', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'setAuthorized',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'signers',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'validate',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SimpleAllowList
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const simpleAllowListAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'LengthMismatch' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'roles',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'RolesUpdated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'LIST_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'grantRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasAllRoles',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasAnyRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user_', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'isAllowed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'roles', internalType: 'uint256', type: 'uint256' }],
    name: 'renounceRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'roles', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'revokeRoles',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'rolesOf',
    outputs: [{ name: 'roles', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'users_', internalType: 'address[]', type: 'address[]' },
      { name: 'allowed_', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'setAllowed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SimpleBudget
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const simpleBudgetAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientFunds',
  },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAllocation',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'LengthMismatch' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'Reentrancy' },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TransferFailed',
  },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'isAuthorized',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'Authorized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'asset',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Distributed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'allocate',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'asset_', internalType: 'address', type: 'address' }],
    name: 'available',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'asset_', internalType: 'address', type: 'address' },
      { name: 'tokenId_', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'available',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'disburse',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'disburseBatch',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'asset_', internalType: 'address', type: 'address' }],
    name: 'distributed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'asset_', internalType: 'address', type: 'address' },
      { name: 'tokenId_', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'distributed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account_', internalType: 'address', type: 'address' }],
    name: 'isAuthorized',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'reclaim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'reconcile',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account_', internalType: 'address[]', type: 'address[]' },
      { name: 'authorized_', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'setAuthorized',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'asset_', internalType: 'address', type: 'address' }],
    name: 'total',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'asset_', internalType: 'address', type: 'address' },
      { name: 'tokenId_', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'total',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SimpleDenyList
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const simpleDenyListAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'LengthMismatch' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user_', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'isAllowed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'users_', internalType: 'address[]', type: 'address[]' },
      { name: 'denied_', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'setDenied',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UUPSUpgradeable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const uupsUpgradeableAbi = [
  { type: 'error', inputs: [], name: 'UnauthorizedCallContext' },
  { type: 'error', inputs: [], name: 'UpgradeFailed' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Validator
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const validatorAbi = [
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'validate',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VestingBudget
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const vestingBudgetAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientFunds',
  },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAllocation',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'LengthMismatch' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'Reentrancy' },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TransferFailed',
  },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'isAuthorized',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'Authorized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'asset',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Distributed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pendingOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipHandoverRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'allocate',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'asset_', internalType: 'address', type: 'address' }],
    name: 'available',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cliff',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'completeOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'disburse',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'disburseBatch',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'asset_', internalType: 'address', type: 'address' }],
    name: 'distributed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'duration',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'end',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account_', internalType: 'address', type: 'address' }],
    name: 'isAuthorized',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'result', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pendingOwner', internalType: 'address', type: 'address' },
    ],
    name: 'ownershipHandoverExpiresAt',
    outputs: [{ name: 'result', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data_', internalType: 'bytes', type: 'bytes' }],
    name: 'reclaim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'reconcile',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestOwnershipHandover',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account_', internalType: 'address[]', type: 'address[]' },
      { name: 'authorized_', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'setAuthorized',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'start',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'asset_', internalType: 'address', type: 'address' }],
    name: 'total',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link actionAbi}__
 */
export const useReadAction = /*#__PURE__*/ createUseReadContract({
  abi: actionAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"VALIDATOR"`
 */
export const useReadActionValidator = /*#__PURE__*/ createUseReadContract({
  abi: actionAbi,
  functionName: 'VALIDATOR',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadActionSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: actionAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link actionAbi}__
 */
export const useWriteAction = /*#__PURE__*/ createUseWriteContract({
  abi: actionAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"execute"`
 */
export const useWriteActionExecute = /*#__PURE__*/ createUseWriteContract({
  abi: actionAbi,
  functionName: 'execute',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteActionInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: actionAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"prepare"`
 */
export const useWriteActionPrepare = /*#__PURE__*/ createUseWriteContract({
  abi: actionAbi,
  functionName: 'prepare',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link actionAbi}__
 */
export const useSimulateAction = /*#__PURE__*/ createUseSimulateContract({
  abi: actionAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"execute"`
 */
export const useSimulateActionExecute = /*#__PURE__*/ createUseSimulateContract(
  { abi: actionAbi, functionName: 'execute' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateActionInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: actionAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"prepare"`
 */
export const useSimulateActionPrepare = /*#__PURE__*/ createUseSimulateContract(
  { abi: actionAbi, functionName: 'prepare' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link actionAbi}__
 */
export const useWatchActionEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: actionAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link actionAbi}__ and `eventName` set to `"ActionExecuted"`
 */
export const useWatchActionActionExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: actionAbi,
    eventName: 'ActionExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link actionAbi}__ and `eventName` set to `"ActionValidated"`
 */
export const useWatchActionActionValidatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: actionAbi,
    eventName: 'ActionValidated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link actionAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchActionInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: actionAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListAbi}__
 */
export const useReadAllowList = /*#__PURE__*/ createUseReadContract({
  abi: allowListAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"isAllowed"`
 */
export const useReadAllowListIsAllowed = /*#__PURE__*/ createUseReadContract({
  abi: allowListAbi,
  functionName: 'isAllowed',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"owner"`
 */
export const useReadAllowListOwner = /*#__PURE__*/ createUseReadContract({
  abi: allowListAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadAllowListOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: allowListAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadAllowListSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: allowListAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListAbi}__
 */
export const useWriteAllowList = /*#__PURE__*/ createUseWriteContract({
  abi: allowListAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteAllowListCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: allowListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteAllowListCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: allowListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteAllowListInitialize = /*#__PURE__*/ createUseWriteContract(
  { abi: allowListAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteAllowListRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: allowListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteAllowListRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: allowListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteAllowListTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: allowListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListAbi}__
 */
export const useSimulateAllowList = /*#__PURE__*/ createUseSimulateContract({
  abi: allowListAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateAllowListCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: allowListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateAllowListCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: allowListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateAllowListInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: allowListAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateAllowListRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: allowListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateAllowListRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: allowListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateAllowListTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: allowListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link allowListAbi}__
 */
export const useWatchAllowListEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: allowListAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link allowListAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchAllowListInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: allowListAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link allowListAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchAllowListOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: allowListAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link allowListAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchAllowListOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: allowListAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link allowListAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchAllowListOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: allowListAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListIncentiveAbi}__
 */
export const useReadAllowListIncentive = /*#__PURE__*/ createUseReadContract({
  abi: allowListIncentiveAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"allowList"`
 */
export const useReadAllowListIncentiveAllowList =
  /*#__PURE__*/ createUseReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'allowList',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const useReadAllowListIncentiveClaimed =
  /*#__PURE__*/ createUseReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'claimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const useReadAllowListIncentiveClaims =
  /*#__PURE__*/ createUseReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'claims',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const useReadAllowListIncentiveIsClaimable =
  /*#__PURE__*/ createUseReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'isClaimable',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"limit"`
 */
export const useReadAllowListIncentiveLimit =
  /*#__PURE__*/ createUseReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'limit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const useReadAllowListIncentiveOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadAllowListIncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const useReadAllowListIncentivePreflight =
  /*#__PURE__*/ createUseReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'preflight',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const useReadAllowListIncentiveReclaim =
  /*#__PURE__*/ createUseReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadAllowListIncentiveSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListIncentiveAbi}__
 */
export const useWriteAllowListIncentive = /*#__PURE__*/ createUseWriteContract({
  abi: allowListIncentiveAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteAllowListIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: allowListIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const useWriteAllowListIncentiveClaim =
  /*#__PURE__*/ createUseWriteContract({
    abi: allowListIncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteAllowListIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: allowListIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteAllowListIncentiveInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: allowListIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteAllowListIncentiveRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: allowListIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteAllowListIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: allowListIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteAllowListIncentiveTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: allowListIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__
 */
export const useSimulateAllowListIncentive =
  /*#__PURE__*/ createUseSimulateContract({ abi: allowListIncentiveAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateAllowListIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: allowListIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const useSimulateAllowListIncentiveClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: allowListIncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateAllowListIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: allowListIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateAllowListIncentiveInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: allowListIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateAllowListIncentiveRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: allowListIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateAllowListIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: allowListIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateAllowListIncentiveTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: allowListIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link allowListIncentiveAbi}__
 */
export const useWatchAllowListIncentiveEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: allowListIncentiveAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const useWatchAllowListIncentiveClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: allowListIncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchAllowListIncentiveInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: allowListIncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchAllowListIncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: allowListIncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchAllowListIncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: allowListIncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchAllowListIncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: allowListIncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link basePaymasterAbi}__
 */
export const useReadBasePaymaster = /*#__PURE__*/ createUseReadContract({
  abi: basePaymasterAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"entryPoint"`
 */
export const useReadBasePaymasterEntryPoint =
  /*#__PURE__*/ createUseReadContract({
    abi: basePaymasterAbi,
    functionName: 'entryPoint',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"getDeposit"`
 */
export const useReadBasePaymasterGetDeposit =
  /*#__PURE__*/ createUseReadContract({
    abi: basePaymasterAbi,
    functionName: 'getDeposit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"owner"`
 */
export const useReadBasePaymasterOwner = /*#__PURE__*/ createUseReadContract({
  abi: basePaymasterAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link basePaymasterAbi}__
 */
export const useWriteBasePaymaster = /*#__PURE__*/ createUseWriteContract({
  abi: basePaymasterAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"addStake"`
 */
export const useWriteBasePaymasterAddStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: basePaymasterAbi,
    functionName: 'addStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"deposit"`
 */
export const useWriteBasePaymasterDeposit =
  /*#__PURE__*/ createUseWriteContract({
    abi: basePaymasterAbi,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"postOp"`
 */
export const useWriteBasePaymasterPostOp = /*#__PURE__*/ createUseWriteContract(
  { abi: basePaymasterAbi, functionName: 'postOp' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteBasePaymasterRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: basePaymasterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteBasePaymasterTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: basePaymasterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"unlockStake"`
 */
export const useWriteBasePaymasterUnlockStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: basePaymasterAbi,
    functionName: 'unlockStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"validatePaymasterUserOp"`
 */
export const useWriteBasePaymasterValidatePaymasterUserOp =
  /*#__PURE__*/ createUseWriteContract({
    abi: basePaymasterAbi,
    functionName: 'validatePaymasterUserOp',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const useWriteBasePaymasterWithdrawStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: basePaymasterAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const useWriteBasePaymasterWithdrawTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: basePaymasterAbi,
    functionName: 'withdrawTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link basePaymasterAbi}__
 */
export const useSimulateBasePaymaster = /*#__PURE__*/ createUseSimulateContract(
  { abi: basePaymasterAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"addStake"`
 */
export const useSimulateBasePaymasterAddStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'addStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulateBasePaymasterDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"postOp"`
 */
export const useSimulateBasePaymasterPostOp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'postOp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateBasePaymasterRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateBasePaymasterTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"unlockStake"`
 */
export const useSimulateBasePaymasterUnlockStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'unlockStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"validatePaymasterUserOp"`
 */
export const useSimulateBasePaymasterValidatePaymasterUserOp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'validatePaymasterUserOp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const useSimulateBasePaymasterWithdrawStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const useSimulateBasePaymasterWithdrawTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'withdrawTo',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link basePaymasterAbi}__
 */
export const useWatchBasePaymasterEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: basePaymasterAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link basePaymasterAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchBasePaymasterOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: basePaymasterAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostAccountAbi}__
 */
export const useReadBoostAccount = /*#__PURE__*/ createUseReadContract({
  abi: boostAccountAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"OWNER_ROLE"`
 */
export const useReadBoostAccountOwnerRole = /*#__PURE__*/ createUseReadContract(
  { abi: boostAccountAbi, functionName: 'OWNER_ROLE' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useReadBoostAccountEip712Domain =
  /*#__PURE__*/ createUseReadContract({
    abi: boostAccountAbi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"entryPoint"`
 */
export const useReadBoostAccountEntryPoint =
  /*#__PURE__*/ createUseReadContract({
    abi: boostAccountAbi,
    functionName: 'entryPoint',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"getDeposit"`
 */
export const useReadBoostAccountGetDeposit =
  /*#__PURE__*/ createUseReadContract({
    abi: boostAccountAbi,
    functionName: 'getDeposit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"hasAllRoles"`
 */
export const useReadBoostAccountHasAllRoles =
  /*#__PURE__*/ createUseReadContract({
    abi: boostAccountAbi,
    functionName: 'hasAllRoles',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"hasAnyRole"`
 */
export const useReadBoostAccountHasAnyRole =
  /*#__PURE__*/ createUseReadContract({
    abi: boostAccountAbi,
    functionName: 'hasAnyRole',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"isValidSignature"`
 */
export const useReadBoostAccountIsValidSignature =
  /*#__PURE__*/ createUseReadContract({
    abi: boostAccountAbi,
    functionName: 'isValidSignature',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"owner"`
 */
export const useReadBoostAccountOwner = /*#__PURE__*/ createUseReadContract({
  abi: boostAccountAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadBoostAccountOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: boostAccountAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadBoostAccountProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: boostAccountAbi,
    functionName: 'proxiableUUID',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"rolesOf"`
 */
export const useReadBoostAccountRolesOf = /*#__PURE__*/ createUseReadContract({
  abi: boostAccountAbi,
  functionName: 'rolesOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"storageLoad"`
 */
export const useReadBoostAccountStorageLoad =
  /*#__PURE__*/ createUseReadContract({
    abi: boostAccountAbi,
    functionName: 'storageLoad',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__
 */
export const useWriteBoostAccount = /*#__PURE__*/ createUseWriteContract({
  abi: boostAccountAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"addDeposit"`
 */
export const useWriteBoostAccountAddDeposit =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'addDeposit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteBoostAccountCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteBoostAccountCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"delegateExecute"`
 */
export const useWriteBoostAccountDelegateExecute =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'delegateExecute',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"execute"`
 */
export const useWriteBoostAccountExecute = /*#__PURE__*/ createUseWriteContract(
  { abi: boostAccountAbi, functionName: 'execute' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"executeBatch"`
 */
export const useWriteBoostAccountExecuteBatch =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'executeBatch',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"grantRoles"`
 */
export const useWriteBoostAccountGrantRoles =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteBoostAccountInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteBoostAccountRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const useWriteBoostAccountRenounceRoles =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteBoostAccountRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const useWriteBoostAccountRevokeRoles =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"storageStore"`
 */
export const useWriteBoostAccountStorageStore =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'storageStore',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteBoostAccountTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteBoostAccountUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"validateUserOp"`
 */
export const useWriteBoostAccountValidateUserOp =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'validateUserOp',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"withdrawDepositTo"`
 */
export const useWriteBoostAccountWithdrawDepositTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostAccountAbi,
    functionName: 'withdrawDepositTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__
 */
export const useSimulateBoostAccount = /*#__PURE__*/ createUseSimulateContract({
  abi: boostAccountAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"addDeposit"`
 */
export const useSimulateBoostAccountAddDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'addDeposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateBoostAccountCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateBoostAccountCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"delegateExecute"`
 */
export const useSimulateBoostAccountDelegateExecute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'delegateExecute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"execute"`
 */
export const useSimulateBoostAccountExecute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"executeBatch"`
 */
export const useSimulateBoostAccountExecuteBatch =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'executeBatch',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"grantRoles"`
 */
export const useSimulateBoostAccountGrantRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateBoostAccountInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateBoostAccountRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const useSimulateBoostAccountRenounceRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateBoostAccountRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const useSimulateBoostAccountRevokeRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"storageStore"`
 */
export const useSimulateBoostAccountStorageStore =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'storageStore',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateBoostAccountTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateBoostAccountUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"validateUserOp"`
 */
export const useSimulateBoostAccountValidateUserOp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'validateUserOp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"withdrawDepositTo"`
 */
export const useSimulateBoostAccountWithdrawDepositTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostAccountAbi,
    functionName: 'withdrawDepositTo',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostAccountAbi}__
 */
export const useWatchBoostAccountEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: boostAccountAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostAccountAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchBoostAccountInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostAccountAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostAccountAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchBoostAccountOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostAccountAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostAccountAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchBoostAccountOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostAccountAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostAccountAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchBoostAccountOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostAccountAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostAccountAbi}__ and `eventName` set to `"RolesUpdated"`
 */
export const useWatchBoostAccountRolesUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostAccountAbi,
    eventName: 'RolesUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostAccountAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchBoostAccountUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostAccountAbi,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostCoreAbi}__
 */
export const useReadBoostCore = /*#__PURE__*/ createUseReadContract({
  abi: boostCoreAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"claimFee"`
 */
export const useReadBoostCoreClaimFee = /*#__PURE__*/ createUseReadContract({
  abi: boostCoreAbi,
  functionName: 'claimFee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"getBoost"`
 */
export const useReadBoostCoreGetBoost = /*#__PURE__*/ createUseReadContract({
  abi: boostCoreAbi,
  functionName: 'getBoost',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"getBoostCount"`
 */
export const useReadBoostCoreGetBoostCount =
  /*#__PURE__*/ createUseReadContract({
    abi: boostCoreAbi,
    functionName: 'getBoostCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"owner"`
 */
export const useReadBoostCoreOwner = /*#__PURE__*/ createUseReadContract({
  abi: boostCoreAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadBoostCoreOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: boostCoreAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"protocolFee"`
 */
export const useReadBoostCoreProtocolFee = /*#__PURE__*/ createUseReadContract({
  abi: boostCoreAbi,
  functionName: 'protocolFee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"protocolFeeReceiver"`
 */
export const useReadBoostCoreProtocolFeeReceiver =
  /*#__PURE__*/ createUseReadContract({
    abi: boostCoreAbi,
    functionName: 'protocolFeeReceiver',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"referralFee"`
 */
export const useReadBoostCoreReferralFee = /*#__PURE__*/ createUseReadContract({
  abi: boostCoreAbi,
  functionName: 'referralFee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"registry"`
 */
export const useReadBoostCoreRegistry = /*#__PURE__*/ createUseReadContract({
  abi: boostCoreAbi,
  functionName: 'registry',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostCoreAbi}__
 */
export const useWriteBoostCore = /*#__PURE__*/ createUseWriteContract({
  abi: boostCoreAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteBoostCoreCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostCoreAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"claimIncentive"`
 */
export const useWriteBoostCoreClaimIncentive =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostCoreAbi,
    functionName: 'claimIncentive',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteBoostCoreCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostCoreAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"createBoost"`
 */
export const useWriteBoostCoreCreateBoost =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostCoreAbi,
    functionName: 'createBoost',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteBoostCoreRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostCoreAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteBoostCoreRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostCoreAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"setClaimFee"`
 */
export const useWriteBoostCoreSetClaimFee =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostCoreAbi,
    functionName: 'setClaimFee',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"setProtocolFeeReceiver"`
 */
export const useWriteBoostCoreSetProtocolFeeReceiver =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostCoreAbi,
    functionName: 'setProtocolFeeReceiver',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteBoostCoreTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostCoreAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostCoreAbi}__
 */
export const useSimulateBoostCore = /*#__PURE__*/ createUseSimulateContract({
  abi: boostCoreAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateBoostCoreCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostCoreAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"claimIncentive"`
 */
export const useSimulateBoostCoreClaimIncentive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostCoreAbi,
    functionName: 'claimIncentive',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateBoostCoreCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostCoreAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"createBoost"`
 */
export const useSimulateBoostCoreCreateBoost =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostCoreAbi,
    functionName: 'createBoost',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateBoostCoreRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostCoreAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateBoostCoreRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostCoreAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"setClaimFee"`
 */
export const useSimulateBoostCoreSetClaimFee =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostCoreAbi,
    functionName: 'setClaimFee',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"setProtocolFeeReceiver"`
 */
export const useSimulateBoostCoreSetProtocolFeeReceiver =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostCoreAbi,
    functionName: 'setProtocolFeeReceiver',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateBoostCoreTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostCoreAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostCoreAbi}__
 */
export const useWatchBoostCoreEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: boostCoreAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostCoreAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchBoostCoreOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostCoreAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostCoreAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchBoostCoreOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostCoreAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostCoreAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchBoostCoreOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostCoreAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostPaymasterAbi}__
 */
export const useReadBoostPaymaster = /*#__PURE__*/ createUseReadContract({
  abi: boostPaymasterAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"entryPoint"`
 */
export const useReadBoostPaymasterEntryPoint =
  /*#__PURE__*/ createUseReadContract({
    abi: boostPaymasterAbi,
    functionName: 'entryPoint',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"getDeposit"`
 */
export const useReadBoostPaymasterGetDeposit =
  /*#__PURE__*/ createUseReadContract({
    abi: boostPaymasterAbi,
    functionName: 'getDeposit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"getHash"`
 */
export const useReadBoostPaymasterGetHash = /*#__PURE__*/ createUseReadContract(
  { abi: boostPaymasterAbi, functionName: 'getHash' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"hasAllRoles"`
 */
export const useReadBoostPaymasterHasAllRoles =
  /*#__PURE__*/ createUseReadContract({
    abi: boostPaymasterAbi,
    functionName: 'hasAllRoles',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"hasAnyRole"`
 */
export const useReadBoostPaymasterHasAnyRole =
  /*#__PURE__*/ createUseReadContract({
    abi: boostPaymasterAbi,
    functionName: 'hasAnyRole',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"isSigner"`
 */
export const useReadBoostPaymasterIsSigner =
  /*#__PURE__*/ createUseReadContract({
    abi: boostPaymasterAbi,
    functionName: 'isSigner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"owner"`
 */
export const useReadBoostPaymasterOwner = /*#__PURE__*/ createUseReadContract({
  abi: boostPaymasterAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadBoostPaymasterOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: boostPaymasterAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"parsePaymasterAndData"`
 */
export const useReadBoostPaymasterParsePaymasterAndData =
  /*#__PURE__*/ createUseReadContract({
    abi: boostPaymasterAbi,
    functionName: 'parsePaymasterAndData',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"rolesOf"`
 */
export const useReadBoostPaymasterRolesOf = /*#__PURE__*/ createUseReadContract(
  { abi: boostPaymasterAbi, functionName: 'rolesOf' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"senderNonce"`
 */
export const useReadBoostPaymasterSenderNonce =
  /*#__PURE__*/ createUseReadContract({
    abi: boostPaymasterAbi,
    functionName: 'senderNonce',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__
 */
export const useWriteBoostPaymaster = /*#__PURE__*/ createUseWriteContract({
  abi: boostPaymasterAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"addStake"`
 */
export const useWriteBoostPaymasterAddStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'addStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteBoostPaymasterCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteBoostPaymasterCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"deposit"`
 */
export const useWriteBoostPaymasterDeposit =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"grantRoles"`
 */
export const useWriteBoostPaymasterGrantRoles =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"postOp"`
 */
export const useWriteBoostPaymasterPostOp =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'postOp',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteBoostPaymasterRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const useWriteBoostPaymasterRenounceRoles =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteBoostPaymasterRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const useWriteBoostPaymasterRevokeRoles =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteBoostPaymasterTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"unlockStake"`
 */
export const useWriteBoostPaymasterUnlockStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'unlockStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"validatePaymasterUserOp"`
 */
export const useWriteBoostPaymasterValidatePaymasterUserOp =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'validatePaymasterUserOp',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const useWriteBoostPaymasterWithdrawStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const useWriteBoostPaymasterWithdrawTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'withdrawTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__
 */
export const useSimulateBoostPaymaster =
  /*#__PURE__*/ createUseSimulateContract({ abi: boostPaymasterAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"addStake"`
 */
export const useSimulateBoostPaymasterAddStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'addStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateBoostPaymasterCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateBoostPaymasterCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulateBoostPaymasterDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"grantRoles"`
 */
export const useSimulateBoostPaymasterGrantRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"postOp"`
 */
export const useSimulateBoostPaymasterPostOp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'postOp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateBoostPaymasterRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const useSimulateBoostPaymasterRenounceRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateBoostPaymasterRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const useSimulateBoostPaymasterRevokeRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateBoostPaymasterTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"unlockStake"`
 */
export const useSimulateBoostPaymasterUnlockStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'unlockStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"validatePaymasterUserOp"`
 */
export const useSimulateBoostPaymasterValidatePaymasterUserOp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'validatePaymasterUserOp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const useSimulateBoostPaymasterWithdrawStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const useSimulateBoostPaymasterWithdrawTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'withdrawTo',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostPaymasterAbi}__
 */
export const useWatchBoostPaymasterEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: boostPaymasterAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostPaymasterAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchBoostPaymasterOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostPaymasterAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostPaymasterAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchBoostPaymasterOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostPaymasterAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostPaymasterAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchBoostPaymasterOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostPaymasterAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostPaymasterAbi}__ and `eventName` set to `"RolesUpdated"`
 */
export const useWatchBoostPaymasterRolesUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostPaymasterAbi,
    eventName: 'RolesUpdated',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostProxyAbi}__
 */
export const useWriteBoostProxy = /*#__PURE__*/ createUseWriteContract({
  abi: boostProxyAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostProxyAbi}__ and `functionName` set to `"createProxy"`
 */
export const useWriteBoostProxyCreateProxy =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostProxyAbi,
    functionName: 'createProxy',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostProxyAbi}__
 */
export const useSimulateBoostProxy = /*#__PURE__*/ createUseSimulateContract({
  abi: boostProxyAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostProxyAbi}__ and `functionName` set to `"createProxy"`
 */
export const useSimulateBoostProxyCreateProxy =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostProxyAbi,
    functionName: 'createProxy',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostRegistryAbi}__
 */
export const useReadBoostRegistry = /*#__PURE__*/ createUseReadContract({
  abi: boostRegistryAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"getBaseImplementation"`
 */
export const useReadBoostRegistryGetBaseImplementation =
  /*#__PURE__*/ createUseReadContract({
    abi: boostRegistryAbi,
    functionName: 'getBaseImplementation',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"getClone"`
 */
export const useReadBoostRegistryGetClone = /*#__PURE__*/ createUseReadContract(
  { abi: boostRegistryAbi, functionName: 'getClone' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"getCloneIdentifier"`
 */
export const useReadBoostRegistryGetCloneIdentifier =
  /*#__PURE__*/ createUseReadContract({
    abi: boostRegistryAbi,
    functionName: 'getCloneIdentifier',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"getClones"`
 */
export const useReadBoostRegistryGetClones =
  /*#__PURE__*/ createUseReadContract({
    abi: boostRegistryAbi,
    functionName: 'getClones',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"getIdentifier"`
 */
export const useReadBoostRegistryGetIdentifier =
  /*#__PURE__*/ createUseReadContract({
    abi: boostRegistryAbi,
    functionName: 'getIdentifier',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadBoostRegistrySupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: boostRegistryAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostRegistryAbi}__
 */
export const useWriteBoostRegistry = /*#__PURE__*/ createUseWriteContract({
  abi: boostRegistryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"deployClone"`
 */
export const useWriteBoostRegistryDeployClone =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostRegistryAbi,
    functionName: 'deployClone',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"register"`
 */
export const useWriteBoostRegistryRegister =
  /*#__PURE__*/ createUseWriteContract({
    abi: boostRegistryAbi,
    functionName: 'register',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostRegistryAbi}__
 */
export const useSimulateBoostRegistry = /*#__PURE__*/ createUseSimulateContract(
  { abi: boostRegistryAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"deployClone"`
 */
export const useSimulateBoostRegistryDeployClone =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostRegistryAbi,
    functionName: 'deployClone',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"register"`
 */
export const useSimulateBoostRegistryRegister =
  /*#__PURE__*/ createUseSimulateContract({
    abi: boostRegistryAbi,
    functionName: 'register',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostRegistryAbi}__
 */
export const useWatchBoostRegistryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: boostRegistryAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostRegistryAbi}__ and `eventName` set to `"Deployed"`
 */
export const useWatchBoostRegistryDeployedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostRegistryAbi,
    eventName: 'Deployed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link boostRegistryAbi}__ and `eventName` set to `"Registered"`
 */
export const useWatchBoostRegistryRegisteredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: boostRegistryAbi,
    eventName: 'Registered',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link budgetAbi}__
 */
export const useReadBudget = /*#__PURE__*/ createUseReadContract({
  abi: budgetAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"available"`
 */
export const useReadBudgetAvailable = /*#__PURE__*/ createUseReadContract({
  abi: budgetAbi,
  functionName: 'available',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"distributed"`
 */
export const useReadBudgetDistributed = /*#__PURE__*/ createUseReadContract({
  abi: budgetAbi,
  functionName: 'distributed',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"isAuthorized"`
 */
export const useReadBudgetIsAuthorized = /*#__PURE__*/ createUseReadContract({
  abi: budgetAbi,
  functionName: 'isAuthorized',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"owner"`
 */
export const useReadBudgetOwner = /*#__PURE__*/ createUseReadContract({
  abi: budgetAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadBudgetOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: budgetAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadBudgetSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: budgetAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"total"`
 */
export const useReadBudgetTotal = /*#__PURE__*/ createUseReadContract({
  abi: budgetAbi,
  functionName: 'total',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link budgetAbi}__
 */
export const useWriteBudget = /*#__PURE__*/ createUseWriteContract({
  abi: budgetAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"allocate"`
 */
export const useWriteBudgetAllocate = /*#__PURE__*/ createUseWriteContract({
  abi: budgetAbi,
  functionName: 'allocate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: budgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: budgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"disburse"`
 */
export const useWriteBudgetDisburse = /*#__PURE__*/ createUseWriteContract({
  abi: budgetAbi,
  functionName: 'disburse',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const useWriteBudgetDisburseBatch = /*#__PURE__*/ createUseWriteContract(
  { abi: budgetAbi, functionName: 'disburseBatch' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteBudgetInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: budgetAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const useWriteBudgetReclaim = /*#__PURE__*/ createUseWriteContract({
  abi: budgetAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const useWriteBudgetReconcile = /*#__PURE__*/ createUseWriteContract({
  abi: budgetAbi,
  functionName: 'reconcile',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteBudgetRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: budgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: budgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const useWriteBudgetSetAuthorized = /*#__PURE__*/ createUseWriteContract(
  { abi: budgetAbi, functionName: 'setAuthorized' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteBudgetTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: budgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link budgetAbi}__
 */
export const useSimulateBudget = /*#__PURE__*/ createUseSimulateContract({
  abi: budgetAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"allocate"`
 */
export const useSimulateBudgetAllocate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: budgetAbi,
    functionName: 'allocate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: budgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: budgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"disburse"`
 */
export const useSimulateBudgetDisburse =
  /*#__PURE__*/ createUseSimulateContract({
    abi: budgetAbi,
    functionName: 'disburse',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const useSimulateBudgetDisburseBatch =
  /*#__PURE__*/ createUseSimulateContract({
    abi: budgetAbi,
    functionName: 'disburseBatch',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateBudgetInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: budgetAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const useSimulateBudgetReclaim = /*#__PURE__*/ createUseSimulateContract(
  { abi: budgetAbi, functionName: 'reclaim' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const useSimulateBudgetReconcile =
  /*#__PURE__*/ createUseSimulateContract({
    abi: budgetAbi,
    functionName: 'reconcile',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateBudgetRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: budgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: budgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const useSimulateBudgetSetAuthorized =
  /*#__PURE__*/ createUseSimulateContract({
    abi: budgetAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateBudgetTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: budgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link budgetAbi}__
 */
export const useWatchBudgetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: budgetAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link budgetAbi}__ and `eventName` set to `"Authorized"`
 */
export const useWatchBudgetAuthorizedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: budgetAbi,
    eventName: 'Authorized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link budgetAbi}__ and `eventName` set to `"Distributed"`
 */
export const useWatchBudgetDistributedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: budgetAbi,
    eventName: 'Distributed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link budgetAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchBudgetInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: budgetAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link budgetAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchBudgetOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: budgetAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link budgetAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchBudgetOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: budgetAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link budgetAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchBudgetOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: budgetAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__
 */
export const useReadCgdaIncentive = /*#__PURE__*/ createUseReadContract({
  abi: cgdaIncentiveAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"asset"`
 */
export const useReadCgdaIncentiveAsset = /*#__PURE__*/ createUseReadContract({
  abi: cgdaIncentiveAbi,
  functionName: 'asset',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"cgdaParams"`
 */
export const useReadCgdaIncentiveCgdaParams =
  /*#__PURE__*/ createUseReadContract({
    abi: cgdaIncentiveAbi,
    functionName: 'cgdaParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const useReadCgdaIncentiveClaimed = /*#__PURE__*/ createUseReadContract({
  abi: cgdaIncentiveAbi,
  functionName: 'claimed',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const useReadCgdaIncentiveClaims = /*#__PURE__*/ createUseReadContract({
  abi: cgdaIncentiveAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"currentReward"`
 */
export const useReadCgdaIncentiveCurrentReward =
  /*#__PURE__*/ createUseReadContract({
    abi: cgdaIncentiveAbi,
    functionName: 'currentReward',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const useReadCgdaIncentiveIsClaimable =
  /*#__PURE__*/ createUseReadContract({
    abi: cgdaIncentiveAbi,
    functionName: 'isClaimable',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const useReadCgdaIncentiveOwner = /*#__PURE__*/ createUseReadContract({
  abi: cgdaIncentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadCgdaIncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: cgdaIncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const useReadCgdaIncentivePreflight =
  /*#__PURE__*/ createUseReadContract({
    abi: cgdaIncentiveAbi,
    functionName: 'preflight',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadCgdaIncentiveSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: cgdaIncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"totalBudget"`
 */
export const useReadCgdaIncentiveTotalBudget =
  /*#__PURE__*/ createUseReadContract({
    abi: cgdaIncentiveAbi,
    functionName: 'totalBudget',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__
 */
export const useWriteCgdaIncentive = /*#__PURE__*/ createUseWriteContract({
  abi: cgdaIncentiveAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteCgdaIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: cgdaIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const useWriteCgdaIncentiveClaim = /*#__PURE__*/ createUseWriteContract({
  abi: cgdaIncentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteCgdaIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: cgdaIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteCgdaIncentiveInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: cgdaIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const useWriteCgdaIncentiveReclaim =
  /*#__PURE__*/ createUseWriteContract({
    abi: cgdaIncentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteCgdaIncentiveRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: cgdaIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteCgdaIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: cgdaIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteCgdaIncentiveTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: cgdaIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__
 */
export const useSimulateCgdaIncentive = /*#__PURE__*/ createUseSimulateContract(
  { abi: cgdaIncentiveAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateCgdaIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const useSimulateCgdaIncentiveClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateCgdaIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateCgdaIncentiveInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const useSimulateCgdaIncentiveReclaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateCgdaIncentiveRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateCgdaIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateCgdaIncentiveTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cgdaIncentiveAbi}__
 */
export const useWatchCgdaIncentiveEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: cgdaIncentiveAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const useWatchCgdaIncentiveClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cgdaIncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchCgdaIncentiveInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cgdaIncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchCgdaIncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cgdaIncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchCgdaIncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cgdaIncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchCgdaIncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cgdaIncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cloneableAbi}__
 */
export const useReadCloneable = /*#__PURE__*/ createUseReadContract({
  abi: cloneableAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cloneableAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadCloneableSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: cloneableAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cloneableAbi}__
 */
export const useWriteCloneable = /*#__PURE__*/ createUseWriteContract({
  abi: cloneableAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cloneableAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteCloneableInitialize = /*#__PURE__*/ createUseWriteContract(
  { abi: cloneableAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cloneableAbi}__
 */
export const useSimulateCloneable = /*#__PURE__*/ createUseSimulateContract({
  abi: cloneableAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cloneableAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateCloneableInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cloneableAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cloneableAbi}__
 */
export const useWatchCloneableEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: cloneableAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cloneableAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchCloneableInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cloneableAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractActionAbi}__
 */
export const useReadContractAction = /*#__PURE__*/ createUseReadContract({
  abi: contractActionAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"VALIDATOR"`
 */
export const useReadContractActionValidator =
  /*#__PURE__*/ createUseReadContract({
    abi: contractActionAbi,
    functionName: 'VALIDATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"chainId"`
 */
export const useReadContractActionChainId = /*#__PURE__*/ createUseReadContract(
  { abi: contractActionAbi, functionName: 'chainId' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"prepare"`
 */
export const useReadContractActionPrepare = /*#__PURE__*/ createUseReadContract(
  { abi: contractActionAbi, functionName: 'prepare' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"selector"`
 */
export const useReadContractActionSelector =
  /*#__PURE__*/ createUseReadContract({
    abi: contractActionAbi,
    functionName: 'selector',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadContractActionSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: contractActionAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"target"`
 */
export const useReadContractActionTarget = /*#__PURE__*/ createUseReadContract({
  abi: contractActionAbi,
  functionName: 'target',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"value"`
 */
export const useReadContractActionValue = /*#__PURE__*/ createUseReadContract({
  abi: contractActionAbi,
  functionName: 'value',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractActionAbi}__
 */
export const useWriteContractAction = /*#__PURE__*/ createUseWriteContract({
  abi: contractActionAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"execute"`
 */
export const useWriteContractActionExecute =
  /*#__PURE__*/ createUseWriteContract({
    abi: contractActionAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteContractActionInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: contractActionAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractActionAbi}__
 */
export const useSimulateContractAction =
  /*#__PURE__*/ createUseSimulateContract({ abi: contractActionAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"execute"`
 */
export const useSimulateContractActionExecute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractActionAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateContractActionInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractActionAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractActionAbi}__
 */
export const useWatchContractActionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: contractActionAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractActionAbi}__ and `eventName` set to `"ActionExecuted"`
 */
export const useWatchContractActionActionExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractActionAbi,
    eventName: 'ActionExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractActionAbi}__ and `eventName` set to `"ActionValidated"`
 */
export const useWatchContractActionActionValidatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractActionAbi,
    eventName: 'ActionValidated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractActionAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchContractActionInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractActionAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link eip712Abi}__
 */
export const useReadEip712 = /*#__PURE__*/ createUseReadContract({
  abi: eip712Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link eip712Abi}__ and `functionName` set to `"eip712Domain"`
 */
export const useReadEip712Eip712Domain = /*#__PURE__*/ createUseReadContract({
  abi: eip712Abi,
  functionName: 'eip712Domain',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155Abi}__
 */
export const useReadErc1155 = /*#__PURE__*/ createUseReadContract({
  abi: erc1155Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc1155BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: erc1155Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadErc1155BalanceOfBatch = /*#__PURE__*/ createUseReadContract(
  { abi: erc1155Abi, functionName: 'balanceOfBatch' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadErc1155IsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155Abi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadErc1155SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"uri"`
 */
export const useReadErc1155Uri = /*#__PURE__*/ createUseReadContract({
  abi: erc1155Abi,
  functionName: 'uri',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155Abi}__
 */
export const useWriteErc1155 = /*#__PURE__*/ createUseWriteContract({
  abi: erc1155Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteErc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteErc1155SafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteErc1155SetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155Abi}__
 */
export const useSimulateErc1155 = /*#__PURE__*/ createUseSimulateContract({
  abi: erc1155Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateErc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateErc1155SafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateErc1155SetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155Abi}__
 */
export const useWatchErc1155Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc1155Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchErc1155ApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc1155Abi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155Abi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchErc1155TransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc1155Abi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155Abi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchErc1155TransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc1155Abi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155Abi}__ and `eventName` set to `"URI"`
 */
export const useWatchErc1155UriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc1155Abi,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__
 */
export const useReadErc1155Incentive = /*#__PURE__*/ createUseReadContract({
  abi: erc1155IncentiveAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"asset"`
 */
export const useReadErc1155IncentiveAsset = /*#__PURE__*/ createUseReadContract(
  { abi: erc1155IncentiveAbi, functionName: 'asset' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const useReadErc1155IncentiveClaimed =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'claimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const useReadErc1155IncentiveClaims =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'claims',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"extraData"`
 */
export const useReadErc1155IncentiveExtraData =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'extraData',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const useReadErc1155IncentiveIsClaimable =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'isClaimable',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"limit"`
 */
export const useReadErc1155IncentiveLimit = /*#__PURE__*/ createUseReadContract(
  { abi: erc1155IncentiveAbi, functionName: 'limit' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useReadErc1155IncentiveOnErc1155BatchReceived =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useReadErc1155IncentiveOnErc1155Received =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const useReadErc1155IncentiveOwner = /*#__PURE__*/ createUseReadContract(
  { abi: erc1155IncentiveAbi, functionName: 'owner' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadErc1155IncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const useReadErc1155IncentivePreflight =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'preflight',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"strategy"`
 */
export const useReadErc1155IncentiveStrategy =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'strategy',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadErc1155IncentiveSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"tokenId"`
 */
export const useReadErc1155IncentiveTokenId =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'tokenId',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__
 */
export const useWriteErc1155Incentive = /*#__PURE__*/ createUseWriteContract({
  abi: erc1155IncentiveAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteErc1155IncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc1155IncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const useWriteErc1155IncentiveClaim =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc1155IncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteErc1155IncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc1155IncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteErc1155IncentiveInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc1155IncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const useWriteErc1155IncentiveReclaim =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc1155IncentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteErc1155IncentiveRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc1155IncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteErc1155IncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc1155IncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteErc1155IncentiveTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc1155IncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__
 */
export const useSimulateErc1155Incentive =
  /*#__PURE__*/ createUseSimulateContract({ abi: erc1155IncentiveAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateErc1155IncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const useSimulateErc1155IncentiveClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateErc1155IncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateErc1155IncentiveInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const useSimulateErc1155IncentiveReclaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateErc1155IncentiveRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateErc1155IncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateErc1155IncentiveTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155IncentiveAbi}__
 */
export const useWatchErc1155IncentiveEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: erc1155IncentiveAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const useWatchErc1155IncentiveClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc1155IncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchErc1155IncentiveInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc1155IncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchErc1155IncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc1155IncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchErc1155IncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc1155IncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchErc1155IncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc1155IncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1271Abi}__
 */
export const useReadErc1271 = /*#__PURE__*/ createUseReadContract({
  abi: erc1271Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1271Abi}__ and `functionName` set to `"eip712Domain"`
 */
export const useReadErc1271Eip712Domain = /*#__PURE__*/ createUseReadContract({
  abi: erc1271Abi,
  functionName: 'eip712Domain',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1271Abi}__ and `functionName` set to `"isValidSignature"`
 */
export const useReadErc1271IsValidSignature =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1271Abi,
    functionName: 'isValidSignature',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc165Abi}__
 */
export const useReadErc165 = /*#__PURE__*/ createUseReadContract({
  abi: erc165Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc165Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadErc165SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: erc165Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useReadErc20 = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useReadErc20DomainSeparator = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'DOMAIN_SEPARATOR',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadErc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadErc20Decimals = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const useReadErc20Name = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"nonces"`
 */
export const useReadErc20Nonces = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'nonces',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadErc20Symbol = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadErc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWriteErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteErc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"permit"`
 */
export const useWriteErc20Permit = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'permit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteErc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteErc20TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useSimulateErc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateErc20Approve = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"permit"`
 */
export const useSimulateErc20Permit = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: 'permit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateErc20Transfer = /*#__PURE__*/ createUseSimulateContract(
  { abi: erc20Abi, functionName: 'transfer' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateErc20TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWatchErc20Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchErc20ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchErc20TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20IncentiveAbi}__
 */
export const useReadErc20Incentive = /*#__PURE__*/ createUseReadContract({
  abi: erc20IncentiveAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"asset"`
 */
export const useReadErc20IncentiveAsset = /*#__PURE__*/ createUseReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'asset',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const useReadErc20IncentiveClaimed = /*#__PURE__*/ createUseReadContract(
  { abi: erc20IncentiveAbi, functionName: 'claimed' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const useReadErc20IncentiveClaims = /*#__PURE__*/ createUseReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"entries"`
 */
export const useReadErc20IncentiveEntries = /*#__PURE__*/ createUseReadContract(
  { abi: erc20IncentiveAbi, functionName: 'entries' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const useReadErc20IncentiveIsClaimable =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20IncentiveAbi,
    functionName: 'isClaimable',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"limit"`
 */
export const useReadErc20IncentiveLimit = /*#__PURE__*/ createUseReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'limit',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const useReadErc20IncentiveOwner = /*#__PURE__*/ createUseReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadErc20IncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20IncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const useReadErc20IncentivePreflight =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20IncentiveAbi,
    functionName: 'preflight',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"reward"`
 */
export const useReadErc20IncentiveReward = /*#__PURE__*/ createUseReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'reward',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"strategy"`
 */
export const useReadErc20IncentiveStrategy =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20IncentiveAbi,
    functionName: 'strategy',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadErc20IncentiveSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20IncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20IncentiveAbi}__
 */
export const useWriteErc20Incentive = /*#__PURE__*/ createUseWriteContract({
  abi: erc20IncentiveAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteErc20IncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20IncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const useWriteErc20IncentiveClaim = /*#__PURE__*/ createUseWriteContract(
  { abi: erc20IncentiveAbi, functionName: 'claim' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteErc20IncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20IncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"drawRaffle"`
 */
export const useWriteErc20IncentiveDrawRaffle =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20IncentiveAbi,
    functionName: 'drawRaffle',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteErc20IncentiveInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20IncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const useWriteErc20IncentiveReclaim =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20IncentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteErc20IncentiveRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20IncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteErc20IncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20IncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteErc20IncentiveTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20IncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__
 */
export const useSimulateErc20Incentive =
  /*#__PURE__*/ createUseSimulateContract({ abi: erc20IncentiveAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateErc20IncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const useSimulateErc20IncentiveClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateErc20IncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"drawRaffle"`
 */
export const useSimulateErc20IncentiveDrawRaffle =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'drawRaffle',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateErc20IncentiveInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const useSimulateErc20IncentiveReclaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateErc20IncentiveRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateErc20IncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateErc20IncentiveTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20IncentiveAbi}__
 */
export const useWatchErc20IncentiveEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: erc20IncentiveAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const useWatchErc20IncentiveClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20IncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `eventName` set to `"Entry"`
 */
export const useWatchErc20IncentiveEntryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20IncentiveAbi,
    eventName: 'Entry',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchErc20IncentiveInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20IncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchErc20IncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20IncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchErc20IncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20IncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchErc20IncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20IncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc4337Abi}__
 */
export const useReadErc4337 = /*#__PURE__*/ createUseReadContract({
  abi: erc4337Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"eip712Domain"`
 */
export const useReadErc4337Eip712Domain = /*#__PURE__*/ createUseReadContract({
  abi: erc4337Abi,
  functionName: 'eip712Domain',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"entryPoint"`
 */
export const useReadErc4337EntryPoint = /*#__PURE__*/ createUseReadContract({
  abi: erc4337Abi,
  functionName: 'entryPoint',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"getDeposit"`
 */
export const useReadErc4337GetDeposit = /*#__PURE__*/ createUseReadContract({
  abi: erc4337Abi,
  functionName: 'getDeposit',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"isValidSignature"`
 */
export const useReadErc4337IsValidSignature =
  /*#__PURE__*/ createUseReadContract({
    abi: erc4337Abi,
    functionName: 'isValidSignature',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"owner"`
 */
export const useReadErc4337Owner = /*#__PURE__*/ createUseReadContract({
  abi: erc4337Abi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadErc4337OwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: erc4337Abi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadErc4337ProxiableUuid = /*#__PURE__*/ createUseReadContract({
  abi: erc4337Abi,
  functionName: 'proxiableUUID',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"storageLoad"`
 */
export const useReadErc4337StorageLoad = /*#__PURE__*/ createUseReadContract({
  abi: erc4337Abi,
  functionName: 'storageLoad',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__
 */
export const useWriteErc4337 = /*#__PURE__*/ createUseWriteContract({
  abi: erc4337Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"addDeposit"`
 */
export const useWriteErc4337AddDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: erc4337Abi,
  functionName: 'addDeposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteErc4337CancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc4337Abi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteErc4337CompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc4337Abi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"delegateExecute"`
 */
export const useWriteErc4337DelegateExecute =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc4337Abi,
    functionName: 'delegateExecute',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"execute"`
 */
export const useWriteErc4337Execute = /*#__PURE__*/ createUseWriteContract({
  abi: erc4337Abi,
  functionName: 'execute',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"executeBatch"`
 */
export const useWriteErc4337ExecuteBatch = /*#__PURE__*/ createUseWriteContract(
  { abi: erc4337Abi, functionName: 'executeBatch' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"initialize"`
 */
export const useWriteErc4337Initialize = /*#__PURE__*/ createUseWriteContract({
  abi: erc4337Abi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteErc4337RenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc4337Abi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteErc4337RequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc4337Abi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"storageStore"`
 */
export const useWriteErc4337StorageStore = /*#__PURE__*/ createUseWriteContract(
  { abi: erc4337Abi, functionName: 'storageStore' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteErc4337TransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc4337Abi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteErc4337UpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc4337Abi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"validateUserOp"`
 */
export const useWriteErc4337ValidateUserOp =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc4337Abi,
    functionName: 'validateUserOp',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"withdrawDepositTo"`
 */
export const useWriteErc4337WithdrawDepositTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc4337Abi,
    functionName: 'withdrawDepositTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__
 */
export const useSimulateErc4337 = /*#__PURE__*/ createUseSimulateContract({
  abi: erc4337Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"addDeposit"`
 */
export const useSimulateErc4337AddDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc4337Abi,
    functionName: 'addDeposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateErc4337CancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc4337Abi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateErc4337CompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc4337Abi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"delegateExecute"`
 */
export const useSimulateErc4337DelegateExecute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc4337Abi,
    functionName: 'delegateExecute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"execute"`
 */
export const useSimulateErc4337Execute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc4337Abi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"executeBatch"`
 */
export const useSimulateErc4337ExecuteBatch =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc4337Abi,
    functionName: 'executeBatch',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateErc4337Initialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc4337Abi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateErc4337RenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc4337Abi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateErc4337RequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc4337Abi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"storageStore"`
 */
export const useSimulateErc4337StorageStore =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc4337Abi,
    functionName: 'storageStore',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateErc4337TransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc4337Abi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateErc4337UpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc4337Abi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"validateUserOp"`
 */
export const useSimulateErc4337ValidateUserOp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc4337Abi,
    functionName: 'validateUserOp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"withdrawDepositTo"`
 */
export const useSimulateErc4337WithdrawDepositTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc4337Abi,
    functionName: 'withdrawDepositTo',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc4337Abi}__
 */
export const useWatchErc4337Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc4337Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc4337Abi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchErc4337OwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc4337Abi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc4337Abi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchErc4337OwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc4337Abi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc4337Abi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchErc4337OwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc4337Abi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc4337Abi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchErc4337UpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc4337Abi,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const useReadErc721 = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc721BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"getApproved"`
 */
export const useReadErc721GetApproved = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadErc721IsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: erc721Abi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"name"`
 */
export const useReadErc721Name = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadErc721OwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadErc721SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: erc721Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadErc721Symbol = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadErc721TokenUri = /*#__PURE__*/ createUseReadContract({
  abi: erc721Abi,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const useWriteErc721 = /*#__PURE__*/ createUseWriteContract({
  abi: erc721Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteErc721Approve = /*#__PURE__*/ createUseWriteContract({
  abi: erc721Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteErc721SafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc721Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteErc721SetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc721Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteErc721TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: erc721Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const useSimulateErc721 = /*#__PURE__*/ createUseSimulateContract({
  abi: erc721Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateErc721Approve = /*#__PURE__*/ createUseSimulateContract(
  { abi: erc721Abi, functionName: 'approve' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateErc721SafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc721Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateErc721SetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc721Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateErc721TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc721Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721Abi}__
 */
export const useWatchErc721Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc721Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchErc721ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc721Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchErc721ApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc721Abi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchErc721TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc721Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721MintActionAbi}__
 */
export const useReadErc721MintAction = /*#__PURE__*/ createUseReadContract({
  abi: erc721MintActionAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"VALIDATOR"`
 */
export const useReadErc721MintActionValidator =
  /*#__PURE__*/ createUseReadContract({
    abi: erc721MintActionAbi,
    functionName: 'VALIDATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"chainId"`
 */
export const useReadErc721MintActionChainId =
  /*#__PURE__*/ createUseReadContract({
    abi: erc721MintActionAbi,
    functionName: 'chainId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"owner"`
 */
export const useReadErc721MintActionOwner = /*#__PURE__*/ createUseReadContract(
  { abi: erc721MintActionAbi, functionName: 'owner' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadErc721MintActionOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: erc721MintActionAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"prepare"`
 */
export const useReadErc721MintActionPrepare =
  /*#__PURE__*/ createUseReadContract({
    abi: erc721MintActionAbi,
    functionName: 'prepare',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"selector"`
 */
export const useReadErc721MintActionSelector =
  /*#__PURE__*/ createUseReadContract({
    abi: erc721MintActionAbi,
    functionName: 'selector',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadErc721MintActionSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: erc721MintActionAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"target"`
 */
export const useReadErc721MintActionTarget =
  /*#__PURE__*/ createUseReadContract({
    abi: erc721MintActionAbi,
    functionName: 'target',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"validated"`
 */
export const useReadErc721MintActionValidated =
  /*#__PURE__*/ createUseReadContract({
    abi: erc721MintActionAbi,
    functionName: 'validated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"value"`
 */
export const useReadErc721MintActionValue = /*#__PURE__*/ createUseReadContract(
  { abi: erc721MintActionAbi, functionName: 'value' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721MintActionAbi}__
 */
export const useWriteErc721MintAction = /*#__PURE__*/ createUseWriteContract({
  abi: erc721MintActionAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteErc721MintActionCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc721MintActionAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteErc721MintActionCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc721MintActionAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"execute"`
 */
export const useWriteErc721MintActionExecute =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc721MintActionAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteErc721MintActionInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc721MintActionAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteErc721MintActionRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc721MintActionAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteErc721MintActionRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc721MintActionAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteErc721MintActionTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc721MintActionAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"validate"`
 */
export const useWriteErc721MintActionValidate =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc721MintActionAbi,
    functionName: 'validate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__
 */
export const useSimulateErc721MintAction =
  /*#__PURE__*/ createUseSimulateContract({ abi: erc721MintActionAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateErc721MintActionCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateErc721MintActionCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"execute"`
 */
export const useSimulateErc721MintActionExecute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateErc721MintActionInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateErc721MintActionRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateErc721MintActionRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateErc721MintActionTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"validate"`
 */
export const useSimulateErc721MintActionValidate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'validate',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721MintActionAbi}__
 */
export const useWatchErc721MintActionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: erc721MintActionAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721MintActionAbi}__ and `eventName` set to `"ActionExecuted"`
 */
export const useWatchErc721MintActionActionExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc721MintActionAbi,
    eventName: 'ActionExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721MintActionAbi}__ and `eventName` set to `"ActionValidated"`
 */
export const useWatchErc721MintActionActionValidatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc721MintActionAbi,
    eventName: 'ActionValidated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721MintActionAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchErc721MintActionInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc721MintActionAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721MintActionAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchErc721MintActionOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc721MintActionAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721MintActionAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchErc721MintActionOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc721MintActionAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc721MintActionAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchErc721MintActionOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc721MintActionAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAggregatorAbi}__
 */
export const useReadIAggregator = /*#__PURE__*/ createUseReadContract({
  abi: iAggregatorAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAggregatorAbi}__ and `functionName` set to `"aggregateSignatures"`
 */
export const useReadIAggregatorAggregateSignatures =
  /*#__PURE__*/ createUseReadContract({
    abi: iAggregatorAbi,
    functionName: 'aggregateSignatures',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAggregatorAbi}__ and `functionName` set to `"validateSignatures"`
 */
export const useReadIAggregatorValidateSignatures =
  /*#__PURE__*/ createUseReadContract({
    abi: iAggregatorAbi,
    functionName: 'validateSignatures',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAggregatorAbi}__ and `functionName` set to `"validateUserOpSignature"`
 */
export const useReadIAggregatorValidateUserOpSignature =
  /*#__PURE__*/ createUseReadContract({
    abi: iAggregatorAbi,
    functionName: 'validateUserOpSignature',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const useReadIerc1155 = /*#__PURE__*/ createUseReadContract({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIerc1155BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: ierc1155Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadIerc1155BalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155Abi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadIerc1155IsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155Abi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadIerc1155SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const useWriteIerc1155 = /*#__PURE__*/ createUseWriteContract({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteIerc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteIerc1155SafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteIerc1155SetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const useSimulateIerc1155 = /*#__PURE__*/ createUseSimulateContract({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateIerc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateIerc1155SafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateIerc1155SetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const useWatchIerc1155Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchIerc1155ApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchIerc1155TransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchIerc1155TransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"URI"`
 */
export const useWatchIerc1155UriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__
 */
export const useReadIerc1155Receiver = /*#__PURE__*/ createUseReadContract({
  abi: ierc1155ReceiverAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadIerc1155ReceiverSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__
 */
export const useWriteIerc1155Receiver = /*#__PURE__*/ createUseWriteContract({
  abi: ierc1155ReceiverAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useWriteIerc1155ReceiverOnErc1155BatchReceived =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useWriteIerc1155ReceiverOnErc1155Received =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__
 */
export const useSimulateIerc1155Receiver =
  /*#__PURE__*/ createUseSimulateContract({ abi: ierc1155ReceiverAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useSimulateIerc1155ReceiverOnErc1155BatchReceived =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useSimulateIerc1155ReceiverOnErc1155Received =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1271Abi}__
 */
export const useReadIerc1271 = /*#__PURE__*/ createUseReadContract({
  abi: ierc1271Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1271Abi}__ and `functionName` set to `"isValidSignature"`
 */
export const useReadIerc1271IsValidSignature =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1271Abi,
    functionName: 'isValidSignature',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc165Abi}__
 */
export const useReadIerc165 = /*#__PURE__*/ createUseReadContract({
  abi: ierc165Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc165Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadIerc165SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc165Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iEntryPointAbi}__
 */
export const useReadIEntryPoint = /*#__PURE__*/ createUseReadContract({
  abi: iEntryPointAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIEntryPointBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: iEntryPointAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"getDepositInfo"`
 */
export const useReadIEntryPointGetDepositInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: iEntryPointAbi,
    functionName: 'getDepositInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"getNonce"`
 */
export const useReadIEntryPointGetNonce = /*#__PURE__*/ createUseReadContract({
  abi: iEntryPointAbi,
  functionName: 'getNonce',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"getUserOpHash"`
 */
export const useReadIEntryPointGetUserOpHash =
  /*#__PURE__*/ createUseReadContract({
    abi: iEntryPointAbi,
    functionName: 'getUserOpHash',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iEntryPointAbi}__
 */
export const useWriteIEntryPoint = /*#__PURE__*/ createUseWriteContract({
  abi: iEntryPointAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"addStake"`
 */
export const useWriteIEntryPointAddStake = /*#__PURE__*/ createUseWriteContract(
  { abi: iEntryPointAbi, functionName: 'addStake' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"depositTo"`
 */
export const useWriteIEntryPointDepositTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: iEntryPointAbi,
    functionName: 'depositTo',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"getSenderAddress"`
 */
export const useWriteIEntryPointGetSenderAddress =
  /*#__PURE__*/ createUseWriteContract({
    abi: iEntryPointAbi,
    functionName: 'getSenderAddress',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"handleAggregatedOps"`
 */
export const useWriteIEntryPointHandleAggregatedOps =
  /*#__PURE__*/ createUseWriteContract({
    abi: iEntryPointAbi,
    functionName: 'handleAggregatedOps',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"handleOps"`
 */
export const useWriteIEntryPointHandleOps =
  /*#__PURE__*/ createUseWriteContract({
    abi: iEntryPointAbi,
    functionName: 'handleOps',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"incrementNonce"`
 */
export const useWriteIEntryPointIncrementNonce =
  /*#__PURE__*/ createUseWriteContract({
    abi: iEntryPointAbi,
    functionName: 'incrementNonce',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"simulateHandleOp"`
 */
export const useWriteIEntryPointSimulateHandleOp =
  /*#__PURE__*/ createUseWriteContract({
    abi: iEntryPointAbi,
    functionName: 'simulateHandleOp',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"simulateValidation"`
 */
export const useWriteIEntryPointSimulateValidation =
  /*#__PURE__*/ createUseWriteContract({
    abi: iEntryPointAbi,
    functionName: 'simulateValidation',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"unlockStake"`
 */
export const useWriteIEntryPointUnlockStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: iEntryPointAbi,
    functionName: 'unlockStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const useWriteIEntryPointWithdrawStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: iEntryPointAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const useWriteIEntryPointWithdrawTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: iEntryPointAbi,
    functionName: 'withdrawTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iEntryPointAbi}__
 */
export const useSimulateIEntryPoint = /*#__PURE__*/ createUseSimulateContract({
  abi: iEntryPointAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"addStake"`
 */
export const useSimulateIEntryPointAddStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'addStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"depositTo"`
 */
export const useSimulateIEntryPointDepositTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'depositTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"getSenderAddress"`
 */
export const useSimulateIEntryPointGetSenderAddress =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'getSenderAddress',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"handleAggregatedOps"`
 */
export const useSimulateIEntryPointHandleAggregatedOps =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'handleAggregatedOps',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"handleOps"`
 */
export const useSimulateIEntryPointHandleOps =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'handleOps',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"incrementNonce"`
 */
export const useSimulateIEntryPointIncrementNonce =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'incrementNonce',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"simulateHandleOp"`
 */
export const useSimulateIEntryPointSimulateHandleOp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'simulateHandleOp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"simulateValidation"`
 */
export const useSimulateIEntryPointSimulateValidation =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'simulateValidation',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"unlockStake"`
 */
export const useSimulateIEntryPointUnlockStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'unlockStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const useSimulateIEntryPointWithdrawStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const useSimulateIEntryPointWithdrawTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'withdrawTo',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__
 */
export const useWatchIEntryPointEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: iEntryPointAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"AccountDeployed"`
 */
export const useWatchIEntryPointAccountDeployedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'AccountDeployed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"BeforeExecution"`
 */
export const useWatchIEntryPointBeforeExecutionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'BeforeExecution',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"Deposited"`
 */
export const useWatchIEntryPointDepositedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'Deposited',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"SignatureAggregatorChanged"`
 */
export const useWatchIEntryPointSignatureAggregatorChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'SignatureAggregatorChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"StakeLocked"`
 */
export const useWatchIEntryPointStakeLockedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'StakeLocked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"StakeUnlocked"`
 */
export const useWatchIEntryPointStakeUnlockedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'StakeUnlocked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"StakeWithdrawn"`
 */
export const useWatchIEntryPointStakeWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'StakeWithdrawn',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"UserOperationEvent"`
 */
export const useWatchIEntryPointUserOperationEventEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'UserOperationEvent',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"UserOperationRevertReason"`
 */
export const useWatchIEntryPointUserOperationRevertReasonEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'UserOperationRevertReason',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"Withdrawn"`
 */
export const useWatchIEntryPointWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'Withdrawn',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iNonceManagerAbi}__
 */
export const useReadINonceManager = /*#__PURE__*/ createUseReadContract({
  abi: iNonceManagerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iNonceManagerAbi}__ and `functionName` set to `"getNonce"`
 */
export const useReadINonceManagerGetNonce = /*#__PURE__*/ createUseReadContract(
  { abi: iNonceManagerAbi, functionName: 'getNonce' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iNonceManagerAbi}__
 */
export const useWriteINonceManager = /*#__PURE__*/ createUseWriteContract({
  abi: iNonceManagerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iNonceManagerAbi}__ and `functionName` set to `"incrementNonce"`
 */
export const useWriteINonceManagerIncrementNonce =
  /*#__PURE__*/ createUseWriteContract({
    abi: iNonceManagerAbi,
    functionName: 'incrementNonce',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iNonceManagerAbi}__
 */
export const useSimulateINonceManager = /*#__PURE__*/ createUseSimulateContract(
  { abi: iNonceManagerAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iNonceManagerAbi}__ and `functionName` set to `"incrementNonce"`
 */
export const useSimulateINonceManagerIncrementNonce =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iNonceManagerAbi,
    functionName: 'incrementNonce',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iPaymasterAbi}__
 */
export const useWriteIPaymaster = /*#__PURE__*/ createUseWriteContract({
  abi: iPaymasterAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iPaymasterAbi}__ and `functionName` set to `"postOp"`
 */
export const useWriteIPaymasterPostOp = /*#__PURE__*/ createUseWriteContract({
  abi: iPaymasterAbi,
  functionName: 'postOp',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iPaymasterAbi}__ and `functionName` set to `"validatePaymasterUserOp"`
 */
export const useWriteIPaymasterValidatePaymasterUserOp =
  /*#__PURE__*/ createUseWriteContract({
    abi: iPaymasterAbi,
    functionName: 'validatePaymasterUserOp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iPaymasterAbi}__
 */
export const useSimulateIPaymaster = /*#__PURE__*/ createUseSimulateContract({
  abi: iPaymasterAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iPaymasterAbi}__ and `functionName` set to `"postOp"`
 */
export const useSimulateIPaymasterPostOp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iPaymasterAbi,
    functionName: 'postOp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iPaymasterAbi}__ and `functionName` set to `"validatePaymasterUserOp"`
 */
export const useSimulateIPaymasterValidatePaymasterUserOp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iPaymasterAbi,
    functionName: 'validatePaymasterUserOp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iStakeManagerAbi}__
 */
export const useReadIStakeManager = /*#__PURE__*/ createUseReadContract({
  abi: iStakeManagerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIStakeManagerBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: iStakeManagerAbi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"getDepositInfo"`
 */
export const useReadIStakeManagerGetDepositInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: iStakeManagerAbi,
    functionName: 'getDepositInfo',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iStakeManagerAbi}__
 */
export const useWriteIStakeManager = /*#__PURE__*/ createUseWriteContract({
  abi: iStakeManagerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"addStake"`
 */
export const useWriteIStakeManagerAddStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: iStakeManagerAbi,
    functionName: 'addStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"depositTo"`
 */
export const useWriteIStakeManagerDepositTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: iStakeManagerAbi,
    functionName: 'depositTo',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"unlockStake"`
 */
export const useWriteIStakeManagerUnlockStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: iStakeManagerAbi,
    functionName: 'unlockStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const useWriteIStakeManagerWithdrawStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: iStakeManagerAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const useWriteIStakeManagerWithdrawTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: iStakeManagerAbi,
    functionName: 'withdrawTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iStakeManagerAbi}__
 */
export const useSimulateIStakeManager = /*#__PURE__*/ createUseSimulateContract(
  { abi: iStakeManagerAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"addStake"`
 */
export const useSimulateIStakeManagerAddStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iStakeManagerAbi,
    functionName: 'addStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"depositTo"`
 */
export const useSimulateIStakeManagerDepositTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iStakeManagerAbi,
    functionName: 'depositTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"unlockStake"`
 */
export const useSimulateIStakeManagerUnlockStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iStakeManagerAbi,
    functionName: 'unlockStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const useSimulateIStakeManagerWithdrawStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iStakeManagerAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const useSimulateIStakeManagerWithdrawTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iStakeManagerAbi,
    functionName: 'withdrawTo',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iStakeManagerAbi}__
 */
export const useWatchIStakeManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: iStakeManagerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iStakeManagerAbi}__ and `eventName` set to `"Deposited"`
 */
export const useWatchIStakeManagerDepositedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iStakeManagerAbi,
    eventName: 'Deposited',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iStakeManagerAbi}__ and `eventName` set to `"StakeLocked"`
 */
export const useWatchIStakeManagerStakeLockedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iStakeManagerAbi,
    eventName: 'StakeLocked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iStakeManagerAbi}__ and `eventName` set to `"StakeUnlocked"`
 */
export const useWatchIStakeManagerStakeUnlockedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iStakeManagerAbi,
    eventName: 'StakeUnlocked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iStakeManagerAbi}__ and `eventName` set to `"StakeWithdrawn"`
 */
export const useWatchIStakeManagerStakeWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iStakeManagerAbi,
    eventName: 'StakeWithdrawn',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iStakeManagerAbi}__ and `eventName` set to `"Withdrawn"`
 */
export const useWatchIStakeManagerWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iStakeManagerAbi,
    eventName: 'Withdrawn',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link incentiveAbi}__
 */
export const useReadIncentive = /*#__PURE__*/ createUseReadContract({
  abi: incentiveAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const useReadIncentiveClaimed = /*#__PURE__*/ createUseReadContract({
  abi: incentiveAbi,
  functionName: 'claimed',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"claims"`
 */
export const useReadIncentiveClaims = /*#__PURE__*/ createUseReadContract({
  abi: incentiveAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const useReadIncentiveIsClaimable = /*#__PURE__*/ createUseReadContract({
  abi: incentiveAbi,
  functionName: 'isClaimable',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"owner"`
 */
export const useReadIncentiveOwner = /*#__PURE__*/ createUseReadContract({
  abi: incentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadIncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: incentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const useReadIncentivePreflight = /*#__PURE__*/ createUseReadContract({
  abi: incentiveAbi,
  functionName: 'preflight',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadIncentiveSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: incentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link incentiveAbi}__
 */
export const useWriteIncentive = /*#__PURE__*/ createUseWriteContract({
  abi: incentiveAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: incentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"claim"`
 */
export const useWriteIncentiveClaim = /*#__PURE__*/ createUseWriteContract({
  abi: incentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: incentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteIncentiveInitialize = /*#__PURE__*/ createUseWriteContract(
  { abi: incentiveAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const useWriteIncentiveReclaim = /*#__PURE__*/ createUseWriteContract({
  abi: incentiveAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteIncentiveRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: incentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: incentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteIncentiveTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: incentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link incentiveAbi}__
 */
export const useSimulateIncentive = /*#__PURE__*/ createUseSimulateContract({
  abi: incentiveAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: incentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"claim"`
 */
export const useSimulateIncentiveClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: incentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: incentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateIncentiveInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: incentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const useSimulateIncentiveReclaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: incentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateIncentiveRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: incentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: incentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateIncentiveTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: incentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link incentiveAbi}__
 */
export const useWatchIncentiveEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: incentiveAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link incentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const useWatchIncentiveClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: incentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link incentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchIncentiveInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: incentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link incentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchIncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: incentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link incentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchIncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: incentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link incentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchIncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: incentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link initializableAbi}__
 */
export const useWatchInitializableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: initializableAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link initializableAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchInitializableInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: initializableAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc1155Abi}__
 */
export const useReadMockErc1155 = /*#__PURE__*/ createUseReadContract({
  abi: mockErc1155Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadMockErc1155BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: mockErc1155Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadMockErc1155BalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: mockErc1155Abi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadMockErc1155IsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: mockErc1155Abi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadMockErc1155SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: mockErc1155Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"uri"`
 */
export const useReadMockErc1155Uri = /*#__PURE__*/ createUseReadContract({
  abi: mockErc1155Abi,
  functionName: 'uri',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc1155Abi}__
 */
export const useWriteMockErc1155 = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc1155Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"burn"`
 */
export const useWriteMockErc1155Burn = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc1155Abi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"mint"`
 */
export const useWriteMockErc1155Mint = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc1155Abi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteMockErc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockErc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteMockErc1155SafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockErc1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteMockErc1155SetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockErc1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc1155Abi}__
 */
export const useSimulateMockErc1155 = /*#__PURE__*/ createUseSimulateContract({
  abi: mockErc1155Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"burn"`
 */
export const useSimulateMockErc1155Burn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc1155Abi,
    functionName: 'burn',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"mint"`
 */
export const useSimulateMockErc1155Mint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc1155Abi,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateMockErc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateMockErc1155SafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateMockErc1155SetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockErc1155Abi}__
 */
export const useWatchMockErc1155Event =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: mockErc1155Abi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockErc1155Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchMockErc1155ApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockErc1155Abi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockErc1155Abi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchMockErc1155TransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockErc1155Abi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockErc1155Abi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchMockErc1155TransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockErc1155Abi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockErc1155Abi}__ and `eventName` set to `"URI"`
 */
export const useWatchMockErc1155UriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockErc1155Abi,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__
 */
export const useReadMockErc20 = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useReadMockErc20DomainSeparator =
  /*#__PURE__*/ createUseReadContract({
    abi: mockErc20Abi,
    functionName: 'DOMAIN_SEPARATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadMockErc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadMockErc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadMockErc20Decimals = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"name"`
 */
export const useReadMockErc20Name = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"nonces"`
 */
export const useReadMockErc20Nonces = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
  functionName: 'nonces',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadMockErc20Symbol = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadMockErc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: mockErc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc20Abi}__
 */
export const useWriteMockErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteMockErc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"mint"`
 */
export const useWriteMockErc20Mint = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc20Abi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"mintPayable"`
 */
export const useWriteMockErc20MintPayable =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockErc20Abi,
    functionName: 'mintPayable',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"permit"`
 */
export const useWriteMockErc20Permit = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc20Abi,
  functionName: 'permit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteMockErc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteMockErc20TransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockErc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc20Abi}__
 */
export const useSimulateMockErc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: mockErc20Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateMockErc20Approve =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc20Abi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"mint"`
 */
export const useSimulateMockErc20Mint = /*#__PURE__*/ createUseSimulateContract(
  { abi: mockErc20Abi, functionName: 'mint' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"mintPayable"`
 */
export const useSimulateMockErc20MintPayable =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc20Abi,
    functionName: 'mintPayable',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"permit"`
 */
export const useSimulateMockErc20Permit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc20Abi,
    functionName: 'permit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateMockErc20Transfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc20Abi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateMockErc20TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockErc20Abi}__
 */
export const useWatchMockErc20Event = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: mockErc20Abi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockErc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchMockErc20ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockErc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockErc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchMockErc20TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockErc20Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc721Abi}__
 */
export const useReadMockErc721 = /*#__PURE__*/ createUseReadContract({
  abi: mockErc721Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadMockErc721BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: mockErc721Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"getApproved"`
 */
export const useReadMockErc721GetApproved = /*#__PURE__*/ createUseReadContract(
  { abi: mockErc721Abi, functionName: 'getApproved' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadMockErc721IsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: mockErc721Abi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"mintPrice"`
 */
export const useReadMockErc721MintPrice = /*#__PURE__*/ createUseReadContract({
  abi: mockErc721Abi,
  functionName: 'mintPrice',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"name"`
 */
export const useReadMockErc721Name = /*#__PURE__*/ createUseReadContract({
  abi: mockErc721Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadMockErc721OwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: mockErc721Abi,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadMockErc721SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: mockErc721Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadMockErc721Symbol = /*#__PURE__*/ createUseReadContract({
  abi: mockErc721Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadMockErc721TokenUri = /*#__PURE__*/ createUseReadContract({
  abi: mockErc721Abi,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadMockErc721TotalSupply = /*#__PURE__*/ createUseReadContract(
  { abi: mockErc721Abi, functionName: 'totalSupply' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc721Abi}__
 */
export const useWriteMockErc721 = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc721Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteMockErc721Approve = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc721Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"mint"`
 */
export const useWriteMockErc721Mint = /*#__PURE__*/ createUseWriteContract({
  abi: mockErc721Abi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteMockErc721SafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockErc721Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteMockErc721SetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockErc721Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteMockErc721TransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockErc721Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc721Abi}__
 */
export const useSimulateMockErc721 = /*#__PURE__*/ createUseSimulateContract({
  abi: mockErc721Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateMockErc721Approve =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc721Abi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"mint"`
 */
export const useSimulateMockErc721Mint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc721Abi,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateMockErc721SafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc721Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateMockErc721SetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc721Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateMockErc721TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockErc721Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockErc721Abi}__
 */
export const useWatchMockErc721Event =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: mockErc721Abi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockErc721Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchMockErc721ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockErc721Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockErc721Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchMockErc721ApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockErc721Abi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockErc721Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchMockErc721TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockErc721Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableRolesAbi}__
 */
export const useReadOwnableRoles = /*#__PURE__*/ createUseReadContract({
  abi: ownableRolesAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"hasAllRoles"`
 */
export const useReadOwnableRolesHasAllRoles =
  /*#__PURE__*/ createUseReadContract({
    abi: ownableRolesAbi,
    functionName: 'hasAllRoles',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"hasAnyRole"`
 */
export const useReadOwnableRolesHasAnyRole =
  /*#__PURE__*/ createUseReadContract({
    abi: ownableRolesAbi,
    functionName: 'hasAnyRole',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"owner"`
 */
export const useReadOwnableRolesOwner = /*#__PURE__*/ createUseReadContract({
  abi: ownableRolesAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadOwnableRolesOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: ownableRolesAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"rolesOf"`
 */
export const useReadOwnableRolesRolesOf = /*#__PURE__*/ createUseReadContract({
  abi: ownableRolesAbi,
  functionName: 'rolesOf',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableRolesAbi}__
 */
export const useWriteOwnableRoles = /*#__PURE__*/ createUseWriteContract({
  abi: ownableRolesAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteOwnableRolesCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableRolesAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteOwnableRolesCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableRolesAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"grantRoles"`
 */
export const useWriteOwnableRolesGrantRoles =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableRolesAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteOwnableRolesRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableRolesAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const useWriteOwnableRolesRenounceRoles =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableRolesAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteOwnableRolesRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableRolesAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const useWriteOwnableRolesRevokeRoles =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableRolesAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteOwnableRolesTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableRolesAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableRolesAbi}__
 */
export const useSimulateOwnableRoles = /*#__PURE__*/ createUseSimulateContract({
  abi: ownableRolesAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateOwnableRolesCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateOwnableRolesCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"grantRoles"`
 */
export const useSimulateOwnableRolesGrantRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateOwnableRolesRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const useSimulateOwnableRolesRenounceRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateOwnableRolesRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const useSimulateOwnableRolesRevokeRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateOwnableRolesTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableRolesAbi}__
 */
export const useWatchOwnableRolesEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: ownableRolesAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableRolesAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchOwnableRolesOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ownableRolesAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableRolesAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchOwnableRolesOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ownableRolesAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableRolesAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchOwnableRolesOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ownableRolesAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableRolesAbi}__ and `eventName` set to `"RolesUpdated"`
 */
export const useWatchOwnableRolesRolesUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ownableRolesAbi,
    eventName: 'RolesUpdated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__
 */
export const useReadPoints = /*#__PURE__*/ createUseReadContract({
  abi: pointsAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useReadPointsDomainSeparator = /*#__PURE__*/ createUseReadContract(
  { abi: pointsAbi, functionName: 'DOMAIN_SEPARATOR' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"ISSUER_ROLE"`
 */
export const useReadPointsIssuerRole = /*#__PURE__*/ createUseReadContract({
  abi: pointsAbi,
  functionName: 'ISSUER_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadPointsAllowance = /*#__PURE__*/ createUseReadContract({
  abi: pointsAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadPointsBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: pointsAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadPointsDecimals = /*#__PURE__*/ createUseReadContract({
  abi: pointsAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"hasAllRoles"`
 */
export const useReadPointsHasAllRoles = /*#__PURE__*/ createUseReadContract({
  abi: pointsAbi,
  functionName: 'hasAllRoles',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"hasAnyRole"`
 */
export const useReadPointsHasAnyRole = /*#__PURE__*/ createUseReadContract({
  abi: pointsAbi,
  functionName: 'hasAnyRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"name"`
 */
export const useReadPointsName = /*#__PURE__*/ createUseReadContract({
  abi: pointsAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"nonces"`
 */
export const useReadPointsNonces = /*#__PURE__*/ createUseReadContract({
  abi: pointsAbi,
  functionName: 'nonces',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"owner"`
 */
export const useReadPointsOwner = /*#__PURE__*/ createUseReadContract({
  abi: pointsAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadPointsOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: pointsAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"rolesOf"`
 */
export const useReadPointsRolesOf = /*#__PURE__*/ createUseReadContract({
  abi: pointsAbi,
  functionName: 'rolesOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadPointsSymbol = /*#__PURE__*/ createUseReadContract({
  abi: pointsAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadPointsTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: pointsAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__
 */
export const useWritePoints = /*#__PURE__*/ createUseWriteContract({
  abi: pointsAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"approve"`
 */
export const useWritePointsApprove = /*#__PURE__*/ createUseWriteContract({
  abi: pointsAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWritePointsCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: pointsAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWritePointsCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: pointsAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"grantRoles"`
 */
export const useWritePointsGrantRoles = /*#__PURE__*/ createUseWriteContract({
  abi: pointsAbi,
  functionName: 'grantRoles',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"initialize"`
 */
export const useWritePointsInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: pointsAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"issue"`
 */
export const useWritePointsIssue = /*#__PURE__*/ createUseWriteContract({
  abi: pointsAbi,
  functionName: 'issue',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"permit"`
 */
export const useWritePointsPermit = /*#__PURE__*/ createUseWriteContract({
  abi: pointsAbi,
  functionName: 'permit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWritePointsRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: pointsAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const useWritePointsRenounceRoles = /*#__PURE__*/ createUseWriteContract(
  { abi: pointsAbi, functionName: 'renounceRoles' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWritePointsRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: pointsAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const useWritePointsRevokeRoles = /*#__PURE__*/ createUseWriteContract({
  abi: pointsAbi,
  functionName: 'revokeRoles',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"transfer"`
 */
export const useWritePointsTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: pointsAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWritePointsTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: pointsAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWritePointsTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: pointsAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__
 */
export const useSimulatePoints = /*#__PURE__*/ createUseSimulateContract({
  abi: pointsAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulatePointsApprove = /*#__PURE__*/ createUseSimulateContract(
  { abi: pointsAbi, functionName: 'approve' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulatePointsCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulatePointsCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"grantRoles"`
 */
export const useSimulatePointsGrantRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulatePointsInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"issue"`
 */
export const useSimulatePointsIssue = /*#__PURE__*/ createUseSimulateContract({
  abi: pointsAbi,
  functionName: 'issue',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"permit"`
 */
export const useSimulatePointsPermit = /*#__PURE__*/ createUseSimulateContract({
  abi: pointsAbi,
  functionName: 'permit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulatePointsRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const useSimulatePointsRenounceRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulatePointsRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const useSimulatePointsRevokeRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulatePointsTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulatePointsTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulatePointsTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pointsAbi}__
 */
export const useWatchPointsEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: pointsAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pointsAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchPointsApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pointsAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pointsAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchPointsInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pointsAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pointsAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchPointsOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pointsAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pointsAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchPointsOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pointsAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pointsAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchPointsOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pointsAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pointsAbi}__ and `eventName` set to `"RolesUpdated"`
 */
export const useWatchPointsRolesUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pointsAbi,
    eventName: 'RolesUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pointsAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchPointsTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pointsAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsIncentiveAbi}__
 */
export const useReadPointsIncentive = /*#__PURE__*/ createUseReadContract({
  abi: pointsIncentiveAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const useReadPointsIncentiveClaimed =
  /*#__PURE__*/ createUseReadContract({
    abi: pointsIncentiveAbi,
    functionName: 'claimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const useReadPointsIncentiveClaims = /*#__PURE__*/ createUseReadContract(
  { abi: pointsIncentiveAbi, functionName: 'claims' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const useReadPointsIncentiveIsClaimable =
  /*#__PURE__*/ createUseReadContract({
    abi: pointsIncentiveAbi,
    functionName: 'isClaimable',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"limit"`
 */
export const useReadPointsIncentiveLimit = /*#__PURE__*/ createUseReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'limit',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const useReadPointsIncentiveOwner = /*#__PURE__*/ createUseReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadPointsIncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: pointsIncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const useReadPointsIncentivePreflight =
  /*#__PURE__*/ createUseReadContract({
    abi: pointsIncentiveAbi,
    functionName: 'preflight',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"quantity"`
 */
export const useReadPointsIncentiveQuantity =
  /*#__PURE__*/ createUseReadContract({
    abi: pointsIncentiveAbi,
    functionName: 'quantity',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const useReadPointsIncentiveReclaim =
  /*#__PURE__*/ createUseReadContract({
    abi: pointsIncentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"selector"`
 */
export const useReadPointsIncentiveSelector =
  /*#__PURE__*/ createUseReadContract({
    abi: pointsIncentiveAbi,
    functionName: 'selector',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadPointsIncentiveSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: pointsIncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"venue"`
 */
export const useReadPointsIncentiveVenue = /*#__PURE__*/ createUseReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'venue',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsIncentiveAbi}__
 */
export const useWritePointsIncentive = /*#__PURE__*/ createUseWriteContract({
  abi: pointsIncentiveAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWritePointsIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: pointsIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const useWritePointsIncentiveClaim =
  /*#__PURE__*/ createUseWriteContract({
    abi: pointsIncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWritePointsIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: pointsIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const useWritePointsIncentiveInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: pointsIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWritePointsIncentiveRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: pointsIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWritePointsIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: pointsIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWritePointsIncentiveTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: pointsIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__
 */
export const useSimulatePointsIncentive =
  /*#__PURE__*/ createUseSimulateContract({ abi: pointsIncentiveAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulatePointsIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const useSimulatePointsIncentiveClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsIncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulatePointsIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulatePointsIncentiveInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulatePointsIncentiveRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulatePointsIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulatePointsIncentiveTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pointsIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pointsIncentiveAbi}__
 */
export const useWatchPointsIncentiveEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: pointsIncentiveAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const useWatchPointsIncentiveClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pointsIncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchPointsIncentiveInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pointsIncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchPointsIncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pointsIncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchPointsIncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pointsIncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchPointsIncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: pointsIncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link signerValidatorAbi}__
 */
export const useReadSignerValidator = /*#__PURE__*/ createUseReadContract({
  abi: signerValidatorAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"owner"`
 */
export const useReadSignerValidatorOwner = /*#__PURE__*/ createUseReadContract({
  abi: signerValidatorAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadSignerValidatorOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: signerValidatorAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"signers"`
 */
export const useReadSignerValidatorSigners =
  /*#__PURE__*/ createUseReadContract({
    abi: signerValidatorAbi,
    functionName: 'signers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadSignerValidatorSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: signerValidatorAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link signerValidatorAbi}__
 */
export const useWriteSignerValidator = /*#__PURE__*/ createUseWriteContract({
  abi: signerValidatorAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteSignerValidatorCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: signerValidatorAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteSignerValidatorCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: signerValidatorAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteSignerValidatorInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: signerValidatorAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteSignerValidatorRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: signerValidatorAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteSignerValidatorRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: signerValidatorAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const useWriteSignerValidatorSetAuthorized =
  /*#__PURE__*/ createUseWriteContract({
    abi: signerValidatorAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteSignerValidatorTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: signerValidatorAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"validate"`
 */
export const useWriteSignerValidatorValidate =
  /*#__PURE__*/ createUseWriteContract({
    abi: signerValidatorAbi,
    functionName: 'validate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link signerValidatorAbi}__
 */
export const useSimulateSignerValidator =
  /*#__PURE__*/ createUseSimulateContract({ abi: signerValidatorAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateSignerValidatorCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateSignerValidatorCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateSignerValidatorInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateSignerValidatorRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateSignerValidatorRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const useSimulateSignerValidatorSetAuthorized =
  /*#__PURE__*/ createUseSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateSignerValidatorTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"validate"`
 */
export const useSimulateSignerValidatorValidate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'validate',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link signerValidatorAbi}__
 */
export const useWatchSignerValidatorEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: signerValidatorAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link signerValidatorAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchSignerValidatorInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: signerValidatorAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link signerValidatorAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchSignerValidatorOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: signerValidatorAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link signerValidatorAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchSignerValidatorOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: signerValidatorAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link signerValidatorAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchSignerValidatorOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: signerValidatorAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleAllowListAbi}__
 */
export const useReadSimpleAllowList = /*#__PURE__*/ createUseReadContract({
  abi: simpleAllowListAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"LIST_MANAGER_ROLE"`
 */
export const useReadSimpleAllowListListManagerRole =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleAllowListAbi,
    functionName: 'LIST_MANAGER_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"hasAllRoles"`
 */
export const useReadSimpleAllowListHasAllRoles =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleAllowListAbi,
    functionName: 'hasAllRoles',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"hasAnyRole"`
 */
export const useReadSimpleAllowListHasAnyRole =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleAllowListAbi,
    functionName: 'hasAnyRole',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"isAllowed"`
 */
export const useReadSimpleAllowListIsAllowed =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleAllowListAbi,
    functionName: 'isAllowed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"owner"`
 */
export const useReadSimpleAllowListOwner = /*#__PURE__*/ createUseReadContract({
  abi: simpleAllowListAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadSimpleAllowListOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleAllowListAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"rolesOf"`
 */
export const useReadSimpleAllowListRolesOf =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleAllowListAbi,
    functionName: 'rolesOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadSimpleAllowListSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleAllowListAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleAllowListAbi}__
 */
export const useWriteSimpleAllowList = /*#__PURE__*/ createUseWriteContract({
  abi: simpleAllowListAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteSimpleAllowListCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteSimpleAllowListCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"grantRoles"`
 */
export const useWriteSimpleAllowListGrantRoles =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteSimpleAllowListInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteSimpleAllowListRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const useWriteSimpleAllowListRenounceRoles =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteSimpleAllowListRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const useWriteSimpleAllowListRevokeRoles =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"setAllowed"`
 */
export const useWriteSimpleAllowListSetAllowed =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'setAllowed',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteSimpleAllowListTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__
 */
export const useSimulateSimpleAllowList =
  /*#__PURE__*/ createUseSimulateContract({ abi: simpleAllowListAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateSimpleAllowListCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateSimpleAllowListCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"grantRoles"`
 */
export const useSimulateSimpleAllowListGrantRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateSimpleAllowListInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateSimpleAllowListRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const useSimulateSimpleAllowListRenounceRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateSimpleAllowListRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const useSimulateSimpleAllowListRevokeRoles =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"setAllowed"`
 */
export const useSimulateSimpleAllowListSetAllowed =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'setAllowed',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateSimpleAllowListTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleAllowListAbi}__
 */
export const useWatchSimpleAllowListEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: simpleAllowListAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleAllowListAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchSimpleAllowListInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleAllowListAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleAllowListAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchSimpleAllowListOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleAllowListAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleAllowListAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchSimpleAllowListOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleAllowListAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleAllowListAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchSimpleAllowListOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleAllowListAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleAllowListAbi}__ and `eventName` set to `"RolesUpdated"`
 */
export const useWatchSimpleAllowListRolesUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleAllowListAbi,
    eventName: 'RolesUpdated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleBudgetAbi}__
 */
export const useReadSimpleBudget = /*#__PURE__*/ createUseReadContract({
  abi: simpleBudgetAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"available"`
 */
export const useReadSimpleBudgetAvailable = /*#__PURE__*/ createUseReadContract(
  { abi: simpleBudgetAbi, functionName: 'available' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"distributed"`
 */
export const useReadSimpleBudgetDistributed =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleBudgetAbi,
    functionName: 'distributed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"isAuthorized"`
 */
export const useReadSimpleBudgetIsAuthorized =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleBudgetAbi,
    functionName: 'isAuthorized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useReadSimpleBudgetOnErc1155BatchReceived =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleBudgetAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useReadSimpleBudgetOnErc1155Received =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleBudgetAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"owner"`
 */
export const useReadSimpleBudgetOwner = /*#__PURE__*/ createUseReadContract({
  abi: simpleBudgetAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadSimpleBudgetOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleBudgetAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadSimpleBudgetSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleBudgetAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"total"`
 */
export const useReadSimpleBudgetTotal = /*#__PURE__*/ createUseReadContract({
  abi: simpleBudgetAbi,
  functionName: 'total',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleBudgetAbi}__
 */
export const useWriteSimpleBudget = /*#__PURE__*/ createUseWriteContract({
  abi: simpleBudgetAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"allocate"`
 */
export const useWriteSimpleBudgetAllocate =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'allocate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteSimpleBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteSimpleBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"disburse"`
 */
export const useWriteSimpleBudgetDisburse =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'disburse',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const useWriteSimpleBudgetDisburseBatch =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'disburseBatch',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteSimpleBudgetInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const useWriteSimpleBudgetReclaim = /*#__PURE__*/ createUseWriteContract(
  { abi: simpleBudgetAbi, functionName: 'reclaim' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const useWriteSimpleBudgetReconcile =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'reconcile',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteSimpleBudgetRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteSimpleBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const useWriteSimpleBudgetSetAuthorized =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteSimpleBudgetTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__
 */
export const useSimulateSimpleBudget = /*#__PURE__*/ createUseSimulateContract({
  abi: simpleBudgetAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"allocate"`
 */
export const useSimulateSimpleBudgetAllocate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'allocate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateSimpleBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateSimpleBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"disburse"`
 */
export const useSimulateSimpleBudgetDisburse =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'disburse',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const useSimulateSimpleBudgetDisburseBatch =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'disburseBatch',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateSimpleBudgetInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const useSimulateSimpleBudgetReclaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const useSimulateSimpleBudgetReconcile =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'reconcile',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateSimpleBudgetRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateSimpleBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const useSimulateSimpleBudgetSetAuthorized =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateSimpleBudgetTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleBudgetAbi}__
 */
export const useWatchSimpleBudgetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: simpleBudgetAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleBudgetAbi}__ and `eventName` set to `"Authorized"`
 */
export const useWatchSimpleBudgetAuthorizedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleBudgetAbi,
    eventName: 'Authorized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleBudgetAbi}__ and `eventName` set to `"Distributed"`
 */
export const useWatchSimpleBudgetDistributedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleBudgetAbi,
    eventName: 'Distributed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleBudgetAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchSimpleBudgetInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleBudgetAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleBudgetAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchSimpleBudgetOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleBudgetAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleBudgetAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchSimpleBudgetOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleBudgetAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleBudgetAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchSimpleBudgetOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleBudgetAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleDenyListAbi}__
 */
export const useReadSimpleDenyList = /*#__PURE__*/ createUseReadContract({
  abi: simpleDenyListAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"isAllowed"`
 */
export const useReadSimpleDenyListIsAllowed =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleDenyListAbi,
    functionName: 'isAllowed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"owner"`
 */
export const useReadSimpleDenyListOwner = /*#__PURE__*/ createUseReadContract({
  abi: simpleDenyListAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadSimpleDenyListOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleDenyListAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadSimpleDenyListSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: simpleDenyListAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleDenyListAbi}__
 */
export const useWriteSimpleDenyList = /*#__PURE__*/ createUseWriteContract({
  abi: simpleDenyListAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteSimpleDenyListCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleDenyListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteSimpleDenyListCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleDenyListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteSimpleDenyListInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleDenyListAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteSimpleDenyListRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleDenyListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteSimpleDenyListRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleDenyListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"setDenied"`
 */
export const useWriteSimpleDenyListSetDenied =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleDenyListAbi,
    functionName: 'setDenied',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteSimpleDenyListTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: simpleDenyListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__
 */
export const useSimulateSimpleDenyList =
  /*#__PURE__*/ createUseSimulateContract({ abi: simpleDenyListAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateSimpleDenyListCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleDenyListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateSimpleDenyListCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleDenyListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateSimpleDenyListInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleDenyListAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateSimpleDenyListRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleDenyListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateSimpleDenyListRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleDenyListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"setDenied"`
 */
export const useSimulateSimpleDenyListSetDenied =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleDenyListAbi,
    functionName: 'setDenied',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateSimpleDenyListTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: simpleDenyListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleDenyListAbi}__
 */
export const useWatchSimpleDenyListEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: simpleDenyListAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleDenyListAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchSimpleDenyListInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleDenyListAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleDenyListAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchSimpleDenyListOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleDenyListAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleDenyListAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchSimpleDenyListOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleDenyListAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link simpleDenyListAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchSimpleDenyListOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: simpleDenyListAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uupsUpgradeableAbi}__
 */
export const useReadUupsUpgradeable = /*#__PURE__*/ createUseReadContract({
  abi: uupsUpgradeableAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uupsUpgradeableAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadUupsUpgradeableProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: uupsUpgradeableAbi,
    functionName: 'proxiableUUID',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uupsUpgradeableAbi}__
 */
export const useWriteUupsUpgradeable = /*#__PURE__*/ createUseWriteContract({
  abi: uupsUpgradeableAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uupsUpgradeableAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteUupsUpgradeableUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: uupsUpgradeableAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uupsUpgradeableAbi}__
 */
export const useSimulateUupsUpgradeable =
  /*#__PURE__*/ createUseSimulateContract({ abi: uupsUpgradeableAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uupsUpgradeableAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateUupsUpgradeableUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: uupsUpgradeableAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uupsUpgradeableAbi}__
 */
export const useWatchUupsUpgradeableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: uupsUpgradeableAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uupsUpgradeableAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchUupsUpgradeableUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: uupsUpgradeableAbi,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link validatorAbi}__
 */
export const useReadValidator = /*#__PURE__*/ createUseReadContract({
  abi: validatorAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"owner"`
 */
export const useReadValidatorOwner = /*#__PURE__*/ createUseReadContract({
  abi: validatorAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadValidatorOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: validatorAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadValidatorSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: validatorAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link validatorAbi}__
 */
export const useWriteValidator = /*#__PURE__*/ createUseWriteContract({
  abi: validatorAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteValidatorCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: validatorAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteValidatorCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: validatorAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteValidatorInitialize = /*#__PURE__*/ createUseWriteContract(
  { abi: validatorAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteValidatorRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: validatorAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteValidatorRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: validatorAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteValidatorTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: validatorAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"validate"`
 */
export const useWriteValidatorValidate = /*#__PURE__*/ createUseWriteContract({
  abi: validatorAbi,
  functionName: 'validate',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link validatorAbi}__
 */
export const useSimulateValidator = /*#__PURE__*/ createUseSimulateContract({
  abi: validatorAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateValidatorCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: validatorAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateValidatorCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: validatorAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateValidatorInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: validatorAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateValidatorRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: validatorAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateValidatorRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: validatorAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateValidatorTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: validatorAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"validate"`
 */
export const useSimulateValidatorValidate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: validatorAbi,
    functionName: 'validate',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link validatorAbi}__
 */
export const useWatchValidatorEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: validatorAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link validatorAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchValidatorInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: validatorAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link validatorAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchValidatorOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: validatorAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link validatorAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchValidatorOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: validatorAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link validatorAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchValidatorOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: validatorAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingBudgetAbi}__
 */
export const useReadVestingBudget = /*#__PURE__*/ createUseReadContract({
  abi: vestingBudgetAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"available"`
 */
export const useReadVestingBudgetAvailable =
  /*#__PURE__*/ createUseReadContract({
    abi: vestingBudgetAbi,
    functionName: 'available',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"cliff"`
 */
export const useReadVestingBudgetCliff = /*#__PURE__*/ createUseReadContract({
  abi: vestingBudgetAbi,
  functionName: 'cliff',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"distributed"`
 */
export const useReadVestingBudgetDistributed =
  /*#__PURE__*/ createUseReadContract({
    abi: vestingBudgetAbi,
    functionName: 'distributed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"duration"`
 */
export const useReadVestingBudgetDuration = /*#__PURE__*/ createUseReadContract(
  { abi: vestingBudgetAbi, functionName: 'duration' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"end"`
 */
export const useReadVestingBudgetEnd = /*#__PURE__*/ createUseReadContract({
  abi: vestingBudgetAbi,
  functionName: 'end',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"isAuthorized"`
 */
export const useReadVestingBudgetIsAuthorized =
  /*#__PURE__*/ createUseReadContract({
    abi: vestingBudgetAbi,
    functionName: 'isAuthorized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"owner"`
 */
export const useReadVestingBudgetOwner = /*#__PURE__*/ createUseReadContract({
  abi: vestingBudgetAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const useReadVestingBudgetOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createUseReadContract({
    abi: vestingBudgetAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"start"`
 */
export const useReadVestingBudgetStart = /*#__PURE__*/ createUseReadContract({
  abi: vestingBudgetAbi,
  functionName: 'start',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadVestingBudgetSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: vestingBudgetAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"total"`
 */
export const useReadVestingBudgetTotal = /*#__PURE__*/ createUseReadContract({
  abi: vestingBudgetAbi,
  functionName: 'total',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingBudgetAbi}__
 */
export const useWriteVestingBudget = /*#__PURE__*/ createUseWriteContract({
  abi: vestingBudgetAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"allocate"`
 */
export const useWriteVestingBudgetAllocate =
  /*#__PURE__*/ createUseWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'allocate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useWriteVestingBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useWriteVestingBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"disburse"`
 */
export const useWriteVestingBudgetDisburse =
  /*#__PURE__*/ createUseWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'disburse',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const useWriteVestingBudgetDisburseBatch =
  /*#__PURE__*/ createUseWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'disburseBatch',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteVestingBudgetInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const useWriteVestingBudgetReclaim =
  /*#__PURE__*/ createUseWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const useWriteVestingBudgetReconcile =
  /*#__PURE__*/ createUseWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'reconcile',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteVestingBudgetRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useWriteVestingBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createUseWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const useWriteVestingBudgetSetAuthorized =
  /*#__PURE__*/ createUseWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteVestingBudgetTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__
 */
export const useSimulateVestingBudget = /*#__PURE__*/ createUseSimulateContract(
  { abi: vestingBudgetAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"allocate"`
 */
export const useSimulateVestingBudgetAllocate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'allocate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const useSimulateVestingBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const useSimulateVestingBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"disburse"`
 */
export const useSimulateVestingBudgetDisburse =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'disburse',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const useSimulateVestingBudgetDisburseBatch =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'disburseBatch',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateVestingBudgetInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const useSimulateVestingBudgetReclaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const useSimulateVestingBudgetReconcile =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'reconcile',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateVestingBudgetRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const useSimulateVestingBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const useSimulateVestingBudgetSetAuthorized =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateVestingBudgetTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vestingBudgetAbi}__
 */
export const useWatchVestingBudgetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: vestingBudgetAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vestingBudgetAbi}__ and `eventName` set to `"Authorized"`
 */
export const useWatchVestingBudgetAuthorizedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vestingBudgetAbi,
    eventName: 'Authorized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vestingBudgetAbi}__ and `eventName` set to `"Distributed"`
 */
export const useWatchVestingBudgetDistributedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vestingBudgetAbi,
    eventName: 'Distributed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vestingBudgetAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchVestingBudgetInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vestingBudgetAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vestingBudgetAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const useWatchVestingBudgetOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vestingBudgetAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vestingBudgetAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const useWatchVestingBudgetOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vestingBudgetAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vestingBudgetAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchVestingBudgetOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vestingBudgetAbi,
    eventName: 'OwnershipTransferred',
  })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link actionAbi}__
 */
export const readAction = /*#__PURE__*/ createReadContract({ abi: actionAbi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"VALIDATOR"`
 */
export const readActionValidator = /*#__PURE__*/ createReadContract({
  abi: actionAbi,
  functionName: 'VALIDATOR',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readActionSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: actionAbi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link actionAbi}__
 */
export const writeAction = /*#__PURE__*/ createWriteContract({ abi: actionAbi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"execute"`
 */
export const writeActionExecute = /*#__PURE__*/ createWriteContract({
  abi: actionAbi,
  functionName: 'execute',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"initialize"`
 */
export const writeActionInitialize = /*#__PURE__*/ createWriteContract({
  abi: actionAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"prepare"`
 */
export const writeActionPrepare = /*#__PURE__*/ createWriteContract({
  abi: actionAbi,
  functionName: 'prepare',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link actionAbi}__
 */
export const simulateAction = /*#__PURE__*/ createSimulateContract({
  abi: actionAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"execute"`
 */
export const simulateActionExecute = /*#__PURE__*/ createSimulateContract({
  abi: actionAbi,
  functionName: 'execute',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateActionInitialize = /*#__PURE__*/ createSimulateContract({
  abi: actionAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"prepare"`
 */
export const simulateActionPrepare = /*#__PURE__*/ createSimulateContract({
  abi: actionAbi,
  functionName: 'prepare',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link actionAbi}__
 */
export const watchActionEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: actionAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link actionAbi}__ and `eventName` set to `"ActionExecuted"`
 */
export const watchActionActionExecutedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: actionAbi,
    eventName: 'ActionExecuted',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link actionAbi}__ and `eventName` set to `"ActionValidated"`
 */
export const watchActionActionValidatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: actionAbi,
    eventName: 'ActionValidated',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link actionAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchActionInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: actionAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListAbi}__
 */
export const readAllowList = /*#__PURE__*/ createReadContract({
  abi: allowListAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"isAllowed"`
 */
export const readAllowListIsAllowed = /*#__PURE__*/ createReadContract({
  abi: allowListAbi,
  functionName: 'isAllowed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"owner"`
 */
export const readAllowListOwner = /*#__PURE__*/ createReadContract({
  abi: allowListAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readAllowListOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: allowListAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readAllowListSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: allowListAbi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListAbi}__
 */
export const writeAllowList = /*#__PURE__*/ createWriteContract({
  abi: allowListAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeAllowListCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: allowListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeAllowListCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: allowListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"initialize"`
 */
export const writeAllowListInitialize = /*#__PURE__*/ createWriteContract({
  abi: allowListAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeAllowListRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: allowListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeAllowListRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: allowListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeAllowListTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: allowListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListAbi}__
 */
export const simulateAllowList = /*#__PURE__*/ createSimulateContract({
  abi: allowListAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateAllowListCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: allowListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateAllowListCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: allowListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateAllowListInitialize = /*#__PURE__*/ createSimulateContract(
  { abi: allowListAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateAllowListRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: allowListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateAllowListRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: allowListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateAllowListTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: allowListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link allowListAbi}__
 */
export const watchAllowListEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: allowListAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link allowListAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchAllowListInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: allowListAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link allowListAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchAllowListOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: allowListAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link allowListAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchAllowListOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: allowListAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link allowListAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchAllowListOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: allowListAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListIncentiveAbi}__
 */
export const readAllowListIncentive = /*#__PURE__*/ createReadContract({
  abi: allowListIncentiveAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"allowList"`
 */
export const readAllowListIncentiveAllowList = /*#__PURE__*/ createReadContract(
  { abi: allowListIncentiveAbi, functionName: 'allowList' },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const readAllowListIncentiveClaimed = /*#__PURE__*/ createReadContract({
  abi: allowListIncentiveAbi,
  functionName: 'claimed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const readAllowListIncentiveClaims = /*#__PURE__*/ createReadContract({
  abi: allowListIncentiveAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const readAllowListIncentiveIsClaimable =
  /*#__PURE__*/ createReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'isClaimable',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"limit"`
 */
export const readAllowListIncentiveLimit = /*#__PURE__*/ createReadContract({
  abi: allowListIncentiveAbi,
  functionName: 'limit',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const readAllowListIncentiveOwner = /*#__PURE__*/ createReadContract({
  abi: allowListIncentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readAllowListIncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const readAllowListIncentivePreflight = /*#__PURE__*/ createReadContract(
  { abi: allowListIncentiveAbi, functionName: 'preflight' },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const readAllowListIncentiveReclaim = /*#__PURE__*/ createReadContract({
  abi: allowListIncentiveAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readAllowListIncentiveSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListIncentiveAbi}__
 */
export const writeAllowListIncentive = /*#__PURE__*/ createWriteContract({
  abi: allowListIncentiveAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeAllowListIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: allowListIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const writeAllowListIncentiveClaim = /*#__PURE__*/ createWriteContract({
  abi: allowListIncentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeAllowListIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: allowListIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const writeAllowListIncentiveInitialize =
  /*#__PURE__*/ createWriteContract({
    abi: allowListIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeAllowListIncentiveRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: allowListIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeAllowListIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: allowListIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeAllowListIncentiveTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: allowListIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__
 */
export const simulateAllowListIncentive = /*#__PURE__*/ createSimulateContract({
  abi: allowListIncentiveAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateAllowListIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: allowListIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const simulateAllowListIncentiveClaim =
  /*#__PURE__*/ createSimulateContract({
    abi: allowListIncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateAllowListIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: allowListIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateAllowListIncentiveInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: allowListIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateAllowListIncentiveRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: allowListIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateAllowListIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: allowListIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateAllowListIncentiveTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: allowListIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link allowListIncentiveAbi}__
 */
export const watchAllowListIncentiveEvent =
  /*#__PURE__*/ createWatchContractEvent({ abi: allowListIncentiveAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const watchAllowListIncentiveClaimedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: allowListIncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchAllowListIncentiveInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: allowListIncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchAllowListIncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: allowListIncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchAllowListIncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: allowListIncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchAllowListIncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: allowListIncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link basePaymasterAbi}__
 */
export const readBasePaymaster = /*#__PURE__*/ createReadContract({
  abi: basePaymasterAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"entryPoint"`
 */
export const readBasePaymasterEntryPoint = /*#__PURE__*/ createReadContract({
  abi: basePaymasterAbi,
  functionName: 'entryPoint',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"getDeposit"`
 */
export const readBasePaymasterGetDeposit = /*#__PURE__*/ createReadContract({
  abi: basePaymasterAbi,
  functionName: 'getDeposit',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"owner"`
 */
export const readBasePaymasterOwner = /*#__PURE__*/ createReadContract({
  abi: basePaymasterAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link basePaymasterAbi}__
 */
export const writeBasePaymaster = /*#__PURE__*/ createWriteContract({
  abi: basePaymasterAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"addStake"`
 */
export const writeBasePaymasterAddStake = /*#__PURE__*/ createWriteContract({
  abi: basePaymasterAbi,
  functionName: 'addStake',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"deposit"`
 */
export const writeBasePaymasterDeposit = /*#__PURE__*/ createWriteContract({
  abi: basePaymasterAbi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"postOp"`
 */
export const writeBasePaymasterPostOp = /*#__PURE__*/ createWriteContract({
  abi: basePaymasterAbi,
  functionName: 'postOp',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeBasePaymasterRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: basePaymasterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeBasePaymasterTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: basePaymasterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"unlockStake"`
 */
export const writeBasePaymasterUnlockStake = /*#__PURE__*/ createWriteContract({
  abi: basePaymasterAbi,
  functionName: 'unlockStake',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"validatePaymasterUserOp"`
 */
export const writeBasePaymasterValidatePaymasterUserOp =
  /*#__PURE__*/ createWriteContract({
    abi: basePaymasterAbi,
    functionName: 'validatePaymasterUserOp',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const writeBasePaymasterWithdrawStake =
  /*#__PURE__*/ createWriteContract({
    abi: basePaymasterAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const writeBasePaymasterWithdrawTo = /*#__PURE__*/ createWriteContract({
  abi: basePaymasterAbi,
  functionName: 'withdrawTo',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link basePaymasterAbi}__
 */
export const simulateBasePaymaster = /*#__PURE__*/ createSimulateContract({
  abi: basePaymasterAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"addStake"`
 */
export const simulateBasePaymasterAddStake =
  /*#__PURE__*/ createSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'addStake',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"deposit"`
 */
export const simulateBasePaymasterDeposit =
  /*#__PURE__*/ createSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"postOp"`
 */
export const simulateBasePaymasterPostOp = /*#__PURE__*/ createSimulateContract(
  { abi: basePaymasterAbi, functionName: 'postOp' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateBasePaymasterRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateBasePaymasterTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"unlockStake"`
 */
export const simulateBasePaymasterUnlockStake =
  /*#__PURE__*/ createSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'unlockStake',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"validatePaymasterUserOp"`
 */
export const simulateBasePaymasterValidatePaymasterUserOp =
  /*#__PURE__*/ createSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'validatePaymasterUserOp',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const simulateBasePaymasterWithdrawStake =
  /*#__PURE__*/ createSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link basePaymasterAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const simulateBasePaymasterWithdrawTo =
  /*#__PURE__*/ createSimulateContract({
    abi: basePaymasterAbi,
    functionName: 'withdrawTo',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link basePaymasterAbi}__
 */
export const watchBasePaymasterEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: basePaymasterAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link basePaymasterAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchBasePaymasterOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: basePaymasterAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostAccountAbi}__
 */
export const readBoostAccount = /*#__PURE__*/ createReadContract({
  abi: boostAccountAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"OWNER_ROLE"`
 */
export const readBoostAccountOwnerRole = /*#__PURE__*/ createReadContract({
  abi: boostAccountAbi,
  functionName: 'OWNER_ROLE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const readBoostAccountEip712Domain = /*#__PURE__*/ createReadContract({
  abi: boostAccountAbi,
  functionName: 'eip712Domain',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"entryPoint"`
 */
export const readBoostAccountEntryPoint = /*#__PURE__*/ createReadContract({
  abi: boostAccountAbi,
  functionName: 'entryPoint',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"getDeposit"`
 */
export const readBoostAccountGetDeposit = /*#__PURE__*/ createReadContract({
  abi: boostAccountAbi,
  functionName: 'getDeposit',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"hasAllRoles"`
 */
export const readBoostAccountHasAllRoles = /*#__PURE__*/ createReadContract({
  abi: boostAccountAbi,
  functionName: 'hasAllRoles',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"hasAnyRole"`
 */
export const readBoostAccountHasAnyRole = /*#__PURE__*/ createReadContract({
  abi: boostAccountAbi,
  functionName: 'hasAnyRole',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"isValidSignature"`
 */
export const readBoostAccountIsValidSignature =
  /*#__PURE__*/ createReadContract({
    abi: boostAccountAbi,
    functionName: 'isValidSignature',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"owner"`
 */
export const readBoostAccountOwner = /*#__PURE__*/ createReadContract({
  abi: boostAccountAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readBoostAccountOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: boostAccountAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const readBoostAccountProxiableUuid = /*#__PURE__*/ createReadContract({
  abi: boostAccountAbi,
  functionName: 'proxiableUUID',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"rolesOf"`
 */
export const readBoostAccountRolesOf = /*#__PURE__*/ createReadContract({
  abi: boostAccountAbi,
  functionName: 'rolesOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"storageLoad"`
 */
export const readBoostAccountStorageLoad = /*#__PURE__*/ createReadContract({
  abi: boostAccountAbi,
  functionName: 'storageLoad',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__
 */
export const writeBoostAccount = /*#__PURE__*/ createWriteContract({
  abi: boostAccountAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"addDeposit"`
 */
export const writeBoostAccountAddDeposit = /*#__PURE__*/ createWriteContract({
  abi: boostAccountAbi,
  functionName: 'addDeposit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeBoostAccountCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: boostAccountAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeBoostAccountCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: boostAccountAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"delegateExecute"`
 */
export const writeBoostAccountDelegateExecute =
  /*#__PURE__*/ createWriteContract({
    abi: boostAccountAbi,
    functionName: 'delegateExecute',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"execute"`
 */
export const writeBoostAccountExecute = /*#__PURE__*/ createWriteContract({
  abi: boostAccountAbi,
  functionName: 'execute',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"executeBatch"`
 */
export const writeBoostAccountExecuteBatch = /*#__PURE__*/ createWriteContract({
  abi: boostAccountAbi,
  functionName: 'executeBatch',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"grantRoles"`
 */
export const writeBoostAccountGrantRoles = /*#__PURE__*/ createWriteContract({
  abi: boostAccountAbi,
  functionName: 'grantRoles',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"initialize"`
 */
export const writeBoostAccountInitialize = /*#__PURE__*/ createWriteContract({
  abi: boostAccountAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeBoostAccountRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: boostAccountAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const writeBoostAccountRenounceRoles = /*#__PURE__*/ createWriteContract(
  { abi: boostAccountAbi, functionName: 'renounceRoles' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeBoostAccountRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: boostAccountAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const writeBoostAccountRevokeRoles = /*#__PURE__*/ createWriteContract({
  abi: boostAccountAbi,
  functionName: 'revokeRoles',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"storageStore"`
 */
export const writeBoostAccountStorageStore = /*#__PURE__*/ createWriteContract({
  abi: boostAccountAbi,
  functionName: 'storageStore',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeBoostAccountTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: boostAccountAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const writeBoostAccountUpgradeToAndCall =
  /*#__PURE__*/ createWriteContract({
    abi: boostAccountAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"validateUserOp"`
 */
export const writeBoostAccountValidateUserOp =
  /*#__PURE__*/ createWriteContract({
    abi: boostAccountAbi,
    functionName: 'validateUserOp',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"withdrawDepositTo"`
 */
export const writeBoostAccountWithdrawDepositTo =
  /*#__PURE__*/ createWriteContract({
    abi: boostAccountAbi,
    functionName: 'withdrawDepositTo',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__
 */
export const simulateBoostAccount = /*#__PURE__*/ createSimulateContract({
  abi: boostAccountAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"addDeposit"`
 */
export const simulateBoostAccountAddDeposit =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'addDeposit',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateBoostAccountCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateBoostAccountCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"delegateExecute"`
 */
export const simulateBoostAccountDelegateExecute =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'delegateExecute',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"execute"`
 */
export const simulateBoostAccountExecute = /*#__PURE__*/ createSimulateContract(
  { abi: boostAccountAbi, functionName: 'execute' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"executeBatch"`
 */
export const simulateBoostAccountExecuteBatch =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'executeBatch',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"grantRoles"`
 */
export const simulateBoostAccountGrantRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateBoostAccountInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateBoostAccountRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const simulateBoostAccountRenounceRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateBoostAccountRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const simulateBoostAccountRevokeRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"storageStore"`
 */
export const simulateBoostAccountStorageStore =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'storageStore',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateBoostAccountTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const simulateBoostAccountUpgradeToAndCall =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"validateUserOp"`
 */
export const simulateBoostAccountValidateUserOp =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'validateUserOp',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostAccountAbi}__ and `functionName` set to `"withdrawDepositTo"`
 */
export const simulateBoostAccountWithdrawDepositTo =
  /*#__PURE__*/ createSimulateContract({
    abi: boostAccountAbi,
    functionName: 'withdrawDepositTo',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostAccountAbi}__
 */
export const watchBoostAccountEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: boostAccountAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostAccountAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchBoostAccountInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostAccountAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostAccountAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchBoostAccountOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostAccountAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostAccountAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchBoostAccountOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostAccountAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostAccountAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchBoostAccountOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostAccountAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostAccountAbi}__ and `eventName` set to `"RolesUpdated"`
 */
export const watchBoostAccountRolesUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostAccountAbi,
    eventName: 'RolesUpdated',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostAccountAbi}__ and `eventName` set to `"Upgraded"`
 */
export const watchBoostAccountUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostAccountAbi,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostCoreAbi}__
 */
export const readBoostCore = /*#__PURE__*/ createReadContract({
  abi: boostCoreAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"claimFee"`
 */
export const readBoostCoreClaimFee = /*#__PURE__*/ createReadContract({
  abi: boostCoreAbi,
  functionName: 'claimFee',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"getBoost"`
 */
export const readBoostCoreGetBoost = /*#__PURE__*/ createReadContract({
  abi: boostCoreAbi,
  functionName: 'getBoost',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"getBoostCount"`
 */
export const readBoostCoreGetBoostCount = /*#__PURE__*/ createReadContract({
  abi: boostCoreAbi,
  functionName: 'getBoostCount',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"owner"`
 */
export const readBoostCoreOwner = /*#__PURE__*/ createReadContract({
  abi: boostCoreAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readBoostCoreOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: boostCoreAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"protocolFee"`
 */
export const readBoostCoreProtocolFee = /*#__PURE__*/ createReadContract({
  abi: boostCoreAbi,
  functionName: 'protocolFee',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"protocolFeeReceiver"`
 */
export const readBoostCoreProtocolFeeReceiver =
  /*#__PURE__*/ createReadContract({
    abi: boostCoreAbi,
    functionName: 'protocolFeeReceiver',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"referralFee"`
 */
export const readBoostCoreReferralFee = /*#__PURE__*/ createReadContract({
  abi: boostCoreAbi,
  functionName: 'referralFee',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"registry"`
 */
export const readBoostCoreRegistry = /*#__PURE__*/ createReadContract({
  abi: boostCoreAbi,
  functionName: 'registry',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostCoreAbi}__
 */
export const writeBoostCore = /*#__PURE__*/ createWriteContract({
  abi: boostCoreAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeBoostCoreCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: boostCoreAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"claimIncentive"`
 */
export const writeBoostCoreClaimIncentive = /*#__PURE__*/ createWriteContract({
  abi: boostCoreAbi,
  functionName: 'claimIncentive',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeBoostCoreCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: boostCoreAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"createBoost"`
 */
export const writeBoostCoreCreateBoost = /*#__PURE__*/ createWriteContract({
  abi: boostCoreAbi,
  functionName: 'createBoost',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeBoostCoreRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: boostCoreAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeBoostCoreRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: boostCoreAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"setClaimFee"`
 */
export const writeBoostCoreSetClaimFee = /*#__PURE__*/ createWriteContract({
  abi: boostCoreAbi,
  functionName: 'setClaimFee',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"setProtocolFeeReceiver"`
 */
export const writeBoostCoreSetProtocolFeeReceiver =
  /*#__PURE__*/ createWriteContract({
    abi: boostCoreAbi,
    functionName: 'setProtocolFeeReceiver',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeBoostCoreTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: boostCoreAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostCoreAbi}__
 */
export const simulateBoostCore = /*#__PURE__*/ createSimulateContract({
  abi: boostCoreAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateBoostCoreCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: boostCoreAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"claimIncentive"`
 */
export const simulateBoostCoreClaimIncentive =
  /*#__PURE__*/ createSimulateContract({
    abi: boostCoreAbi,
    functionName: 'claimIncentive',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateBoostCoreCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: boostCoreAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"createBoost"`
 */
export const simulateBoostCoreCreateBoost =
  /*#__PURE__*/ createSimulateContract({
    abi: boostCoreAbi,
    functionName: 'createBoost',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateBoostCoreRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: boostCoreAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateBoostCoreRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: boostCoreAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"setClaimFee"`
 */
export const simulateBoostCoreSetClaimFee =
  /*#__PURE__*/ createSimulateContract({
    abi: boostCoreAbi,
    functionName: 'setClaimFee',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"setProtocolFeeReceiver"`
 */
export const simulateBoostCoreSetProtocolFeeReceiver =
  /*#__PURE__*/ createSimulateContract({
    abi: boostCoreAbi,
    functionName: 'setProtocolFeeReceiver',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateBoostCoreTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: boostCoreAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostCoreAbi}__
 */
export const watchBoostCoreEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: boostCoreAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostCoreAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchBoostCoreOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostCoreAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostCoreAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchBoostCoreOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostCoreAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostCoreAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchBoostCoreOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostCoreAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostPaymasterAbi}__
 */
export const readBoostPaymaster = /*#__PURE__*/ createReadContract({
  abi: boostPaymasterAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"entryPoint"`
 */
export const readBoostPaymasterEntryPoint = /*#__PURE__*/ createReadContract({
  abi: boostPaymasterAbi,
  functionName: 'entryPoint',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"getDeposit"`
 */
export const readBoostPaymasterGetDeposit = /*#__PURE__*/ createReadContract({
  abi: boostPaymasterAbi,
  functionName: 'getDeposit',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"getHash"`
 */
export const readBoostPaymasterGetHash = /*#__PURE__*/ createReadContract({
  abi: boostPaymasterAbi,
  functionName: 'getHash',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"hasAllRoles"`
 */
export const readBoostPaymasterHasAllRoles = /*#__PURE__*/ createReadContract({
  abi: boostPaymasterAbi,
  functionName: 'hasAllRoles',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"hasAnyRole"`
 */
export const readBoostPaymasterHasAnyRole = /*#__PURE__*/ createReadContract({
  abi: boostPaymasterAbi,
  functionName: 'hasAnyRole',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"isSigner"`
 */
export const readBoostPaymasterIsSigner = /*#__PURE__*/ createReadContract({
  abi: boostPaymasterAbi,
  functionName: 'isSigner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"owner"`
 */
export const readBoostPaymasterOwner = /*#__PURE__*/ createReadContract({
  abi: boostPaymasterAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readBoostPaymasterOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: boostPaymasterAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"parsePaymasterAndData"`
 */
export const readBoostPaymasterParsePaymasterAndData =
  /*#__PURE__*/ createReadContract({
    abi: boostPaymasterAbi,
    functionName: 'parsePaymasterAndData',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"rolesOf"`
 */
export const readBoostPaymasterRolesOf = /*#__PURE__*/ createReadContract({
  abi: boostPaymasterAbi,
  functionName: 'rolesOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"senderNonce"`
 */
export const readBoostPaymasterSenderNonce = /*#__PURE__*/ createReadContract({
  abi: boostPaymasterAbi,
  functionName: 'senderNonce',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__
 */
export const writeBoostPaymaster = /*#__PURE__*/ createWriteContract({
  abi: boostPaymasterAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"addStake"`
 */
export const writeBoostPaymasterAddStake = /*#__PURE__*/ createWriteContract({
  abi: boostPaymasterAbi,
  functionName: 'addStake',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeBoostPaymasterCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeBoostPaymasterCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"deposit"`
 */
export const writeBoostPaymasterDeposit = /*#__PURE__*/ createWriteContract({
  abi: boostPaymasterAbi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"grantRoles"`
 */
export const writeBoostPaymasterGrantRoles = /*#__PURE__*/ createWriteContract({
  abi: boostPaymasterAbi,
  functionName: 'grantRoles',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"postOp"`
 */
export const writeBoostPaymasterPostOp = /*#__PURE__*/ createWriteContract({
  abi: boostPaymasterAbi,
  functionName: 'postOp',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeBoostPaymasterRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const writeBoostPaymasterRenounceRoles =
  /*#__PURE__*/ createWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeBoostPaymasterRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const writeBoostPaymasterRevokeRoles = /*#__PURE__*/ createWriteContract(
  { abi: boostPaymasterAbi, functionName: 'revokeRoles' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeBoostPaymasterTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"unlockStake"`
 */
export const writeBoostPaymasterUnlockStake = /*#__PURE__*/ createWriteContract(
  { abi: boostPaymasterAbi, functionName: 'unlockStake' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"validatePaymasterUserOp"`
 */
export const writeBoostPaymasterValidatePaymasterUserOp =
  /*#__PURE__*/ createWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'validatePaymasterUserOp',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const writeBoostPaymasterWithdrawStake =
  /*#__PURE__*/ createWriteContract({
    abi: boostPaymasterAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const writeBoostPaymasterWithdrawTo = /*#__PURE__*/ createWriteContract({
  abi: boostPaymasterAbi,
  functionName: 'withdrawTo',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__
 */
export const simulateBoostPaymaster = /*#__PURE__*/ createSimulateContract({
  abi: boostPaymasterAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"addStake"`
 */
export const simulateBoostPaymasterAddStake =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'addStake',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateBoostPaymasterCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateBoostPaymasterCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"deposit"`
 */
export const simulateBoostPaymasterDeposit =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"grantRoles"`
 */
export const simulateBoostPaymasterGrantRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"postOp"`
 */
export const simulateBoostPaymasterPostOp =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'postOp',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateBoostPaymasterRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const simulateBoostPaymasterRenounceRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateBoostPaymasterRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const simulateBoostPaymasterRevokeRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateBoostPaymasterTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"unlockStake"`
 */
export const simulateBoostPaymasterUnlockStake =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'unlockStake',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"validatePaymasterUserOp"`
 */
export const simulateBoostPaymasterValidatePaymasterUserOp =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'validatePaymasterUserOp',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const simulateBoostPaymasterWithdrawStake =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostPaymasterAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const simulateBoostPaymasterWithdrawTo =
  /*#__PURE__*/ createSimulateContract({
    abi: boostPaymasterAbi,
    functionName: 'withdrawTo',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostPaymasterAbi}__
 */
export const watchBoostPaymasterEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: boostPaymasterAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostPaymasterAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchBoostPaymasterOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostPaymasterAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostPaymasterAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchBoostPaymasterOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostPaymasterAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostPaymasterAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchBoostPaymasterOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostPaymasterAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostPaymasterAbi}__ and `eventName` set to `"RolesUpdated"`
 */
export const watchBoostPaymasterRolesUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostPaymasterAbi,
    eventName: 'RolesUpdated',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostProxyAbi}__
 */
export const writeBoostProxy = /*#__PURE__*/ createWriteContract({
  abi: boostProxyAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostProxyAbi}__ and `functionName` set to `"createProxy"`
 */
export const writeBoostProxyCreateProxy = /*#__PURE__*/ createWriteContract({
  abi: boostProxyAbi,
  functionName: 'createProxy',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostProxyAbi}__
 */
export const simulateBoostProxy = /*#__PURE__*/ createSimulateContract({
  abi: boostProxyAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostProxyAbi}__ and `functionName` set to `"createProxy"`
 */
export const simulateBoostProxyCreateProxy =
  /*#__PURE__*/ createSimulateContract({
    abi: boostProxyAbi,
    functionName: 'createProxy',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostRegistryAbi}__
 */
export const readBoostRegistry = /*#__PURE__*/ createReadContract({
  abi: boostRegistryAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"getBaseImplementation"`
 */
export const readBoostRegistryGetBaseImplementation =
  /*#__PURE__*/ createReadContract({
    abi: boostRegistryAbi,
    functionName: 'getBaseImplementation',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"getClone"`
 */
export const readBoostRegistryGetClone = /*#__PURE__*/ createReadContract({
  abi: boostRegistryAbi,
  functionName: 'getClone',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"getCloneIdentifier"`
 */
export const readBoostRegistryGetCloneIdentifier =
  /*#__PURE__*/ createReadContract({
    abi: boostRegistryAbi,
    functionName: 'getCloneIdentifier',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"getClones"`
 */
export const readBoostRegistryGetClones = /*#__PURE__*/ createReadContract({
  abi: boostRegistryAbi,
  functionName: 'getClones',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"getIdentifier"`
 */
export const readBoostRegistryGetIdentifier = /*#__PURE__*/ createReadContract({
  abi: boostRegistryAbi,
  functionName: 'getIdentifier',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readBoostRegistrySupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: boostRegistryAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostRegistryAbi}__
 */
export const writeBoostRegistry = /*#__PURE__*/ createWriteContract({
  abi: boostRegistryAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"deployClone"`
 */
export const writeBoostRegistryDeployClone = /*#__PURE__*/ createWriteContract({
  abi: boostRegistryAbi,
  functionName: 'deployClone',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"register"`
 */
export const writeBoostRegistryRegister = /*#__PURE__*/ createWriteContract({
  abi: boostRegistryAbi,
  functionName: 'register',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostRegistryAbi}__
 */
export const simulateBoostRegistry = /*#__PURE__*/ createSimulateContract({
  abi: boostRegistryAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"deployClone"`
 */
export const simulateBoostRegistryDeployClone =
  /*#__PURE__*/ createSimulateContract({
    abi: boostRegistryAbi,
    functionName: 'deployClone',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link boostRegistryAbi}__ and `functionName` set to `"register"`
 */
export const simulateBoostRegistryRegister =
  /*#__PURE__*/ createSimulateContract({
    abi: boostRegistryAbi,
    functionName: 'register',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostRegistryAbi}__
 */
export const watchBoostRegistryEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: boostRegistryAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostRegistryAbi}__ and `eventName` set to `"Deployed"`
 */
export const watchBoostRegistryDeployedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostRegistryAbi,
    eventName: 'Deployed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostRegistryAbi}__ and `eventName` set to `"Registered"`
 */
export const watchBoostRegistryRegisteredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostRegistryAbi,
    eventName: 'Registered',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link budgetAbi}__
 */
export const readBudget = /*#__PURE__*/ createReadContract({ abi: budgetAbi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"available"`
 */
export const readBudgetAvailable = /*#__PURE__*/ createReadContract({
  abi: budgetAbi,
  functionName: 'available',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"distributed"`
 */
export const readBudgetDistributed = /*#__PURE__*/ createReadContract({
  abi: budgetAbi,
  functionName: 'distributed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"isAuthorized"`
 */
export const readBudgetIsAuthorized = /*#__PURE__*/ createReadContract({
  abi: budgetAbi,
  functionName: 'isAuthorized',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"owner"`
 */
export const readBudgetOwner = /*#__PURE__*/ createReadContract({
  abi: budgetAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readBudgetOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: budgetAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readBudgetSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: budgetAbi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"total"`
 */
export const readBudgetTotal = /*#__PURE__*/ createReadContract({
  abi: budgetAbi,
  functionName: 'total',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link budgetAbi}__
 */
export const writeBudget = /*#__PURE__*/ createWriteContract({ abi: budgetAbi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"allocate"`
 */
export const writeBudgetAllocate = /*#__PURE__*/ createWriteContract({
  abi: budgetAbi,
  functionName: 'allocate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: budgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: budgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"disburse"`
 */
export const writeBudgetDisburse = /*#__PURE__*/ createWriteContract({
  abi: budgetAbi,
  functionName: 'disburse',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const writeBudgetDisburseBatch = /*#__PURE__*/ createWriteContract({
  abi: budgetAbi,
  functionName: 'disburseBatch',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"initialize"`
 */
export const writeBudgetInitialize = /*#__PURE__*/ createWriteContract({
  abi: budgetAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const writeBudgetReclaim = /*#__PURE__*/ createWriteContract({
  abi: budgetAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const writeBudgetReconcile = /*#__PURE__*/ createWriteContract({
  abi: budgetAbi,
  functionName: 'reconcile',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeBudgetRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: budgetAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: budgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const writeBudgetSetAuthorized = /*#__PURE__*/ createWriteContract({
  abi: budgetAbi,
  functionName: 'setAuthorized',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeBudgetTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: budgetAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link budgetAbi}__
 */
export const simulateBudget = /*#__PURE__*/ createSimulateContract({
  abi: budgetAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"allocate"`
 */
export const simulateBudgetAllocate = /*#__PURE__*/ createSimulateContract({
  abi: budgetAbi,
  functionName: 'allocate',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: budgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: budgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"disburse"`
 */
export const simulateBudgetDisburse = /*#__PURE__*/ createSimulateContract({
  abi: budgetAbi,
  functionName: 'disburse',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const simulateBudgetDisburseBatch = /*#__PURE__*/ createSimulateContract(
  { abi: budgetAbi, functionName: 'disburseBatch' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateBudgetInitialize = /*#__PURE__*/ createSimulateContract({
  abi: budgetAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const simulateBudgetReclaim = /*#__PURE__*/ createSimulateContract({
  abi: budgetAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const simulateBudgetReconcile = /*#__PURE__*/ createSimulateContract({
  abi: budgetAbi,
  functionName: 'reconcile',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateBudgetRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: budgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: budgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const simulateBudgetSetAuthorized = /*#__PURE__*/ createSimulateContract(
  { abi: budgetAbi, functionName: 'setAuthorized' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateBudgetTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: budgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link budgetAbi}__
 */
export const watchBudgetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: budgetAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link budgetAbi}__ and `eventName` set to `"Authorized"`
 */
export const watchBudgetAuthorizedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: budgetAbi,
    eventName: 'Authorized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link budgetAbi}__ and `eventName` set to `"Distributed"`
 */
export const watchBudgetDistributedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: budgetAbi,
    eventName: 'Distributed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link budgetAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchBudgetInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: budgetAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link budgetAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchBudgetOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: budgetAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link budgetAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchBudgetOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: budgetAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link budgetAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchBudgetOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: budgetAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__
 */
export const readCgdaIncentive = /*#__PURE__*/ createReadContract({
  abi: cgdaIncentiveAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"asset"`
 */
export const readCgdaIncentiveAsset = /*#__PURE__*/ createReadContract({
  abi: cgdaIncentiveAbi,
  functionName: 'asset',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"cgdaParams"`
 */
export const readCgdaIncentiveCgdaParams = /*#__PURE__*/ createReadContract({
  abi: cgdaIncentiveAbi,
  functionName: 'cgdaParams',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const readCgdaIncentiveClaimed = /*#__PURE__*/ createReadContract({
  abi: cgdaIncentiveAbi,
  functionName: 'claimed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const readCgdaIncentiveClaims = /*#__PURE__*/ createReadContract({
  abi: cgdaIncentiveAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"currentReward"`
 */
export const readCgdaIncentiveCurrentReward = /*#__PURE__*/ createReadContract({
  abi: cgdaIncentiveAbi,
  functionName: 'currentReward',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const readCgdaIncentiveIsClaimable = /*#__PURE__*/ createReadContract({
  abi: cgdaIncentiveAbi,
  functionName: 'isClaimable',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const readCgdaIncentiveOwner = /*#__PURE__*/ createReadContract({
  abi: cgdaIncentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readCgdaIncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: cgdaIncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const readCgdaIncentivePreflight = /*#__PURE__*/ createReadContract({
  abi: cgdaIncentiveAbi,
  functionName: 'preflight',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readCgdaIncentiveSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: cgdaIncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"totalBudget"`
 */
export const readCgdaIncentiveTotalBudget = /*#__PURE__*/ createReadContract({
  abi: cgdaIncentiveAbi,
  functionName: 'totalBudget',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__
 */
export const writeCgdaIncentive = /*#__PURE__*/ createWriteContract({
  abi: cgdaIncentiveAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeCgdaIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: cgdaIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const writeCgdaIncentiveClaim = /*#__PURE__*/ createWriteContract({
  abi: cgdaIncentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeCgdaIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: cgdaIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const writeCgdaIncentiveInitialize = /*#__PURE__*/ createWriteContract({
  abi: cgdaIncentiveAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const writeCgdaIncentiveReclaim = /*#__PURE__*/ createWriteContract({
  abi: cgdaIncentiveAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeCgdaIncentiveRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: cgdaIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeCgdaIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: cgdaIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeCgdaIncentiveTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: cgdaIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__
 */
export const simulateCgdaIncentive = /*#__PURE__*/ createSimulateContract({
  abi: cgdaIncentiveAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateCgdaIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const simulateCgdaIncentiveClaim = /*#__PURE__*/ createSimulateContract({
  abi: cgdaIncentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateCgdaIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateCgdaIncentiveInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const simulateCgdaIncentiveReclaim =
  /*#__PURE__*/ createSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateCgdaIncentiveRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateCgdaIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateCgdaIncentiveTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: cgdaIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link cgdaIncentiveAbi}__
 */
export const watchCgdaIncentiveEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: cgdaIncentiveAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const watchCgdaIncentiveClaimedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: cgdaIncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchCgdaIncentiveInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: cgdaIncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchCgdaIncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: cgdaIncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchCgdaIncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: cgdaIncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchCgdaIncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: cgdaIncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link cloneableAbi}__
 */
export const readCloneable = /*#__PURE__*/ createReadContract({
  abi: cloneableAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link cloneableAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readCloneableSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: cloneableAbi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link cloneableAbi}__
 */
export const writeCloneable = /*#__PURE__*/ createWriteContract({
  abi: cloneableAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link cloneableAbi}__ and `functionName` set to `"initialize"`
 */
export const writeCloneableInitialize = /*#__PURE__*/ createWriteContract({
  abi: cloneableAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link cloneableAbi}__
 */
export const simulateCloneable = /*#__PURE__*/ createSimulateContract({
  abi: cloneableAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link cloneableAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateCloneableInitialize = /*#__PURE__*/ createSimulateContract(
  { abi: cloneableAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link cloneableAbi}__
 */
export const watchCloneableEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: cloneableAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link cloneableAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchCloneableInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: cloneableAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link contractActionAbi}__
 */
export const readContractAction = /*#__PURE__*/ createReadContract({
  abi: contractActionAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"VALIDATOR"`
 */
export const readContractActionValidator = /*#__PURE__*/ createReadContract({
  abi: contractActionAbi,
  functionName: 'VALIDATOR',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"chainId"`
 */
export const readContractActionChainId = /*#__PURE__*/ createReadContract({
  abi: contractActionAbi,
  functionName: 'chainId',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"prepare"`
 */
export const readContractActionPrepare = /*#__PURE__*/ createReadContract({
  abi: contractActionAbi,
  functionName: 'prepare',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"selector"`
 */
export const readContractActionSelector = /*#__PURE__*/ createReadContract({
  abi: contractActionAbi,
  functionName: 'selector',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readContractActionSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: contractActionAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"target"`
 */
export const readContractActionTarget = /*#__PURE__*/ createReadContract({
  abi: contractActionAbi,
  functionName: 'target',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"value"`
 */
export const readContractActionValue = /*#__PURE__*/ createReadContract({
  abi: contractActionAbi,
  functionName: 'value',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link contractActionAbi}__
 */
export const writeContractAction = /*#__PURE__*/ createWriteContract({
  abi: contractActionAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"execute"`
 */
export const writeContractActionExecute = /*#__PURE__*/ createWriteContract({
  abi: contractActionAbi,
  functionName: 'execute',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"initialize"`
 */
export const writeContractActionInitialize = /*#__PURE__*/ createWriteContract({
  abi: contractActionAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link contractActionAbi}__
 */
export const simulateContractAction = /*#__PURE__*/ createSimulateContract({
  abi: contractActionAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"execute"`
 */
export const simulateContractActionExecute =
  /*#__PURE__*/ createSimulateContract({
    abi: contractActionAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateContractActionInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: contractActionAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link contractActionAbi}__
 */
export const watchContractActionEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: contractActionAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link contractActionAbi}__ and `eventName` set to `"ActionExecuted"`
 */
export const watchContractActionActionExecutedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: contractActionAbi,
    eventName: 'ActionExecuted',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link contractActionAbi}__ and `eventName` set to `"ActionValidated"`
 */
export const watchContractActionActionValidatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: contractActionAbi,
    eventName: 'ActionValidated',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link contractActionAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchContractActionInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: contractActionAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link eip712Abi}__
 */
export const readEip712 = /*#__PURE__*/ createReadContract({ abi: eip712Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link eip712Abi}__ and `functionName` set to `"eip712Domain"`
 */
export const readEip712Eip712Domain = /*#__PURE__*/ createReadContract({
  abi: eip712Abi,
  functionName: 'eip712Domain',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155Abi}__
 */
export const readErc1155 = /*#__PURE__*/ createReadContract({ abi: erc1155Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readErc1155BalanceOf = /*#__PURE__*/ createReadContract({
  abi: erc1155Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const readErc1155BalanceOfBatch = /*#__PURE__*/ createReadContract({
  abi: erc1155Abi,
  functionName: 'balanceOfBatch',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readErc1155IsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: erc1155Abi,
  functionName: 'isApprovedForAll',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const readErc1155SupportsInterface = /*#__PURE__*/ createReadContract({
  abi: erc1155Abi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"uri"`
 */
export const readErc1155Uri = /*#__PURE__*/ createReadContract({
  abi: erc1155Abi,
  functionName: 'uri',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc1155Abi}__
 */
export const writeErc1155 = /*#__PURE__*/ createWriteContract({
  abi: erc1155Abi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const writeErc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createWriteContract({
    abi: erc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeErc1155SafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: erc1155Abi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeErc1155SetApprovalForAll = /*#__PURE__*/ createWriteContract({
  abi: erc1155Abi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc1155Abi}__
 */
export const simulateErc1155 = /*#__PURE__*/ createSimulateContract({
  abi: erc1155Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const simulateErc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: erc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateErc1155SafeTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: erc1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateErc1155SetApprovalForAll =
  /*#__PURE__*/ createSimulateContract({
    abi: erc1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc1155Abi}__
 */
export const watchErc1155Event = /*#__PURE__*/ createWatchContractEvent({
  abi: erc1155Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc1155Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchErc1155ApprovalForAllEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc1155Abi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc1155Abi}__ and `eventName` set to `"TransferBatch"`
 */
export const watchErc1155TransferBatchEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc1155Abi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc1155Abi}__ and `eventName` set to `"TransferSingle"`
 */
export const watchErc1155TransferSingleEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc1155Abi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc1155Abi}__ and `eventName` set to `"URI"`
 */
export const watchErc1155UriEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc1155Abi,
  eventName: 'URI',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__
 */
export const readErc1155Incentive = /*#__PURE__*/ createReadContract({
  abi: erc1155IncentiveAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"asset"`
 */
export const readErc1155IncentiveAsset = /*#__PURE__*/ createReadContract({
  abi: erc1155IncentiveAbi,
  functionName: 'asset',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const readErc1155IncentiveClaimed = /*#__PURE__*/ createReadContract({
  abi: erc1155IncentiveAbi,
  functionName: 'claimed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const readErc1155IncentiveClaims = /*#__PURE__*/ createReadContract({
  abi: erc1155IncentiveAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"extraData"`
 */
export const readErc1155IncentiveExtraData = /*#__PURE__*/ createReadContract({
  abi: erc1155IncentiveAbi,
  functionName: 'extraData',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const readErc1155IncentiveIsClaimable = /*#__PURE__*/ createReadContract(
  { abi: erc1155IncentiveAbi, functionName: 'isClaimable' },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"limit"`
 */
export const readErc1155IncentiveLimit = /*#__PURE__*/ createReadContract({
  abi: erc1155IncentiveAbi,
  functionName: 'limit',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const readErc1155IncentiveOnErc1155BatchReceived =
  /*#__PURE__*/ createReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const readErc1155IncentiveOnErc1155Received =
  /*#__PURE__*/ createReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const readErc1155IncentiveOwner = /*#__PURE__*/ createReadContract({
  abi: erc1155IncentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readErc1155IncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const readErc1155IncentivePreflight = /*#__PURE__*/ createReadContract({
  abi: erc1155IncentiveAbi,
  functionName: 'preflight',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"strategy"`
 */
export const readErc1155IncentiveStrategy = /*#__PURE__*/ createReadContract({
  abi: erc1155IncentiveAbi,
  functionName: 'strategy',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readErc1155IncentiveSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"tokenId"`
 */
export const readErc1155IncentiveTokenId = /*#__PURE__*/ createReadContract({
  abi: erc1155IncentiveAbi,
  functionName: 'tokenId',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__
 */
export const writeErc1155Incentive = /*#__PURE__*/ createWriteContract({
  abi: erc1155IncentiveAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeErc1155IncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: erc1155IncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const writeErc1155IncentiveClaim = /*#__PURE__*/ createWriteContract({
  abi: erc1155IncentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeErc1155IncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: erc1155IncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const writeErc1155IncentiveInitialize =
  /*#__PURE__*/ createWriteContract({
    abi: erc1155IncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const writeErc1155IncentiveReclaim = /*#__PURE__*/ createWriteContract({
  abi: erc1155IncentiveAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeErc1155IncentiveRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: erc1155IncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeErc1155IncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: erc1155IncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeErc1155IncentiveTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: erc1155IncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__
 */
export const simulateErc1155Incentive = /*#__PURE__*/ createSimulateContract({
  abi: erc1155IncentiveAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateErc1155IncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const simulateErc1155IncentiveClaim =
  /*#__PURE__*/ createSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateErc1155IncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateErc1155IncentiveInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const simulateErc1155IncentiveReclaim =
  /*#__PURE__*/ createSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateErc1155IncentiveRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateErc1155IncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateErc1155IncentiveTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: erc1155IncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc1155IncentiveAbi}__
 */
export const watchErc1155IncentiveEvent =
  /*#__PURE__*/ createWatchContractEvent({ abi: erc1155IncentiveAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const watchErc1155IncentiveClaimedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc1155IncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchErc1155IncentiveInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc1155IncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchErc1155IncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc1155IncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchErc1155IncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc1155IncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchErc1155IncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc1155IncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1271Abi}__
 */
export const readErc1271 = /*#__PURE__*/ createReadContract({ abi: erc1271Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1271Abi}__ and `functionName` set to `"eip712Domain"`
 */
export const readErc1271Eip712Domain = /*#__PURE__*/ createReadContract({
  abi: erc1271Abi,
  functionName: 'eip712Domain',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1271Abi}__ and `functionName` set to `"isValidSignature"`
 */
export const readErc1271IsValidSignature = /*#__PURE__*/ createReadContract({
  abi: erc1271Abi,
  functionName: 'isValidSignature',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc165Abi}__
 */
export const readErc165 = /*#__PURE__*/ createReadContract({ abi: erc165Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc165Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const readErc165SupportsInterface = /*#__PURE__*/ createReadContract({
  abi: erc165Abi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const readErc20 = /*#__PURE__*/ createReadContract({ abi: erc20Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const readErc20DomainSeparator = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'DOMAIN_SEPARATOR',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const readErc20Allowance = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readErc20BalanceOf = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const readErc20Decimals = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const readErc20Name = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"nonces"`
 */
export const readErc20Nonces = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'nonces',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const readErc20Symbol = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const readErc20TotalSupply = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const writeErc20 = /*#__PURE__*/ createWriteContract({ abi: erc20Abi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const writeErc20Approve = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"permit"`
 */
export const writeErc20Permit = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'permit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const writeErc20Transfer = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeErc20TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const simulateErc20 = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const simulateErc20Approve = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"permit"`
 */
export const simulateErc20Permit = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'permit',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const simulateErc20Transfer = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateErc20TransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const watchErc20Event = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const watchErc20ApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchErc20TransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__
 */
export const readErc20Incentive = /*#__PURE__*/ createReadContract({
  abi: erc20IncentiveAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"asset"`
 */
export const readErc20IncentiveAsset = /*#__PURE__*/ createReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'asset',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const readErc20IncentiveClaimed = /*#__PURE__*/ createReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'claimed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const readErc20IncentiveClaims = /*#__PURE__*/ createReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"entries"`
 */
export const readErc20IncentiveEntries = /*#__PURE__*/ createReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'entries',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const readErc20IncentiveIsClaimable = /*#__PURE__*/ createReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'isClaimable',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"limit"`
 */
export const readErc20IncentiveLimit = /*#__PURE__*/ createReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'limit',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const readErc20IncentiveOwner = /*#__PURE__*/ createReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readErc20IncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: erc20IncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const readErc20IncentivePreflight = /*#__PURE__*/ createReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'preflight',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"reward"`
 */
export const readErc20IncentiveReward = /*#__PURE__*/ createReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'reward',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"strategy"`
 */
export const readErc20IncentiveStrategy = /*#__PURE__*/ createReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'strategy',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readErc20IncentiveSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: erc20IncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20IncentiveAbi}__
 */
export const writeErc20Incentive = /*#__PURE__*/ createWriteContract({
  abi: erc20IncentiveAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeErc20IncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: erc20IncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const writeErc20IncentiveClaim = /*#__PURE__*/ createWriteContract({
  abi: erc20IncentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeErc20IncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: erc20IncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"drawRaffle"`
 */
export const writeErc20IncentiveDrawRaffle = /*#__PURE__*/ createWriteContract({
  abi: erc20IncentiveAbi,
  functionName: 'drawRaffle',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const writeErc20IncentiveInitialize = /*#__PURE__*/ createWriteContract({
  abi: erc20IncentiveAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const writeErc20IncentiveReclaim = /*#__PURE__*/ createWriteContract({
  abi: erc20IncentiveAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeErc20IncentiveRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: erc20IncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeErc20IncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: erc20IncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeErc20IncentiveTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: erc20IncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__
 */
export const simulateErc20Incentive = /*#__PURE__*/ createSimulateContract({
  abi: erc20IncentiveAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateErc20IncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const simulateErc20IncentiveClaim = /*#__PURE__*/ createSimulateContract(
  { abi: erc20IncentiveAbi, functionName: 'claim' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateErc20IncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"drawRaffle"`
 */
export const simulateErc20IncentiveDrawRaffle =
  /*#__PURE__*/ createSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'drawRaffle',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateErc20IncentiveInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const simulateErc20IncentiveReclaim =
  /*#__PURE__*/ createSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateErc20IncentiveRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateErc20IncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateErc20IncentiveTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: erc20IncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20IncentiveAbi}__
 */
export const watchErc20IncentiveEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20IncentiveAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const watchErc20IncentiveClaimedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc20IncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `eventName` set to `"Entry"`
 */
export const watchErc20IncentiveEntryEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc20IncentiveAbi,
    eventName: 'Entry',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchErc20IncentiveInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc20IncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchErc20IncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc20IncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchErc20IncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc20IncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchErc20IncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc20IncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc4337Abi}__
 */
export const readErc4337 = /*#__PURE__*/ createReadContract({ abi: erc4337Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"eip712Domain"`
 */
export const readErc4337Eip712Domain = /*#__PURE__*/ createReadContract({
  abi: erc4337Abi,
  functionName: 'eip712Domain',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"entryPoint"`
 */
export const readErc4337EntryPoint = /*#__PURE__*/ createReadContract({
  abi: erc4337Abi,
  functionName: 'entryPoint',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"getDeposit"`
 */
export const readErc4337GetDeposit = /*#__PURE__*/ createReadContract({
  abi: erc4337Abi,
  functionName: 'getDeposit',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"isValidSignature"`
 */
export const readErc4337IsValidSignature = /*#__PURE__*/ createReadContract({
  abi: erc4337Abi,
  functionName: 'isValidSignature',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"owner"`
 */
export const readErc4337Owner = /*#__PURE__*/ createReadContract({
  abi: erc4337Abi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readErc4337OwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: erc4337Abi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"proxiableUUID"`
 */
export const readErc4337ProxiableUuid = /*#__PURE__*/ createReadContract({
  abi: erc4337Abi,
  functionName: 'proxiableUUID',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"storageLoad"`
 */
export const readErc4337StorageLoad = /*#__PURE__*/ createReadContract({
  abi: erc4337Abi,
  functionName: 'storageLoad',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__
 */
export const writeErc4337 = /*#__PURE__*/ createWriteContract({
  abi: erc4337Abi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"addDeposit"`
 */
export const writeErc4337AddDeposit = /*#__PURE__*/ createWriteContract({
  abi: erc4337Abi,
  functionName: 'addDeposit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeErc4337CancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: erc4337Abi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeErc4337CompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: erc4337Abi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"delegateExecute"`
 */
export const writeErc4337DelegateExecute = /*#__PURE__*/ createWriteContract({
  abi: erc4337Abi,
  functionName: 'delegateExecute',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"execute"`
 */
export const writeErc4337Execute = /*#__PURE__*/ createWriteContract({
  abi: erc4337Abi,
  functionName: 'execute',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"executeBatch"`
 */
export const writeErc4337ExecuteBatch = /*#__PURE__*/ createWriteContract({
  abi: erc4337Abi,
  functionName: 'executeBatch',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"initialize"`
 */
export const writeErc4337Initialize = /*#__PURE__*/ createWriteContract({
  abi: erc4337Abi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeErc4337RenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: erc4337Abi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeErc4337RequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: erc4337Abi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"storageStore"`
 */
export const writeErc4337StorageStore = /*#__PURE__*/ createWriteContract({
  abi: erc4337Abi,
  functionName: 'storageStore',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeErc4337TransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: erc4337Abi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const writeErc4337UpgradeToAndCall = /*#__PURE__*/ createWriteContract({
  abi: erc4337Abi,
  functionName: 'upgradeToAndCall',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"validateUserOp"`
 */
export const writeErc4337ValidateUserOp = /*#__PURE__*/ createWriteContract({
  abi: erc4337Abi,
  functionName: 'validateUserOp',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"withdrawDepositTo"`
 */
export const writeErc4337WithdrawDepositTo = /*#__PURE__*/ createWriteContract({
  abi: erc4337Abi,
  functionName: 'withdrawDepositTo',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__
 */
export const simulateErc4337 = /*#__PURE__*/ createSimulateContract({
  abi: erc4337Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"addDeposit"`
 */
export const simulateErc4337AddDeposit = /*#__PURE__*/ createSimulateContract({
  abi: erc4337Abi,
  functionName: 'addDeposit',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateErc4337CancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: erc4337Abi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateErc4337CompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: erc4337Abi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"delegateExecute"`
 */
export const simulateErc4337DelegateExecute =
  /*#__PURE__*/ createSimulateContract({
    abi: erc4337Abi,
    functionName: 'delegateExecute',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"execute"`
 */
export const simulateErc4337Execute = /*#__PURE__*/ createSimulateContract({
  abi: erc4337Abi,
  functionName: 'execute',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"executeBatch"`
 */
export const simulateErc4337ExecuteBatch = /*#__PURE__*/ createSimulateContract(
  { abi: erc4337Abi, functionName: 'executeBatch' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"initialize"`
 */
export const simulateErc4337Initialize = /*#__PURE__*/ createSimulateContract({
  abi: erc4337Abi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateErc4337RenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: erc4337Abi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateErc4337RequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: erc4337Abi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"storageStore"`
 */
export const simulateErc4337StorageStore = /*#__PURE__*/ createSimulateContract(
  { abi: erc4337Abi, functionName: 'storageStore' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateErc4337TransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: erc4337Abi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const simulateErc4337UpgradeToAndCall =
  /*#__PURE__*/ createSimulateContract({
    abi: erc4337Abi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"validateUserOp"`
 */
export const simulateErc4337ValidateUserOp =
  /*#__PURE__*/ createSimulateContract({
    abi: erc4337Abi,
    functionName: 'validateUserOp',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc4337Abi}__ and `functionName` set to `"withdrawDepositTo"`
 */
export const simulateErc4337WithdrawDepositTo =
  /*#__PURE__*/ createSimulateContract({
    abi: erc4337Abi,
    functionName: 'withdrawDepositTo',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc4337Abi}__
 */
export const watchErc4337Event = /*#__PURE__*/ createWatchContractEvent({
  abi: erc4337Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc4337Abi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchErc4337OwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc4337Abi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc4337Abi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchErc4337OwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc4337Abi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc4337Abi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchErc4337OwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc4337Abi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc4337Abi}__ and `eventName` set to `"Upgraded"`
 */
export const watchErc4337UpgradedEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: erc4337Abi, eventName: 'Upgraded' },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const readErc721 = /*#__PURE__*/ createReadContract({ abi: erc721Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readErc721BalanceOf = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"getApproved"`
 */
export const readErc721GetApproved = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readErc721IsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'isApprovedForAll',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"name"`
 */
export const readErc721Name = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"ownerOf"`
 */
export const readErc721OwnerOf = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const readErc721SupportsInterface = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"symbol"`
 */
export const readErc721Symbol = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"tokenURI"`
 */
export const readErc721TokenUri = /*#__PURE__*/ createReadContract({
  abi: erc721Abi,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const writeErc721 = /*#__PURE__*/ createWriteContract({ abi: erc721Abi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"approve"`
 */
export const writeErc721Approve = /*#__PURE__*/ createWriteContract({
  abi: erc721Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeErc721SafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: erc721Abi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeErc721SetApprovalForAll = /*#__PURE__*/ createWriteContract({
  abi: erc721Abi,
  functionName: 'setApprovalForAll',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeErc721TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: erc721Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__
 */
export const simulateErc721 = /*#__PURE__*/ createSimulateContract({
  abi: erc721Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"approve"`
 */
export const simulateErc721Approve = /*#__PURE__*/ createSimulateContract({
  abi: erc721Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateErc721SafeTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: erc721Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateErc721SetApprovalForAll =
  /*#__PURE__*/ createSimulateContract({
    abi: erc721Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateErc721TransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: erc721Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721Abi}__
 */
export const watchErc721Event = /*#__PURE__*/ createWatchContractEvent({
  abi: erc721Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"Approval"`
 */
export const watchErc721ApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc721Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchErc721ApprovalForAllEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc721Abi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchErc721TransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc721Abi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721MintActionAbi}__
 */
export const readErc721MintAction = /*#__PURE__*/ createReadContract({
  abi: erc721MintActionAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"VALIDATOR"`
 */
export const readErc721MintActionValidator = /*#__PURE__*/ createReadContract({
  abi: erc721MintActionAbi,
  functionName: 'VALIDATOR',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"chainId"`
 */
export const readErc721MintActionChainId = /*#__PURE__*/ createReadContract({
  abi: erc721MintActionAbi,
  functionName: 'chainId',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"owner"`
 */
export const readErc721MintActionOwner = /*#__PURE__*/ createReadContract({
  abi: erc721MintActionAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readErc721MintActionOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: erc721MintActionAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"prepare"`
 */
export const readErc721MintActionPrepare = /*#__PURE__*/ createReadContract({
  abi: erc721MintActionAbi,
  functionName: 'prepare',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"selector"`
 */
export const readErc721MintActionSelector = /*#__PURE__*/ createReadContract({
  abi: erc721MintActionAbi,
  functionName: 'selector',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readErc721MintActionSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: erc721MintActionAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"target"`
 */
export const readErc721MintActionTarget = /*#__PURE__*/ createReadContract({
  abi: erc721MintActionAbi,
  functionName: 'target',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"validated"`
 */
export const readErc721MintActionValidated = /*#__PURE__*/ createReadContract({
  abi: erc721MintActionAbi,
  functionName: 'validated',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"value"`
 */
export const readErc721MintActionValue = /*#__PURE__*/ createReadContract({
  abi: erc721MintActionAbi,
  functionName: 'value',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721MintActionAbi}__
 */
export const writeErc721MintAction = /*#__PURE__*/ createWriteContract({
  abi: erc721MintActionAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeErc721MintActionCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: erc721MintActionAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeErc721MintActionCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: erc721MintActionAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"execute"`
 */
export const writeErc721MintActionExecute = /*#__PURE__*/ createWriteContract({
  abi: erc721MintActionAbi,
  functionName: 'execute',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"initialize"`
 */
export const writeErc721MintActionInitialize =
  /*#__PURE__*/ createWriteContract({
    abi: erc721MintActionAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeErc721MintActionRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: erc721MintActionAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeErc721MintActionRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: erc721MintActionAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeErc721MintActionTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: erc721MintActionAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"validate"`
 */
export const writeErc721MintActionValidate = /*#__PURE__*/ createWriteContract({
  abi: erc721MintActionAbi,
  functionName: 'validate',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__
 */
export const simulateErc721MintAction = /*#__PURE__*/ createSimulateContract({
  abi: erc721MintActionAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateErc721MintActionCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateErc721MintActionCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"execute"`
 */
export const simulateErc721MintActionExecute =
  /*#__PURE__*/ createSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateErc721MintActionInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateErc721MintActionRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateErc721MintActionRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateErc721MintActionTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"validate"`
 */
export const simulateErc721MintActionValidate =
  /*#__PURE__*/ createSimulateContract({
    abi: erc721MintActionAbi,
    functionName: 'validate',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721MintActionAbi}__
 */
export const watchErc721MintActionEvent =
  /*#__PURE__*/ createWatchContractEvent({ abi: erc721MintActionAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721MintActionAbi}__ and `eventName` set to `"ActionExecuted"`
 */
export const watchErc721MintActionActionExecutedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc721MintActionAbi,
    eventName: 'ActionExecuted',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721MintActionAbi}__ and `eventName` set to `"ActionValidated"`
 */
export const watchErc721MintActionActionValidatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc721MintActionAbi,
    eventName: 'ActionValidated',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721MintActionAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchErc721MintActionInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc721MintActionAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721MintActionAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchErc721MintActionOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc721MintActionAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721MintActionAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchErc721MintActionOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc721MintActionAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc721MintActionAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchErc721MintActionOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: erc721MintActionAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iAggregatorAbi}__
 */
export const readIAggregator = /*#__PURE__*/ createReadContract({
  abi: iAggregatorAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iAggregatorAbi}__ and `functionName` set to `"aggregateSignatures"`
 */
export const readIAggregatorAggregateSignatures =
  /*#__PURE__*/ createReadContract({
    abi: iAggregatorAbi,
    functionName: 'aggregateSignatures',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iAggregatorAbi}__ and `functionName` set to `"validateSignatures"`
 */
export const readIAggregatorValidateSignatures =
  /*#__PURE__*/ createReadContract({
    abi: iAggregatorAbi,
    functionName: 'validateSignatures',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iAggregatorAbi}__ and `functionName` set to `"validateUserOpSignature"`
 */
export const readIAggregatorValidateUserOpSignature =
  /*#__PURE__*/ createReadContract({
    abi: iAggregatorAbi,
    functionName: 'validateUserOpSignature',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const readIerc1155 = /*#__PURE__*/ createReadContract({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readIerc1155BalanceOf = /*#__PURE__*/ createReadContract({
  abi: ierc1155Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const readIerc1155BalanceOfBatch = /*#__PURE__*/ createReadContract({
  abi: ierc1155Abi,
  functionName: 'balanceOfBatch',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readIerc1155IsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: ierc1155Abi,
  functionName: 'isApprovedForAll',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const readIerc1155SupportsInterface = /*#__PURE__*/ createReadContract({
  abi: ierc1155Abi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const writeIerc1155 = /*#__PURE__*/ createWriteContract({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const writeIerc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createWriteContract({
    abi: ierc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeIerc1155SafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: ierc1155Abi,
  functionName: 'safeTransferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeIerc1155SetApprovalForAll = /*#__PURE__*/ createWriteContract(
  { abi: ierc1155Abi, functionName: 'setApprovalForAll' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const simulateIerc1155 = /*#__PURE__*/ createSimulateContract({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const simulateIerc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: ierc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateIerc1155SafeTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: ierc1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateIerc1155SetApprovalForAll =
  /*#__PURE__*/ createSimulateContract({
    abi: ierc1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const watchIerc1155Event = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchIerc1155ApprovalForAllEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"TransferBatch"`
 */
export const watchIerc1155TransferBatchEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"TransferSingle"`
 */
export const watchIerc1155TransferSingleEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"URI"`
 */
export const watchIerc1155UriEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ierc1155Abi,
  eventName: 'URI',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__
 */
export const readIerc1155Receiver = /*#__PURE__*/ createReadContract({
  abi: ierc1155ReceiverAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readIerc1155ReceiverSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__
 */
export const writeIerc1155Receiver = /*#__PURE__*/ createWriteContract({
  abi: ierc1155ReceiverAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const writeIerc1155ReceiverOnErc1155BatchReceived =
  /*#__PURE__*/ createWriteContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const writeIerc1155ReceiverOnErc1155Received =
  /*#__PURE__*/ createWriteContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__
 */
export const simulateIerc1155Receiver = /*#__PURE__*/ createSimulateContract({
  abi: ierc1155ReceiverAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const simulateIerc1155ReceiverOnErc1155BatchReceived =
  /*#__PURE__*/ createSimulateContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const simulateIerc1155ReceiverOnErc1155Received =
  /*#__PURE__*/ createSimulateContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1271Abi}__
 */
export const readIerc1271 = /*#__PURE__*/ createReadContract({
  abi: ierc1271Abi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1271Abi}__ and `functionName` set to `"isValidSignature"`
 */
export const readIerc1271IsValidSignature = /*#__PURE__*/ createReadContract({
  abi: ierc1271Abi,
  functionName: 'isValidSignature',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc165Abi}__
 */
export const readIerc165 = /*#__PURE__*/ createReadContract({ abi: ierc165Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc165Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const readIerc165SupportsInterface = /*#__PURE__*/ createReadContract({
  abi: ierc165Abi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iEntryPointAbi}__
 */
export const readIEntryPoint = /*#__PURE__*/ createReadContract({
  abi: iEntryPointAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readIEntryPointBalanceOf = /*#__PURE__*/ createReadContract({
  abi: iEntryPointAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"getDepositInfo"`
 */
export const readIEntryPointGetDepositInfo = /*#__PURE__*/ createReadContract({
  abi: iEntryPointAbi,
  functionName: 'getDepositInfo',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"getNonce"`
 */
export const readIEntryPointGetNonce = /*#__PURE__*/ createReadContract({
  abi: iEntryPointAbi,
  functionName: 'getNonce',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"getUserOpHash"`
 */
export const readIEntryPointGetUserOpHash = /*#__PURE__*/ createReadContract({
  abi: iEntryPointAbi,
  functionName: 'getUserOpHash',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iEntryPointAbi}__
 */
export const writeIEntryPoint = /*#__PURE__*/ createWriteContract({
  abi: iEntryPointAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"addStake"`
 */
export const writeIEntryPointAddStake = /*#__PURE__*/ createWriteContract({
  abi: iEntryPointAbi,
  functionName: 'addStake',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"depositTo"`
 */
export const writeIEntryPointDepositTo = /*#__PURE__*/ createWriteContract({
  abi: iEntryPointAbi,
  functionName: 'depositTo',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"getSenderAddress"`
 */
export const writeIEntryPointGetSenderAddress =
  /*#__PURE__*/ createWriteContract({
    abi: iEntryPointAbi,
    functionName: 'getSenderAddress',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"handleAggregatedOps"`
 */
export const writeIEntryPointHandleAggregatedOps =
  /*#__PURE__*/ createWriteContract({
    abi: iEntryPointAbi,
    functionName: 'handleAggregatedOps',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"handleOps"`
 */
export const writeIEntryPointHandleOps = /*#__PURE__*/ createWriteContract({
  abi: iEntryPointAbi,
  functionName: 'handleOps',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"incrementNonce"`
 */
export const writeIEntryPointIncrementNonce = /*#__PURE__*/ createWriteContract(
  { abi: iEntryPointAbi, functionName: 'incrementNonce' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"simulateHandleOp"`
 */
export const writeIEntryPointSimulateHandleOp =
  /*#__PURE__*/ createWriteContract({
    abi: iEntryPointAbi,
    functionName: 'simulateHandleOp',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"simulateValidation"`
 */
export const writeIEntryPointSimulateValidation =
  /*#__PURE__*/ createWriteContract({
    abi: iEntryPointAbi,
    functionName: 'simulateValidation',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"unlockStake"`
 */
export const writeIEntryPointUnlockStake = /*#__PURE__*/ createWriteContract({
  abi: iEntryPointAbi,
  functionName: 'unlockStake',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const writeIEntryPointWithdrawStake = /*#__PURE__*/ createWriteContract({
  abi: iEntryPointAbi,
  functionName: 'withdrawStake',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const writeIEntryPointWithdrawTo = /*#__PURE__*/ createWriteContract({
  abi: iEntryPointAbi,
  functionName: 'withdrawTo',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iEntryPointAbi}__
 */
export const simulateIEntryPoint = /*#__PURE__*/ createSimulateContract({
  abi: iEntryPointAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"addStake"`
 */
export const simulateIEntryPointAddStake = /*#__PURE__*/ createSimulateContract(
  { abi: iEntryPointAbi, functionName: 'addStake' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"depositTo"`
 */
export const simulateIEntryPointDepositTo =
  /*#__PURE__*/ createSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'depositTo',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"getSenderAddress"`
 */
export const simulateIEntryPointGetSenderAddress =
  /*#__PURE__*/ createSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'getSenderAddress',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"handleAggregatedOps"`
 */
export const simulateIEntryPointHandleAggregatedOps =
  /*#__PURE__*/ createSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'handleAggregatedOps',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"handleOps"`
 */
export const simulateIEntryPointHandleOps =
  /*#__PURE__*/ createSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'handleOps',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"incrementNonce"`
 */
export const simulateIEntryPointIncrementNonce =
  /*#__PURE__*/ createSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'incrementNonce',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"simulateHandleOp"`
 */
export const simulateIEntryPointSimulateHandleOp =
  /*#__PURE__*/ createSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'simulateHandleOp',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"simulateValidation"`
 */
export const simulateIEntryPointSimulateValidation =
  /*#__PURE__*/ createSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'simulateValidation',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"unlockStake"`
 */
export const simulateIEntryPointUnlockStake =
  /*#__PURE__*/ createSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'unlockStake',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const simulateIEntryPointWithdrawStake =
  /*#__PURE__*/ createSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iEntryPointAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const simulateIEntryPointWithdrawTo =
  /*#__PURE__*/ createSimulateContract({
    abi: iEntryPointAbi,
    functionName: 'withdrawTo',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__
 */
export const watchIEntryPointEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: iEntryPointAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"AccountDeployed"`
 */
export const watchIEntryPointAccountDeployedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'AccountDeployed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"BeforeExecution"`
 */
export const watchIEntryPointBeforeExecutionEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'BeforeExecution',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"Deposited"`
 */
export const watchIEntryPointDepositedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'Deposited',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"SignatureAggregatorChanged"`
 */
export const watchIEntryPointSignatureAggregatorChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'SignatureAggregatorChanged',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"StakeLocked"`
 */
export const watchIEntryPointStakeLockedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'StakeLocked',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"StakeUnlocked"`
 */
export const watchIEntryPointStakeUnlockedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'StakeUnlocked',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"StakeWithdrawn"`
 */
export const watchIEntryPointStakeWithdrawnEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'StakeWithdrawn',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"UserOperationEvent"`
 */
export const watchIEntryPointUserOperationEventEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'UserOperationEvent',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"UserOperationRevertReason"`
 */
export const watchIEntryPointUserOperationRevertReasonEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'UserOperationRevertReason',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iEntryPointAbi}__ and `eventName` set to `"Withdrawn"`
 */
export const watchIEntryPointWithdrawnEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iEntryPointAbi,
    eventName: 'Withdrawn',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iNonceManagerAbi}__
 */
export const readINonceManager = /*#__PURE__*/ createReadContract({
  abi: iNonceManagerAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iNonceManagerAbi}__ and `functionName` set to `"getNonce"`
 */
export const readINonceManagerGetNonce = /*#__PURE__*/ createReadContract({
  abi: iNonceManagerAbi,
  functionName: 'getNonce',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iNonceManagerAbi}__
 */
export const writeINonceManager = /*#__PURE__*/ createWriteContract({
  abi: iNonceManagerAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iNonceManagerAbi}__ and `functionName` set to `"incrementNonce"`
 */
export const writeINonceManagerIncrementNonce =
  /*#__PURE__*/ createWriteContract({
    abi: iNonceManagerAbi,
    functionName: 'incrementNonce',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iNonceManagerAbi}__
 */
export const simulateINonceManager = /*#__PURE__*/ createSimulateContract({
  abi: iNonceManagerAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iNonceManagerAbi}__ and `functionName` set to `"incrementNonce"`
 */
export const simulateINonceManagerIncrementNonce =
  /*#__PURE__*/ createSimulateContract({
    abi: iNonceManagerAbi,
    functionName: 'incrementNonce',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iPaymasterAbi}__
 */
export const writeIPaymaster = /*#__PURE__*/ createWriteContract({
  abi: iPaymasterAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iPaymasterAbi}__ and `functionName` set to `"postOp"`
 */
export const writeIPaymasterPostOp = /*#__PURE__*/ createWriteContract({
  abi: iPaymasterAbi,
  functionName: 'postOp',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iPaymasterAbi}__ and `functionName` set to `"validatePaymasterUserOp"`
 */
export const writeIPaymasterValidatePaymasterUserOp =
  /*#__PURE__*/ createWriteContract({
    abi: iPaymasterAbi,
    functionName: 'validatePaymasterUserOp',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iPaymasterAbi}__
 */
export const simulateIPaymaster = /*#__PURE__*/ createSimulateContract({
  abi: iPaymasterAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iPaymasterAbi}__ and `functionName` set to `"postOp"`
 */
export const simulateIPaymasterPostOp = /*#__PURE__*/ createSimulateContract({
  abi: iPaymasterAbi,
  functionName: 'postOp',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iPaymasterAbi}__ and `functionName` set to `"validatePaymasterUserOp"`
 */
export const simulateIPaymasterValidatePaymasterUserOp =
  /*#__PURE__*/ createSimulateContract({
    abi: iPaymasterAbi,
    functionName: 'validatePaymasterUserOp',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iStakeManagerAbi}__
 */
export const readIStakeManager = /*#__PURE__*/ createReadContract({
  abi: iStakeManagerAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readIStakeManagerBalanceOf = /*#__PURE__*/ createReadContract({
  abi: iStakeManagerAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"getDepositInfo"`
 */
export const readIStakeManagerGetDepositInfo = /*#__PURE__*/ createReadContract(
  { abi: iStakeManagerAbi, functionName: 'getDepositInfo' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iStakeManagerAbi}__
 */
export const writeIStakeManager = /*#__PURE__*/ createWriteContract({
  abi: iStakeManagerAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"addStake"`
 */
export const writeIStakeManagerAddStake = /*#__PURE__*/ createWriteContract({
  abi: iStakeManagerAbi,
  functionName: 'addStake',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"depositTo"`
 */
export const writeIStakeManagerDepositTo = /*#__PURE__*/ createWriteContract({
  abi: iStakeManagerAbi,
  functionName: 'depositTo',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"unlockStake"`
 */
export const writeIStakeManagerUnlockStake = /*#__PURE__*/ createWriteContract({
  abi: iStakeManagerAbi,
  functionName: 'unlockStake',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const writeIStakeManagerWithdrawStake =
  /*#__PURE__*/ createWriteContract({
    abi: iStakeManagerAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const writeIStakeManagerWithdrawTo = /*#__PURE__*/ createWriteContract({
  abi: iStakeManagerAbi,
  functionName: 'withdrawTo',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iStakeManagerAbi}__
 */
export const simulateIStakeManager = /*#__PURE__*/ createSimulateContract({
  abi: iStakeManagerAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"addStake"`
 */
export const simulateIStakeManagerAddStake =
  /*#__PURE__*/ createSimulateContract({
    abi: iStakeManagerAbi,
    functionName: 'addStake',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"depositTo"`
 */
export const simulateIStakeManagerDepositTo =
  /*#__PURE__*/ createSimulateContract({
    abi: iStakeManagerAbi,
    functionName: 'depositTo',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"unlockStake"`
 */
export const simulateIStakeManagerUnlockStake =
  /*#__PURE__*/ createSimulateContract({
    abi: iStakeManagerAbi,
    functionName: 'unlockStake',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"withdrawStake"`
 */
export const simulateIStakeManagerWithdrawStake =
  /*#__PURE__*/ createSimulateContract({
    abi: iStakeManagerAbi,
    functionName: 'withdrawStake',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iStakeManagerAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const simulateIStakeManagerWithdrawTo =
  /*#__PURE__*/ createSimulateContract({
    abi: iStakeManagerAbi,
    functionName: 'withdrawTo',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iStakeManagerAbi}__
 */
export const watchIStakeManagerEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: iStakeManagerAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iStakeManagerAbi}__ and `eventName` set to `"Deposited"`
 */
export const watchIStakeManagerDepositedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iStakeManagerAbi,
    eventName: 'Deposited',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iStakeManagerAbi}__ and `eventName` set to `"StakeLocked"`
 */
export const watchIStakeManagerStakeLockedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iStakeManagerAbi,
    eventName: 'StakeLocked',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iStakeManagerAbi}__ and `eventName` set to `"StakeUnlocked"`
 */
export const watchIStakeManagerStakeUnlockedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iStakeManagerAbi,
    eventName: 'StakeUnlocked',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iStakeManagerAbi}__ and `eventName` set to `"StakeWithdrawn"`
 */
export const watchIStakeManagerStakeWithdrawnEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iStakeManagerAbi,
    eventName: 'StakeWithdrawn',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link iStakeManagerAbi}__ and `eventName` set to `"Withdrawn"`
 */
export const watchIStakeManagerWithdrawnEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: iStakeManagerAbi,
    eventName: 'Withdrawn',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link incentiveAbi}__
 */
export const readIncentive = /*#__PURE__*/ createReadContract({
  abi: incentiveAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const readIncentiveClaimed = /*#__PURE__*/ createReadContract({
  abi: incentiveAbi,
  functionName: 'claimed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"claims"`
 */
export const readIncentiveClaims = /*#__PURE__*/ createReadContract({
  abi: incentiveAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const readIncentiveIsClaimable = /*#__PURE__*/ createReadContract({
  abi: incentiveAbi,
  functionName: 'isClaimable',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"owner"`
 */
export const readIncentiveOwner = /*#__PURE__*/ createReadContract({
  abi: incentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readIncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: incentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const readIncentivePreflight = /*#__PURE__*/ createReadContract({
  abi: incentiveAbi,
  functionName: 'preflight',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readIncentiveSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: incentiveAbi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link incentiveAbi}__
 */
export const writeIncentive = /*#__PURE__*/ createWriteContract({
  abi: incentiveAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: incentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"claim"`
 */
export const writeIncentiveClaim = /*#__PURE__*/ createWriteContract({
  abi: incentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: incentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const writeIncentiveInitialize = /*#__PURE__*/ createWriteContract({
  abi: incentiveAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const writeIncentiveReclaim = /*#__PURE__*/ createWriteContract({
  abi: incentiveAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeIncentiveRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: incentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: incentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeIncentiveTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: incentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link incentiveAbi}__
 */
export const simulateIncentive = /*#__PURE__*/ createSimulateContract({
  abi: incentiveAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: incentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"claim"`
 */
export const simulateIncentiveClaim = /*#__PURE__*/ createSimulateContract({
  abi: incentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: incentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateIncentiveInitialize = /*#__PURE__*/ createSimulateContract(
  { abi: incentiveAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const simulateIncentiveReclaim = /*#__PURE__*/ createSimulateContract({
  abi: incentiveAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateIncentiveRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: incentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: incentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateIncentiveTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: incentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link incentiveAbi}__
 */
export const watchIncentiveEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: incentiveAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link incentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const watchIncentiveClaimedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: incentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link incentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchIncentiveInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: incentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link incentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchIncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: incentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link incentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchIncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: incentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link incentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchIncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: incentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link initializableAbi}__
 */
export const watchInitializableEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: initializableAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link initializableAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchInitializableInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: initializableAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc1155Abi}__
 */
export const readMockErc1155 = /*#__PURE__*/ createReadContract({
  abi: mockErc1155Abi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readMockErc1155BalanceOf = /*#__PURE__*/ createReadContract({
  abi: mockErc1155Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const readMockErc1155BalanceOfBatch = /*#__PURE__*/ createReadContract({
  abi: mockErc1155Abi,
  functionName: 'balanceOfBatch',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readMockErc1155IsApprovedForAll = /*#__PURE__*/ createReadContract(
  { abi: mockErc1155Abi, functionName: 'isApprovedForAll' },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const readMockErc1155SupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: mockErc1155Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"uri"`
 */
export const readMockErc1155Uri = /*#__PURE__*/ createReadContract({
  abi: mockErc1155Abi,
  functionName: 'uri',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc1155Abi}__
 */
export const writeMockErc1155 = /*#__PURE__*/ createWriteContract({
  abi: mockErc1155Abi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"burn"`
 */
export const writeMockErc1155Burn = /*#__PURE__*/ createWriteContract({
  abi: mockErc1155Abi,
  functionName: 'burn',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"mint"`
 */
export const writeMockErc1155Mint = /*#__PURE__*/ createWriteContract({
  abi: mockErc1155Abi,
  functionName: 'mint',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const writeMockErc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createWriteContract({
    abi: mockErc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeMockErc1155SafeTransferFrom =
  /*#__PURE__*/ createWriteContract({
    abi: mockErc1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeMockErc1155SetApprovalForAll =
  /*#__PURE__*/ createWriteContract({
    abi: mockErc1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc1155Abi}__
 */
export const simulateMockErc1155 = /*#__PURE__*/ createSimulateContract({
  abi: mockErc1155Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"burn"`
 */
export const simulateMockErc1155Burn = /*#__PURE__*/ createSimulateContract({
  abi: mockErc1155Abi,
  functionName: 'burn',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"mint"`
 */
export const simulateMockErc1155Mint = /*#__PURE__*/ createSimulateContract({
  abi: mockErc1155Abi,
  functionName: 'mint',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const simulateMockErc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: mockErc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateMockErc1155SafeTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: mockErc1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateMockErc1155SetApprovalForAll =
  /*#__PURE__*/ createSimulateContract({
    abi: mockErc1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mockErc1155Abi}__
 */
export const watchMockErc1155Event = /*#__PURE__*/ createWatchContractEvent({
  abi: mockErc1155Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mockErc1155Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchMockErc1155ApprovalForAllEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: mockErc1155Abi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mockErc1155Abi}__ and `eventName` set to `"TransferBatch"`
 */
export const watchMockErc1155TransferBatchEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: mockErc1155Abi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mockErc1155Abi}__ and `eventName` set to `"TransferSingle"`
 */
export const watchMockErc1155TransferSingleEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: mockErc1155Abi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mockErc1155Abi}__ and `eventName` set to `"URI"`
 */
export const watchMockErc1155UriEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: mockErc1155Abi,
  eventName: 'URI',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc20Abi}__
 */
export const readMockErc20 = /*#__PURE__*/ createReadContract({
  abi: mockErc20Abi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const readMockErc20DomainSeparator = /*#__PURE__*/ createReadContract({
  abi: mockErc20Abi,
  functionName: 'DOMAIN_SEPARATOR',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"allowance"`
 */
export const readMockErc20Allowance = /*#__PURE__*/ createReadContract({
  abi: mockErc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readMockErc20BalanceOf = /*#__PURE__*/ createReadContract({
  abi: mockErc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"decimals"`
 */
export const readMockErc20Decimals = /*#__PURE__*/ createReadContract({
  abi: mockErc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"name"`
 */
export const readMockErc20Name = /*#__PURE__*/ createReadContract({
  abi: mockErc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"nonces"`
 */
export const readMockErc20Nonces = /*#__PURE__*/ createReadContract({
  abi: mockErc20Abi,
  functionName: 'nonces',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"symbol"`
 */
export const readMockErc20Symbol = /*#__PURE__*/ createReadContract({
  abi: mockErc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const readMockErc20TotalSupply = /*#__PURE__*/ createReadContract({
  abi: mockErc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc20Abi}__
 */
export const writeMockErc20 = /*#__PURE__*/ createWriteContract({
  abi: mockErc20Abi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"approve"`
 */
export const writeMockErc20Approve = /*#__PURE__*/ createWriteContract({
  abi: mockErc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"mint"`
 */
export const writeMockErc20Mint = /*#__PURE__*/ createWriteContract({
  abi: mockErc20Abi,
  functionName: 'mint',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"mintPayable"`
 */
export const writeMockErc20MintPayable = /*#__PURE__*/ createWriteContract({
  abi: mockErc20Abi,
  functionName: 'mintPayable',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"permit"`
 */
export const writeMockErc20Permit = /*#__PURE__*/ createWriteContract({
  abi: mockErc20Abi,
  functionName: 'permit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"transfer"`
 */
export const writeMockErc20Transfer = /*#__PURE__*/ createWriteContract({
  abi: mockErc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeMockErc20TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: mockErc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc20Abi}__
 */
export const simulateMockErc20 = /*#__PURE__*/ createSimulateContract({
  abi: mockErc20Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"approve"`
 */
export const simulateMockErc20Approve = /*#__PURE__*/ createSimulateContract({
  abi: mockErc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"mint"`
 */
export const simulateMockErc20Mint = /*#__PURE__*/ createSimulateContract({
  abi: mockErc20Abi,
  functionName: 'mint',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"mintPayable"`
 */
export const simulateMockErc20MintPayable =
  /*#__PURE__*/ createSimulateContract({
    abi: mockErc20Abi,
    functionName: 'mintPayable',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"permit"`
 */
export const simulateMockErc20Permit = /*#__PURE__*/ createSimulateContract({
  abi: mockErc20Abi,
  functionName: 'permit',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"transfer"`
 */
export const simulateMockErc20Transfer = /*#__PURE__*/ createSimulateContract({
  abi: mockErc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateMockErc20TransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: mockErc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mockErc20Abi}__
 */
export const watchMockErc20Event = /*#__PURE__*/ createWatchContractEvent({
  abi: mockErc20Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mockErc20Abi}__ and `eventName` set to `"Approval"`
 */
export const watchMockErc20ApprovalEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: mockErc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mockErc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchMockErc20TransferEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: mockErc20Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc721Abi}__
 */
export const readMockErc721 = /*#__PURE__*/ createReadContract({
  abi: mockErc721Abi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readMockErc721BalanceOf = /*#__PURE__*/ createReadContract({
  abi: mockErc721Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"getApproved"`
 */
export const readMockErc721GetApproved = /*#__PURE__*/ createReadContract({
  abi: mockErc721Abi,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readMockErc721IsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: mockErc721Abi,
  functionName: 'isApprovedForAll',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"mintPrice"`
 */
export const readMockErc721MintPrice = /*#__PURE__*/ createReadContract({
  abi: mockErc721Abi,
  functionName: 'mintPrice',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"name"`
 */
export const readMockErc721Name = /*#__PURE__*/ createReadContract({
  abi: mockErc721Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"ownerOf"`
 */
export const readMockErc721OwnerOf = /*#__PURE__*/ createReadContract({
  abi: mockErc721Abi,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const readMockErc721SupportsInterface = /*#__PURE__*/ createReadContract(
  { abi: mockErc721Abi, functionName: 'supportsInterface' },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"symbol"`
 */
export const readMockErc721Symbol = /*#__PURE__*/ createReadContract({
  abi: mockErc721Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"tokenURI"`
 */
export const readMockErc721TokenUri = /*#__PURE__*/ createReadContract({
  abi: mockErc721Abi,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"totalSupply"`
 */
export const readMockErc721TotalSupply = /*#__PURE__*/ createReadContract({
  abi: mockErc721Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc721Abi}__
 */
export const writeMockErc721 = /*#__PURE__*/ createWriteContract({
  abi: mockErc721Abi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"approve"`
 */
export const writeMockErc721Approve = /*#__PURE__*/ createWriteContract({
  abi: mockErc721Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"mint"`
 */
export const writeMockErc721Mint = /*#__PURE__*/ createWriteContract({
  abi: mockErc721Abi,
  functionName: 'mint',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeMockErc721SafeTransferFrom =
  /*#__PURE__*/ createWriteContract({
    abi: mockErc721Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeMockErc721SetApprovalForAll =
  /*#__PURE__*/ createWriteContract({
    abi: mockErc721Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeMockErc721TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: mockErc721Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc721Abi}__
 */
export const simulateMockErc721 = /*#__PURE__*/ createSimulateContract({
  abi: mockErc721Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"approve"`
 */
export const simulateMockErc721Approve = /*#__PURE__*/ createSimulateContract({
  abi: mockErc721Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"mint"`
 */
export const simulateMockErc721Mint = /*#__PURE__*/ createSimulateContract({
  abi: mockErc721Abi,
  functionName: 'mint',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateMockErc721SafeTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: mockErc721Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateMockErc721SetApprovalForAll =
  /*#__PURE__*/ createSimulateContract({
    abi: mockErc721Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link mockErc721Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateMockErc721TransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: mockErc721Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mockErc721Abi}__
 */
export const watchMockErc721Event = /*#__PURE__*/ createWatchContractEvent({
  abi: mockErc721Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mockErc721Abi}__ and `eventName` set to `"Approval"`
 */
export const watchMockErc721ApprovalEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: mockErc721Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mockErc721Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchMockErc721ApprovalForAllEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: mockErc721Abi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link mockErc721Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchMockErc721TransferEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: mockErc721Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ownableRolesAbi}__
 */
export const readOwnableRoles = /*#__PURE__*/ createReadContract({
  abi: ownableRolesAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"hasAllRoles"`
 */
export const readOwnableRolesHasAllRoles = /*#__PURE__*/ createReadContract({
  abi: ownableRolesAbi,
  functionName: 'hasAllRoles',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"hasAnyRole"`
 */
export const readOwnableRolesHasAnyRole = /*#__PURE__*/ createReadContract({
  abi: ownableRolesAbi,
  functionName: 'hasAnyRole',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"owner"`
 */
export const readOwnableRolesOwner = /*#__PURE__*/ createReadContract({
  abi: ownableRolesAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readOwnableRolesOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: ownableRolesAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"rolesOf"`
 */
export const readOwnableRolesRolesOf = /*#__PURE__*/ createReadContract({
  abi: ownableRolesAbi,
  functionName: 'rolesOf',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableRolesAbi}__
 */
export const writeOwnableRoles = /*#__PURE__*/ createWriteContract({
  abi: ownableRolesAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeOwnableRolesCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: ownableRolesAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeOwnableRolesCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: ownableRolesAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"grantRoles"`
 */
export const writeOwnableRolesGrantRoles = /*#__PURE__*/ createWriteContract({
  abi: ownableRolesAbi,
  functionName: 'grantRoles',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeOwnableRolesRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: ownableRolesAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const writeOwnableRolesRenounceRoles = /*#__PURE__*/ createWriteContract(
  { abi: ownableRolesAbi, functionName: 'renounceRoles' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeOwnableRolesRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: ownableRolesAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const writeOwnableRolesRevokeRoles = /*#__PURE__*/ createWriteContract({
  abi: ownableRolesAbi,
  functionName: 'revokeRoles',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeOwnableRolesTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: ownableRolesAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableRolesAbi}__
 */
export const simulateOwnableRoles = /*#__PURE__*/ createSimulateContract({
  abi: ownableRolesAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateOwnableRolesCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateOwnableRolesCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"grantRoles"`
 */
export const simulateOwnableRolesGrantRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateOwnableRolesRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const simulateOwnableRolesRenounceRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateOwnableRolesRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const simulateOwnableRolesRevokeRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ownableRolesAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateOwnableRolesTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: ownableRolesAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ownableRolesAbi}__
 */
export const watchOwnableRolesEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ownableRolesAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ownableRolesAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchOwnableRolesOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ownableRolesAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ownableRolesAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchOwnableRolesOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ownableRolesAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ownableRolesAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchOwnableRolesOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ownableRolesAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ownableRolesAbi}__ and `eventName` set to `"RolesUpdated"`
 */
export const watchOwnableRolesRolesUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ownableRolesAbi,
    eventName: 'RolesUpdated',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__
 */
export const readPoints = /*#__PURE__*/ createReadContract({ abi: pointsAbi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const readPointsDomainSeparator = /*#__PURE__*/ createReadContract({
  abi: pointsAbi,
  functionName: 'DOMAIN_SEPARATOR',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"ISSUER_ROLE"`
 */
export const readPointsIssuerRole = /*#__PURE__*/ createReadContract({
  abi: pointsAbi,
  functionName: 'ISSUER_ROLE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"allowance"`
 */
export const readPointsAllowance = /*#__PURE__*/ createReadContract({
  abi: pointsAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readPointsBalanceOf = /*#__PURE__*/ createReadContract({
  abi: pointsAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"decimals"`
 */
export const readPointsDecimals = /*#__PURE__*/ createReadContract({
  abi: pointsAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"hasAllRoles"`
 */
export const readPointsHasAllRoles = /*#__PURE__*/ createReadContract({
  abi: pointsAbi,
  functionName: 'hasAllRoles',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"hasAnyRole"`
 */
export const readPointsHasAnyRole = /*#__PURE__*/ createReadContract({
  abi: pointsAbi,
  functionName: 'hasAnyRole',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"name"`
 */
export const readPointsName = /*#__PURE__*/ createReadContract({
  abi: pointsAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"nonces"`
 */
export const readPointsNonces = /*#__PURE__*/ createReadContract({
  abi: pointsAbi,
  functionName: 'nonces',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"owner"`
 */
export const readPointsOwner = /*#__PURE__*/ createReadContract({
  abi: pointsAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readPointsOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: pointsAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"rolesOf"`
 */
export const readPointsRolesOf = /*#__PURE__*/ createReadContract({
  abi: pointsAbi,
  functionName: 'rolesOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"symbol"`
 */
export const readPointsSymbol = /*#__PURE__*/ createReadContract({
  abi: pointsAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readPointsTotalSupply = /*#__PURE__*/ createReadContract({
  abi: pointsAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__
 */
export const writePoints = /*#__PURE__*/ createWriteContract({ abi: pointsAbi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"approve"`
 */
export const writePointsApprove = /*#__PURE__*/ createWriteContract({
  abi: pointsAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writePointsCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: pointsAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writePointsCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: pointsAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"grantRoles"`
 */
export const writePointsGrantRoles = /*#__PURE__*/ createWriteContract({
  abi: pointsAbi,
  functionName: 'grantRoles',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"initialize"`
 */
export const writePointsInitialize = /*#__PURE__*/ createWriteContract({
  abi: pointsAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"issue"`
 */
export const writePointsIssue = /*#__PURE__*/ createWriteContract({
  abi: pointsAbi,
  functionName: 'issue',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"permit"`
 */
export const writePointsPermit = /*#__PURE__*/ createWriteContract({
  abi: pointsAbi,
  functionName: 'permit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writePointsRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: pointsAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const writePointsRenounceRoles = /*#__PURE__*/ createWriteContract({
  abi: pointsAbi,
  functionName: 'renounceRoles',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writePointsRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: pointsAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const writePointsRevokeRoles = /*#__PURE__*/ createWriteContract({
  abi: pointsAbi,
  functionName: 'revokeRoles',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"transfer"`
 */
export const writePointsTransfer = /*#__PURE__*/ createWriteContract({
  abi: pointsAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writePointsTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: pointsAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writePointsTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: pointsAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__
 */
export const simulatePoints = /*#__PURE__*/ createSimulateContract({
  abi: pointsAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"approve"`
 */
export const simulatePointsApprove = /*#__PURE__*/ createSimulateContract({
  abi: pointsAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulatePointsCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: pointsAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulatePointsCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: pointsAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"grantRoles"`
 */
export const simulatePointsGrantRoles = /*#__PURE__*/ createSimulateContract({
  abi: pointsAbi,
  functionName: 'grantRoles',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"initialize"`
 */
export const simulatePointsInitialize = /*#__PURE__*/ createSimulateContract({
  abi: pointsAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"issue"`
 */
export const simulatePointsIssue = /*#__PURE__*/ createSimulateContract({
  abi: pointsAbi,
  functionName: 'issue',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"permit"`
 */
export const simulatePointsPermit = /*#__PURE__*/ createSimulateContract({
  abi: pointsAbi,
  functionName: 'permit',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulatePointsRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: pointsAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const simulatePointsRenounceRoles = /*#__PURE__*/ createSimulateContract(
  { abi: pointsAbi, functionName: 'renounceRoles' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulatePointsRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: pointsAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const simulatePointsRevokeRoles = /*#__PURE__*/ createSimulateContract({
  abi: pointsAbi,
  functionName: 'revokeRoles',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"transfer"`
 */
export const simulatePointsTransfer = /*#__PURE__*/ createSimulateContract({
  abi: pointsAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulatePointsTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: pointsAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulatePointsTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: pointsAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link pointsAbi}__
 */
export const watchPointsEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: pointsAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link pointsAbi}__ and `eventName` set to `"Approval"`
 */
export const watchPointsApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: pointsAbi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link pointsAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchPointsInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: pointsAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link pointsAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchPointsOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: pointsAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link pointsAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchPointsOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: pointsAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link pointsAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchPointsOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: pointsAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link pointsAbi}__ and `eventName` set to `"RolesUpdated"`
 */
export const watchPointsRolesUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: pointsAbi,
    eventName: 'RolesUpdated',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link pointsAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchPointsTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: pointsAbi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__
 */
export const readPointsIncentive = /*#__PURE__*/ createReadContract({
  abi: pointsIncentiveAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const readPointsIncentiveClaimed = /*#__PURE__*/ createReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'claimed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const readPointsIncentiveClaims = /*#__PURE__*/ createReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const readPointsIncentiveIsClaimable = /*#__PURE__*/ createReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'isClaimable',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"limit"`
 */
export const readPointsIncentiveLimit = /*#__PURE__*/ createReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'limit',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const readPointsIncentiveOwner = /*#__PURE__*/ createReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readPointsIncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: pointsIncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const readPointsIncentivePreflight = /*#__PURE__*/ createReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'preflight',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"quantity"`
 */
export const readPointsIncentiveQuantity = /*#__PURE__*/ createReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'quantity',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const readPointsIncentiveReclaim = /*#__PURE__*/ createReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"selector"`
 */
export const readPointsIncentiveSelector = /*#__PURE__*/ createReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'selector',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readPointsIncentiveSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: pointsIncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"venue"`
 */
export const readPointsIncentiveVenue = /*#__PURE__*/ createReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'venue',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsIncentiveAbi}__
 */
export const writePointsIncentive = /*#__PURE__*/ createWriteContract({
  abi: pointsIncentiveAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writePointsIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: pointsIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const writePointsIncentiveClaim = /*#__PURE__*/ createWriteContract({
  abi: pointsIncentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writePointsIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: pointsIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const writePointsIncentiveInitialize = /*#__PURE__*/ createWriteContract(
  { abi: pointsIncentiveAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writePointsIncentiveRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: pointsIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writePointsIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: pointsIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writePointsIncentiveTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: pointsIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__
 */
export const simulatePointsIncentive = /*#__PURE__*/ createSimulateContract({
  abi: pointsIncentiveAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulatePointsIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: pointsIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const simulatePointsIncentiveClaim =
  /*#__PURE__*/ createSimulateContract({
    abi: pointsIncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulatePointsIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: pointsIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const simulatePointsIncentiveInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: pointsIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulatePointsIncentiveRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: pointsIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulatePointsIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: pointsIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulatePointsIncentiveTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: pointsIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link pointsIncentiveAbi}__
 */
export const watchPointsIncentiveEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: pointsIncentiveAbi },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const watchPointsIncentiveClaimedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: pointsIncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchPointsIncentiveInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: pointsIncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchPointsIncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: pointsIncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchPointsIncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: pointsIncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchPointsIncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: pointsIncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link signerValidatorAbi}__
 */
export const readSignerValidator = /*#__PURE__*/ createReadContract({
  abi: signerValidatorAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"owner"`
 */
export const readSignerValidatorOwner = /*#__PURE__*/ createReadContract({
  abi: signerValidatorAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readSignerValidatorOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: signerValidatorAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"signers"`
 */
export const readSignerValidatorSigners = /*#__PURE__*/ createReadContract({
  abi: signerValidatorAbi,
  functionName: 'signers',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readSignerValidatorSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: signerValidatorAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link signerValidatorAbi}__
 */
export const writeSignerValidator = /*#__PURE__*/ createWriteContract({
  abi: signerValidatorAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeSignerValidatorCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: signerValidatorAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeSignerValidatorCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: signerValidatorAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"initialize"`
 */
export const writeSignerValidatorInitialize = /*#__PURE__*/ createWriteContract(
  { abi: signerValidatorAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeSignerValidatorRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: signerValidatorAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeSignerValidatorRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: signerValidatorAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const writeSignerValidatorSetAuthorized =
  /*#__PURE__*/ createWriteContract({
    abi: signerValidatorAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeSignerValidatorTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: signerValidatorAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"validate"`
 */
export const writeSignerValidatorValidate = /*#__PURE__*/ createWriteContract({
  abi: signerValidatorAbi,
  functionName: 'validate',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link signerValidatorAbi}__
 */
export const simulateSignerValidator = /*#__PURE__*/ createSimulateContract({
  abi: signerValidatorAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateSignerValidatorCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateSignerValidatorCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateSignerValidatorInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateSignerValidatorRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateSignerValidatorRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const simulateSignerValidatorSetAuthorized =
  /*#__PURE__*/ createSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateSignerValidatorTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"validate"`
 */
export const simulateSignerValidatorValidate =
  /*#__PURE__*/ createSimulateContract({
    abi: signerValidatorAbi,
    functionName: 'validate',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link signerValidatorAbi}__
 */
export const watchSignerValidatorEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: signerValidatorAbi },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link signerValidatorAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchSignerValidatorInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: signerValidatorAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link signerValidatorAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchSignerValidatorOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: signerValidatorAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link signerValidatorAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchSignerValidatorOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: signerValidatorAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link signerValidatorAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchSignerValidatorOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: signerValidatorAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleAllowListAbi}__
 */
export const readSimpleAllowList = /*#__PURE__*/ createReadContract({
  abi: simpleAllowListAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"LIST_MANAGER_ROLE"`
 */
export const readSimpleAllowListListManagerRole =
  /*#__PURE__*/ createReadContract({
    abi: simpleAllowListAbi,
    functionName: 'LIST_MANAGER_ROLE',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"hasAllRoles"`
 */
export const readSimpleAllowListHasAllRoles = /*#__PURE__*/ createReadContract({
  abi: simpleAllowListAbi,
  functionName: 'hasAllRoles',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"hasAnyRole"`
 */
export const readSimpleAllowListHasAnyRole = /*#__PURE__*/ createReadContract({
  abi: simpleAllowListAbi,
  functionName: 'hasAnyRole',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"isAllowed"`
 */
export const readSimpleAllowListIsAllowed = /*#__PURE__*/ createReadContract({
  abi: simpleAllowListAbi,
  functionName: 'isAllowed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"owner"`
 */
export const readSimpleAllowListOwner = /*#__PURE__*/ createReadContract({
  abi: simpleAllowListAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readSimpleAllowListOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: simpleAllowListAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"rolesOf"`
 */
export const readSimpleAllowListRolesOf = /*#__PURE__*/ createReadContract({
  abi: simpleAllowListAbi,
  functionName: 'rolesOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readSimpleAllowListSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: simpleAllowListAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleAllowListAbi}__
 */
export const writeSimpleAllowList = /*#__PURE__*/ createWriteContract({
  abi: simpleAllowListAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeSimpleAllowListCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeSimpleAllowListCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"grantRoles"`
 */
export const writeSimpleAllowListGrantRoles = /*#__PURE__*/ createWriteContract(
  { abi: simpleAllowListAbi, functionName: 'grantRoles' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"initialize"`
 */
export const writeSimpleAllowListInitialize = /*#__PURE__*/ createWriteContract(
  { abi: simpleAllowListAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeSimpleAllowListRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const writeSimpleAllowListRenounceRoles =
  /*#__PURE__*/ createWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeSimpleAllowListRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const writeSimpleAllowListRevokeRoles =
  /*#__PURE__*/ createWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"setAllowed"`
 */
export const writeSimpleAllowListSetAllowed = /*#__PURE__*/ createWriteContract(
  { abi: simpleAllowListAbi, functionName: 'setAllowed' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeSimpleAllowListTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: simpleAllowListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__
 */
export const simulateSimpleAllowList = /*#__PURE__*/ createSimulateContract({
  abi: simpleAllowListAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateSimpleAllowListCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateSimpleAllowListCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"grantRoles"`
 */
export const simulateSimpleAllowListGrantRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateSimpleAllowListInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateSimpleAllowListRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const simulateSimpleAllowListRenounceRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateSimpleAllowListRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const simulateSimpleAllowListRevokeRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"setAllowed"`
 */
export const simulateSimpleAllowListSetAllowed =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'setAllowed',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateSimpleAllowListTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleAllowListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleAllowListAbi}__
 */
export const watchSimpleAllowListEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: simpleAllowListAbi },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleAllowListAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchSimpleAllowListInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleAllowListAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleAllowListAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchSimpleAllowListOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleAllowListAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleAllowListAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchSimpleAllowListOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleAllowListAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleAllowListAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchSimpleAllowListOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleAllowListAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleAllowListAbi}__ and `eventName` set to `"RolesUpdated"`
 */
export const watchSimpleAllowListRolesUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleAllowListAbi,
    eventName: 'RolesUpdated',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleBudgetAbi}__
 */
export const readSimpleBudget = /*#__PURE__*/ createReadContract({
  abi: simpleBudgetAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"available"`
 */
export const readSimpleBudgetAvailable = /*#__PURE__*/ createReadContract({
  abi: simpleBudgetAbi,
  functionName: 'available',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"distributed"`
 */
export const readSimpleBudgetDistributed = /*#__PURE__*/ createReadContract({
  abi: simpleBudgetAbi,
  functionName: 'distributed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"isAuthorized"`
 */
export const readSimpleBudgetIsAuthorized = /*#__PURE__*/ createReadContract({
  abi: simpleBudgetAbi,
  functionName: 'isAuthorized',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const readSimpleBudgetOnErc1155BatchReceived =
  /*#__PURE__*/ createReadContract({
    abi: simpleBudgetAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const readSimpleBudgetOnErc1155Received =
  /*#__PURE__*/ createReadContract({
    abi: simpleBudgetAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"owner"`
 */
export const readSimpleBudgetOwner = /*#__PURE__*/ createReadContract({
  abi: simpleBudgetAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readSimpleBudgetOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: simpleBudgetAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readSimpleBudgetSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: simpleBudgetAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"total"`
 */
export const readSimpleBudgetTotal = /*#__PURE__*/ createReadContract({
  abi: simpleBudgetAbi,
  functionName: 'total',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleBudgetAbi}__
 */
export const writeSimpleBudget = /*#__PURE__*/ createWriteContract({
  abi: simpleBudgetAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"allocate"`
 */
export const writeSimpleBudgetAllocate = /*#__PURE__*/ createWriteContract({
  abi: simpleBudgetAbi,
  functionName: 'allocate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeSimpleBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeSimpleBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"disburse"`
 */
export const writeSimpleBudgetDisburse = /*#__PURE__*/ createWriteContract({
  abi: simpleBudgetAbi,
  functionName: 'disburse',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const writeSimpleBudgetDisburseBatch = /*#__PURE__*/ createWriteContract(
  { abi: simpleBudgetAbi, functionName: 'disburseBatch' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"initialize"`
 */
export const writeSimpleBudgetInitialize = /*#__PURE__*/ createWriteContract({
  abi: simpleBudgetAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const writeSimpleBudgetReclaim = /*#__PURE__*/ createWriteContract({
  abi: simpleBudgetAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const writeSimpleBudgetReconcile = /*#__PURE__*/ createWriteContract({
  abi: simpleBudgetAbi,
  functionName: 'reconcile',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeSimpleBudgetRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeSimpleBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const writeSimpleBudgetSetAuthorized = /*#__PURE__*/ createWriteContract(
  { abi: simpleBudgetAbi, functionName: 'setAuthorized' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeSimpleBudgetTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: simpleBudgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__
 */
export const simulateSimpleBudget = /*#__PURE__*/ createSimulateContract({
  abi: simpleBudgetAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"allocate"`
 */
export const simulateSimpleBudgetAllocate =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'allocate',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateSimpleBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateSimpleBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"disburse"`
 */
export const simulateSimpleBudgetDisburse =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'disburse',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const simulateSimpleBudgetDisburseBatch =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'disburseBatch',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateSimpleBudgetInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const simulateSimpleBudgetReclaim = /*#__PURE__*/ createSimulateContract(
  { abi: simpleBudgetAbi, functionName: 'reclaim' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const simulateSimpleBudgetReconcile =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'reconcile',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateSimpleBudgetRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateSimpleBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const simulateSimpleBudgetSetAuthorized =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateSimpleBudgetTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleBudgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleBudgetAbi}__
 */
export const watchSimpleBudgetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: simpleBudgetAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleBudgetAbi}__ and `eventName` set to `"Authorized"`
 */
export const watchSimpleBudgetAuthorizedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleBudgetAbi,
    eventName: 'Authorized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleBudgetAbi}__ and `eventName` set to `"Distributed"`
 */
export const watchSimpleBudgetDistributedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleBudgetAbi,
    eventName: 'Distributed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleBudgetAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchSimpleBudgetInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleBudgetAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleBudgetAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchSimpleBudgetOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleBudgetAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleBudgetAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchSimpleBudgetOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleBudgetAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleBudgetAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchSimpleBudgetOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleBudgetAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleDenyListAbi}__
 */
export const readSimpleDenyList = /*#__PURE__*/ createReadContract({
  abi: simpleDenyListAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"isAllowed"`
 */
export const readSimpleDenyListIsAllowed = /*#__PURE__*/ createReadContract({
  abi: simpleDenyListAbi,
  functionName: 'isAllowed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"owner"`
 */
export const readSimpleDenyListOwner = /*#__PURE__*/ createReadContract({
  abi: simpleDenyListAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readSimpleDenyListOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: simpleDenyListAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readSimpleDenyListSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: simpleDenyListAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleDenyListAbi}__
 */
export const writeSimpleDenyList = /*#__PURE__*/ createWriteContract({
  abi: simpleDenyListAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeSimpleDenyListCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: simpleDenyListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeSimpleDenyListCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: simpleDenyListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"initialize"`
 */
export const writeSimpleDenyListInitialize = /*#__PURE__*/ createWriteContract({
  abi: simpleDenyListAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeSimpleDenyListRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: simpleDenyListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeSimpleDenyListRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: simpleDenyListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"setDenied"`
 */
export const writeSimpleDenyListSetDenied = /*#__PURE__*/ createWriteContract({
  abi: simpleDenyListAbi,
  functionName: 'setDenied',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeSimpleDenyListTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: simpleDenyListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__
 */
export const simulateSimpleDenyList = /*#__PURE__*/ createSimulateContract({
  abi: simpleDenyListAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateSimpleDenyListCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleDenyListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateSimpleDenyListCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleDenyListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateSimpleDenyListInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleDenyListAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateSimpleDenyListRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleDenyListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateSimpleDenyListRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleDenyListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"setDenied"`
 */
export const simulateSimpleDenyListSetDenied =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleDenyListAbi,
    functionName: 'setDenied',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateSimpleDenyListTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: simpleDenyListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleDenyListAbi}__
 */
export const watchSimpleDenyListEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: simpleDenyListAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleDenyListAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchSimpleDenyListInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleDenyListAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleDenyListAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchSimpleDenyListOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleDenyListAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleDenyListAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchSimpleDenyListOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleDenyListAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link simpleDenyListAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchSimpleDenyListOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: simpleDenyListAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uupsUpgradeableAbi}__
 */
export const readUupsUpgradeable = /*#__PURE__*/ createReadContract({
  abi: uupsUpgradeableAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uupsUpgradeableAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const readUupsUpgradeableProxiableUuid =
  /*#__PURE__*/ createReadContract({
    abi: uupsUpgradeableAbi,
    functionName: 'proxiableUUID',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uupsUpgradeableAbi}__
 */
export const writeUupsUpgradeable = /*#__PURE__*/ createWriteContract({
  abi: uupsUpgradeableAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uupsUpgradeableAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const writeUupsUpgradeableUpgradeToAndCall =
  /*#__PURE__*/ createWriteContract({
    abi: uupsUpgradeableAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uupsUpgradeableAbi}__
 */
export const simulateUupsUpgradeable = /*#__PURE__*/ createSimulateContract({
  abi: uupsUpgradeableAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link uupsUpgradeableAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const simulateUupsUpgradeableUpgradeToAndCall =
  /*#__PURE__*/ createSimulateContract({
    abi: uupsUpgradeableAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uupsUpgradeableAbi}__
 */
export const watchUupsUpgradeableEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: uupsUpgradeableAbi },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link uupsUpgradeableAbi}__ and `eventName` set to `"Upgraded"`
 */
export const watchUupsUpgradeableUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: uupsUpgradeableAbi,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link validatorAbi}__
 */
export const readValidator = /*#__PURE__*/ createReadContract({
  abi: validatorAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"owner"`
 */
export const readValidatorOwner = /*#__PURE__*/ createReadContract({
  abi: validatorAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readValidatorOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: validatorAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readValidatorSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: validatorAbi,
  functionName: 'supportsInterface',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link validatorAbi}__
 */
export const writeValidator = /*#__PURE__*/ createWriteContract({
  abi: validatorAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeValidatorCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: validatorAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeValidatorCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: validatorAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"initialize"`
 */
export const writeValidatorInitialize = /*#__PURE__*/ createWriteContract({
  abi: validatorAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeValidatorRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: validatorAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeValidatorRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: validatorAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeValidatorTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: validatorAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"validate"`
 */
export const writeValidatorValidate = /*#__PURE__*/ createWriteContract({
  abi: validatorAbi,
  functionName: 'validate',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link validatorAbi}__
 */
export const simulateValidator = /*#__PURE__*/ createSimulateContract({
  abi: validatorAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateValidatorCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: validatorAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateValidatorCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: validatorAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateValidatorInitialize = /*#__PURE__*/ createSimulateContract(
  { abi: validatorAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateValidatorRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: validatorAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateValidatorRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: validatorAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateValidatorTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: validatorAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"validate"`
 */
export const simulateValidatorValidate = /*#__PURE__*/ createSimulateContract({
  abi: validatorAbi,
  functionName: 'validate',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link validatorAbi}__
 */
export const watchValidatorEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: validatorAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link validatorAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchValidatorInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: validatorAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link validatorAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchValidatorOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: validatorAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link validatorAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchValidatorOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: validatorAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link validatorAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchValidatorOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: validatorAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link vestingBudgetAbi}__
 */
export const readVestingBudget = /*#__PURE__*/ createReadContract({
  abi: vestingBudgetAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"available"`
 */
export const readVestingBudgetAvailable = /*#__PURE__*/ createReadContract({
  abi: vestingBudgetAbi,
  functionName: 'available',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"cliff"`
 */
export const readVestingBudgetCliff = /*#__PURE__*/ createReadContract({
  abi: vestingBudgetAbi,
  functionName: 'cliff',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"distributed"`
 */
export const readVestingBudgetDistributed = /*#__PURE__*/ createReadContract({
  abi: vestingBudgetAbi,
  functionName: 'distributed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"duration"`
 */
export const readVestingBudgetDuration = /*#__PURE__*/ createReadContract({
  abi: vestingBudgetAbi,
  functionName: 'duration',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"end"`
 */
export const readVestingBudgetEnd = /*#__PURE__*/ createReadContract({
  abi: vestingBudgetAbi,
  functionName: 'end',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"isAuthorized"`
 */
export const readVestingBudgetIsAuthorized = /*#__PURE__*/ createReadContract({
  abi: vestingBudgetAbi,
  functionName: 'isAuthorized',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"owner"`
 */
export const readVestingBudgetOwner = /*#__PURE__*/ createReadContract({
  abi: vestingBudgetAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readVestingBudgetOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: vestingBudgetAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"start"`
 */
export const readVestingBudgetStart = /*#__PURE__*/ createReadContract({
  abi: vestingBudgetAbi,
  functionName: 'start',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readVestingBudgetSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: vestingBudgetAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"total"`
 */
export const readVestingBudgetTotal = /*#__PURE__*/ createReadContract({
  abi: vestingBudgetAbi,
  functionName: 'total',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link vestingBudgetAbi}__
 */
export const writeVestingBudget = /*#__PURE__*/ createWriteContract({
  abi: vestingBudgetAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"allocate"`
 */
export const writeVestingBudgetAllocate = /*#__PURE__*/ createWriteContract({
  abi: vestingBudgetAbi,
  functionName: 'allocate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeVestingBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeVestingBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"disburse"`
 */
export const writeVestingBudgetDisburse = /*#__PURE__*/ createWriteContract({
  abi: vestingBudgetAbi,
  functionName: 'disburse',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const writeVestingBudgetDisburseBatch =
  /*#__PURE__*/ createWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'disburseBatch',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"initialize"`
 */
export const writeVestingBudgetInitialize = /*#__PURE__*/ createWriteContract({
  abi: vestingBudgetAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const writeVestingBudgetReclaim = /*#__PURE__*/ createWriteContract({
  abi: vestingBudgetAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const writeVestingBudgetReconcile = /*#__PURE__*/ createWriteContract({
  abi: vestingBudgetAbi,
  functionName: 'reconcile',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeVestingBudgetRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeVestingBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const writeVestingBudgetSetAuthorized =
  /*#__PURE__*/ createWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeVestingBudgetTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: vestingBudgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__
 */
export const simulateVestingBudget = /*#__PURE__*/ createSimulateContract({
  abi: vestingBudgetAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"allocate"`
 */
export const simulateVestingBudgetAllocate =
  /*#__PURE__*/ createSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'allocate',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateVestingBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateVestingBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"disburse"`
 */
export const simulateVestingBudgetDisburse =
  /*#__PURE__*/ createSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'disburse',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const simulateVestingBudgetDisburseBatch =
  /*#__PURE__*/ createSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'disburseBatch',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateVestingBudgetInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const simulateVestingBudgetReclaim =
  /*#__PURE__*/ createSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const simulateVestingBudgetReconcile =
  /*#__PURE__*/ createSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'reconcile',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateVestingBudgetRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateVestingBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const simulateVestingBudgetSetAuthorized =
  /*#__PURE__*/ createSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateVestingBudgetTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: vestingBudgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link vestingBudgetAbi}__
 */
export const watchVestingBudgetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: vestingBudgetAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link vestingBudgetAbi}__ and `eventName` set to `"Authorized"`
 */
export const watchVestingBudgetAuthorizedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: vestingBudgetAbi,
    eventName: 'Authorized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link vestingBudgetAbi}__ and `eventName` set to `"Distributed"`
 */
export const watchVestingBudgetDistributedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: vestingBudgetAbi,
    eventName: 'Distributed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link vestingBudgetAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchVestingBudgetInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: vestingBudgetAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link vestingBudgetAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchVestingBudgetOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: vestingBudgetAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link vestingBudgetAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchVestingBudgetOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: vestingBudgetAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link vestingBudgetAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchVestingBudgetOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: vestingBudgetAbi,
    eventName: 'OwnershipTransferred',
  })
