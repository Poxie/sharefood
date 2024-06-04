import '@testing-library/jest-dom';
import SignupModal from '@/modals/sign-up';
import { fireEvent, render, renderHook, screen, waitFor } from '@/test-utils';
import messages from '@/messages/en.json';
import * as useCreateUser from '@/hooks/users/useCreateUser';
import mockUser from '@/test-constants';

jest.mock('@/hooks/users/useCreateUser', () => jest.fn().mockReturnValue({
    createUser: jest.fn(),
    isPending: false,
    isError: false,
}));

describe('SignupModal', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('Structure and validation', () => {
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
        it('should should show an error if the form is submitted with empty fields', () => {
            const button = screen.getByRole('button', { name: messages.modal.signup.submit });
            fireEvent.click(button);
    
            const error = screen.getByText(messages.error.emptyFields);
    
            expect(error).toBeInTheDocument();
        })
        it('should show an error if the passwords do not match', () => {
            const username = screen.getByPlaceholderText(messages.modal.signup.placeholder.username);
            const password = screen.getByPlaceholderText(messages.modal.signup.placeholder.password);
            const confirmPassword = screen.getByPlaceholderText(messages.modal.signup.placeholder.confirmPassword);
    
            fireEvent.change(username, { target: { value: 'test' } });
            fireEvent.change(password, { target: { value: 'password' } });
            fireEvent.change(confirmPassword, { target: { value: 'password123' } });
    
            const button = screen.getByRole('button', { name: messages.modal.signup.submit });
            fireEvent.click(button);
    
            const error = screen.getByText(messages.error.passwordsDontMatch);
    
            expect(error).toBeInTheDocument();
        })
    })

    describe('Mutation', () => {
        it('should call the mutate function when the form is submitted', async () => {
            const createUserFunction = jest.fn();
            jest.spyOn(useCreateUser, 'default').mockReturnValue(({
                createUser: createUserFunction,
                isPending: false,
                isError: false,
                data: undefined,
                isSuccess: true,
            }));
    
            render(<SignupModal />);
            
            const username = screen.getByPlaceholderText(messages.modal.signup.placeholder.username);
            const password = screen.getByPlaceholderText(messages.modal.signup.placeholder.password);
            const confirmPassword = screen.getByPlaceholderText(messages.modal.signup.placeholder.confirmPassword);
    
            const usernameValue = 'test';
            const passwordValue = 'password';
            fireEvent.change(username, { target: { value: usernameValue } });
            fireEvent.change(password, { target: { value: passwordValue } });
            fireEvent.change(confirmPassword, { target: { value: passwordValue } });
    
            const button = screen.getByRole('button', { name: messages.modal.signup.submit });
            fireEvent.click(button);
    
            expect(createUserFunction).toHaveBeenCalledWith({ username: usernameValue, password: passwordValue });
        })
        it('should show loading state when the form is submitted', () => {
            jest.spyOn(useCreateUser, 'default').mockReturnValue(({
                createUser: jest.fn(),
                isPending: true,
                isError: false,
                data: undefined,
                isSuccess: false,
            }));
    
            render(<SignupModal />);
    
            const loading = screen.getByText(messages.modal.signup.submitting);
    
            expect(loading).toBeInTheDocument();
        })
    })
})