import { Button, ConfigProvider, theme } from 'antd'
import { ChakraProvider } from '@chakra-ui/react'
import { BaseLayout } from '@components/layout/BaseLayout'
import { HotToastConfig } from '@components/layout/HotToastConfig'
import { env } from '@config/environment'
import { getDeployments } from '@deployments/deployments'
import { cache } from '@emotion/css'
import { CacheProvider } from '@emotion/react'
import { Inconsolata } from '@next/font/google'
import { getSubstrateChain, SubstrateChain, UseInkathonProvider } from '@scio-labs/use-inkathon'
import GlobalStyles from '@styles/GlobalStyles'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import { useState } from 'react'

// Router Loading Animation with @tanem/react-nprogress
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

// TODO Google Fonts via @next/font
const inconsolata = Inconsolata({
  subsets: ['latin'],
})

function MyApp({ Component, pageProps }: AppProps) {
  const [defaultChain] = useState(getSubstrateChain(env.defaultChain) as SubstrateChain)

  return (
    <>
      {/* TODO SEO */}
      <DefaultSeo
        dangerouslySetAllPagesToNoFollow={!env.isProduction}
        dangerouslySetAllPagesToNoIndex={!env.isProduction}
        defaultTitle="Donation dApp" // TODO
        titleTemplate="%s | Donation dApp" // TODO
        description="Substrate-based Smart Contract & DApp Development Boilerplate" // TODO
        openGraph={{
          type: 'website',
          locale: 'en',
          url: env.url,
          site_name: 'Donation dApp', // TODO
          images: [
            {
              url: `${env.url}/images/cover.jpg`, // TODO
              width: 1200,
              height: 675,
            },
          ],
        }}
        twitter={{
          handle: '@scio_xyz', // TODO
        }}
      />

      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/* Set Font Variables */}
        <style>{`
          :root {
            --font-inconsolata: ${inconsolata.style.fontFamily}, 'Inconsolata';
          }
        `}</style>
      </Head>

      <UseInkathonProvider
        appName="Donation dApp" // TODO
        connectOnInit={true}
        defaultChain={defaultChain}
        deployments={getDeployments()}
      >
        <CacheProvider value={cache}>
          <ChakraProvider>
            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                  colorPrimary: 'rgb(230 0 122)',
                },
              }}
            >
              <GlobalStyles />
              <BaseLayout>
                <Component {...pageProps} />
              </BaseLayout>
              <HotToastConfig />
            </ConfigProvider>
          </ChakraProvider>
        </CacheProvider>
      </UseInkathonProvider>
    </>
  )
}

export default MyApp
