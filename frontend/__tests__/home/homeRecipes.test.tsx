import HomeRecipes from '@/components/home/HomeRecipes';
import { render, screen } from '@/test-utils';
import '@testing-library/jest-dom';

describe('HomeRecipes', () => {
    beforeEach(() => {
        render(<HomeRecipes />);
    })

    it('should render the recipes section', () => {
        const section = screen.getByTestId('home-recipes-section');
        expect(section).toBeInTheDocument();
    })
    it('should render the search section', () => {
        const search = screen.getByTestId('home-search-section');
        expect(search).toBeInTheDocument();
    })
})