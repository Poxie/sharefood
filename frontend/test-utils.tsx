import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import messages from './messages/en.json';
import { NextIntlClientProvider } from 'next-intl';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return(
        <NextIntlClientProvider messages={messages} locale='en'>
            {children}
        </NextIntlClientProvider>
    )
}

const customRender = (
    ui: ReactElement, 
    options?: any
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render }; 