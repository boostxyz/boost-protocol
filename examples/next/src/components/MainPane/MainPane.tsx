// components/MainPane.tsx
import type { FC } from 'react';

import { Box, Divider, Flex, Heading, useColorMode } from '@chakra-ui/react';
import { useAccount, useConfig } from 'wagmi';

import styles from '@/styles/mainPane.module.css';

import { BoostCore } from '@boostxyz/sdk';
import {
  Address,
  Balance,
  BlockNumber,
  Chain,
  SignMessage,
  Status,
  TransferNative,
} from './components';

const MainPane: FC = () => {
  const { isConnected } = useAccount();
  const { colorMode } = useColorMode();
  const config = useConfig();

  const _core = new BoostCore({ config });

  console.log(_core);

  return (
    <Box
      className={styles.container}
      border={
        colorMode === 'light' ? 'none' : '1px solid rgba(152, 161, 192, 0.24)'
      }
    >
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

            <Divider mb={5} />

            <Flex
              w={'100%'}
              display={'flex'}
              justifyContent={'space-around'}
              flexWrap={'wrap'}
              gap={5}
            >
              <SignMessage />
              <TransferNative />
            </Flex>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default MainPane;
