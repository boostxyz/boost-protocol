// components/MainPane.tsx
import type { FC } from 'react';

import { Box, Divider, Flex, Heading, useColorMode } from '@chakra-ui/react';
import { useAccount, useConfig } from 'wagmi';
import { Box, Divider, Flex, Heading } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import styles from '@/styles/mainPane.module.css';

import {
  Address,
  Balance,
  BlockNumber,
  BoostCoreInfo,
  Chain,
  Status,
} from './components';

const MainPane: FC = () => {
  const { isConnected } = useAccount();

  return (
    <Box className={styles.container}>
      <Heading as="h2" fontSize={'2rem'} mb={10} className="text-shadow">
        Display Info
      </Heading>

      <Flex className={styles.content}>
        <Status />

        {isConnected && (
          <>
            <Address />
            <Chain />
            <Balance />
            <BlockNumber />
            <BoostCoreInfo />

            <Divider mb={5} />
          </>
        )}
      </Flex>
    </Box>
  );
};

export default MainPane;
