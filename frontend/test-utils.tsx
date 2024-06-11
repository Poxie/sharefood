import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import messages from './messages/en.json';
import { NextIntlClientProvider } from 'next-intl';
import ModalProvider from './contexts/modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return(
        <NextIntlClientProvider messages={messages} locale='en'>
            <ModalProvider>
                {children}
            </ModalProvider>
        </NextIntlClientProvider>
    )
}

const customRender = (
    ui: ReactElement, 
    options?: any
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render }; 

export const QueryWrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    
    return(
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}