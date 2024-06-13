// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface SimpleDenyList$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "SimpleDenyList",
  "sourceName": "contracts/allowlists/SimpleDenyList.sol",
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
      "name": "LengthMismatch",
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
      "name": "NotInitializing",
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
          "internalType": "address",
          "name": "user_",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "isAllowed",
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
      "inputs": [
        {
          "internalType": "address[]",
          "name": "users_",
          "type": "address[]"
        },
        {
          "internalType": "bool[]",
          "name": "denied_",
          "type": "bool[]"
        }
      ],
      "name": "setDenied",
      "outputs": [],
      "stateMutability": "nonpayable",
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
  "bytecode": "0x608060405234801561000f575f80fd5b5061001f3361003260201b60201c565b61002d61010e60201b60201c565b6101a7565b61004061017a60201b60201c565b156100b8577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392780541561007a57630dc149f05f526004601cfd5b8160601b60601c9150811560ff1b82178155815f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a35061010b565b8060601b60601c9050807fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392755805f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a35b50565b5f61011d61017e60201b60201c565b9050805460018116156101375763f92ee8a95f526004601cfd5b8160c01c808260011c14610175578060011b8355806020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b505050565b5f90565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf6011325f1b905090565b610faf806101b45f395ff3fe60806040526004361061009b575f3560e01c8063715018a611610063578063715018a61461013f5780638da5cb5b14610149578063e3f756de14610173578063f04e283e146101af578063f2fde38b146101cb578063fee81cf4146101e75761009b565b806301ffc9a71461009f578063141973b0146100db5780632569296214610103578063439fab911461010d57806354d1f13d14610135575b5f80fd5b3480156100aa575f80fd5b506100c560048036038101906100c091906109ad565b610223565b6040516100d291906109f2565b60405180910390f35b3480156100e6575f80fd5b5061010160048036038101906100fc9190610ac1565b61029c565b005b61010b6103a5565b005b348015610118575f80fd5b50610133600480360381019061012e9190610b94565b6103f6565b005b61013d610513565b005b61014761054c565b005b348015610154575f80fd5b5061015d61055f565b60405161016a9190610c1e565b60405180910390f35b34801561017e575f80fd5b5061019960048036038101906101949190610c61565b610587565b6040516101a691906109f2565b60405180910390f35b6101c960048036038101906101c49190610cbe565b6105db565b005b6101e560048036038101906101e09190610cbe565b610619565b005b3480156101f2575f80fd5b5061020d60048036038101906102089190610cbe565b610642565b60405161021a9190610d01565b60405180910390f35b5f7fe2089f79000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061029557506102948261065b565b5b9050919050565b6102a46106d4565b8181905084849050146102e3576040517fff633a3800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f5b8484905081101561039e5782828281811061030357610302610d1a565b5b90506020020160208101906103189190610d71565b5f8087878581811061032d5761032c610d1a565b5b90506020020160208101906103429190610cbe565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff02191690831515021790555080806001019150506102e5565b5050505050565b5f6103ae61070b565b67ffffffffffffffff164201905063389a75e1600c52335f52806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d5f80a250565b5f6103ff610715565b905080546003825580156104315760018160011c14303b106104285763f92ee8a95f526004601cfd5b818160ff1b1b91505b505f8084848101906104439190610f1f565b915091506104508261073e565b5f5b81518110156104d65760015f8084848151811061047257610471610d1a565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055508080600101915050610452565b505050801561050e576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b505050565b63389a75e1600c52335f525f6020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c925f80a2565b6105546106d4565b61055d5f610814565b565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392754905090565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff161590509392505050565b6105e36106d4565b63389a75e1600c52805f526020600c20805442111561060957636f5e88185f526004601cfd5b5f81555061061681610814565b50565b6106216106d4565b8060601b61063657637448fbae5f526004601cfd5b61063f81610814565b50565b5f63389a75e1600c52815f526020600c20549050919050565b5f7f42606236000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806106cd57506106cc826108da565b5b9050919050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927543314610709576382b429005f526004601cfd5b565b5f6202a300905090565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf6011325f1b905090565b610746610943565b156107be577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392780541561078057630dc149f05f526004601cfd5b8160601b60601c9150811560ff1b82178155815f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a350610811565b8060601b60601c9050807fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392755805f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a35b50565b61081c610943565b15610881577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278160601b60601c91508181547f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a3811560ff1b82178155506108d7565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278160601b60601c91508181547f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a3818155505b50565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f90565b5f604051905090565b5f80fd5b5f80fd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61098c81610958565b8114610996575f80fd5b50565b5f813590506109a781610983565b92915050565b5f602082840312156109c2576109c1610950565b5b5f6109cf84828501610999565b91505092915050565b5f8115159050919050565b6109ec816109d8565b82525050565b5f602082019050610a055f8301846109e3565b92915050565b5f80fd5b5f80fd5b5f80fd5b5f8083601f840112610a2c57610a2b610a0b565b5b8235905067ffffffffffffffff811115610a4957610a48610a0f565b5b602083019150836020820283011115610a6557610a64610a13565b5b9250929050565b5f8083601f840112610a8157610a80610a0b565b5b8235905067ffffffffffffffff811115610a9e57610a9d610a0f565b5b602083019150836020820283011115610aba57610ab9610a13565b5b9250929050565b5f805f8060408587031215610ad957610ad8610950565b5b5f85013567ffffffffffffffff811115610af657610af5610954565b5b610b0287828801610a17565b9450945050602085013567ffffffffffffffff811115610b2557610b24610954565b5b610b3187828801610a6c565b925092505092959194509250565b5f8083601f840112610b5457610b53610a0b565b5b8235905067ffffffffffffffff811115610b7157610b70610a0f565b5b602083019150836001820283011115610b8d57610b8c610a13565b5b9250929050565b5f8060208385031215610baa57610ba9610950565b5b5f83013567ffffffffffffffff811115610bc757610bc6610954565b5b610bd385828601610b3f565b92509250509250929050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610c0882610bdf565b9050919050565b610c1881610bfe565b82525050565b5f602082019050610c315f830184610c0f565b92915050565b610c4081610bfe565b8114610c4a575f80fd5b50565b5f81359050610c5b81610c37565b92915050565b5f805f60408486031215610c7857610c77610950565b5b5f610c8586828701610c4d565b935050602084013567ffffffffffffffff811115610ca657610ca5610954565b5b610cb286828701610b3f565b92509250509250925092565b5f60208284031215610cd357610cd2610950565b5b5f610ce084828501610c4d565b91505092915050565b5f819050919050565b610cfb81610ce9565b82525050565b5f602082019050610d145f830184610cf2565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b610d50816109d8565b8114610d5a575f80fd5b50565b5f81359050610d6b81610d47565b92915050565b5f60208284031215610d8657610d85610950565b5b5f610d9384828501610d5d565b91505092915050565b5f610da682610bdf565b9050919050565b610db681610d9c565b8114610dc0575f80fd5b50565b5f81359050610dd181610dad565b92915050565b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b610e1d82610dd7565b810181811067ffffffffffffffff82111715610e3c57610e3b610de7565b5b80604052505050565b5f610e4e610947565b9050610e5a8282610e14565b919050565b5f67ffffffffffffffff821115610e7957610e78610de7565b5b602082029050602081019050919050565b5f610e9c610e9784610e5f565b610e45565b90508083825260208201905060208402830185811115610ebf57610ebe610a13565b5b835b81811015610ee85780610ed48882610c4d565b845260208401935050602081019050610ec1565b5050509392505050565b5f82601f830112610f0657610f05610a0b565b5b8135610f16848260208601610e8a565b91505092915050565b5f8060408385031215610f3557610f34610950565b5b5f610f4285828601610dc3565b925050602083013567ffffffffffffffff811115610f6357610f62610954565b5b610f6f85828601610ef2565b915050925092905056fea2646970667358221220ddfce1aec2fb0f8d518874929c00497c2d81c727e9711b3c7324436f014ef3ef64736f6c63430008190033",
  "deployedBytecode": "0x60806040526004361061009b575f3560e01c8063715018a611610063578063715018a61461013f5780638da5cb5b14610149578063e3f756de14610173578063f04e283e146101af578063f2fde38b146101cb578063fee81cf4146101e75761009b565b806301ffc9a71461009f578063141973b0146100db5780632569296214610103578063439fab911461010d57806354d1f13d14610135575b5f80fd5b3480156100aa575f80fd5b506100c560048036038101906100c091906109ad565b610223565b6040516100d291906109f2565b60405180910390f35b3480156100e6575f80fd5b5061010160048036038101906100fc9190610ac1565b61029c565b005b61010b6103a5565b005b348015610118575f80fd5b50610133600480360381019061012e9190610b94565b6103f6565b005b61013d610513565b005b61014761054c565b005b348015610154575f80fd5b5061015d61055f565b60405161016a9190610c1e565b60405180910390f35b34801561017e575f80fd5b5061019960048036038101906101949190610c61565b610587565b6040516101a691906109f2565b60405180910390f35b6101c960048036038101906101c49190610cbe565b6105db565b005b6101e560048036038101906101e09190610cbe565b610619565b005b3480156101f2575f80fd5b5061020d60048036038101906102089190610cbe565b610642565b60405161021a9190610d01565b60405180910390f35b5f7fe2089f79000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061029557506102948261065b565b5b9050919050565b6102a46106d4565b8181905084849050146102e3576040517fff633a3800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f5b8484905081101561039e5782828281811061030357610302610d1a565b5b90506020020160208101906103189190610d71565b5f8087878581811061032d5761032c610d1a565b5b90506020020160208101906103429190610cbe565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff02191690831515021790555080806001019150506102e5565b5050505050565b5f6103ae61070b565b67ffffffffffffffff164201905063389a75e1600c52335f52806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d5f80a250565b5f6103ff610715565b905080546003825580156104315760018160011c14303b106104285763f92ee8a95f526004601cfd5b818160ff1b1b91505b505f8084848101906104439190610f1f565b915091506104508261073e565b5f5b81518110156104d65760015f8084848151811061047257610471610d1a565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055508080600101915050610452565b505050801561050e576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b505050565b63389a75e1600c52335f525f6020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c925f80a2565b6105546106d4565b61055d5f610814565b565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392754905090565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff161590509392505050565b6105e36106d4565b63389a75e1600c52805f526020600c20805442111561060957636f5e88185f526004601cfd5b5f81555061061681610814565b50565b6106216106d4565b8060601b61063657637448fbae5f526004601cfd5b61063f81610814565b50565b5f63389a75e1600c52815f526020600c20549050919050565b5f7f42606236000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806106cd57506106cc826108da565b5b9050919050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927543314610709576382b429005f526004601cfd5b565b5f6202a300905090565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf6011325f1b905090565b610746610943565b156107be577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392780541561078057630dc149f05f526004601cfd5b8160601b60601c9150811560ff1b82178155815f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a350610811565b8060601b60601c9050807fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392755805f7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a35b50565b61081c610943565b15610881577fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278160601b60601c91508181547f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a3811560ff1b82178155506108d7565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278160601b60601c91508181547f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a3818155505b50565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f90565b5f604051905090565b5f80fd5b5f80fd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61098c81610958565b8114610996575f80fd5b50565b5f813590506109a781610983565b92915050565b5f602082840312156109c2576109c1610950565b5b5f6109cf84828501610999565b91505092915050565b5f8115159050919050565b6109ec816109d8565b82525050565b5f602082019050610a055f8301846109e3565b92915050565b5f80fd5b5f80fd5b5f80fd5b5f8083601f840112610a2c57610a2b610a0b565b5b8235905067ffffffffffffffff811115610a4957610a48610a0f565b5b602083019150836020820283011115610a6557610a64610a13565b5b9250929050565b5f8083601f840112610a8157610a80610a0b565b5b8235905067ffffffffffffffff811115610a9e57610a9d610a0f565b5b602083019150836020820283011115610aba57610ab9610a13565b5b9250929050565b5f805f8060408587031215610ad957610ad8610950565b5b5f85013567ffffffffffffffff811115610af657610af5610954565b5b610b0287828801610a17565b9450945050602085013567ffffffffffffffff811115610b2557610b24610954565b5b610b3187828801610a6c565b925092505092959194509250565b5f8083601f840112610b5457610b53610a0b565b5b8235905067ffffffffffffffff811115610b7157610b70610a0f565b5b602083019150836001820283011115610b8d57610b8c610a13565b5b9250929050565b5f8060208385031215610baa57610ba9610950565b5b5f83013567ffffffffffffffff811115610bc757610bc6610954565b5b610bd385828601610b3f565b92509250509250929050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610c0882610bdf565b9050919050565b610c1881610bfe565b82525050565b5f602082019050610c315f830184610c0f565b92915050565b610c4081610bfe565b8114610c4a575f80fd5b50565b5f81359050610c5b81610c37565b92915050565b5f805f60408486031215610c7857610c77610950565b5b5f610c8586828701610c4d565b935050602084013567ffffffffffffffff811115610ca657610ca5610954565b5b610cb286828701610b3f565b92509250509250925092565b5f60208284031215610cd357610cd2610950565b5b5f610ce084828501610c4d565b91505092915050565b5f819050919050565b610cfb81610ce9565b82525050565b5f602082019050610d145f830184610cf2565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b610d50816109d8565b8114610d5a575f80fd5b50565b5f81359050610d6b81610d47565b92915050565b5f60208284031215610d8657610d85610950565b5b5f610d9384828501610d5d565b91505092915050565b5f610da682610bdf565b9050919050565b610db681610d9c565b8114610dc0575f80fd5b50565b5f81359050610dd181610dad565b92915050565b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b610e1d82610dd7565b810181811067ffffffffffffffff82111715610e3c57610e3b610de7565b5b80604052505050565b5f610e4e610947565b9050610e5a8282610e14565b919050565b5f67ffffffffffffffff821115610e7957610e78610de7565b5b602082029050602081019050919050565b5f610e9c610e9784610e5f565b610e45565b90508083825260208201905060208402830185811115610ebf57610ebe610a13565b5b835b81811015610ee85780610ed48882610c4d565b845260208401935050602081019050610ec1565b5050509392505050565b5f82601f830112610f0657610f05610a0b565b5b8135610f16848260208601610e8a565b91505092915050565b5f8060408385031215610f3557610f34610950565b5b5f610f4285828601610dc3565b925050602083013567ffffffffffffffff811115610f6357610f62610954565b5b610f6f85828601610ef2565b915050925092905056fea2646970667358221220ddfce1aec2fb0f8d518874929c00497c2d81c727e9711b3c7324436f014ef3ef64736f6c63430008190033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "SimpleDenyList",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<SimpleDenyList$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/allowlists/SimpleDenyList.sol:SimpleDenyList",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<SimpleDenyList$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "SimpleDenyList",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<SimpleDenyList$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/allowlists/SimpleDenyList.sol:SimpleDenyList",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<SimpleDenyList$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "SimpleDenyList",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<SimpleDenyList$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/allowlists/SimpleDenyList.sol:SimpleDenyList",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<SimpleDenyList$Type["abi"]>>;
}