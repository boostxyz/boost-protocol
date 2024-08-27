import type { FC } from 'react';

import { InfoText } from '@/components';
import { useBoost } from '@/components/BoostContext';
import { useBoostCount } from '@/hooks/useBoostCount';
import { useQuery } from '@tanstack/react-query';
import { zeroAddress } from 'viem';

const BoostCoreInfo: FC = (): JSX.Element => {
  const { core } = useBoost();

  const { data: count } = useBoostCount();
  const {
    data: { protocolFee, protocolFeeReceiver, claimFee },
  } = useQuery({
    queryKey: ['getBoostInfo'],
    initialData: {
      protocolFee: 0n,
      protocolFeeReceiver: zeroAddress,
      claimFee: 0n,
    },
    queryFn: async () => {
      const [protocolFee, protocolFeeReceiver, claimFee] = await Promise.all([
        core.protocolFee(),
        core.protocolFeeReceiver(),
        core.claimFee(),
      ]);
      return {
        protocolFee,
        protocolFeeReceiver,
        claimFee,
      };
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
