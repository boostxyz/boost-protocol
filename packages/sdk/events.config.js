import BoostCoreEvents from '@boostxyz/evm/artifacts/contracts/BoostCore.sol/BoostCore.json' assert {
  type: 'json',
};
import ContractActionEvents from '@boostxyz/evm/artifacts/contracts/actions/ContractAction.sol/ContractAction.json' assert {
  type: 'json',
};
import ERC721MintActionEvents from '@boostxyz/evm/artifacts/contracts/actions/ERC721MintAction.sol/ERC721MintAction.json' assert {
  type: 'json',
};
import SimpleAllowListEvents from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleAllowList.sol/SimpleAllowList.json' assert {
  type: 'json',
};
import SimpleDenyListEvents from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleDenyList.sol/SimpleDenyList.json' assert {
  type: 'json',
};
import SimpleBudgetEvents from '@boostxyz/evm/artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget.json' assert {
  type: 'json',
};
import VestingBudgetEvents from '@boostxyz/evm/artifacts/contracts/budgets/VestingBudget.sol/VestingBudget.json' assert {
  type: 'json',
};
import AllowListIncentiveEvents from '@boostxyz/evm/artifacts/contracts/incentives/AllowListIncentive.sol/AllowListIncentive.json' assert {
  type: 'json',
};
import CGDAIncentiveEvents from '@boostxyz/evm/artifacts/contracts/incentives/CGDAIncentive.sol/CGDAIncentive.json' assert {
  type: 'json',
};
import ERC20IncentiveEvents from '@boostxyz/evm/artifacts/contracts/incentives/ERC20Incentive.sol/ERC20Incentive.json' assert {
  type: 'json',
};
import ERC1155IncentiveEvents from '@boostxyz/evm/artifacts/contracts/incentives/ERC1155Incentive.sol/ERC1155Incentive.json' assert {
  type: 'json',
};
import PointsIncentiveEvents from '@boostxyz/evm/artifacts/contracts/incentives/PointsIncentive.sol/PointsIncentive.json' assert {
  type: 'json',
};
import SignerValidatorEvents from '@boostxyz/evm/artifacts/contracts/validators/SignerValidator.sol/SignerValidator.json' assert {
  type: 'json',
};

function extractEvents(json) {
  const { abi } = json;
  return abi.reduce((acc, curr) => {
    if (curr.type === 'event') {
      acc[curr.name] = curr;
    }
    return acc;
  }, {});
}

// To avoid event parsing at runtime, define at build time
export default {
  'import.meta.env.BoostCoreAbiEvents': extractEvents(BoostCoreEvents),
  'import.meta.env.ContractActionAbiEvents':
    extractEvents(ContractActionEvents),
  'import.meta.env.ERC721MintActionAbiEvents': extractEvents(
    ERC721MintActionEvents,
  ),
  'import.meta.env.SimpleAllowListAbiEvents': extractEvents(
    SimpleAllowListEvents,
  ),
  'import.meta.env.SimpleDenyListAbiEvents':
    extractEvents(SimpleDenyListEvents),
  'import.meta.env.SimpleBudgetAbiEvents': extractEvents(SimpleBudgetEvents),
  'import.meta.env.VestingBudgetAbiEvents': extractEvents(VestingBudgetEvents),
  'import.meta.env.AllowListIncentiveAbiEvents': extractEvents(
    AllowListIncentiveEvents,
  ),
  'import.meta.env.CGDAIncentiveAbiEvents': extractEvents(CGDAIncentiveEvents),
  'import.meta.env.ERC20IncentiveAbiEvents':
    extractEvents(ERC20IncentiveEvents),
  'import.meta.env.ERC1155IncentiveAbiEvents': extractEvents(
    ERC1155IncentiveEvents,
  ),
  'import.meta.env.PointsIncentiveAbiEvents': extractEvents(
    PointsIncentiveEvents,
  ),
  'import.meta.env.SignerValidatorAbiEvents': extractEvents(
    SignerValidatorEvents,
  ),
};
