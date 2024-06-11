import '@testing-library/jest-dom';
import SignupModal from '@/modals/sign-up';
import { QueryWrapper, fireEvent, render, renderHook, screen, waitFor } from '@/test-utils';
import messages from '@/messages/en.json';
import { User, UserCreateResponse } from '@/types';
import * as Modals from '@/contexts/modal';
import LoginModal from '@/modals/login';
import { UseMutationResult } from '@tanstack/react-query';
import  * as useCreateUser from '@/hooks/users/useCreateUser';

type MutationOverrides = UseMutationResult<UserCreateResponse, Error, {
    username: string;
    password: string;
}, unknown>

describe('SignupModal', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    const renderWithQueryClient = () => {
        render(
            <QueryWrapper>
                <SignupModal />
            </QueryWrapper>
        )
    }

    describe('Structure and validation', () => {
        describe('Rendering the form', () => {
            beforeEach(() => {
                renderWithQueryClient();
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
                expect(input).toHaveAttribute('type', 'password');
            })
            it('should render the confirm password input', () => {
                const input = screen.getByPlaceholderText(messages.modal.signup.placeholder.confirmPassword);
                expect(input).toBeInTheDocument();
                expect(input).toHaveAttribute('type', 'password');
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

        describe('Switching to login modal', () => {
            it('should render a button to switch to the login modal', () => {
                renderWithQueryClient();

                const button = screen.getByRole('button', { name: messages.modal.signup.switchToLogin });
                expect(button).toBeInTheDocument();
            })
            it('should call the switchToLogin function when the button is clicked', () => {
                const switchToLoginFn = jest.fn();
                jest.spyOn(Modals, 'useModal').mockReturnValue({
                    setModal: switchToLoginFn,
                    closeModal: jest.fn(),
                });

                renderWithQueryClient();

                const button = screen.getByRole('button', { name: messages.modal.signup.switchToLogin });
                fireEvent.click(button);

                expect(switchToLoginFn).toHaveBeenCalledWith(<LoginModal />);
            })
        })
    })

    describe('Mutation', () => {
        const mockUseCreateUser = (overrides: Partial<MutationOverrides>) => {
            jest.spyOn(useCreateUser, 'default').mockReturnValue({
                ...overrides,
            } as MutationOverrides);
        }

        it('should call the mutate function when the form is submitted', async () => {
            const createUserFunction = jest.fn();
            mockUseCreateUser({ mutateAsync: createUserFunction });
    
            renderWithQueryClient();
            
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
            mockUseCreateUser({ isPending: true });
    
            renderWithQueryClient();
    
            const loading = screen.getByText(messages.modal.signup.submitting);
    
            expect(loading).toBeInTheDocument();
        })
        it('should have a disabled submit button when the form is submitting', () => {
            mockUseCreateUser({ isPending: true });
    
            renderWithQueryClient();
    
            const button = screen.getByRole('button', { name: messages.modal.signup.submitting });
    
            expect(button).toBeDisabled();
        })
        it('should show an error if the form submission fails', () => {
            const errorMessage = 'An error occurred';
            mockUseCreateUser({ isError: true, error: new Error(errorMessage) });
    
            renderWithQueryClient();
    
            const error = screen.getByText(errorMessage);
    
            expect(error).toBeInTheDocument();
        })
    })
})