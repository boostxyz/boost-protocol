// components/MainPane.tsx
import { type FC, useMemo } from 'react';

import { useBoostCount } from '@/hooks/useBoostCount';
import { Box, Flex, HStack, Heading } from '@chakra-ui/react';

const BoostList: FC = () => {
  const { data: count } = useBoostCount();

  const boosts = useMemo(() => {
    return Array.from({ length: Number(count) }, (_, i) => i);
  }, [count]);

  return (
    <Box>
      <HStack>
        {boosts.map((_, i) => (
          <Flex key={i} w="full" p={4} bg="gray.100" borderRadius="md">
            <Heading size="md">Boost {i + 1}</Heading>
          </Flex>
        ))}
      </HStack>
    </Box>
  );
};

export default BoostList;
