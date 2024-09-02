import { PassthroughAuth } from './PassthroughAuth';

export { PassthroughAuth };

/**
 * A union type representing all valid protocol Auth implementations
 *
 * @export
 * @typedef {Auth}
 */
export type Auth = PassthroughAuth;
