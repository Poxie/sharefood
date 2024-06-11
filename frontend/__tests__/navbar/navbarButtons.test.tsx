import '@testing-library/jest-dom'
import { fireEvent, getButton, render, screen } from '@/test-utils';
import NavbarButtons from '@/components/navbar/NavbarButtons';
import * as ModalContext from '@/contexts/modal';
import SignupModal from '@/modals/sign-up';
import LoginModal from '@/modals/login';
import messages from '@/messages/en.json';

describe('NavbarButtons', () => {
    const closeMock = jest.fn();
    const setModalMock = jest.fn();
    
    beforeEach(() => {
        jest.spyOn(ModalContext, 'useModal')
            .mockImplementation(() => ({ 
                setModal: setModalMock,
                closeModal: closeMock,
            }));

        render(<NavbarButtons />);
    })
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    const getLoginButton = () => getButton(messages.navbar.buttons.login);
    const getSignupButton = () => getButton(messages.navbar.buttons.signup);

    it('should render the log in button', () => {
        const loginButton = getLoginButton();
        expect(loginButton).toBeInTheDocument();
    })
    it('should render the sign up button', () => {
        const signupButton = getSignupButton();
        expect(signupButton).toBeInTheDocument();
    })
    it('should open the sign up modal when the sign up button is clicked', () => {
        const signupButton = getSignupButton();
        fireEvent.click(signupButton);

        expect(setModalMock).toHaveBeenCalledWith(<SignupModal />);
    })
    it('should open the login modal when the log in button is clicked', () => {
        const loginButton = getLoginButton();
        fireEvent.click(loginButton);

        expect(setModalMock).toHaveBeenCalledWith(<LoginModal />);
    })
})