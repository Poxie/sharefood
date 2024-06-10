import '@testing-library/jest-dom';
import LoginModal from '@/modals/login';
import { fireEvent, render, screen } from '@/test-utils';
import messages from '@/messages/en.json';
import * as useLoginUser from '@/hooks/users/useLoginUser';
import { UseMutationResult } from '@tanstack/react-query';
import { User } from '@/types';

type MutationOverrides = UseMutationResult<User, Error, {
    username: string;
    password: string;
}>

describe('LoginModal', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    const getFormElements = () => {
        const usernameInput = screen.getByPlaceholderText(messages.modal.login.placeholder.username);
        const passwordInput = screen.getByPlaceholderText(messages.modal.login.placeholder.password);
        const button = screen.getByRole('button', { name: messages.modal.login.submit });

        return { usernameInput, passwordInput, button };
    }
    const updateInput = (input: HTMLElement, value: string) => {
        fireEvent.change(input, { target: { value } });
    }

    describe('Structure and validation', () => {
        beforeEach(() => {
            jest.spyOn(useLoginUser, 'default').mockReturnValue({} as MutationOverrides);
            render(<LoginModal />);
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
            const button = screen.getByRole('button', { name: messages.modal.login.submit });
            expect(button).toBeInTheDocument();
        })
        describe.each([
            { username: '', password: '' },
            { username: '', password: 'password' },
            { username: 'username', password: '' },
        ])('should show an error if the form is submitted with empty fields', ({ username, password }) => {
            it('should show an error', () => {
                const { usernameInput, passwordInput } = getFormElements();
    
                updateInput(usernameInput, username);
                updateInput(passwordInput, password);
    
                const button = screen.getByRole('button', { name: messages.modal.login.submit });
                fireEvent.click(button);
    
                const error = screen.getByText(messages.error.emptyFields);
    
                expect(error).toBeInTheDocument();
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
            mockUseLoginUser({ mutate: mutateFn });

            render(<LoginModal />)

            const { usernameInput, passwordInput } = getFormElements();
    
            const username = 'username';
            const password = 'password';

            updateInput(usernameInput, username);
            updateInput(passwordInput, password);
    
            const button = screen.getByRole('button', { name: messages.modal.login.submit });
            fireEvent.click(button);
    
            expect(mutateFn).toHaveBeenCalledWith({ username, password });
        })
        it('should display the loading text while the login request is pending', () => {
            mockUseLoginUser({ isPending: true });

            render(<LoginModal />);

            const loading = screen.getByRole('button', { name: messages.modal.login.submitting });
            expect(loading).toBeInTheDocument();
        })
        it('should disable the login button while the login request is pending', () => {
            mockUseLoginUser({ isPending: true });

            render(<LoginModal />);

            const button = screen.getByRole('button', { name: messages.modal.login.submitting });
            expect(button).toBeDisabled();
        })
        it('should display an error message if the login request fails', () => {
            const error = new Error('Invalid username or password.');
            mockUseLoginUser({ isError: true, error });

            render(<LoginModal />);

            const errorMessage = screen.getByText(error.message);
            expect(errorMessage).toBeInTheDocument();
        })
    })
})