import { ContractAction } from './ContractAction';
import { ERC721MintAction } from './ERC721MintAction';

export { ContractAction, ERC721MintAction };

export type Action = ContractAction | ERC721MintAction;
