import type { Config } from '@wagmi/core';
import type { Address } from 'viem';

export class Contract {
  protected _config: Config;
  protected _address: Address | undefined;

  constructor(config: Config, address: Address | undefined) {
    this._config = config;
    this._address = address;
  }

  public get address() {
    return this._address;
  }

  public at(address: Address) {
    this._address = address;
    return this;
  }

  public withConfig(config: Config) {
    this._config = config;
    return this;
  }
}
