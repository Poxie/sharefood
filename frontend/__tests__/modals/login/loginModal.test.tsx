import '@testing-library/jest-dom';
import LoginModal from '@/modals/login';
import { QueryWrapper, fireEvent, getButton, render, screen, updateInput, waitFor } from '@/test-utils';
import messages from '@/messages/en.json';
import * as useLoginUser from '@/hooks/users/useLoginUser';
import { UseMutationResult } from '@tanstack/react-query';
import { User } from '@/types';
import * as Modals from '@/contexts/modal';
import SignupModal from '@/modals/sign-up';
import * as useCreateUser from '@/hooks/users/useCreateUser';
import mockUser from '@/test-constants';
import * as useRefetchQueries from '@/hooks/react-query/useRefetchQueries';

type MutationOverrides = UseMutationResult<User, Error, {
    username: string;
    password: string;
}>

describe('LoginModal', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    const renderWithQueryClient = () => {
        render(
            <QueryWrapper>
                <LoginModal />
            </QueryWrapper>
        );
    }

    const getFormElements = () => {
        const usernameInput = screen.getByPlaceholderText(messages.modal.login.placeholder.username);
        const passwordInput = screen.getByPlaceholderText(messages.modal.login.placeholder.password);
        const submitButton = getButton(messages.modal.login.submit);

        return { usernameInput, passwordInput, submitButton };
    }

    const submitValidForm = () => {
        const { usernameInput, passwordInput } = getFormElements();

        const username = 'username';
        const password = 'password';

        updateInput(usernameInput, username);
        updateInput(passwordInput, password);

        const button = getButton(messages.modal.login.submit)
        fireEvent.click(button);

        return { username, password };
    }

    describe('Structure and validation', () => {
        beforeEach(() => {
            jest.spyOn(useLoginUser, 'default').mockReturnValue({} as MutationOverrides);
        })

        describe('Rendering the form', () => {
            beforeEach(() => {
                renderWithQueryClient();
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
                const { usernameInput, passwordInput } = getFormElements();
        
                expect(usernameInput).toBeInTheDocument();
                expect(passwordInput).toBeInTheDocument();
                expect(passwordInput).toHaveAttribute('type', 'password');
            })
            it('should render the login button', () => {
                const { submitButton } = getFormElements();
                expect(submitButton).toBeInTheDocument();
            })
            describe.each([
                { username: '', password: '' },
                { username: '', password: 'password' },
                { username: 'username', password: '' },
            ])('should show an error if the form is submitted with empty fields', ({ username, password }) => {
                it('should show an error', () => {
                    const { usernameInput, passwordInput, submitButton } = getFormElements();
        
                    updateInput(usernameInput, username);
                    updateInput(passwordInput, password);
        
                    fireEvent.click(submitButton);
        
                    const error = screen.getByText(messages.error.emptyFields);
        
                    expect(error).toBeInTheDocument();
                })
            })
        })

        describe('Switching to the signup modal', () => {
            it('should render a button to switch to the signup modal', () => {
                renderWithQueryClient();

                const button = getButton(messages.modal.login.switchToSignup);

                expect(button).toBeInTheDocument();
            })
            it('should open the signup modal when the switch button is clicked', () => {
                jest.spyOn(useCreateUser, 'default').mockReturnValue({} as any);
                
                const setModalFn = jest.fn();
                jest.spyOn(Modals, 'useModal').mockReturnValue({ 
                    setModal: setModalFn,
                    closeModal: jest.fn(),
                });
                
                renderWithQueryClient();
    
                const button = getButton(messages.modal.login.switchToSignup);
                fireEvent.click(button);
    
                expect(setModalFn).toHaveBeenCalledWith(<SignupModal />);
            })
        })
    })

    describe('Mutations', () => {
        const mockUseLoginUser = (overrides: Partial<MutationOverrides>) => {
            jest.spyOn(useLoginUser, 'default').mockReturnValue({
                ...overrides,
            } as MutationOverrides);
        }

        it('should call the login mutation on form submission', async () => {
            const mutateFn = jest.fn();
            mockUseLoginUser({ mutateAsync: mutateFn });

            renderWithQueryClient();

            const { username, password } = submitValidForm();

            expect(mutateFn).toHaveBeenCalledWith({ username, password });
        })
        it('should display the loading text while the login request is pending', () => {
            mockUseLoginUser({ isPending: true });

            renderWithQueryClient();

            const loading = getButton(messages.modal.login.submitting);
            expect(loading).toBeInTheDocument();
        })
        it('should disable the login button while the login request is pending', () => {
            mockUseLoginUser({ isPending: true });

            renderWithQueryClient();

            const button = getButton(messages.modal.login.submitting);
            expect(button).toBeDisabled();
        })
        it('should display an error message if the login request fails', async () => {
            const error = new Error('Invalid username or password.');

            mockUseLoginUser({ mutateAsync: jest.fn().mockRejectedValue(error) });

            renderWithQueryClient();

            submitValidForm();

            await waitFor(() => expect(screen.getByText(error.message)).toBeInTheDocument());
        })
        it('should force close the modal if the login request is successful', async () => {
            const closeModalFn = jest.fn();
            jest.spyOn(Modals, 'useModal').mockReturnValue({ 
                setModal: jest.fn(),
                closeModal: closeModalFn,
            });

            const user = mockUser();
            const mutateFn = jest.fn().mockResolvedValue(user);
            mockUseLoginUser({ 
                mutateAsync: mutateFn,
            });

            renderWithQueryClient();

            submitValidForm();

            await waitFor(() => expect(closeModalFn).toHaveBeenCalled());
        })
        it('should refetch react query getCurrentUser on successful login', async () => {
            const refetchFn = jest.fn();
            jest.spyOn(useRefetchQueries, 'default').mockReturnValue(refetchFn);

            const user = mockUser();

            const mutateFn = jest.fn().mockResolvedValue(user);
            mockUseLoginUser({ mutateAsync: mutateFn });

            renderWithQueryClient();

            submitValidForm();

            await waitFor(() => expect(refetchFn).toHaveBeenCalledWith(['current-user']));
        })
    })
})