export class DeployableParametersUnspecifiedError extends Error {
  constructor() {
    super(
      'Implementing class did not properly override the `buildParameters` method',
    );
  }
}
