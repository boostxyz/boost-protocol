import { SimpleAllowList } from './SimpleAllowList';
import { SimpleDenyList } from './SimpleDenyList';

export { SimpleDenyList, SimpleAllowList };

export type AllowList = SimpleAllowList | SimpleDenyList;
