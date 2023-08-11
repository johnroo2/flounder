import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/layout/Layout'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Flounder</title>
      </Head>
      <Layout><Component {...pageProps} /></Layout>
    </>
  )
}
