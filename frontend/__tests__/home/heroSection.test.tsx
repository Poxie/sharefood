import '@testing-library/jest-dom';
import HomeHeroSection from '@/components/home/HeroSection';
import { render, screen } from '@testing-library/react';

describe('HeroSection', () => {
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
            name: "The best place to share food",
        });
        const paragraph = screen.getByText("Share, discover, and enjoy a world of recipes on our platform! Upload your culinary creations, explore new dishes, and connect with fellow food enthusiasts. Join our community today and elevate your cooking experience!");

        expect(heading).toBeInTheDocument();
        expect(paragraph).toBeInTheDocument();
    })
})