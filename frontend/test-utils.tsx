import React, { ReactElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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

export const QueryWrapper = ({ children, defaultClient }: { 
    children: React.ReactNode;
    defaultClient?: QueryClient
}) => {
    const queryClient = defaultClient || new QueryClient();
    
    return(
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export function updateInput(input: HTMLElement, text: string) {
    fireEvent.change(input, { target: { value: text } });
}
export function getButton(text: string) {
    return screen.getByRole('button', { name: text });
}