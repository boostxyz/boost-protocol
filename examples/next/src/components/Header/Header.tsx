'use client';
import type { FC } from 'react';

import { HStack, Heading } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

import { useWindowSize } from '@/hooks/useWindowSize';

import logo from '../../../public/img/boost-logo.png';

const Header: FC = () => {
  const { isTablet } = useWindowSize();

  return (
    <header>
      <menu>
        <li>
          <Image src={logo.src} alt="logo" width={160} height={45} />{' '}
          {!isTablet && (
            <Heading as="h1" fontSize={'1.5rem'} className="text-shadow">
              Inspector
            </Heading>
          )}
        </li>
        <li>
          <ConnectButton />
        </li>
      </menu>
    </header>
  );
};

export default Header;
