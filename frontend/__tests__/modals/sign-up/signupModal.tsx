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
})