import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from '@wagmi/core/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AAllowListIncentive
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aAllowListIncentiveAbi = [
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
    inputs: [],
    name: 'currentReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'reward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
// ACGDAIncentive
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const acgdaIncentiveAbi = [
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'reward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
// AContractAction
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aContractActionAbi = [
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
// AERC1155Incentive
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aerc1155IncentiveAbi = [
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
    name: 'currentReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
      {
        name: '',
        internalType: 'enum AERC1155Incentive.Strategy',
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
// AERC20Incentive
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aerc20IncentiveAbi = [
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
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotClaimable' },
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
    name: 'currentReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
      {
        name: '',
        internalType: 'enum AERC20Incentive.Strategy',
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
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AERC721MintAction
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aerc721MintActionAbi = [
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'CloneAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotImplemented' },
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
// APointsIncentive
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aPointsIncentiveAbi = [
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
    name: 'currentReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    name: 'reward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
// ASignerValidator
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aSignerValidatorAbi = [
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
// ASimpleAllowList
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aSimpleAllowListAbi = [
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
// ASimpleBudget
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aSimpleBudgetAbi = [
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
// ASimpleDenyList
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aSimpleDenyListAbi = [
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
// AVestingBudget
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aVestingBudgetAbi = [
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const actionAbi = [
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'currentReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'reward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
        name: 'boostIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'action',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'validator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'allowList',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'budget',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'BoostCreated',
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
    name: 'FEE_DENOMINATOR',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'reward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
// ERC1155
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc1155Abi = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
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
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    name: 'currentReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    name: 'reward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'strategy',
    outputs: [
      {
        name: '',
        internalType: 'enum AERC1155Incentive.Strategy',
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
    name: 'currentReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
      {
        name: '',
        internalType: 'enum AERC20Incentive.Strategy',
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
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'payable',
  },
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
  { type: 'error', inputs: [], name: 'InitializerNotImplemented' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationData' },
  { type: 'error', inputs: [], name: 'NewOwnerIsZeroAddress' },
  { type: 'error', inputs: [], name: 'NoHandoverRequest' },
  { type: 'error', inputs: [], name: 'NotImplemented' },
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
// IERC1155Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155ErrorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155MetadataURI
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155MetadataUriAbi = [
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
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
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
// IERC20Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20ErrorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC721Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc721ErrorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
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
    inputs: [],
    name: 'currentReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'reward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
// LibPRNG
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const libPrngAbi = [
  { type: 'error', inputs: [], name: 'InvalidInitialLazyShufflerLength' },
  { type: 'error', inputs: [], name: 'InvalidNewLazyShufflerLength' },
  { type: 'error', inputs: [], name: 'LazyShuffleFinished' },
  { type: 'error', inputs: [], name: 'LazyShufflerAlreadyInitialized' },
  { type: 'error', inputs: [], name: 'LazyShufflerGetOutOfBounds' },
  { type: 'error', inputs: [], name: 'LazyShufflerNotInitialized' },
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
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
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
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [],
    name: 'currentReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    name: 'reward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
// SafeCast
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const safeCastAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'int256', type: 'int256' },
    ],
    name: 'SafeCastOverflowedIntDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'int256', type: 'int256' }],
    name: 'SafeCastOverflowedIntToUint',
  },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'SafeCastOverflowedUintToInt',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SafeTransferLib
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const safeTransferLibAbi = [
  { type: 'error', inputs: [], name: 'ApproveFailed' },
  { type: 'error', inputs: [], name: 'ETHTransferFailed' },
  { type: 'error', inputs: [], name: 'Permit2AmountOverflow' },
  { type: 'error', inputs: [], name: 'Permit2Failed' },
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'getComponentInterface',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
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
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__
 */
export const readAAllowListIncentive = /*#__PURE__*/ createReadContract({
  abi: aAllowListIncentiveAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"allowList"`
 */
export const readAAllowListIncentiveAllowList =
  /*#__PURE__*/ createReadContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'allowList',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const readAAllowListIncentiveClaimed = /*#__PURE__*/ createReadContract({
  abi: aAllowListIncentiveAbi,
  functionName: 'claimed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const readAAllowListIncentiveClaims = /*#__PURE__*/ createReadContract({
  abi: aAllowListIncentiveAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"currentReward"`
 */
export const readAAllowListIncentiveCurrentReward =
  /*#__PURE__*/ createReadContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'currentReward',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readAAllowListIncentiveGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'getComponentInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const readAAllowListIncentiveIsClaimable =
  /*#__PURE__*/ createReadContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'isClaimable',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"limit"`
 */
export const readAAllowListIncentiveLimit = /*#__PURE__*/ createReadContract({
  abi: aAllowListIncentiveAbi,
  functionName: 'limit',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const readAAllowListIncentiveOwner = /*#__PURE__*/ createReadContract({
  abi: aAllowListIncentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readAAllowListIncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const readAAllowListIncentivePreflight =
  /*#__PURE__*/ createReadContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'preflight',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const readAAllowListIncentiveReclaim = /*#__PURE__*/ createReadContract({
  abi: aAllowListIncentiveAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"reward"`
 */
export const readAAllowListIncentiveReward = /*#__PURE__*/ createReadContract({
  abi: aAllowListIncentiveAbi,
  functionName: 'reward',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readAAllowListIncentiveSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__
 */
export const writeAAllowListIncentive = /*#__PURE__*/ createWriteContract({
  abi: aAllowListIncentiveAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeAAllowListIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const writeAAllowListIncentiveClaim = /*#__PURE__*/ createWriteContract({
  abi: aAllowListIncentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeAAllowListIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const writeAAllowListIncentiveInitialize =
  /*#__PURE__*/ createWriteContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeAAllowListIncentiveRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeAAllowListIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeAAllowListIncentiveTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__
 */
export const simulateAAllowListIncentive = /*#__PURE__*/ createSimulateContract(
  { abi: aAllowListIncentiveAbi },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateAAllowListIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const simulateAAllowListIncentiveClaim =
  /*#__PURE__*/ createSimulateContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateAAllowListIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateAAllowListIncentiveInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateAAllowListIncentiveRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateAAllowListIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateAAllowListIncentiveTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aAllowListIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aAllowListIncentiveAbi}__
 */
export const watchAAllowListIncentiveEvent =
  /*#__PURE__*/ createWatchContractEvent({ abi: aAllowListIncentiveAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const watchAAllowListIncentiveClaimedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aAllowListIncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchAAllowListIncentiveInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aAllowListIncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchAAllowListIncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aAllowListIncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchAAllowListIncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aAllowListIncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aAllowListIncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchAAllowListIncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aAllowListIncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__
 */
export const readAcgdaIncentive = /*#__PURE__*/ createReadContract({
  abi: acgdaIncentiveAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"asset"`
 */
export const readAcgdaIncentiveAsset = /*#__PURE__*/ createReadContract({
  abi: acgdaIncentiveAbi,
  functionName: 'asset',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"cgdaParams"`
 */
export const readAcgdaIncentiveCgdaParams = /*#__PURE__*/ createReadContract({
  abi: acgdaIncentiveAbi,
  functionName: 'cgdaParams',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const readAcgdaIncentiveClaimed = /*#__PURE__*/ createReadContract({
  abi: acgdaIncentiveAbi,
  functionName: 'claimed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const readAcgdaIncentiveClaims = /*#__PURE__*/ createReadContract({
  abi: acgdaIncentiveAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"currentReward"`
 */
export const readAcgdaIncentiveCurrentReward = /*#__PURE__*/ createReadContract(
  { abi: acgdaIncentiveAbi, functionName: 'currentReward' },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readAcgdaIncentiveGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: acgdaIncentiveAbi,
    functionName: 'getComponentInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const readAcgdaIncentiveIsClaimable = /*#__PURE__*/ createReadContract({
  abi: acgdaIncentiveAbi,
  functionName: 'isClaimable',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const readAcgdaIncentiveOwner = /*#__PURE__*/ createReadContract({
  abi: acgdaIncentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readAcgdaIncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: acgdaIncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const readAcgdaIncentivePreflight = /*#__PURE__*/ createReadContract({
  abi: acgdaIncentiveAbi,
  functionName: 'preflight',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"reward"`
 */
export const readAcgdaIncentiveReward = /*#__PURE__*/ createReadContract({
  abi: acgdaIncentiveAbi,
  functionName: 'reward',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readAcgdaIncentiveSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: acgdaIncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"totalBudget"`
 */
export const readAcgdaIncentiveTotalBudget = /*#__PURE__*/ createReadContract({
  abi: acgdaIncentiveAbi,
  functionName: 'totalBudget',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__
 */
export const writeAcgdaIncentive = /*#__PURE__*/ createWriteContract({
  abi: acgdaIncentiveAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeAcgdaIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: acgdaIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const writeAcgdaIncentiveClaim = /*#__PURE__*/ createWriteContract({
  abi: acgdaIncentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeAcgdaIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: acgdaIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const writeAcgdaIncentiveInitialize = /*#__PURE__*/ createWriteContract({
  abi: acgdaIncentiveAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const writeAcgdaIncentiveReclaim = /*#__PURE__*/ createWriteContract({
  abi: acgdaIncentiveAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeAcgdaIncentiveRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: acgdaIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeAcgdaIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: acgdaIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeAcgdaIncentiveTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: acgdaIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__
 */
export const simulateAcgdaIncentive = /*#__PURE__*/ createSimulateContract({
  abi: acgdaIncentiveAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateAcgdaIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: acgdaIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const simulateAcgdaIncentiveClaim = /*#__PURE__*/ createSimulateContract(
  { abi: acgdaIncentiveAbi, functionName: 'claim' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateAcgdaIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: acgdaIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateAcgdaIncentiveInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: acgdaIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const simulateAcgdaIncentiveReclaim =
  /*#__PURE__*/ createSimulateContract({
    abi: acgdaIncentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateAcgdaIncentiveRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: acgdaIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateAcgdaIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: acgdaIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateAcgdaIncentiveTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: acgdaIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link acgdaIncentiveAbi}__
 */
export const watchAcgdaIncentiveEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: acgdaIncentiveAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const watchAcgdaIncentiveClaimedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: acgdaIncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchAcgdaIncentiveInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: acgdaIncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchAcgdaIncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: acgdaIncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchAcgdaIncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: acgdaIncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link acgdaIncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchAcgdaIncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: acgdaIncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aContractActionAbi}__
 */
export const readAContractAction = /*#__PURE__*/ createReadContract({
  abi: aContractActionAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aContractActionAbi}__ and `functionName` set to `"VALIDATOR"`
 */
export const readAContractActionValidator = /*#__PURE__*/ createReadContract({
  abi: aContractActionAbi,
  functionName: 'VALIDATOR',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aContractActionAbi}__ and `functionName` set to `"chainId"`
 */
export const readAContractActionChainId = /*#__PURE__*/ createReadContract({
  abi: aContractActionAbi,
  functionName: 'chainId',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aContractActionAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readAContractActionGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: aContractActionAbi,
    functionName: 'getComponentInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aContractActionAbi}__ and `functionName` set to `"prepare"`
 */
export const readAContractActionPrepare = /*#__PURE__*/ createReadContract({
  abi: aContractActionAbi,
  functionName: 'prepare',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aContractActionAbi}__ and `functionName` set to `"selector"`
 */
export const readAContractActionSelector = /*#__PURE__*/ createReadContract({
  abi: aContractActionAbi,
  functionName: 'selector',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aContractActionAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readAContractActionSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: aContractActionAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aContractActionAbi}__ and `functionName` set to `"target"`
 */
export const readAContractActionTarget = /*#__PURE__*/ createReadContract({
  abi: aContractActionAbi,
  functionName: 'target',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aContractActionAbi}__ and `functionName` set to `"value"`
 */
export const readAContractActionValue = /*#__PURE__*/ createReadContract({
  abi: aContractActionAbi,
  functionName: 'value',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aContractActionAbi}__
 */
export const writeAContractAction = /*#__PURE__*/ createWriteContract({
  abi: aContractActionAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aContractActionAbi}__ and `functionName` set to `"execute"`
 */
export const writeAContractActionExecute = /*#__PURE__*/ createWriteContract({
  abi: aContractActionAbi,
  functionName: 'execute',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aContractActionAbi}__ and `functionName` set to `"initialize"`
 */
export const writeAContractActionInitialize = /*#__PURE__*/ createWriteContract(
  { abi: aContractActionAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aContractActionAbi}__
 */
export const simulateAContractAction = /*#__PURE__*/ createSimulateContract({
  abi: aContractActionAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aContractActionAbi}__ and `functionName` set to `"execute"`
 */
export const simulateAContractActionExecute =
  /*#__PURE__*/ createSimulateContract({
    abi: aContractActionAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aContractActionAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateAContractActionInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: aContractActionAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aContractActionAbi}__
 */
export const watchAContractActionEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: aContractActionAbi },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aContractActionAbi}__ and `eventName` set to `"ActionExecuted"`
 */
export const watchAContractActionActionExecutedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aContractActionAbi,
    eventName: 'ActionExecuted',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aContractActionAbi}__ and `eventName` set to `"ActionValidated"`
 */
export const watchAContractActionActionValidatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aContractActionAbi,
    eventName: 'ActionValidated',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aContractActionAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchAContractActionInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aContractActionAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__
 */
export const readAerc1155Incentive = /*#__PURE__*/ createReadContract({
  abi: aerc1155IncentiveAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"asset"`
 */
export const readAerc1155IncentiveAsset = /*#__PURE__*/ createReadContract({
  abi: aerc1155IncentiveAbi,
  functionName: 'asset',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const readAerc1155IncentiveClaimed = /*#__PURE__*/ createReadContract({
  abi: aerc1155IncentiveAbi,
  functionName: 'claimed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const readAerc1155IncentiveClaims = /*#__PURE__*/ createReadContract({
  abi: aerc1155IncentiveAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"currentReward"`
 */
export const readAerc1155IncentiveCurrentReward =
  /*#__PURE__*/ createReadContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'currentReward',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"extraData"`
 */
export const readAerc1155IncentiveExtraData = /*#__PURE__*/ createReadContract({
  abi: aerc1155IncentiveAbi,
  functionName: 'extraData',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readAerc1155IncentiveGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'getComponentInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const readAerc1155IncentiveIsClaimable =
  /*#__PURE__*/ createReadContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'isClaimable',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"limit"`
 */
export const readAerc1155IncentiveLimit = /*#__PURE__*/ createReadContract({
  abi: aerc1155IncentiveAbi,
  functionName: 'limit',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const readAerc1155IncentiveOnErc1155BatchReceived =
  /*#__PURE__*/ createReadContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const readAerc1155IncentiveOnErc1155Received =
  /*#__PURE__*/ createReadContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const readAerc1155IncentiveOwner = /*#__PURE__*/ createReadContract({
  abi: aerc1155IncentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readAerc1155IncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const readAerc1155IncentivePreflight = /*#__PURE__*/ createReadContract({
  abi: aerc1155IncentiveAbi,
  functionName: 'preflight',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"reward"`
 */
export const readAerc1155IncentiveReward = /*#__PURE__*/ createReadContract({
  abi: aerc1155IncentiveAbi,
  functionName: 'reward',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"strategy"`
 */
export const readAerc1155IncentiveStrategy = /*#__PURE__*/ createReadContract({
  abi: aerc1155IncentiveAbi,
  functionName: 'strategy',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readAerc1155IncentiveSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"tokenId"`
 */
export const readAerc1155IncentiveTokenId = /*#__PURE__*/ createReadContract({
  abi: aerc1155IncentiveAbi,
  functionName: 'tokenId',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__
 */
export const writeAerc1155Incentive = /*#__PURE__*/ createWriteContract({
  abi: aerc1155IncentiveAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeAerc1155IncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const writeAerc1155IncentiveClaim = /*#__PURE__*/ createWriteContract({
  abi: aerc1155IncentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeAerc1155IncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const writeAerc1155IncentiveInitialize =
  /*#__PURE__*/ createWriteContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const writeAerc1155IncentiveReclaim = /*#__PURE__*/ createWriteContract({
  abi: aerc1155IncentiveAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeAerc1155IncentiveRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeAerc1155IncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeAerc1155IncentiveTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__
 */
export const simulateAerc1155Incentive = /*#__PURE__*/ createSimulateContract({
  abi: aerc1155IncentiveAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateAerc1155IncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const simulateAerc1155IncentiveClaim =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateAerc1155IncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateAerc1155IncentiveInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const simulateAerc1155IncentiveReclaim =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateAerc1155IncentiveRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateAerc1155IncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateAerc1155IncentiveTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc1155IncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc1155IncentiveAbi}__
 */
export const watchAerc1155IncentiveEvent =
  /*#__PURE__*/ createWatchContractEvent({ abi: aerc1155IncentiveAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const watchAerc1155IncentiveClaimedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc1155IncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchAerc1155IncentiveInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc1155IncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchAerc1155IncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc1155IncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchAerc1155IncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc1155IncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc1155IncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchAerc1155IncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc1155IncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__
 */
export const readAerc20Incentive = /*#__PURE__*/ createReadContract({
  abi: aerc20IncentiveAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"asset"`
 */
export const readAerc20IncentiveAsset = /*#__PURE__*/ createReadContract({
  abi: aerc20IncentiveAbi,
  functionName: 'asset',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const readAerc20IncentiveClaimed = /*#__PURE__*/ createReadContract({
  abi: aerc20IncentiveAbi,
  functionName: 'claimed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const readAerc20IncentiveClaims = /*#__PURE__*/ createReadContract({
  abi: aerc20IncentiveAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"currentReward"`
 */
export const readAerc20IncentiveCurrentReward =
  /*#__PURE__*/ createReadContract({
    abi: aerc20IncentiveAbi,
    functionName: 'currentReward',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"entries"`
 */
export const readAerc20IncentiveEntries = /*#__PURE__*/ createReadContract({
  abi: aerc20IncentiveAbi,
  functionName: 'entries',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readAerc20IncentiveGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: aerc20IncentiveAbi,
    functionName: 'getComponentInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const readAerc20IncentiveIsClaimable = /*#__PURE__*/ createReadContract({
  abi: aerc20IncentiveAbi,
  functionName: 'isClaimable',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"limit"`
 */
export const readAerc20IncentiveLimit = /*#__PURE__*/ createReadContract({
  abi: aerc20IncentiveAbi,
  functionName: 'limit',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const readAerc20IncentiveOwner = /*#__PURE__*/ createReadContract({
  abi: aerc20IncentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readAerc20IncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: aerc20IncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const readAerc20IncentivePreflight = /*#__PURE__*/ createReadContract({
  abi: aerc20IncentiveAbi,
  functionName: 'preflight',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"reward"`
 */
export const readAerc20IncentiveReward = /*#__PURE__*/ createReadContract({
  abi: aerc20IncentiveAbi,
  functionName: 'reward',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"strategy"`
 */
export const readAerc20IncentiveStrategy = /*#__PURE__*/ createReadContract({
  abi: aerc20IncentiveAbi,
  functionName: 'strategy',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readAerc20IncentiveSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: aerc20IncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__
 */
export const writeAerc20Incentive = /*#__PURE__*/ createWriteContract({
  abi: aerc20IncentiveAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeAerc20IncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aerc20IncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const writeAerc20IncentiveClaim = /*#__PURE__*/ createWriteContract({
  abi: aerc20IncentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeAerc20IncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aerc20IncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"drawRaffle"`
 */
export const writeAerc20IncentiveDrawRaffle = /*#__PURE__*/ createWriteContract(
  { abi: aerc20IncentiveAbi, functionName: 'drawRaffle' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const writeAerc20IncentiveInitialize = /*#__PURE__*/ createWriteContract(
  { abi: aerc20IncentiveAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const writeAerc20IncentiveReclaim = /*#__PURE__*/ createWriteContract({
  abi: aerc20IncentiveAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeAerc20IncentiveRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aerc20IncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeAerc20IncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aerc20IncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeAerc20IncentiveTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aerc20IncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__
 */
export const simulateAerc20Incentive = /*#__PURE__*/ createSimulateContract({
  abi: aerc20IncentiveAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateAerc20IncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc20IncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const simulateAerc20IncentiveClaim =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc20IncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateAerc20IncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc20IncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"drawRaffle"`
 */
export const simulateAerc20IncentiveDrawRaffle =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc20IncentiveAbi,
    functionName: 'drawRaffle',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateAerc20IncentiveInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc20IncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const simulateAerc20IncentiveReclaim =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc20IncentiveAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateAerc20IncentiveRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc20IncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateAerc20IncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc20IncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateAerc20IncentiveTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc20IncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc20IncentiveAbi}__
 */
export const watchAerc20IncentiveEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: aerc20IncentiveAbi },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const watchAerc20IncentiveClaimedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc20IncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `eventName` set to `"Entry"`
 */
export const watchAerc20IncentiveEntryEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc20IncentiveAbi,
    eventName: 'Entry',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchAerc20IncentiveInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc20IncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchAerc20IncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc20IncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchAerc20IncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc20IncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc20IncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchAerc20IncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc20IncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc721MintActionAbi}__
 */
export const readAerc721MintAction = /*#__PURE__*/ createReadContract({
  abi: aerc721MintActionAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"VALIDATOR"`
 */
export const readAerc721MintActionValidator = /*#__PURE__*/ createReadContract({
  abi: aerc721MintActionAbi,
  functionName: 'VALIDATOR',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"chainId"`
 */
export const readAerc721MintActionChainId = /*#__PURE__*/ createReadContract({
  abi: aerc721MintActionAbi,
  functionName: 'chainId',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readAerc721MintActionGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: aerc721MintActionAbi,
    functionName: 'getComponentInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"owner"`
 */
export const readAerc721MintActionOwner = /*#__PURE__*/ createReadContract({
  abi: aerc721MintActionAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readAerc721MintActionOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: aerc721MintActionAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"prepare"`
 */
export const readAerc721MintActionPrepare = /*#__PURE__*/ createReadContract({
  abi: aerc721MintActionAbi,
  functionName: 'prepare',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"selector"`
 */
export const readAerc721MintActionSelector = /*#__PURE__*/ createReadContract({
  abi: aerc721MintActionAbi,
  functionName: 'selector',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readAerc721MintActionSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: aerc721MintActionAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"target"`
 */
export const readAerc721MintActionTarget = /*#__PURE__*/ createReadContract({
  abi: aerc721MintActionAbi,
  functionName: 'target',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"validated"`
 */
export const readAerc721MintActionValidated = /*#__PURE__*/ createReadContract({
  abi: aerc721MintActionAbi,
  functionName: 'validated',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"value"`
 */
export const readAerc721MintActionValue = /*#__PURE__*/ createReadContract({
  abi: aerc721MintActionAbi,
  functionName: 'value',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc721MintActionAbi}__
 */
export const writeAerc721MintAction = /*#__PURE__*/ createWriteContract({
  abi: aerc721MintActionAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeAerc721MintActionCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aerc721MintActionAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeAerc721MintActionCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aerc721MintActionAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"execute"`
 */
export const writeAerc721MintActionExecute = /*#__PURE__*/ createWriteContract({
  abi: aerc721MintActionAbi,
  functionName: 'execute',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"initialize"`
 */
export const writeAerc721MintActionInitialize =
  /*#__PURE__*/ createWriteContract({
    abi: aerc721MintActionAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeAerc721MintActionRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aerc721MintActionAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeAerc721MintActionRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aerc721MintActionAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeAerc721MintActionTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aerc721MintActionAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"validate"`
 */
export const writeAerc721MintActionValidate = /*#__PURE__*/ createWriteContract(
  { abi: aerc721MintActionAbi, functionName: 'validate' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc721MintActionAbi}__
 */
export const simulateAerc721MintAction = /*#__PURE__*/ createSimulateContract({
  abi: aerc721MintActionAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateAerc721MintActionCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc721MintActionAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateAerc721MintActionCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc721MintActionAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"execute"`
 */
export const simulateAerc721MintActionExecute =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc721MintActionAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateAerc721MintActionInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc721MintActionAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateAerc721MintActionRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc721MintActionAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateAerc721MintActionRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc721MintActionAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateAerc721MintActionTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc721MintActionAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `functionName` set to `"validate"`
 */
export const simulateAerc721MintActionValidate =
  /*#__PURE__*/ createSimulateContract({
    abi: aerc721MintActionAbi,
    functionName: 'validate',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc721MintActionAbi}__
 */
export const watchAerc721MintActionEvent =
  /*#__PURE__*/ createWatchContractEvent({ abi: aerc721MintActionAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `eventName` set to `"ActionExecuted"`
 */
export const watchAerc721MintActionActionExecutedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc721MintActionAbi,
    eventName: 'ActionExecuted',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `eventName` set to `"ActionValidated"`
 */
export const watchAerc721MintActionActionValidatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc721MintActionAbi,
    eventName: 'ActionValidated',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchAerc721MintActionInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc721MintActionAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchAerc721MintActionOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc721MintActionAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchAerc721MintActionOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc721MintActionAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aerc721MintActionAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchAerc721MintActionOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aerc721MintActionAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__
 */
export const readAPointsIncentive = /*#__PURE__*/ createReadContract({
  abi: aPointsIncentiveAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"claimed"`
 */
export const readAPointsIncentiveClaimed = /*#__PURE__*/ createReadContract({
  abi: aPointsIncentiveAbi,
  functionName: 'claimed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"claims"`
 */
export const readAPointsIncentiveClaims = /*#__PURE__*/ createReadContract({
  abi: aPointsIncentiveAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"currentReward"`
 */
export const readAPointsIncentiveCurrentReward =
  /*#__PURE__*/ createReadContract({
    abi: aPointsIncentiveAbi,
    functionName: 'currentReward',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readAPointsIncentiveGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: aPointsIncentiveAbi,
    functionName: 'getComponentInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"isClaimable"`
 */
export const readAPointsIncentiveIsClaimable = /*#__PURE__*/ createReadContract(
  { abi: aPointsIncentiveAbi, functionName: 'isClaimable' },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"limit"`
 */
export const readAPointsIncentiveLimit = /*#__PURE__*/ createReadContract({
  abi: aPointsIncentiveAbi,
  functionName: 'limit',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"owner"`
 */
export const readAPointsIncentiveOwner = /*#__PURE__*/ createReadContract({
  abi: aPointsIncentiveAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readAPointsIncentiveOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: aPointsIncentiveAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"preflight"`
 */
export const readAPointsIncentivePreflight = /*#__PURE__*/ createReadContract({
  abi: aPointsIncentiveAbi,
  functionName: 'preflight',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const readAPointsIncentiveReclaim = /*#__PURE__*/ createReadContract({
  abi: aPointsIncentiveAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"reward"`
 */
export const readAPointsIncentiveReward = /*#__PURE__*/ createReadContract({
  abi: aPointsIncentiveAbi,
  functionName: 'reward',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"selector"`
 */
export const readAPointsIncentiveSelector = /*#__PURE__*/ createReadContract({
  abi: aPointsIncentiveAbi,
  functionName: 'selector',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readAPointsIncentiveSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: aPointsIncentiveAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"venue"`
 */
export const readAPointsIncentiveVenue = /*#__PURE__*/ createReadContract({
  abi: aPointsIncentiveAbi,
  functionName: 'venue',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__
 */
export const writeAPointsIncentive = /*#__PURE__*/ createWriteContract({
  abi: aPointsIncentiveAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeAPointsIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aPointsIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const writeAPointsIncentiveClaim = /*#__PURE__*/ createWriteContract({
  abi: aPointsIncentiveAbi,
  functionName: 'claim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeAPointsIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aPointsIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const writeAPointsIncentiveInitialize =
  /*#__PURE__*/ createWriteContract({
    abi: aPointsIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeAPointsIncentiveRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aPointsIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeAPointsIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aPointsIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeAPointsIncentiveTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aPointsIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__
 */
export const simulateAPointsIncentive = /*#__PURE__*/ createSimulateContract({
  abi: aPointsIncentiveAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateAPointsIncentiveCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aPointsIncentiveAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"claim"`
 */
export const simulateAPointsIncentiveClaim =
  /*#__PURE__*/ createSimulateContract({
    abi: aPointsIncentiveAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateAPointsIncentiveCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aPointsIncentiveAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateAPointsIncentiveInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: aPointsIncentiveAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateAPointsIncentiveRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aPointsIncentiveAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateAPointsIncentiveRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aPointsIncentiveAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateAPointsIncentiveTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aPointsIncentiveAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aPointsIncentiveAbi}__
 */
export const watchAPointsIncentiveEvent =
  /*#__PURE__*/ createWatchContractEvent({ abi: aPointsIncentiveAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `eventName` set to `"Claimed"`
 */
export const watchAPointsIncentiveClaimedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aPointsIncentiveAbi,
    eventName: 'Claimed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchAPointsIncentiveInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aPointsIncentiveAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchAPointsIncentiveOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aPointsIncentiveAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchAPointsIncentiveOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aPointsIncentiveAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aPointsIncentiveAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchAPointsIncentiveOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aPointsIncentiveAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSignerValidatorAbi}__
 */
export const readASignerValidator = /*#__PURE__*/ createReadContract({
  abi: aSignerValidatorAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readASignerValidatorGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: aSignerValidatorAbi,
    functionName: 'getComponentInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"owner"`
 */
export const readASignerValidatorOwner = /*#__PURE__*/ createReadContract({
  abi: aSignerValidatorAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readASignerValidatorOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: aSignerValidatorAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"signers"`
 */
export const readASignerValidatorSigners = /*#__PURE__*/ createReadContract({
  abi: aSignerValidatorAbi,
  functionName: 'signers',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readASignerValidatorSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: aSignerValidatorAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSignerValidatorAbi}__
 */
export const writeASignerValidator = /*#__PURE__*/ createWriteContract({
  abi: aSignerValidatorAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeASignerValidatorCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aSignerValidatorAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeASignerValidatorCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aSignerValidatorAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"initialize"`
 */
export const writeASignerValidatorInitialize =
  /*#__PURE__*/ createWriteContract({
    abi: aSignerValidatorAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeASignerValidatorRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aSignerValidatorAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeASignerValidatorRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aSignerValidatorAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const writeASignerValidatorSetAuthorized =
  /*#__PURE__*/ createWriteContract({
    abi: aSignerValidatorAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeASignerValidatorTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aSignerValidatorAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"validate"`
 */
export const writeASignerValidatorValidate = /*#__PURE__*/ createWriteContract({
  abi: aSignerValidatorAbi,
  functionName: 'validate',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSignerValidatorAbi}__
 */
export const simulateASignerValidator = /*#__PURE__*/ createSimulateContract({
  abi: aSignerValidatorAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateASignerValidatorCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aSignerValidatorAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateASignerValidatorCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aSignerValidatorAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateASignerValidatorInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: aSignerValidatorAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateASignerValidatorRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aSignerValidatorAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateASignerValidatorRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aSignerValidatorAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const simulateASignerValidatorSetAuthorized =
  /*#__PURE__*/ createSimulateContract({
    abi: aSignerValidatorAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateASignerValidatorTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aSignerValidatorAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `functionName` set to `"validate"`
 */
export const simulateASignerValidatorValidate =
  /*#__PURE__*/ createSimulateContract({
    abi: aSignerValidatorAbi,
    functionName: 'validate',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSignerValidatorAbi}__
 */
export const watchASignerValidatorEvent =
  /*#__PURE__*/ createWatchContractEvent({ abi: aSignerValidatorAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchASignerValidatorInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSignerValidatorAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchASignerValidatorOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSignerValidatorAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchASignerValidatorOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSignerValidatorAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSignerValidatorAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchASignerValidatorOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSignerValidatorAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__
 */
export const readASimpleAllowList = /*#__PURE__*/ createReadContract({
  abi: aSimpleAllowListAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"LIST_MANAGER_ROLE"`
 */
export const readASimpleAllowListListManagerRole =
  /*#__PURE__*/ createReadContract({
    abi: aSimpleAllowListAbi,
    functionName: 'LIST_MANAGER_ROLE',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readASimpleAllowListGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: aSimpleAllowListAbi,
    functionName: 'getComponentInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"hasAllRoles"`
 */
export const readASimpleAllowListHasAllRoles = /*#__PURE__*/ createReadContract(
  { abi: aSimpleAllowListAbi, functionName: 'hasAllRoles' },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"hasAnyRole"`
 */
export const readASimpleAllowListHasAnyRole = /*#__PURE__*/ createReadContract({
  abi: aSimpleAllowListAbi,
  functionName: 'hasAnyRole',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"isAllowed"`
 */
export const readASimpleAllowListIsAllowed = /*#__PURE__*/ createReadContract({
  abi: aSimpleAllowListAbi,
  functionName: 'isAllowed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"owner"`
 */
export const readASimpleAllowListOwner = /*#__PURE__*/ createReadContract({
  abi: aSimpleAllowListAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readASimpleAllowListOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: aSimpleAllowListAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"rolesOf"`
 */
export const readASimpleAllowListRolesOf = /*#__PURE__*/ createReadContract({
  abi: aSimpleAllowListAbi,
  functionName: 'rolesOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readASimpleAllowListSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: aSimpleAllowListAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__
 */
export const writeASimpleAllowList = /*#__PURE__*/ createWriteContract({
  abi: aSimpleAllowListAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeASimpleAllowListCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleAllowListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeASimpleAllowListCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleAllowListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"grantRoles"`
 */
export const writeASimpleAllowListGrantRoles =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleAllowListAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"initialize"`
 */
export const writeASimpleAllowListInitialize =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleAllowListAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeASimpleAllowListRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleAllowListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const writeASimpleAllowListRenounceRoles =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleAllowListAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeASimpleAllowListRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleAllowListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const writeASimpleAllowListRevokeRoles =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleAllowListAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"setAllowed"`
 */
export const writeASimpleAllowListSetAllowed =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleAllowListAbi,
    functionName: 'setAllowed',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeASimpleAllowListTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleAllowListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__
 */
export const simulateASimpleAllowList = /*#__PURE__*/ createSimulateContract({
  abi: aSimpleAllowListAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateASimpleAllowListCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleAllowListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateASimpleAllowListCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleAllowListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"grantRoles"`
 */
export const simulateASimpleAllowListGrantRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleAllowListAbi,
    functionName: 'grantRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateASimpleAllowListInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleAllowListAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateASimpleAllowListRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleAllowListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"renounceRoles"`
 */
export const simulateASimpleAllowListRenounceRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleAllowListAbi,
    functionName: 'renounceRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateASimpleAllowListRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleAllowListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"revokeRoles"`
 */
export const simulateASimpleAllowListRevokeRoles =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleAllowListAbi,
    functionName: 'revokeRoles',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"setAllowed"`
 */
export const simulateASimpleAllowListSetAllowed =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleAllowListAbi,
    functionName: 'setAllowed',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateASimpleAllowListTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleAllowListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleAllowListAbi}__
 */
export const watchASimpleAllowListEvent =
  /*#__PURE__*/ createWatchContractEvent({ abi: aSimpleAllowListAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchASimpleAllowListInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleAllowListAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchASimpleAllowListOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleAllowListAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchASimpleAllowListOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleAllowListAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchASimpleAllowListOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleAllowListAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleAllowListAbi}__ and `eventName` set to `"RolesUpdated"`
 */
export const watchASimpleAllowListRolesUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleAllowListAbi,
    eventName: 'RolesUpdated',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__
 */
export const readASimpleBudget = /*#__PURE__*/ createReadContract({
  abi: aSimpleBudgetAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"available"`
 */
export const readASimpleBudgetAvailable = /*#__PURE__*/ createReadContract({
  abi: aSimpleBudgetAbi,
  functionName: 'available',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"distributed"`
 */
export const readASimpleBudgetDistributed = /*#__PURE__*/ createReadContract({
  abi: aSimpleBudgetAbi,
  functionName: 'distributed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readASimpleBudgetGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: aSimpleBudgetAbi,
    functionName: 'getComponentInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"isAuthorized"`
 */
export const readASimpleBudgetIsAuthorized = /*#__PURE__*/ createReadContract({
  abi: aSimpleBudgetAbi,
  functionName: 'isAuthorized',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const readASimpleBudgetOnErc1155BatchReceived =
  /*#__PURE__*/ createReadContract({
    abi: aSimpleBudgetAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const readASimpleBudgetOnErc1155Received =
  /*#__PURE__*/ createReadContract({
    abi: aSimpleBudgetAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"owner"`
 */
export const readASimpleBudgetOwner = /*#__PURE__*/ createReadContract({
  abi: aSimpleBudgetAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readASimpleBudgetOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: aSimpleBudgetAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readASimpleBudgetSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: aSimpleBudgetAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"total"`
 */
export const readASimpleBudgetTotal = /*#__PURE__*/ createReadContract({
  abi: aSimpleBudgetAbi,
  functionName: 'total',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__
 */
export const writeASimpleBudget = /*#__PURE__*/ createWriteContract({
  abi: aSimpleBudgetAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"allocate"`
 */
export const writeASimpleBudgetAllocate = /*#__PURE__*/ createWriteContract({
  abi: aSimpleBudgetAbi,
  functionName: 'allocate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeASimpleBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleBudgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeASimpleBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleBudgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"disburse"`
 */
export const writeASimpleBudgetDisburse = /*#__PURE__*/ createWriteContract({
  abi: aSimpleBudgetAbi,
  functionName: 'disburse',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const writeASimpleBudgetDisburseBatch =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleBudgetAbi,
    functionName: 'disburseBatch',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"initialize"`
 */
export const writeASimpleBudgetInitialize = /*#__PURE__*/ createWriteContract({
  abi: aSimpleBudgetAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const writeASimpleBudgetReclaim = /*#__PURE__*/ createWriteContract({
  abi: aSimpleBudgetAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const writeASimpleBudgetReconcile = /*#__PURE__*/ createWriteContract({
  abi: aSimpleBudgetAbi,
  functionName: 'reconcile',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeASimpleBudgetRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleBudgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeASimpleBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleBudgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const writeASimpleBudgetSetAuthorized =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleBudgetAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeASimpleBudgetTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleBudgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__
 */
export const simulateASimpleBudget = /*#__PURE__*/ createSimulateContract({
  abi: aSimpleBudgetAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"allocate"`
 */
export const simulateASimpleBudgetAllocate =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleBudgetAbi,
    functionName: 'allocate',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateASimpleBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleBudgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateASimpleBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleBudgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"disburse"`
 */
export const simulateASimpleBudgetDisburse =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleBudgetAbi,
    functionName: 'disburse',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const simulateASimpleBudgetDisburseBatch =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleBudgetAbi,
    functionName: 'disburseBatch',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateASimpleBudgetInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleBudgetAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const simulateASimpleBudgetReclaim =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleBudgetAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const simulateASimpleBudgetReconcile =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleBudgetAbi,
    functionName: 'reconcile',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateASimpleBudgetRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleBudgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateASimpleBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleBudgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const simulateASimpleBudgetSetAuthorized =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleBudgetAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateASimpleBudgetTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleBudgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleBudgetAbi}__
 */
export const watchASimpleBudgetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: aSimpleBudgetAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `eventName` set to `"Authorized"`
 */
export const watchASimpleBudgetAuthorizedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleBudgetAbi,
    eventName: 'Authorized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `eventName` set to `"Distributed"`
 */
export const watchASimpleBudgetDistributedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleBudgetAbi,
    eventName: 'Distributed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchASimpleBudgetInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleBudgetAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchASimpleBudgetOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleBudgetAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchASimpleBudgetOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleBudgetAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleBudgetAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchASimpleBudgetOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleBudgetAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__
 */
export const readASimpleDenyList = /*#__PURE__*/ createReadContract({
  abi: aSimpleDenyListAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readASimpleDenyListGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: aSimpleDenyListAbi,
    functionName: 'getComponentInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"isAllowed"`
 */
export const readASimpleDenyListIsAllowed = /*#__PURE__*/ createReadContract({
  abi: aSimpleDenyListAbi,
  functionName: 'isAllowed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"owner"`
 */
export const readASimpleDenyListOwner = /*#__PURE__*/ createReadContract({
  abi: aSimpleDenyListAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readASimpleDenyListOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: aSimpleDenyListAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readASimpleDenyListSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: aSimpleDenyListAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__
 */
export const writeASimpleDenyList = /*#__PURE__*/ createWriteContract({
  abi: aSimpleDenyListAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeASimpleDenyListCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleDenyListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeASimpleDenyListCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleDenyListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"initialize"`
 */
export const writeASimpleDenyListInitialize = /*#__PURE__*/ createWriteContract(
  { abi: aSimpleDenyListAbi, functionName: 'initialize' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeASimpleDenyListRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleDenyListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeASimpleDenyListRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleDenyListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"setDenied"`
 */
export const writeASimpleDenyListSetDenied = /*#__PURE__*/ createWriteContract({
  abi: aSimpleDenyListAbi,
  functionName: 'setDenied',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeASimpleDenyListTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aSimpleDenyListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__
 */
export const simulateASimpleDenyList = /*#__PURE__*/ createSimulateContract({
  abi: aSimpleDenyListAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateASimpleDenyListCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleDenyListAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateASimpleDenyListCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleDenyListAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateASimpleDenyListInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleDenyListAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateASimpleDenyListRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleDenyListAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateASimpleDenyListRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleDenyListAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"setDenied"`
 */
export const simulateASimpleDenyListSetDenied =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleDenyListAbi,
    functionName: 'setDenied',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateASimpleDenyListTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aSimpleDenyListAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleDenyListAbi}__
 */
export const watchASimpleDenyListEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: aSimpleDenyListAbi },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchASimpleDenyListInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleDenyListAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchASimpleDenyListOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleDenyListAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchASimpleDenyListOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleDenyListAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aSimpleDenyListAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchASimpleDenyListOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aSimpleDenyListAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aVestingBudgetAbi}__
 */
export const readAVestingBudget = /*#__PURE__*/ createReadContract({
  abi: aVestingBudgetAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"available"`
 */
export const readAVestingBudgetAvailable = /*#__PURE__*/ createReadContract({
  abi: aVestingBudgetAbi,
  functionName: 'available',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"cliff"`
 */
export const readAVestingBudgetCliff = /*#__PURE__*/ createReadContract({
  abi: aVestingBudgetAbi,
  functionName: 'cliff',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"distributed"`
 */
export const readAVestingBudgetDistributed = /*#__PURE__*/ createReadContract({
  abi: aVestingBudgetAbi,
  functionName: 'distributed',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"duration"`
 */
export const readAVestingBudgetDuration = /*#__PURE__*/ createReadContract({
  abi: aVestingBudgetAbi,
  functionName: 'duration',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"end"`
 */
export const readAVestingBudgetEnd = /*#__PURE__*/ createReadContract({
  abi: aVestingBudgetAbi,
  functionName: 'end',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readAVestingBudgetGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: aVestingBudgetAbi,
    functionName: 'getComponentInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"isAuthorized"`
 */
export const readAVestingBudgetIsAuthorized = /*#__PURE__*/ createReadContract({
  abi: aVestingBudgetAbi,
  functionName: 'isAuthorized',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"owner"`
 */
export const readAVestingBudgetOwner = /*#__PURE__*/ createReadContract({
  abi: aVestingBudgetAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"ownershipHandoverExpiresAt"`
 */
export const readAVestingBudgetOwnershipHandoverExpiresAt =
  /*#__PURE__*/ createReadContract({
    abi: aVestingBudgetAbi,
    functionName: 'ownershipHandoverExpiresAt',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"start"`
 */
export const readAVestingBudgetStart = /*#__PURE__*/ createReadContract({
  abi: aVestingBudgetAbi,
  functionName: 'start',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readAVestingBudgetSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: aVestingBudgetAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"total"`
 */
export const readAVestingBudgetTotal = /*#__PURE__*/ createReadContract({
  abi: aVestingBudgetAbi,
  functionName: 'total',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aVestingBudgetAbi}__
 */
export const writeAVestingBudget = /*#__PURE__*/ createWriteContract({
  abi: aVestingBudgetAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"allocate"`
 */
export const writeAVestingBudgetAllocate = /*#__PURE__*/ createWriteContract({
  abi: aVestingBudgetAbi,
  functionName: 'allocate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const writeAVestingBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aVestingBudgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const writeAVestingBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aVestingBudgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"disburse"`
 */
export const writeAVestingBudgetDisburse = /*#__PURE__*/ createWriteContract({
  abi: aVestingBudgetAbi,
  functionName: 'disburse',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const writeAVestingBudgetDisburseBatch =
  /*#__PURE__*/ createWriteContract({
    abi: aVestingBudgetAbi,
    functionName: 'disburseBatch',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"initialize"`
 */
export const writeAVestingBudgetInitialize = /*#__PURE__*/ createWriteContract({
  abi: aVestingBudgetAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const writeAVestingBudgetReclaim = /*#__PURE__*/ createWriteContract({
  abi: aVestingBudgetAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const writeAVestingBudgetReconcile = /*#__PURE__*/ createWriteContract({
  abi: aVestingBudgetAbi,
  functionName: 'reconcile',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeAVestingBudgetRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aVestingBudgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const writeAVestingBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createWriteContract({
    abi: aVestingBudgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const writeAVestingBudgetSetAuthorized =
  /*#__PURE__*/ createWriteContract({
    abi: aVestingBudgetAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeAVestingBudgetTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: aVestingBudgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aVestingBudgetAbi}__
 */
export const simulateAVestingBudget = /*#__PURE__*/ createSimulateContract({
  abi: aVestingBudgetAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"allocate"`
 */
export const simulateAVestingBudgetAllocate =
  /*#__PURE__*/ createSimulateContract({
    abi: aVestingBudgetAbi,
    functionName: 'allocate',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"cancelOwnershipHandover"`
 */
export const simulateAVestingBudgetCancelOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aVestingBudgetAbi,
    functionName: 'cancelOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"completeOwnershipHandover"`
 */
export const simulateAVestingBudgetCompleteOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aVestingBudgetAbi,
    functionName: 'completeOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"disburse"`
 */
export const simulateAVestingBudgetDisburse =
  /*#__PURE__*/ createSimulateContract({
    abi: aVestingBudgetAbi,
    functionName: 'disburse',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"disburseBatch"`
 */
export const simulateAVestingBudgetDisburseBatch =
  /*#__PURE__*/ createSimulateContract({
    abi: aVestingBudgetAbi,
    functionName: 'disburseBatch',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateAVestingBudgetInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: aVestingBudgetAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"reclaim"`
 */
export const simulateAVestingBudgetReclaim =
  /*#__PURE__*/ createSimulateContract({
    abi: aVestingBudgetAbi,
    functionName: 'reclaim',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"reconcile"`
 */
export const simulateAVestingBudgetReconcile =
  /*#__PURE__*/ createSimulateContract({
    abi: aVestingBudgetAbi,
    functionName: 'reconcile',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateAVestingBudgetRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aVestingBudgetAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"requestOwnershipHandover"`
 */
export const simulateAVestingBudgetRequestOwnershipHandover =
  /*#__PURE__*/ createSimulateContract({
    abi: aVestingBudgetAbi,
    functionName: 'requestOwnershipHandover',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"setAuthorized"`
 */
export const simulateAVestingBudgetSetAuthorized =
  /*#__PURE__*/ createSimulateContract({
    abi: aVestingBudgetAbi,
    functionName: 'setAuthorized',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateAVestingBudgetTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: aVestingBudgetAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aVestingBudgetAbi}__
 */
export const watchAVestingBudgetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: aVestingBudgetAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `eventName` set to `"Authorized"`
 */
export const watchAVestingBudgetAuthorizedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aVestingBudgetAbi,
    eventName: 'Authorized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `eventName` set to `"Distributed"`
 */
export const watchAVestingBudgetDistributedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aVestingBudgetAbi,
    eventName: 'Distributed',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchAVestingBudgetInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aVestingBudgetAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `eventName` set to `"OwnershipHandoverCanceled"`
 */
export const watchAVestingBudgetOwnershipHandoverCanceledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aVestingBudgetAbi,
    eventName: 'OwnershipHandoverCanceled',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `eventName` set to `"OwnershipHandoverRequested"`
 */
export const watchAVestingBudgetOwnershipHandoverRequestedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aVestingBudgetAbi,
    eventName: 'OwnershipHandoverRequested',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link aVestingBudgetAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchAVestingBudgetOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: aVestingBudgetAbi,
    eventName: 'OwnershipTransferred',
  })

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
 * Wraps __{@link readContract}__ with `abi` set to __{@link actionAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readActionGetComponentInterface = /*#__PURE__*/ createReadContract(
  { abi: actionAbi, functionName: 'getComponentInterface' },
)

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
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readAllowListGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: allowListAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"currentReward"`
 */
export const readAllowListIncentiveCurrentReward =
  /*#__PURE__*/ createReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'currentReward',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readAllowListIncentiveGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: allowListIncentiveAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link allowListIncentiveAbi}__ and `functionName` set to `"reward"`
 */
export const readAllowListIncentiveReward = /*#__PURE__*/ createReadContract({
  abi: allowListIncentiveAbi,
  functionName: 'reward',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostCoreAbi}__
 */
export const readBoostCore = /*#__PURE__*/ createReadContract({
  abi: boostCoreAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link boostCoreAbi}__ and `functionName` set to `"FEE_DENOMINATOR"`
 */
export const readBoostCoreFeeDenominator = /*#__PURE__*/ createReadContract({
  abi: boostCoreAbi,
  functionName: 'FEE_DENOMINATOR',
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
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link boostCoreAbi}__ and `eventName` set to `"BoostCreated"`
 */
export const watchBoostCoreBoostCreatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: boostCoreAbi,
    eventName: 'BoostCreated',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link budgetAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readBudgetGetComponentInterface = /*#__PURE__*/ createReadContract(
  { abi: budgetAbi, functionName: 'getComponentInterface' },
)

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
 * Wraps __{@link readContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readCgdaIncentiveGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: cgdaIncentiveAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link cgdaIncentiveAbi}__ and `functionName` set to `"reward"`
 */
export const readCgdaIncentiveReward = /*#__PURE__*/ createReadContract({
  abi: cgdaIncentiveAbi,
  functionName: 'reward',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link cloneableAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readCloneableGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: cloneableAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link contractActionAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readContractActionGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: contractActionAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"currentReward"`
 */
export const readErc1155IncentiveCurrentReward =
  /*#__PURE__*/ createReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'currentReward',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"extraData"`
 */
export const readErc1155IncentiveExtraData = /*#__PURE__*/ createReadContract({
  abi: erc1155IncentiveAbi,
  functionName: 'extraData',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readErc1155IncentiveGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: erc1155IncentiveAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc1155IncentiveAbi}__ and `functionName` set to `"reward"`
 */
export const readErc1155IncentiveReward = /*#__PURE__*/ createReadContract({
  abi: erc1155IncentiveAbi,
  functionName: 'reward',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"currentReward"`
 */
export const readErc20IncentiveCurrentReward = /*#__PURE__*/ createReadContract(
  { abi: erc20IncentiveAbi, functionName: 'currentReward' },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"entries"`
 */
export const readErc20IncentiveEntries = /*#__PURE__*/ createReadContract({
  abi: erc20IncentiveAbi,
  functionName: 'entries',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20IncentiveAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readErc20IncentiveGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: erc20IncentiveAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721MintActionAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readErc721MintActionGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: erc721MintActionAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__
 */
export const readIerc1155MetadataUri = /*#__PURE__*/ createReadContract({
  abi: ierc1155MetadataUriAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readIerc1155MetadataUriBalanceOf =
  /*#__PURE__*/ createReadContract({
    abi: ierc1155MetadataUriAbi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const readIerc1155MetadataUriBalanceOfBatch =
  /*#__PURE__*/ createReadContract({
    abi: ierc1155MetadataUriAbi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readIerc1155MetadataUriIsApprovedForAll =
  /*#__PURE__*/ createReadContract({
    abi: ierc1155MetadataUriAbi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readIerc1155MetadataUriSupportsInterface =
  /*#__PURE__*/ createReadContract({
    abi: ierc1155MetadataUriAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `functionName` set to `"uri"`
 */
export const readIerc1155MetadataUriUri = /*#__PURE__*/ createReadContract({
  abi: ierc1155MetadataUriAbi,
  functionName: 'uri',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__
 */
export const writeIerc1155MetadataUri = /*#__PURE__*/ createWriteContract({
  abi: ierc1155MetadataUriAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const writeIerc1155MetadataUriSafeBatchTransferFrom =
  /*#__PURE__*/ createWriteContract({
    abi: ierc1155MetadataUriAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeIerc1155MetadataUriSafeTransferFrom =
  /*#__PURE__*/ createWriteContract({
    abi: ierc1155MetadataUriAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeIerc1155MetadataUriSetApprovalForAll =
  /*#__PURE__*/ createWriteContract({
    abi: ierc1155MetadataUriAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__
 */
export const simulateIerc1155MetadataUri = /*#__PURE__*/ createSimulateContract(
  { abi: ierc1155MetadataUriAbi },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const simulateIerc1155MetadataUriSafeBatchTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: ierc1155MetadataUriAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateIerc1155MetadataUriSafeTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: ierc1155MetadataUriAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateIerc1155MetadataUriSetApprovalForAll =
  /*#__PURE__*/ createSimulateContract({
    abi: ierc1155MetadataUriAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__
 */
export const watchIerc1155MetadataUriEvent =
  /*#__PURE__*/ createWatchContractEvent({ abi: ierc1155MetadataUriAbi })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchIerc1155MetadataUriApprovalForAllEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ierc1155MetadataUriAbi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `eventName` set to `"TransferBatch"`
 */
export const watchIerc1155MetadataUriTransferBatchEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ierc1155MetadataUriAbi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `eventName` set to `"TransferSingle"`
 */
export const watchIerc1155MetadataUriTransferSingleEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ierc1155MetadataUriAbi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ierc1155MetadataUriAbi}__ and `eventName` set to `"URI"`
 */
export const watchIerc1155MetadataUriUriEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ierc1155MetadataUriAbi,
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"currentReward"`
 */
export const readIncentiveCurrentReward = /*#__PURE__*/ createReadContract({
  abi: incentiveAbi,
  functionName: 'currentReward',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readIncentiveGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: incentiveAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link incentiveAbi}__ and `functionName` set to `"reward"`
 */
export const readIncentiveReward = /*#__PURE__*/ createReadContract({
  abi: incentiveAbi,
  functionName: 'reward',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"currentReward"`
 */
export const readPointsIncentiveCurrentReward =
  /*#__PURE__*/ createReadContract({
    abi: pointsIncentiveAbi,
    functionName: 'currentReward',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readPointsIncentiveGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: pointsIncentiveAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"reclaim"`
 */
export const readPointsIncentiveReclaim = /*#__PURE__*/ createReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'reclaim',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link pointsIncentiveAbi}__ and `functionName` set to `"reward"`
 */
export const readPointsIncentiveReward = /*#__PURE__*/ createReadContract({
  abi: pointsIncentiveAbi,
  functionName: 'reward',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link signerValidatorAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readSignerValidatorGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: signerValidatorAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleAllowListAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readSimpleAllowListGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: simpleAllowListAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleBudgetAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readSimpleBudgetGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: simpleBudgetAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link simpleDenyListAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readSimpleDenyListGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: simpleDenyListAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link validatorAbi}__
 */
export const readValidator = /*#__PURE__*/ createReadContract({
  abi: validatorAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link validatorAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readValidatorGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: validatorAbi,
    functionName: 'getComponentInterface',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link vestingBudgetAbi}__ and `functionName` set to `"getComponentInterface"`
 */
export const readVestingBudgetGetComponentInterface =
  /*#__PURE__*/ createReadContract({
    abi: vestingBudgetAbi,
    functionName: 'getComponentInterface',
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
