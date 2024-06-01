import '@testing-library/jest-dom';
import { render, screen } from '@/test-utils';
import HomeHeroButtons from '@/components/home/HomeHeroButtons';
import messages from '@/messages/en.json';

describe('HomeHeroButtons', () => {
    beforeEach(() => {
        render(<HomeHeroButtons />)
    })
    
    it('should render the hero buttons', () => {
        const buttons = screen.getByTestId('home-hero-buttons');
        expect(buttons).toBeInTheDocument();
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