'use client';

import { wagmiConfig } from '@/wagmi';
import {
  BoostCore,
  type BoostCoreConfig,
  BoostRegistry,
  type BoostRegistryConfig,
} from '@boostxyz/sdk';
import { createContext, useContext, useMemo } from 'react';
import {
  WagmiProviderNotFoundError,
  getAccount,
  useAccount,
  useConfig,
} from 'wagmi';

export interface IBoostContext {
  registry: BoostRegistry;
  core: BoostCore;
}

export const BoostContext = createContext<IBoostContext>({
  core: new BoostCore({ config: wagmiConfig }),
  registry: new BoostRegistry({ config: wagmiConfig }),
});

export type BoostProviderProps = {
  core?: Omit<BoostCoreConfig, 'config'>;
  registry?: Omit<BoostRegistryConfig, 'config'>;
};

export function useBoost() {
  return useContext(BoostContext);
}

export function BoostProvider({
  children,
  core,
  registry,
}: React.PropsWithChildren<BoostProviderProps>) {
  const config = useConfig();
  const account = useAccount(config);

  if (!config) throw new WagmiProviderNotFoundError();

  const value = useMemo(() => {
    console.log('!!!', config, account);
    return {
      core: new BoostCore({ ...core, config, account }),
      registry: new BoostRegistry({ ...registry, config, account }),
    };
  }, [config, account, core, registry]);

  return (
    <BoostContext.Provider value={value}>{children}</BoostContext.Provider>
  );
}
