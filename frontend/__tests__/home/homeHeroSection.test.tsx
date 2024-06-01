import '@testing-library/jest-dom';
import HomeHeroSection from '@/components/home/HomeHeroSection';
import { screen } from '@testing-library/react';
import { render } from '@/test-utils';
import messages from '@/messages/en.json';

describe('HomeHeroSection', () => {
    beforeEach(() => {
        render(<HomeHeroSection />)
    })

    it('should render the hero section', () => {
        const section = screen.getByTestId('home-hero-section');
        expect(section).toBeInTheDocument();
    })
    it('should render the primary texts', () => {
        const heading = screen.getByRole('heading', {
            level: 1, 
            name: messages.home.hero.title,
        });
        const paragraph = screen.getByText(messages.home.hero.description);

        expect(heading).toBeInTheDocument();
        expect(paragraph).toBeInTheDocument();
    })
    it('should render the hero buttons', () => {
        const buttons = screen.getByTestId('home-hero-buttons');
        expect(buttons).toBeInTheDocument();
    })
})