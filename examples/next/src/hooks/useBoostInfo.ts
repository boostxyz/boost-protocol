import { useBoost } from '@/components/BoostContext';
import { useQuery } from '@tanstack/react-query';
import { zeroAddress } from 'viem';

export function useBoostInfo() {
  const { core } = useBoost();
  return useQuery({
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
}
