import '@testing-library/jest-dom'
import { render, screen } from '@/test-utils';
import NavbarTabs, { NAVBAR_TABS } from '@/components/navbar/NavbarTabs';

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(() => '/'),
}))

describe('NavbarTabs', () => {
    it('should render the tabs', () => {
        render(<NavbarTabs />);

        const list = screen.getByTestId('navbar-tabs');
        const tabs = screen.getAllByRole('listitem');

        expect(list).toBeInTheDocument();
        tabs.forEach((tab, index) => {
            expect(tab).toHaveTextContent(NAVBAR_TABS[index].text);
        })
    })
})