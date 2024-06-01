import '@testing-library/jest-dom';
import { render, screen } from '@/test-utils';
import Home from '@/components/home';

describe('Home', () => {
    beforeEach(() => {
        render(<Home />)
    })

    it('should render the main home component', () => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
    })
    it('should render the hero section', () => {
        const section = screen.getByTestId('home-hero-section');
        expect(section).toBeInTheDocument();
    })
    it('should render the divider section', () => {
        const divider = screen.getByTestId('home-divider');
        expect(divider).toBeInTheDocument();
        expect(divider).toHaveAttribute('src', '/home-divider.svg');
    })
})