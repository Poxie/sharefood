import '@testing-library/jest-dom';
import { render, screen } from '@/test-utils';
import HomeHeroOptions from '@/components/home/HomeHeroOptions';
import messages from '@/messages/en.json';

describe('HomeHeroOptions', () => {
    beforeEach(() => {
        render(<HomeHeroOptions />)
    })
    
    it('should render the hero options', () => {
        const options = screen.getByTestId('home-hero-options');
        expect(options).toBeInTheDocument();
    })
    it('should render the primary button', () => {
        const button = screen.getByRole('link', { name: messages.home.hero.buttons.primary });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('href', '/explore');
    })
    it('should render the secondary button', () => {
        const button = screen.getByRole('link', { name: messages.home.hero.buttons.secondary });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('href', '/share');
    })
})