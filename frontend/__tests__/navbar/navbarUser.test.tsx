import '@testing-library/jest-dom'
import NavbarUser from "@/components/navbar/NavbarUser"
import mockUser from "@/test-constants"
import { render, screen } from "@/test-utils"

describe('NavbarUser', () => {
    const user = mockUser();
    beforeEach(() => {
        render(<NavbarUser user={user} />)
    })
    
    it('should render the user component', () => {
        const userComponent = screen.getByTestId('navbar-user');
        expect(userComponent).toBeInTheDocument();
    })
    it('should redirect to profile page when clicked', () => {
        const profileLink = screen.getByRole('link', { name: user.username });

        expect(profileLink).toBeInTheDocument();
        expect(profileLink).toHaveAttribute('href', `/profile/${user.id}`);
    })
})