# Boost Known Signatures

A registry of known function and event signatures, their 32 byte selectors, and [AbiEvents](https://viem.sh/docs/glossary/types#abievent) or [AbiFunctions](https://viem.sh/docs/glossary/types#abifunction)

## How to use this package

When you're creating a Boost and building out [action steps](https://boost-protocol.vercel.app/interfaces/ActionStep.html) for use with the [Event Actions](https://boost-protocol.vercel.app/classes/EventAction.html), you'll need to specify the function or event's [signature](https://boost-protocol.vercel.app/interfaces/ActionStep.html#signature) so the protocol knows how to validate that an action has occured in a transaction, and allow a claim to occur.

In order to simplify applications that would otherwise need to know the hex encoded 4 byte function selector, or 32 byte event selector, and their associated ABI items, you can instead use this library to save on code and complexity.

```ts
// you can import both events and functions registries
import { events, functions } from '@boostxyz/signatures'
// ...or individually
import events from '@boostxyz/signatures/events'
import functions from '@boostxyz/signatures/functions'

// both events and functions manifests have the following interface:
type eventsOrFunctionsRegistry = { abi: Record<(Hex | string), AbiItem>, selectors: Record<string, Hex> }
// where string keys are the signature ie: Transfer(address indexed,address indexed,uint256 indexed)

// the event signature we'll be using to compose the action
const knownSignature = "Transfer(address indexed,address indexed,uint256 indexed)"
const selector = events.selectors[knownSignature] // 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
const abiItem = events.abi[knownSignature] // {name:"Transfer",type:"event",inputs:[{type:"address",indexed:true},{type:"address",indexed:true},{type:"uint256",indexed:true}]}

// now you have everything you need to construct your event action
const filterOnReceiver: ActionStep = {
  chainid: 8453,
  signature: selector,
  signatureType: SignatureType.EVENT, // We're working with an event
  targetContract: targetContract, // Address of the contract emitting the `Transfer` event
  // We want to target the 'receiver' property on the Transfer event
  actionParameter: {
    filterType: FilterType.EQUAL, // Filter to check for equality
    fieldType: PrimitiveType.ADDRESS, // The field we're filtering is an address
    fieldIndex: 1, // We want to target the second argument (index 1) of the event signature
    filterData: '0xc0ffee', // Filtering based on the recipient's address
  },
};
```

If you've used a function or event signature from `@boostxyz/signatures` in the creation of your Boost, then you don't have to do anything else for validation to work.

Otherwise, if you're supplying a custom event signature unknown to `@boostxyz/signatures` and running your own validation using the SDK, you'll need to additionally supply your own `AbiEvent` to validation so event logs can be correctly pulled off transactions.

```ts
await boostCore.validateActionSteps({
    knownEvents: {
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef': {
            name: "Transfer",
            type: "event",
            inputs: [
                { type: "address", indexed: true },
                { type: "address", indexed: true },
                { type: "uint256", indexed: true }
            ]
        }
    }
})
```

For more detailed examples, see [sample use cases](https://github.com/boostxyz/boost-protocol/tree/main/examples)

## Contributing new signatures

To integrate your contracts with the Boost V2 Protocol:

- [Fork the `boostxyz/boost-protocol` repository](https://github.com/boostxyz/boost-protocol/fork)
- Add your function or event signature to the [correct manifest JSON file](https://github.com/boostxyz/boost-protocol/tree/main/packages/signatures/manifests) following the existing formatting and conventions.
  - Entries starting with `//` are treated as comments so you can distinguish a block of related signatures
- Commit your modified manifest file
- [Create a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)

The Boost Protocol team will review the submission and promptly release a new version of the `@boostxyz/signatures` package so you can continue your Boost Protocol integrations.
