import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import NavbarOptions from '@/components/navbar/NavbarOptions';

describe('NavbarOptions', () => {
    beforeEach(() => {
        render(<NavbarOptions />);
    })

    it('should render the log in button', () => {
        const loginButton = screen.getByText('Log in');
        expect(loginButton).toBeInTheDocument();
    })
    it('should render the sign up button', () => {
        const signupButton = screen.getByText('Sign up');
        expect(signupButton).toBeInTheDocument();
    })
})