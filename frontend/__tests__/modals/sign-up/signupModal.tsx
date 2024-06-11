import '@testing-library/jest-dom';
import SignupModal from '@/modals/sign-up';
import { QueryWrapper, fireEvent, getButton, render, renderHook, screen, updateInput, waitFor } from '@/test-utils';
import messages from '@/messages/en.json';
import { User, UserCreateResponse } from '@/types';
import * as Modals from '@/contexts/modal';
import LoginModal from '@/modals/login';
import { UseMutationResult } from '@tanstack/react-query';
import  * as useCreateUser from '@/hooks/users/useCreateUser';
import * as useRefetchQueries from '@/hooks/react-query/useRefetchQueries';

type MutationOverrides = UseMutationResult<UserCreateResponse, Error, {
    username: string;
    password: string;
}, unknown>

describe('SignupModal', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    const renderWithQueryClient = () => {
        render(
            <QueryWrapper>
                <SignupModal />
            </QueryWrapper>
        )
    }

    const getFormElements = () => {
        const usernameInput = screen.getByPlaceholderText(messages.modal.signup.placeholder.username);
        const passwordInput = screen.getByPlaceholderText(messages.modal.signup.placeholder.password);
        const confirmPasswordInput = screen.getByPlaceholderText(messages.modal.signup.placeholder.confirmPassword);
        const submitButton = getButton(messages.modal.signup.submit);

        return { usernameInput, passwordInput, confirmPasswordInput, submitButton };
    }

    const submitValidForm = () => {
        const { usernameInput, passwordInput, confirmPasswordInput, submitButton } = getFormElements();

        const username = 'username';
        const password = 'password';

        updateInput(usernameInput, username);
        updateInput(passwordInput, password);
        updateInput(confirmPasswordInput, password);

        fireEvent.click(submitButton);

        return { username, password };
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
                const { usernameInput } = getFormElements();
                expect(usernameInput).toBeInTheDocument();
            })
            it('should render the password input', () => {
                const { passwordInput } = getFormElements();
                expect(passwordInput).toBeInTheDocument();
                expect(passwordInput).toHaveAttribute('type', 'password');
            })
            it('should render the confirm password input', () => {
                const { confirmPasswordInput } = getFormElements();
                expect(confirmPasswordInput).toBeInTheDocument();
                expect(confirmPasswordInput).toHaveAttribute('type', 'password');
            })
            it('should render the submit button', () => {
                const { submitButton } = getFormElements()
                expect(submitButton).toBeInTheDocument();
            })
            it('should should show an error if the form is submitted with empty fields', () => {
                const { submitButton } = getFormElements()
                fireEvent.click(submitButton);
        
                const error = screen.getByText(messages.error.emptyFields);
        
                expect(error).toBeInTheDocument();
            })
            it('should show an error if the passwords do not match', () => {
                const { usernameInput, passwordInput, confirmPasswordInput, submitButton } = getFormElements();
        
                updateInput(usernameInput, 'test');
                updateInput(passwordInput, 'password');
                updateInput(confirmPasswordInput, 'password123');
        
                fireEvent.click(submitButton);
        
                const error = screen.getByText(messages.error.passwordsDontMatch);
        
                expect(error).toBeInTheDocument();
            })
        })

        describe('Switching to login modal', () => {
            it('should render a button to switch to the login modal', () => {
                renderWithQueryClient();

                const button = getButton(messages.modal.signup.switchToLogin);
                expect(button).toBeInTheDocument();
            })
            it('should call the switchToLogin function when the button is clicked', () => {
                const switchToLoginFn = jest.fn();
                jest.spyOn(Modals, 'useModal').mockReturnValue({
                    setModal: switchToLoginFn,
                    closeModal: jest.fn(),
                });

                renderWithQueryClient();

                const button = getButton(messages.modal.signup.switchToLogin);
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
            
            const { username, password } = submitValidForm();
    
            expect(createUserFunction).toHaveBeenCalledWith({ username, password });
        })
        it('should show loading state when the form is submitted', () => {
            mockUseCreateUser({ isPending: true });
    
            renderWithQueryClient();
    
            const loading = getButton(messages.modal.signup.submitting);
    
            expect(loading).toBeInTheDocument();
        })
        it('should have a disabled submit button when the form is submitting', () => {
            mockUseCreateUser({ isPending: true });
    
            renderWithQueryClient();
    
            const button = getButton(messages.modal.signup.submitting);
    
            expect(button).toBeDisabled();
        })
        it('should show an error if the form submission fails', async () => {
            const error = new Error('Username is already taken.');
            mockUseCreateUser({ mutateAsync: jest.fn().mockRejectedValue(error) });
    
            renderWithQueryClient();
    
            submitValidForm();

            await waitFor(() => expect(screen.getByText(error.message)).toBeInTheDocument());
        })
        it('should close the modal when the form submission is successful', async () => {
            const closeModalFn = jest.fn();
            jest.spyOn(Modals, 'useModal').mockReturnValue({
                setModal: jest.fn(),
                closeModal: closeModalFn,
            });

            jest.spyOn(useRefetchQueries, 'default').mockReturnValue(jest.fn());

            mockUseCreateUser({ mutateAsync: jest.fn() });

            renderWithQueryClient();

            submitValidForm();

            await waitFor(() => expect(closeModalFn).toHaveBeenCalled());
        })
        it('should run the refetch function to get the current user after successful form submission', async () => {
            const refetchFn = jest.fn();
            jest.spyOn(useRefetchQueries, 'default').mockReturnValue(refetchFn);

            mockUseCreateUser({ mutateAsync: jest.fn() });

            renderWithQueryClient();

            submitValidForm();

            await waitFor(() => expect(refetchFn).toHaveBeenCalledWith(['current-user']));
        })
    })
})