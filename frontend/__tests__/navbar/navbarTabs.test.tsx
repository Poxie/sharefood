import '@testing-library/jest-dom'
import { render, screen } from '@/test-utils';
import NavbarTabs from '@/components/navbar/NavbarTabs';
import messages from '@/messages/en.json';

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(() => '/'),
}))

describe('NavbarTabs', () => {
    beforeEach(() => {
        render(<NavbarTabs />);
    })

    it('should render the list of tabs', () => {
        const tabs = screen.getByTestId('navbar-tabs');

        expect(tabs).toBeInTheDocument();
    })
    describe.each([
        { text: messages.navbar.tabs.home, href: '/' },
        { text: messages.navbar.tabs.explore, href: '/explore' },
    ])('should render the tabs correctly', ({ text, href }) => {
        describe(`when the tab is ${text}`, () => {
            it('renders the correct text', () => {
                const tab = screen.getByRole('link', { name: text });
                expect(tab).toBeInTheDocument();
            })
            it('renders the correct href', () => {
                const tab = screen.getByRole('link', { name: text });
                expect(tab).toHaveAttribute('href', href);
            })
        })
    })
})