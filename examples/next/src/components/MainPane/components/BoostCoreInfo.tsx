import type { FC } from 'react';

import { InfoText } from '@/components';
import { useBoost } from '@/components/BoostContext';
import { useQuery } from '@tanstack/react-query';

const BoostCoreInfo: FC = (): JSX.Element => {
  const { core } = useBoost();
  const { data: count } = useQuery({
    queryKey: ['getBoostCount'],
    queryFn: async () => {
      return await core?.getBoostCount();
    },
  });

  const { data: protocolFee } = useQuery({
    queryKey: ['protocolFee'],
    queryFn: async () => {
      return await core?.protocolFee();
    },
  });

  const { data: protocolFeeReceiver } = useQuery({
    queryKey: ['protocolFeeReceiver'],
    queryFn: async () => {
      return await core?.protocolFeeReceiver();
    },
  });

  const { data: claimFee } = useQuery({
    queryKey: ['claimFee'],
    queryFn: async () => {
      return await core?.claimFee();
    },
  });

  return (
    <>
      <InfoText label="Total Boosts" value={String(count)} />
      <InfoText label="Protocol Fee" value={String(protocolFee)} />
      <InfoText
        label="Protocol Fee Receiver"
        value={String(protocolFeeReceiver)}
      />
      <InfoText label="Claim Fee" value={String(claimFee)} />
    </>
  );
};

export default BoostCoreInfo;
