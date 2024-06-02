import '@testing-library/jest-dom'
import { render, screen } from '@/test-utils';
import NavbarOptions from '@/components/navbar/NavbarOptions';
import * as ModalContext from '@/contexts/modal';
import SignupModal from '@/modals/sign-up';

describe('NavbarOptions', () => {
    const closeMock = jest.fn();
    const setModalMock = jest.fn();
    jest.spyOn(ModalContext, 'useModal')
        .mockImplementation(() => ({ 
            setModal: setModalMock,
            closeModal: closeMock,
        }));
        
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
    it('should open the sign up modal when the sign up button is clicked', () => {
        const signupButton = screen.getByText('Sign up');
        signupButton.click();

        expect(setModalMock).toHaveBeenCalledWith(<SignupModal />);
    })
})