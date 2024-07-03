// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface AllowListIncentive$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "AllowListIncentive",
  "sourceName": "contracts/incentives/AllowListIncentive.sol",
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AlreadyInitialized",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ClaimFailed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "CloneAlreadyInitialized",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InitializerNotImplemented",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidInitialization",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidInitializationData",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NewOwnerIsZeroAddress",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NoHandoverRequest",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotClaimable",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotImplemented",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotInitializing",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "Reentrancy",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "Unauthorized",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "Claimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "version",
          "type": "uint64"
        }
      ],
      "name": "Initialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "pendingOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipHandoverCanceled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "pendingOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipHandoverRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "oldOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "allowList",
      "outputs": [
        {
          "internalType": "contract SimpleAllowList",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cancelOwnershipHandover",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "data_",
          "type": "bytes"
        }
      ],
      "name": "claim",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "claimed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claims",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "pendingOwner",
          "type": "address"
        }
      ],
      "name": "completeOwnershipHandover",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentReward",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getComponentInterface",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "data_",
          "type": "bytes"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "data_",
          "type": "bytes"
        }
      ],
      "name": "isClaimable",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "limit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "result",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "pendingOwner",
          "type": "address"
        }
      ],
      "name": "ownershipHandoverExpiresAt",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "result",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "preflight",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "reclaim",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "requestOwnershipHandover",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "reward",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ],
  "bytecode": "0x608060405234801561000f575f80fd5b5061001f3361003260201b60201c565b61002d61010e60201b60201c565b6101a7565b61004061017a60201b60201c565b156100b8577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392780541561007a57630dc149f05f526004601cfd5b8160601b60601c9150811560ff1b82178155815f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a35061010b565b8060601b60601c9050807fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392755805f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a35b50565b5f61011d61017e60201b60201c565b9050805460018116156101375763f92ee8a95f526004601cfd5b8160c01c808260011c14610175578060011b8355806020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b505050565b5f90565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf6011325f1b905090565b611852806101b45f395ff3fe60806040526004361061011e575f3560e01c80638da5cb5b1161009f578063e18e650811610063578063e18e65081461037e578063f04e283e146103ba578063f1c30ec0146103d6578063f2fde38b14610412578063fee81cf41461042e5761011e565b80638da5cb5b14610288578063a4d66daf146102b2578063c63ff8dd146102dc578063c884ef8314610318578063dcc59b6f146103545761011e565b8063439fab91116100e6578063439fab91146101e65780634e7165a21461020e57806354d1f13d1461024a578063715018a61461025457806387b9d25c1461025e5761011e565b806301ffc9a71461012257806307621eca1461015e578063228cb7331461018857806325692962146101b257806328d6183b146101bc575b5f80fd5b34801561012d575f80fd5b5061014860048036038101906101439190610f63565b61046a565b6040516101559190610fa8565b60405180910390f35b348015610169575f80fd5b506101726104e3565b60405161017f9190610fd9565b60405180910390f35b348015610193575f80fd5b5061019c6104ec565b6040516101a99190610fd9565b60405180910390f35b6101ba6104f2565b005b3480156101c7575f80fd5b506101d0610543565b6040516101dd9190611001565b60405180910390f35b3480156101f1575f80fd5b5061020c6004803603810190610207919061107b565b61056a565b005b348015610219575f80fd5b50610234600480360381019061022f919061107b565b61064a565b6040516102419190611136565b60405180910390f35b6102526106a1565b005b61025c6106da565b005b348015610269575f80fd5b506102726106ed565b60405161027f91906111d0565b60405180910390f35b348015610293575f80fd5b5061029c610712565b6040516102a99190611209565b60405180910390f35b3480156102bd575f80fd5b506102c661073a565b6040516102d39190610fd9565b60405180910390f35b3480156102e7575f80fd5b5061030260048036038101906102fd919061107b565b610740565b60405161030f9190610fa8565b60405180910390f35b348015610323575f80fd5b5061033e6004803603810190610339919061124c565b610900565b60405161034b9190610fa8565b60405180910390f35b34801561035f575f80fd5b5061036861091d565b6040516103759190610fd9565b60405180910390f35b348015610389575f80fd5b506103a4600480360381019061039f919061107b565b610922565b6040516103b19190610fa8565b60405180910390f35b6103d460048036038101906103cf919061124c565b610a3f565b005b3480156103e1575f80fd5b506103fc60048036038101906103f7919061107b565b610a7d565b6040516104099190610fa8565b60405180910390f35b61042c6004803603810190610427919061124c565b610ab0565b005b348015610439575f80fd5b50610454600480360381019061044f919061124c565b610ad9565b6040516104619190610fd9565b60405180910390f35b5f7f8085fa3e000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806104dc57506104db82610af2565b5b9050919050565b5f600154905090565b60015481565b5f6104fb610b6b565b67ffffffffffffffff164201905063389a75e1600c52335f52806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d5f80a250565b5f7f8085fa3e00000000000000000000000000000000000000000000000000000000905090565b5f610573610b75565b905080546003825580156105a55760018160011c14303b1061059c5763f92ee8a95f526004601cfd5b818160ff1b1b91505b505f83838101906105b691906113a9565b90506105c133610b9e565b805f015160035f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060200151600481905550508015610645576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b505050565b60605f67ffffffffffffffff8111156106665761066561127b565b5b6040519080825280601f01601f1916602001820160405280156106985781602001600182028036833780820191505090505b50905092915050565b63389a75e1600c52335f525f6020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c925f80a2565b6106e2610c74565b6106eb5f610cab565b565b60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392754905090565b60045481565b5f610749610c74565b5f838381019061075991906114ed565b90506004545f8081548092919061076f90611561565b919050551015806107c9575060025f825f015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff165b15610800576040517f6247a84e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600160025f835f015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055505f80610866835f0151610d71565b9150915060035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633abb060483836040518363ffffffff1660e01b81526004016108c6929190611716565b5f604051808303815f87803b1580156108dd575f80fd5b505af11580156108ef573d5f803e3d5ffd5b505050506001935050505092915050565b6002602052805f5260405f205f915054906101000a900460ff1681565b5f5481565b5f80838381019061093391906114ed565b90506004545f54108015610991575060025f825f015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16155b8015610a36575060035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e3f756de825f01516040518263ffffffff1660e01b81526004016109f5919061176e565b602060405180830381865afa158015610a10573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610a3491906117c4565b155b91505092915050565b610a47610c74565b63389a75e1600c52805f526020600c208054421115610a6d57636f5e88185f526004601cfd5b5f815550610a7a81610cab565b50565b5f6040517fd623472500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610ab8610c74565b8060601b610acd57637448fbae5f526004601cfd5b610ad681610cab565b50565b5f63389a75e1600c52815f526020600c20549050919050565b5f7f42606236000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161480610b645750610b6382610e90565b5b9050919050565b5f6202a300905090565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf6011325f1b905090565b610ba6610ef9565b15610c1e577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805415610be057630dc149f05f526004601cfd5b8160601b60601c9150811560ff1b82178155815f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a350610c71565b8060601b60601c9050807fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392755805f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a35b50565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927543314610ca9576382b429005f526004601cfd5b565b610cb3610ef9565b15610d18577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278160601b60601c91508181547f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a3811560ff1b8217815550610d6e565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278160601b60601c91508181547f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a3818155505b50565b6060805f600167ffffffffffffffff811115610d9057610d8f61127b565b5b604051908082528060200260200182016040528015610dbe5781602001602082028036833780820191505090505b5090505f600167ffffffffffffffff811115610ddd57610ddc61127b565b5b604051908082528060200260200182016040528015610e0b5781602001602082028036833780820191505090505b50905084825f81518110610e2257610e216117ef565b5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250506001815f81518110610e7157610e706117ef565b5b6020026020010190151590811515815250508181935093505050915091565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f90565b5f604051905090565b5f80fd5b5f80fd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b610f4281610f0e565b8114610f4c575f80fd5b50565b5f81359050610f5d81610f39565b92915050565b5f60208284031215610f7857610f77610f06565b5b5f610f8584828501610f4f565b91505092915050565b5f8115159050919050565b610fa281610f8e565b82525050565b5f602082019050610fbb5f830184610f99565b92915050565b5f819050919050565b610fd381610fc1565b82525050565b5f602082019050610fec5f830184610fca565b92915050565b610ffb81610f0e565b82525050565b5f6020820190506110145f830184610ff2565b92915050565b5f80fd5b5f80fd5b5f80fd5b5f8083601f84011261103b5761103a61101a565b5b8235905067ffffffffffffffff8111156110585761105761101e565b5b60208301915083600182028301111561107457611073611022565b5b9250929050565b5f806020838503121561109157611090610f06565b5b5f83013567ffffffffffffffff8111156110ae576110ad610f0a565b5b6110ba85828601611026565b92509250509250929050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f611108826110c6565b61111281856110d0565b93506111228185602086016110e0565b61112b816110ee565b840191505092915050565b5f6020820190508181035f83015261114e81846110fe565b905092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f819050919050565b5f61119861119361118e84611156565b611175565b611156565b9050919050565b5f6111a98261117e565b9050919050565b5f6111ba8261119f565b9050919050565b6111ca816111b0565b82525050565b5f6020820190506111e35f8301846111c1565b92915050565b5f6111f382611156565b9050919050565b611203816111e9565b82525050565b5f60208201905061121c5f8301846111fa565b92915050565b61122b816111e9565b8114611235575f80fd5b50565b5f8135905061124681611222565b92915050565b5f6020828403121561126157611260610f06565b5b5f61126e84828501611238565b91505092915050565b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6112b1826110ee565b810181811067ffffffffffffffff821117156112d0576112cf61127b565b5b80604052505050565b5f6112e2610efd565b90506112ee82826112a8565b919050565b5f80fd5b5f611301826111e9565b9050919050565b611311816112f7565b811461131b575f80fd5b50565b5f8135905061132c81611308565b92915050565b61133b81610fc1565b8114611345575f80fd5b50565b5f8135905061135681611332565b92915050565b5f6040828403121561137157611370611277565b5b61137b60406112d9565b90505f61138a8482850161131e565b5f83015250602061139d84828501611348565b60208301525092915050565b5f604082840312156113be576113bd610f06565b5b5f6113cb8482850161135c565b91505092915050565b5f80fd5b5f67ffffffffffffffff8211156113f2576113f161127b565b5b6113fb826110ee565b9050602081019050919050565b828183375f83830152505050565b5f611428611423846113d8565b6112d9565b905082815260208101848484011115611444576114436113d4565b5b61144f848285611408565b509392505050565b5f82601f83011261146b5761146a61101a565b5b813561147b848260208601611416565b91505092915050565b5f6040828403121561149957611498611277565b5b6114a360406112d9565b90505f6114b284828501611238565b5f83015250602082013567ffffffffffffffff8111156114d5576114d46112f3565b5b6114e184828501611457565b60208301525092915050565b5f6020828403121561150257611501610f06565b5b5f82013567ffffffffffffffff81111561151f5761151e610f0a565b5b61152b84828501611484565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61156b82610fc1565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361159d5761159c611534565b5b600182019050919050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b6115da816111e9565b82525050565b5f6115eb83836115d1565b60208301905092915050565b5f602082019050919050565b5f61160d826115a8565b61161781856115b2565b9350611622836115c2565b805f5b8381101561165257815161163988826115e0565b9750611644836115f7565b925050600181019050611625565b5085935050505092915050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b61169181610f8e565b82525050565b5f6116a28383611688565b60208301905092915050565b5f602082019050919050565b5f6116c48261165f565b6116ce8185611669565b93506116d983611679565b805f5b838110156117095781516116f08882611697565b97506116fb836116ae565b9250506001810190506116dc565b5085935050505092915050565b5f6040820190508181035f83015261172e8185611603565b9050818103602083015261174281846116ba565b90509392505050565b50565b5f6117595f836110d0565b91506117648261174b565b5f82019050919050565b5f6040820190506117815f8301846111fa565b81810360208301526117928161174e565b905092915050565b6117a381610f8e565b81146117ad575f80fd5b50565b5f815190506117be8161179a565b92915050565b5f602082840312156117d9576117d8610f06565b5b5f6117e6848285016117b0565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffdfea2646970667358221220e8016c6666674875c1d6055007b783dc62432d0bc9d64a1f9ba9432fead3563664736f6c63430008190033",
  "deployedBytecode": "0x60806040526004361061011e575f3560e01c80638da5cb5b1161009f578063e18e650811610063578063e18e65081461037e578063f04e283e146103ba578063f1c30ec0146103d6578063f2fde38b14610412578063fee81cf41461042e5761011e565b80638da5cb5b14610288578063a4d66daf146102b2578063c63ff8dd146102dc578063c884ef8314610318578063dcc59b6f146103545761011e565b8063439fab91116100e6578063439fab91146101e65780634e7165a21461020e57806354d1f13d1461024a578063715018a61461025457806387b9d25c1461025e5761011e565b806301ffc9a71461012257806307621eca1461015e578063228cb7331461018857806325692962146101b257806328d6183b146101bc575b5f80fd5b34801561012d575f80fd5b5061014860048036038101906101439190610f63565b61046a565b6040516101559190610fa8565b60405180910390f35b348015610169575f80fd5b506101726104e3565b60405161017f9190610fd9565b60405180910390f35b348015610193575f80fd5b5061019c6104ec565b6040516101a99190610fd9565b60405180910390f35b6101ba6104f2565b005b3480156101c7575f80fd5b506101d0610543565b6040516101dd9190611001565b60405180910390f35b3480156101f1575f80fd5b5061020c6004803603810190610207919061107b565b61056a565b005b348015610219575f80fd5b50610234600480360381019061022f919061107b565b61064a565b6040516102419190611136565b60405180910390f35b6102526106a1565b005b61025c6106da565b005b348015610269575f80fd5b506102726106ed565b60405161027f91906111d0565b60405180910390f35b348015610293575f80fd5b5061029c610712565b6040516102a99190611209565b60405180910390f35b3480156102bd575f80fd5b506102c661073a565b6040516102d39190610fd9565b60405180910390f35b3480156102e7575f80fd5b5061030260048036038101906102fd919061107b565b610740565b60405161030f9190610fa8565b60405180910390f35b348015610323575f80fd5b5061033e6004803603810190610339919061124c565b610900565b60405161034b9190610fa8565b60405180910390f35b34801561035f575f80fd5b5061036861091d565b6040516103759190610fd9565b60405180910390f35b348015610389575f80fd5b506103a4600480360381019061039f919061107b565b610922565b6040516103b19190610fa8565b60405180910390f35b6103d460048036038101906103cf919061124c565b610a3f565b005b3480156103e1575f80fd5b506103fc60048036038101906103f7919061107b565b610a7d565b6040516104099190610fa8565b60405180910390f35b61042c6004803603810190610427919061124c565b610ab0565b005b348015610439575f80fd5b50610454600480360381019061044f919061124c565b610ad9565b6040516104619190610fd9565b60405180910390f35b5f7f8085fa3e000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806104dc57506104db82610af2565b5b9050919050565b5f600154905090565b60015481565b5f6104fb610b6b565b67ffffffffffffffff164201905063389a75e1600c52335f52806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d5f80a250565b5f7f8085fa3e00000000000000000000000000000000000000000000000000000000905090565b5f610573610b75565b905080546003825580156105a55760018160011c14303b1061059c5763f92ee8a95f526004601cfd5b818160ff1b1b91505b505f83838101906105b691906113a9565b90506105c133610b9e565b805f015160035f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060200151600481905550508015610645576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b505050565b60605f67ffffffffffffffff8111156106665761066561127b565b5b6040519080825280601f01601f1916602001820160405280156106985781602001600182028036833780820191505090505b50905092915050565b63389a75e1600c52335f525f6020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c925f80a2565b6106e2610c74565b6106eb5f610cab565b565b60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392754905090565b60045481565b5f610749610c74565b5f838381019061075991906114ed565b90506004545f8081548092919061076f90611561565b919050551015806107c9575060025f825f015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff165b15610800576040517f6247a84e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600160025f835f015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055505f80610866835f0151610d71565b9150915060035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633abb060483836040518363ffffffff1660e01b81526004016108c6929190611716565b5f604051808303815f87803b1580156108dd575f80fd5b505af11580156108ef573d5f803e3d5ffd5b505050506001935050505092915050565b6002602052805f5260405f205f915054906101000a900460ff1681565b5f5481565b5f80838381019061093391906114ed565b90506004545f54108015610991575060025f825f015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16155b8015610a36575060035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e3f756de825f01516040518263ffffffff1660e01b81526004016109f5919061176e565b602060405180830381865afa158015610a10573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610a3491906117c4565b155b91505092915050565b610a47610c74565b63389a75e1600c52805f526020600c208054421115610a6d57636f5e88185f526004601cfd5b5f815550610a7a81610cab565b50565b5f6040517fd623472500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610ab8610c74565b8060601b610acd57637448fbae5f526004601cfd5b610ad681610cab565b50565b5f63389a75e1600c52815f526020600c20549050919050565b5f7f42606236000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161480610b645750610b6382610e90565b5b9050919050565b5f6202a300905090565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf6011325f1b905090565b610ba6610ef9565b15610c1e577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805415610be057630dc149f05f526004601cfd5b8160601b60601c9150811560ff1b82178155815f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a350610c71565b8060601b60601c9050807fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392755805f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a35b50565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927543314610ca9576382b429005f526004601cfd5b565b610cb3610ef9565b15610d18577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278160601b60601c91508181547f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a3811560ff1b8217815550610d6e565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278160601b60601c91508181547f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a3818155505b50565b6060805f600167ffffffffffffffff811115610d9057610d8f61127b565b5b604051908082528060200260200182016040528015610dbe5781602001602082028036833780820191505090505b5090505f600167ffffffffffffffff811115610ddd57610ddc61127b565b5b604051908082528060200260200182016040528015610e0b5781602001602082028036833780820191505090505b50905084825f81518110610e2257610e216117ef565b5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250506001815f81518110610e7157610e706117ef565b5b6020026020010190151590811515815250508181935093505050915091565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f90565b5f604051905090565b5f80fd5b5f80fd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b610f4281610f0e565b8114610f4c575f80fd5b50565b5f81359050610f5d81610f39565b92915050565b5f60208284031215610f7857610f77610f06565b5b5f610f8584828501610f4f565b91505092915050565b5f8115159050919050565b610fa281610f8e565b82525050565b5f602082019050610fbb5f830184610f99565b92915050565b5f819050919050565b610fd381610fc1565b82525050565b5f602082019050610fec5f830184610fca565b92915050565b610ffb81610f0e565b82525050565b5f6020820190506110145f830184610ff2565b92915050565b5f80fd5b5f80fd5b5f80fd5b5f8083601f84011261103b5761103a61101a565b5b8235905067ffffffffffffffff8111156110585761105761101e565b5b60208301915083600182028301111561107457611073611022565b5b9250929050565b5f806020838503121561109157611090610f06565b5b5f83013567ffffffffffffffff8111156110ae576110ad610f0a565b5b6110ba85828601611026565b92509250509250929050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f611108826110c6565b61111281856110d0565b93506111228185602086016110e0565b61112b816110ee565b840191505092915050565b5f6020820190508181035f83015261114e81846110fe565b905092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f819050919050565b5f61119861119361118e84611156565b611175565b611156565b9050919050565b5f6111a98261117e565b9050919050565b5f6111ba8261119f565b9050919050565b6111ca816111b0565b82525050565b5f6020820190506111e35f8301846111c1565b92915050565b5f6111f382611156565b9050919050565b611203816111e9565b82525050565b5f60208201905061121c5f8301846111fa565b92915050565b61122b816111e9565b8114611235575f80fd5b50565b5f8135905061124681611222565b92915050565b5f6020828403121561126157611260610f06565b5b5f61126e84828501611238565b91505092915050565b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6112b1826110ee565b810181811067ffffffffffffffff821117156112d0576112cf61127b565b5b80604052505050565b5f6112e2610efd565b90506112ee82826112a8565b919050565b5f80fd5b5f611301826111e9565b9050919050565b611311816112f7565b811461131b575f80fd5b50565b5f8135905061132c81611308565b92915050565b61133b81610fc1565b8114611345575f80fd5b50565b5f8135905061135681611332565b92915050565b5f6040828403121561137157611370611277565b5b61137b60406112d9565b90505f61138a8482850161131e565b5f83015250602061139d84828501611348565b60208301525092915050565b5f604082840312156113be576113bd610f06565b5b5f6113cb8482850161135c565b91505092915050565b5f80fd5b5f67ffffffffffffffff8211156113f2576113f161127b565b5b6113fb826110ee565b9050602081019050919050565b828183375f83830152505050565b5f611428611423846113d8565b6112d9565b905082815260208101848484011115611444576114436113d4565b5b61144f848285611408565b509392505050565b5f82601f83011261146b5761146a61101a565b5b813561147b848260208601611416565b91505092915050565b5f6040828403121561149957611498611277565b5b6114a360406112d9565b90505f6114b284828501611238565b5f83015250602082013567ffffffffffffffff8111156114d5576114d46112f3565b5b6114e184828501611457565b60208301525092915050565b5f6020828403121561150257611501610f06565b5b5f82013567ffffffffffffffff81111561151f5761151e610f0a565b5b61152b84828501611484565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61156b82610fc1565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361159d5761159c611534565b5b600182019050919050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b6115da816111e9565b82525050565b5f6115eb83836115d1565b60208301905092915050565b5f602082019050919050565b5f61160d826115a8565b61161781856115b2565b9350611622836115c2565b805f5b8381101561165257815161163988826115e0565b9750611644836115f7565b925050600181019050611625565b5085935050505092915050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b61169181610f8e565b82525050565b5f6116a28383611688565b60208301905092915050565b5f602082019050919050565b5f6116c48261165f565b6116ce8185611669565b93506116d983611679565b805f5b838110156117095781516116f08882611697565b97506116fb836116ae565b9250506001810190506116dc565b5085935050505092915050565b5f6040820190508181035f83015261172e8185611603565b9050818103602083015261174281846116ba565b90509392505050565b50565b5f6117595f836110d0565b91506117648261174b565b5f82019050919050565b5f6040820190506117815f8301846111fa565b81810360208301526117928161174e565b905092915050565b6117a381610f8e565b81146117ad575f80fd5b50565b5f815190506117be8161179a565b92915050565b5f602082840312156117d9576117d8610f06565b5b5f6117e6848285016117b0565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffdfea2646970667358221220e8016c6666674875c1d6055007b783dc62432d0bc9d64a1f9ba9432fead3563664736f6c63430008190033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "AllowListIncentive",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<AllowListIncentive$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/incentives/AllowListIncentive.sol:AllowListIncentive",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<AllowListIncentive$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "AllowListIncentive",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<AllowListIncentive$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/incentives/AllowListIncentive.sol:AllowListIncentive",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<AllowListIncentive$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "AllowListIncentive",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<AllowListIncentive$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/incentives/AllowListIncentive.sol:AllowListIncentive",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<AllowListIncentive$Type["abi"]>>;
}
