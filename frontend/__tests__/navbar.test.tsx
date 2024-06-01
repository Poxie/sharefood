import '@testing-library/jest-dom'
import Navbar from "@/components/navbar"
import { render, screen } from "@testing-library/react"

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(() => '/'),
}))
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        return <img {...props} />
    },
}))
  
describe('Navbar', () => {
    it('should render the navbar', () => {
        render(<Navbar />)

        const navbar = screen.getByRole('navigation');

        expect(navbar).toBeInTheDocument();
    })
    it('should contain the logo with a link to home', () => {
        render(<Navbar />)

        const link = screen.getByTestId('navbar-logo');

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/');

        const logo = screen.getByRole('img');
        expect(link).toContainElement(logo);
        expect(logo).toHaveAttribute('src', '/logo.svg');
    })
})