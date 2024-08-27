import { useBoost } from '@/components/BoostContext';
import { useQuery } from '@tanstack/react-query';

export function useBoostCount() {
  const { core } = useBoost();
  const res = useQuery({
    queryKey: ['getBoostCount'],
    queryFn: async () => {
      return await core.getBoostCount();
    },
    refetchInterval: 1000,
    refetchIntervalInBackground: false,
  });

  return res;
}
