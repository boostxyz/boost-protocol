// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface PointsIncentive$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "PointsIncentive",
  "sourceName": "contracts/incentives/PointsIncentive.sol",
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
          "name": "budgetData",
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
      "inputs": [],
      "name": "selector",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
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
    },
    {
      "inputs": [],
      "name": "venue",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x608060405234801561000f575f80fd5b5061001f3361003260201b60201c565b61002d61010e60201b60201c565b6101a7565b61004061017a60201b60201c565b156100b8577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392780541561007a57630dc149f05f526004601cfd5b8160601b60601c9150811560ff1b82178155815f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a35061010b565b8060601b60601c9050807fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392755805f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a35b50565b5f61011d61017e60201b60201c565b9050805460018116156101375763f92ee8a95f526004601cfd5b8160c01c808260011c14610175578060011b8355806020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b505050565b5f90565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf6011325f1b905090565b61166f806101b45f395ff3fe608060405260043610610129575f3560e01c8063a270a737116100aa578063e18e65081161006e578063e18e650814610389578063ea3d508a146103c5578063f04e283e146103ef578063f1c30ec01461040b578063f2fde38b14610447578063fee81cf41461046357610129565b8063a270a73714610293578063a4d66daf146102bd578063c63ff8dd146102e7578063c884ef8314610323578063dcc59b6f1461035f57610129565b8063439fab91116100f1578063439fab91146101f15780634e7165a21461021957806354d1f13d14610255578063715018a61461025f5780638da5cb5b1461026957610129565b806301ffc9a71461012d57806307621eca14610169578063228cb7331461019357806325692962146101bd57806328d6183b146101c7575b5f80fd5b348015610138575f80fd5b50610153600480360381019061014e9190610f63565b61049f565b6040516101609190610fa8565b60405180910390f35b348015610174575f80fd5b5061017d610518565b60405161018a9190610fd9565b60405180910390f35b34801561019e575f80fd5b506101a7610521565b6040516101b49190610fd9565b60405180910390f35b6101c5610527565b005b3480156101d2575f80fd5b506101db610578565b6040516101e89190611001565b60405180910390f35b3480156101fc575f80fd5b506102176004803603810190610212919061107b565b61059f565b005b348015610224575f80fd5b5061023f600480360381019061023a919061107b565b6106f7565b60405161024c9190611136565b60405180910390f35b61025d61074e565b005b610267610787565b005b348015610274575f80fd5b5061027d61079a565b60405161028a9190611195565b60405180910390f35b34801561029e575f80fd5b506102a76107c2565b6040516102b49190611195565b60405180910390f35b3480156102c8575f80fd5b506102d16107e7565b6040516102de9190610fd9565b60405180910390f35b3480156102f2575f80fd5b5061030d6004803603810190610308919061107b565b6107ed565b60405161031a9190610fa8565b60405180910390f35b34801561032e575f80fd5b50610349600480360381019061034491906111d8565b610aa1565b6040516103569190610fa8565b60405180910390f35b34801561036a575f80fd5b50610373610abe565b6040516103809190610fd9565b60405180910390f35b348015610394575f80fd5b506103af60048036038101906103aa919061107b565b610ac3565b6040516103bc9190610fa8565b60405180910390f35b3480156103d0575f80fd5b506103d9610aeb565b6040516103e69190611001565b60405180910390f35b610409600480360381019061040491906111d8565b610afd565b005b348015610416575f80fd5b50610431600480360381019061042c919061107b565b610b3b565b60405161043e9190610fa8565b60405180910390f35b610461600480360381019061045c91906111d8565b610b6e565b005b34801561046e575f80fd5b50610489600480360381019061048491906111d8565b610b97565b6040516104969190610fd9565b60405180910390f35b5f7f8085fa3e000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161480610511575061051082610bb0565b5b9050919050565b5f600154905090565b60015481565b5f610530610c29565b67ffffffffffffffff164201905063389a75e1600c52335f52806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d5f80a250565b5f7f8085fa3e00000000000000000000000000000000000000000000000000000000905090565b5f6105a8610c33565b905080546003825580156105da5760018160011c14303b106105d15763f92ee8a95f526004601cfd5b818160ff1b1b91505b505f83838101906105eb9190611322565b90505f8160400151148061060257505f8160600151145b15610639576040517ff92ee8a900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b805f015160035f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806020015160055f6101000a81548163ffffffff021916908360e01c0217905550806040015160018190555080606001516004819055506106bc33610c5c565b5080156106f2576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b505050565b60605f67ffffffffffffffff81111561071357610712611207565b5b6040519080825280601f01601f1916602001820160405280156107455781602001600182028036833780820191505090505b50905092915050565b63389a75e1600c52335f525f6020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c925f80a2565b61078f610d32565b6107985f610d69565b565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392754905090565b60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60045481565b5f6107f6610d32565b5f83838101906108069190611466565b9050610814815f0151610e2f565b61084a576040517f6247a84e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f8081548092919061085b906114da565b9190505550600160025f835f015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055505f60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660055f9054906101000a900460e01b835f0151600154604051602401610918929190611521565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040516109829190611582565b5f604051808303815f865af19150503d805f81146109bb576040519150601f19603f3d011682016040523d82523d5f602084013e6109c0565b606091505b50509050806109fb576040517f360e42e100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b815f015173ffffffffffffffffffffffffffffffffffffffff167f9ad2e7a4af16dceda9cce4274b2f59c328d8c012eb0e15eb5e1e73b7d8f264d360035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16845f0151600154604051602001610a71939291906115fd565b604051602081830303815290604052604051610a8d9190611136565b60405180910390a260019250505092915050565b6002602052805f5260405f205f915054906101000a900460ff1681565b5f5481565b5f808383810190610ad49190611466565b9050610ae2815f0151610e2f565b91505092915050565b60055f9054906101000a900460e01b81565b610b05610d32565b63389a75e1600c52805f526020600c208054421115610b2b57636f5e88185f526004601cfd5b5f815550610b3881610d69565b50565b5f6040517fd623472500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610b76610d32565b8060601b610b8b57637448fbae5f526004601cfd5b610b9481610d69565b50565b5f63389a75e1600c52815f526020600c20549050919050565b5f7f42606236000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161480610c225750610c2182610e90565b5b9050919050565b5f6202a300905090565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf6011325f1b905090565b610c64610ef9565b15610cdc577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805415610c9e57630dc149f05f526004601cfd5b8160601b60601c9150811560ff1b82178155815f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a350610d2f565b8060601b60601c9050807fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392755805f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a35b50565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927543314610d67576382b429005f526004601cfd5b565b610d71610ef9565b15610dd6577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278160601b60601c91508181547f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a3811560ff1b8217815550610e2c565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278160601b60601c91508181547f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a3818155505b50565b5f60025f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16158015610e8957506004545f54105b9050919050565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f90565b5f604051905090565b5f80fd5b5f80fd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b610f4281610f0e565b8114610f4c575f80fd5b50565b5f81359050610f5d81610f39565b92915050565b5f60208284031215610f7857610f77610f06565b5b5f610f8584828501610f4f565b91505092915050565b5f8115159050919050565b610fa281610f8e565b82525050565b5f602082019050610fbb5f830184610f99565b92915050565b5f819050919050565b610fd381610fc1565b82525050565b5f602082019050610fec5f830184610fca565b92915050565b610ffb81610f0e565b82525050565b5f6020820190506110145f830184610ff2565b92915050565b5f80fd5b5f80fd5b5f80fd5b5f8083601f84011261103b5761103a61101a565b5b8235905067ffffffffffffffff8111156110585761105761101e565b5b60208301915083600182028301111561107457611073611022565b5b9250929050565b5f806020838503121561109157611090610f06565b5b5f83013567ffffffffffffffff8111156110ae576110ad610f0a565b5b6110ba85828601611026565b92509250509250929050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f611108826110c6565b61111281856110d0565b93506111228185602086016110e0565b61112b816110ee565b840191505092915050565b5f6020820190508181035f83015261114e81846110fe565b905092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61117f82611156565b9050919050565b61118f81611175565b82525050565b5f6020820190506111a85f830184611186565b92915050565b6111b781611175565b81146111c1575f80fd5b50565b5f813590506111d2816111ae565b92915050565b5f602082840312156111ed576111ec610f06565b5b5f6111fa848285016111c4565b91505092915050565b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61123d826110ee565b810181811067ffffffffffffffff8211171561125c5761125b611207565b5b80604052505050565b5f61126e610efd565b905061127a8282611234565b919050565b5f80fd5b61128c81610fc1565b8114611296575f80fd5b50565b5f813590506112a781611283565b92915050565b5f608082840312156112c2576112c1611203565b5b6112cc6080611265565b90505f6112db848285016111c4565b5f8301525060206112ee84828501610f4f565b602083015250604061130284828501611299565b604083015250606061131684828501611299565b60608301525092915050565b5f6080828403121561133757611336610f06565b5b5f611344848285016112ad565b91505092915050565b5f80fd5b5f67ffffffffffffffff82111561136b5761136a611207565b5b611374826110ee565b9050602081019050919050565b828183375f83830152505050565b5f6113a161139c84611351565b611265565b9050828152602081018484840111156113bd576113bc61134d565b5b6113c8848285611381565b509392505050565b5f82601f8301126113e4576113e361101a565b5b81356113f484826020860161138f565b91505092915050565b5f6040828403121561141257611411611203565b5b61141c6040611265565b90505f61142b848285016111c4565b5f83015250602082013567ffffffffffffffff81111561144e5761144d61127f565b5b61145a848285016113d0565b60208301525092915050565b5f6020828403121561147b5761147a610f06565b5b5f82013567ffffffffffffffff81111561149857611497610f0a565b5b6114a4848285016113fd565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6114e482610fc1565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203611516576115156114ad565b5b600182019050919050565b5f6040820190506115345f830185611186565b6115416020830184610fca565b9392505050565b5f81905092915050565b5f61155c826110c6565b6115668185611548565b93506115768185602086016110e0565b80840191505092915050565b5f61158d8284611552565b915081905092915050565b5f8160601b9050919050565b5f6115ae82611598565b9050919050565b5f6115bf826115a4565b9050919050565b6115d76115d282611175565b6115b5565b82525050565b5f819050919050565b6115f76115f282610fc1565b6115dd565b82525050565b5f61160882866115c6565b60148201915061161882856115c6565b60148201915061162882846115e6565b60208201915081905094935050505056fea2646970667358221220b2eaf9c13471aca540f7fc529cee2a18750d6416ad4073823d395c769da40c9764736f6c63430008190033",
  "deployedBytecode": "0x608060405260043610610129575f3560e01c8063a270a737116100aa578063e18e65081161006e578063e18e650814610389578063ea3d508a146103c5578063f04e283e146103ef578063f1c30ec01461040b578063f2fde38b14610447578063fee81cf41461046357610129565b8063a270a73714610293578063a4d66daf146102bd578063c63ff8dd146102e7578063c884ef8314610323578063dcc59b6f1461035f57610129565b8063439fab91116100f1578063439fab91146101f15780634e7165a21461021957806354d1f13d14610255578063715018a61461025f5780638da5cb5b1461026957610129565b806301ffc9a71461012d57806307621eca14610169578063228cb7331461019357806325692962146101bd57806328d6183b146101c7575b5f80fd5b348015610138575f80fd5b50610153600480360381019061014e9190610f63565b61049f565b6040516101609190610fa8565b60405180910390f35b348015610174575f80fd5b5061017d610518565b60405161018a9190610fd9565b60405180910390f35b34801561019e575f80fd5b506101a7610521565b6040516101b49190610fd9565b60405180910390f35b6101c5610527565b005b3480156101d2575f80fd5b506101db610578565b6040516101e89190611001565b60405180910390f35b3480156101fc575f80fd5b506102176004803603810190610212919061107b565b61059f565b005b348015610224575f80fd5b5061023f600480360381019061023a919061107b565b6106f7565b60405161024c9190611136565b60405180910390f35b61025d61074e565b005b610267610787565b005b348015610274575f80fd5b5061027d61079a565b60405161028a9190611195565b60405180910390f35b34801561029e575f80fd5b506102a76107c2565b6040516102b49190611195565b60405180910390f35b3480156102c8575f80fd5b506102d16107e7565b6040516102de9190610fd9565b60405180910390f35b3480156102f2575f80fd5b5061030d6004803603810190610308919061107b565b6107ed565b60405161031a9190610fa8565b60405180910390f35b34801561032e575f80fd5b50610349600480360381019061034491906111d8565b610aa1565b6040516103569190610fa8565b60405180910390f35b34801561036a575f80fd5b50610373610abe565b6040516103809190610fd9565b60405180910390f35b348015610394575f80fd5b506103af60048036038101906103aa919061107b565b610ac3565b6040516103bc9190610fa8565b60405180910390f35b3480156103d0575f80fd5b506103d9610aeb565b6040516103e69190611001565b60405180910390f35b610409600480360381019061040491906111d8565b610afd565b005b348015610416575f80fd5b50610431600480360381019061042c919061107b565b610b3b565b60405161043e9190610fa8565b60405180910390f35b610461600480360381019061045c91906111d8565b610b6e565b005b34801561046e575f80fd5b50610489600480360381019061048491906111d8565b610b97565b6040516104969190610fd9565b60405180910390f35b5f7f8085fa3e000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161480610511575061051082610bb0565b5b9050919050565b5f600154905090565b60015481565b5f610530610c29565b67ffffffffffffffff164201905063389a75e1600c52335f52806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d5f80a250565b5f7f8085fa3e00000000000000000000000000000000000000000000000000000000905090565b5f6105a8610c33565b905080546003825580156105da5760018160011c14303b106105d15763f92ee8a95f526004601cfd5b818160ff1b1b91505b505f83838101906105eb9190611322565b90505f8160400151148061060257505f8160600151145b15610639576040517ff92ee8a900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b805f015160035f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806020015160055f6101000a81548163ffffffff021916908360e01c0217905550806040015160018190555080606001516004819055506106bc33610c5c565b5080156106f2576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b505050565b60605f67ffffffffffffffff81111561071357610712611207565b5b6040519080825280601f01601f1916602001820160405280156107455781602001600182028036833780820191505090505b50905092915050565b63389a75e1600c52335f525f6020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c925f80a2565b61078f610d32565b6107985f610d69565b565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392754905090565b60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60045481565b5f6107f6610d32565b5f83838101906108069190611466565b9050610814815f0151610e2f565b61084a576040517f6247a84e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f8081548092919061085b906114da565b9190505550600160025f835f015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055505f60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660055f9054906101000a900460e01b835f0151600154604051602401610918929190611521565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040516109829190611582565b5f604051808303815f865af19150503d805f81146109bb576040519150601f19603f3d011682016040523d82523d5f602084013e6109c0565b606091505b50509050806109fb576040517f360e42e100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b815f015173ffffffffffffffffffffffffffffffffffffffff167f9ad2e7a4af16dceda9cce4274b2f59c328d8c012eb0e15eb5e1e73b7d8f264d360035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16845f0151600154604051602001610a71939291906115fd565b604051602081830303815290604052604051610a8d9190611136565b60405180910390a260019250505092915050565b6002602052805f5260405f205f915054906101000a900460ff1681565b5f5481565b5f808383810190610ad49190611466565b9050610ae2815f0151610e2f565b91505092915050565b60055f9054906101000a900460e01b81565b610b05610d32565b63389a75e1600c52805f526020600c208054421115610b2b57636f5e88185f526004601cfd5b5f815550610b3881610d69565b50565b5f6040517fd623472500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610b76610d32565b8060601b610b8b57637448fbae5f526004601cfd5b610b9481610d69565b50565b5f63389a75e1600c52815f526020600c20549050919050565b5f7f42606236000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161480610c225750610c2182610e90565b5b9050919050565b5f6202a300905090565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf6011325f1b905090565b610c64610ef9565b15610cdc577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805415610c9e57630dc149f05f526004601cfd5b8160601b60601c9150811560ff1b82178155815f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a350610d2f565b8060601b60601c9050807fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392755805f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a35b50565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927543314610d67576382b429005f526004601cfd5b565b610d71610ef9565b15610dd6577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278160601b60601c91508181547f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a3811560ff1b8217815550610e2c565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278160601b60601c91508181547f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a3818155505b50565b5f60025f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16158015610e8957506004545f54105b9050919050565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f90565b5f604051905090565b5f80fd5b5f80fd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b610f4281610f0e565b8114610f4c575f80fd5b50565b5f81359050610f5d81610f39565b92915050565b5f60208284031215610f7857610f77610f06565b5b5f610f8584828501610f4f565b91505092915050565b5f8115159050919050565b610fa281610f8e565b82525050565b5f602082019050610fbb5f830184610f99565b92915050565b5f819050919050565b610fd381610fc1565b82525050565b5f602082019050610fec5f830184610fca565b92915050565b610ffb81610f0e565b82525050565b5f6020820190506110145f830184610ff2565b92915050565b5f80fd5b5f80fd5b5f80fd5b5f8083601f84011261103b5761103a61101a565b5b8235905067ffffffffffffffff8111156110585761105761101e565b5b60208301915083600182028301111561107457611073611022565b5b9250929050565b5f806020838503121561109157611090610f06565b5b5f83013567ffffffffffffffff8111156110ae576110ad610f0a565b5b6110ba85828601611026565b92509250509250929050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f611108826110c6565b61111281856110d0565b93506111228185602086016110e0565b61112b816110ee565b840191505092915050565b5f6020820190508181035f83015261114e81846110fe565b905092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61117f82611156565b9050919050565b61118f81611175565b82525050565b5f6020820190506111a85f830184611186565b92915050565b6111b781611175565b81146111c1575f80fd5b50565b5f813590506111d2816111ae565b92915050565b5f602082840312156111ed576111ec610f06565b5b5f6111fa848285016111c4565b91505092915050565b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61123d826110ee565b810181811067ffffffffffffffff8211171561125c5761125b611207565b5b80604052505050565b5f61126e610efd565b905061127a8282611234565b919050565b5f80fd5b61128c81610fc1565b8114611296575f80fd5b50565b5f813590506112a781611283565b92915050565b5f608082840312156112c2576112c1611203565b5b6112cc6080611265565b90505f6112db848285016111c4565b5f8301525060206112ee84828501610f4f565b602083015250604061130284828501611299565b604083015250606061131684828501611299565b60608301525092915050565b5f6080828403121561133757611336610f06565b5b5f611344848285016112ad565b91505092915050565b5f80fd5b5f67ffffffffffffffff82111561136b5761136a611207565b5b611374826110ee565b9050602081019050919050565b828183375f83830152505050565b5f6113a161139c84611351565b611265565b9050828152602081018484840111156113bd576113bc61134d565b5b6113c8848285611381565b509392505050565b5f82601f8301126113e4576113e361101a565b5b81356113f484826020860161138f565b91505092915050565b5f6040828403121561141257611411611203565b5b61141c6040611265565b90505f61142b848285016111c4565b5f83015250602082013567ffffffffffffffff81111561144e5761144d61127f565b5b61145a848285016113d0565b60208301525092915050565b5f6020828403121561147b5761147a610f06565b5b5f82013567ffffffffffffffff81111561149857611497610f0a565b5b6114a4848285016113fd565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6114e482610fc1565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203611516576115156114ad565b5b600182019050919050565b5f6040820190506115345f830185611186565b6115416020830184610fca565b9392505050565b5f81905092915050565b5f61155c826110c6565b6115668185611548565b93506115768185602086016110e0565b80840191505092915050565b5f61158d8284611552565b915081905092915050565b5f8160601b9050919050565b5f6115ae82611598565b9050919050565b5f6115bf826115a4565b9050919050565b6115d76115d282611175565b6115b5565b82525050565b5f819050919050565b6115f76115f282610fc1565b6115dd565b82525050565b5f61160882866115c6565b60148201915061161882856115c6565b60148201915061162882846115e6565b60208201915081905094935050505056fea2646970667358221220b2eaf9c13471aca540f7fc529cee2a18750d6416ad4073823d395c769da40c9764736f6c63430008190033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "PointsIncentive",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<PointsIncentive$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/incentives/PointsIncentive.sol:PointsIncentive",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<PointsIncentive$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "PointsIncentive",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<PointsIncentive$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/incentives/PointsIncentive.sol:PointsIncentive",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<PointsIncentive$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "PointsIncentive",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<PointsIncentive$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/incentives/PointsIncentive.sol:PointsIncentive",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<PointsIncentive$Type["abi"]>>;
}
