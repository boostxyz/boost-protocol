/// <reference types="vite/client" />

import type { Address } from 'viem';

interface ImportMetaEnv {
  readonly VITE_BOOST_CORE_ADDRESS: Address;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
