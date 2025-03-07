# Boost SDK

Typescript devkit for interacting with the Boost V2 Protocol

[![Documentation](https://img.shields.io/badge/documentation-typedoc-blue)](boost-protocol.vercel.app)

## Visit [https://docs.boost.xyz/v2/boost-sdk/overview](https://docs.boost.xyz) for docs, guides, API and more!


## Event Actions

### Tuple Handling
When a field is declared as TUPLE in the `PrimitiveType` of an `EventAction`, we unpack its bit-packed fieldIndex to drill down through each nested level of the tuple. Each sub-index occupies 6 bits (values 0–63), and a sub-index of 63 is treated as a terminator—signaling the end of further drilling. Once we locate the leaf in the nested structure, the code infers the final (non-tuple) PrimitiveType by reading the ABI definition (address, uint256, string, etc.) at that leaf node.

1. We can store up to 5 sub-indexes (each 6 bits) in one fieldIndex.
1. As we parse a TUPLE, we read those sub-indexes one by one, traversing each nested tuple parameter in the ABI.
1. At the final, non-tuple component, we derive the actual PrimitiveType (e.g., ADDRESS, UINT, BYTES, or STRING) by inspecting that component’s type in the ABI definition.
