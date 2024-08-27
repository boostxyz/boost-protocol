import { wagmiConfig } from '@/wagmi';
import {
  BoostCore,
  type BoostCoreConfig,
  BoostRegistry,
  type BoostRegistryConfig,
} from '@boostxyz/sdk';
import { createContext, useContext, useMemo } from 'react';
import { WagmiProviderNotFoundError, useConfig } from 'wagmi';

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

  if (!config) throw new WagmiProviderNotFoundError();

  const value = useMemo(() => {
    return {
      core: new BoostCore({ ...core, config }),
      registry: new BoostRegistry({ ...registry, config }),
    };
  }, [config, core, registry]);

  return (
    <BoostContext.Provider value={value}>{children}</BoostContext.Provider>
  );
}
