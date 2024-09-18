import type { FC } from 'react';

import { InfoText } from '@/components';
import { useBoostCount } from '@/hooks/useBoostCount';
import { useBoostInfo } from '@/hooks/useBoostInfo';

const BoostCoreInfo: FC = (): JSX.Element => {
  const { data: count } = useBoostCount();
  const {
    data: { protocolFee, protocolFeeReceiver, claimFee },
  } = useBoostInfo();

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
