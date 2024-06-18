import { SimpleBudget } from './SimpleBudget';
import { VestingBudget } from './VestingBudget';

export { SimpleBudget, VestingBudget };

export type Budget = SimpleBudget | VestingBudget;
