import '@testing-library/jest-dom'
import { render, screen } from '@/test-utils'
import Navbar from "@/components/navbar"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(() => '/'),
}))

const queryClient = new QueryClient();
const Wrapper = ({ children }: {
    children: React.ReactNode;
}) => {
    return(
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

describe('Navbar', () => {
    beforeEach(() => {
        render(
            <Wrapper>
                <Navbar />
            </Wrapper>
        );
    })

    it('should render the navbar', () => {
        const navbar = screen.getByRole('navigation');

        expect(navbar).toBeInTheDocument();
    })
    it('should contain the logo with a link to home', () => {
        const link = screen.getByTestId('navbar-logo');

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/');

        const logo = screen.getByRole('img');
        expect(link).toContainElement(logo);
        expect(logo).toHaveAttribute('src', '/logo.svg');
    })

    it('should render the navbar tabs', () => {
        const tabs = screen.getByTestId('navbar-tabs');
        expect(tabs).toBeInTheDocument();
    })
    it('should render the navbar options', () => {
        const options = screen.getByTestId('navbar-options');
        expect(options).toBeInTheDocument();
    })
})