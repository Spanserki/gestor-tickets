import "@/styles/globals.css";
import type { AppProps } from "next/app";
import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from "@/utils/theme";
import { QueryClientProvider, QueryClient } from 'react-query'

const queryclient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryclient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />;
      </ChakraProvider>
    </QueryClientProvider>
  )
}
