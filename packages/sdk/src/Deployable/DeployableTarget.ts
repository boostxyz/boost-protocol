import {
  Deployable,
  type DeployableOptions,
  type DeployablePayloadOrAddress,
} from './Deployable';

export class DeployableTarget<Payload = unknown> extends Deployable<Payload> {
  readonly isBase: boolean;
  constructor(
    options: DeployableOptions,
    payload: DeployablePayloadOrAddress<Payload>,
    isBase = false,
  ) {
    super(options, payload);
    this.isBase = isBase;
  }
}
