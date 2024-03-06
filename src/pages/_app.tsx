import "@/styles/globals.css";
import { theme } from "@/utils/theme";
import { ChakraProvider } from '@chakra-ui/react';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import type { AppProps } from "next/app";

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />;
      </QueryClientProvider>
    </ChakraProvider>
  )
}
