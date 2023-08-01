import { Html, Head, Main, NextScript } from 'next/document'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Layout from '@/components/layout/Layout'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <body>
        <Layout>
          <Main/>
          <NextScript />
        </Layout>
      </body>
      </LocalizationProvider>
    </Html>
  )
}
