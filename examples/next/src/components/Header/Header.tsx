'use client';
import type { FC } from 'react';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

import logo from '../../../public/img/boost-logo.png';

const Header: FC = () => {
  return (
    <header>
      <menu>
        <li>
          <Image src={logo.src} alt="logo" width={160} height={45} />{' '}
        </li>
        <li>
          <ConnectButton />
        </li>
      </menu>
    </header>
  );
};

export default Header;
