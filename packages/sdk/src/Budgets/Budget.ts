import {
  prepareERC1155Transfer,
  prepareFungibleTransfer,
} from '../../../evm/artifacts';
import { SimpleBudget } from './SimpleBudget';
import { VestingBudget } from './VestingBudget';

export { SimpleBudget, VestingBudget };

export { prepareERC1155Transfer, prepareFungibleTransfer };

export type Budget = SimpleBudget | VestingBudget;
