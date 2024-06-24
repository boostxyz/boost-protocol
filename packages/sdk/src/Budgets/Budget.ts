import { prepareERC1155Transfer, prepareFungibleTransfer } from '@boostxyz/evm';
import { SimpleBudget } from './SimpleBudget';
import { VestingBudget } from './VestingBudget';

export { SimpleBudget, VestingBudget };

export { prepareERC1155Transfer, prepareFungibleTransfer };

export type Budget = SimpleBudget | VestingBudget;
