import '@testing-library/jest-dom';
import SignupModal from '@/modals/sign-up';
import { render, screen } from '@/test-utils';
import messages from '@/messages/en.json';

describe('SignupModal', () => {
    beforeEach(() => {
        render(<SignupModal />);
    })

    it('should render a modal', () => {
        const modal = screen.getByTestId('modal');
        expect(modal).toBeInTheDocument();
    })
    it('should render the modal header', () => {
        const header = screen.getByTestId('modal-header');
        expect(header).toBeInTheDocument();
        expect(header).toHaveTextContent(messages.modal.signup.title);
    })
    it('should render the signup form', () => {
        const form = screen.getByTestId('signup-form');
        expect(form).toBeInTheDocument();
    })
    it('should render the username input', () => {
        const input = screen.getByPlaceholderText(messages.modal.signup.placeholder.username);
        expect(input).toBeInTheDocument();
    })
    it('should render the password input', () => {
        const input = screen.getByPlaceholderText(messages.modal.signup.placeholder.password);
        expect(input).toBeInTheDocument();
    })
    it('should render the confirm password input', () => {
        const input = screen.getByPlaceholderText(messages.modal.signup.placeholder.confirmPassword);
        expect(input).toBeInTheDocument();
    })
    it('should render the submit button', () => {
        const button = screen.getByRole('button', { name: messages.modal.signup.submit });
        expect(button).toBeInTheDocument();
    })
})