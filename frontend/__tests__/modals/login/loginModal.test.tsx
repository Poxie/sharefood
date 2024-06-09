import '@testing-library/jest-dom';
import LoginModal from '@/modals/login';
import { render, screen } from '@/test-utils';
import messages from '@/messages/en.json';

describe('LoginModal', () => {
    beforeEach(() => {
        render(<LoginModal />)
    })

    it('should render the login modal', () => {
        const modal = screen.getByTestId('modal');
        expect(modal).toBeInTheDocument();
    })
    it('should render the header text', () => {
        const header = screen.getByText(messages.modal.login.title);
        expect(header).toBeInTheDocument();
    })
    it('should render the login form inputs', () => {
        const username = screen.getByPlaceholderText(messages.modal.login.placeholder.username);
        const password = screen.getByPlaceholderText(messages.modal.login.placeholder.password);

        expect(username).toBeInTheDocument();
        expect(password).toBeInTheDocument();
    })
    it('should render the login button', () => {
        const button = screen.getByRole('button', { name: messages.modal.login.submit });
        expect(button).toBeInTheDocument();
    })
})