"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import ModalProvider from "./modal";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime
                // above 0 to avoid refetching immediately on the client
                staleTime: 60 * 1000,
            },
        },
    })
}
  
let browserQueryClient: QueryClient | undefined = undefined
  
function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: always make a new query client
        return makeQueryClient()
    } else {
        // Browser: make a new query client if we don't already have one
        if (!browserQueryClient) browserQueryClient = makeQueryClient()
        return browserQueryClient
    }
}

export default function Providers({ children }: {
    children: React.ReactNode;
}) {
    const queryClient = getQueryClient();

    return(
        <QueryClientProvider client={queryClient}>
            <ModalProvider>
                {children}
            </ModalProvider>
        </QueryClientProvider>
    )
}