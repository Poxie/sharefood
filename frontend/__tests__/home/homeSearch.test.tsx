import '@testing-library/jest-dom';
import { render, screen } from '@/test-utils';
import HomeSearch from '@/components/home/HomeSearch';
import messages from '@/messages/en.json';
import SendIcon from '@/assets/icons/SendIcon';

describe('HomeSearch', () => {
    beforeEach(() => {
        render(<HomeSearch />);
    })

    it('should render the search section', () => {
        const section = screen.getByTestId('home-search-section');
        expect(section).toBeInTheDocument();
    })
    it('should render the search heading', () => {
        const heading = screen.getByRole('heading', {
            level: 2,
            name: messages.home.search.title,
        });
        expect(heading).toBeInTheDocument();
    })
    it('should render the search input', () => {
        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', messages.home.search.placeholder);
    })
})