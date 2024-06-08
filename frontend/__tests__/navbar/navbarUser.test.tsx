import '@testing-library/jest-dom'
import NavbarUser from "@/components/navbar/NavbarUser"
import mockUser from "@/test-constants"
import { render, screen } from "@/test-utils"

describe('NavbarUser', () => {
    it('should render the username of the user', () => {
        const user = mockUser();

        render(<NavbarUser user={user} />)

        expect(screen.getByText(user.username)).toBeInTheDocument();
    })
})