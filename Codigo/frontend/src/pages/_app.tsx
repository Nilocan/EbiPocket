import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';
import { SessionProvider } from '~/contexts/session';
import Head from 'next/head';
import { OrderProvider } from '~/contexts/order';
import OrderDisplay from '~/components/OrderDisplay';
import Header from '~/components/Header';

const inter = Inter({ subsets: ['latin'] });
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Ebi Pocket</title>
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'light',
          fontFamily: inter.style.fontFamily,
        }}
      >
        <Notifications />
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <OrderProvider>
              <Header />
              <main
                className={`flex h-full flex-col items-center justify-between p-8 ${inter.className}`}
              >
                <Component {...pageProps} />
                <OrderDisplay />
              </main>
            </OrderProvider>
          </SessionProvider>
        </QueryClientProvider>
      </MantineProvider>
    </>
  );
}
