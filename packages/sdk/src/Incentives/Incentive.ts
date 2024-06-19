import { AllowListIncentive } from './AllowListIncentive';
import { CGDAIncentive } from './CGDAIncentive';
import { ERC20Incentive } from './ERC20Incentive';
import { ERC1155Incentive } from './ERC1155Incentive';
import { PointsIncentive } from './PointsIncentive';

export {
  AllowListIncentive,
  CGDAIncentive,
  ERC20Incentive,
  ERC1155Incentive,
  PointsIncentive,
};

export type Incentive =
  | AllowListIncentive
  | CGDAIncentive
  | ERC20Incentive
  | ERC1155Incentive
  | PointsIncentive;
