import type { ReactNode } from 'react';

import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';

import '@rainbow-me/rainbowkit/styles.css';
import { Header } from '@/components';
import Head from 'next/head';
import { Providers } from './providers';

const noto_sans = Noto_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Boost SDK Examples',
  applicationName: 'Boost SDK Examples',
  description: 'Boost SDK examples using the Next.js framework',
  authors: {
    name: 'Sam McCord',
    url: 'https://github.com/rabbitholegg/boost-protocol',
  },
  icons: 'favicon.ico',
  manifest: 'site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={noto_sans.className}>
        <Providers>
          <div className="layout-simple">
            <Header />
            <main>{children}</main>
            <aside>
              <nav>
                <ul></ul>
              </nav>
            </aside>
            <footer></footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
